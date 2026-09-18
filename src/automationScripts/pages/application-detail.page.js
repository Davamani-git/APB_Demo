const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ApplicationDetailPage = class ApplicationDetailPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('h1.application-title');
    this.providerNameInput = page.locator('input#providerName');
    this.npiInput = page.locator('input#npi');
    this.applicationTypeSelect = page.locator('select#applicationType');
    this.targetPayersSelect = page.locator('select#targetPayers');
    this.applicationIdLabel = page.locator('.application-id');
    this.evaluateButton = page.locator('button:has-text("Evaluate Readiness")');
    this.applicationStatusBadge = page.locator('.application-status-badge');
    this.payerStatusCards = page.locator('.payer-status-card');
    this.requirementRows = page.locator('.requirement-row');
  }

  async fillProviderDetails(name, npi, applicationType) {
    await expect(this.providerNameInput).toBeVisible();
    await this.providerNameInput.fill(name);
    await this.npiInput.fill(npi);
    await this.applicationTypeSelect.selectOption(applicationType);
    logger.info(`Provider details filled: ${name}, NPI: ${npi}, Type: ${applicationType}`);
  }

  async selectTargetPayers(payers) {
    await expect(this.targetPayersSelect).toBeVisible();
    for (const payer of payers) {
      await this.targetPayersSelect.selectOption({ label: payer });
    }
    logger.info(`Target payers selected: ${payers.join(', ')}`);
  }

  async getApplicationId() {
    await expect(this.applicationIdLabel).toBeVisible();
    const text = await this.applicationIdLabel.textContent();
    const match = text.match(/APP-\d+/);
    return match ? match[0] : null;
  }

  async triggerReadinessEvaluation() {
    await expect(this.evaluateButton).toBeVisible();
    await this.evaluateButton.click();
    logger.info('Readiness evaluation triggered');
  }

  async getApplicationStatus() {
    await expect(this.applicationStatusBadge).toBeVisible();
    return await this.applicationStatusBadge.textContent();
  }

  async getPayerStatuses() {
    const statuses = {};
    const cards = await this.payerStatusCards.all();
    for (const card of cards) {
      const payerName = await card.locator('.payer-name').textContent();
      const status = await card.locator('.status-badge').textContent();
      statuses[payerName] = status.trim();
    }
    return statuses;
  }

  async getPayerStatus(payerName) {
    const card = this.page.locator(`.payer-status-card:has-text("${payerName}")`);
    await expect(card).toBeVisible();
    const statusBadge = card.locator('.status-badge');
    return await statusBadge.textContent();
  }

  async getAllRequirementStatuses() {
    const statuses = [];
    const rows = await this.requirementRows.all();
    for (const row of rows) {
      const status = await row.locator('.requirement-status').textContent();
      statuses.push(status.trim());
    }
    return statuses;
  }

  async getMissingDocuments(payerName) {
    const payerSection = this.page.locator(`.payer-requirements:has-text("${payerName}")`);
    await expect(payerSection).toBeVisible();
    const missingRows = payerSection.locator('.requirement-row:has-text("Missing")');
    const missingDocs = [];
    const count = await missingRows.count();
    for (let i = 0; i < count; i++) {
      const docName = await missingRows.nth(i).locator('.requirement-name').textContent();
      missingDocs.push(docName.trim());
    }
    return missingDocs;
  }

  async getRequirementStatus(requirementName) {
    const row = this.page.locator(`.requirement-row:has-text("${requirementName}")`);
    await expect(row).toBeVisible();
    const status = await row.locator('.requirement-status').textContent();
    const expirationElement = row.locator('.expiration-date');
    let expirationDate = null;
    if (await expirationElement.isVisible()) {
      expirationDate = await expirationElement.textContent();
    }
    return {
      status: status.trim(),
      expirationDate: expirationDate ? expirationDate.trim() : null
    };
  }

  async navigateToApplication(applicationId) {
    await this.page.goto(`${process.env.BASE_URL}/applications/${applicationId}`);
    await expect(this.pageTitle).toBeVisible({ timeout: 10000 });
    logger.info(`Navigated to application: ${applicationId}`);
  }
};
