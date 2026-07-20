const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.section = page.locator('#analytics-section');
    this.periodDropdown = page.locator('[data-testid="period-dropdown"]');
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"]');
    this.cardWiseChart = page.locator('[data-testid="card-wise-chart"]');
  }

  async gotoAnalyticsSection() {
    await expect(this.section).toBeVisible();
  }

  async selectPeriod(period) {
    await this.periodDropdown.selectOption(period);
    await this.page.waitForLoadState('networkidle');
  }

  async assertChartsVisible() {
    await expect(this.categoryChart).toBeVisible();
    await expect(this.monthlyTrendChart).toBeVisible();
    await expect(this.cardWiseChart).toBeVisible();
  }
};