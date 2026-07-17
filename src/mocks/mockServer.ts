import { registerInsightsMocks } from './handlers/insightsMockHandlers';
import { httpClient } from '../services/httpClient';

let initialized = false;

export const initMockServer = async (): Promise<void> => {
  if (initialized) return;
  registerInsightsMocks(httpClient);
  initialized = true;
};
