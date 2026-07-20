const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsSection = page.locator('[data-testid="analytics-section"]');
    this.periodDropdown = page.locator('[data-testid="analytics-period-dropdown"]');
    this.categoryChart = page.locator('[data-testid="chart-category-wise"]');
    this.monthlyTrendChart = page.locator('[data-testid="chart-monthly-trend"]');
    this.cardWiseChart = page.locator('[data-testid="chart-card-wise"]');
  }
  async gotoSection() {
    await expect(this.analyticsSection).toBeVisible();
  }
  async selectPeriod(period) {
    await expect(this.periodDropdown).toBeVisible();
    await this.periodDropdown.selectOption({ label: period });
  }
  async assertChartsVisible() {
    await expect(this.categoryChart).toBeVisible();
    await expect(this.monthlyTrendChart).toBeVisible();
    await expect(this.cardWiseChart).toBeVisible();
  }
};
