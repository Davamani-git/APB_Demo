import { create } from "zustand";

interface InsightsState {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export const useInsightsStore = create<InsightsState>((set) => ({
  selectedMonth: "",
  setSelectedMonth: (month) => set({ selectedMonth: month })
}));
