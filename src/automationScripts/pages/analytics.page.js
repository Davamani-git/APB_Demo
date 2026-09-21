const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.navigationMenu = page.locator('.nav');
    this.analyticsNavLink = page.locator('.nav a[href="#!/analytics"]');
    this.filterBar = page.locator('.filter-bar');
    this.cardFilterDropdown = page.locator('.filter-bar select');
    this.monthlyTrendsChartContainer = page.locator('.chart-container:has-text("Monthly Spend Trends")');
    this.monthlyTrendsChart = page.locator('#monthlyTrendChart');
    this.categoryChartContainer = page.locator('.chart-container:has-text("Category-Wise Spending")');
    this.categoryChart = page.locator('#categoryChart');
  }

  async navigate() {
    await this.page.goto('index.html');
    await expect(this.page).toHaveURL(/index.html/);
  }

  async clickAnalyticsNav() {
    await expect(this.analyticsNavLink).toBeVisible();
    await this.analyticsNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCardFilter(cardId) {
    await expect(this.cardFilterDropdown).toBeVisible();
    await this.cardFilterDropdown.selectOption(cardId);
    await this.page.waitForTimeout(500);
  }

  async selectAllCardsFilter() {
    await expect(this.cardFilterDropdown).toBeVisible();
    await this.cardFilterDropdown.selectOption('');
    await this.page.waitForTimeout(500);
  }

  async verifyMonthlyTrendsChartVisible() {
    await expect(this.monthlyTrendsChartContainer).toBeVisible();
    await expect(this.monthlyTrendsChart).toBeVisible();
  }

  async verifyCategoryChartVisible() {
    await expect(this.categoryChartContainer).toBeVisible();
    await expect(this.categoryChart).toBeVisible();
  }

  async verifyFilterBarVisible() {
    await expect(this.filterBar).toBeVisible();
    await expect(this.cardFilterDropdown).toBeVisible();
  }

  async getSelectedFilterValue() {
    await expect(this.cardFilterDropdown).toBeVisible();
    return await this.cardFilterDropdown.inputValue();
  }
}