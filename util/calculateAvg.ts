import { SolarDataInterface } from "@/store/useSolarDataStore";

export default (data: SolarDataInterface[]) => {
  const batteryVoltages = data.map((entry: SolarDataInterface) =>
    parseFloat(entry.batteryVoltage.toString())
  );
  const solarCurrents = data.map((entry: SolarDataInterface) =>
    parseFloat(entry.solarCurrent.toString())
  );

  const average = (arr: any) =>
    arr.reduce((sum: any, value: any) => sum + value, 0) / arr.length;

  return {
    averageBatteryVoltage: average(batteryVoltages).toFixed(2) + "V",
    averageSolarCurrent: average(solarCurrents).toFixed(2) + "Watts",
  };
};
