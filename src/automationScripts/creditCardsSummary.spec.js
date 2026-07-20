const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { CreditCardsPage } = require('./pages/creditCards.page');
const logger = require('../../utils/logger');
const env = require('../../data/env');

test.describe('Credit Cards Summary Scenarios', () => {
  test('QE-3316 TS-001 TC-001: Verify all fields for each credit card', async ({ page }) => {
    logger.info('Logging in and navigating to credit cards summary');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(env.APP_URL);
    await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
    const cardsPage = new CreditCardsPage(page);
    await cardsPage.gotoCreditCardsSummary();
    await cardsPage.assertAllFieldsVisibleForEachCard();
  });

  test('QE-3316 TS-002 TC-001: Masked card numbers are displayed', async ({ page }) => {
    logger.info('Navigating to credit cards summary');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(env.APP_URL);
    await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
    const cardsPage = new CreditCardsPage(page);
    await cardsPage.gotoCreditCardsSummary();
    await cardsPage.assertMaskedCardNumbers();
  });
});