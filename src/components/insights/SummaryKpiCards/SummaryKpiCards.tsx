import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { KPI_LABELS } from '../../../constants/insightsConstants';
import { formatCurrency, formatInteger } from '../../../utils/numberFormat.utils';

interface SummaryKpiCardsProps {
  totalSpend: number;
  transactionCount: number;
  averageTransactionAmount?: number;
  currency: string;
}

export const SummaryKpiCards: React.FC<SummaryKpiCardsProps> = ({
  totalSpend,
  transactionCount,
  averageTransactionAmount,
  currency,
}) => {
  const cards = [
    {
      label: KPI_LABELS.totalSpend,
      value: formatCurrency(totalSpend, currency),
    },
    {
      label: KPI_LABELS.transactionCount,
      value: formatInteger(transactionCount),
    },
  ];

  if (averageTransactionAmount !== undefined) {
    cards.push({
      label: KPI_LABELS.averageTransactionAmount,
      value: formatCurrency(averageTransactionAmount, currency),
    });
  }

  return (
    <Grid container spacing={2} aria-label="Monthly summary KPIs" role="list">
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={4} key={card.label} role="listitem">
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 1,
              transition: 'box-shadow 150ms ease, transform 150ms ease',
              '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {card.label}
              </Typography>
              <Typography variant="h5" component="p" sx={{ fontWeight: 600 }}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
