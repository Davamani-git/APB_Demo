import { MOCK_MONTHLY_SUMMARIES } from "./mockData";
import { MonthlySummaryResponse } from "../../models/insights";
import { mockConfig, getRandomDelay } from "./mockConfig";

export async function getMonthlySummaryMock(params: { month: string }): Promise<MonthlySummaryResponse> {
  const { month } = params;
  const simulateError = mockConfig.simulateErrors && Math.random() < mockConfig.errorRate;

  if (mockConfig.simulateLatency) {
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));
  }

  if (simulateError) {
    const error: any = new Error("Mocked outage");
    error.response = {
      status: 503,
      data: {
        errorCode: "SUMMARY_UNAVAILABLE",
        message: "Monthly summary is temporarily unavailable. Please try again later."
      }
    };
    throw error;
  }

  const summary = MOCK_MONTHLY_SUMMARIES[month];

  if (!summary) {
    return {
      month,
      currency: "USD",
      totalSpend: 0,
      transactionCount: 0,
      categories: [],
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: "mock",
        hasCompleteData: true,
        consentStatus: "granted"
      }
    };
  }

  return summary;
}
