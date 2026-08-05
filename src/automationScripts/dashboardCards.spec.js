const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard Card Overview', () => {
  test('Test Case - QE-3755 TS-001 TC-001: Dashboard loads with card overview and displays correct values for each card', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    logger.info('Navigating to dashboard as customer with multiple active cards');
    await dashboardPage.loginAsCustomerWithMultipleCards();
    await dashboardPage.waitForDashboardLoad();
    logger.info('Verifying card entries for credit limit, outstanding amount, and available credit');
    const cardData = [
      { limit: '$5000', outstanding: '$1500', available: '$3500' },
      { limit: '$8000', outstanding: '$2000', available: '$6000' }
    ];
    for (let i = 0; i < cardData.length; i++) {
      await dashboardPage.expectCardDetails(i, cardData[i]);
    }
  });
});
