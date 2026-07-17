import { create } from 'zustand';
import { ConsentStatus } from '@models/common';

interface SessionState {
  userId: string | null;
  roles: string[];
  consentStatus: ConsentStatus | null;
  setConsentStatus: (status: ConsentStatus) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  userId: null,
  roles: [],
  consentStatus: null,
  setConsentStatus: (consentStatus) => set({ consentStatus })
}));
