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

export interface SolarDataStore {
  currentData: SolarDataInterface[] | null;
  solarHistories: SolarTable[] | null;
  isOnline: boolean;
  lastTimeChanged: String;
  setSolarHistories: (solarHistory: SolarTable[]) => void;
  setCurrentData: (solarData: SolarDataInterface[]) => void;
  setLastTimeChanged: (timeChanged: String) => void;
  setOnline: (online: boolean) => void;
}

const useSolarDataStore = create<SolarDataStore>(
  (set): SolarDataStore => ({
    currentData: null,
    solarHistories: null,
    isOnline: false,
    lastTimeChanged: "",
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
  })
);

export default useSolarDataStore;
