const { expect } = require('@playwright/test');
const { logger } = require('../../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardRoot = page.locator('#dashboard');
    this.summarySection = page.locator('#dashboard-summary');
    this.monthlySpend = page.locator('[data-testid="monthly-spend"]');
    this.creditLimit = page.locator('[data-testid="credit-limit"]');
    this.availableCredit = page.locator('[data-testid="available-credit"]');
    this.outstandingAmount = page.locator('[data-testid="outstanding-amount"]');
    this.utilizationPercent = page.locator('[data-testid="utilization-percent"]');
    this.transactionCount = page.locator('[data-testid="transaction-count"]');
    this.datePicker = page.locator('[data-testid="date-picker"]');
    this.noDataMessage = page.locator('[data-testid="no-data-message"]');
    this.refreshButton = page.locator('[data-testid="refresh-dashboard"]');
  }
  async waitForDashboardLoaded() {
    logger.info('Waiting for dashboard to load');
    await expect(this.dashboardRoot).toBeVisible();
  }
  async goToSummarySection() {
    logger.info('Navigating to dashboard summary section');
    await expect(this.summarySection).toBeVisible();
  }
  async assertSummaryFieldsPopulated() {
    logger.info('Asserting summary fields are visible and populated');
    await expect(this.monthlySpend).toBeVisible();
    await expect(this.creditLimit).toBeVisible();
    await expect(this.availableCredit).toBeVisible();
    await expect(this.outstandingAmount).toBeVisible();
    await expect(this.utilizationPercent).toBeVisible();
    await expect(this.monthlySpend).not.toHaveText('');
    await expect(this.creditLimit).not.toHaveText('');
    await expect(this.availableCredit).not.toHaveText('');
    await expect(this.outstandingAmount).not.toHaveText('');
    await expect(this.utilizationPercent).not.toHaveText('');
  }
  async getOutstandingAndCreditLimit() {
    logger.info('Getting outstanding amount and credit limit');
    const outstanding = parseFloat(await this.outstandingAmount.textContent());
    const creditLimit = parseFloat(await this.creditLimit.textContent());
    return { outstanding, creditLimit };
  }
  async getUtilizationPercentage() {
    logger.info('Getting utilization percentage');
    const utilizationText = await this.utilizationPercent.textContent();
    return parseInt(utilizationText.replace('%', '').trim());
  }
  async getTransactionCount() {
    logger.info('Getting transaction count');
    const countText = await this.transactionCount.textContent();
    return parseInt(countText.trim());
  }
  async addNewTransaction(transactionData) {
    logger.info('Adding new transaction');
    // Simulate adding a transaction (assumes modal/form is available)
    await this.page.locator('[data-testid="add-transaction"]').click();
    await this.page.locator('[data-testid="transaction-merchant"]').fill(transactionData.merchant);
    await this.page.locator('[data-testid="transaction-amount"]').fill(transactionData.amount);
    await this.page.locator('[data-testid="transaction-submit"]').click();
    await expect(this.page.locator('[data-testid="transaction-success"]')).toBeVisible();
  }
  async waitForRefresh() {
    logger.info('Waiting for dashboard refresh');
    await expect(this.dashboardRoot).toBeVisible();
    // Optionally wait for transaction count to update
  }
  async selectMonth(monthName) {
    logger.info(`Selecting month: ${monthName}`);
    await this.datePicker.selectOption({ label: monthName });
    await expect(this.summarySection).toBeVisible();
  }
  async assertSummaryMetrics(expectedMetrics) {
    logger.info('Asserting summary metrics for selected month');
    await expect(this.monthlySpend).toHaveText(expectedMetrics.monthlySpend);
    await expect(this.creditLimit).toHaveText(expectedMetrics.creditLimit);
    await expect(this.availableCredit).toHaveText(expectedMetrics.availableCredit);
    await expect(this.outstandingAmount).toHaveText(expectedMetrics.outstanding);
    await expect(this.utilizationPercent).toHaveText(expectedMetrics.utilizationPercent);
    await expect(this.transactionCount).toHaveText(expectedMetrics.transactionCount);
  }
  async assertNoDataSummary() {
    logger.info('Asserting summary metrics show zero values and no data message');
    await expect(this.monthlySpend).toHaveText('0');
    await expect(this.creditLimit).toHaveText('0');
    await expect(this.availableCredit).toHaveText('0');
    await expect(this.outstandingAmount).toHaveText('0');
    await expect(this.utilizationPercent).toHaveText('0%');
    await expect(this.noDataMessage).toBeVisible();
  }
  async refreshSummary() {
    logger.info('Refreshing dashboard summary');
    await this.refreshButton.click();
    await expect(this.summarySection).toBeVisible();
  }
  async assertNoSensitiveData() {
    logger.info('Asserting no PII, PHI, PCI data exposed');
    // Check for absence of sensitive info
    await expect(this.page.locator('[data-testid="sensitive-info"]')).toHaveCount(0);
  }
  async selectDateRange(from, to) {
    logger.info(`Selecting date range: ${from} - ${to}`);
    await this.page.locator('[data-testid="date-picker-from"]').fill(from);
    await this.page.locator('[data-testid="date-picker-to"]').fill(to);
    await this.page.locator('[data-testid="date-picker-apply"]').click();
    await expect(this.summarySection).toBeVisible();
  }
  async assertSummaryMetricsVisible() {
    logger.info('Asserting summary metrics are visible');
    await expect(this.monthlySpend).toBeVisible();
    await expect(this.creditLimit).toBeVisible();
    await expect(this.availableCredit).toBeVisible();
    await expect(this.outstandingAmount).toBeVisible();
    await expect(this.utilizationPercent).toBeVisible();
  }
  async goToSummaryMetricsSection() {
    logger.info('Navigating to summary metrics section');
    await expect(this.summarySection).toBeVisible();
  }
  async assertNoCardholderIdentifiers() {
    logger.info('Asserting no cardholder identifiers are exposed');
    await expect(this.page.locator('[data-testid="cardholder-id"]')).toHaveCount(0);
  }
  async openOnUnsupportedDevice(deviceConfig) {
    logger.info(`Opening dashboard on unsupported device: ${deviceConfig}`);
    // Device emulation handled by Playwright config
    await this.page.goto(deviceConfig.url);
    await expect(this.dashboardRoot).toBeVisible();
  }
  async assertSummarySectionVisible() {
    logger.info('Asserting summary section is visible');
    await expect(this.summarySection).toBeVisible();
  }
  async assertNoDisplayIssues() {
    logger.info('Asserting no display issues');
    // Check for truncation/overlap
    await expect(this.summarySection).not.toHaveClass(/truncated|overlapped/);
  }
};
