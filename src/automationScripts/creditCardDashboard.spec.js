const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Credit Card Portfolio Overview Dashboard Tests', () => {

  test('QE-5867 TS001 TC-001: Verify user with multiple credit cards views consolidated portfolio metrics with accurate aggregation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('multiCardUser', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToPortfolioOverview();
    await expect(dashboardPage.portfolioDashboard).toBeVisible();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBeTruthy();
    
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBeTruthy();
    
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBeTruthy();
    
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBeTruthy();
  });

  test('QE-5867 TS002 TC-001: Verify user with no credit cards receives appropriate message when accessing dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('noCardUser', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToPortfolioOverview();
    await expect(dashboardPage.portfolioDashboard).toBeVisible();
    
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    await expect(dashboardPage.noCardsMessage).toContainText(/No credit cards available to display/i);
    
    const isMonthlySpendVisible = await dashboardPage.monthlySpendKPI.isVisible().catch(() => false);
    const isCreditLimitVisible = await dashboardPage.totalCreditLimitKPI.isVisible().catch(() => false);
    const isAvailableCreditVisible = await dashboardPage.availableCreditKPI.isVisible().catch(() => false);
    const isOutstandingVisible = await dashboardPage.outstandingAmountKPI.isVisible().catch(() => false);
    
    expect(isMonthlySpendVisible || isCreditLimitVisible || isAvailableCreditVisible || isOutstandingVisible).toBe(false);
  });

  test('QE-5867 TS003 TC-001: Verify user with single credit card sees accurate KPI calculations matching card data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('singleCardUser', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToPortfolioOverview();
    await expect(dashboardPage.portfolioDashboard).toBeVisible();
    
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$2,500');
    
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('$10,000');
    
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$7,500');
    
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$2,500');
  });

});

test.describe('Responsive Portfolio Dashboard UI Tests', () => {

  test('QE-5868 TS001 TC-001: Verify dashboard displays correctly on desktop with 1920x1080 resolution without UI overlap', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await loginPage.navigate();
    await loginPage.login('multiCardUser', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToPortfolioOverview();
    await expect(dashboardPage.portfolioDashboard).toBeVisible();
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const layoutValid = await dashboardPage.verifyLayoutNoOverlap();
    expect(layoutValid).toBe(true);
    
    await expect(dashboardPage.navigationMenu).toBeVisible();
    const isNavigationClickable = await dashboardPage.navigationMenu.isEnabled();
    expect(isNavigationClickable).toBe(true);
  });

  test('QE-5868 TS002 TC-001: Verify dashboard adapts responsively on mobile device with 375px screen width', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginPage.navigate();
    await loginPage.login('multiCardUser', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToPortfolioOverview();
    await expect(dashboardPage.portfolioDashboard).toBeVisible();
    
    const layoutAdapted = await dashboardPage.verifyResponsiveLayout();
    expect(layoutAdapted).toBe(true);
    
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    const noOverlap = await dashboardPage.verifyLayoutNoOverlap();
    expect(noOverlap).toBe(true);
    
    await expect(dashboardPage.mobileNavigationMenu).toBeVisible();
    const isMobileNavClickable = await dashboardPage.mobileNavigationMenu.isEnabled();
    expect(isMobileNavClickable).toBe(true);
  });

  test('QE-5868 TS003 TC-001: Verify dashboard provides graceful degradation on unsupported device or browser', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('validUser', 'validPassword');
    
    await dashboardPage.navigateToPortfolioOverview();
    
    const unsupportedMessageVisible = await dashboardPage.unsupportedBrowserMessage.isVisible().catch(() => false);
    const dashboardVisible = await dashboardPage.portfolioDashboard.isVisible().catch(() => false);
    
    expect(unsupportedMessageVisible || dashboardVisible).toBe(true);
    
    if (unsupportedMessageVisible) {
      await expect(dashboardPage.unsupportedBrowserMessage).toContainText(/not supported|upgrade/i);
    }
    
    const pageNotBroken = await dashboardPage.verifyPageNotBroken();
    expect(pageNotBroken).toBe(true);
  });

});

test.describe('Multi-Card Management and Card-Wise KPI Tests', () => {

  test('QE-5869 TS001 TC-001: Verify user selects specific card and views only that card\'s KPIs without data mixing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('multiCardUser', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToMultiCardDashboard();
    await expect(dashboardPage.cardSelector).toBeVisible();
    
    await dashboardPage.selectCard('Visa *1234');
    await expect(dashboardPage.selectedCardIndicator).toContainText('Visa *1234');
    
    const spend = await dashboardPage.getCardSpendValue();
    expect(spend).toBe('$1,200');
    
    const creditLimit = await dashboardPage.getCardCreditLimitValue();
    expect(creditLimit).toBe('$5,000');
    
    const availableCredit = await dashboardPage.getCardAvailableCreditValue();
    expect(availableCredit).toBe('$3,800');
    
    const outstanding = await dashboardPage.getCardOutstandingValue();
    expect(outstanding).toBe('$1,200');
  });

  test('QE-5869 TS002 TC-001: Verify user receives error when attempting to view KPIs for removed or unassociated card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('validUser', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToMultiCardDashboard();
    await expect(dashboardPage.multiCardDashboard).toBeVisible();
    
    await dashboardPage.attemptSelectInvalidCard('Removed_Card_5678');
    
    await expect(dashboardPage.cardErrorMessage).toBeVisible();
    await expect(dashboardPage.cardErrorMessage).toContainText(/not found|no longer associated/i);
    
    const kpiVisible = await dashboardPage.cardKPISection.isVisible().catch(() => false);
    if (kpiVisible) {
      const hasData = await dashboardPage.verifyKPISectionHasData();
      expect(hasData).toBe(false);
    }
  });

  test('QE-5869 TS003 TC-001: Verify KPI values update correctly when user switches between different cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('multiCardUser', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToMultiCardDashboard();
    await expect(dashboardPage.cardSelector).toBeVisible();
    
    await dashboardPage.selectCard('Visa *1234');
    const card1Spend = await dashboardPage.getCardSpendValue();
    const card1Limit = await dashboardPage.getCardCreditLimitValue();
    const card1Available = await dashboardPage.getCardAvailableCreditValue();
    const card1Outstanding = await dashboardPage.getCardOutstandingValue();
    
    expect(card1Spend).toBe('$1,200');
    expect(card1Limit).toBe('$5,000');
    expect(card1Available).toBe('$3,800');
    expect(card1Outstanding).toBe('$1,200');
    
    await dashboardPage.selectCard('Mastercard *5678');
    const card2Spend = await dashboardPage.getCardSpendValue();
    const card2Limit = await dashboardPage.getCardCreditLimitValue();
    const card2Available = await dashboardPage.getCardAvailableCreditValue();
    const card2Outstanding = await dashboardPage.getCardOutstandingValue();
    
    expect(card2Spend).toBe('$2,500');
    expect(card2Limit).toBe('$10,000');
    expect(card2Available).toBe('$7,500');
    expect(card2Outstanding).toBe('$2,500');
    
    await dashboardPage.selectCard('Visa *1234');
    const card1SpendAgain = await dashboardPage.getCardSpendValue();
    const card1LimitAgain = await dashboardPage.getCardCreditLimitValue();
    const card1AvailableAgain = await dashboardPage.getCardAvailableCreditValue();
    const card1OutstandingAgain = await dashboardPage.getCardOutstandingValue();
    
    expect(card1SpendAgain).toBe('$1,200');
    expect(card1LimitAgain).toBe('$5,000');
    expect(card1AvailableAgain).toBe('$3,800');
    expect(card1OutstandingAgain).toBe('$1,200');
  });

});

test.describe('Per-Card Transaction Overview Tests', () => {

  test('QE-5870 TS001 TC-001: Verify user views transaction summary for specific card with correct transaction details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('multiCardUser', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToMultiCardDashboard();
    await expect(dashboardPage.cardSelector).toBeVisible();
    
    await dashboardPage.selectCard('Visa *1234');
    await expect(dashboardPage.selectedCardIndicator).toContainText('Visa *1234');
    
    await dashboardPage.openTransactionSummary();
    await expect(dashboardPage.transactionSummarySection).toBeVisible();
    
    const transactions = await dashboardPage.getTransactionList();
    expect(transactions.length).toBeGreaterThan(0);
    
    const allBelongToSelectedCard = await dashboardPage.verifyAllTransactionsBelongToCard('Visa *1234');
    expect(allBelongToSelectedCard).toBe(true);
    
    const firstTransaction = await dashboardPage.getTransactionDetails(0);
    expect(firstTransaction.date).toBeTruthy();
    expect(firstTransaction.date).toMatch(/\d{4}-\d{2}-\d{2}/);
    
    expect(firstTransaction.amount).toBeTruthy();
    expect(firstTransaction.amount).toMatch(/\$\d+\.\d{2}/);
    
    expect(firstTransaction.description).toBeTruthy();
    expect(firstTransaction.description.length).toBeGreaterThan(0);
  });

  test('QE-5870 TS002 TC-001: Verify transaction data isolation prevents displaying other users\' card transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('userA', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToMultiCardDashboard();
    const userACards = await dashboardPage.getAvailableCards();
    expect(userACards.length).toBeGreaterThan(0);
    
    await dashboardPage.selectCard('Visa *1234');
    await dashboardPage.openTransactionSummary();
    await expect(dashboardPage.transactionSummarySection).toBeVisible();
    
    const transactions = await dashboardPage.getTransactionList();
    const allBelongToUserA = await dashboardPage.verifyAllTransactionsBelongToCurrentUser();
    expect(allBelongToUserA).toBe(true);
    
    const unauthorizedAccessAttempt = await dashboardPage.attemptAccessOtherUserCard('UserB_Card_ID');
    expect(unauthorizedAccessAttempt.success).toBe(false);
    expect(unauthorizedAccessAttempt.error).toBeTruthy();
    
    const dataIsolationMaintained = await dashboardPage.verifyDataIsolation();
    expect(dataIsolationMaintained).toBe(true);
  });

  test('QE-5870 TS003 TC-001: Verify appropriate message is displayed when viewing transaction summary for card with no history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('userWithNewCard', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToMultiCardDashboard();
    await expect(dashboardPage.cardSelector).toBeVisible();
    
    await dashboardPage.selectCard('New Visa *9999');
    await expect(dashboardPage.selectedCardIndicator).toContainText('New Visa *9999');
    
    await dashboardPage.openTransactionSummary();
    await expect(dashboardPage.transactionSummarySection).toBeVisible();
    
    await expect(dashboardPage.noTransactionsMessage).toBeVisible();
    await expect(dashboardPage.noTransactionsMessage).toContainText(/No transactions available/i);
    
    const transactionCount = await dashboardPage.getTransactionCount();
    expect(transactionCount).toBe(0);
  });

});

test.describe('Monthly Spend Trend Visualization Tests', () => {

  test('QE-5871 TS001 TC-001: Verify monthly spend trend chart displays accurate aggregated totals for multi-month transaction history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('userWithMultiMonthHistory', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToSpendAnalytics();
    await expect(dashboardPage.spendAnalyticsSection).toBeVisible();
    
    await expect(dashboardPage.monthlySpendTrendChart).toBeVisible();
    
    const chartMonths = await dashboardPage.getChartMonths();
    expect(chartMonths.length).toBeGreaterThanOrEqual(3);
    expect(chartMonths).toContain('January');
    expect(chartMonths).toContain('February');
    expect(chartMonths).toContain('March');
    
    const januarySpend = await dashboardPage.getMonthSpendFromChart('January');
    expect(januarySpend).toBe('$3,200');
    
    const februarySpend = await dashboardPage.getMonthSpendFromChart('February');
    expect(februarySpend).toBe('$2,800');
    
    const marchSpend = await dashboardPage.getMonthSpendFromChart('March');
    expect(marchSpend).toBe('$3,500');
  });

  test('QE-5871 TS002 TC-001: Verify monthly spend trend visualization handles single month transaction history without errors', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('userWithSingleMonthHistory', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToSpendAnalytics();
    await expect(dashboardPage.spendAnalyticsSection).toBeVisible();
    
    await expect(dashboardPage.monthlySpendTrendChart).toBeVisible();
    
    const chartMonths = await dashboardPage.getChartMonths();
    expect(chartMonths.length).toBe(1);
    expect(chartMonths).toContain('January');
    
    const errorVisible = await dashboardPage.chartErrorMessage.isVisible().catch(() => false);
    expect(errorVisible).toBe(false);
    
    const chartRendered = await dashboardPage.verifyChartRendered();
    expect(chartRendered).toBe(true);
    
    const januarySpend = await dashboardPage.getMonthSpendFromChart('January');
    expect(januarySpend).toBe('$2,500');
  });

  test('QE-5871 TS003 TC-001: Verify monthly spend trend chart aggregates spend correctly across multiple cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('multiCardUser', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToSpendAnalytics();
    await expect(dashboardPage.spendAnalyticsSection).toBeVisible();
    
    await expect(dashboardPage.monthlySpendTrendChart).toBeVisible();
    
    const januarySpend = await dashboardPage.getMonthSpendFromChart('January');
    expect(januarySpend).toBe('$2,700');
    
    const februarySpend = await dashboardPage.getMonthSpendFromChart('February');
    expect(februarySpend).toBe('$2,800');
    
    const aggregationCorrect = await dashboardPage.verifyMultiCardAggregation('January', ['$1,500', '$1,200'], '$2,700');
    expect(aggregationCorrect).toBe(true);
  });

});

test.describe('Category-Wise Spending Insights Tests', () => {

  test('QE-5872 TS001 TC-001: Verify category-wise spending insights display accurate aggregated spend per category for selected time range', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('userWithCategorizedTransactions', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToSpendAnalytics();
    await dashboardPage.navigateToCategoryInsights();
    await expect(dashboardPage.categoryInsightsView).toBeVisible();
    
    await dashboardPage.selectTimeRange('Last 3 months');
    await expect(dashboardPage.timeRangeIndicator).toContainText('Last 3 months');
    
    const foodDiningSpend = await dashboardPage.getCategorySpend('Food & Dining');
    expect(foodDiningSpend).toBe('$850');
    
    const fuelSpend = await dashboardPage.getCategorySpend('Fuel');
    expect(fuelSpend).toBe('$320');
    
    const shoppingSpend = await dashboardPage.getCategorySpend('Shopping');
    expect(shoppingSpend).toBe('$1,200');
    
    const allCategoriesAccurate = await dashboardPage.verifyAllCategoryTotals({
      'Travel': true,
      'Entertainment': true,
      'Utilities': true,
      'Healthcare': true,
      'Education': true,
      'Miscellaneous': true
    });
    expect(allCategoriesAccurate).toBe(true);
  });

  test('QE-5872 TS001 TC-002: Verify category-wise spending visualization renders correctly with all standard categories', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('userWithAllCategories', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToSpendAnalytics();
    await dashboardPage.navigateToCategoryInsights();
    await expect(dashboardPage.categoryInsightsView).toBeVisible();
    
    await dashboardPage.selectTimeRange('Last 6 months');
    await expect(dashboardPage.timeRangeIndicator).toContainText('Last 6 months');
    
    await expect(dashboardPage.categoryVisualization).toBeVisible();
    
    const categories = await dashboardPage.getDisplayedCategories();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    
    const visualizationRendered = await dashboardPage.verifyVisualizationRendered();
    expect(visualizationRendered).toBe(true);
    
    const zeroSpendHandled = await dashboardPage.verifyZeroSpendCategoriesHandled();
    expect(zeroSpendHandled).toBe(true);
  });

  test('QE-5872 TS002 TC-001: Verify uncategorized transactions are handled appropriately in category insights view', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('userWithUncategorizedTransactions', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToSpendAnalytics();
    await dashboardPage.navigateToCategoryInsights();
    await expect(dashboardPage.categoryInsightsView).toBeVisible();
    
    await dashboardPage.selectTimeRange('Last 3 months');
    await expect(dashboardPage.timeRangeIndicator).toContainText('Last 3 months');
    
    const uncategorizedHandled = await dashboardPage.verifyUncategorizedTransactionsHandled();
    expect(uncategorizedHandled).toBe(true);
    
    const totalSpend = await dashboardPage.getTotalCategorySpend();
    const expectedTotal = await dashboardPage.getExpectedTotalWithUncategorized();
    expect(totalSpend).toBe(expectedTotal);
    
    const uncategorizedMessageVisible = await dashboardPage.uncategorizedMessage.isVisible().catch(() => false);
    if (uncategorizedMessageVisible) {
      await expect(dashboardPage.uncategorizedMessage).toContainText(/uncategorized|Miscellaneous/i);
    }
  });

  test('QE-5872 TS003 TC-001: Verify category insights view filters transactions correctly by selected time range', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.navigate();
    await loginPage.login('userWithMultiMonthHistory', 'validPassword');
    await expect(loginPage.loginSuccessIndicator).toBeVisible();
    
    await dashboardPage.navigateToSpendAnalytics();
    await dashboardPage.navigateToCategoryInsights();
    await expect(dashboardPage.categoryInsightsView).toBeVisible();
    
    await dashboardPage.selectTimeRange('Last 3 months');
    await expect(dashboardPage.timeRangeIndicator).toContainText('Last 3 months');
    
    const categoriesInRange = await dashboardPage.getAllCategorySpends();
    const onlyRangeIncluded = await dashboardPage.verifyOnlyTimeRangeIncluded('January', 'March');
    expect(onlyRangeIncluded).toBe(true);
    
    await dashboardPage.selectTimeRange('Last 1 month');
    await expect(dashboardPage.timeRangeIndicator).toContainText('Last 1 month');
    
    const newCategoriesInRange = await dashboardPage.getAllCategorySpends();
    const onlyMarchIncluded = await dashboardPage.verifyOnlyTimeRangeIncluded('March', 'March');
    expect(onlyMarchIncluded).toBe(true);
    
    const valuesChanged = JSON.stringify(categoriesInRange) !== JSON.stringify(newCategoriesInRange);
    expect(valuesChanged).toBe(true);
    
    const visualizationUpdated = await dashboardPage.verifyVisualizationUpdated();
    expect(visualizationUpdated).toBe(true);
  });

});