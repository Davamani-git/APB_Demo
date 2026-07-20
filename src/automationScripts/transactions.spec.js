const { test, expect } = require('@playwright/test');
const { logger } = require('../utils/logger');
const { LoginPage } = require('./pages/login.page');
const { TransactionsPage } = require('./pages/transactions.page');
const { data } = require('../data/environment');

test.describe('Transactions Table', () => {
  test('QE-3315 TS-001 TC-001: All columns are visible and populated for each transaction', async ({ page }) => {
    logger.info('Logging in and navigating to transactions table');
    const loginPage = new LoginPage(page);
    await loginPage.goto(data.baseUrl);
    await loginPage.login(data.validUsername, data.validPassword);
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.gotoTable();
    logger.info('Verifying all columns are visible and populated');
    await transactionsPage.assertTransactionColumnsPopulated();
  });

  test('QE-3315 TS-002 TC-001: Table is responsive and usable on all devices', async ({ page, browserName }) => {
    logger.info('Opening transaction table on various devices');
    const loginPage = new LoginPage(page);
    await loginPage.goto(data.baseUrl);
    await loginPage.login(data.validUsername, data.validPassword);
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.gotoTable();
    logger.info('Resizing browser window and changing orientation');
    // Example: test for mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await transactionsPage.assertTableVisible();
    // Example: test for tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await transactionsPage.assertTableVisible();
    // Example: test for desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await transactionsPage.assertTableVisible();
  });
});
