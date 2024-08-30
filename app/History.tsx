import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import HistoryLineChart from "@/components/chart/HistoryLineChart";
import useSolarDataStore from "@/store/useSolarDataStore";
import batteryPercent from "@/util/batteryPercent";

export default function ModalScreen() {
  const { month } = useLocalSearchParams();

  const { solarHistories } = useSolarDataStore();

  const history = solarHistories?.filter((data) => {
    return data.month === month;
  })[0];

  console.log(month, history);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 20, paddingTop: 30 }}>
        <View style={styles.widget}>
          <Text style={styles.widgetTitle}>⚡️ Solar Wattage</Text>
          <Text style={styles.widgetBodyText}>{history?.avgCurrent}</Text>
        </View>
        <View style={styles.widget}>
          <Text style={styles.widgetTitle}>🔋 Battery</Text>
          <Text style={styles.widgetBodyText}>
            {Number.isNaN(
              batteryPercent(parseFloat(history?.avgBattery?.toString()))
            )
              ? "0"
              : batteryPercent(parseFloat(history?.avgBattery?.toString()))}
            %
          </Text>
        </View>
      </View>

      <View style={styles.widgetChartContainer}>
        <HistoryLineChart
          data={history?.solarData}
          month={history?.month}
          style={{ overflow: "scroll" }}
        />
      </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#dbdcdd",
    gap: 10,
    padding: 20,
  },
  widget: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderColor: "#fafbfb",
    borderWidth: 1,
    gap: 10,
  },
  widgetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0594a7",
  },
  widgetBodyText: { fontSize: 34, fontWeight: "bold", color: "#036774" },
  widgetChartContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderColor: "#fafbfb",
    borderWidth: 1,
    margin: 0,
  },
});
