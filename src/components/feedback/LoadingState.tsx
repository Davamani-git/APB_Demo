import React from 'react';
import { Box, Grid, Skeleton } from '@mui/material';

export interface LoadingStateProps {
  variant?: 'cards-and-chart' | 'full-page';
}

const LoadingState: React.FC<LoadingStateProps> = ({ variant = 'cards-and-chart' }) => {
  if (variant === 'full-page') {
    return (
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="text" width={260} height={32} />
        <Skeleton variant="rectangular" height={220} sx={{ mt: 2, borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Skeleton variant="text" width={260} height={32} />
      <Skeleton variant="text" width={360} height={20} sx={{ mt: 1 }} />
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {[0, 1, 2].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
        <Grid item xs={12} md={6}>
          <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoadingState;
