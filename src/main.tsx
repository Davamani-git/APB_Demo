import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { appConfig } from './config/appConfig';
import { queryClient } from './state/queryClient';
import './styles/global.css';

async function enableMocks() {
  if (appConfig.useMockApi) {
    const { initMockServer } = await import('./mocks/mockServer');
    await initMockServer();
  }
}

enableMocks().finally(() => {
  const rootElement = document.getElementById('root') as HTMLElement;
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
});
