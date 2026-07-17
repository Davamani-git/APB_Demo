import { useQuery } from '@tanstack/react-query';
import { getMonthlySpendSummary } from '../api/insightsApi';
import type { MonthlySummary, MonthlySummaryDto } from '../models/insights';
import { mapErrorToDisplay } from '../utils/error.utils';

const QUERY_KEY = 'monthlySummary';

export const mapMonthlySummaryDtoToDomain = (dto: MonthlySummaryDto): MonthlySummary => {
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
    })),
    metadata: dto.metadata
      ? {
          isPrecomputed: dto.metadata.isPrecomputed,
          dataSource: dto.metadata.dataSource,
          generatedAt: new Date(dto.metadata.generatedAt),
          partial: dto.metadata.partial,
        }
      : null,
  };
};

export const useMonthlySummaryQuery = (month: string) => {
  return useQuery<{ data: MonthlySummary; isEmpty: boolean; errorMessage?: string }, Error>({
    queryKey: [QUERY_KEY, month],
    queryFn: async () => {
      const dto: MonthlySummaryDto = await getMonthlySpendSummary(month);
      const mapped = mapMonthlySummaryDtoToDomain(dto);
      const isEmpty = mapped.transactionCount === 0 && mapped.categories.length === 0;
      return { data: mapped, isEmpty };
    },
    select: (result) => result,
    retry: (failureCount, error) => {
      const { code } = mapErrorToDisplay(error);
      if (code === 'CONSENT_REQUIRED' || code === 'ACCESS_DENIED') {
        return false;
      }
      return failureCount < 2;
    },
  });
};
