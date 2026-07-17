import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { INSIGHTS_ROUTE } from '../constants/insightsConstants';
import MonthlySpendSummaryPage from '../pages/MonthlySpendSummaryPage/MonthlySpendSummaryPage';

export const RoutesConfig: React.FC = () => {
  return (
    <Routes>
      <Route path={INSIGHTS_ROUTE} element={<MonthlySpendSummaryPage />} />
      <Route path="*" element={<Navigate to={INSIGHTS_ROUTE} replace />} />
    </Routes>
  );
};
