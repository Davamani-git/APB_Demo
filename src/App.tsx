import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { INSIGHTS_ROUTE } from './constants/insightsConstants';
import { routes } from './routes/routes';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
    },
    background: {
      default: '#f8fafc',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path={INSIGHTS_ROUTE} element={routes.monthlySpendSummary} />
        <Route path="*" element={<Navigate to={INSIGHTS_ROUTE} replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
