import { FC } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { formatCurrency } from "../../utils/numberFormatters";

interface MonthlySummaryHeaderProps {
  selectedMonth: string;
  totalSpend: number | null;
  transactionCount: number | null;
  currency?: string;
}

export const MonthlySummaryHeader: FC<MonthlySummaryHeaderProps> = ({
  selectedMonth,
  totalSpend,
  transactionCount,
  currency = "USD"
}) => {
  const monthLabel = selectedMonth || "Select a month";

  return (
    <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-background-card rounded-card shadow-card border border-border-subtle px-5 py-4">
      <Box className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CalendarMonthOutlinedIcon />
        </div>
        <div>
          <Typography variant="subtitle2" className="uppercase text-xs tracking-wide text-text-secondary">
            Monthly summary
          </Typography>
          <Typography variant="h6" className="font-semibold">
            {monthLabel}
          </Typography>
        </div>
      </Box>
      <Box className="flex flex-wrap gap-6 text-sm">
        <Box className="flex flex-col min-w-[140px]">
          <span className="text-text-secondary text-xs uppercase tracking-wide mb-1">Total spend</span>
          <span className="font-semibold text-base">
            {totalSpend != null ? formatCurrency(totalSpend, currency) : "-"}
          </span>
        </Box>
        <Box className="flex flex-col min-w-[140px]">
          <span className="text-text-secondary text-xs uppercase tracking-wide mb-1">Transactions</span>
          <span className="font-semibold text-base">{transactionCount != null ? transactionCount : "-"}</span>
        </Box>
      </Box>
    </Box>
  );
};
