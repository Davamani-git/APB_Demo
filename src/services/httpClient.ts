import axios from "axios";
import { envConfig } from "../config/env";

export const httpClient = axios.create({
  baseURL: envConfig.apiBaseUrl,
  timeout: 10000
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
