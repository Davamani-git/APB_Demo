const { expect } = require('@playwright/test');

exports.MonthlySpendTrendsPage = class MonthlySpendTrendsPage {
  constructor(page) {
    this.page = page;
    this.trendsContainer = page.locator('[data-testid="trends-container"]');
    this.spendTrendsChart = page.locator('[data-testid="spend-trends-chart"]');
    this.timePeriodDropdown = page.locator('[data-testid="time-period-selector"]');
    this.applyTimePeriodButton = page.locator('[data-testid="apply-time-period"]');
    this.chartDataPoints = page.locator('[data-testid="chart-data-point"]');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    this.monthlySpendTrendsLink = page.locator('[data-testid="monthly-spend-trends-link"]');
  }

  async navigateToMonthlySpendTrends() {
    await this.page.goto('/analytics/monthly-trends');
    await expect(this.trendsContainer).toBeVisible();
  }

  async selectTimePeriod(timePeriod) {
    await expect(this.timePeriodDropdown).toBeVisible();
    await this.timePeriodDropdown.selectOption(timePeriod);
    await expect(this.applyTimePeriodButton).toBeEnabled();
    await this.applyTimePeriodButton.click();
  }

  async waitForChartToLoad() {
    await this.page.waitForTimeout(500);
    await expect(this.spendTrendsChart).toBeVisible();
  }

  async verifyChartDataAccuracy(timePeriod) {
    await expect(this.spendTrendsChart).toBeVisible();
    const dataPointCount = await this.chartDataPoints.count();
    
    if (timePeriod === 'Last 6 months') {
      expect(dataPointCount).toBe(6);
    } else if (timePeriod === 'Last 12 months') {
      expect(dataPointCount).toBe(12);
    } else if (timePeriod === 'Last 3 months') {
      expect(dataPointCount).toBe(3);
    }
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async getChartData() {
    await expect(this.spendTrendsChart).toBeVisible();
    const dataPoints = await this.chartDataPoints.allTextContents();
    return dataPoints;
  }
};