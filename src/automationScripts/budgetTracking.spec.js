const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { BudgetPage } = require('./pages/budget.page');
const logger = require('../../utils/logger');
const env = require('../../data/env');

test.describe('Budget Tracking Scenarios', () => {
  test('QE-3312 TS-001 TC-001: Verify monthly budget, current spend, and remaining budget', async ({ page }) => {
    logger.info('Logging in and navigating to budget tracking section');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(env.APP_URL);
    await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
    const budgetPage = new BudgetPage(page);
    await budgetPage.gotoBudgetTrackingSection();
    await budgetPage.assertBudgetFieldsVisibleAndCorrect();
  });
});