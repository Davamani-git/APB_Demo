import { MonthlySummaryResponse } from "../models/insights";
import { envConfig } from "../config/env";
import * as insightsApi from "../api/insightsApi";
import { getMonthlySummaryMock } from "./mock/mockInsightsProvider";

export async function getMonthlySummary(params: { month: string }): Promise<MonthlySummaryResponse> {
  if (envConfig.useMockApi) {
    return getMonthlySummaryMock(params);
  }
  return insightsApi.getMonthlySummary(params);
}
