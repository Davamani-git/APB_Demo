const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.UserManagementPage = class UserManagementPage {
  constructor(page) {
    this.page = page;
    this.userManagementLink = page.locator('a:has-text("User Management"), [data-testid="user-management-link"], nav >> text=User Management');
    this.userManagementPage = page.locator('[data-testid="user-management-page"], .user-management-container, #user-management');
    this.userListContainer = page.locator('[data-testid="user-list"], .user-list, #user-list, .users-table');
    this.userDetailsPanel = page.locator('[data-testid="user-details-panel"], .user-details, #user-details, .permissions-panel');
    this.assignedCompaniesContainer = page.locator('[data-testid="assigned-companies"], .assigned-companies, #assigned-companies');
    this.rolePermissionIndicator = page.locator('[data-testid="role-permission"], .role-indicator, .permission-badge');
    this.successMessage = page.locator('.success-message, .alert-success, [data-testid="success-message"], .notification-success');
    this.saveButton = page.locator('button:has-text("Save"), button[type="submit"], [data-testid="save-button"]');
    this.auditLogsLink = page.locator('a:has-text("Audit Logs"), [data-testid="audit-logs-link"], nav >> text=Audit');
    this.auditLogEntry = page.locator('[data-testid="audit-log-entry"], .audit-log-row, .log-entry');
    this.auditLogTimestamp = page.locator('[data-testid="audit-timestamp"], .timestamp, .log-timestamp');
    this.auditLogUserDetails = page.locator('[data-testid="audit-user-details"], .user-details-log, .log-user');
    this.auditLogActions = page.locator('[data-testid="audit-actions"], .actions-log, .log-actions');
    this.auditLogTargetResource = page.locator('[data-testid="target-resource"], .target-resource, .log-resource');
    this.userFilterInput = page.locator('input[placeholder*="Filter"], input[name="userFilter"], [data-testid="user-filter"]');
    this.eventTypeFilter = page.locator('select[name="eventType"], [data-testid="event-type-filter"], #event-type-filter');
  }

  async navigateToUserManagement() {
    logger.info('Navigating to User Management section');
    await expect(this.userManagementLink).toBeVisible();
    await this.userManagementLink.click();
    await expect(this.userListContainer).toBeVisible({ timeout: 10000 });
  }

  async selectUser(userEmail) {
    logger.info(`Selecting user: ${userEmail}`);
    const userRow = this.page.locator(`tr:has-text("${userEmail}"), .user-item:has-text("${userEmail}"), [data-user="${userEmail}"]`);
    await expect(userRow).toBeVisible();
    await userRow.click();
    await expect(this.userDetailsPanel).toBeVisible();
  }

  async assignPortfolioCompanies(companies) {
    logger.info(`Assigning portfolio companies: ${companies.join(', ')}`);
    for (const company of companies) {
      const companyCheckbox = this.page.locator(`input[type="checkbox"][value*="${company}"], label:has-text("${company}") input[type="checkbox"]`);
      await expect(companyCheckbox).toBeVisible();
      await companyCheckbox.check();
    }
  }

  async setRolePermission(role) {
    logger.info(`Setting role permission: ${role}`);
    const roleDropdown = this.page.locator('select[name="role"], [data-testid="role-select"], #role-select');
    const roleRadio = this.page.locator(`input[type="radio"][value="${role}"], label:has-text("${role}") input[type="radio"]`);
    
    if (await roleDropdown.isVisible().catch(() => false)) {
      await roleDropdown.selectOption({ label: role });
    } else if (await roleRadio.isVisible().catch(() => false)) {
      await roleRadio.check();
    }
  }

  async saveConfiguration() {
    logger.info('Saving configuration');
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();
  }

  async navigateToAuditLogs() {
    logger.info('Navigating to Audit Logs');
    await expect(this.auditLogsLink).toBeVisible();
    await this.auditLogsLink.click();
    await expect(this.auditLogEntry.first()).toBeVisible({ timeout: 10000 });
  }

  async filterAuditLogs(userEmail) {
    logger.info(`Filtering audit logs by user: ${userEmail}`);
    await expect(this.userFilterInput).toBeVisible();
    await this.userFilterInput.fill(userEmail);
    await this.page.keyboard.press('Enter');
  }

  async filterAuditLogsByUser(userEmail) {
    await this.filterAuditLogs(userEmail);
  }

  async filterAuditLogsByEventType(eventType) {
    logger.info(`Filtering audit logs by event type: ${eventType}`);
    await expect(this.eventTypeFilter).toBeVisible();
    await this.eventTypeFilter.selectOption({ label: eventType });
  }
};
