const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

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
    this.addTransactionButton = page.locator('#add-transaction-btn');
    this.refreshBtn = page.locator('#refresh-dashboard-btn');
  }
  async gotoSummarySection() {
    logger.info('Navigating to dashboard summary section');
    await expect(this.summarySection).toBeVisible();
  }
  async assertSummarySectionVisible() {
    logger.info('Asserting dashboard summary section is visible');
    await expect(this.summarySection).toBeVisible();
  }
  async assertSummaryMetricsPopulated(financialData) {
    logger.info('Validating summary metrics are populated');
    await expect(this.totalMonthlySpend).toHaveText(financialData.totalMonthlySpend);
    await expect(this.totalCreditLimit).toHaveText(financialData.totalCreditLimit);
    await expect(this.availableCredit).toHaveText(financialData.availableCredit);
    await expect(this.outstandingAmount).toHaveText(financialData.outstandingAmount);
    await expect(this.utilizationPercentage).toHaveText(financialData.utilizationPercentage);
  }
  async getOutstandingAmount() {
    logger.info('Getting outstanding amount from dashboard');
    return Number(await this.outstandingAmount.textContent());
  }
  async getTotalCreditLimit() {
    logger.info('Getting total credit limit from dashboard');
    return Number(await this.totalCreditLimit.textContent());
  }
  async getUtilizationPercentage() {
    logger.info('Getting utilization percentage from dashboard');
    return Number(await this.utilizationPercentage.textContent());
  }
  async getTransactionCount(month) {
    logger.info(`Getting transaction count for month: ${month}`);
    await expect(this.transactionCount).toBeVisible();
    return Number(await this.transactionCount.textContent());
  }
  async addNewTransaction(transactionDetails) {
    logger.info('Adding new transaction');
    await this.addTransactionButton.click();
    // Assume modal opens and fields are available
    const merchantInput = this.page.locator('#merchant');
    const amountInput = this.page.locator('#amount');
    const categoryInput = this.page.locator('#category');
    const submitBtn = this.page.locator('#submit-transaction');
    await expect(merchantInput).toBeVisible();
    await merchantInput.fill(transactionDetails.merchant);
    await amountInput.fill(String(transactionDetails.amount));
    await categoryInput.fill(transactionDetails.category);
    await submitBtn.click();
    await expect(this.summarySection).toBeVisible();
  }
  async waitForRefreshCycle() {
    logger.info('Waiting for dashboard refresh cycle');
    await this.refreshBtn.click();
    await expect(this.summarySection).toBeVisible();
  }
};