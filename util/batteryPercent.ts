import { SolarBatterySetting } from "@/store/useSolarDataStore";

export default (voltage: number, batterySetting: SolarBatterySetting) => {
  const fullChargeVoltage =
    parseFloat(batterySetting.chargedVoltage) -
    parseFloat(batterySetting.lowBatteryVoltage);
  const currentVoltage = voltage - parseFloat(batterySetting.lowBatteryVoltage);

  let percentage = (currentVoltage / fullChargeVoltage) * 100;

  percentage = Math.max(0, Math.min(100, percentage));

  return percentage.toFixed(2);
};
