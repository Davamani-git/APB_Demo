import axios from 'axios';
import { API_BASE_URL } from '@shared/constants';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

httpClient.interceptors.request.use((config) => {
  const correlationId = crypto.randomUUID();
  config.headers = config.headers || {};
  config.headers['X-Correlation-Id'] = correlationId;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
