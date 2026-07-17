import axios from 'axios';
import { appConfig } from '../config/appConfig';

export const httpClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 15000
});

httpClient.interceptors.request.use((config) => {
  // Placeholder for auth header; in real integration, inject token here.
  if (!config.headers) config.headers = {};
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
