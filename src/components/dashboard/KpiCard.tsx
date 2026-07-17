import { FC, ReactNode } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export type KpiTrend = "up" | "down" | "flat" | undefined;

interface KpiCardProps {
  label: string;
  value: string;
  trend?: KpiTrend;
  icon?: ReactNode;
}

export const KpiCard: FC<KpiCardProps> = ({ label, value, trend, icon }) => {
  const trendLabel = trend === "up" ? "Improving" : trend === "down" ? "Declining" : undefined;

  return (
    <Card className="bg-background-card shadow-card rounded-card border border-border-subtle h-full">
      <CardContent className="!p-4 flex flex-col gap-3">
        <Box className="flex items-center justify-between">
          <Typography
            variant="body2"
            className="text-text-secondary text-xs uppercase tracking-wide truncate mr-2"
          >
            {label}
          </Typography>
          {icon && <div className="text-primary flex items-center justify-center ml-2">{icon}</div>}
        </Box>
        <Typography variant="h5" className="font-semibold text-lg">
          {value}
        </Typography>
        {trendLabel && (
          <Typography variant="caption" className="text-text-secondary">
            {trendLabel}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
