const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AuditPage = class AuditPage {
  constructor(page) {
    this.page = page;
    this.auditLink = page.locator('a:has-text("Audit"), .nav-link:has-text("Audit")');
    this.auditLogTable = page.locator('table, .audit-log-table, .audit-log');
    this.auditEntries = page.locator('.audit-entry, .audit-log-entry, table tbody tr');
    this.eventTypeFilter = page.locator('select[name="eventType"], #eventTypeFilter, select:has-text("Event Type")');
    this.userIdFilter = page.locator('select[name="userId"], #userIdFilter, input[name="userId"]');
    this.startDateFilter = page.locator('input[name="startDate"], #startDate');
    this.endDateFilter = page.locator('input[name="endDate"], #endDate');
    this.editButton = page.locator('button:has-text("Edit")');
    this.deleteButton = page.locator('button:has-text("Delete")');
  }

  async navigateToAuditLog() {
    logger.info('Navigating to audit log');
    await this.auditLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.auditLogTable).toBeVisible({ timeout: 10000 });
    logger.info('Audit log page loaded');
  }

  async filterByEventType(eventType) {
    logger.info(`Filtering by event type: ${eventType}`);
    await this.eventTypeFilter.selectOption(eventType);
    await this.page.waitForTimeout(1000);
    logger.info('Event type filter applied');
  }

  async filterByUserId(userId) {
    logger.info(`Filtering by user ID: ${userId}`);
    if (await this.userIdFilter.getAttribute('type') === 'text') {
      await this.userIdFilter.fill(userId);
    } else {
      await this.userIdFilter.selectOption(userId);
    }
    await this.page.waitForTimeout(1000);
    logger.info('User ID filter applied');
  }

  async getAuditEntries() {
    logger.info('Getting audit entries');
    const entries = await this.auditEntries.all();
    const auditData = [];
    for (const entry of entries) {
      const cells = await entry.locator('td, .audit-field').allTextContents();
      if (cells.length >= 4) {
        auditData.push({
          eventType: cells[0]?.trim(),
          applicationId: cells[1]?.trim(),
          timestamp: cells[2]?.trim(),
          userId: cells[3]?.trim(),
          userName: cells[4]?.trim(),
          details: cells[5]?.trim()
        });
      } else {
        const eventType = await entry.locator('.event-type, strong').first().textContent();
        const timestamp = await entry.locator('.timestamp, .time').first().textContent();
        const details = await entry.locator('.details, p').first().textContent();
        auditData.push({
          eventType: eventType?.trim(),
          timestamp: timestamp?.trim(),
          details: details?.trim(),
          userId: '',
          userName: '',
          applicationId: ''
        });
      }
    }
    logger.info(`Retrieved ${auditData.length} audit entries`);
    return auditData;
  }

  async checkIfAuditEntriesEditable() {
    logger.info('Checking if audit entries are editable');
    const editButtonCount = await this.editButton.count();
    logger.info(`Edit buttons found: ${editButtonCount}`);
    return editButtonCount > 0;
  }

  async checkForEditButtons() {
    logger.info('Checking for edit buttons in audit log');
    const count = await this.editButton.count();
    logger.info(`Edit button count: ${count}`);
    return count > 0;
  }

  async checkForDeleteButtons() {
    logger.info('Checking for delete buttons in audit log');
    const count = await this.deleteButton.count();
    logger.info(`Delete button count: ${count}`);
    return count > 0;
  }

  async attemptToModifyAuditEntry(entryId) {
    logger.info(`Attempting to modify audit entry: ${entryId}`);
    try {
      const response = await this.page.request.put(`/api/audit/${entryId}`, {
        data: { details: 'Modified details' }
      });
      if (response.ok()) {
        return { success: true };
      } else {
        const body = await response.text();
        return { success: false, error: body };
      }
    } catch (error) {
      logger.info(`Modification attempt failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async attemptToDeleteAuditEntry(entryId) {
    logger.info(`Attempting to delete audit entry: ${entryId}`);
    try {
      const response = await this.page.request.delete(`/api/audit/${entryId}`);
      if (response.ok()) {
        return { success: true };
      } else {
        const body = await response.text();
        return { success: false, error: body };
      }
    } catch (error) {
      logger.info(`Deletion attempt failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async getAuditEntryById(entryId) {
    logger.info(`Getting audit entry by ID: ${entryId}`);
    const entries = await this.getAuditEntries();
    const entry = entries.find(e => e.id === entryId);
    logger.info(`Audit entry ${entryId} retrieved`);
    return entry;
  }
};