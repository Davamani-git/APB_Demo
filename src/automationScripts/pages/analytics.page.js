const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    this.analyticsLink = page.locator('a[href*="analytics"], a:has-text("Analytics")');
    this.monthlyTrendsSection = page.locator('.monthly-trends-section, [data-testid="monthly-trends"]');
    this.monthlyTrendsChart = page.locator('#monthlyTrendsChart, canvas[spend-trend-chart]');
    this.chartTooltip = page.locator('.chartjs-tooltip, [role="tooltip"]');
    this.categoryWiseSection = page.locator('.category-wise-section, [data-testid="category-wise"]');
    this.categoryChart = page.locator('#categoryChart, canvas[category-chart]');
    this.categoryTable = page.locator('.category-table table');
    this.categoryTooltip = page.locator('.chartjs-tooltip, [role="tooltip"]');
    this.insufficientDataMessage = page.locator('text=/Insufficient data|No transaction history/i');
    this.uncategorizedNotification = page.locator('text=/uncategorized|Miscellaneous/i');
  }

  async navigate(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAnalytics() {
    await this.analyticsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getMonthlyTrendsChartData() {
    const chartData = await this.page.evaluate(() => {
      const canvas = document.querySelector('#monthlyTrendsChart');
      if (!canvas) return '';
      const chart = Chart.getChart(canvas);
      if (!chart) return '';
      return chart.data.labels.join(',');
    });
    return chartData;
  }

  async hoverOverChartDataPoint(index) {
    const canvas = this.monthlyTrendsChart;
    await canvas.hover();
    await this.page.waitForTimeout(500);
  }

  async tapChartDataPoint(index) {
    const canvas = this.monthlyTrendsChart;
    await canvas.tap();
    await this.page.waitForTimeout(500);
  }

  async getMonthlyTrendsDataPointCount() {
    const count = await this.page.evaluate(() => {
      const canvas = document.querySelector('#monthlyTrendsChart');
      if (!canvas) return 0;
      const chart = Chart.getChart(canvas);
      if (!chart) return 0;
      return chart.data.labels.length;
    });
    return count;
  }

  async getCategoryLabels() {
    const labels = await this.page.evaluate(() => {
      const canvas = document.querySelector('#categoryChart');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      if (!chart) return [];
      return chart.data.labels;
    });
    return labels;
  }

  getCategoryAmount(categoryName) {
    return this.page.locator(`.category-table tr:has-text("${categoryName}") td:last-child`);
  }

  async selectCategory(categoryName) {
    const categoryBar = this.categoryChart;
    await categoryBar.hover();
    await this.page.waitForTimeout(500);
  }

  async getAllCategoryTotals() {
    const totals = await this.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.category-table tbody tr'));
      return rows.map(row => {
        const amountText = row.querySelector('td:last-child').textContent.replace(/[^0-9]/g, '');
        return parseInt(amountText, 10);
      });
    });
    return totals;
  }

  async getOverallTransactionTotal() {
    const total = await this.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.category-table tbody tr'));
      return rows.reduce((sum, row) => {
        const amountText = row.querySelector('td:last-child').textContent.replace(/[^0-9]/g, '');
        return sum + parseInt(amountText, 10);
      }, 0);
    });
    return total;
  }

  async getCategoryAmountValue(categoryName) {
    const value = await this.page.evaluate((cat) => {
      const row = Array.from(document.querySelectorAll('.category-table tbody tr')).find(r => r.textContent.includes(cat));
      if (!row) return 0;
      const amountText = row.querySelector('td:last-child').textContent.replace(/[^0-9]/g, '');
      return parseInt(amountText, 10);
    }, categoryName);
    return value;
  }
};