export interface MonthlySummaryDto {
  month: string;
  currency: string;
  totalSpend: number;
  transactionCount: number;
  averageTransactionAmount?: number;
  categories?: CategoryBreakdownItemDto[];
  metadata?: MonthlySummaryMetadataDto;
}

export interface CategoryBreakdownItemDto {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface MonthlySummaryMetadataDto {
  isPrecomputed: boolean;
  dataSource: string;
  generatedAt: string;
  partial: boolean;
}

export interface MonthlySummaryMetadata {
  isPrecomputed: boolean;
  dataSource: string;
  generatedAt: Date;
  partial: boolean;
}

export interface CategoryBreakdownItem {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color?: string;
  order?: number;
}

export interface MonthlySummary {
  month: string;
  currency: string;
  totalSpend: number;
  transactionCount: number;
  averageTransactionAmount: number | null;
  categories: CategoryBreakdownItem[];
  metadata: MonthlySummaryMetadata | null;
}
