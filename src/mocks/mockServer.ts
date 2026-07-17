import { httpClient } from '../services/httpClient';
import { registerInsightsMocks } from './handlers/insightsMockHandlers';

export const initMockServer = async (): Promise<void> => {
  registerInsightsMocks(httpClient);
};
