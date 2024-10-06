import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import HistoryListItem from "@/components/HistoryList/HistoryListItem";
import { useCallback, useEffect, useState } from "react";
import { useGetHistories } from "@/firebase/firebaseDatabase";
import { useIsFocused } from "@react-navigation/native";
import { child, get, getDatabase, ref } from "firebase/database";
import useSolarDataStore, {
  SolarDataInterface,
} from "@/store/useSolarDataStore";
import calculateAvg from "@/util/calculateAvg";

export default function TabTwoScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefeshing, setIsRefeshing] = useState(true);
  const isFocused = useIsFocused();
  const { setSolarHistories, solarHistories } = useSolarDataStore();

  useEffect(() => {
    if (isRefeshing || isFocused) {
      if (!isLoading) {
        setIsLoading(true);

        const fetchHistories = async () => {
          try {
            const db = getDatabase(); // Assuming `app` is initialized globally or provided elsewhere
            const dbRef = ref(db);
            const snapshot = await get(child(dbRef, "solarData/"));

            if (snapshot.exists()) {
              const data = snapshot.val();

              const solarHistories = Object.entries(data)
                .sort()
                .reverse()
                .map(([key, value]: [string, any]) => {
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
                });

              setSolarHistories(solarHistories);
            } else {
              console.log("No data available");
            }
          } catch (error) {
            console.error(error);
          }
        };

        fetchHistories().finally(() => {
          setIsLoading(false);
          setIsRefeshing(false);
        });
      }
    }
  }, [isRefeshing, isFocused]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ScrollView
      style={{
        backgroundColor: "#dbdcdd",
      }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => setIsRefeshing(true)}
        />
      }
    >
      <View style={styles.container}>
        {solarHistories?.map((data, index) => {
          return <HistoryListItem data={data} key={index} />;
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
});
