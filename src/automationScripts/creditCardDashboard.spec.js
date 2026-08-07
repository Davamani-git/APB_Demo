const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');

// TestCase: User can view dashboard KPIs for multiple credit cards

test('TC01: View Dashboard KPIs for Multiple Credit Cards', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.navigate();
  await dashboardPage.assertDashboardVisible();
  await dashboardPage.assertMultipleCardsVisible();
  await dashboardPage.assertKPIVisible('Monthly Spend');
  await dashboardPage.assertKPIVisible('Total Credit Limit');
  await dashboardPage.assertKPIVisible('Available Credit');
  await dashboardPage.assertKPIVisible('Outstanding Amount');
});

// TestCase: User can view category-wise spending visualizations

test('TC02: View Category-wise Spending Visualizations', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.navigate();
  await dashboardPage.assertCategorySpendingVisible(['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']);
});

// TestCase: User can view card-wise spend analysis and monthly spend trends

test('TC03: View Card-wise Spend Analysis and Monthly Spend Trends', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.navigate();
  await dashboardPage.assertSpendTrendsVisible();
  await dashboardPage.assertCardWiseAnalysisVisible();
});
