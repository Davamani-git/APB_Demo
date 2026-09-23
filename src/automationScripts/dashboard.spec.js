const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { CardsPage } = require('./pages/cards.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('QE-6122 - Consolidated Credit Exposure View', () => {
  test('QE-6122 TS-001 TC-001 - Verify consolidated credit exposure view with multiple cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    await dashboardPage.verifyMultipleCardsExist(['Visa Platinum', 'MasterCard Gold', 'Amex Blue']);
    await dashboardPage.verifyMonthlySpendKPI('28000');
    await dashboardPage.verifyTotalCreditLimitKPI('120000');
    await dashboardPage.verifyAvailableCreditKPI('85000');
    await dashboardPage.verifyOutstandingAmountKPI('35000');
  });

  test('QE-6122 TS-002 TC-001 - Verify consolidated view with single credit card', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    await dashboardPage.verifySingleCardExists('Visa Platinum');
    await dashboardPage.verifyMonthlySpendKPI('12000');
    await dashboardPage.verifyTotalCreditLimitKPI('50000');
    await dashboardPage.verifyAvailableCreditKPI('35000');
    await dashboardPage.verifyOutstandingAmountKPI('15000');
  });

  test('QE-6122 TS-003 TC-001 - Verify system handles user with no credit cards gracefully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    await dashboardPage.verifyNoCardsMessage();
    await dashboardPage.verifyNavigationFunctional();
  });
});

test.describe('QE-6123 - Responsive Credit Dashboard Layout', () => {
  test('QE-6123 TS-001 TC-001 - Verify desktop dashboard renders all KPIs clearly', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    await dashboardPage.verifyAllKPICardsVisible();
    await dashboardPage.verifyMonthlySpendKPI('28000');
    await dashboardPage.verifyTotalCreditLimitKPI('120000');
    await dashboardPage.verifyAvailableCreditKPI('85000');
    await dashboardPage.verifyOutstandingAmountKPI('35000');
    await dashboardPage.verifyKPITextReadability();
  });

  test('QE-6123 TS-002 TC-001 - Verify mobile responsive layout for dashboard KPIs', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    await dashboardPage.verifyResponsiveLayout();
    await dashboardPage.verifyAllKPIsVisibleWithoutHorizontalScroll();
    await dashboardPage.verifyKPIValuesNotTruncated(['28000', '120000', '85000', '35000']);
    await dashboardPage.verifyTouchTargetsUsable();
  });

  test('QE-6123 TS-003 TC-001 - Verify graceful degradation on unsupported screen sizes', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 480 });
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await expect(dashboardPage.dashboardHeader).toBeVisible();
    await dashboardPage.verifyMinimumViableView();
    await dashboardPage.verifyKPIValuesPresent(['28000', '120000', '85000', '35000']);
    await dashboardPage.verifyNoJavaScriptErrors();
    await dashboardPage.verifyNavigationFunctional();
  });
});

test.describe('QE-6124 - Manage Multiple Credit Cards', () => {
  test('QE-6124 TS-001 TC-001 - Verify multiple cards display in single interface with summary information', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate();
    await expect(cardsPage.cardsHeader).toBeVisible();
    await cardsPage.verifyAllCardsListed(['Visa Platinum', 'MasterCard Gold', 'Amex Blue']);
    await cardsPage.verifyCreditLimits(['50000', '30000', '40000']);
    await cardsPage.verifyAvailableCredits(['35000', '22000', '28000']);
    await cardsPage.verifyOutstandingAmounts(['15000', '8000', '12000']);
  });

  test('QE-6124 TS-002 TC-001 - Verify performance and data accuracy with three or more cards', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    const startTime = Date.now();
    await cardsPage.navigate();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    await expect(cardsPage.cardsHeader).toBeVisible();
    await cardsPage.verifyEachCardDataDistinct();
    await cardsPage.verifyAggregatedTotalMatches('120000');
  });

  test('QE-6124 TS-003 TC-001 - Verify single card display functions correctly', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate();
    await expect(cardsPage.cardsHeader).toBeVisible();
    await cardsPage.verifySingleCardDisplayed('Visa Platinum');
    await cardsPage.verifyCardSummaryComplete('50000', '35000', '15000');
    await cardsPage.verifyInterfaceFunctional();
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await cardsPage.verifySingleCardMatchesDashboardKPIs();
  });
});

test.describe('QE-6125 - View Per-Card Transactions', () => {
  test('QE-6125 TS-001 TC-001 - Verify per-card transaction view displays correct transactions', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate();
    await expect(cardsPage.cardsHeader).toBeVisible();
    await cardsPage.selectCard('Visa Platinum');
    await cardsPage.clickViewTransactions();
    await cardsPage.verifyTransactionViewLoaded();
    await cardsPage.verifyTransactionCount(4);
    await cardsPage.verifyTransactionAttributes(['1200', '2024-01-15', 'Food & Dining', 'Restaurant ABC']);
  });

  test('QE-6125 TS-002 TC-001 - Verify transaction details and sum match card monthly spend', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate();
    await expect(cardsPage.cardsHeader).toBeVisible();
    await cardsPage.selectCard('Visa Platinum');
    await cardsPage.clickViewTransactions();
    await cardsPage.verifyTransactionViewLoaded();
    await cardsPage.verifyMultipleCategoryTransactions(['Food & Dining', 'Shopping', 'Fuel', 'Travel']);
    const transactionSum = await cardsPage.calculateTransactionSum();
    expect(transactionSum).toBe(12000);
    await cardsPage.verifyTransactionSumMatchesMonthlySpend('12000');
  });

  test('QE-6125 TS-003 TC-001 - Verify system handles card with no transactions gracefully', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate();
    await expect(cardsPage.cardsHeader).toBeVisible();
    await cardsPage.selectCardWithNoTransactions();
    await cardsPage.clickViewTransactions();
    await cardsPage.verifyTransactionViewLoaded();
    await cardsPage.verifyNoTransactionsMessage();
    await cardsPage.verifyNoErrors();
    await cardsPage.verifyNavigationFunctional();
  });
});

test.describe('QE-6126 - Monthly Spend Trend Visualization', () => {
  test('QE-6126 TS-001 TC-001 - Verify monthly spend trend chart displays with historical data', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await expect(analyticsPage.analyticsHeader).toBeVisible();
    await analyticsPage.verifyMonthlySpendTrendChartVisible();
    await analyticsPage.verifyChartDisplaysMonthlyData('2024-01', '28000');
    await analyticsPage.verifyMonthlyTotalAlignsDashboardKPI('28000');
  });

  test('QE-6126 TS-002 TC-001 - Verify monthly spend trends over configurable time period', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await expect(analyticsPage.analyticsHeader).toBeVisible();
    await analyticsPage.verifyMonthlySpendTrendChartVisible();
    await analyticsPage.verifyDefaultTimePeriodDisplayed();
    await analyticsPage.verifyEachMonthAccurateTotal('2024-01', '28000');
    await analyticsPage.verifySpendingPatternsVisible();
  });

  test('QE-6126 TS-003 TC-001 - Verify system handles absence of historical transaction data', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await expect(analyticsPage.analyticsHeader).toBeVisible();
    await analyticsPage.verifyMonthlySpendTrendChartAreaVisible();
    await analyticsPage.verifyEmptyStateOrMessage();
    await analyticsPage.verifyNoErrors();
    await analyticsPage.verifyApplicationStable();
  });
});

test.describe('QE-6127 - Category-Wise Spend Insights', () => {
  test('QE-6127 TS-001 TC-001 - Verify category-wise insights display with all predefined categories populated', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await expect(analyticsPage.analyticsHeader).toBeVisible();
    await analyticsPage.verifyAllCategoriesDisplayed(['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']);
    await analyticsPage.verifyCategorySpendingAmounts({
      'Food & Dining': '1200',
      'Fuel': '2000',
      'Shopping': '7500',
      'Travel': '5300',
      'Entertainment': '2200',
      'Utilities': '800',
      'Healthcare': '3500',
      'Education': '1500',
      'Miscellaneous': '4000'
    });
    await analyticsPage.verifyCategoryTotalMatchesDashboardKPI('28000');
  });

  test('QE-6127 TS-002 TC-001 - Verify filtered category view for a specific card', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await expect(analyticsPage.analyticsHeader).toBeVisible();
    await analyticsPage.selectCardFilter('Visa Platinum');
    await analyticsPage.verifyFilterApplied('Visa Platinum');
    await analyticsPage.verifyCategorySpendingRecalculated({
      'Food & Dining': '1200',
      'Fuel': '2000',
      'Shopping': '3500',
      'Travel': '5300'
    });
    await analyticsPage.verifyFilteredTotalMatchesCardSpend('12000');
  });

  test('QE-6127 TS-003 TC-001 - Verify system handles empty categories without errors', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await expect(analyticsPage.analyticsHeader).toBeVisible();
    await analyticsPage.selectCardFilter('MasterCard Gold');
    await analyticsPage.verifyFilterApplied('MasterCard Gold');
    await analyticsPage.verifyCategoriesWithZeroValues({
      'Utilities': '800',
      'Entertainment': '2200',
      'Healthcare': '3500',
      'Food & Dining': '0',
      'Fuel': '0',
      'Shopping': '0',
      'Travel': '0',
      'Education': '0',
      'Miscellaneous': '0'
    });
    await analyticsPage.verifyChartRendersWithZeroValues();
  });
});