const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../../utils/logger');
const env = require('../../data/env');

test.describe('Dashboard Summary Scenarios', () => {
  test('QE-3317 TS-001 TC-001: Login and verify dashboard summary fields', async ({ page }) => {
    logger.info('Launching application and logging in as valid user');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(env.APP_URL);
    await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
    logger.info('Navigating to dashboard summary section');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoSummarySection();
    await dashboardPage.assertSummaryFieldsVisible();
    await dashboardPage.assertSummaryFieldsPopulated();
  });

  test('QE-3317 TS-002 TC-001: Utilization percentage calculation and display', async ({ page }) => {
    logger.info('Logging in and navigating to dashboard summary');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(env.APP_URL);
    await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoSummarySection();
    const outstanding = await dashboardPage.getOutstandingAmount();
    const creditLimit = await dashboardPage.getTotalCreditLimit();
    const displayedUtilization = await dashboardPage.getUtilizationPercentage();
    logger.info('Calculating utilization percentage manually');
    const manualUtilization = Math.round((outstanding / creditLimit) * 100);
    expect(displayedUtilization).toBe(manualUtilization);
  });

  test('QE-3317 TS-003 TC-001: Transaction count updates after new transaction', async ({ page }) => {
    logger.info('Logging in and navigating to dashboard');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(env.APP_URL);
    await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.gotoDashboard();
    const initialCount = await dashboardPage.getCurrentMonthTransactionCount();
    logger.info('Triggering a new transaction');
    await dashboardPage.triggerNewTransaction(env.NEW_TRANSACTION_DATA);
    await dashboardPage.waitForTransactionRefresh();
    const updatedCount = await dashboardPage.getCurrentMonthTransactionCount();
    expect(updatedCount).toBeGreaterThan(initialCount);
  });
});