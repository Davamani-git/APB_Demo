const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.PayerRuleAdminPage = class PayerRuleAdminPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('h1:has-text("Payer Rule Set Administration")');
    this.addNewRuleSetButton = page.locator('button:has-text("Add New Rule Set")');
    this.ruleSetForm = page.locator('.rule-set-form');
    this.payerNameInput = page.locator('input#payerName');
    this.effectiveDateInput = page.locator('input#effectiveDate');
    this.requiredDocumentsInput = page.locator('input#requiredDocuments');
    this.requiredFieldsInput = page.locator('input#requiredFields');
    this.saveButton = page.locator('button:has-text("Save")');
    this.editButton = page.locator('button:has-text("Edit")');
    this.deactivateButton = page.locator('button:has-text("Deactivate")');
    this.successMessage = page.locator('.alert-success');
    this.ruleSetList = page.locator('.rule-set-list');
    this.ruleSetDetails = page.locator('.rule-set-details');
    this.confirmationDialog = page.locator('.confirmation-dialog');
    this.confirmButton = page.locator('button:has-text("Confirm")');
  }

  async navigate() {
    await this.page.goto(`${process.env.BASE_URL}/admin/payer-rules`);
    await expect(this.pageTitle).toBeVisible({ timeout: 10000 });
    logger.info('Navigated to Payer Rule Admin page');
  }

  async clickAddNewRuleSet() {
    await expect(this.addNewRuleSetButton).toBeVisible();
    await this.addNewRuleSetButton.click();
    logger.info('Add New Rule Set button clicked');
  }

  async fillPayerName(name) {
    await expect(this.payerNameInput).toBeVisible();
    await this.payerNameInput.fill(name);
    logger.info(`Payer name filled: ${name}`);
  }

  async fillEffectiveDate(date) {
    await expect(this.effectiveDateInput).toBeVisible();
    await this.effectiveDateInput.fill(date);
    logger.info(`Effective date filled: ${date}`);
  }

  async addRequiredDocument(documentType) {
    await expect(this.requiredDocumentsInput).toBeVisible();
    const currentValue = await this.requiredDocumentsInput.inputValue();
    const newValue = currentValue ? `${currentValue}, ${documentType}` : documentType;
    await this.requiredDocumentsInput.fill(newValue);
    logger.info(`Added required document: ${documentType}`);
  }

  async addRequiredField(fieldName) {
    await expect(this.requiredFieldsInput).toBeVisible();
    const currentValue = await this.requiredFieldsInput.inputValue();
    const newValue = currentValue ? `${currentValue}, ${fieldName}` : fieldName;
    await this.requiredFieldsInput.fill(newValue);
    logger.info(`Added required field: ${fieldName}`);
  }

  async clickSave() {
    await expect(this.saveButton).toBeVisible();
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Save button clicked');
  }

  async getRuleSetVersion(payerName) {
    const ruleSetItem = this.page.locator(`.rule-set-item:has-text("${payerName}")`);
    await expect(ruleSetItem).toBeVisible();
    const versionBadge = ruleSetItem.locator('.version-badge');
    return await versionBadge.textContent();
  }

  async isRuleSetAvailableForSelection(payerName) {
    const ruleSetOption = this.page.locator(`select#targetPayers option:has-text("${payerName}")`);
    return await ruleSetOption.isVisible();
  }

  async selectRuleSet(payerName, version = null) {
    const selector = version ? `.rule-set-item:has-text("${payerName}"):has-text("${version}")` : `.rule-set-item:has-text("${payerName}")`;
    const ruleSetItem = this.page.locator(selector);
    await expect(ruleSetItem).toBeVisible();
    await ruleSetItem.click();
    logger.info(`Selected rule set: ${payerName}${version ? ' v' + version : ''}`);
  }

  async clickEdit() {
    await expect(this.editButton).toBeVisible();
    await this.editButton.click();
    logger.info('Edit button clicked');
  }

  async clickDeactivate() {
    await expect(this.deactivateButton).toBeVisible();
    await this.deactivateButton.click();
    logger.info('Deactivate button clicked');
  }

  async confirmDeactivation() {
    await expect(this.confirmationDialog).toBeVisible();
    await expect(this.confirmButton).toBeVisible();
    await this.confirmButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Deactivation confirmed');
  }

  async getDeactivationResult() {
    const resultMessage = this.page.locator('.result-message');
    if (await resultMessage.isVisible()) {
      return await resultMessage.textContent();
    }
    return 'No result message found';
  }

  async navigateToApplicationList() {
    await this.page.goto(`${process.env.BASE_URL}/applications`);
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to application list');
  }

  async filterByPayer(payer) {
    const payerFilter = this.page.locator('input#payerFilter');
    await payerFilter.fill(payer);
    const applyButton = this.page.locator('button:has-text("Apply Filters")');
    await applyButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByStatus(status) {
    const statusFilter = this.page.locator('select#statusFilter');
    await statusFilter.selectOption(status);
    const applyButton = this.page.locator('button:has-text("Apply Filters")');
    await applyButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getApplicationCount() {
    const applicationRows = this.page.locator('table tbody tr');
    return await applicationRows.count();
  }

  async createTestApplication(payerName) {
    await this.page.goto(`${process.env.BASE_URL}/applications/new`);
    const payerSelect = this.page.locator('select#targetPayers');
    await payerSelect.selectOption({ label: payerName });
    const saveButton = this.page.locator('button:has-text("Save")');
    await saveButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info(`Test application created for payer: ${payerName}`);
  }

  async getApplicationRequirements() {
    const requirementRows = this.page.locator('.requirement-row');
    const requirements = [];
    const count = await requirementRows.count();
    for (let i = 0; i < count; i++) {
      const reqName = await requirementRows.nth(i).locator('.requirement-name').textContent();
      requirements.push(reqName.trim());
    }
    return requirements;
  }
};
