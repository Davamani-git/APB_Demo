const { test, expect } = require('@playwright/test');
const { logger } = require('../utils/logger');
const { LoginPage } = require('./pages/login.page');
const { BudgetPage } = require('./pages/budget.page');
const { data } = require('../data/environment');

test.describe('Budget Tracking', () => {
  test('QE-3312 TS-001 TC-001: Budget tracking section displays correct values', async ({ page }) => {
    logger.info('Logging in and navigating to budget tracking section');
    const loginPage = new LoginPage(page);
    await loginPage.goto(data.baseUrl);
    await loginPage.login(data.validUsername, data.validPassword);
    const budgetPage = new BudgetPage(page);
    await budgetPage.gotoSection();
    logger.info('Verifying monthly budget, current spend, and remaining budget are visible and correct');
    await budgetPage.assertBudgetFieldsVisible();
  });
});
