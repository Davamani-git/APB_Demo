const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsButton = page.locator('#analytics-nav');
    this.analyticsDashboard = page.locator('#analytics-dashboard');
    this.salesTrends = page.locator('#sales-trends');
    this.orderStatuses = page.locator('#order-statuses');
    this.refundStats = page.locator('#refund-stats');
  }
  async gotoAnalytics() {
    await expect(this.analyticsButton).toBeVisible();
    await this.analyticsButton.click();
  }
};
