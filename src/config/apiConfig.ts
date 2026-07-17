import { envConfig } from "./env";

export const API_ENDPOINTS = {
  monthlySummary: `${envConfig.apiBaseUrl}/insights/monthly-summary`
} as const;
