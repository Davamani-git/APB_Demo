import { appConfig } from '../config/appConfig';

export const MIN_SUPPORTED_MONTH = appConfig.minSupportedMonth;

export const INSIGHTS_ROUTE = '/insights/monthly';

export const KPI_LABELS = {
  totalSpend: 'Total Spend',
  transactionCount: 'Number of Transactions',
  averageTransactionAmount: 'Average Transaction Amount'
} as const;
