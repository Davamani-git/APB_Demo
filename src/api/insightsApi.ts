import { httpClient } from "../services/httpClient";
import { MonthlySummaryResponse } from "../models/insights";

export async function getMonthlySummary(params: { month: string }): Promise<MonthlySummaryResponse> {
  const response = await httpClient.get<MonthlySummaryResponse>("/insights/monthly-summary", {
    params: { month: params.month }
  });
  return response.data;
}
