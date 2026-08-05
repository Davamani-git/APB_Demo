const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AnalyticsPage } = require('./pages/analytics.page');
const logger = require('../utils/logger');

test('Test Case - QE-3849 TS001 TC-001: Seller analytics dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const analyticsPage = new AnalyticsPage(page);
  logger.info('Logging in as selleruser');
  await loginPage.login('selleruser', 'password');
  await analyticsPage.gotoAnalytics();
  await expect(analyticsPage.analyticsDashboard).toBeVisible();
  logger.info('Verifying analytics data');
  await expect(analyticsPage.salesTrends).toBeVisible();
  await expect(analyticsPage.orderStatuses).toBeVisible();
  await expect(analyticsPage.refundStats).toBeVisible();
});
