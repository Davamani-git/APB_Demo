const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { TransactionsPage } = require('./pages/transactions.page');
const logger = require('../../utils/logger');
const env = require('../../data/env');

test.describe('Transactions Table Scenarios', () => {
  test('QE-3315 TS-001 TC-001: Verify all columns for each transaction', async ({ page }) => {
    logger.info('Logging in and navigating to transactions table');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(env.APP_URL);
    await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.gotoTransactionsTable();
    await transactionsPage.assertAllColumnsVisibleForEachTransaction();
  });

  test('QE-3315 TS-002 TC-001: Responsive transactions table', async ({ page }) => {
    logger.info('Opening transaction table on various devices');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(env.APP_URL);
    await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.gotoTransactionsTable();
    await transactionsPage.assertTableResponsive();
  });
});