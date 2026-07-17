import React from 'react';
import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: '1px dashed #cbd5f5',
        p: 3,
        textAlign: 'center',
        bgcolor: '#f8fafc'
      }}
      aria-label="No data state"
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
};
