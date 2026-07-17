import { FC } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <Box className="flex flex-col items-center justify-center text-center py-10 px-4 bg-background-card rounded-card shadow-card border border-border-subtle">
      <Typography variant="h6" className="mb-2 font-semibold">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" className="text-text-secondary max-w-md">
          {description}
        </Typography>
      )}
    </Box>
  );
};
