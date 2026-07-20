const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.summarySection = page.locator('#dashboard-summary');
    this.totalMonthlySpend = page.locator('[data-testid="total-monthly-spend"]');
    this.totalCreditLimit = page.locator('[data-testid="total-credit-limit"]');
    this.availableCredit = page.locator('[data-testid="available-credit"]');
    this.outstandingAmount = page.locator('[data-testid="outstanding-amount"]');
    this.utilizationPercentage = page.locator('[data-testid="utilization-percentage"]');
    this.transactionCount = page.locator('[data-testid="transaction-count"]');
    this.newTransactionButton = page.locator('[data-testid="new-transaction-btn"]');
    this.transactionModal = page.locator('[data-testid="transaction-modal"]');
    this.transactionSubmitButton = page.locator('[data-testid="transaction-submit-btn"]');
  }

  async gotoSummarySection() {
    await expect(this.summarySection).toBeVisible();
  }

  async assertSummaryFieldsVisible() {
    await expect(this.totalMonthlySpend).toBeVisible();
    await expect(this.totalCreditLimit).toBeVisible();
    await expect(this.availableCredit).toBeVisible();
    await expect(this.outstandingAmount).toBeVisible();
    await expect(this.utilizationPercentage).toBeVisible();
  }

  async assertSummaryFieldsPopulated() {
    await expect(this.totalMonthlySpend).not.toHaveText('');
    await expect(this.totalCreditLimit).not.toHaveText('');
    await expect(this.availableCredit).not.toHaveText('');
    await expect(this.outstandingAmount).not.toHaveText('');
    await expect(this.utilizationPercentage).not.toHaveText('');
  }

  async getOutstandingAmount() {
    const text = await this.outstandingAmount.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTotalCreditLimit() {
    const text = await this.totalCreditLimit.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getUtilizationPercentage() {
    const text = await this.utilizationPercentage.textContent();
    return parseInt(text.replace(/[^0-9]/g, ''));
  }

  async gotoDashboard() {
    await expect(this.summarySection).toBeVisible();
  }

  async getCurrentMonthTransactionCount() {
    await expect(this.transactionCount).toBeVisible();
    const text = await this.transactionCount.textContent();
    return parseInt(text.replace(/[^0-9]/g, ''));
  }

  async triggerNewTransaction(transactionData) {
    await this.newTransactionButton.click();
    await expect(this.transactionModal).toBeVisible();
    // Assume transaction modal fields are filled below
    for (const [field, value] of Object.entries(transactionData)) {
      await this.page.locator(`[data-testid="transaction-${field}"]`).fill(value);
    }
    await this.transactionSubmitButton.click();
  }

  async waitForTransactionRefresh() {
    // Wait for transaction count to update, using Playwright auto-wait
    await this.page.waitForLoadState('networkidle');
  }
};