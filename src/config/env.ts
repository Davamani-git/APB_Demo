interface AppEnvConfig {
  apiBaseUrl: string;
  useMockApi: boolean;
  minMonth: string;
  maxMonth: string;
}

export const envConfig: AppEnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  useMockApi: (import.meta.env.VITE_USE_MOCK_API ?? "true") === "true",
  minMonth: import.meta.env.VITE_MIN_MONTH ?? "2023-01",
  maxMonth: import.meta.env.VITE_MAX_MONTH ?? "2026-12"
};
