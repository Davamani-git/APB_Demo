export interface AppConfig {
  apiBaseUrl: string;
  useMockApi: boolean;
  defaultCurrency: string;
  minSupportedMonth: string; // YYYY-MM
}

export const appConfig: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://api.example.com',
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
  defaultCurrency: import.meta.env.VITE_DEFAULT_CURRENCY ?? 'USD',
  minSupportedMonth: import.meta.env.VITE_MIN_SUPPORTED_MONTH ?? '2015-01',
};
