const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ApplicationListPage = class ApplicationListPage {
  constructor(page) {
    this.page = page;
    this.applicationListTable = page.locator('table.application-list');
    this.createApplicationButton = page.locator('button:has-text("Create Application")');
    this.searchInput = page.locator('input[placeholder*="Search"]');
    this.statusFilter = page.locator('select#status-filter');
    this.payerFilter = page.locator('select#payer-filter');
    this.applicationRows = page.locator('table.application-list tbody tr');
  }

  async navigate() {
    await this.page.goto('/applications');
    await expect(this.applicationListTable).toBeVisible();
    logger.info('Navigated to application list page');
  }

  async clickCreateApplication() {
    await expect(this.createApplicationButton).toBeVisible();
    await this.createApplicationButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Clicked Create Application button');
  }

  async searchApplication(applicationId) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(applicationId);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
    logger.info(`Searched for application: ${applicationId}`);
  }

  async clickApplicationRow(applicationId) {
    const row = this.page.locator(`tr[data-application-id="${applicationId}"]`);
    await expect(row).toBeVisible();
    await row.click();
    await this.page.waitForLoadState('networkidle');
    logger.info(`Clicked application row: ${applicationId}`);
  }

  async getApplicationCount() {
    await expect(this.applicationRows.first()).toBeVisible();
    return await this.applicationRows.count();
  }

  async selectStatusFilter(status) {
    await expect(this.statusFilter).toBeVisible();
    await this.statusFilter.selectOption(status);
    await this.page.waitForTimeout(500);
    logger.info(`Selected status filter: ${status}`);
  }

  async selectPayerFilter(payer) {
    await expect(this.payerFilter).toBeVisible();
    await this.payerFilter.selectOption(payer);
    await this.page.waitForTimeout(500);
    logger.info(`Selected payer filter: ${payer}`);
  }

  async getColumnHeader(columnName) {
    return this.page.locator(`th:has-text("${columnName}")`);
  }

  async clickColumnHeader(columnName) {
    const header = await this.getColumnHeader(columnName);
    await expect(header).toBeVisible();
    await header.click();
    await this.page.waitForTimeout(500);
    logger.info(`Clicked column header: ${columnName}`);
  }

  async getAllApplicationStatuses() {
    const statusCells = this.page.locator('td.status-cell');
    const count = await statusCells.count();
    const statuses = [];
    for (let i = 0; i < count; i++) {
      const status = await statusCells.nth(i).textContent();
      statuses.push(status.trim());
    }
    return statuses;
  }

  async getAllStartDates() {
    const dateCells = this.page.locator('td.start-date-cell');
    const count = await dateCells.count();
    const dates = [];
    for (let i = 0; i < count; i++) {
      const date = await dateCells.nth(i).textContent();
      dates.push(date.trim());
    }
    return dates;
  }

  async getApplicationIds() {
    const idCells = this.page.locator('td.application-id-cell');
    const count = await idCells.count();
    const ids = [];
    for (let i = 0; i < count; i++) {
      const id = await idCells.nth(i).textContent();
      ids.push(id.trim());
    }
    return ids;
  }
};