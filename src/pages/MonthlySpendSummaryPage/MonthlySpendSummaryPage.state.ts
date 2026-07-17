import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCurrentMonth, isMonthInFuture, isMonthValid } from '../../utils/date.utils';
import { useMonthlySummaryQuery } from '../../services/insightsService';
import { mapErrorToUserMessage } from '../../utils/error.utils';
import { MIN_SUPPORTED_MONTH } from '../../constants/insightsConstants';

export const useMonthlySpendSummaryPageState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialMonthFromUrl = searchParams.get('month') || '';
  const defaultMonth = getCurrentMonth();

  const initialMonth = useMemo(() => {
    if (!initialMonthFromUrl) return defaultMonth;
    if (!isMonthValid(initialMonthFromUrl)) return defaultMonth;
    if (isMonthInFuture(initialMonthFromUrl)) return defaultMonth;
    if (initialMonthFromUrl < MIN_SUPPORTED_MONTH) return MIN_SUPPORTED_MONTH;
    return initialMonthFromUrl;
  }, [defaultMonth, initialMonthFromUrl]);

  const [selectedMonth, setSelectedMonthState] = useState<string>(initialMonth);

  const handleSetSelectedMonth = useCallback(
    (month: string) => {
      if (!isMonthValid(month)) return;
      if (isMonthInFuture(month)) return;
      if (month < MIN_SUPPORTED_MONTH) return;
      setSelectedMonthState(month);
      const next = new URLSearchParams(searchParams);
      next.set('month', month);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useMonthlySummaryQuery(selectedMonth);

  const isEmpty = !isLoading && !isError && !!data && data.transactionCount === 0 && data.categories.length === 0;

  const errorMessage = isError ? mapErrorToUserMessage(error).userMessage : undefined;

  return {
    selectedMonth,
    setSelectedMonth: handleSetSelectedMonth,
    summaryData: data ?? null,
    isLoading,
    isError,
    isEmpty,
    errorMessage,
    error,
    refetch
  };
};
