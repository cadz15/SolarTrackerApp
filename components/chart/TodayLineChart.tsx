import { View, Text, ViewProps, Dimensions, ScrollView } from "react-native";
import React, { FC, useEffect, useState } from "react";
import useSolarDataStore from "@/store/useSolarDataStore";
import { LineChart, lineDataItem } from "react-native-gifted-charts";

interface LineGraphDataInterface {
  value: number;
  labelComponent: FC;
  customDataPoint: FC;
}

const TodayLineChart = ({ style, ...porps }: ViewProps) => {
  const { currentData } = useSolarDataStore();

  const dPoint = () => {
    return (
      <View
        style={{
          width: 14,
          height: 14,
          backgroundColor: "white",
          borderWidth: 3,
          borderRadius: 7,
          borderColor: "#07BAD1",
        }}
      />
    );
  };

  const [lastTimeRecorded, setLastTimeRecorded] = useState<String>("");
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);
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
      if (currentData !== null) {
        let chartData: lineDataItem[] = [];

        currentData.forEach((data) => {
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
  }, [currentData]);

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
        Today's Solar Current Data
      </Text>

      {/* <ScrollView
        horizontal={true}
        contentOffset={{ x: 10000, y: 0 }} // i needed the scrolling to start from the end not the start
        showsHorizontalScrollIndicator={false} // to hide scroll bar
      >
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [
              {
                data: chartData,
              },
            ],
          }}
          width={Dimensions.get("window").width + chartData.length * 40} // from react-native
          height={220}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundGradientFrom: "#003366", // Dark blue
            backgroundGradientTo: "#004080", // Slightly lighter dark blue
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Bright blue for lines and grid
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White color for labels
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#3399ff", // Light blue for dots
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </ScrollView> */}

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

export default TodayLineChart;
