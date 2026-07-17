import React from 'react';
import { Container } from '@mui/material';

interface ResponsiveContainerProps {
  children: React.ReactNode;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children }) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}
    >
      {children}
    </Container>
  );
};
