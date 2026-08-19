const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.SystemLogsPage = class SystemLogsPage {
  constructor(page) {
    this.page = page;
    this.logLevelFilter = page.locator('#log-level-filter');
    this.logSearchInput = page.locator('#log-search');
    this.searchLogsButton = page.locator('button[data-testid="search-logs"]');
    this.logEntries = page.locator('.log-entry');
    this.logLevelDisplay = page.locator('.log-level');
    this.logMessageDisplay = page.locator('.log-message');
    this.transactionIdInLog = page.locator('.transaction-id-log');
    this.errorDetailsDisplay = page.locator('.error-details');
    this.actionTakenDisplay = page.locator('.action-taken');
  }

  async navigate() {
    logger.info('Navigating to System Logs page');
    await this.page.goto('/fraud-alert/system-logs');
    await expect(this.page).toHaveURL(/.*system-logs/);
  }

  async filterByLogLevel(logLevel) {
    logger.info(`Filtering logs by level: ${logLevel}`);
    await expect(this.logLevelFilter).toBeVisible();
    await this.logLevelFilter.selectOption(logLevel);
  }

  async searchLogs(searchTerm) {
    logger.info(`Searching logs for: ${searchTerm}`);
    await expect(this.logSearchInput).toBeVisible();
    await this.logSearchInput.fill(searchTerm);
    await expect(this.searchLogsButton).toBeEnabled();
    await this.searchLogsButton.click();
  }

  async verifyErrorLogged(logLevel, errorMessage) {
    logger.info(`Verifying error logged: ${errorMessage}`);
    await this.filterByLogLevel(logLevel);
    await this.searchLogs(errorMessage);
    await expect(this.logEntries.first()).toBeVisible();
    await expect(this.logLevelDisplay.first()).toContainText(logLevel);
    await expect(this.logMessageDisplay.first()).toContainText(errorMessage);
  }

  async verifyFailSafeActionLogged(transactionId, action) {
    logger.info(`Verifying fail-safe action logged for: ${transactionId}`);
    await this.searchLogs(transactionId);
    await expect(this.logEntries.first()).toBeVisible();
    await expect(this.transactionIdInLog.first()).toContainText(transactionId);
    await expect(this.actionTakenDisplay.first()).toContainText(action);
  }

  async verifyCriticalErrorLogged(logLevel, errorMessage) {
    logger.info(`Verifying critical error logged: ${errorMessage}`);
    await this.filterByLogLevel(logLevel);
    await this.searchLogs(errorMessage);
    await expect(this.logEntries.first()).toBeVisible();
    await expect(this.logLevelDisplay.first()).toContainText(logLevel);
    await expect(this.logMessageDisplay.first()).toContainText(errorMessage);
  }
};
