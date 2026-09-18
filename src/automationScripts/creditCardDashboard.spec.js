const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('Credit Card Dashboard - Unified Multi-Card KPI Tests', () => {

  test('QE-5891 TS-001 TC-001: Verify user with multiple credit cards can view all cards with their KPIs in a unified dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyAllCardsDisplayed(['Visa ending in 1234', 'Mastercard ending in 5678', 'Amex ending in 9012']);
    await dashboardPage.verifyMonthlySpendKPI('Visa ending in 1234', '$1,200');
    await dashboardPage.verifyMonthlySpendKPI('Mastercard ending in 5678', '$850');
    await dashboardPage.verifyMonthlySpendKPI('Amex ending in 9012', '$2,100');
    await dashboardPage.verifyTotalCreditLimitKPI('Visa ending in 1234', '$5,000');
    await dashboardPage.verifyTotalCreditLimitKPI('Mastercard ending in 5678', '$8,000');
    await dashboardPage.verifyTotalCreditLimitKPI('Amex ending in 9012', '$10,000');
    await dashboardPage.verifyAvailableCreditKPI('Visa ending in 1234', '$3,800');
    await dashboardPage.verifyAvailableCreditKPI('Mastercard ending in 5678', '$7,150');
    await dashboardPage.verifyAvailableCreditKPI('Amex ending in 9012', '$7,900');
    await dashboardPage.verifyOutstandingAmountKPI('Visa ending in 1234', '$1,200');
    await dashboardPage.verifyOutstandingAmountKPI('Mastercard ending in 5678', '$850');
    await dashboardPage.verifyOutstandingAmountKPI('Amex ending in 9012', '$2,100');
  });

  test('QE-5891 TS-002 TC-001: Verify full card numbers and CVV are masked or not displayed in the consolidated dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyCardNumberMasked('Visa ending in 1234');
    await dashboardPage.verifyCardNumberMasked('Mastercard ending in 5678');
    await dashboardPage.verifyCardNumberMasked('Amex ending in 9012');
    await dashboardPage.verifyCVVNotDisplayed();
    await dashboardPage.verifySensitiveDetailsProtected();
  });

  test('QE-5891 TS-003 TC-001: Verify appropriate message is displayed when user with no credit cards attempts to access consolidated dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateAsUserWithNoCards();
    await dashboardPage.verifyNoCardsMessage('No credit cards found. Please add a credit card to view your dashboard.');
    await dashboardPage.verifyNoEmptyDashboardElements();
  });

});

test.describe('Credit Card Dashboard - Responsive Multi-Device Layout Tests', () => {

  test('QE-5892 TS-001 TC-001: Verify dashboard displays all card KPIs and controls clearly on desktop browser with proper layout adaptation', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyAllKPIsDisplayed(['Monthly Spend', 'Total Credit Limit', 'Available Credit', 'Outstanding Amount']);
    await dashboardPage.verifyCardListingClear(['Visa ending in 1234', 'Mastercard ending in 5678']);
    await dashboardPage.verifyCardSelectionControlsAccessible();
    await dashboardPage.verifyDesktopLayoutAdaptation();
    await dashboardPage.verifyNoHorizontalScrolling();
  });

  test('QE-5892 TS-002 TC-001: Verify dashboard layout adapts to mobile device resolution and displays all KPIs without noticeable latency', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const dashboardPage = new DashboardPage(page);
    const startTime = Date.now();
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    await dashboardPage.verifyMobileLayoutAdaptation();
    await dashboardPage.verifyAllKPIsDisplayedOnMobile();
    await dashboardPage.verifyCardListingAccessibleOnMobile();
    await dashboardPage.verifyTouchFriendlyControls();
    await dashboardPage.verifyNoHorizontalScrollingOnMobile();
  });

  test('QE-5892 TS-003 TC-001: Verify dashboard handles low bandwidth scenario gracefully without data corruption or unacceptable timeout errors', async ({ page, context }) => {
    await context.route('**/*', route => {
      setTimeout(() => route.continue(), 2000);
    });
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyLoadingIndicatorDisplayed();
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyDataIntegrity();
    await dashboardPage.verifyNoTimeoutErrors();
  });

});

test.describe('Credit Card Dashboard - Card-Wise Transaction Listing Tests', () => {

  test('QE-5893 TS-001 TC-001: Verify user can select a specific card and view its transaction list with outstanding amount and available credit', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyCardSelectionControlDisplaysCards(['Visa ending in 1234', 'Mastercard ending in 5678']);
    await dashboardPage.selectCard('Visa ending in 1234');
    await dashboardPage.verifyCardSelected('Visa ending in 1234');
    await dashboardPage.verifyTransactionListDisplayed(5);
    await dashboardPage.verifyOutstandingAmountDisplayed('$1,250.00');
    await dashboardPage.verifyAvailableCreditDisplayed('$3,750.00');
  });

  test('QE-5893 TS-002 TC-001: Verify no personally identifiable information or sensitive payment data is exposed in transaction details', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.selectCard('Visa ending in 1234');
    await dashboardPage.verifyTransactionListDisplayed(5);
    await dashboardPage.verifyCardNumberMaskedInTransactions('**** **** **** 1234');
    await dashboardPage.verifyCVVNotDisplayedInTransactions();
    await dashboardPage.verifyNoSensitivePaymentDataExposed();
    await dashboardPage.verifyTransactionDetailsAppropriate('2024-01-15', 'Amazon', '$45.99', 'Purchase');
  });

  test('QE-5893 TS-003 TC-001: Verify appropriate message is displayed when selecting a card with no transaction history', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.selectCard('New Visa ending in 9999');
    await dashboardPage.verifyNoTransactionsMessage('No transactions available for this card.');
    await dashboardPage.verifyOutstandingAmountDisplayed('$0.00');
    await dashboardPage.verifyAvailableCreditDisplayed('$5,000.00');
  });

});

test.describe('Credit Card Dashboard - Multi-Card Selection and Switching Tests', () => {

  test('QE-5894 TS-001 TC-001: Verify dashboard updates correctly when switching between cards without degrading loading times', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.selectCard('Visa ending in 1234');
    await dashboardPage.verifyCardDataDisplayed('Visa ending in 1234');
    let startTime = Date.now();
    await dashboardPage.selectCard('Mastercard ending in 5678');
    await dashboardPage.verifyCardDataDisplayed('Mastercard ending in 5678');
    let loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    await dashboardPage.verifyOutstandingAmountDisplayed('$1,200.00');
    await dashboardPage.verifyAvailableCreditDisplayed('$3,800.00');
  });

  test('QE-5894 TS-002 TC-001: Verify dashboard maintains data integrity when rapidly switching between multiple cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.selectCard('Visa ending in 1234');
    await dashboardPage.verifyCardSpecificData('Visa ending in 1234', '$500', '$4,500');
    await dashboardPage.selectCard('Mastercard ending in 5678');
    await dashboardPage.verifyCardSpecificData('Mastercard ending in 5678', '$1,200', '$3,800');
    await dashboardPage.selectCard('Amex ending in 9012');
    await dashboardPage.verifyCardSpecificData('Amex ending in 9012', '$800', '$4,200');
    await dashboardPage.selectCard('Visa ending in 1234');
    await dashboardPage.verifyCardSpecificData('Visa ending in 1234', '$500', '$4,500');
    await dashboardPage.verifyDataIntegrityAcrossSelections();
  });

  test('QE-5894 TS-003 TC-001: Verify appropriate error message when attempting to switch to a deactivated or removed card', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.selectCard('Visa ending in 1234');
    await dashboardPage.verifyCardDataDisplayed('Visa ending in 1234');
    await dashboardPage.attemptSelectDeactivatedCard('Mastercard ending in 9999');
    await dashboardPage.verifyDeactivatedCardErrorMessage('This card has been deactivated and is no longer accessible. Please contact support for assistance.');
    await dashboardPage.verifyDashboardRemainsOnActiveCard('Visa ending in 1234');
  });

});

test.describe('Credit Card Dashboard - Monthly Spend Trends Visualization Tests', () => {

  test('QE-5895 TS-001 TC-001: Verify monthly spend trends chart displays aggregated data per card without revealing individual transaction details', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.verifyAnalyticsSectionLoaded();
    await analyticsPage.accessMonthlySpendTrends();
    await analyticsPage.verifyMonthlySpendTrendsChartDisplayed();
    await analyticsPage.verifyChartDisplaysAggregatedData(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
    await analyticsPage.verifyIndividualTransactionDetailsNotRevealed();
  });

  test('QE-5895 TS-002 TC-001: Verify interactive monthly spend trends chart updates correctly when selecting different time periods or cards', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.verifyAnalyticsSectionLoaded();
    await analyticsPage.accessMonthlySpendTrends();
    await analyticsPage.selectTimePeriod('Last 3 months');
    await analyticsPage.verifyChartUpdatedForPeriod(['Apr', 'May', 'Jun']);
    await analyticsPage.selectTimePeriod('Last 6 months');
    await analyticsPage.verifyChartUpdatedForPeriod(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);
    await analyticsPage.selectCardFilter('Visa ending in 1234');
    await analyticsPage.verifyChartUpdatedForCard('Visa ending in 1234');
    await analyticsPage.selectCardFilter('Mastercard ending in 5678');
    await analyticsPage.verifyChartUpdatedForCard('Mastercard ending in 5678');
  });

  test('QE-5895 TS-003 TC-001: Verify appropriate message is displayed when user has insufficient historical data for trend analysis', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigateAsUserWithLimitedData();
    await analyticsPage.verifyAnalyticsSectionLoaded();
    await analyticsPage.attemptAccessMonthlySpendTrends();
    await analyticsPage.verifyInsufficientDataMessage('Insufficient historical data available. At least 2 months of transaction data required for trend analysis.');
    await analyticsPage.verifyNoIncompleteChartDisplayed();
  });

});

test.describe('Credit Card Dashboard - Category-Wise Spending Insights Tests', () => {

  test('QE-5896 TS-001 TC-001: Verify category-wise spend visualization displays all standard categories with aggregated spend data', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.verifyAnalyticsSectionLoaded();
    await analyticsPage.accessCategoryInsights();
    await analyticsPage.verifyCategoryInsightsDashboardDisplayed();
    await analyticsPage.verifyAllCategoriesDisplayed(['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous']);
    await analyticsPage.verifySensitiveTransactionInfoNotExposed();
  });

  test('QE-5896 TS-002 TC-001: Verify category-wise spending breakdown correctly aggregates transactions and displays accurate spend amounts', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.verifyAnalyticsSectionLoaded();
    await analyticsPage.accessCategoryInsights();
    await analyticsPage.verifyCategorySpendAmount('Food & Dining', '$450.00');
    await analyticsPage.verifyCategorySpendAmount('Fuel', '$200.00');
    await analyticsPage.verifyCategorySpendAmount('Shopping', '$300');
    await analyticsPage.verifyCategorySpendAmount('Travel', '$500');
    await analyticsPage.verifyCategorySpendAmount('Entertainment', '$150');
    await analyticsPage.verifyCategorySpendAmount('Utilities', '$180');
    await analyticsPage.verifyCategorySpendAmount('Healthcare', '$120');
    await analyticsPage.verifyCategorySpendAmount('Education', '$100');
    await analyticsPage.verifyCategorySpendAmount('Miscellaneous', '$80');
    await analyticsPage.verifyTotalSpendMatchesSum('$2,080.00');
  });

  test('QE-5896 TS-003 TC-001: Verify uncategorized transactions are appropriately grouped under Miscellaneous category', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigateAsUserWithUncategorizedTransactions();
    await analyticsPage.verifyAnalyticsSectionLoaded();
    await analyticsPage.accessCategoryInsights();
    await analyticsPage.verifyMiscellaneousCategoryDisplayed();
    await analyticsPage.verifyUncategorizedTransactionsInMiscellaneous('$150.00');
    await analyticsPage.verifySensitiveInfoNotExposedForUncategorized();
  });

});