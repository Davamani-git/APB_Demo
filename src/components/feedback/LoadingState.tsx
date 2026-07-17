import React from 'react';
import { Box, Grid, Card, CardContent, Skeleton } from '@mui/material';

interface LoadingStateProps {
  variant?: 'default';
}

export const LoadingState: React.FC<LoadingStateProps> = () => {
  return (
    <Box aria-busy="true" aria-label="Loading monthly spending summary">
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Skeleton variant="text" width={200} height={32} />
        </Grid>
        {[0, 1, 2].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" height={36} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Skeleton variant="text" width={180} />
          <Skeleton variant="rectangular" height={220} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    </Box>
  );
};
