import { View, Text, ViewProps } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart, lineDataItem } from "react-native-gifted-charts";
import { SolarDataInterface } from "@/store/useSolarDataStore";

const HistoryLineChart = ({
  data,
  month,
  style,
  ...porps
}: ViewProps & { data: any; month: String }) => {
  const [lastTimeRecorded, setLastTimeRecorded] = useState<String>("");
  const [lineGraphData, setLineGraphData] = useState<lineDataItem[]>([]);

  const removeLastColon = (str: String) => {
    // Find the index of the last colon
    const lastColonIndex = str.lastIndexOf(":");

    if (lastColonIndex === -1) {
      return str;
    }
    return str.substring(0, lastColonIndex);
  };

  useEffect(() => {
    try {
      if (data !== null) {
        let chartData: lineDataItem[] = [];

        data.forEach((data) => {
          let currentTime = removeLastColon(data.time ?? "");
          let lastTime: string = "";
          if (currentTime !== lastTime) {
            lastTime = currentTime.toString();
            setLastTimeRecorded(currentTime);
          }

          chartData.push({
            value: parseFloat(data.solarCurrent.toString()),
            dataPointText: data.solarCurrent.toString(),
            label: lastTime,
          });
        });

        setLineGraphData(chartData);
      }
    } catch (error) {
      console.log("error");
    }
  }, [data]);

  return (
    <View style={style}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          marginLeft: 20,
          color: "#0594a7",
        }}
      >
        {month} Solar's Data
      </Text>
      <LineChart
        thickness={3}
        color="#07BAD1"
        maxValue={500}
        noOfSections={5}
        animateOnDataChange
        animationDuration={1000}
        onDataChangeAnimationDuration={300}
        areaChart
        yAxisTextStyle={{ color: "lightgray" }}
        data={lineGraphData}
        startFillColor={"rgb(84,219,234)"}
        endFillColor={"rgb(84,219,234)"}
        startOpacity={0.4}
        endOpacity={0.1}
        spacing={40}
        backgroundColor="#1A3461"
        rulesColor="gray"
        rulesType="solid"
        initialSpacing={10}
        yAxisColor="lightgray"
        xAxisColor="lightgray"
      />
    </View>
  );
};

export default HistoryLineChart;
