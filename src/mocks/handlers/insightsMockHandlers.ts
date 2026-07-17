import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import monthlySummary from '../data/monthlySummary.mock.json';

interface ErrorBody {
  code: string;
  message: string;
}

export const registerInsightsMocks = (client: AxiosInstance): void => {
  client.interceptors.request.use((config) => {
    if (config.url?.includes('/insights/monthly-summary')) {
      config.adapter = async (): Promise<AxiosResponse> => {
        const url = new URL((config.baseURL || 'http://localhost') + (config.url || ''));
        const month = url.searchParams.get('month') || (config.params as { month?: string })?.month || monthlySummary.month;

        const body = monthlySummary as any;

        // Example error scenarios based on month
        if (month < '2020-01') {
          const errorBody: ErrorBody = {
            code: 'CONSENT_REQUIRED',
            message: 'Insights consent is required to access this feature.',
          };
          return {
            data: errorBody,
            status: 409,
            statusText: 'Conflict',
            headers: {},
            config: config as AxiosRequestConfig,
          } as AxiosResponse<ErrorBody>;
        }

        if (month === '2099-01') {
          const errorBody: ErrorBody = {
            code: 'SERVICE_UNAVAILABLE',
            message: 'Insights service is temporarily unavailable.',
          };
          return {
            data: errorBody,
            status: 503,
            statusText: 'Service Unavailable',
            headers: {},
            config: config as AxiosRequestConfig,
          } as AxiosResponse<ErrorBody>;
        }

        if (month === '2026-03') {
          const emptyBody = {
            month,
            currency: body.currency,
            totalSpend: 0,
            transactionCount: 0,
            averageTransactionAmount: 0,
            categories: [],
            metadata: {
              isPrecomputed: true,
              dataSource: 'MOCK',
              generatedAt: `${month}-01T00:00:00Z`,
              partial: false,
            },
          };

          return {
            data: emptyBody,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: config as AxiosRequestConfig,
          } as AxiosResponse;
        }

        const updated = {
          ...body,
          month,
          metadata: {
            ...body.metadata,
            dataSource: 'MOCK',
            generatedAt: new Date().toISOString(),
          },
        };

        return {
          data: updated,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config as AxiosRequestConfig,
        } as AxiosResponse;
      };
    }

    return config;
  });
};
