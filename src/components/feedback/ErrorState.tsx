import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry }) => {
  return (
    <Box sx={{ mt: 4, maxWidth: 640 }}>
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
        {onRetry && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="error" onClick={onRetry}>
              Retry
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorState;
