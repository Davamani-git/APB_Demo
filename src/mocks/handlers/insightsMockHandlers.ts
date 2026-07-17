import { AxiosInstance } from 'axios';
import mockData from '../data/monthlySummary.mock.json';
import { appConfig } from '../../config/appConfig';

export function registerInsightsMocks(client: AxiosInstance): void {
  client.interceptors.request.use(config => {
    if (!appConfig.useMockApi) {
      return config;
    }

    if (config.method?.toLowerCase() === 'get' && config.url?.endsWith('/insights/monthly-summary')) {
      const monthParam = (config.params as any)?.month as string | undefined;
      const month = monthParam ?? mockData.month;

      if (month < appConfig.minSupportedMonth) {
        // Consent required scenario
        return Promise.reject({
          response: {
            status: 409,
            data: {
              code: 'CONSENT_REQUIRED',
              message: 'Insights consent is required to access this feature.'
            }
          }
        });
      }

      if (month === '2000-01') {
        // Service unavailable scenario example
        return Promise.reject({
          response: {
            status: 503,
            data: {
              code: 'SERVICE_UNAVAILABLE',
              message: 'Insights service is temporarily unavailable.'
            }
          }
        });
      }

      let payload: any = { ...mockData, month };

      if (month === '2026-03') {
        payload = {
          month,
          currency: mockData.currency,
          totalSpend: 0,
          transactionCount: 0,
          averageTransactionAmount: 0,
          categories: [],
          metadata: {
            isPrecomputed: true,
            dataSource: 'MOCK',
            generatedAt: `${month}-01T00:00:00Z`,
            partial: false
          }
        };
      }

      return Promise.reject({
        __isMock: true,
        config,
        mockResponse: {
          status: 200,
          data: payload
        }
      });
    }

    return config;
  });

  client.interceptors.response.use(
    response => response,
    error => {
      if (error && error.__isMock) {
        return Promise.resolve({
          status: error.mockResponse.status,
          data: error.mockResponse.data,
          config: error.config,
          headers: {},
          statusText: ''
        });
      }
      return Promise.reject(error);
    }
  );
}
