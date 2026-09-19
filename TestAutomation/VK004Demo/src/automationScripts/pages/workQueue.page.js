const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.WorkQueuePage = class WorkQueuePage {
  constructor(page) {
    this.page = page;
    this.workQueueTab = page.locator('.nav-tab[data-view="work-queue"]');
    this.workQueueHeading = page.locator('h2:has-text("Coordinator Work Queue")');
    this.applicationTable = page.locator('#applications-table table');
    this.applicationDetailsSection = page.locator('#application-details');
    this.closeDetailsButton = page.locator('button:has-text("Close")');
  }

  async navigateToWorkQueue() {
    logger.info('Navigating to Work Queue tab');
    await this.workQueueTab.click();
    await expect(this.workQueueHeading).toBeVisible();
    await expect(this.applicationTable).toBeVisible();
    logger.info('Work Queue page loaded successfully');
  }

  async findApplicationById(applicationId) {
    logger.info(`Finding application by ID: ${applicationId}`);
    const row = this.applicationTable.locator(`tr:has-text("${applicationId}")`);
    await expect(row).toBeVisible();
    return row;
  }

  async clickViewDetails(applicationId) {
    logger.info(`Clicking View Details for application: ${applicationId}`);
    const row = await this.findApplicationById(applicationId);
    const viewDetailsButton = row.locator('button:has-text("View Details")');
    await viewDetailsButton.click();
    await expect(this.applicationDetailsSection).toBeVisible();
    logger.info('Application details section displayed');
  }

  async findPayerCard(payerId) {
    logger.info(`Finding payer card for: ${payerId}`);
    const payerCard = this.applicationDetailsSection.locator(`.card:has-text("${payerId}")`);
    await expect(payerCard).toBeVisible();
    return payerCard;
  }

  async getAllPayerCards() {
    logger.info('Getting all payer cards');
    const cards = await this.applicationDetailsSection.locator('.card h4').all();
    logger.info(`Found ${cards.length} payer cards`);
    return cards.map((_, index) => this.applicationDetailsSection.locator('.card').nth(index));
  }

  async closeApplicationDetails() {
    logger.info('Closing application details');
    await this.closeDetailsButton.click();
    await expect(this.applicationDetailsSection).not.toBeVisible();
    logger.info('Application details closed');
  }
};
