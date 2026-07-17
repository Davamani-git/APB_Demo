import { httpClient } from '../services/httpClient';
import { MonthlySummaryDto } from '../models/insights';

export const getMonthlySpendSummary = async (month: string): Promise<MonthlySummaryDto> => {
  const response = await httpClient.get<MonthlySummaryDto>('/insights/monthly-summary', {
    params: { month }
  });
  return response.data;
};
