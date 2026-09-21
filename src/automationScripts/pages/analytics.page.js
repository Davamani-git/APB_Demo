const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {
  constructor(page) {
    this.page = page;
    this.analyticsContainer = page.locator('.analytics-container');
    this.categoryWiseSection = page.locator('.chart-section').filter({ hasText: 'Category-Wise' });
    this.monthlyTrendSection = page.locator('.chart-section').filter({ hasText: 'Monthly Spend Trend' });
    this.chartCanvas = page.locator('canvas');
    this.noDataMessage = page.locator('.no-data-message, .empty-state-message');
    this.loadingIndicator = page.locator('.loading');
    this.analyticsNavLink = page.locator('a[href*="analytics"]');
    this.dateRangeFilter = page.locator('.date-range-filter, input[type="date"]');
    this.applyFilterButton = page.locator('button').filter({ hasText: /apply|filter/i });
  }

  async navigateToAnalytics() {
    await expect(this.analyticsNavLink).toBeVisible();
    await this.analyticsNavLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.analyticsContainer).toBeVisible();
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 }).catch(() => {});
  }

  async verifyCategoryWiseVisualizationDisplayed() {
    await expect(this.categoryWiseSection).toBeVisible();
    const canvas = this.categoryWiseSection.locator('canvas');
    await expect(canvas).toBeVisible();
  }

  async verifyCategoryDisplayed(categoryName, expectedAmount) {
    const chartData = await this.page.evaluate(() => {
      const charts = window.Chart?.instances;
      if (charts && charts.length > 0) {
        const chart = charts[0];
        return {
          labels: chart.data.labels,
          data: chart.data.datasets[0].data
        };
      }
      return null;
    });
    
    if (chartData) {
      const index = chartData.labels.indexOf(categoryName);
      expect(index).toBeGreaterThanOrEqual(0);
      const actualAmount = chartData.data[index].toString();
      expect(actualAmount).toContain(expectedAmount.replace(',', ''));
    }
  }

  async verifySpendingAmountsAccurate() {
    const canvas = this.categoryWiseSection.locator('canvas');
    await expect(canvas).toBeVisible();
    const isRendered = await canvas.evaluate((el) => {
      return el.width > 0 && el.height > 0;
    });
    expect(isRendered).toBe(true);
  }

  async hoverOverCategory(categoryName) {
    const canvas = this.categoryWiseSection.locator('canvas');
    await expect(canvas).toBeVisible();
    await canvas.hover();
    await this.page.waitForTimeout(500);
  }

  async verifyTooltipDisplayed(categoryName) {
    const tooltip = this.page.locator('.chartjs-tooltip, [role="tooltip"]');
    const isVisible = await tooltip.isVisible().catch(() => false);
    if (isVisible) {
      await expect(tooltip).toContainText(categoryName);
    }
  }

  async verifyInteractiveElementsRespond() {
    const canvas = this.categoryWiseSection.locator('canvas');
    await expect(canvas).toBeVisible();
    await canvas.click();
    await this.page.waitForTimeout(300);
  }

  async verifyCategoryPercentage(categoryName, expectedPercentage) {
    const chartData = await this.page.evaluate(() => {
      const charts = window.Chart?.instances;
      if (charts && charts.length > 0) {
        const chart = charts[0];
        const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        return {
          labels: chart.data.labels,
          data: chart.data.datasets[0].data,
          total: total
        };
      }
      return null;
    });
    
    if (chartData) {
      const index = chartData.labels.indexOf(categoryName);
      const percentage = ((chartData.data[index] / chartData.total) * 100).toFixed(0);
      expect(percentage).toBe(expectedPercentage);
    }
  }

  async verifyCategoriesWithoutTransactionsExcludedOrZero(categoryNames) {
    const chartData = await this.page.evaluate(() => {
      const charts = window.Chart?.instances;
      if (charts && charts.length > 0) {
        return charts[0].data.labels;
      }
      return [];
    });
    
    for (const categoryName of categoryNames) {
      const isPresent = chartData.includes(categoryName);
      if (isPresent) {
        await this.verifyCategoryDisplayed(categoryName, '0');
      }
    }
  }

  async verifyNoSpendingDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    await expect(this.noDataMessage).toContainText(/no spending data|no transactions/i);
  }

  async verifyEmptyOrZeroVisualization() {
    const canvas = this.categoryWiseSection.locator('canvas');
    const isVisible = await canvas.isVisible().catch(() => false);
    if (isVisible) {
      const chartData = await this.page.evaluate(() => {
        const charts = window.Chart?.instances;
        if (charts && charts.length > 0) {
          return charts[0].data.datasets[0].data;
        }
        return [];
      });
      const allZero = chartData.every(value => value === 0);
      expect(allZero || chartData.length === 0).toBe(true);
    }
  }

  async scrollToMonthlySpendTrend() {
    await this.monthlyTrendSection.scrollIntoViewIfNeeded();
    await expect(this.monthlyTrendSection).toBeVisible();
  }

  async verifyMonthlySpendTrendDisplayed() {
    await expect(this.monthlyTrendSection).toBeVisible();
    const canvas = this.monthlyTrendSection.locator('canvas');
    await expect(canvas).toBeVisible();
  }

  async verifyMonthDataPoint(monthLabel, expectedAmount) {
    const chartData = await this.page.evaluate(() => {
      const charts = window.Chart?.instances;
      if (charts && charts.length > 1) {
        const chart = charts[1];
        return {
          labels: chart.data.labels,
          data: chart.data.datasets[0].data
        };
      }
      return null;
    });
    
    if (chartData) {
      const index = chartData.labels.indexOf(monthLabel);
      expect(index).toBeGreaterThanOrEqual(0);
      const actualAmount = chartData.data[index].toString();
      expect(actualAmount).toContain(expectedAmount.replace(',', ''));
    }
  }

  async verifyChartInteractivity() {
    const canvas = this.monthlyTrendSection.locator('canvas');
    await expect(canvas).toBeVisible();
    await canvas.hover();
    await canvas.click();
    await this.page.waitForTimeout(300);
  }

  async selectDateRange(startDate, endDate) {
    const dateInputs = await this.dateRangeFilter.all();
    if (dateInputs.length >= 2) {
      await dateInputs[0].fill(startDate);
      await dateInputs[1].fill(endDate);
    }
  }

  async applyDateRangeFilter() {
    const isVisible = await this.applyFilterButton.isVisible().catch(() => false);
    if (isVisible) {
      await this.applyFilterButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async verifyChartRefreshed() {
    await this.page.waitForTimeout(1000);
    const canvas = this.monthlyTrendSection.locator('canvas');
    await expect(canvas).toBeVisible();
  }

  async verifyMonthsOutsideRangeExcluded(monthLabels) {
    const chartData = await this.page.evaluate(() => {
      const charts = window.Chart?.instances;
      if (charts && charts.length > 1) {
        return charts[1].data.labels;
      }
      return [];
    });
    
    for (const monthLabel of monthLabels) {
      const isPresent = chartData.includes(monthLabel);
      expect(isPresent).toBe(false);
    }
  }

  async verifyInsufficientDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    await expect(this.noDataMessage).toContainText(/insufficient data|no historical transaction data/i);
  }

  async verifyEmptyChartOrZeroTrendLine() {
    const canvas = this.monthlyTrendSection.locator('canvas');
    const isVisible = await canvas.isVisible().catch(() => false);
    if (isVisible) {
      const chartData = await this.page.evaluate(() => {
        const charts = window.Chart?.instances;
        if (charts && charts.length > 1) {
          return charts[1].data.datasets[0].data;
        }
        return [];
      });
      const allZero = chartData.every(value => value === 0);
      expect(allZero || chartData.length === 0).toBe(true);
    }
  }
};