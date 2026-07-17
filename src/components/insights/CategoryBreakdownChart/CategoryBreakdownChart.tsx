import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  ResponsiveContainer as RechartsResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { CategoryBreakdownItem } from '../../../models/insights';
import { SummaryLegend } from '../SummaryLegend/SummaryLegend';

interface CategoryBreakdownChartProps {
  categories: CategoryBreakdownItem[];
}

const COLORS = [
  '#0ea5e9',
  '#6366f1',
  '#22c55e',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#14b8a6',
  '#8b5cf6'
];

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ categories }) => {
  if (!categories.length) {
    return null;
  }

  const dataWithColor = categories.map((c, index) => ({
    ...c,
    color: c.color ?? COLORS[index % COLORS.length]
  }));

  return (
    <Card elevation={2} sx={{ mt: 3 }} aria-label="Category breakdown chart">
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Spend by Category
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1, height: 260 }}>
            <RechartsResponsiveContainer>
              <PieChart>
                <Pie
                  data={dataWithColor}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {dataWithColor.map(entry => (
                    <Cell key={entry.id} fill={entry.color!} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: unknown, _name, props) => {
                    const percentage = (props?.payload as any)?.percentage;
                    return [
                      `${value}`,
                      percentage != null ? `${percentage.toFixed(1)}%` : ''
                    ];
                  }}
                />
              </PieChart>
            </RechartsResponsiveContainer>
          </Box>
          <Box sx={{ flex: 1 }}>
            <SummaryLegend categories={dataWithColor} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
