import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { MonthlySpendSummaryView } from '../../components/insights/MonthlySpendSummaryView/MonthlySpendSummaryView';
import { useMonthlySpendSummaryPageState } from './MonthlySpendSummaryPage.state';

export const MonthlySpendSummaryPage: React.FC = () => {
  const {
    selectedMonth,
    setSelectedMonth,
    summaryData,
    isLoading,
    isError,
    isEmpty,
    errorMessage,
    refetch,
  } = useMonthlySpendSummaryPageState();

  return (
    <DashboardLayout selectedMonth={selectedMonth} onMonthChange={setSelectedMonth}>
      <MonthlySpendSummaryView
        data={summaryData}
        isLoading={isLoading}
        isError={isError}
        isEmpty={isEmpty}
        errorMessage={errorMessage}
        onRetry={() => {
          refetch();
        }}
      />
    </DashboardLayout>
  );
};
