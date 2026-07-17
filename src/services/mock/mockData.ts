import { MonthlySummaryResponse } from "../../models/insights";

export const MOCK_MONTHLY_SUMMARIES: Record<string, MonthlySummaryResponse> = {
  "2026-05": {
    month: "2026-05",
    currency: "USD",
    totalSpend: 1234.56,
    transactionCount: 42,
    categories: [
      { category: "Groceries", amount: 400.25, transactionCount: 10, percentage: 32.43 },
      { category: "Travel", amount: 300, transactionCount: 5, percentage: 24.32 },
      { category: "Other", amount: 534.31, transactionCount: 27, percentage: 43.25 }
    ],
    metadata: {
      generatedAt: "2026-05-31T23:59:59Z",
      dataSource: "mock",
      hasCompleteData: true,
      consentStatus: "granted"
    }
  }
};
