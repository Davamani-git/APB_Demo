import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/global.css';
import { appConfig } from './config/appConfig';
import { queryClient } from './state/queryClient';
import { initMockServer } from './mocks/mockServer';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f1f5f9'
    }
  },
  shape: {
    borderRadius: 12
  }
});

async function bootstrap() {
  if (appConfig.useMockApi) {
    await initMockServer();
  }

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

bootstrap();
