import { INSIGHTS_MONTHLY_SUMMARY } from './endpoints';
import { MonthlySummary } from '@models/insights';
import { USE_MOCK_API } from '@shared/constants';
import { httpClient } from './httpClient';
import { insightsMockApi } from '@mocks/handlers/insightsMonthlySummaryHandler';

export const insightsApi = {
  async getMonthlySummary(month: string): Promise<MonthlySummary> {
    if (USE_MOCK_API) {
      return insightsMockApi.getMonthlySummary(month);
    }

    const response = await httpClient.get<MonthlySummary>(INSIGHTS_MONTHLY_SUMMARY, {
      params: { month }
    });
    return response.data;
  }
};
