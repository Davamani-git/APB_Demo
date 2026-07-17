import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import '@styles/index.css';
import { USE_MOCK_API } from '@shared/constants';

async function prepareMocks() {
  if (USE_MOCK_API) {
    const { setupMocks } = await import('@mocks/server');
    await setupMocks();
  }
}

const queryClient = new QueryClient();

async function bootstrap() {
  await prepareMocks();

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
