const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsSection = page.locator('.analytics-section, .analytics-container');
    this.monthlyTrendsChart = page.locator('#monthlyChart, canvas[id*="monthly"], .chart-wrapper:has-text("Monthly") canvas');
    this.categoryChart = page.locator('#categoryChart, canvas[id*="category"], .chart-wrapper:has-text("Category") canvas');
    this.chartTooltip = page.locator('.chartjs-tooltip, [role="tooltip"]');
    this.insufficientDataMessage = page.locator(':has-text("Insufficient data")');
    this.trendErrorMessage = page.locator('.trend-error, :has-text("Trend data.*cannot be generated")');
    this.noSpendingDataMessage = page.locator(':has-text("No spending data")');
    this.uncategorizedWarningMessage = page.locator(':has-text("uncategorized")');
    this.navigationMenu = page.locator('.nav-menu, nav');
  }

  async navigate() {
    await this.page.goto('https://app.creditcarddashboard.com/#!/analytics');
    await this.waitForAnalyticsLoad();
  }

  async waitForAnalyticsLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    await expect(this.analyticsSection.or(this.trendErrorMessage).or(this.noSpendingDataMessage)).toBeVisible({ timeout: 10000 });
  }

  async getChartLabels(chartType) {
    const chartCanvas = chartType === 'monthlyTrends' ? this.monthlyTrendsChart : this.categoryChart;
    await expect(chartCanvas).toBeVisible();
    const chartData = await this.page.evaluate((canvasSelector) => {
      const canvas = document.querySelector(canvasSelector);
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.labels : [];
    }, chartType === 'monthlyTrends' ? '#monthlyChart' : '#categoryChart');
    return chartData;
  }

  async getChartData(chartType) {
    const chartCanvas = chartType === 'monthlyTrends' ? this.monthlyTrendsChart : this.categoryChart;
    await expect(chartCanvas).toBeVisible();
    const chartData = await this.page.evaluate((canvasSelector) => {
      const canvas = document.querySelector(canvasSelector);
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.datasets[0].data : [];
    }, chartType === 'monthlyTrends' ? '#monthlyChart' : '#categoryChart');
    return chartData;
  }

  async hoverOverChartDataPoint(chartType, index) {
    const chartCanvas = chartType === 'monthlyTrends' ? this.monthlyTrendsChart : this.categoryChart;
    await chartCanvas.hover();
    await this.page.waitForTimeout(500);
  }

  async getCategoryLabels() {
    return await this.getChartLabels('category');
  }

  async verifyCategorySpend(categoryName, expectedAmount) {
    const labels = await this.getCategoryLabels();
    const data = await this.getChartData('category');
    const index = labels.indexOf(categoryName);
    expect(index).toBeGreaterThanOrEqual(0);
    const actualAmount = parseFloat(data[index]);
    const expectedFloat = parseFloat(expectedAmount);
    expect(actualAmount).toBeCloseTo(expectedFloat, 2);
  }

  async getCategorySpendValue(categoryName) {
    const labels = await this.getCategoryLabels();
    const data = await this.getChartData('category');
    const index = labels.indexOf(categoryName);
    return index >= 0 ? data[index].toString() : '0';
  }

  async hoverOverCategoryBar(categoryName) {
    await this.categoryChart.hover();
    await this.page.waitForTimeout(500);
  }

  async navigateToDashboard() {
    const dashboardLink = this.page.locator('a[href*="dashboard"], a:has-text("Dashboard")');
    await dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
  }
};