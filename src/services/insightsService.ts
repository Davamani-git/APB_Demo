import { useQuery } from '@tanstack/react-query';
import { getMonthlySpendSummary } from '../api/insightsApi';
import { MonthlySummary, MonthlySummaryDto } from '../models/insights';
import { mapErrorToUserMessage } from '../utils/error.utils';

export const MONTHLY_SUMMARY_QUERY_KEY = 'monthlySummary';

export function mapMonthlySummaryDtoToDomain(dto: MonthlySummaryDto): MonthlySummary {
  return {
    month: dto.month,
    currency: dto.currency,
    totalSpend: dto.totalSpend,
    transactionCount: dto.transactionCount,
    averageTransactionAmount:
      typeof dto.averageTransactionAmount === 'number' ? dto.averageTransactionAmount : null,
    categories:
      dto.categories?.map((c, index) => ({
        id: c.categoryId,
        name: c.categoryName,
        amount: c.amount,
        percentage: c.percentage,
        color: undefined,
        order: index
      })) ?? [],
    metadata: dto.metadata
      ? {
          isPrecomputed: dto.metadata.isPrecomputed,
          dataSource: dto.metadata.dataSource,
          generatedAt: new Date(dto.metadata.generatedAt),
          partial: dto.metadata.partial
        }
      : null
  };
}

export function useMonthlySummaryQuery(month: string) {
  return useQuery<{ data: MonthlySummary }, Error, MonthlySummary, [string, string]>(
    [MONTHLY_SUMMARY_QUERY_KEY, month],
    async () => {
      const dto = await getMonthlySpendSummary(month);
      const domain = mapMonthlySummaryDtoToDomain(dto);
      if (
        (domain.totalSpend == null || Number.isNaN(domain.totalSpend)) &&
        (domain.transactionCount == null || Number.isNaN(domain.transactionCount))
      ) {
        throw new Error('Invalid summary data received');
      }
      return { data: domain };
    },
    {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      select: result => result.data,
      meta: { month }
    }
  );
}

export function mapError(error: unknown): { userMessage: string } {
  return mapErrorToUserMessage(error);
}
