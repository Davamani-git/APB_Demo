import { FC, ReactNode } from "react";
import Grid from "@mui/material/Grid";
import { KpiCard } from "./KpiCard";

interface KpiItem {
  id: string;
  label: string;
  value: string;
  icon?: ReactNode;
}

interface KpiCardGridProps {
  items: KpiItem[];
}

export const KpiCardGrid: FC<KpiCardGridProps> = ({ items }) => {
  return (
    <Grid container spacing={2.5}>
      {items.map((item) => (
        <Grid key={item.id} item xs={12} sm={6} lg={4}>
          <KpiCard label={item.label} value={item.value} icon={item.icon} />
        </Grid>
      ))}
    </Grid>
  );
};
