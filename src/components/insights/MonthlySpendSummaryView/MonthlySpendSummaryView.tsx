import React from 'react';
import { Box, Typography } from '@mui/material';
import { MonthlySummary } from '../../../models/insights';
import { SummaryKpiCards } from '../SummaryKpiCards/SummaryKpiCards';
import { CategoryBreakdownChart } from '../CategoryBreakdownChart/CategoryBreakdownChart';
import { LoadingState } from '../../feedback/LoadingState';
import { ErrorState } from '../../feedback/ErrorState';
import { EmptyState } from '../../feedback/EmptyState';
import { ResponsiveContainer } from '../../layout/ResponsiveContainer';

interface MonthlySpendSummaryViewProps {
  data: MonthlySummary | null;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export const MonthlySpendSummaryView: React.FC<MonthlySpendSummaryViewProps> = ({
  data,
  isLoading,
  isError,
  isEmpty,
  errorMessage,
  onRetry
}) => {
  if (isLoading) {
    return (
      <ResponsiveContainer>
        <LoadingState />
      </ResponsiveContainer>
    );
  }

  if (isError) {
    return (
      <ResponsiveContainer>
        <ErrorState
          title="We could not load your monthly summary"
          message={errorMessage ?? 'An unexpected error occurred. Please try again.'}
          onRetry={onRetry}
        />
      </ResponsiveContainer>
    );
  }

  if (isEmpty || !data) {
    return (
      <ResponsiveContainer>
        <EmptyState
          title="No spending data available for this month"
          description="You do not have any posted transactions for the selected month."
        />
      </ResponsiveContainer>
    );
  }

  const { totalSpend, transactionCount, averageTransactionAmount, currency, categories } = data;

  const hasCategories = categories && categories.length > 0;

  return (
    <ResponsiveContainer>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Monthly Spend Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review your total monthly credit card spending and key metrics at a glance.
          </Typography>
        </Box>
        <SummaryKpiCards
          totalSpend={totalSpend}
          transactionCount={transactionCount}
          averageTransactionAmount={averageTransactionAmount}
          currency={currency}
        />
        {hasCategories ? (
          <CategoryBreakdownChart categories={categories} />
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Category breakdown is currently unavailable.
          </Typography>
        )}
      </Box>
    </ResponsiveContainer>
  );
};
