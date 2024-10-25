import { create } from "zustand";

export interface SolarDataInterface {
  batteryVoltage: String;
  solarCurrent: String;
  solarVoltage: String;
  time?: String;
}

export interface SolarTable {
  month: String;
  avgCurrent?: String;
  avgBattery?: String;
  solarData: SolarDataInterface[] | null;
}

export interface SolarBatterySetting {
  chargedVoltage: string;
  lowBatteryVoltage: string;
  cutOffPercent: string;
  email: string;
}

export interface SolarDataStore {
  currentData: SolarDataInterface[] | null;
  solarHistories: SolarTable[] | null;
  isOnline: boolean;
  lastTimeChanged: String;
  password: string;
  batterySetting: SolarBatterySetting;
  isLogin: boolean;
  setSolarHistories: (solarHistory: SolarTable[]) => void;
  setCurrentData: (solarData: SolarDataInterface[]) => void;
  setLastTimeChanged: (timeChanged: String) => void;
  setOnline: (online: boolean) => void;
  setBatterySetting: (batterySetting: SolarBatterySetting) => void;
  setLogin: (logedin: boolean) => void;
  setPassword: (passwordString: string) => void;
}

const useSolarDataStore = create<SolarDataStore>(
  (set): SolarDataStore => ({
    currentData: null,
    solarHistories: null,
    isOnline: false,
    isLogin: false,
    password: "",
    lastTimeChanged: "",
    batterySetting: {
      chargedVoltage: "13.7",
      lowBatteryVoltage: "10.5",
      cutOffPercent: "0",
      email: "",
    },
    setSolarHistories: (solarHistory: SolarTable[]) =>
      set({
        solarHistories: solarHistory,
      }),
    setCurrentData: (solarData: SolarDataInterface[]) =>
      set({
        currentData: solarData,
      }),
    setLastTimeChanged: (timeChanged: String) =>
      set({ lastTimeChanged: timeChanged }),
    setOnline: (online: boolean) => set({ isOnline: online }),
    setBatterySetting: (batterySetting: SolarBatterySetting) =>
      set({ batterySetting }),
    setLogin: (logedin: boolean) => set({ isLogin: logedin }),
    setPassword: (passwordString: string) => set({ password: passwordString }),
  })
);

export default useSolarDataStore;
