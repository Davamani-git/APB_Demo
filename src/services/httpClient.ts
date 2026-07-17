import axios from 'axios';
import { appConfig } from '../config/appConfig';

export const httpClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 10000,
});

httpClient.interceptors.request.use((config) => {
  // Authorization header could be set here if available
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
