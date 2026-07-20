const { expect } = require('@playwright/test');
const { logger } = require('../../../utils/logger');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsSection = page.locator('#analytics-section');
    this.periodSelector = page.locator('[data-testid="analytics-period-selector"]');
    this.categoryChart = page.locator('[data-testid="category-chart"]');
    this.monthlyTrendChart = page.locator('[data-testid="monthly-trend-chart"]');
    this.cardWiseChart = page.locator('[data-testid="cardwise-chart"]');
  }
  async goToAnalyticsSection() {
    logger.info('Navigating to analytics section');
    await expect(this.analyticsSection).toBeVisible();
  }
  async selectPeriod(period) {
    logger.info(`Selecting analytics period: ${period}`);
    await this.periodSelector.selectOption({ label: period });
    await expect(this.categoryChart).toBeVisible();
    await expect(this.monthlyTrendChart).toBeVisible();
    await expect(this.cardWiseChart).toBeVisible();
  }
  async assertChartsVisible() {
    logger.info('Asserting analytics charts are visible');
    await expect(this.categoryChart).toBeVisible();
    await expect(this.monthlyTrendChart).toBeVisible();
    await expect(this.cardWiseChart).toBeVisible();
  }
};
