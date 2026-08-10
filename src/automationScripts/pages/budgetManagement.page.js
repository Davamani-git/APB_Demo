const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.BudgetManagementPage = class BudgetManagementPage {
  constructor(page) {
    this.page = page;
    this.budgetManagementLink = page.locator('a:has-text("Budget"), [data-testid="budget-link"], nav >> text=Budget');
    this.budgetManagementPage = page.locator('[data-testid="budget-management"], .budget-management, #budget-management');
    this.companySelector = page.locator('select[name="company"], [data-testid="company-select"], #company-select');
    this.budgetThresholdInput = page.locator('input[name="threshold"], [data-testid="budget-threshold"], #budget-threshold');
    this.saveButton = page.locator('button:has-text("Save"), button[type="submit"], [data-testid="save-button"]');
    this.successMessage = page.locator('.success-message, .alert-success, [data-testid="success-message"]');
    this.assignedPartnersContainer = page.locator('[data-testid="assigned-partners"], .assigned-partners, #assigned-partners');
    this.notificationChannelsIndicator = page.locator('[data-testid="notification-channels"], .notification-channels, .channels-list');
    this.dataSyncButton = page.locator('button:has-text("Sync Data"), [data-testid="sync-button"], .sync-btn');
    this.dataSyncSuccessMessage = page.locator('[data-testid="sync-success"], .sync-success, .data-sync-success');
    this.alertTriggeredIndicator = page.locator('[data-testid="alert-triggered"], .alert-indicator, .alert-status');
    this.alertContentContainer = page.locator('[data-testid="alert-content"], .alert-details, .alert-message');
    this.alertLogsLink = page.locator('a:has-text("Alert Logs"), [data-testid="alert-logs-link"], nav >> text=Alerts');
    this.noAlertsMessage = page.locator('[data-testid="no-alerts"], .no-alerts-message, .empty-alerts');
    this.systemErrorLogsLink = page.locator('a:has-text("Error Logs"), [data-testid="error-logs-link"], nav >> text=Errors');
    this.errorLogEntry = page.locator('[data-testid="error-log-entry"], .error-log-row, .log-error');
    this.adminNotificationMessage = page.locator('[data-testid="admin-notification"], .admin-notification, .admin-alert');
  }

  async navigateToBudgetManagement() {
    logger.info('Navigating to Budget Management');
    await expect(this.budgetManagementLink).toBeVisible();
    await this.budgetManagementLink.click();
    await expect(this.budgetManagementPage).toBeVisible({ timeout: 10000 });
  }

  async selectPortfolioCompany(companyName) {
    logger.info(`Selecting portfolio company: ${companyName}`);
    await expect(this.companySelector).toBeVisible();
    await this.companySelector.selectOption({ label: companyName });
  }

  async setBudgetThreshold(amount) {
    logger.info(`Setting budget threshold: $${amount}`);
    await expect(this.budgetThresholdInput).toBeVisible();
    await this.budgetThresholdInput.clear();
    await this.budgetThresholdInput.fill(amount);
  }

  async saveBudgetConfiguration() {
    logger.info('Saving budget configuration');
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();
  }

  async assignOperatingPartners(partners) {
    logger.info(`Assigning operating partners: ${partners.join(', ')}`);
    for (const partner of partners) {
      const partnerCheckbox = this.page.locator(`input[type="checkbox"][value*="${partner}"], label:has-text("${partner}") input[type="checkbox"]`);
      await expect(partnerCheckbox).toBeVisible();
      await partnerCheckbox.check();
    }
  }

  async configureNotificationChannels(channels) {
    logger.info(`Configuring notification channels: ${channels.join(', ')}`);
    for (const channel of channels) {
      const channelCheckbox = this.page.locator(`input[type="checkbox"][value="${channel}"], label:has-text("${channel}") input[type="checkbox"]`);
      await expect(channelCheckbox).toBeVisible();
      await channelCheckbox.check();
    }
  }

  async triggerDataSync(companyName, newSpend) {
    logger.info(`Triggering data sync for ${companyName} with spend: $${newSpend}`);
    const spendInput = this.page.locator('input[name="aiSpend"], [data-testid="ai-spend-input"], #ai-spend');
    await expect(spendInput).toBeVisible();
    await spendInput.fill(newSpend);
    await expect(this.dataSyncButton).toBeVisible();
    await this.dataSyncButton.click();
  }

  async waitForAlertProcessing() {
    logger.info('Waiting for alert processing (up to 5 minutes)');
    await this.page.waitForTimeout(5000); // Wait 5 seconds for alert processing simulation
  }

  async waitForAlertProcessingWindow(minutes) {
    logger.info(`Waiting for alert processing window: ${minutes} minutes`);
    await this.page.waitForTimeout(minutes * 1000); // Simulate wait time
  }

  async verifyAlertDelivery(partners) {
    logger.info(`Verifying alert delivery to: ${partners.join(', ')}`);
    for (const partner of partners) {
      const deliveryStatus = this.alertDeliveryStatus(partner);
      await expect(deliveryStatus).toBeVisible({ timeout: 10000 });
    }
  }

  alertDeliveryStatus(partnerEmail) {
    return this.page.locator(`[data-partner="${partnerEmail}"] .delivery-status, .alert-delivery:has-text("${partnerEmail}")`);
  }

  async verifyNoAlertDelivered(partnerEmail) {
    logger.info(`Verifying no alert was delivered to: ${partnerEmail}`);
    const deliveryStatus = this.alertDeliveryStatus(partnerEmail);
    const isVisible = await deliveryStatus.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  }

  async viewAlertContent() {
    logger.info('Viewing alert content');
    const viewAlertButton = this.page.locator('button:has-text("View Alert"), [data-testid="view-alert-button"]');
    await expect(viewAlertButton).toBeVisible();
    await viewAlertButton.click();
    await expect(this.alertContentContainer).toBeVisible();
  }

  async navigateToAlertLogs() {
    logger.info('Navigating to Alert Logs');
    await expect(this.alertLogsLink).toBeVisible();
    await this.alertLogsLink.click();
  }

  async filterAlertLogs(companyName, timeRange) {
    logger.info(`Filtering alert logs: Company=${companyName}, Time=${timeRange}`);
    const companyFilter = this.page.locator('select[name="companyFilter"], [data-testid="company-filter"]');
    const timeFilter = this.page.locator('select[name="timeFilter"], [data-testid="time-filter"]');
    
    if (await companyFilter.isVisible().catch(() => false)) {
      await companyFilter.selectOption({ label: companyName });
    }
    if (await timeFilter.isVisible().catch(() => false)) {
      await timeFilter.selectOption({ label: timeRange });
    }
  }

  async navigateToSystemErrorLogs() {
    logger.info('Navigating to System Error Logs');
    await expect(this.systemErrorLogsLink).toBeVisible();
    await this.systemErrorLogsLink.click();
  }

  async filterErrorLogs(errorType) {
    logger.info(`Filtering error logs by type: ${errorType}`);
    const errorTypeFilter = this.page.locator('select[name="errorType"], [data-testid="error-type-filter"]');
    await expect(errorTypeFilter).toBeVisible();
    await errorTypeFilter.selectOption({ label: errorType });
  }

  async checkAdminNotifications() {
    logger.info('Checking admin notifications');
    const notificationsLink = this.page.locator('a:has-text("Notifications"), [data-testid="notifications-link"], .notifications-icon');
    await expect(notificationsLink).toBeVisible();
    await notificationsLink.click();
  }
};
