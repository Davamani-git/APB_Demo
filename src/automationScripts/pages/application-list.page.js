const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ApplicationListPage = class ApplicationListPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('h1:has-text("Applications")');
    this.createApplicationButton = page.locator('button:has-text("Create Application")');
    this.statusFilter = page.locator('select#statusFilter');
    this.payerFilter = page.locator('input#payerFilter');
    this.coordinatorFilter = page.locator('input#coordinatorFilter');
    this.applyFiltersButton = page.locator('button:has-text("Apply Filters")');
    this.applicationRows = page.locator('table tbody tr');
    this.columnHeaders = page.locator('table thead th');
    this.settingsLink = page.locator('a[href="/settings"]');
    this.expirationThresholdInput = page.locator('input#expirationThreshold');
    this.accessDeniedMessage = page.locator('.alert-danger:has-text("Access Denied")');
  }

  async waitForApplicationsToLoad() {
    await expect(this.pageTitle).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Application list page loaded');
  }

  async getApplicationCount() {
    await expect(this.applicationRows.first()).toBeVisible({ timeout: 5000 });
    return await this.applicationRows.count();
  }

  async clickCreateApplication() {
    await expect(this.createApplicationButton).toBeVisible();
    await this.createApplicationButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Create application button clicked');
  }

  async selectStatusFilter(status) {
    await expect(this.statusFilter).toBeVisible();
    await this.statusFilter.selectOption(status);
    logger.info(`Status filter set to: ${status}`);
  }

  async selectPayerFilter(payer) {
    await expect(this.payerFilter).toBeVisible();
    await this.payerFilter.fill(payer);
    logger.info(`Payer filter set to: ${payer}`);
  }

  async clickApplyFilters() {
    await expect(this.applyFiltersButton).toBeVisible();
    await this.applyFiltersButton.click();
    logger.info('Apply filters button clicked');
  }

  async waitForFilteredResults() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
    logger.info('Filtered results loaded');
  }

  async getFilteredApplications() {
    const applications = [];
    const rows = await this.applicationRows.all();
    for (const row of rows) {
      const cells = await row.locator('td').all();
      const app = {
        providerName: await cells[0].textContent(),
        status: await cells[3].textContent(),
        payers: await cells[2].textContent()
      };
      applications.push(app);
    }
    return applications;
  }

  async selectFirstApplication() {
    await expect(this.applicationRows.first()).toBeVisible();
    await this.applicationRows.first().click();
    await this.page.waitForLoadState('networkidle');
    logger.info('First application selected');
    return await this.page.url();
  }

  async getOverallStatus(applicationUrl) {
    const statusBadge = this.page.locator('.overall-status');
    await expect(statusBadge).toBeVisible();
    return await statusBadge.textContent();
  }

  async getPayerStatuses(applicationUrl) {
    const payerStatusElements = this.page.locator('.payer-status');
    const statuses = {};
    const count = await payerStatusElements.count();
    for (let i = 0; i < count; i++) {
      const element = payerStatusElements.nth(i);
      const payer = await element.locator('.payer-name').textContent();
      const status = await element.locator('.status-badge').textContent();
      statuses[payer] = status;
    }
    return statuses;
  }

  async clickColumnHeader(columnName) {
    const header = this.page.locator(`table thead th:has-text("${columnName}")`);
    await expect(header).toBeVisible();
    await header.click();
    logger.info(`Clicked column header: ${columnName}`);
  }

  async waitForSortCompletion() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
    logger.info('Sort operation completed');
  }

  async getApplications(startIndex = 0, endIndex = null) {
    const applications = [];
    const rows = await this.applicationRows.all();
    const end = endIndex || rows.length;
    for (let i = startIndex; i < end && i < rows.length; i++) {
      const cells = await rows[i].locator('td').all();
      const app = {
        providerName: await cells[0].textContent(),
        daysUntilStart: parseInt(await cells[5].textContent())
      };
      applications.push(app);
    }
    return applications;
  }

  async getTotalPages() {
    const paginationInfo = this.page.locator('.pagination-info');
    if (await paginationInfo.isVisible()) {
      const text = await paginationInfo.textContent();
      const match = text.match(/Page (\d+) of (\d+)/);
      return match ? parseInt(match[2]) : 1;
    }
    return 1;
  }

  async verifyNoDuplicateRecords() {
    const applications = await this.getApplications();
    const providerNames = applications.map(app => app.providerName);
    const uniqueNames = new Set(providerNames);
    return uniqueNames.size === providerNames.length;
  }

  async navigateToSettings() {
    await expect(this.settingsLink).toBeVisible();
    await this.settingsLink.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to settings page');
  }

  async getExpirationThreshold() {
    await expect(this.expirationThresholdInput).toBeVisible();
    return await this.expirationThresholdInput.inputValue();
  }

  async getAccessDeniedMessage() {
    await expect(this.accessDeniedMessage).toBeVisible();
    return await this.accessDeniedMessage.textContent();
  }

  async filterByPayer(payer) {
    await this.selectPayerFilter(payer);
    await this.clickApplyFilters();
    await this.waitForFilteredResults();
  }

  async filterByStatus(status) {
    await this.selectStatusFilter(status);
    await this.clickApplyFilters();
    await this.waitForFilteredResults();
  }

  async navigateToApplicationList() {
    await this.page.goto(`${process.env.BASE_URL}/applications`);
    await this.waitForApplicationsToLoad();
  }

  async viewFirstApplication() {
    await this.applicationRows.first().locator('a.view-button').click();
    await this.page.waitForLoadState('networkidle');
    return await this.page.url();
  }

  async getHistoricalReadinessStatus() {
    const statusHistory = this.page.locator('.status-history');
    if (await statusHistory.isVisible()) {
      return await statusHistory.textContent();
    }
    return null;
  }
};
