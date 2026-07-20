const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeader = page.locator('h1:has-text("Dashboard")');
    this.summarySection = page.locator('[data-testid="dashboard-summary-section"]');
    this.totalMonthlySpend = page.locator('[data-testid="total-monthly-spend"]');
    this.totalCreditLimit = page.locator('[data-testid="total-credit-limit"]');
    this.availableCredit = page.locator('[data-testid="available-credit"]');
    this.outstandingAmount = page.locator('[data-testid="outstanding-amount"]');
    this.utilizationPercentage = page.locator('[data-testid="utilization-percentage"]');
    this.transactionCount = page.locator('[data-testid="current-month-transaction-count"]');
    this.newTransactionBtn = page.locator('[data-testid="add-transaction-btn"]');
    this.transactionForm = page.locator('[data-testid="transaction-form"]');
    this.transactionSubmitBtn = page.locator('[data-testid="submit-transaction-btn"]');
  }
  async waitForDashboard() {
    await expect(this.dashboardHeader).toBeVisible();
  }
  async gotoSummarySection() {
    await expect(this.summarySection).toBeVisible();
    await this.summarySection.scrollIntoViewIfNeeded();
  }
  async assertSummaryFieldsVisible() {
    await expect(this.totalMonthlySpend).toBeVisible();
    await expect(this.totalCreditLimit).toBeVisible();
    await expect(this.availableCredit).toBeVisible();
    await expect(this.outstandingAmount).toBeVisible();
    await expect(this.utilizationPercentage).toBeVisible();
    await expect(this.totalMonthlySpend).not.toHaveText('');
    await expect(this.totalCreditLimit).not.toHaveText('');
    await expect(this.availableCredit).not.toHaveText('');
    await expect(this.outstandingAmount).not.toHaveText('');
    await expect(this.utilizationPercentage).not.toHaveText('');
  }
  async getOutstandingAmount() {
    await expect(this.outstandingAmount).toBeVisible();
    const text = await this.outstandingAmount.textContent();
    return Number(text.replace(/[^\d.]/g, ''));
  }
  async getTotalCreditLimit() {
    await expect(this.totalCreditLimit).toBeVisible();
    const text = await this.totalCreditLimit.textContent();
    return Number(text.replace(/[^\d.]/g, ''));
  }
  async assertUtilizationPercentage(expected) {
    await expect(this.utilizationPercentage).toBeVisible();
    const text = await this.utilizationPercentage.textContent();
    const value = Number(text.replace(/[^\d]/g, ''));
    expect(value).toBe(expected);
  }
  async getCurrentMonthTransactionCount() {
    await expect(this.transactionCount).toBeVisible();
    const text = await this.transactionCount.textContent();
    return Number(text.replace(/[^\d]/g, ''));
  }
  async triggerNewTransaction(details) {
    await this.newTransactionBtn.click();
    await expect(this.transactionForm).toBeVisible();
    // details: { date, merchant, amount, ... }
    for (const [field, value] of Object.entries(details)) {
      await this.transactionForm.locator(`[name="${field}"]`).fill(String(value));
    }
    await this.transactionSubmitBtn.click();
  }
  async waitForTransactionCountUpdate(oldCount) {
    await expect(async () => {
      const text = await this.transactionCount.textContent();
      const count = Number(text.replace(/[^\d]/g, ''));
      expect(count).toBeGreaterThan(oldCount);
    }).toPass();
  }
};
