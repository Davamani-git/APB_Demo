import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry }) => {
  return (
    <Box role="alert" sx={{ maxWidth: 600 }}>
      <Alert severity="error" action={onRetry && (
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      )}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  );
};
