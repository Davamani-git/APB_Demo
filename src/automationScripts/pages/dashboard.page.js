const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardTitle = page.locator('h1', { hasText: 'Dashboard' });
    this.dataSourceConfigNav = page.locator('a', { hasText: 'Data Source Configuration' });
  }
  async assertDashboardDisplayed() {
    await expect(this.dashboardTitle).toBeVisible();
  }
  async goToDataSourceConfiguration() {
    await expect(this.dataSourceConfigNav).toBeVisible();
    await this.dataSourceConfigNav.click();
  }
};