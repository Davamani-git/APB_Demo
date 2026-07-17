import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { appConfig } from './config/appConfig';
import { queryClient } from './state/queryClient';
import './styles/global.css';
import { initMockServer } from './mocks/mockServer';

async function bootstrap() {
  if (appConfig.useMockApi) {
    await initMockServer();
  }

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

bootstrap();
