const { test, expect } = require('@playwright/test');
const { logger } = require('../utils/logger');
const { TransactionsSearchPage } = require('./pages/transactions-search.page');
const { data } = require('../data/environment');

test.describe('Transactions Search', () => {
  test('QE-3314 TS-001 TC-001: Search by merchant name filters transactions', async ({ page }) => {
    logger.info('Navigating to transactions page');
    const transactionsSearchPage = new TransactionsSearchPage(page);
    await transactionsSearchPage.goto();
    logger.info('Searching for merchant');
    await transactionsSearchPage.searchByMerchant(data.merchantName);
    logger.info('Verifying only matching transactions are displayed');
    await transactionsSearchPage.assertOnlyMerchantDisplayed(data.merchantName);
  });
});
