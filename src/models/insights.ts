export interface CategorySummary {
  category: string;
  amount: number;
  transactionCount: number;
  percentage: number;
}

export interface SummaryMetadata {
  generatedAt: string;
  dataSource: "ISD" | "CCD" | "mock";
  hasCompleteData: boolean;
  consentStatus: "granted" | "revoked" | "unknown";
}

export interface MonthlySummaryResponse {
  month: string;
  currency: string;
  totalSpend: number;
  transactionCount: number;
  categories: CategorySummary[];
  metadata: SummaryMetadata;
}
