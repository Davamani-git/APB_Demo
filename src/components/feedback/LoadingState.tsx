import React from 'react';
import { Box, Skeleton, Grid, Card, CardContent } from '@mui/material';

export const LoadingState: React.FC = () => {
  return (
    <Box aria-label="Loading monthly summary" role="status">
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card elevation={1}>
              <CardContent>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={160} height={32} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card elevation={1}>
        <CardContent>
          <Skeleton variant="text" width={180} height={24} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={220} />
        </CardContent>
      </Card>
    </Box>
  );
};
