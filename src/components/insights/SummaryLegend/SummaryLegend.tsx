import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import type { CategoryBreakdownItem } from '../../../models/insights';
import { formatCurrency } from '../../../utils/numberFormat.utils';

interface SummaryLegendProps {
  categories: CategoryBreakdownItem[];
}

export const SummaryLegend: React.FC<SummaryLegendProps> = ({ categories }) => {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
        Category legend
      </Typography>
      <List dense aria-label="Category legend">
        {categories.map((cat) => (
          <ListItem key={cat.id} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '999px',
                  bgcolor: cat.color ?? 'grey.400',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={cat.name}
              secondary={`${formatCurrency(cat.amount, 'USD')} · ${cat.percentage.toFixed(1)}%`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
