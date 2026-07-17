import { FC, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";

interface DashboardErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export const DashboardErrorBanner: FC<DashboardErrorBannerProps> = ({ message, onRetry }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <Box className="mb-4 rounded-card shadow-banner border border-error bg-red-900/30 text-red-100 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3" role="alert">
      <Box className="flex items-start gap-2">
        <ErrorOutlineIcon className="mt-0.5" />
        <Typography variant="body2">{message}</Typography>
      </Box>
      <Box className="flex items-center gap-2 self-end md:self-auto">
        {onRetry && (
          <Button size="small" variant="outlined" color="inherit" onClick={onRetry}>
            Retry
          </Button>
        )}
        <IconButton
          size="small"
          color="inherit"
          aria-label="Dismiss error"
          onClick={() => setVisible(false)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};
