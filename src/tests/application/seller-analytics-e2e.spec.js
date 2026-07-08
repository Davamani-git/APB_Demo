const { test, expect } = require('../../fixtures');
const SellerPage = require('../../pages/seller.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] Seller Analytics', () => {
  test('[QE-1873 TS-001 TC-001] Seller can view analytics dashboard', async ({ page }) => {
    const seller = new SellerPage(page);
    await seller.login(TD.sellerCredentials);
    await expect(await seller.isDashboardLoaded()).toBeTruthy();
    await seller.gotoAnalytics();
    const analytics = await seller.getAnalyticsData();
    expect(analytics).toMatchObject({ salesTrends: expect.any(Array), inventoryStatus: expect.any(Object), refundStats: expect.any(Object) });
  });
});
