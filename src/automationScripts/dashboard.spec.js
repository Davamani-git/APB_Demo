const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { CreditCardsPage } = require('./pages/creditCards.page');
const { TransactionsPage } = require('./pages/transactions.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const { BudgetTrackingPage } = require('./pages/budgetTracking.page');
const { PortfolioPage } = require('./pages/portfolio.page');
const { logger } = require('../../utils/logger');
const env = require('../../data/env');

// QE-3317 TS-001 TC-001
// QE-3317 TS-002 TC-001
// QE-3317 TS-003 TC-001
// QE-3316 TS-001 TC-001
// QE-3316 TS-002 TC-001
// QE-3315 TS-001 TC-001
// QE-3315 TS-002 TC-001
// QE-3314 TS-001 TC-001
// QE-3313 TS-001 TC-001
// QE-3312 TS-001 TC-001
// QE-3378 TS-001 TC-001
// QE-3378 TS-002 TC-001
// QE-3378 TS-003 TC-001
// QE-3377 TS-001 TC-001
// QE-3377 TS-002 TC-001
// QE-3377 TS-003 TC-001
// QE-3376 TS-001 TC-001
// QE-3376 TS-002 TC-001
// QE-3376 TS-003 TC-001
// QE-3375 TS-001 TC-001
// QE-3397 TS-001 TC-001
// QE-3397 TS-002 TC-001
// QE-3397 TS-003 TC-001
// QE-3396 TS-001 TC-001
// QE-3396 TS-002 TC-001
// QE-3395 TS-001 TC-001
// QE-3395 TS-002 TC-001
// QE-3395 TS-003 TC-001
// QE-3394 TS-001 TC-001
// QE-3394 TS-002 TC-001

// QE-3317 TS-001 TC-001
// Launch and login, dashboard loads, summary section visible, fields populated

test('QE-3317 TS-001 TC-001: Dashboard summary fields visible and populated', async ({ page }) => {
  logger.info('Starting QE-3317 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.waitForDashboardLoaded();
  await dashboardPage.goToSummarySection();
  await dashboardPage.assertSummaryFieldsPopulated();
});

// QE-3317 TS-002 TC-001
// Utilization percentage calculation and display

test('QE-3317 TS-002 TC-001: Utilization percentage matches manual calculation', async ({ page }) => {
  logger.info('Starting QE-3317 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.waitForDashboardLoaded();
  await dashboardPage.goToSummarySection();
  const values = await dashboardPage.getOutstandingAndCreditLimit();
  const manualUtilization = Math.round((values.outstanding / values.creditLimit) * 100);
  const displayedUtilization = await dashboardPage.getUtilizationPercentage();
  expect(displayedUtilization).toBe(manualUtilization);
});

// QE-3317 TS-003 TC-001
// Transaction count updates after new transaction and refresh

test('QE-3317 TS-003 TC-001: Transaction count updates after new transaction', async ({ page }) => {
  logger.info('Starting QE-3317 TS-003 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.waitForDashboardLoaded();
  const initialCount = await dashboardPage.getTransactionCount();
  await dashboardPage.addNewTransaction(env.NEW_TRANSACTION);
  await dashboardPage.waitForRefresh();
  const updatedCount = await dashboardPage.getTransactionCount();
  expect(updatedCount).toBeGreaterThan(initialCount);
});

// QE-3316 TS-001 TC-001
// Credit cards summary fields visible

test('QE-3316 TS-001 TC-001: Credit cards summary fields visible', async ({ page }) => {
  logger.info('Starting QE-3316 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const creditCardsPage = new CreditCardsPage(page);
  await creditCardsPage.goToSummarySection();
  await creditCardsPage.assertAllCardFieldsVisible();
});

// QE-3316 TS-002 TC-001
// Masked card numbers visible only

test('QE-3316 TS-002 TC-001: Masked card numbers visible only', async ({ page }) => {
  logger.info('Starting QE-3316 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const creditCardsPage = new CreditCardsPage(page);
  await creditCardsPage.goToSummarySection();
  await creditCardsPage.assertMaskedCardNumbers();
});

// QE-3315 TS-001 TC-001
// Transactions table columns visible

test('QE-3315 TS-001 TC-001: Transactions table columns visible', async ({ page }) => {
  logger.info('Starting QE-3315 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsTable();
  await transactionsPage.assertTransactionColumnsVisible();
});

// QE-3315 TS-002 TC-001
// Transactions table responsive on devices

test('QE-3315 TS-002 TC-001: Transactions table responsive on devices', async ({ page, browserName }) => {
  logger.info('Starting QE-3315 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsTable();
  await transactionsPage.assertResponsiveLayout();
});

// QE-3314 TS-001 TC-001
// Merchant name search filters transactions

test('QE-3314 TS-001 TC-001: Merchant name search filters transactions', async ({ page }) => {
  logger.info('Starting QE-3314 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsTable();
  await transactionsPage.searchMerchant(env.MERCHANT_NAME);
  await transactionsPage.assertMerchantFilterResults(env.MERCHANT_NAME);
});

// QE-3313 TS-001 TC-001
// Analytics charts for selected period

test('QE-3313 TS-001 TC-001: Analytics charts for selected period', async ({ page }) => {
  logger.info('Starting QE-3313 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const analyticsPage = new AnalyticsPage(page);
  await analyticsPage.goToAnalyticsSection();
  await analyticsPage.selectPeriod(env.ANALYTICS_PERIOD);
  await analyticsPage.assertChartsVisible();
});

// QE-3312 TS-001 TC-001
// Budget tracking values visible and correct

test('QE-3312 TS-001 TC-001: Budget tracking values visible and correct', async ({ page }) => {
  logger.info('Starting QE-3312 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const budgetTrackingPage = new BudgetTrackingPage(page);
  await budgetTrackingPage.goToBudgetTrackingSection();
  await budgetTrackingPage.assertBudgetValues(env.BUDGET_CONFIG);
});

// QE-3378 TS-001 TC-001
// Dashboard summary for selected month

test('QE-3378 TS-001 TC-001: Dashboard summary for selected month', async ({ page }) => {
  logger.info('Starting QE-3378 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.selectMonth('May 2024');
  await dashboardPage.assertSummaryMetrics(env.EXPECTED_METRICS);
});

// QE-3378 TS-002 TC-001
// Dashboard summary for no data month

test('QE-3378 TS-002 TC-001: Dashboard summary for no data month', async ({ page }) => {
  logger.info('Starting QE-3378 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.selectMonth('June 2022');
  await dashboardPage.assertNoDataSummary();
});

// QE-3378 TS-003 TC-001
// Refresh dashboard summary after data update

test('QE-3378 TS-003 TC-001: Refresh dashboard summary after data update', async ({ page }) => {
  logger.info('Starting QE-3378 TS-003 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.goToSummarySection();
  await dashboardPage.addNewTransaction(env.NEW_TRANSACTION);
  await dashboardPage.refreshSummary();
  await dashboardPage.assertNoSensitiveData();
});

// QE-3377 TS-001 TC-001
// Credit cards details with masking

test('QE-3377 TS-001 TC-001: Credit cards details with masking', async ({ page }) => {
  logger.info('Starting QE-3377 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const creditCardsPage = new CreditCardsPage(page);
  await creditCardsPage.goToCreditCardsSection();
  await creditCardsPage.assertCardDetailsMasked();
});

// QE-3377 TS-002 TC-001
// Cards with zero outstanding

test('QE-3377 TS-002 TC-001: Cards with zero outstanding', async ({ page }) => {
  logger.info('Starting QE-3377 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const creditCardsPage = new CreditCardsPage(page);
  await creditCardsPage.goToCreditCardsSection();
  await creditCardsPage.assertZeroOutstandingCards();
});

// QE-3377 TS-003 TC-001
// Cards with billing/due dates within 7 days

test('QE-3377 TS-003 TC-001: Cards with billing/due dates within 7 days', async ({ page }) => {
  logger.info('Starting QE-3377 TS-003 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const creditCardsPage = new CreditCardsPage(page);
  await creditCardsPage.goToCreditCardsSection();
  await creditCardsPage.assertUpcomingBillingDueDates();
});

// QE-3376 TS-001 TC-001
// Transactions section, masked card, all columns

test('QE-3376 TS-001 TC-001: Transactions section, masked card, all columns', async ({ page }) => {
  logger.info('Starting QE-3376 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsSection();
  await transactionsPage.assertTransactionColumnsMasked();
});

// QE-3376 TS-002 TC-001
// Transactions section responsive on devices

test('QE-3376 TS-002 TC-001: Transactions section responsive on devices', async ({ page, browserName }) => {
  logger.info('Starting QE-3376 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsSection();
  await transactionsPage.assertResponsiveLayout();
});

// QE-3376 TS-003 TC-001
// Filter for no matching transactions

test('QE-3376 TS-003 TC-001: Filter for no matching transactions', async ({ page }) => {
  logger.info('Starting QE-3376 TS-003 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsSection();
  await transactionsPage.applyNoMatchFilters(env.NO_MATCH_FILTERS);
  await transactionsPage.assertNoTransactionsFound();
});

// QE-3375 TS-001 TC-001
// Merchant search, no sensitive identifiers

test('QE-3375 TS-001 TC-001: Merchant search, no sensitive identifiers', async ({ page }) => {
  logger.info('Starting QE-3375 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsSection();
  await transactionsPage.searchMerchant('ABC Retail');
  await transactionsPage.assertNoSensitiveIdentifiers();
});

// QE-3397 TS-001 TC-001
// Dashboard home page and period selection

test('QE-3397 TS-001 TC-001: Dashboard home page and period selection', async ({ page }) => {
  logger.info('Starting QE-3397 TS-001 TC-001');
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.navigate('https://dashboard.example.com');
  await dashboardPage.selectDateRange('01-Apr-2024', '30-Apr-2024');
  await dashboardPage.assertSummaryMetricsVisible();
});

// QE-3397 TS-002 TC-001
// Change month/date range, check for cardholder identifiers

test('QE-3397 TS-002 TC-001: Change month/date range, check for cardholder identifiers', async ({ page }) => {
  logger.info('Starting QE-3397 TS-002 TC-001');
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.goToSummaryMetricsSection();
  await dashboardPage.selectDateRange('01-Mar-2024', '31-Mar-2024');
  await dashboardPage.assertNoCardholderIdentifiers();
});

// QE-3397 TS-003 TC-001
// Dashboard on unsupported device/browser

test('QE-3397 TS-003 TC-001: Dashboard on unsupported device/browser', async ({ page }) => {
  logger.info('Starting QE-3397 TS-003 TC-001');
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.openOnUnsupportedDevice(env.UNSUPPORTED_DEVICE);
  await dashboardPage.assertSummarySectionVisible();
  await dashboardPage.assertNoDisplayIssues();
});

// QE-3396 TS-001 TC-001
// Portfolio summary, card details

test('QE-3396 TS-001 TC-001: Portfolio summary, card details', async ({ page }) => {
  logger.info('Starting QE-3396 TS-001 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const portfolioPage = new PortfolioPage(page);
  await portfolioPage.goToSummarySection();
  await portfolioPage.assertAllCardDetailsVisible();
});

// QE-3396 TS-002 TC-001
// Select card, check for sensitive info

test('QE-3396 TS-002 TC-001: Select card, check for sensitive info', async ({ page }) => {
  logger.info('Starting QE-3396 TS-002 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
  const portfolioPage = new PortfolioPage(page);
  await portfolioPage.goToSummarySection();
  await portfolioPage.selectCard('Visa Platinum ending 1234');
  await portfolioPage.assertNoSensitiveInfo();
});

// QE-3395 TS-001 TC-001
// Transaction table columns

test('QE-3395 TS-001 TC-001: Transaction table columns', async ({ page }) => {
  logger.info('Starting QE-3395 TS-001 TC-001');
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsSection();
  await transactionsPage.assertTransactionColumnsVisible();
});

// QE-3395 TS-002 TC-001
// Responsive table layout

test('QE-3395 TS-002 TC-001: Responsive table layout', async ({ page, browserName }) => {
  logger.info('Starting QE-3395 TS-002 TC-001');
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsSection();
  await transactionsPage.assertResponsiveLayout();
});

// QE-3395 TS-003 TC-001
// No transactions message

test('QE-3395 TS-003 TC-001: No transactions message', async ({ page }) => {
  logger.info('Starting QE-3395 TS-003 TC-001');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(env.URL);
  await loginPage.login('testuser_no_txn', env.VALID_PASSWORD);
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsSection();
  await transactionsPage.assertNoTransactionsMessage();
});

// QE-3394 TS-001 TC-001
// Merchant search

test('QE-3394 TS-001 TC-001: Merchant search', async ({ page }) => {
  logger.info('Starting QE-3394 TS-001 TC-001');
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsSection();
  await transactionsPage.searchMerchant('Starbucks');
  await transactionsPage.assertMerchantFilterResults('Starbucks');
});

// QE-3394 TS-002 TC-001
// Apply filters

test('QE-3394 TS-002 TC-001: Apply filters', async ({ page }) => {
  logger.info('Starting QE-3394 TS-002 TC-001');
  const transactionsPage = new TransactionsPage(page);
  await transactionsPage.goToTransactionsSection();
  await transactionsPage.openFilterPanel();
  await transactionsPage.applyFilters({
    category: 'Dining',
    institution: 'ABC Bank',
    card: 'Visa Platinum',
    dateRange: { from: '01-Apr-2024', to: '15-Apr-2024' }
  });
  await transactionsPage.assertFilterResults({
    category: 'Dining',
    institution: 'ABC Bank',
    card: 'Visa Platinum',
    dateRange: { from: '01-Apr-2024', to: '15-Apr-2024' }
  });
});
