import { create } from "zustand";

interface UiState {
  lastErrorBannerDismissedAt?: string;
  setLastErrorBannerDismissedAt: (isoDate: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  lastErrorBannerDismissedAt: undefined,
  setLastErrorBannerDismissedAt: (isoDate) => set({ lastErrorBannerDismissedAt: isoDate })
}));
