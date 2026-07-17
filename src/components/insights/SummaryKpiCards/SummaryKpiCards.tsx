import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { formatCurrency, formatNumber } from '../../../utils/numberFormat.utils';
import { KPI_LABELS } from '../../../constants/insightsConstants';

export interface SummaryKpiCardsProps {
  totalSpend: number;
  transactionCount: number;
  averageTransactionAmount?: number | null;
  currency: string;
}

const SummaryKpiCards: React.FC<SummaryKpiCardsProps> = ({
  totalSpend,
  transactionCount,
  averageTransactionAmount,
  currency
}) => {
  const kpis = [
    {
      key: 'totalSpend',
      label: KPI_LABELS.totalSpend,
      value: formatCurrency(totalSpend, currency)
    },
    {
      key: 'transactionCount',
      label: KPI_LABELS.transactionCount,
      value: formatNumber(transactionCount)
    }
  ];

  if (averageTransactionAmount != null) {
    kpis.push({
      key: 'averageTransactionAmount',
      label: KPI_LABELS.averageTransactionAmount,
      value: formatCurrency(averageTransactionAmount, currency)
    });
  }

  return (
    <Grid container spacing={2}>
      {kpis.map((kpi) => (
        <Grid item xs={12} sm={6} md={4} key={kpi.key}>
          <Card
            elevation={1}
            sx={{
              height: '100%',
              borderRadius: 2,
              bgcolor: 'background.paper',
              transition: 'box-shadow 0.2s, transform 0.2s',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {kpi.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {kpi.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryKpiCards;
