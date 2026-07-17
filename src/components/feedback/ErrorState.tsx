import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry }) => {
  return (
    <Box aria-label="Error loading content">
      <Alert severity="error" sx={{ mb: 2 }}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
      {onRetry && (
        <Button variant="contained" color="primary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Box>
  );
};
