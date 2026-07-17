import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '@api/insightsApi';
import { MonthlySummary } from '@models/insights';

export const MONTHLY_SUMMARY_QUERY_KEY = 'monthlySummary';

export function useMonthlySummary(month: string) {
  const query = useQuery<MonthlySummary, Error, MonthlySummary, [string, string]>(
    [MONTHLY_SUMMARY_QUERY_KEY, month],
    () => insightsApi.getMonthlySummary(month),
    {
      enabled: Boolean(month),
      staleTime: 5 * 60 * 1000
    }
  );

  const data = query.data;
  const isPartial = Boolean(data?.isPartial || (data && data.totalSpend > 0 && data.categories.length === 0));

  return {
    ...query,
    isPartial
  };
}
