import sample from '@mocks/data/monthlySummary.sample.json';
import { MonthlySummary } from '@models/insights';

function buildSummaryForMonth(month: string): MonthlySummary {
  const base = sample as unknown as MonthlySummary;
  const date = new Date(month + '-01');
  if (isNaN(date.getTime())) {
    return base;
  }

  const monthOffset = (date.getFullYear() - 2026) * 12 + (date.getMonth() - 4);
  const factor = 1 + monthOffset * 0.03;

  const totalSpend = Math.max(0, base.totalSpend * factor);
  const categories = base.categories.map((c) => ({
    ...c,
    amount: Math.max(0, c.amount * factor)
  }));

  const categoriesTotal = categories.reduce((sum, c) => sum + c.amount, 0) || 1;
  const normalizedCategories = categories.map((c) => ({
    ...c,
    percentage: (c.amount / categoriesTotal) * 100
  }));

  const summary: MonthlySummary = {
    ...base,
    month,
    totalSpend,
    categories: normalizedCategories,
    isPartial: false,
    transactionCount: Math.max(0, Math.round(base.transactionCount * factor)),
    averageTransactionAmount: totalSpend > 0 ? totalSpend / Math.max(1, Math.round(base.transactionCount * factor)) : 0
  };

  return summary;
}

export const insightsMockApi = {
  async getMonthlySummary(month: string): Promise<MonthlySummary> {
    if (month === '2099-01') {
      throw new Error('SERVICE_UNAVAILABLE');
    }

    const date = new Date(month + '-01');
    const now = new Date();
    if (date > now) {
      const error: any = new Error('SUMMARY_NOT_FOUND');
      error.code = 'SUMMARY_NOT_FOUND';
      throw error;
    }

    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    if (date < twoYearsAgo) {
      const error: any = new Error('SUMMARY_NOT_FOUND');
      error.code = 'SUMMARY_NOT_FOUND';
      throw error;
    }

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    if (date.getFullYear() === lastMonth.getFullYear() && date.getMonth() === lastMonth.getMonth()) {
      return {
        ...(sample as unknown as MonthlySummary),
        month,
        totalSpend: 0,
        transactionCount: 0,
        categories: [],
        averageTransactionAmount: 0,
        isPartial: false
      };
    }

    return buildSummaryForMonth(month);
  }
};
