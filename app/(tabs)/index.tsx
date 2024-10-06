import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TodayLineChart from "@/components/chart/TodayLineChart";
import Feather from "@expo/vector-icons/Feather";
import app from "@/firebase/firebaseConfig";

import { getDatabase, ref, set, onValue, get, child } from "firebase/database";
import { observeDatabase, sortObjectByKey } from "@/firebase/firebaseDatabase";
import useSolarDataStore from "@/store/useSolarDataStore";
import { useEffect, useState } from "react";
import batteryPercent from "@/util/batteryPercent";
import useCheckIdle from "@/hooks/useCheckIdle";
import { useIsFocused } from "@react-navigation/native";

export default function TabOneScreen() {
  const [solarCurrent, setSolarCurrent] = useState<String>("-");
  const [solarVoltage, setSolarVoltage] = useState<String>("-");
  const [batteryVoltage, setBatteryVoltage] = useState<String>("-");

  const isFocused = useIsFocused();

  const { currentData, isOnline, batterySetting, setBatterySetting } =
    useSolarDataStore();
  const db = getDatabase(app);

  const handleRefreshDevice = async () => {
    //demo data
    const time = Date.now();
    //convert epoch time to local date
    const newDate = new Date(time);
    let timeString =
      String(newDate.getUTCMonth() + 1).padStart(2, "0") +
      "-" +
      String(newDate.getUTCDate()).padStart(2, "0") +
      "-" +
      newDate.getUTCFullYear() +
      "/" +
      String(newDate.getUTCHours()).padStart(2, "0") +
      ":" +
      String(newDate.getUTCMinutes()).padStart(2, "0") +
      ":" +
      String(newDate.getUTCSeconds()).padStart(2, "0");

    await set(ref(db, "solarData/" + timeString), {
      solarCurrent: `${Math.floor(Math.random() * 300) + 150}Watts`,
      solarVoltage: `${Math.floor(Math.random() * 10) + 3}V`,
      batteryVoltage: `${Math.floor(Math.random() * 12.7) + 1}V`,
    });
  };

  const fetchSettings = async () => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "solarSetting/"));

      if (snapshot.exists()) {
        const data = snapshot.val();

        setBatterySetting(data);
      }
    } catch (error) {}
  };

  observeDatabase();

  useEffect(() => {
    if (currentData !== null) {
      let latestData = currentData[currentData?.length - 1];

      setSolarVoltage(latestData.solarVoltage);
      setSolarCurrent(latestData.solarCurrent);
      setBatteryVoltage(latestData.batteryVoltage);
    }
  }, [currentData]);

  useCheckIdle();

  useEffect(() => {
    fetchSettings();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "transparent",
          flexDirection: "row",
          gap: 5,
        }}
      >
        {isOnline ? (
          <Text style={styles.header}>
            <FontAwesome name="circle" size={24} color="#46c34c" /> Device
            Online
          </Text>
        ) : (
          <Text style={styles.header}>
            <FontAwesome name="circle" size={24} color="#c83a4a" /> Device
            Offline
          </Text>
        )}

        {/* <TouchableOpacity
          style={{
            height: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleRefreshDevice}
        >
          <Feather name="refresh-ccw" size={18} color="white" />
        </TouchableOpacity> */}
      </View>

      <ScrollView>
        <View style={styles.dataContainer}>
          <View style={styles.leftCircledContainer}>
            <FontAwesome5 name="solar-panel" size={60} color="#005f71" />
            <View
              style={{
                backgroundColor: "transparent",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.circledContainerText}>
                Solar Panel Power Generated
              </Text>
              <Text style={{ fontSize: 16 }}>
                Watt:{" "}
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  {solarCurrent}
                </Text>
              </Text>
              <Text style={{ fontSize: 16 }}>
                Voltage:{" "}
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  {solarVoltage}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.rightCircledContainer}>
            <View
              style={{
                backgroundColor: "transparent",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.circledContainerText}>
                Battery Percentage
              </Text>
              <Text style={{ fontSize: 16 }}>
                Voltage:{" "}
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  {batteryVoltage}
                </Text>
              </Text>
              <Text style={{ fontSize: 16 }}>
                Percentage:{" "}
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  {Number.isNaN(
                    batteryPercent(
                      parseFloat(batteryVoltage.toString()),
                      batterySetting
                    )
                  )
                    ? "0"
                    : batteryPercent(
                        parseFloat(batteryVoltage.toString()),
                        batterySetting
                      )}
                  %
                </Text>
              </Text>
            </View>
            <MaterialCommunityIcons
              name="battery-high"
              size={80}
              color="#005f71"
            />
          </View>
          {currentData !== null ? (
            <TodayLineChart style={{ flex: 0.6, overflow: "scroll" }} />
          ) : (
            <>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginLeft: 20,
                  color: "red",
                }}
              >
                No Data!
              </Text>
              <View
                style={{
                  height: 250,
                  marginBottom: 40,
                  backgroundColor: "#808080",
                  borderRadius: 10,
                }}
              ></View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009FBD",
    paddingTop: "25%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dataContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    borderStyle: "solid",
    padding: 20,
    paddingTop: 50,
    paddingBottom: 60,
    gap: 20,
  },
  circledContainerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 20,
  },
  leftCircledContainer: {
    flex: 0.15,
    padding: 20,
    flexDirection: "row",
    borderWidth: 3,
    backgroundColor: "#99d8e4",
    borderTopLeftRadius: 60,
    borderBottomLeftRadius: 60,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: "#009FBD",
    overflow: "hidden",
    alignItems: "center",
  },
  rightCircledContainer: {
    flex: 0.15,
    flexDirection: "row",
    padding: 20,
    borderWidth: 3,
    backgroundColor: "#99d8e4",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
    borderColor: "#009FBD",
    overflow: "hidden",
  },
});
