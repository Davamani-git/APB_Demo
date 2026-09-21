const { test, expect } = require('@playwright/test');
const { AnalyticsPage } = require('./pages/analytics.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Spend Analytics - Category-Wise Spending Analytics', () => {
  test('QE-6096 TS-001 TC-001 - Verify category-wise spending visualization displays all defined categories when user has transactions across multiple categories', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('multicategory_user', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.verifyCategoryWiseVisualizationDisplayed();
    await analyticsPage.verifyCategoryDisplayed('Food & Dining', '5,000');
    await analyticsPage.verifyCategoryDisplayed('Fuel', '2,000');
    await analyticsPage.verifyCategoryDisplayed('Shopping', '8,000');
    await analyticsPage.verifyCategoryDisplayed('Travel', '10,000');
    await analyticsPage.verifyCategoryDisplayed('Entertainment', '3,000');
    await analyticsPage.verifyCategoryDisplayed('Utilities', '1,500');
    await analyticsPage.verifyCategoryDisplayed('Healthcare', '2,500');
    await analyticsPage.verifyCategoryDisplayed('Education', '1,000');
    await analyticsPage.verifyCategoryDisplayed('Miscellaneous', '500');
    await analyticsPage.verifySpendingAmountsAccurate();
  });

  test('QE-6096 TS-001 TC-002 - Verify category-wise spending visualization is interactive and allows user to view detailed breakdown per category', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('multicategory_user', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.verifyCategoryWiseVisualizationDisplayed();
    await analyticsPage.hoverOverCategory('Food & Dining');
    await analyticsPage.verifyTooltipDisplayed('Food & Dining');
    await analyticsPage.verifyInteractiveElementsRespond();
    await analyticsPage.verifyCategoryPercentage('Food & Dining', '15');
  });

  test('QE-6096 TS-002 TC-001 - Verify category-wise spending visualization shows only categories with transactions and excludes or shows zero for categories without spending', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('limitedcategory_user', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.verifyCategoryWiseVisualizationDisplayed();
    await analyticsPage.verifyCategoryDisplayed('Food & Dining', '3,000');
    await analyticsPage.verifyCategoryDisplayed('Fuel', '1,500');
    await analyticsPage.verifyCategoryDisplayed('Shopping', '5,000');
    await analyticsPage.verifyCategoriesWithoutTransactionsExcludedOrZero(['Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']);
  });

  test('QE-6096 TS-003 TC-001 - Verify appropriate message and empty visualization when user has no past transactions in spend analytics view', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('notransaction_user', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.verifyNoSpendingDataMessage();
    await analyticsPage.verifyEmptyOrZeroVisualization();
  });
});

test.describe('Spend Analytics - Monthly Spend Trend Visualization', () => {
  test('QE-6097 TS-001 TC-001 - Verify monthly spend trend chart displays accurate historical data with correct data points for each month', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('historicaldata_user', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.scrollToMonthlySpendTrend();
    await analyticsPage.verifyMonthlySpendTrendDisplayed();
    await analyticsPage.verifyMonthDataPoint('Jan 2024', '15,000');
    await analyticsPage.verifyMonthDataPoint('Feb 2024', '18,000');
    await analyticsPage.verifyMonthDataPoint('Mar 2024', '12,000');
    await analyticsPage.verifyMonthDataPoint('Apr 2024', '20,000');
    await analyticsPage.verifyChartInteractivity();
  });

  test('QE-6097 TS-002 TC-001 - Verify monthly spend trend chart filters data correctly when user selects a custom date range', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('historicaldata_user', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.scrollToMonthlySpendTrend();
    await analyticsPage.verifyMonthlySpendTrendDisplayed();
    await analyticsPage.selectDateRange('Jan 2024', 'Mar 2024');
    await analyticsPage.applyDateRangeFilter();
    await analyticsPage.verifyChartRefreshed();
    await analyticsPage.verifyMonthDataPoint('Jan 2024', '15,000');
    await analyticsPage.verifyMonthDataPoint('Feb 2024', '18,000');
    await analyticsPage.verifyMonthDataPoint('Mar 2024', '12,000');
    await analyticsPage.verifyMonthsOutsideRangeExcluded(['Apr 2024']);
  });

  test('QE-6097 TS-003 TC-001 - Verify appropriate message and empty chart when user with no historical transaction data views monthly spend trend', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new AnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('nohistory_user', 'Pass@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.scrollToMonthlySpendTrend();
    await analyticsPage.verifyInsufficientDataMessage();
    await analyticsPage.verifyEmptyChartOrZeroTrendLine();
  });
});