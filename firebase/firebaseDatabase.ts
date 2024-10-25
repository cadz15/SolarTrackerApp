import useSolarDataStore, {
  SolarDataInterface,
  SolarTable,
} from "@/store/useSolarDataStore";
import app from "./firebaseConfig";
import { getDatabase, ref, set, onValue, child, get } from "firebase/database";
import { useEffect, useState } from "react";
import calculateAvg from "@/util/calculateAvg";

interface DataObject {
  [key: string]: SolarDataInterface;
}

const timestampToSeconds = (timestamp: string): number => {
  const [hours, minutes, seconds] = timestamp.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const sortObjectByKey = (obj: DataObject): SolarDataInterface[] => {
  const sortedKeys = Object.keys(obj).sort((a, b) => {
    return timestampToSeconds(a) - timestampToSeconds(b);
  });

  const sortedObj: SolarDataInterface[] = [];
  sortedKeys.forEach((key, index) => {
    sortedObj.push({ time: key, ...obj[key] });
  });

  return sortedObj;
};

export const observeDatabase = async () => {
  try {
    const db = getDatabase(app);

    //demo
    const time = Date.now();
    const newDate = new Date(time);
    let timeString =
      String(newDate.getUTCMonth() + 1).padStart(2, "0") +
      "-" +
      String(newDate.getUTCDate()).padStart(2, "0") +
      "-" +
      newDate.getUTCFullYear();

    const solarRealtimeData = ref(db, "solarData/" + timeString);

    const { setCurrentData, currentData, setLastTimeChanged, setOnline } =
      useSolarDataStore();

    if (currentData === null) {
      const snapshot = await get(child(ref(db), "solarData/" + timeString));

      if (snapshot.exists()) {
        const data = snapshot.val();

        const sortedData = sortObjectByKey(data);
        setCurrentData(sortedData);
      }
    } else {
      onValue(solarRealtimeData, (snapshot) => {
        const data = snapshot.val();
        const sortedData = sortObjectByKey(data);

        if (currentData === null) {
          setCurrentData(sortedData);
        } else {
          if (JSON.stringify(sortedData) !== JSON.stringify(currentData)) {
            setCurrentData(sortedData);
            setLastTimeChanged(new Date().toISOString());
            setOnline(true);
          }
        }
      });
    }
  } catch (error) {
    console.log("error!");
  }
};

export const useGetHistories = (shouldFetch: boolean) => {
  const { setSolarHistories } = useSolarDataStore();
  const [isFetchingComplete, setIsFetchingComplete] = useState(false);

  useEffect(() => {
    if (!shouldFetch) return;

    const fetchHistories = async () => {
      try {
        const db = getDatabase(); // Assuming `app` is initialized globally or provided elsewhere
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "solarData/"));

        if (snapshot.exists()) {
          const data = snapshot.val();

          const solarHistories = Object.entries(data).map(
            ([key, value]: [string, any]) => {
              const solarSetData: SolarDataInterface[] = [];

              Object.entries(value).forEach(
                ([entryKey, entryValue]: [string, any]) => {
                  solarSetData.push({
                    batteryVoltage: entryValue.batteryVoltage,
                    solarCurrent: entryValue.solarCurrent,
                    solarVoltage: entryValue.solarVoltage,
                    time: entryKey,
                  });
                }
              );

              const avg = calculateAvg(solarSetData);

              return {
                month: key,
                avgCurrent: avg.averageSolarCurrent,
                avgBattery: avg.averageBatteryVoltage,
                solarData: solarSetData,
              };
            }
          );

          setSolarHistories(solarHistories);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingComplete(true);
      }
    };

    fetchHistories();
  }, [shouldFetch]);

  return { isFetchingComplete };
};
