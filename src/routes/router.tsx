import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MonthlyInsightsDashboardPage } from "../pages/insights/MonthlyInsightsDashboardPage";
import { INSIGHTS_ROUTES } from "../constants/insights";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={INSIGHTS_ROUTES.monthlySummary} element={<MonthlyInsightsDashboardPage />} />
        <Route path="*" element={<Navigate to={INSIGHTS_ROUTES.monthlySummary} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
