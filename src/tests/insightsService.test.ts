import { mapMonthlySummaryDtoToDomain } from '../services/insightsService';
import { MonthlySummaryDto } from '../models/insights';

describe('insightsService', () => {
  it('maps DTO to domain model correctly', () => {
    const dto: MonthlySummaryDto = {
      month: '2026-05',
      currency: 'USD',
      totalSpend: 100,
      transactionCount: 2,
      averageTransactionAmount: 50,
      categories: [
        {
          categoryId: 'GROC',
          categoryName: 'Groceries',
          amount: 60,
          percentage: 60
        }
      ],
      metadata: {
        isPrecomputed: true,
        dataSource: 'MOCK',
        generatedAt: '2026-05-01T00:00:00Z',
        partial: false
      }
    };

    const domain = mapMonthlySummaryDtoToDomain(dto);

    expect(domain.month).toBe(dto.month);
    expect(domain.categories[0].id).toBe('GROC');
    expect(domain.categories[0].name).toBe('Groceries');
    expect(domain.metadata?.generatedAt).toBeInstanceOf(Date);
  });
});
