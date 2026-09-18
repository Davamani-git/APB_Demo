const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const fs = require('fs');
const path = require('path');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.navigationMenu = page.locator('nav, .nav, .navigation');
    this.dashboardLink = page.locator('a:has-text("Dashboard"), .nav-link:has-text("Dashboard")');
    this.adminLink = page.locator('a:has-text("Admin"), .nav-link:has-text("Admin")');
    this.totalApplicationsCard = page.locator('.stat-card:has-text("Total"), .dashboard-stat:has-text("Total Applications")');
    this.readyToSubmitCard = page.locator('.stat-card:has-text("Ready"), .dashboard-stat:has-text("Ready to Submit")');
    this.incompleteCard = page.locator('.stat-card:has-text("Incomplete"), .dashboard-stat:has-text("Incomplete")');
    this.expiringSoonCard = page.locator('.stat-card:has-text("Expiring"), .dashboard-stat:has-text("Expiring Soon")');
    this.statusFilter = page.locator('select[name="status"], #statusFilter, select:has-text("Status")');
    this.payerFilter = page.locator('select[name="payer"], #payerFilter, select:has-text("Payer")');
    this.coordinatorFilter = page.locator('select[name="coordinator"], #coordinatorFilter');
    this.applicationTable = page.locator('table, .application-table, .dashboard-table');
    this.applicationRows = page.locator('table tbody tr, .application-row');
    this.exportCSVButton = page.locator('button:has-text("Export CSV"), button:has-text("CSV")');
    this.exportPDFButton = page.locator('button:has-text("Export PDF"), button:has-text("PDF")');
    this.exportNotification = page.locator('.notification, .toast, .alert');
    this.refreshButton = page.locator('button:has-text("Refresh")');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    logger.info('Dashboard loaded successfully');
  }

  async navigateToDashboard() {
    logger.info('Navigating to dashboard');
    await this.dashboardLink.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.totalApplicationsCard).toBeVisible({ timeout: 10000 });
    logger.info('Dashboard navigation successful');
  }

  async navigateToAdminSettings() {
    logger.info('Navigating to admin settings');
    await this.adminLink.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Admin settings page loaded');
  }

  getNavigationMenu() {
    logger.info('Getting navigation menu');
    return this.navigationMenu;
  }

  async getTotalApplicationsCount() {
    logger.info('Getting total applications count');
    const countText = await this.totalApplicationsCard.locator('h3, .count, .stat-value').textContent();
    const count = parseInt(countText.trim());
    logger.info(`Total applications count: ${count}`);
    return count;
  }

  async getReadyToSubmitCount() {
    logger.info('Getting Ready to Submit count');
    const countText = await this.readyToSubmitCard.locator('h3, .count, .stat-value').textContent();
    const count = parseInt(countText.trim());
    logger.info(`Ready to Submit count: ${count}`);
    return count;
  }

  async getIncompleteCount() {
    logger.info('Getting Incomplete count');
    const countText = await this.incompleteCard.locator('h3, .count, .stat-value').textContent();
    const count = parseInt(countText.trim());
    logger.info(`Incomplete count: ${count}`);
    return count;
  }

  async getExpiringSoonCount() {
    logger.info('Getting Expiring Soon count');
    const countText = await this.expiringSoonCard.locator('h3, .count, .stat-value').textContent();
    const count = parseInt(countText.trim());
    logger.info(`Expiring Soon count: ${count}`);
    return count;
  }

  async applyStatusFilter(status) {
    logger.info(`Applying status filter: ${status}`);
    await this.statusFilter.selectOption(status);
    await this.page.waitForTimeout(1000);
    logger.info('Status filter applied');
  }

  async applyPayerFilter(payer) {
    logger.info(`Applying payer filter: ${payer}`);
    await this.payerFilter.selectOption(payer);
    await this.page.waitForTimeout(1000);
    logger.info('Payer filter applied');
  }

  async waitForFilterResults() {
    logger.info('Waiting for filter results');
    await this.page.waitForTimeout(2000);
    await expect(this.applicationTable).toBeVisible();
    logger.info('Filter results loaded');
  }

  async getFilteredApplications() {
    logger.info('Getting filtered applications');
    const rows = await this.applicationRows.all();
    const applications = [];
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      applications.push({
        providerName: cells[0],
        applicationType: cells[1],
        targetPayers: cells[2],
        status: cells[3],
        startDate: cells[4],
        coordinator: cells[5]
      });
    }
    logger.info(`Retrieved ${applications.length} filtered applications`);
    return applications;
  }

  async exportToCSV() {
    logger.info('Exporting to CSV');
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportCSVButton.click();
    const download = await downloadPromise;
    const filePath = path.join('downloads', download.suggestedFilename());
    await download.saveAs(filePath);
    logger.info(`CSV exported to: ${filePath}`);
    return filePath;
  }

  async exportToPDF() {
    logger.info('Exporting to PDF');
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportPDFButton.click();
    const download = await downloadPromise;
    const filePath = path.join('downloads', download.suggestedFilename());
    await download.saveAs(filePath);
    logger.info(`PDF exported to: ${filePath}`);
    return filePath;
  }

  async readCSVFile(filePath) {
    logger.info(`Reading CSV file: ${filePath}`);
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
          row[header.trim().toLowerCase().replace(/ /g, '')] = values[index]?.trim();
        });
        data.push(row);
      }
    }
    logger.info(`CSV file read successfully with ${data.length} rows`);
    return data;
  }

  getExportNotification() {
    logger.info('Getting export notification');
    return this.exportNotification;
  }

  async selectAllApplications() {
    logger.info('Selecting all applications');
    await this.statusFilter.selectOption('');
    await this.payerFilter.selectOption('');
    await this.page.waitForTimeout(1000);
    logger.info('All applications selected');
  }
};