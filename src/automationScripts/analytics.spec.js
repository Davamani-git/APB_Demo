const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../../utils/logger');
const env = require('../../data/env');

test.describe('Analytics Section Scenarios', () => {
  test('QE-3313 TS-001 TC-001: Verify analytics charts for selected period', async ({ page }) => {
    logger.info('Logging in and navigating to analytics section');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(env.APP_URL);
    await loginPage.login(env.VALID_USERNAME, env.VALID_PASSWORD);
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.gotoAnalyticsSection();
    await analyticsPage.selectPeriod(env.SELECTED_PERIOD);
    await analyticsPage.assertChartsVisible();
  });
});