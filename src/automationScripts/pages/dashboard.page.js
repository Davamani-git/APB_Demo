const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.kpiSection = page.locator('.kpi-section, #kpi-section, [data-testid="kpi-section"]');
    this.monthlySpendKPI = page.locator('.monthly-spend, #monthly-spend, [data-testid="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('.total-credit-limit, #total-credit-limit, [data-testid="total-credit-limit"]');
    this.availableCreditKPI = page.locator('.available-credit, #available-credit, [data-testid="available-credit"]');
    this.outstandingAmountKPI = page.locator('.outstanding-amount, #outstanding-amount, [data-testid="outstanding-amount"]');
    this.kpiErrorMessage = page.locator('.error-message, .kpi-error, [data-testid="kpi-error"]');
    this.dashboardContainer = page.locator('.dashboard, #dashboard, [data-testid="dashboard"]');
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer.or(this.kpiSection)).toBeVisible({ timeout: 10000 });
  }

  async verifyKPISectionVisible() {
    await expect(this.kpiSection).toBeVisible();
  }

  async verifyMonthlySpendKPI(expectedValue) {
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.monthlySpendKPI).toContainText(expectedValue);
  }

  async verifyTotalCreditLimitKPI(expectedValue) {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toContainText(expectedValue);
  }

  async verifyAvailableCreditKPI(expectedValue) {
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.availableCreditKPI).toContainText(expectedValue);
  }

  async verifyOutstandingAmountKPI(expectedValue) {
    await expect(this.outstandingAmountKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toContainText(expectedValue);
  }

  async verifyMonthlySpendKPIZeroState() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    const isZeroOrNull = text.includes('$0.00') || text.includes('No transactions') || text.includes('0');
    expect(isZeroOrNull).toBeTruthy();
  }

  async verifyKPIErrorState() {
    const errorVisible = await this.kpiErrorMessage.isVisible().catch(() => false);
    if (errorVisible) {
      await expect(this.kpiErrorMessage).toBeVisible();
      const errorText = await this.kpiErrorMessage.textContent();
      const hasErrorMessage = errorText.includes('Service temporarily unavailable') || 
                              errorText.includes('Unable to load financial data') || 
                              errorText.includes('Please try again later');
      expect(hasErrorMessage).toBeTruthy();
    } else {
      // Check for fallback/placeholder state in KPI elements
      const monthlySpendText = await this.monthlySpendKPI.textContent().catch(() => '');
      const hasFallback = monthlySpendText.includes('--') || 
                          monthlySpendText.includes('N/A') || 
                          monthlySpendText.includes('unavailable');
      expect(hasFallback).toBeTruthy();
    }
  }
};