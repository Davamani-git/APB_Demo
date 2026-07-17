import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { CategoryBreakdownItem } from '../../../models/insights';

export interface SummaryLegendProps {
  categories: CategoryBreakdownItem[];
}

const SummaryLegend: React.FC<SummaryLegendProps> = ({ categories }) => {
  return (
    <Box sx={{ mt: 1 }} aria-label="Category legend">
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={
              <Typography variant="caption">
                {category.name} ({category.percentage.toFixed(1)}%)
              </Typography>
            }
            size="small"
            sx={{
              bgcolor: category.color,
              color: 'common.white'
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SummaryLegend;
