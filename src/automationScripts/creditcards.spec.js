const { test, expect } = require('@playwright/test');
const { logger } = require('../utils/logger');
const { LoginPage } = require('./pages/login.page');
const { CreditCardsPage } = require('./pages/creditcards.page');
const { data } = require('../data/environment');

test.describe('Credit Cards Summary', () => {
  test('QE-3316 TS-001 TC-001: Credit cards summary fields are visible for each card', async ({ page }) => {
    logger.info('Logging in and navigating to credit cards summary section');
    const loginPage = new LoginPage(page);
    await loginPage.goto(data.baseUrl);
    await loginPage.login(data.validUsername, data.validPassword);
    const creditCardsPage = new CreditCardsPage(page);
    await creditCardsPage.gotoSummary();
    logger.info('Verifying all credit card fields are displayed');
    await creditCardsPage.assertAllCardFieldsVisible();
  });

  test('QE-3316 TS-002 TC-001: Only masked card numbers are displayed', async ({ page }) => {
    logger.info('Navigating to credit cards summary');
    const loginPage = new LoginPage(page);
    await loginPage.goto(data.baseUrl);
    await loginPage.login(data.validUsername, data.validPassword);
    const creditCardsPage = new CreditCardsPage(page);
    await creditCardsPage.gotoSummary();
    logger.info('Verifying only masked card numbers are shown');
    await creditCardsPage.assertCardNumbersMasked();
  });
});
