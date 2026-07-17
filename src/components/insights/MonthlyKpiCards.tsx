import React from 'react';
import Card from '@components/common/Card';
import Icon from '@components/common/Icon';
import { MonthlySummary } from '@models/insights';
import { formatCurrency } from '@shared/formatters';

interface MonthlyKpiCardsProps {
  summary: MonthlySummary;
}

const MonthlyKpiCards: React.FC<MonthlyKpiCardsProps> = ({ summary }) => {
  const { currency, totalSpend, transactionCount, averageTransactionAmount } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card variant="highlight" title="Total Monthly Spend" subtitle="Sum of all posted transactions">
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalSpend, currency)}</p>
          </div>
          <Icon name="trendUp" size={28} className="text-primary-600" />
        </div>
      </Card>
      <Card variant="kpi" title="Number of Transactions" subtitle="Posted transactions this month">
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-semibold text-gray-900">{transactionCount.toLocaleString()}</p>
          <Icon name="dashboard" size={24} className="text-secondary-500" />
        </div>
      </Card>
      <Card variant="kpi" title="Average Transaction Amount" subtitle="If available from issuer">
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-semibold text-gray-900">
            {typeof averageTransactionAmount === 'number'
              ? formatCurrency(averageTransactionAmount, currency)
              : 'N/A'}
          </p>
          <Icon name="info" size={24} className="text-info-500" />
        </div>
      </Card>
    </div>
  );
};

export default MonthlyKpiCards;
