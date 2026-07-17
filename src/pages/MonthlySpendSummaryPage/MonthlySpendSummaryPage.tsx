import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout/DashboardLayout';
import { MonthlySpendSummaryView } from '../../components/insights/MonthlySpendSummaryView/MonthlySpendSummaryView';
import { MonthlySpendSummaryPageStateProvider, useMonthlySpendSummaryPageStateContext } from './MonthlySpendSummaryPage.state';

const MonthlySpendSummaryPageInner: React.FC = () => {
  const { summaryData, isLoading, isError, isEmpty, errorMessage, refetch } =
    useMonthlySpendSummaryPageStateContext();

  return (
    <DashboardLayout>
      <MonthlySpendSummaryView
        data={summaryData}
        isLoading={isLoading}
        isError={isError}
        isEmpty={isEmpty}
        errorMessage={errorMessage}
        onRetry={refetch}
      />
    </DashboardLayout>
  );
};

export const MonthlySpendSummaryPage: React.FC = () => {
  return (
    <MonthlySpendSummaryPageStateProvider>
      <MonthlySpendSummaryPageInner />
    </MonthlySpendSummaryPageStateProvider>
  );
};
