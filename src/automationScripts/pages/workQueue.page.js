const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.WorkQueuePage = class WorkQueuePage {
  constructor(page) {
    this.page = page;
    
    // Main elements
    this.workQueueTable = page.locator('.work-queue-table');
    this.applicationRow = page.locator('.application-row');
    this.priorityScoreCell = page.locator('.priority-score');
    
    // Filters
    this.statusFilter = page.locator('#status-filter');
    this.payerFilter = page.locator('#payer-filter');
    this.priorityFilter = page.locator('#priority-filter');
    this.filterApplyButton = page.locator('button:has-text("Apply Filters")');
    this.clearFiltersButton = page.locator('button:has-text("Clear Filters")');
    
    // Empty state
    this.emptyStateMessage = page.locator('.empty-state-message');
    this.errorMessage = page.locator('.error-message');
    
    // Navigation
    this.dashboardLink = page.locator('a:has-text("Dashboard")');
    
    // Application details
    this.applicationIdCell = page.locator('.application-id');
    this.applicationStatusCell = page.locator('.application-status');
    this.applicationPayersCell = page.locator('.application-payers');
    this.applicationPriorityCell = page.locator('.application-priority');
  }

  async navigate() {
    await this.page.goto('/work-queue');
    await expect(this.workQueueTable).toBeVisible();
    logger.info('Navigated to work queue page');
  }

  async getApplicationList() {
    const count = await this.applicationRow.count();
    const applications = [];
    for (let i = 0; i < count; i++) {
      const row = this.applicationRow.nth(i);
      const id = await row.locator('.application-id').textContent();
      const status = await row.locator('.application-status').textContent();
      const payers = await row.locator('.application-payers').textContent();
      const priority = await row.locator('.application-priority').textContent();
      const priorityScore = await row.locator('.priority-score').textContent();
      applications.push({
        id: id.trim(),
        status: status.trim(),
        payers: payers.trim(),
        priority: priority.trim(),
        priorityScore: parseInt(priorityScore.trim())
      });
    }
    return applications;
  }

  async getPriorityScores() {
    await expect(this.priorityScoreCell.first()).toBeVisible();
    const scores = await this.priorityScoreCell.allTextContents();
    return scores.map(s => parseInt(s.trim()));
  }

  async getApplicationPriorityScore(index) {
    const score = await this.priorityScoreCell.nth(index).textContent();
    return parseInt(score.trim());
  }

  async getApplicationCount() {
    const count = await this.applicationRow.count();
    return count;
  }

  async filterByStatus(status) {
    await expect(this.statusFilter).toBeVisible();
    await this.statusFilter.selectOption({ label: status });
    logger.info(`Status filter set to: ${status}`);
  }

  async filterByPayer(payer) {
    await expect(this.payerFilter).toBeVisible();
    await this.payerFilter.selectOption({ label: payer });
    logger.info(`Payer filter set to: ${payer}`);
  }

  async filterByPriority(priority) {
    await expect(this.priorityFilter).toBeVisible();
    await this.priorityFilter.selectOption({ label: priority });
    logger.info(`Priority filter set to: ${priority}`);
  }

  async waitForFilterUpdate() {
    await this.page.waitForTimeout(1000);
    await expect(this.workQueueTable).toBeVisible();
    logger.info('Filter update completed');
  }

  async navigateToDashboard() {
    await expect(this.dashboardLink).toBeVisible();
    await this.dashboardLink.click();
    logger.info('Navigated to dashboard from work queue');
  }

  async getApplicationOrder() {
    const ids = await this.applicationIdCell.allTextContents();
    return ids.map(id => id.trim());
  }

  async getApplicationPosition(applicationId) {
    const order = await this.getApplicationOrder();
    return order.indexOf(applicationId);
  }
};