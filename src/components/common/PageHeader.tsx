import { FC, ReactNode } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <Box className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <Box>
        <Typography variant="h1" className="text-2xl font-semibold leading-tight">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" className="text-text-secondary mt-1">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box className="flex items-center gap-3 mt-2 md:mt-0">{actions}</Box>}
    </Box>
  );
};
