import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MonthlySpendDashboardPage from '@pages/dashboard/MonthlySpendDashboardPage';
import NotFoundPage from '@pages/errors/NotFoundPage';

const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<Navigate to="/insights/monthly-spend" replace />} />
      <Route path="/insights/monthly-spend" element={<MonthlySpendDashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export const RouterProvider: React.FC = () => {
  return <AppRoutes />;
};
