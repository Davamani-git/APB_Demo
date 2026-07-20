const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.summarySection = page.locator('#dashboard-summary');
    this.totalMonthlySpend = page.locator('[data-testid="monthly-spend"]');
    this.totalCreditLimit = page.locator('[data-testid="credit-limit"]');
    this.availableCredit = page.locator('[data-testid="available-credit"]');
    this.outstandingAmount = page.locator('[data-testid="outstanding-amount"]');
    this.utilizationPercentage = page.locator('[data-testid="utilization-percentage"]');
    this.transactionCount = page.locator('[data-testid="transaction-count"]');
    this.refreshButton = page.locator('#refresh-dashboard');
    this.newTransactionButton = page.locator('#add-transaction');
    this.transactionForm = page.locator('#transaction-form');
    this.transactionAmountInput = page.locator('#transaction-amount');
    this.transactionMerchantInput = page.locator('#transaction-merchant');
    this.transactionSubmitButton = page.locator('#transaction-submit');
  }
  async gotoDashboardSummary() {
    await expect(this.summarySection).toBeVisible();
  }
  async assertSummaryMetricsVisible() {
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
    const value = await this.outstandingAmount.textContent();
    return parseFloat(value.replace(/[^\d\.]/g, ''));
  }
  async getCreditLimit() {
    await expect(this.totalCreditLimit).toBeVisible();
    const value = await this.totalCreditLimit.textContent();
    return parseFloat(value.replace(/[^\d\.]/g, ''));
  }
  async getUtilizationPercentage() {
    await expect(this.utilizationPercentage).toBeVisible();
    const value = await this.utilizationPercentage.textContent();
    return parseInt(value.replace(/[^\d]/g, ''));
  }
  async getTransactionCount() {
    await expect(this.transactionCount).toBeVisible();
    const value = await this.transactionCount.textContent();
    return parseInt(value.replace(/[^\d]/g, ''));
  }
  async triggerNewTransaction({amount, merchant}) {
    await this.newTransactionButton.click();
    await expect(this.transactionForm).toBeVisible();
    await this.transactionAmountInput.fill(amount.toString());
    await this.transactionMerchantInput.fill(merchant);
    await this.transactionSubmitButton.click();
  }
  async waitForRefresh() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.summarySection).toBeVisible();
  }
};