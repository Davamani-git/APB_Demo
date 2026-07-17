import { FC } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from "recharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { formatCurrency, formatPercentage } from "../../utils/numberFormatters";

export interface SpendCategoryChartDataPoint {
  category: string;
  amount: number;
  percentage: number;
}

interface SpendCategoryChartProps {
  data: SpendCategoryChartDataPoint[];
}

const COLORS = ["#1E88E5", "#FFB300", "#4CAF50", "#AB47BC", "#EC407A", "#26A69A"];

export const SpendCategoryChart: FC<SpendCategoryChartProps> = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <Box className="bg-background-card rounded-card shadow-card border border-border-subtle p-4 h-full flex flex-col">
      <Typography variant="subtitle1" className="font-semibold mb-2">
        Spend by category
      </Typography>
      {!hasData ? (
        <Typography variant="body2" className="text-text-secondary mt-4">
          Category breakdown is not available for this month.
        </Typography>
      ) : (
        <div className="flex-1 min-h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.category}`}
                    fill={COLORS[index % COLORS.length]}
                    aria-label={`${entry.category} ${formatCurrency(entry.amount)} (${formatPercentage(
                      entry.percentage
                    )})`}
                  />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: any, _name, props) => {
                  const payload = props?.payload as any;
                  const amount = Number(value);
                  const pct = payload?.percentage as number | undefined;
                  return [
                    `${formatCurrency(amount)}${typeof pct === "number" ? ` (${formatPercentage(pct)})` : ""}`,
                    payload?.category ?? "Category"
                  ];
                }}
              />
              <RechartsLegend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Box>
  );
};
