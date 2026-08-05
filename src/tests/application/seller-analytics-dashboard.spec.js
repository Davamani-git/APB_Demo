const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const SellerDashboardPage = require('../../pages/seller-dashboard.page');
const AnalyticsPage = require('../../pages/analytics.page');
const TD = require('../../data/workday-test-data');

test.describe('@regression QE-3849 TS001 TC-001 - Seller Analytics Dashboard', () => {
  test('should display accurate analytics for seller', async ({ page }) => {
    const login = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const analytics = new AnalyticsPage(page);

    await login.login(TD.users.selleruser);
    expect(await sellerDashboard.isLoaded()).toBeTruthy();
    await sellerDashboard.gotoAnalytics();
    expect(await analytics.isLoaded()).toBeTruthy();
    expect(await analytics.hasSalesTrends()).toBeTruthy();
    expect(await analytics.hasOrderStatuses()).toBeTruthy();
    expect(await analytics.hasRefundStatistics()).toBeTruthy();
  });
});
