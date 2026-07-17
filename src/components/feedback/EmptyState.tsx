import React from 'react';
import { Box, Typography } from '@mui/material';

export interface EmptyStateProps {
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <Box sx={{ mt: 6, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyState;
