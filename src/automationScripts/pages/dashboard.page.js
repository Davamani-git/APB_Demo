const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Main elements
    this.dashboardContainer = page.locator('.dashboard-container');
    this.statusCard = page.locator('.status-card');
    
    // Status categories
    this.readyToSubmitCard = page.locator('.status-card[data-status="Ready to Submit"]');
    this.incompleteCard = page.locator('.status-card[data-status="Incomplete"]');
    this.expiringSoonCard = page.locator('.status-card[data-status="Expiring Soon"]');
    
    // Drill-down elements
    this.coordinatorFilter = page.locator('#coordinator-filter');
    this.payerFilter = page.locator('#payer-filter');
    this.clearFiltersButton = page.locator('button:has-text("Clear Filters")');
    this.detailViewContainer = page.locator('.detail-view-container');
    this.applicationListItem = page.locator('.application-list-item');
    
    // Empty state and errors
    this.emptyStateMessage = page.locator('.empty-state-message');
    this.errorMessage = page.locator('.error-message');
    
    // Counts
    this.statusCount = page.locator('.status-count');
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await expect(this.dashboardContainer).toBeVisible();
    logger.info('Navigated to dashboard page');
  }

  async getStatusCount(statusName) {
    const card = this.page.locator(`.status-card[data-status="${statusName}"]`);
    await expect(card).toBeVisible();
    const countElement = card.locator('.status-count');
    const count = await countElement.textContent();
    return parseInt(count.trim());
  }

  async drillDownByCoordinator(coordinatorName) {
    await expect(this.coordinatorFilter).toBeVisible();
    await this.coordinatorFilter.selectOption({ label: coordinatorName });
    await this.page.waitForTimeout(1000);
    logger.info(`Drilled down by coordinator: ${coordinatorName}`);
  }

  async drillDownByPayer(payerName) {
    await expect(this.payerFilter).toBeVisible();
    await this.payerFilter.selectOption({ label: payerName });
    await this.page.waitForTimeout(1000);
    logger.info(`Drilled down by payer: ${payerName}`);
  }

  async clearFilters() {
    await expect(this.clearFiltersButton).toBeVisible();
    await this.clearFiltersButton.click();
    await this.page.waitForTimeout(1000);
    logger.info('Filters cleared');
  }

  async getFilteredApplicationCount() {
    const countElement = this.page.locator('.filtered-application-count');
    await expect(countElement).toBeVisible();
    const count = await countElement.textContent();
    return parseInt(count.trim());
  }

  async clickStatusCategory(statusName) {
    const card = this.page.locator(`.status-card[data-status="${statusName}"]`);
    await expect(card).toBeVisible();
    await card.click();
    logger.info(`Clicked on status category: ${statusName}`);
  }

  async getDetailViewApplications() {
    await expect(this.applicationListItem.first()).toBeVisible();
    const count = await this.applicationListItem.count();
    const applications = [];
    for (let i = 0; i < count; i++) {
      const item = this.applicationListItem.nth(i);
      const id = await item.getAttribute('data-application-id');
      applications.push(id);
    }
    return applications;
  }

  async selectApplication(applicationId) {
    const appItem = this.page.locator(`.application-list-item[data-application-id="${applicationId}"]`);
    await expect(appItem).toBeVisible();
    await appItem.click();
    logger.info(`Selected application: ${applicationId}`);
  }

  async getAllStatusCategories() {
    const count = await this.statusCard.count();
    const categories = [];
    for (let i = 0; i < count; i++) {
      const card = this.statusCard.nth(i);
      const status = await card.getAttribute('data-status');
      categories.push(status);
    }
    return categories;
  }
};