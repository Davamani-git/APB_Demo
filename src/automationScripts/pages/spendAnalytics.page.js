const { expect } = require('@playwright/test');

exports.SpendAnalyticsPage = class SpendAnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsContainer = page.locator('[data-testid="analytics-container"]');
    this.categoryWiseChart = page.locator('[data-testid="category-wise-chart"]');
    this.categoryFilterDropdown = page.locator('[data-testid="category-filter"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter"]');
    this.chartDataLabels = page.locator('[data-testid="chart-data-label"]');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    this.categorySpendTotal = page.locator('[data-testid="category-spend-total"]');
    this.sensitiveDataElements = page.locator('[data-testid*="card-number"], [data-testid*="cvv"]');
    this.spendAnalyticsLink = page.locator('[data-testid="spend-analytics-link"]');
  }

  async navigateToSpendAnalytics() {
    await this.page.goto('/analytics/spend');
    await expect(this.analyticsContainer).toBeVisible();
  }

  async applyCategoryFilter(category) {
    await expect(this.categoryFilterDropdown).toBeVisible();
    await this.categoryFilterDropdown.selectOption(category);
    await expect(this.applyFilterButton).toBeEnabled();
    await this.applyFilterButton.click();
  }

  async waitForChartToUpdate() {
    await this.page.waitForTimeout(500);
    await expect(this.categoryWiseChart).toBeVisible();
  }

  async verifyChartShowsCategoryOnly(category) {
    await expect(this.categoryWiseChart).toBeVisible();
    const labels = await this.chartDataLabels.allTextContents();
    
    for (const label of labels) {
      expect(label).toContain(category);
    }
  }

  async verifySensitiveDataNotExposed() {
    const count = await this.sensitiveDataElements.count();
    expect(count).toBe(0);
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async getCategorySpendTotal() {
    await expect(this.categorySpendTotal).toBeVisible();
    return await this.categorySpendTotal.textContent();
  }
};