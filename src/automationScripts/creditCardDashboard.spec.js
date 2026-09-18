const { test, expect } = require('@playwright/test');
const { CreditCardDashboardPage } = require('./pages/creditCardDashboard.page');
const { LoginPage } = require('./pages/login.page');
const { TransactionListingPage } = require('./pages/transactionListing.page');
const { SpendAnalyticsPage } = require('./pages/spendAnalytics.page');
const { MonthlySpendTrendsPage } = require('./pages/monthlySpendTrends.page');

test.describe('Credit Card Dashboard - Responsive Dashboard Tests', () => {
  test('QE-5788 TS-001 TC-001 - Verify authenticated user with multiple cards views all KPIs with accurate values and masked card numbers', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardToLoad();
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    const linkedCardsCount = await dashboardPage.getLinkedCardsCount();
    expect(linkedCardsCount).toBe(2);

    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$3,450.00');

    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('$20,000.00');

    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$16,550.00');

    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$3,450.00');

    await dashboardPage.verifyCardNumbersMasked();
  });

  test('QE-5788 TS-002 TC-001 - Verify dashboard renders responsively on desktop devices', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardToLoad();

    await expect(dashboardPage.dashboardContainer).toBeVisible();
    await dashboardPage.verifyResponsiveLayout('desktop');
    await dashboardPage.verifyAllKPIsVisible();
  });

  test('QE-5788 TS-002 TC-002 - Verify dashboard renders responsively on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardToLoad();

    await expect(dashboardPage.dashboardContainer).toBeVisible();
    await dashboardPage.verifyResponsiveLayout('tablet');
    await dashboardPage.verifyAllKPIsVisible();
  });

  test('QE-5788 TS-002 TC-003 - Verify dashboard renders responsively on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardToLoad();

    await expect(dashboardPage.dashboardContainer).toBeVisible();
    await dashboardPage.verifyResponsiveLayout('mobile');
    await dashboardPage.verifyAllKPIsVisible();
  });

  test('QE-5788 TS-003 TC-001 - Verify user with no linked cards receives appropriate message with no KPI data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'NewPass@123');
    await dashboardPage.waitForDashboardToLoad();

    await expect(dashboardPage.noCardsMessage).toBeVisible();
    await expect(dashboardPage.noCardsMessage).toContainText('No credit cards are linked to your profile');
    await dashboardPage.verifyNoKPIsDisplayed();
  });
});

test.describe('Credit Card Dashboard - Multi-Card Portfolio View Tests', () => {
  test('QE-5789 TS-001 TC-001 - Verify selecting specific card updates dashboard with individual KPIs and masked identifiers', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardToLoad();

    const cardsCount = await dashboardPage.getLinkedCardsCount();
    expect(cardsCount).toBe(3);

    await dashboardPage.selectCardByMaskedNumber('XXXX-XXXX-XXXX-5678');
    await dashboardPage.waitForCardDataToUpdate();

    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();

    await expect(dashboardPage.transactionSummarySection).toBeVisible();
    await dashboardPage.verifyCardNumberMasked('XXXX-XXXX-XXXX-5678');
  });

  test('QE-5789 TS-002 TC-001 - Verify attempting to select deactivated card results in error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardToLoad();

    const deactivatedCard = await dashboardPage.getDeactivatedCard('XXXX-XXXX-XXXX-9999');
    await expect(deactivatedCard).toBeVisible();

    await dashboardPage.attemptToSelectDeactivatedCard('XXXX-XXXX-XXXX-9999');
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText('This card has been deactivated and cannot be selected');
  });

  test('QE-5789 TS-003 TC-001 - Verify switching between multiple cards updates dashboard correctly without data mixing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardToLoad();

    const startTime1 = Date.now();
    await dashboardPage.selectCardByMaskedNumber('XXXX-XXXX-XXXX-1111');
    await dashboardPage.waitForCardDataToUpdate();
    const card1KPIs = await dashboardPage.captureCurrentKPIs();
    const endTime1 = Date.now();
    expect(endTime1 - startTime1).toBeLessThan(2000);

    const startTime2 = Date.now();
    await dashboardPage.selectCardByMaskedNumber('XXXX-XXXX-XXXX-2222');
    await dashboardPage.waitForCardDataToUpdate();
    const card2KPIs = await dashboardPage.captureCurrentKPIs();
    const endTime2 = Date.now();
    expect(endTime2 - startTime2).toBeLessThan(2000);
    expect(card2KPIs).not.toEqual(card1KPIs);

    const startTime3 = Date.now();
    await dashboardPage.selectCardByMaskedNumber('XXXX-XXXX-XXXX-3333');
    await dashboardPage.waitForCardDataToUpdate();
    const card3KPIs = await dashboardPage.captureCurrentKPIs();
    const endTime3 = Date.now();
    expect(endTime3 - startTime3).toBeLessThan(2000);
    expect(card3KPIs).not.toEqual(card2KPIs);
    expect(card3KPIs).not.toEqual(card1KPIs);
  });
});

test.describe('Credit Card Dashboard - Monthly Spend Trend Visualization Tests', () => {
  test('QE-5790 TS-001 TC-001 - Verify valid time period displays accurate monthly spend trends chart within performance thresholds', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const monthlySpendPage = new MonthlySpendTrendsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await monthlySpendPage.navigateToMonthlySpendTrends();

    const startTime = Date.now();
    await monthlySpendPage.selectTimePeriod('Last 6 months');
    await monthlySpendPage.waitForChartToLoad();
    const endTime = Date.now();

    await expect(monthlySpendPage.spendTrendsChart).toBeVisible();
    await monthlySpendPage.verifyChartDataAccuracy('Last 6 months');
    expect(endTime - startTime).toBeLessThan(3000);
  });

  test('QE-5790 TS-002 TC-001 - Verify time period with no transaction data displays appropriate message or empty chart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const monthlySpendPage = new MonthlySpendTrendsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await monthlySpendPage.navigateToMonthlySpendTrends();

    await monthlySpendPage.selectTimePeriod('January 2020 - June 2020');
    await monthlySpendPage.waitForChartToLoad();

    const noDataMessage = await monthlySpendPage.getNoDataMessage();
    expect(noDataMessage).toContain('No data available for the selected period');
  });

  test('QE-5790 TS-003 TC-001 - Verify changing time period updates monthly spend trends visualization accurately', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const monthlySpendPage = new MonthlySpendTrendsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await monthlySpendPage.navigateToMonthlySpendTrends();

    await monthlySpendPage.selectTimePeriod('Last 3 months');
    await monthlySpendPage.waitForChartToLoad();
    const chart3MonthsData = await monthlySpendPage.getChartData();

    await monthlySpendPage.selectTimePeriod('Last 12 months');
    await monthlySpendPage.waitForChartToLoad();
    const chart12MonthsData = await monthlySpendPage.getChartData();

    expect(chart12MonthsData).not.toEqual(chart3MonthsData);
    await monthlySpendPage.verifyChartDataAccuracy('Last 12 months');
  });
});

test.describe('Credit Card Dashboard - Category-Wise Spend Insights Tests', () => {
  test('QE-5791 TS-001 TC-001 - Verify single category filter updates analytics view with accurate spend totals without exposing sensitive details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new SpendAnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await analyticsPage.navigateToSpendAnalytics();

    await expect(analyticsPage.categoryWiseChart).toBeVisible();
    await analyticsPage.applyCategoryFilter('Food & Dining');
    await analyticsPage.waitForChartToUpdate();

    await expect(analyticsPage.categoryWiseChart).toBeVisible();
    await analyticsPage.verifyChartShowsCategoryOnly('Food & Dining');
    await analyticsPage.verifySensitiveDataNotExposed();
  });

  test('QE-5791 TS-002 TC-001 - Verify category filter with no transactions displays appropriate message or zero spend indication', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new SpendAnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await analyticsPage.navigateToSpendAnalytics();

    await analyticsPage.applyCategoryFilter('Healthcare');
    await analyticsPage.waitForChartToUpdate();

    const noDataMessage = await analyticsPage.getNoDataMessage();
    expect(noDataMessage).toMatch(/No transactions found for Healthcare category|\$0\.00/);
  });

  test('QE-5791 TS-003 TC-001 - Verify multiple category filters sequentially update charts with accurate category-wise spend totals', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new SpendAnalyticsPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await analyticsPage.navigateToSpendAnalytics();

    await analyticsPage.applyCategoryFilter('Fuel');
    await analyticsPage.waitForChartToUpdate();
    const fuelSpend = await analyticsPage.getCategorySpendTotal();
    await analyticsPage.verifyChartShowsCategoryOnly('Fuel');

    await analyticsPage.applyCategoryFilter('Travel');
    await analyticsPage.waitForChartToUpdate();
    const travelSpend = await analyticsPage.getCategorySpendTotal();
    await analyticsPage.verifyChartShowsCategoryOnly('Travel');
    expect(travelSpend).not.toEqual(fuelSpend);

    await analyticsPage.applyCategoryFilter('Entertainment');
    await analyticsPage.waitForChartToUpdate();
    const entertainmentSpend = await analyticsPage.getCategorySpendTotal();
    await analyticsPage.verifyChartShowsCategoryOnly('Entertainment');
    expect(entertainmentSpend).not.toEqual(travelSpend);
    expect(entertainmentSpend).not.toEqual(fuelSpend);
  });
});

test.describe('Credit Card Dashboard - Per-Card Transaction Listing Tests', () => {
  test('QE-5792 TS-001 TC-001 - Verify selecting card with transaction history displays paginated list with masked sensitive data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);
    const transactionPage = new TransactionListingPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardToLoad();

    await dashboardPage.selectCardByMaskedNumber('XXXX-XXXX-XXXX-1234');
    await transactionPage.openTransactionListing();

    await expect(transactionPage.transactionListContainer).toBeVisible();
    await expect(transactionPage.paginationControls).toBeVisible();
    await transactionPage.verifyTransactionDetailsDisplayed();
    await transactionPage.verifyCardNumbersMasked('XXXX-XXXX-XXXX-1234');
    await transactionPage.verifyCVVNotDisplayed();
  });

  test('QE-5792 TS-002 TC-001 - Verify selecting card with no transaction history displays appropriate message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);
    const transactionPage = new TransactionListingPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardToLoad();

    await dashboardPage.selectNewCardWithZeroTransactions();
    await transactionPage.openTransactionListing();

    await expect(transactionPage.noTransactionsMessage).toBeVisible();
    await expect(transactionPage.noTransactionsMessage).toContainText('No transactions are available for this card');
  });

  test('QE-5792 TS-003 TC-001 - Verify navigating through multiple pages of transactions loads correctly with masked sensitive data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);
    const transactionPage = new TransactionListingPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardToLoad();

    await dashboardPage.selectCardWithMultipleTransactions();
    await transactionPage.openTransactionListing();

    await expect(transactionPage.transactionListContainer).toBeVisible();
    await expect(transactionPage.paginationControls).toBeVisible();

    await transactionPage.clickNextPage();
    await transactionPage.waitForPageToLoad();

    await transactionPage.verifyTransactionDetailsDisplayed();
    await transactionPage.verifyCardNumbersMaskedOnAllPages();
    await transactionPage.verifyCVVNotDisplayed();
  });
});

test.describe('Credit Card Dashboard - Transaction Filters for Analysis Tests', () => {
  test('QE-5793 TS-001 TC-001 - Verify applying valid date range and category filter updates transaction listing with consistent KPIs', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);
    const transactionPage = new TransactionListingPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await dashboardPage.waitForDashboardToLoad();

    await transactionPage.navigateToTransactionListing();
    await expect(transactionPage.transactionListContainer).toBeVisible();

    await transactionPage.applyDateRangeFilter('01/01/2024', '31/03/2024');
    await transactionPage.waitForFilterToApply();

    await transactionPage.applyCategoryFilter('Food & Dining');
    await transactionPage.waitForFilterToApply();

    await transactionPage.verifyOnlyMatchingTransactionsDisplayed('01/01/2024', '31/03/2024', 'Food & Dining');
    await dashboardPage.verifyKPIsConsistentWithFilteredData();
  });

  test('QE-5793 TS-002 TC-001 - Verify applying date range filter with no matching transactions displays appropriate message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionListingPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await transactionPage.navigateToTransactionListing();

    await transactionPage.applyDateRangeFilter('01/01/2020', '31/01/2020');
    await transactionPage.waitForFilterToApply();

    await expect(transactionPage.noTransactionsMessage).toBeVisible();
    await expect(transactionPage.noTransactionsMessage).toContainText('No transactions found for the specified criteria');
  });

  test('QE-5793 TS-003 TC-001 - Verify applying date range filter followed by category filter correctly narrows down transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const transactionPage = new TransactionListingPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'SecurePass@123');
    await transactionPage.navigateToTransactionListing();

    await transactionPage.applyDateRangeFilter('01/02/2024', '28/02/2024');
    await transactionPage.waitForFilterToApply();
    const dateFilteredCount = await transactionPage.getTransactionCount();

    await transactionPage.applyCategoryFilter('Travel');
    await transactionPage.waitForFilterToApply();
    const bothFiltersCount = await transactionPage.getTransactionCount();

    expect(bothFiltersCount).toBeLessThanOrEqual(dateFilteredCount);
    await transactionPage.verifyOnlyMatchingTransactionsDisplayed('01/02/2024', '28/02/2024', 'Travel');
  });
});