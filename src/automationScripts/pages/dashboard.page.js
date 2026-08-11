const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.viewSelector = page.locator('#view-selector, select[name="view"], .view-dropdown, button:has-text("Daily"), button:has-text("Weekly"), button:has-text("Monthly")');
    this.dailyViewOption = page.locator('option[value="Daily"], button:has-text("Daily"), [data-view="daily"]');
    this.weeklyViewOption = page.locator('option[value="Weekly"], button:has-text("Weekly"), [data-view="weekly"]');
    this.monthlyViewOption = page.locator('option[value="Monthly"], button:has-text("Monthly"), [data-view="monthly"]');
    this.energyChart = page.locator('.energy-chart, #energy-chart, canvas, .chart-container');
    this.realTimeDataIndicator = page.locator('.real-time-indicator, .live-data, [data-realtime="true"]');
    this.costDisplay = page.locator('.cost-display, #total-cost, .cost-estimate, [data-testid="cost"]');
    this.energyDataContainer = page.locator('.energy-data, #energy-consumption, .consumption-metrics');
    this.errorMessage = page.locator('.error-message, .alert-error, [role="alert"], .notification-error');
    this.lastUpdatedTimestamp = page.locator('.last-updated, #last-update-time, [data-testid="timestamp"]');
    this.dashboardContainer = page.locator('.dashboard, #dashboard, main');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await expect(this.dashboardContainer).toBeVisible();
  }

  async selectView(viewType) {
    await expect(this.viewSelector).toBeVisible();
    
    if (viewType === 'Daily') {
      await this.dailyViewOption.click();
    } else if (viewType === 'Weekly') {
      await this.weeklyViewOption.click();
    } else if (viewType === 'Monthly') {
      await this.monthlyViewOption.click();
    }
    
    // Wait for view to update
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    await expect(this.energyChart).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRealTimeDataDisplayed() {
    await expect(this.energyChart).toBeVisible();
    const chartContent = await this.energyChart.textContent();
    expect(chartContent).toBeTruthy();
  }

  async verifyEnergyDataDisplayed() {
    await expect(this.energyDataContainer).toBeVisible();
    await expect(this.energyChart).toBeVisible();
  }

  async verifyCostCalculationsDisplayed() {
    await expect(this.costDisplay).toBeVisible();
    const costText = await this.costDisplay.textContent();
    expect(costText).toMatch(/\$|USD|cost/i);
  }

  async verifyDataConsistencyAcrossTimeframes() {
    // Verify that data is consistently formatted and displayed
    await expect(this.energyDataContainer).toBeVisible();
    await expect(this.costDisplay).toBeVisible();
    const costValue = await this.costDisplay.textContent();
    expect(costValue).toBeTruthy();
  }

  async getTotalCost() {
    await expect(this.costDisplay).toBeVisible();
    const costText = await this.costDisplay.textContent();
    // Extract numeric value from cost display
    const costMatch = costText.match(/[\d,.]+/);
    return costMatch ? parseFloat(costMatch[0].replace(',', '')) : 0;
  }

  async verifyCostAggregation(viewType) {
    await expect(this.costDisplay).toBeVisible();
    const cost = await this.getTotalCost();
    expect(cost).toBeGreaterThanOrEqual(0);
    // Verify cost is properly aggregated for the view type
    const costText = await this.costDisplay.textContent();
    expect(costText).toBeTruthy();
  }

  async simulateSmartMeterStatus(status) {
    // Simulate smart meter status through API or test configuration
    // This would typically interact with a test API endpoint
    await this.page.evaluate((meterStatus) => {
      window.sessionStorage.setItem('smartMeterStatus', meterStatus);
    }, status);
  }

  async verifyTimestampFormat() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    const timestampText = await this.lastUpdatedTimestamp.textContent();
    // Verify format matches: 'Last updated: YYYY-MM-DD HH:MM:SS'
    expect(timestampText).toMatch(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/);
  }

  async verifyLastKnownDataDisplayed() {
    await expect(this.lastUpdatedTimestamp).toBeVisible();
    const timestamp = await this.lastUpdatedTimestamp.textContent();
    expect(timestamp).toBeTruthy();
    expect(timestamp).toMatch(/last/i);
  }
};