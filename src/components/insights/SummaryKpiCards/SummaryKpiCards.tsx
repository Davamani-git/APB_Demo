import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { formatCurrency, formatNumber } from '../../../utils/numberFormat.utils';
import { KPI_LABELS } from '../../../constants/insightsConstants';

interface SummaryKpiCardsProps {
  totalSpend: number;
  transactionCount: number;
  averageTransactionAmount?: number | null;
  currency: string;
}

export const SummaryKpiCards: React.FC<SummaryKpiCardsProps> = ({
  totalSpend,
  transactionCount,
  averageTransactionAmount,
  currency
}) => {
  return (
    <Grid container spacing={2} aria-label="Monthly summary KPIs">
      <Grid item xs={12} sm={6} md={4}>
        <Card elevation={2} sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {KPI_LABELS.totalSpend}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {formatCurrency(totalSpend, currency)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card elevation={2} sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {KPI_LABELS.transactionCount}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {formatNumber(transactionCount)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {typeof averageTransactionAmount === 'number' && (
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {KPI_LABELS.averageTransactionAmount}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {formatCurrency(averageTransactionAmount, currency)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};
