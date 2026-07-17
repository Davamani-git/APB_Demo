export interface CategorySpendBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlySummary {
  month: string;
  currency: string;
  totalSpend: number;
  transactionCount: number;
  averageTransactionAmount?: number;
  categories: CategorySpendBreakdown[];
  isPartial: boolean;
}
