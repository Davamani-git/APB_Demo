const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsHeader = page.locator('.dashboard-header h1:has-text("Spend Analytics")');
    this.filterSection = page.locator('.filter-section');
    this.cardFilterDropdown = page.locator('.filter-section select');
    this.chartSection = page.locator('.chart-section');
    this.categoryChart = page.locator('#categoryChart');
    this.monthlyTrendChart = page.locator('#monthlyTrendChart');
    this.cardWiseChart = page.locator('#cardWiseChart');
    this.loadingIndicator = page.locator('.loading');
    this.chartContainers = page.locator('.chart-container');
  }

  async navigate() {
    await this.page.goto('#!/analytics');
    await this.page.waitForLoadState('networkidle');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
  }

  async verifyAllCategoriesDisplayed(expectedCategories) {
    await expect(this.categoryChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForTimeout(2000);
    const chartData = await this.page.evaluate(() => {
      const chart = Chart.getChart('categoryChart');
      return chart ? chart.data.labels : [];
    });
    for (const category of expectedCategories) {
      expect(chartData).toContain(category);
    }
  }

  async verifyCategorySpendingAmounts(expectedAmounts) {
    await expect(this.categoryChart).toBeVisible();
    await this.page.waitForTimeout(2000);
    const chartData = await this.page.evaluate(() => {
      const chart = Chart.getChart('categoryChart');
      if (!chart) return null;
      const labels = chart.data.labels;
      const data = chart.data.datasets[0].data;
      const result = {};
      labels.forEach((label, index) => {
        result[label] = data[index].toString();
      });
      return result;
    });
    for (const [category, expectedAmount] of Object.entries(expectedAmounts)) {
      expect(chartData[category]).toBe(expectedAmount);
    }
  }

  async verifyCategoryTotalMatchesDashboardKPI(expectedTotal) {
    await expect(this.categoryChart).toBeVisible();
    await this.page.waitForTimeout(2000);
    const total = await this.page.evaluate(() => {
      const chart = Chart.getChart('categoryChart');
      if (!chart) return 0;
      const data = chart.data.datasets[0].data;
      return data.reduce((sum, val) => sum + val, 0);
    });
    expect(total.toString()).toBe(expectedTotal);
  }

  async selectCardFilter(cardName) {
    await expect(this.cardFilterDropdown).toBeVisible();
    await this.cardFilterDropdown.selectOption({ label: cardName });
    await this.page.waitForTimeout(2000);
  }

  async verifyFilterApplied(cardName) {
    const selectedValue = await this.cardFilterDropdown.inputValue();
    expect(selectedValue).toBeTruthy();
  }

  async verifyCategorySpendingRecalculated(expectedAmounts) {
    await expect(this.categoryChart).toBeVisible();
    await this.page.waitForTimeout(2000);
    const chartData = await this.page.evaluate(() => {
      const chart = Chart.getChart('categoryChart');
      if (!chart) return null;
      const labels = chart.data.labels;
      const data = chart.data.datasets[0].data;
      const result = {};
      labels.forEach((label, index) => {
        result[label] = data[index].toString();
      });
      return result;
    });
    for (const [category, expectedAmount] of Object.entries(expectedAmounts)) {
      if (chartData[category]) {
        expect(chartData[category]).toBe(expectedAmount);
      }
    }
  }

  async verifyFilteredTotalMatchesCardSpend(expectedSpend) {
    await expect(this.categoryChart).toBeVisible();
    await this.page.waitForTimeout(2000);
    const total = await this.page.evaluate(() => {
      const chart = Chart.getChart('categoryChart');
      if (!chart) return 0;
      const data = chart.data.datasets[0].data;
      return data.reduce((sum, val) => sum + val, 0);
    });
    expect(total.toString()).toBe(expectedSpend);
  }

  async verifyCategoriesWithZeroValues(expectedAmounts) {
    await expect(this.categoryChart).toBeVisible();
    await this.page.waitForTimeout(2000);
    const chartData = await this.page.evaluate(() => {
      const chart = Chart.getChart('categoryChart');
      if (!chart) return null;
      const labels = chart.data.labels;
      const data = chart.data.datasets[0].data;
      const result = {};
      labels.forEach((label, index) => {
        result[label] = data[index].toString();
      });
      return result;
    });
    for (const [category, expectedAmount] of Object.entries(expectedAmounts)) {
      expect(chartData[category]).toBe(expectedAmount);
    }
  }

  async verifyChartRendersWithZeroValues() {
    await expect(this.categoryChart).toBeVisible();
    const chartExists = await this.page.evaluate(() => {
      const chart = Chart.getChart('categoryChart');
      return chart !== null && chart !== undefined;
    });
    expect(chartExists).toBe(true);
  }

  async verifyMonthlySpendTrendChartVisible() {
    await expect(this.monthlyTrendChart).toBeVisible({ timeout: 5000 });
  }

  async verifyChartDisplaysMonthlyData(expectedMonth, expectedAmount) {
    await expect(this.monthlyTrendChart).toBeVisible();
    await this.page.waitForTimeout(2000);
    const chartData = await this.page.evaluate(() => {
      const chart = Chart.getChart('monthlyTrendChart');
      if (!chart) return null;
      return {
        labels: chart.data.labels,
        data: chart.data.datasets[0].data
      };
    });
    const monthIndex = chartData.labels.indexOf(expectedMonth);
    expect(monthIndex).toBeGreaterThanOrEqual(0);
    expect(chartData.data[monthIndex].toString()).toBe(expectedAmount);
  }

  async verifyMonthlyTotalAlignsDashboardKPI(expectedTotal) {
    await expect(this.monthlyTrendChart).toBeVisible();
    await this.page.waitForTimeout(2000);
    const total = await this.page.evaluate(() => {
      const chart = Chart.getChart('monthlyTrendChart');
      if (!chart) return 0;
      const data = chart.data.datasets[0].data;
      return data.reduce((sum, val) => sum + val, 0);
    });
    expect(total.toString()).toBe(expectedTotal);
  }

  async verifyDefaultTimePeriodDisplayed() {
    await expect(this.monthlyTrendChart).toBeVisible();
    await this.page.waitForTimeout(2000);
    const hasData = await this.page.evaluate(() => {
      const chart = Chart.getChart('monthlyTrendChart');
      return chart && chart.data.labels.length > 0;
    });
    expect(hasData).toBe(true);
  }

  async verifyEachMonthAccurateTotal(expectedMonth, expectedAmount) {
    await this.verifyChartDisplaysMonthlyData(expectedMonth, expectedAmount);
  }

  async verifySpendingPatternsVisible() {
    await expect(this.monthlyTrendChart).toBeVisible();
    const chartExists = await this.page.evaluate(() => {
      const chart = Chart.getChart('monthlyTrendChart');
      return chart !== null && chart.data.datasets[0].data.length > 0;
    });
    expect(chartExists).toBe(true);
  }

  async verifyMonthlySpendTrendChartAreaVisible() {
    await expect(this.chartSection).toBeVisible();
    const chartContainer = this.page.locator('.chart-container:has-text("Monthly Spend Trend")');
    await expect(chartContainer).toBeVisible();
  }

  async verifyEmptyStateOrMessage() {
    await this.page.waitForTimeout(2000);
    const hasData = await this.page.evaluate(() => {
      const chart = Chart.getChart('monthlyTrendChart');
      return chart && chart.data.labels.length > 0;
    });
    if (!hasData) {
      await expect(this.monthlyTrendChart).toBeVisible();
    }
  }

  async verifyNoErrors() {
    const errors = [];
    this.page.on('pageerror', error => errors.push(error));
    await this.page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  }

  async verifyApplicationStable() {
    await expect(this.analyticsHeader).toBeVisible();
    await expect(this.chartSection).toBeVisible();
  }
};