const { test, expect } = require('@playwright/test');
const { logger } = require('../utils/logger');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const { data } = require('../data/environment');

test.describe('Analytics Section', () => {
  test('QE-3313 TS-001 TC-001: Analytics charts are displayed for selected period', async ({ page }) => {
    logger.info('Logging in and navigating to analytics section');
    const loginPage = new LoginPage(page);
    await loginPage.goto(data.baseUrl);
    await loginPage.login(data.validUsername, data.validPassword);
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.gotoSection();
    logger.info('Selecting period with available transaction data');
    await analyticsPage.selectPeriod(data.selectedPeriod);
    logger.info('Verifying charts are displayed');
    await analyticsPage.assertChartsVisible();
  });
});
