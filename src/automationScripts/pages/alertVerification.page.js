const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.AlertVerificationPage = class AlertVerificationPage {
  constructor(page) {
    this.page = page;
    this.alertSearchInput = page.locator('#alert-search');
    this.searchByTransactionInput = page.locator('#search-by-transaction');
    this.searchButton = page.locator('button[data-testid="search-alert"]');
    this.alertIdDisplay = page.locator('.alert-id');
    this.transactionIdDisplay = page.locator('.transaction-id');
    this.riskBandDisplay = page.locator('.risk-band');
    this.severityDisplay = page.locator('.severity');
    this.statusDisplay = page.locator('.status');
    this.decisionDisplay = page.locator('.decision');
    this.alertRecord = page.locator('.alert-record');
    this.noAlertMessage = page.locator('.no-alert-message');
    this.thresholdVersionDisplay = page.locator('.threshold-version');
    this.thresholdConfigDisplay = page.locator('.threshold-config');
    this.thresholdSourceDisplay = page.locator('.threshold-source');
  }

  async navigate() {
    logger.info('Navigating to Alert Verification page');
    await this.page.goto('/fraud-alert/alert-verification');
    await expect(this.page).toHaveURL(/.*alert-verification/);
  }

  async searchAlert(alertId) {
    logger.info(`Searching for alert: ${alertId}`);
    await expect(this.alertSearchInput).toBeVisible();
    await this.alertSearchInput.fill(alertId);
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }

  async searchByTransaction(transactionId) {
    logger.info(`Searching alert by transaction: ${transactionId}`);
    await expect(this.searchByTransactionInput).toBeVisible();
    await this.searchByTransactionInput.fill(transactionId);
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }

  async verifyAlertCreated(alertId, transactionId, riskBand, status, decision) {
    logger.info(`Verifying alert created: ${alertId}`);
    await this.searchAlert(alertId);
    await expect(this.alertRecord).toBeVisible();
    await expect(this.alertIdDisplay).toContainText(alertId);
    await expect(this.transactionIdDisplay).toContainText(transactionId);
    await expect(this.riskBandDisplay).toContainText(riskBand);
    await expect(this.statusDisplay).toContainText(status);
    await expect(this.decisionDisplay).toContainText(decision);
  }

  async verifyUrgentAlertCreated(alertId, transactionId, riskBand, severity, status, decision) {
    logger.info(`Verifying urgent alert created: ${alertId}`);
    await this.searchAlert(alertId);
    await expect(this.alertRecord).toBeVisible();
    await expect(this.alertIdDisplay).toContainText(alertId);
    await expect(this.transactionIdDisplay).toContainText(transactionId);
    await expect(this.riskBandDisplay).toContainText(riskBand);
    await expect(this.severityDisplay).toContainText(severity);
    await expect(this.statusDisplay).toContainText(status);
    await expect(this.decisionDisplay).toContainText(decision);
  }

  async verifyNoAlertCreated(transactionId) {
    logger.info(`Verifying no alert created for transaction: ${transactionId}`);
    await this.searchByTransaction(transactionId);
    await expect(this.noAlertMessage).toBeVisible();
    await expect(this.noAlertMessage).toContainText('No alert record exists');
  }

  async verifyAlertWithThresholdVersion(alertId, transactionId, riskBand, decision, thresholdVersion) {
    logger.info(`Verifying alert with threshold version: ${alertId}`);
    await this.searchAlert(alertId);
    await expect(this.alertRecord).toBeVisible();
    await expect(this.alertIdDisplay).toContainText(alertId);
    await expect(this.transactionIdDisplay).toContainText(transactionId);
    await expect(this.riskBandDisplay).toContainText(riskBand);
    await expect(this.decisionDisplay).toContainText(decision);
    await expect(this.thresholdVersionDisplay).toContainText(thresholdVersion);
  }

  async verifyThresholdVersions(transactionId1, version1, transactionId2, version2) {
    logger.info(`Verifying threshold versions for transactions: ${transactionId1} and ${transactionId2}`);
    await this.searchByTransaction(transactionId1);
    await expect(this.thresholdVersionDisplay).toContainText(version1);
    await this.searchByTransaction(transactionId2);
    await expect(this.thresholdVersionDisplay).toContainText(version2);
  }

  async verifyNoAlertCreatedWithServerConfig(transactionId, riskBand, thresholdSource) {
    logger.info(`Verifying no alert with server config for: ${transactionId}`);
    await this.searchByTransaction(transactionId);
    await expect(this.noAlertMessage).toBeVisible();
    await expect(this.thresholdSourceDisplay).toContainText(thresholdSource);
  }
};
