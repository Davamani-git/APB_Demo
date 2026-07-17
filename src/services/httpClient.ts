import axios from 'axios';
import { appConfig } from '../config/appConfig';

export const httpClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 15000
});

httpClient.interceptors.request.use(config => {
  // Placeholder for auth headers; in real app, inject token here.
  return config;
});

httpClient.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);
