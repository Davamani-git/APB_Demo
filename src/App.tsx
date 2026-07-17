import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RoutesConfig } from './routes/routes';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0B7285'
    },
    background: {
      default: '#F5F7FA'
    }
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RoutesConfig />
    </ThemeProvider>
  );
};

export default App;
