import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { formatCurrency, formatPercentage } from "../../utils/numberFormatters";

export interface SpendCategoryLegendItemData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface SpendCategoryLegendProps {
  data: SpendCategoryLegendItemData[];
}

export const SpendCategoryLegend: FC<SpendCategoryLegendProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box className="bg-background-card rounded-card shadow-card border border-border-subtle p-4 h-full flex items-center justify-center">
        <Typography variant="body2" className="text-text-secondary">
          No category data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="bg-background-card rounded-card shadow-card border border-border-subtle p-4 h-full">
      <Typography variant="subtitle1" className="font-semibold mb-3">
        Category details
      </Typography>
      <div className="flex flex-col gap-2 max-h-[260px] overflow-auto" aria-label="Spend by category legend">
        {data.map((item) => (
          <div key={item.category} className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="truncate" title={item.category}>
                {item.category}
              </span>
            </div>
            <div className="flex items-baseline gap-3 text-xs">
              <span className="font-medium">{formatCurrency(item.amount)}</span>
              <span className="text-text-secondary">{formatPercentage(item.percentage)}</span>
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
};
