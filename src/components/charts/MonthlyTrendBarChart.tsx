import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface MonthlyTrendDatum {
  month: string;
  totalSpend: number;
  transactionCount: number;
}

interface MonthlyTrendBarChartProps {
  data: MonthlyTrendDatum[];
}

const MonthlyTrendBarChart: React.FC<MonthlyTrendBarChartProps> = ({ data }) => {
  if (!data.length) {
    return null;
  }

  return (
    <div className="w-full h-64" aria-label="Monthly spend trend chart" role="img">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalSpend" fill="#0052CC" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendBarChart;
