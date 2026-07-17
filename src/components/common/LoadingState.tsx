import { FC } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: FC<LoadingStateProps> = ({ message }) => {
  return (
    <Box className="flex flex-col items-center justify-center text-center py-10 px-4 bg-background-card rounded-card shadow-card border border-border-subtle">
      <CircularProgress color="primary" size={28} className="mb-4" />
      <Typography variant="body2" className="text-text-secondary">
        {message ?? "Loading monthly summary..."}
      </Typography>
    </Box>
  );
};
