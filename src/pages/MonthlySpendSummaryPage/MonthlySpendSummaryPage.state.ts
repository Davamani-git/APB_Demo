import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMonthlySummaryQuery } from '../../services/insightsService';
import { getCurrentMonth, isMonthValid, isMonthInFuture, isMonthBeforeMin } from '../../utils/date.utils';
import { MIN_SUPPORTED_MONTH } from '../../constants/insightsConstants';
import { mapErrorToDisplay } from '../../utils/error.utils';

export const useMonthlySpendSummaryPageState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlMonth = searchParams.get('month');

  const resolveInitialMonth = (): string => {
    if (urlMonth && isMonthValid(urlMonth) && !isMonthInFuture(urlMonth) && !isMonthBeforeMin(urlMonth, MIN_SUPPORTED_MONTH)) {
      return urlMonth;
    }
    const current = getCurrentMonth();
    if (isMonthBeforeMin(current, MIN_SUPPORTED_MONTH)) {
      return MIN_SUPPORTED_MONTH;
    }
    return current;
  };

  const [selectedMonth, setSelectedMonthState] = useState<string>(resolveInitialMonth);

  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('month', selectedMonth);
      return params;
    });
  }, [selectedMonth, setSearchParams]);

  const query = useMonthlySummaryQuery(selectedMonth);

  const { data, isLoading, isError, refetch, error } = query;

  const errorDisplay = isError && error ? mapErrorToDisplay(error) : undefined;

  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonthState(month);
  }, []);

  return {
    selectedMonth,
    setSelectedMonth: handleMonthChange,
    summaryData: data?.data ?? null,
    isLoading,
    isError,
    isEmpty: data?.isEmpty ?? false,
    errorMessage: errorDisplay?.message,
    refetch,
  };
};
