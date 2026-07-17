import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import SummaryKpiCards from '../SummaryKpiCards/SummaryKpiCards';
import CategoryBreakdownChart from '../CategoryBreakdownChart/CategoryBreakdownChart';
import LoadingState from '../../feedback/LoadingState';
import ErrorState from '../../feedback/ErrorState';
import EmptyState from '../../feedback/EmptyState';
import { MonthlySummary } from '../../../models/insights';
import { featureFlags } from '../../../config/featureFlags';

export interface MonthlySpendSummaryViewProps {
  data: MonthlySummary | null;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

const MonthlySpendSummaryView: React.FC<MonthlySpendSummaryViewProps> = ({
  data,
  isLoading,
  isError,
  isEmpty,
  errorMessage,
  onRetry
}) => {
  if (isLoading) {
    return <LoadingState variant="cards-and-chart" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load monthly summary"
        message={errorMessage ?? 'We are unable to load your summary right now. Please try again.'}
        onRetry={onRetry}
      />
    );
  }

  if (!data || isEmpty) {
    return (
      <EmptyState
        title="No spending data available"
        description="There is no spending activity for the selected month. Try selecting a different month."
      />
    );
  }

  const hasCategories = featureFlags.enableCategoryBreakdown && data.categories && data.categories.length > 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Monthly credit card spend summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review your total monthly spend, transaction activity, and category breakdown at a glance.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={hasCategories ? 6 : 12}>
          <SummaryKpiCards
            totalSpend={data.totalSpend}
            transactionCount={data.transactionCount}
            averageTransactionAmount={data.averageTransactionAmount}
            currency={data.currency}
          />
        </Grid>
        {hasCategories && (
          <Grid item xs={12} md={6}>
            <CategoryBreakdownChart categories={data.categories} />
          </Grid>
        )}
      </Grid>
      {!hasCategories && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Category breakdown is currently unavailable for this month. You can still review your high-level spending KPIs above.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MonthlySpendSummaryView;
