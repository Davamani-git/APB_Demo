const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.AdminPage = class AdminPage {
  constructor(page) {
    this.page = page;
    this.ruleSetManagementLink = page.locator('a:has-text("Rule Set"), a:has-text("Payer Rules"), .admin-nav:has-text("Rule Set")');
    this.createRuleSetButton = page.locator('button:has-text("Create New Rule Set"), button:has-text("New Rule Set"), button:has-text("Add Rule Set")');
    this.payerIDInput = page.locator('input[name="payerId"], #payerId');
    this.payerNameInput = page.locator('input[name="payerName"], #payerName');
    this.effectiveDateInput = page.locator('input[name="effectiveDate"], #effectiveDate, input[type="date"]');
    this.addDocumentButton = page.locator('button:has-text("Add Document"), button:has-text("Add Requirement")');
    this.addDataFieldButton = page.locator('button:has-text("Add Data Field"), button:has-text("Add Field")');
    this.documentNameInput = page.locator('input[name="documentName"], input[placeholder*="document"]');
    this.dataFieldNameInput = page.locator('input[name="dataFieldName"], input[placeholder*="field"]');
    this.saveRuleSetButton = page.locator('button:has-text("Save"), button:has-text("Create"), button[type="submit"]');
    this.successMessage = page.locator('.success-message, .alert-success, .success');
    this.errorMessage = page.locator('.error-message, .alert-error, .error');
    this.ruleSetTable = page.locator('table, .rule-set-table');
    this.ruleSetRows = page.locator('table tbody tr, .rule-set-row');
    this.editRuleSetButton = page.locator('button:has-text("Edit")');
    this.deleteRuleSetButton = page.locator('button:has-text("Delete")');
  }

  async navigateToRuleSetManagement() {
    logger.info('Navigating to rule set management');
    await this.page.goto('/admin');
    await this.page.waitForLoadState('networkidle');
    await expect(this.ruleSetTable).toBeVisible({ timeout: 10000 });
    logger.info('Rule set management page loaded');
  }

  async clickCreateNewRuleSet() {
    logger.info('Clicking create new rule set button');
    await this.createRuleSetButton.click();
    await this.page.waitForTimeout(1000);
    logger.info('Create rule set form opened');
  }

  async enterPayerID(payerId) {
    logger.info(`Entering payer ID: ${payerId}`);
    await this.payerIDInput.fill(payerId);
    logger.info('Payer ID entered');
  }

  async enterPayerName(payerName) {
    logger.info(`Entering payer name: ${payerName}`);
    await this.payerNameInput.fill(payerName);
    logger.info('Payer name entered');
  }

  async enterEffectiveDate(date) {
    logger.info(`Entering effective date: ${date}`);
    await this.effectiveDateInput.fill(date);
    logger.info('Effective date entered');
  }

  async addRequiredDocument(documentType) {
    logger.info(`Adding required document: ${documentType}`);
    await this.addDocumentButton.click();
    await this.page.waitForTimeout(500);
    const lastDocInput = this.page.locator('input[name="documentName"], input[placeholder*="document"]').last();
    await lastDocInput.fill(documentType);
    logger.info(`Document ${documentType} added`);
  }

  async addRequiredDataField(fieldName) {
    logger.info(`Adding required data field: ${fieldName}`);
    await this.addDataFieldButton.click();
    await this.page.waitForTimeout(500);
    const lastFieldInput = this.page.locator('input[name="dataFieldName"], input[placeholder*="field"]').last();
    await lastFieldInput.fill(fieldName);
    logger.info(`Data field ${fieldName} added`);
  }

  async saveRuleSet() {
    logger.info('Saving rule set');
    await this.saveRuleSetButton.click();
    await this.page.waitForTimeout(2000);
    logger.info('Rule set save initiated');
  }

  getSuccessMessage() {
    logger.info('Getting success message');
    return this.successMessage;
  }

  getErrorMessage() {
    logger.info('Getting error message');
    return this.errorMessage;
  }

  async getRuleSetList() {
    logger.info('Getting rule set list');
    const rows = await this.ruleSetRows.all();
    const ruleSets = [];
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      ruleSets.push({
        payerName: cells[0]?.trim(),
        payerId: cells[1]?.trim(),
        version: cells[2]?.trim(),
        effectiveDate: cells[3]?.trim(),
        lastReviewDate: cells[4]?.trim(),
        requirementCount: cells[5]?.trim()
      });
    }
    logger.info(`Retrieved ${ruleSets.length} rule sets`);
    return ruleSets;
  }

  async editRuleSet(payerName) {
    logger.info(`Editing rule set for payer: ${payerName}`);
    const row = this.page.locator(`tr:has-text("${payerName}")`);
    await row.locator('button:has-text("Edit")').click();
    await this.page.waitForTimeout(1000);
    logger.info(`Edit form opened for ${payerName}`);
  }

  async deleteRuleSet(payerName) {
    logger.info(`Deleting rule set for payer: ${payerName}`);
    const row = this.page.locator(`tr:has-text("${payerName}")`);
    await row.locator('button:has-text("Delete")').click();
    await this.page.locator('button:has-text("Confirm"), button:has-text("Yes")').click();
    await this.page.waitForTimeout(1000);
    logger.info(`Rule set deleted for ${payerName}`);
  }
};