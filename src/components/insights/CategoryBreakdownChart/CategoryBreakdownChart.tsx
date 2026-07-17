import React, { useMemo, useState } from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  ResponsiveContainer as RechartsResponsiveContainer,
  Tooltip,
  Cell
} from 'recharts';
import { CategoryBreakdownItem } from '../../../models/insights';
import SummaryLegend from '../SummaryLegend/SummaryLegend';
import { formatCurrency } from '../../../utils/numberFormat.utils';

export interface CategoryBreakdownChartProps {
  categories: CategoryBreakdownItem[];
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ categories }) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const palette = useMemo(
    () => [
      theme.palette.primary.main,
      '#1971C2',
      '#F59F00',
      '#E64980',
      '#40C057',
      '#845EF7'
    ],
    [theme.palette.primary.main]
  );

  const dataWithColors = useMemo(
    () =>
      categories.map((c, index) => ({
        ...c,
        color: c.color ?? palette[index % palette.length]
      })),
    [categories, palette]
  );

  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card
      elevation={1}
      sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}
      aria-label="Monthly spend by category chart"
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          Spend by category
        </Typography>
        <Typography variant="body2" color="text.secondary">
          See how your spending is distributed across categories.
        </Typography>
        <div style={{ width: '100%', height: 260 }}>
          <RechartsResponsiveContainer>
            <PieChart>
              <Pie
                data={dataWithColors}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {dataWithColors.map((entry, index) => (
                  <Cell
                    key={entry.id}
                    fill={entry.color}
                    stroke={index === activeIndex ? theme.palette.grey[50] : '#fff'}
                    strokeWidth={index === activeIndex ? 3 : 1}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, _name: any, props: any) => {
                  const category = props.payload as CategoryBreakdownItem;
                  return [
                    formatCurrency(Number(value), category.currency || 'USD'),
                    `${category.name} (${category.percentage.toFixed(1)}%)`
                  ];
                }}
              />
            </PieChart>
          </RechartsResponsiveContainer>
        </div>
        <SummaryLegend categories={dataWithColors} />
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdownChart;
