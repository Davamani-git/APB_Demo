export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const FEATURE_FLAGS = {
  monthlyInsightsDashboard: true
};

export const CURRENT_MONTH = (() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
})();

export const MIN_ALLOWED_MONTH = (() => {
  const now = new Date();
  now.setMonth(now.getMonth() - 35);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
})();
