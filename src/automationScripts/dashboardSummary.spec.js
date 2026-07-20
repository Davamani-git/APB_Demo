const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../../utils/logger');
const testData = require('../../data/testData');

test.describe('Dashboard Summary Test Suite', () => {
  test('QE-3317 TS-001 TC-001 - Dashboard summary metrics are visible for current month', async ({ page }) => {
    logger.info('Launching application and logging in as valid user');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(testData.URL);
    await loginPage.login(testData.validUsername, testData.validPassword);
    logger.info('Navigating to dashboard summary section');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoSummarySection();
    await dashboardPage.assertSummarySectionVisible();
    logger.info('Validating summary metrics for current month');
    await dashboardPage.assertSummaryMetricsPopulated(testData.currentMonthFinancialData);
  });

  test('QE-3317 TS-002 TC-001 - Utilization percentage matches manual calculation', async ({ page }) => {
    logger.info('Logging in and navigating to dashboard summary');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(testData.URL);
    await loginPage.login(testData.validUsername, testData.validPassword);
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoSummarySection();
    await dashboardPage.assertSummarySectionVisible();
    logger.info('Validating outstanding amount and credit limit');
    const outstanding = await dashboardPage.getOutstandingAmount();
    const creditLimit = await dashboardPage.getTotalCreditLimit();
    expect(outstanding).toBeDefined();
    expect(creditLimit).toBeDefined();
    logger.info('Comparing utilization percentage with manual calculation');
    const utilization = await dashboardPage.getUtilizationPercentage();
    const manualUtilization = Math.round((outstanding / creditLimit) * 100);
    expect(utilization).toBe(manualUtilization);
  });

  test('QE-3317 TS-003 TC-001 - Transaction count updates after new transaction', async ({ page }) => {
    logger.info('Logging in and navigating to dashboard');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(testData.URL);
    await loginPage.login(testData.validUsername, testData.validPassword);
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoSummarySection();
    await dashboardPage.assertSummarySectionVisible();
    logger.info('Getting current transaction count');
    const initialCount = await dashboardPage.getTransactionCount(testData.currentMonth);
    logger.info('Triggering new transaction');
    await dashboardPage.addNewTransaction(testData.newTransactionDetails);
    await dashboardPage.waitForRefreshCycle();
    const updatedCount = await dashboardPage.getTransactionCount(testData.currentMonth);
    expect(updatedCount).toBe(initialCount + 1);
  });
});