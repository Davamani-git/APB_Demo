const { test, expect } = require('@playwright/test');
const { TransactionsPage } = require('./pages/transactions.page');
const logger = require('../../utils/logger');
const env = require('../../data/env');

test.describe('Transactions Search Scenarios', () => {
  test('QE-3314 TS-001 TC-001: Search transactions by merchant name', async ({ page }) => {
    logger.info('Navigating to transactions page');
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.gotoTransactionsTable();
    logger.info('Searching for merchant');
    await transactionsPage.searchByMerchant(env.MERCHANT_NAME);
    await transactionsPage.assertSearchResultsByMerchant(env.MERCHANT_NAME);
  });
});