import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { INSIGHTS_ROUTE } from './constants/insightsConstants';
import { MonthlySpendSummaryPage } from './pages/MonthlySpendSummaryPage/MonthlySpendSummaryPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path={INSIGHTS_ROUTE} element={<MonthlySpendSummaryPage />} />
      <Route path="*" element={<Navigate to={INSIGHTS_ROUTE} replace />} />
    </Routes>
  );
};

export default App;
