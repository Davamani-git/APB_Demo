import React from 'react';
import { Container } from '@mui/material';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children }) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 3,
        px: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      {children}
    </Container>
  );
};

export default ResponsiveContainer;
