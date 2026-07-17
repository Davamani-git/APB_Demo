import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { SummaryKpiCards } from '../SummaryKpiCards/SummaryKpiCards';
import { CategoryBreakdownChart } from '../CategoryBreakdownChart/CategoryBreakdownChart';
import { LoadingState } from '../../feedback/LoadingState';
import { ErrorState } from '../../feedback/ErrorState';
import { EmptyState } from '../../feedback/EmptyState';
import type { MonthlySummary } from '../../../models/insights';
import { featureFlags } from '../../../config/featureFlags';

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
  onRetry,
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message={errorMessage ?? 'Unable to load spending summary.'} onRetry={onRetry} />;
  }

  if (isEmpty || !data) {
    return (
      <EmptyState
        title="No spending data available for this month"
        description="There are no posted transactions for the selected month."
      />
    );
  }

  const { totalSpend, transactionCount, averageTransactionAmount, currency, categories } = data;

  const showCategoryChart = featureFlags.enableCategoryBreakdown && categories.length > 0;

  return (
    <Box aria-label="Monthly spending summary" role="region">
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
            Monthly Summary
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <SummaryKpiCards
            totalSpend={totalSpend}
            transactionCount={transactionCount}
            averageTransactionAmount={averageTransactionAmount ?? undefined}
            currency={currency}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {showCategoryChart ? (
          <Grid item xs={12} md={8}>
            <CategoryBreakdownChart categories={categories} />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Category breakdown unavailable
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Category-level insights are currently unavailable for this month.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
