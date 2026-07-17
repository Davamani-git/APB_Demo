import { useQuery } from '@tanstack/react-query';
import { getMonthlySpendSummary } from '../api/insightsApi';
import { MonthlySummary, MonthlySummaryDto } from '../models/insights';

const mapMonthlySummaryDtoToDomain = (dto: MonthlySummaryDto): MonthlySummary => {
  return {
    month: dto.month,
    currency: dto.currency,
    totalSpend: dto.totalSpend,
    transactionCount: dto.transactionCount,
    averageTransactionAmount: dto.averageTransactionAmount ?? null,
    categories: (dto.categories ?? []).map((c) => ({
      id: c.categoryId,
      name: c.categoryName,
      amount: c.amount,
      percentage: c.percentage,
      color: undefined,
      currency: dto.currency
    })),
    metadata: dto.metadata
      ? {
          isPrecomputed: dto.metadata.isPrecomputed,
          dataSource: dto.metadata.dataSource,
          generatedAt: new Date(dto.metadata.generatedAt),
          partial: dto.metadata.partial
        }
      : null
  };
};

export const useMonthlySummaryQuery = (month: string) => {
  return useQuery({
    queryKey: ['monthlySummary', month],
    queryFn: async () => {
      const dto = await getMonthlySpendSummary(month);
      return mapMonthlySummaryDtoToDomain(dto);
    },
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
};

export { mapMonthlySummaryDtoToDomain };
