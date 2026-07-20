const { test, expect } = require('@playwright/test');
const { logger } = require('../utils/logger');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { data } = require('../data/environment');

test.describe('Dashboard Summary', () => {
  test('QE-3317 TS-001 TC-001: Dashboard summary fields are visible and correct after login', async ({ page }) => {
    logger.info('Launching application and logging in as valid user');
    const loginPage = new LoginPage(page);
    await loginPage.goto(data.baseUrl);
    await loginPage.login(data.validUsername, data.validPassword);
    logger.info('Verifying dashboard is loaded');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboard();
    logger.info('Navigating to dashboard summary section');
    await dashboardPage.gotoSummarySection();
    logger.info('Verifying dashboard summary fields are visible and populated');
    await dashboardPage.assertSummaryFieldsVisible();
  });

  test('QE-3317 TS-002 TC-001: Utilization percentage matches manual calculation', async ({ page }) => {
    logger.info('Logging in and navigating to dashboard summary');
    const loginPage = new LoginPage(page);
    await loginPage.goto(data.baseUrl);
    await loginPage.login(data.validUsername, data.validPassword);
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboard();
    await dashboardPage.gotoSummarySection();
    logger.info('Getting outstanding amount and credit limit');
    const outstanding = await dashboardPage.getOutstandingAmount();
    const creditLimit = await dashboardPage.getTotalCreditLimit();
    logger.info(`Outstanding: ${outstanding}, Credit Limit: ${creditLimit}`);
    const expectedUtilization = Math.round((outstanding / creditLimit) * 100);
    logger.info('Comparing displayed utilization percentage with manual calculation');
    await dashboardPage.assertUtilizationPercentage(expectedUtilization);
  });

  test('QE-3317 TS-003 TC-001: Transaction count updates after new transaction', async ({ page }) => {
    logger.info('Logging in and navigating to dashboard');
    const loginPage = new LoginPage(page);
    await loginPage.goto(data.baseUrl);
    await loginPage.login(data.validUsername, data.validPassword);
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboard();
    logger.info('Getting current month transaction count');
    const initialCount = await dashboardPage.getCurrentMonthTransactionCount();
    logger.info(`Initial transaction count: ${initialCount}`);
    logger.info('Triggering a new transaction');
    await dashboardPage.triggerNewTransaction(data.newTransactionDetails);
    logger.info('Waiting for dashboard to refresh');
    await dashboardPage.waitForTransactionCountUpdate(initialCount);
  });
});
