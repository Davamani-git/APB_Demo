import React from 'react';
import { RouteObject } from 'react-router-dom';
import { INSIGHTS_ROUTE } from '../constants/insightsConstants';
import { MonthlySpendSummaryPage } from '../pages/MonthlySpendSummaryPage/MonthlySpendSummaryPage';

export const routes: RouteObject[] = [
  {
    path: INSIGHTS_ROUTE,
    element: <MonthlySpendSummaryPage />
  }
];
