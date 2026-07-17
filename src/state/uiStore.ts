import { create } from 'zustand';

interface UIState {
  selectedMonth: string | null;
  setSelectedMonth: (month: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedMonth: null,
  setSelectedMonth: (month: string) => set({ selectedMonth: month })
}));
