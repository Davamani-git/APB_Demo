import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  ResponsiveContainer as RechartsResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import type { CategoryBreakdownItem } from '../../../models/insights';
import { SummaryLegend } from '../SummaryLegend/SummaryLegend';
import { formatCurrency } from '../../../utils/numberFormat.utils';

interface CategoryBreakdownChartProps {
  categories: CategoryBreakdownItem[];
}

const CHART_COLORS = ['#4f46e5', '#22c55e', '#f97316', '#0ea5e9', '#e11d48', '#a855f7'];

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ categories }) => {
  const data = categories.map((c, index) => ({
    ...c,
    color: c.color ?? CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <Box
      aria-label="Monthly spend by category"
      role="region"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <Box sx={{ flex: 2, minHeight: 260 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Spend by category
        </Typography>
        <RechartsResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color!} aria-label={entry.name} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: unknown, _name, props) => {
                const v = typeof value === 'number' ? value : 0;
                const currency = props.payload?.currency ?? '';
                return formatCurrency(v, currency || 'USD');
              }}
            />
          </PieChart>
        </RechartsResponsiveContainer>
      </Box>
      <Box sx={{ flex: 1 }}>
        <SummaryLegend categories={data} />
      </Box>
    </Box>
  );
};
