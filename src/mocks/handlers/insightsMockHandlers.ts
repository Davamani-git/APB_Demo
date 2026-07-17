import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import mockData from '../data/monthlySummary.mock.json';
import { appConfig } from '../../config/appConfig';
import { isMonthValid, isMonthInFuture } from '../../utils/date.utils';
import { MIN_SUPPORTED_MONTH } from '../../constants/insightsConstants';

export const registerInsightsMocks = (client: AxiosInstance): void => {
  client.interceptors.request.use((config) => {
    if (!appConfig.useMockApi) {
      return config;
    }

    if (!config.url?.endsWith('/insights/monthly-summary') || config.method?.toLowerCase() !== 'get') {
      return config;
    }

    const params = (config as AxiosRequestConfig).params ?? {};
    const month: string = params.month;

    if (!isMonthValid(month) || isMonthInFuture(month) || month < MIN_SUPPORTED_MONTH) {
      const response: AxiosResponse = {
        data: { code: 'INVALID_MONTH', message: 'Month must be in format YYYY-MM and not in the future.' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config
      };
      return Promise.reject({ response });
    }

    let responseBody: any = { ...mockData, month };

    if (month.endsWith('-03')) {
      responseBody = {
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
    } else if (month.endsWith('-01')) {
      const response: AxiosResponse = {
        data: { code: 'CONSENT_REQUIRED', message: 'Insights consent is required to access this feature.' },
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config
      };
      return Promise.reject({ response });
    } else if (month.endsWith('-12')) {
      const response: AxiosResponse = {
        data: { code: 'SERVICE_UNAVAILABLE', message: 'Insights service is temporarily unavailable.' },
        status: 503,
        statusText: 'Service Unavailable',
        headers: {},
        config
      };
      return Promise.reject({ response });
    }

    const response: AxiosResponse = {
      data: responseBody,
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };

    return Promise.reject({ __mockResponse: response });
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.__mockResponse) {
        return Promise.resolve(error.__mockResponse);
      }
      return Promise.reject(error);
    }
  );
};
