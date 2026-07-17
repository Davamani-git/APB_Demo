import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import MonthlySpendSummaryPage from '../pages/MonthlySpendSummaryPage/MonthlySpendSummaryPage';
import { queryClient } from '../state/queryClient';

jest.mock('../config/appConfig', () => ({
  appConfig: {
    apiBaseUrl: '',
    useMockApi: true,
    defaultCurrency: 'USD',
    minSupportedMonth: '2015-01'
  }
}));

jest.mock('../mocks/mockServer', () => ({
  initMockServer: async () => {}
}));

jest.mock('../services/insightsService', () => {
  const actual = jest.requireActual('../services/insightsService');
  return {
    ...actual,
    useMonthlySummaryQuery: () => ({
      data: {
        month: '2026-05',
        currency: 'USD',
        totalSpend: 100,
        transactionCount: 2,
        averageTransactionAmount: 50,
        categories: [],
        metadata: null
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn()
    })
  };
});

describe('MonthlySpendSummaryPage', () => {
  it('renders KPI cards for monthly summary', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MonthlySpendSummaryPage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Total Spend/i)).toBeInTheDocument();
      expect(screen.getByText(/Number of Transactions/i)).toBeInTheDocument();
    });
  });
});
