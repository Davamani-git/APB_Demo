import React from 'react';
import MonthPicker from '@components/forms/MonthPicker';
import Loader from '@components/feedback/Loader';
import ErrorState from '@components/feedback/ErrorState';
import EmptyState from '@components/feedback/EmptyState';
import Card from '@components/common/Card';
import MonthlyKpiCards from '@components/insights/MonthlyKpiCards';
import SpendByCategoryDonutChart from '@components/charts/SpendByCategoryDonutChart';
import CategoryBreakdownTable from '@components/tables/CategoryBreakdownTable';
import PartialDataNotice from '@components/insights/PartialDataNotice';
import { useMonthlySummary } from '@services/insights/useMonthlySummary';
import { useUIStore } from '@state/uiStore';
import { MIN_ALLOWED_MONTH, CURRENT_MONTH } from '@shared/constants';
import { useConsentStatus } from '@services/consent/useConsentStatus';

interface MonthlySpendDashboardProps {
  initialMonth?: string;
}

const MonthlySpendDashboard: React.FC<MonthlySpendDashboardProps> = ({ initialMonth }) => {
  const selectedMonth = useUIStore((s) => s.selectedMonth);
  const setSelectedMonth = useUIStore((s) => s.setSelectedMonth);

  React.useEffect(() => {
    if (!selectedMonth) {
      setSelectedMonth(initialMonth || CURRENT_MONTH);
    }
  }, [initialMonth, selectedMonth, setSelectedMonth]);

  const effectiveMonth = selectedMonth || initialMonth || CURRENT_MONTH;

  const { data, isLoading, isError, error, isPartial, refetch } = useMonthlySummary(effectiveMonth);
  const { data: consent, isLoading: consentLoading } = useConsentStatus();

  if (consent && consent.status !== 'granted') {
    return (
      <div className="py-6">
        <Card title="Spending insights unavailable" subtitle="Consent required" variant="default">
          <div className="mt-2 text-sm text-gray-700">
            Spending insights are unavailable because you have not granted consent for this feature. Please review your
            privacy and consent settings in your account profile.
          </div>
        </Card>
      </div>
    );
  }

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
  };

  return (
    <div className="space-y-6" aria-label="Monthly spending summary dashboard">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Monthly Credit Card Spend</h2>
          <p className="text-sm text-gray-600 mt-1">
            View your monthly credit card spending summary, key metrics, and category breakdown.
          </p>
        </div>
        <MonthPicker value={effectiveMonth} minMonth={MIN_ALLOWED_MONTH} maxMonth={CURRENT_MONTH} onChange={handleMonthChange} />
      </div>

      {(isLoading || consentLoading) && !data && !isError && (
        <Card>
          <Loader message="Loading monthly summary..." />
        </Card>
      )}

      {isError && !isLoading && (
        <Card>
          <ErrorState
            title="We couldn't load your monthly summary"
            description={error?.message || 'Please try again.'}
            onRetry={refetch}
          />
        </Card>
      )}

      {!isLoading && !isError && data && data.transactionCount === 0 && (
        <Card>
          <EmptyState
            title="No spending activity for this month"
            description="There are no posted credit card transactions for the selected month. Try selecting a different month."
          />
        </Card>
      )}

      {!isLoading && !isError && data && data.transactionCount > 0 && (
        <>
          <MonthlyKpiCards summary={data} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
            <div className="lg:col-span-6">
              <Card title="Spend by category" subtitle="Visual breakdown of your monthly spend by category">
                <SpendByCategoryDonutChart data={isPartial ? [] : data.categories} />
              </Card>
            </div>
            <div className="lg:col-span-6">
              <Card
                title="Category breakdown details"
                subtitle="See how your spend is distributed across categories"
              >
                <CategoryBreakdownTable rows={isPartial ? [] : data.categories} currency={data.currency} />
              </Card>
            </div>
          </div>

          {isPartial && (
            <PartialDataNotice message="Some category breakdown details are temporarily unavailable. Totals are accurate, but category-level views may be incomplete." />
          )}
        </>
      )}
    </div>
  );
};

export default MonthlySpendDashboard;
