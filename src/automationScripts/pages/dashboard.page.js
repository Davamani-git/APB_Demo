const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('.dashboard-container, #dashboard, [data-testid="dashboard"], main.dashboard, .main-dashboard');
    this.aiUsageDataSection = page.locator('.ai-usage, [data-testid="ai-usage"], #ai-usage-data, .usage-data, .ai-metrics');
    this.spendDataSection = page.locator('.spend-data, [data-testid="spend-data"], #spend-data, .cost-data, .spend-metrics');
    this.accessDeniedMessage = page.locator('.access-denied, .unauthorized, [role="alert"]:has-text("access"), .error:has-text("denied")');
  }

  async verifyDashboardLoaded() {
    await expect(this.dashboardContainer).toBeVisible();
  }

  async verifyAIUsageDataDisplayed(timeout = 3000) {
    await expect(this.aiUsageDataSection).toBeVisible({ timeout });
  }

  async verifySpendDataDisplayed(timeout = 3000) {
    await expect(this.spendDataSection).toBeVisible({ timeout });
  }
};
