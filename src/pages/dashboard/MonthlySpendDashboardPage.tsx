import React from 'react';
import MainLayout from '@layouts/MainLayout';
import MonthlySpendDashboard from '@components/insights/MonthlySpendDashboard';

const MonthlySpendDashboardPage: React.FC = () => {
  return (
    <MainLayout>
      <MonthlySpendDashboard />
    </MainLayout>
  );
};

export default MonthlySpendDashboardPage;
