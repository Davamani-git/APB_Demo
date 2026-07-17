import React, { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMonthlySummaryQuery, mapError } from '../../services/insightsService';
import { getCurrentMonth, isMonthValid, isMonthInFuture } from '../../utils/date.utils';
import { MIN_SUPPORTED_MONTH } from '../../constants/insightsConstants';

interface MonthlySpendSummaryPageState {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  summaryData: any;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  errorMessage?: string;
  refetch: () => void;
}

const MonthlySpendSummaryPageStateContext = createContext<MonthlySpendSummaryPageState | undefined>(
  undefined
);

export const useMonthlySpendSummaryPageStateContext = (): MonthlySpendSummaryPageState => {
  const ctx = useContext(MonthlySpendSummaryPageStateContext);
  if (!ctx) {
    throw new Error(
      'useMonthlySpendSummaryPageStateContext must be used within MonthlySpendSummaryPageStateProvider'
    );
  }
  return ctx;
};

interface ProviderProps {
  children: React.ReactNode;
}

export const MonthlySpendSummaryPageStateProvider: React.FC<ProviderProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawMonth = searchParams.get('month');
  const defaultMonth = getCurrentMonth();

  let initialMonth = rawMonth && isMonthValid(rawMonth) ? rawMonth : defaultMonth;

  if (isMonthInFuture(initialMonth)) {
    initialMonth = defaultMonth;
  }

  if (initialMonth < MIN_SUPPORTED_MONTH) {
    initialMonth = MIN_SUPPORTED_MONTH;
  }

  const [month, setMonthState] = React.useState(initialMonth);

  const setSelectedMonth = (nextMonth: string) => {
    setMonthState(nextMonth);
    const next = new URLSearchParams(searchParams);
    next.set('month', nextMonth);
    setSearchParams(next, { replace: true });
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useMonthlySummaryQuery(month);

  const empty = !isLoading && !isError && data && data.transactionCount === 0 && data.categories.length === 0;

  const errorMessage = isError ? mapError(error).userMessage : undefined;

  const value = useMemo<MonthlySpendSummaryPageState>(
    () => ({
      selectedMonth: month,
      setSelectedMonth,
      summaryData: data ?? null,
      isLoading,
      isError,
      isEmpty: empty,
      errorMessage,
      refetch
    }),
    [month, setSelectedMonth, data, isLoading, isError, empty, errorMessage, refetch]
  );

  return (
    <MonthlySpendSummaryPageStateContext.Provider value={value}>
      {children}
    </MonthlySpendSummaryPageStateContext.Provider>
  );
};
