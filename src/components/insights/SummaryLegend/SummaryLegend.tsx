import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { CategoryBreakdownItem } from '../../../models/insights';

interface SummaryLegendProps {
  categories: CategoryBreakdownItem[];
}

export const SummaryLegend: React.FC<SummaryLegendProps> = ({ categories }) => {
  return (
    <Box aria-label="Category legend">
      <List dense>
        {categories.map(category => (
          <ListItem key={category.id} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '999px',
                  bgcolor: category.color ?? '#64748b'
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={category.name}
              secondary={`${category.percentage.toFixed(1)}%`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
