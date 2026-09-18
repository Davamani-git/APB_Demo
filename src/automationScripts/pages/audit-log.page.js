const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AuditLogPage = class AuditLogPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('h1:has-text("Audit Log")');
    this.eventTypeFilter = page.locator('select#eventTypeFilter');
    this.userFilter = page.locator('input#userFilter');
    this.ruleSetFilter = page.locator('input#ruleSetFilter');
    this.applicationIdFilter = page.locator('input#applicationIdFilter');
    this.applyFiltersButton = page.locator('button:has-text("Apply Filters")');
    this.auditLogRows = page.locator('table.audit-log tbody tr');
  }

  async navigate() {
    await this.page.goto(`${process.env.BASE_URL}/audit-log`);
    await expect(this.pageTitle).toBeVisible({ timeout: 10000 });
    logger.info('Navigated to Audit Log page');
  }

  async filterByEventType(eventType) {
    await expect(this.eventTypeFilter).toBeVisible();
    await this.eventTypeFilter.selectOption(eventType);
    logger.info(`Event type filter set to: ${eventType}`);
  }

  async filterByUser(userId) {
    await expect(this.userFilter).toBeVisible();
    await this.userFilter.fill(userId);
    logger.info(`User filter set to: ${userId}`);
  }

  async filterByRuleSet(ruleSetName) {
    await expect(this.ruleSetFilter).toBeVisible();
    await this.ruleSetFilter.fill(ruleSetName);
    logger.info(`Rule set filter set to: ${ruleSetName}`);
  }

  async filterByApplicationId(applicationId) {
    await expect(this.applicationIdFilter).toBeVisible();
    await this.applicationIdFilter.fill(applicationId);
    logger.info(`Application ID filter set to: ${applicationId}`);
  }

  async applyFilters() {
    await expect(this.applyFiltersButton).toBeVisible();
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Audit log filters applied');
  }

  async getLatestEntry() {
    await this.applyFilters();
    await expect(this.auditLogRows.first()).toBeVisible({ timeout: 5000 });
    const firstRow = this.auditLogRows.first();
    const cells = await firstRow.locator('td').all();
    
    const entry = {
      eventType: await cells[0].textContent(),
      userId: await cells[1].textContent(),
      timestamp: await cells[2].textContent(),
      details: await cells[3].textContent()
    };
    
    const detailsText = entry.details;
    if (detailsText.includes('ruleSetId')) {
      const match = detailsText.match(/ruleSetId:\s*([^,]+)/);
      entry.ruleSetId = match ? match[1].trim() : null;
    }
    if (detailsText.includes('oldValue')) {
      const match = detailsText.match(/oldValue:\s*([^,]+)/);
      entry.oldValue = match ? match[1].trim() : null;
    }
    if (detailsText.includes('newValue')) {
      const match = detailsText.match(/newValue:\s*(.+)/);
      entry.newValue = match ? match[1].trim() : null;
    }
    if (detailsText.includes('applicationId')) {
      const match = detailsText.match(/applicationId:\s*([^,]+)/);
      entry.applicationId = match ? match[1].trim() : null;
      entry.attemptedApplicationId = entry.applicationId;
    }
    if (detailsText.includes('result')) {
      const match = detailsText.match(/result:\s*([^,]+)/);
      entry.result = match ? match[1].trim() : null;
    }
    if (detailsText.includes('ocrExtractedDate')) {
      const match = detailsText.match(/ocrExtractedDate:\s*([^,]+)/);
      entry.ocrExtractedDate = match ? match[1].trim() : null;
    }
    if (detailsText.includes('coordinatorConfirmedDate')) {
      const match = detailsText.match(/coordinatorConfirmedDate:\s*([^,]+)/);
      entry.coordinatorConfirmedDate = match ? match[1].trim() : null;
    }
    if (detailsText.includes('coordinatorOverriddenDate')) {
      const match = detailsText.match(/coordinatorOverriddenDate:\s*([^,]+)/);
      entry.coordinatorOverriddenDate = match ? match[1].trim() : null;
    }
    if (detailsText.includes('fileName')) {
      const match = detailsText.match(/fileName:\s*([^,]+)/);
      entry.fileName = match ? match[1].trim() : null;
      entry.documentFileName = entry.fileName;
    }
    if (detailsText.includes('fileSize')) {
      const match = detailsText.match(/fileSize:\s*([^,]+)/);
      entry.fileSize = match ? match[1].trim() : null;
    }
    if (detailsText.includes('failureReason')) {
      const match = detailsText.match(/failureReason:\s*(.+)/);
      entry.failureReason = match ? match[1].trim() : null;
    }
    
    return entry;
  }
};
