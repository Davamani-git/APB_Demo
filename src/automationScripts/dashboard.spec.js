const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../../utils/logger');
const urls = require('../../data/urls');

// QE-3317 TS-001 TC-001: Dashboard summary metrics display

test('QE-3317 TS-001 TC-001 - Dashboard summary metrics display', async ({ page }) => {
  logger.info('Launching application and logging in as valid user');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(urls.appUrl);
  await loginPage.login('validUser', 'validPassword');
  logger.info('Navigating to dashboard summary section');
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.gotoDashboardSummary();
  logger.info('Asserting dashboard summary metrics are visible and populated');
  await dashboardPage.assertSummaryMetricsVisible();
});

// QE-3317 TS-002 TC-001: Utilization percentage calculation

test('QE-3317 TS-002 TC-001 - Utilization percentage calculation', async ({ page }) => {
  logger.info('Login and navigate to dashboard summary');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(urls.appUrl);
  await loginPage.login('validUser', 'validPassword');
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.gotoDashboardSummary();
  logger.info('Extracting outstanding amount and total credit limit');
  const outstanding = await dashboardPage.getOutstandingAmount();
  const creditLimit = await dashboardPage.getCreditLimit();
  logger.info('Calculating utilization percentage manually');
  const expectedUtilization = Math.round((outstanding / creditLimit) * 100);
  const displayedUtilization = await dashboardPage.getUtilizationPercentage();
  expect(displayedUtilization).toBe(expectedUtilization);
});

// QE-3317 TS-003 TC-001: Transaction count updates after new transaction

test('QE-3317 TS-003 TC-001 - Transaction count updates after new transaction', async ({ page }) => {
  logger.info('Login and navigate to dashboard');
  const loginPage = new LoginPage(page);
  await loginPage.navigate(urls.appUrl);
  await loginPage.login('validUser', 'validPassword');
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.gotoDashboardSummary();
  const initialCount = await dashboardPage.getTransactionCount();
  logger.info('Triggering a new transaction');
  await dashboardPage.triggerNewTransaction({amount: 100, merchant: 'Test Merchant'});
  logger.info('Waiting for dashboard to refresh');
  await dashboardPage.waitForRefresh();
  const updatedCount = await dashboardPage.getTransactionCount();
  expect(updatedCount).toBe(initialCount + 1);
});