import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import batteryPercent from "@/util/batteryPercent";

const HistoryListItem = (props: any) => {
  console.log(props);

  return (
    <Link href={`/History?month=${props?.data?.month}`} asChild>
      <TouchableOpacity style={styles.button}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={styles.textHeader}>
                ⚡️{props?.data?.avgCurrent ?? "-"}{" "}
              </Text>
              <Text style={styles.textHeader}>
                🔋
                {Number.isNaN(
                  batteryPercent(parseFloat(props?.data?.avgBattery))
                )
                  ? "0"
                  : batteryPercent(parseFloat(props?.data?.avgBattery))}
                %
              </Text>
            </View>
            <Text style={{ marginTop: 10, fontSize: 16, color: "gray" }}>
              {props?.data?.month}
            </Text>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Entypo name="chevron-thin-right" size={24} color="black" />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#dbdcdd",
    padding: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  textHeader: { color: "black", fontSize: 22, fontWeight: "bold" },
});

export default HistoryListItem;
