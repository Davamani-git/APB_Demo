import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CategorySpendBreakdown } from '@models/insights';

interface SpendByCategoryDonutChartProps {
  data: CategorySpendBreakdown[];
}

const COLORS = ['#0052CC', '#36B37E', '#00B8D9', '#FFAB00', '#DE350B', '#6B778C'];

const SpendByCategoryDonutChart: React.FC<SpendByCategoryDonutChartProps> = ({ data }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-60 text-sm text-gray-500" aria-label="No category breakdown available">
        No category breakdown available.
      </div>
    );
  }

  return (
    <div className="w-full h-64" aria-label="Spend by category chart" role="img">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="categoryName"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.categoryId} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, _name, props: any) => {
              const amount = Number(value) || 0;
              const percentage = props?.payload?.percentage ?? 0;
              return [
                amount.toLocaleString(undefined, { style: 'currency', currency: props?.payload?.currency || 'USD' }),
                `${props?.payload?.categoryName} (${percentage.toFixed(1)}%)`
              ];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendByCategoryDonutChart;
