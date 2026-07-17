import { FC } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description,
  onRetry
}) => {
  return (
    <Box className="flex flex-col items-center justify-center text-center py-10 px-4 bg-background-card rounded-card shadow-card border border-border-subtle">
      <Typography variant="h6" className="mb-2 font-semibold">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" className="text-text-secondary mb-4 max-w-md">
          {description}
        </Typography>
      )}
      {onRetry && (
        <Button variant="contained" color="primary" size="small" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  );
};
