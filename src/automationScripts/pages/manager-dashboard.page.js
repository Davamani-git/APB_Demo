const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ManagerDashboardPage = class ManagerDashboardPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('h1:has-text("Dashboard")');
    this.readyToSubmitCard = page.locator('.metric-card.ready-to-submit');
    this.incompleteCard = page.locator('.metric-card.incomplete');
    this.expiringSoonCard = page.locator('.metric-card.expiring-soon');
    this.coordinatorFilter = page.locator('select#coordinatorFilter');
    this.payerFilter = page.locator('select#payerFilter');
    this.dateRangeFilter = page.locator('select#dateRangeFilter');
    this.reportsLink = page.locator('a[href="/reports"]');
    this.reportingInterface = page.locator('.reporting-interface');
    this.statusFilterReport = page.locator('select#statusFilterReport');
    this.dateRangeFilterReport = page.locator('select#dateRangeFilterReport');
    this.previewCountLabel = page.locator('.preview-count');
    this.exportCSVButton = page.locator('button:has-text("Export CSV")');
    this.errorMessage = page.locator('.alert-danger');
    this.segmentNotification = page.locator('.alert-info:has-text("segmented")');
  }

  async navigate() {
    await this.page.goto(`${process.env.BASE_URL}/dashboard`);
    await expect(this.pageTitle).toBeVisible({ timeout: 10000 });
    logger.info('Navigated to Manager Dashboard');
  }

  async waitForMetricsToLoad() {
    await expect(this.readyToSubmitCard).toBeVisible({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    logger.info('Dashboard metrics loaded');
  }

  async getReadyToSubmitCount() {
    await expect(this.readyToSubmitCard).toBeVisible();
    const countElement = this.readyToSubmitCard.locator('.count');
    const text = await countElement.textContent();
    return parseInt(text);
  }

  async getIncompleteCount() {
    await expect(this.incompleteCard).toBeVisible();
    const countElement = this.incompleteCard.locator('.count');
    const text = await countElement.textContent();
    return parseInt(text);
  }

  async getExpiringSoonCount() {
    await expect(this.expiringSoonCard).toBeVisible();
    const countElement = this.expiringSoonCard.locator('.count');
    const text = await countElement.textContent();
    return parseInt(text);
  }

  async selectCoordinatorFilter(coordinator) {
    await expect(this.coordinatorFilter).toBeVisible();
    await this.coordinatorFilter.selectOption(coordinator);
    await this.page.waitForLoadState('networkidle');
    logger.info(`Coordinator filter set to: ${coordinator}`);
  }

  async selectPayerFilter(payer) {
    await expect(this.payerFilter).toBeVisible();
    await this.payerFilter.selectOption(payer);
    await this.page.waitForLoadState('networkidle');
    logger.info(`Payer filter set to: ${payer}`);
  }

  async selectDateRangeFilter(dateRange) {
    await expect(this.dateRangeFilter).toBeVisible();
    await this.dateRangeFilter.selectOption(dateRange);
    await this.page.waitForLoadState('networkidle');
    logger.info(`Date range filter set to: ${dateRange}`);
  }

  async navigateToReports() {
    await expect(this.reportsLink).toBeVisible();
    await this.reportsLink.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Reports section');
  }

  async selectStatusFilter(status) {
    await expect(this.statusFilterReport).toBeVisible();
    await this.statusFilterReport.selectOption(status);
    logger.info(`Report status filter set to: ${status}`);
  }

  async selectDateRangeFilterReport(dateRange) {
    await expect(this.dateRangeFilterReport).toBeVisible();
    await this.dateRangeFilterReport.selectOption(dateRange);
    logger.info(`Report date range filter set to: ${dateRange}`);
  }

  async getPreviewCount() {
    await expect(this.previewCountLabel).toBeVisible();
    const text = await this.previewCountLabel.textContent();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async clickExportCSV() {
    await expect(this.exportCSVButton).toBeVisible();
    await this.exportCSVButton.click();
    logger.info('Export CSV button clicked');
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async isSegmentNotificationVisible() {
    return await this.segmentNotification.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getSegmentNotification() {
    await expect(this.segmentNotification).toBeVisible();
    return await this.segmentNotification.textContent();
  }

  async checkEmailNotification(userId) {
    const response = await this.page.request.get(`${process.env.BASE_URL}/api/notifications/check?userId=${userId}`);
    if (response.ok()) {
      return await response.json();
    }
    return null;
  }
};
