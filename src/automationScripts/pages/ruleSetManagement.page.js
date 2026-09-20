const { expect } = require('@playwright/test');

exports.RuleSetManagementPage = class RuleSetManagementPage {
  constructor(page) {
    this.page = page;
    this.ruleSetsMenuLink = page.locator('a[href*="/rule-sets"], nav a:has-text("Rule Sets")');
    this.createNewRuleSetButton = page.locator('button:has-text("Create New Rule Set"), [data-testid="create-rule-set"]');
    this.payerIdInput = page.locator('input[name="payerId"], #payerId, [data-testid="payer-id"]');
    this.payerNameInput = page.locator('input[name="payerName"], #payerName, [data-testid="payer-name"]');
    this.effectiveDateInput = page.locator('input[name="effectiveDate"], #effectiveDate, [data-testid="effective-date"]');
    this.versionInput = page.locator('input[name="version"], #version, [data-testid="version"]');
    this.saveButton = page.locator('button[type="submit"], button:has-text("Save"), [data-testid="save-button"]');
    this.successMessage = page.locator('.success-message, .alert-success, [data-testid="success-message"]');
    this.authorizationError = page.locator('.authorization-error, .error-message:has-text("permission")');
    this.editButton = page.locator('button:has-text("Edit"), [data-testid="edit-button"]');
  }

  async navigateToRuleSets() {
    await expect(this.ruleSetsMenuLink).toBeVisible();
    await this.ruleSetsMenuLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickCreateNewRuleSet() {
    await expect(this.createNewRuleSetButton).toBeVisible();
    await this.createNewRuleSetButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async enterPayerId(payerId) {
    await expect(this.payerIdInput).toBeVisible();
    await this.payerIdInput.fill(payerId);
  }

  async enterPayerName(payerName) {
    await expect(this.payerNameInput).toBeVisible();
    await this.payerNameInput.fill(payerName);
  }

  async addRequiredDocument(documentType, isMandatory, expirationRequired) {
    const addDocButton = this.page.locator('button:has-text("Add Document"), [data-testid="add-document"]');
    await addDocButton.click();
    
    const docTypeInput = this.page.locator('input[name="documentType"]:visible').last();
    await docTypeInput.fill(documentType);
    
    if (isMandatory) {
      const mandatoryCheckbox = this.page.locator('input[name="isMandatory"]:visible').last();
      await mandatoryCheckbox.check();
    }
    
    if (expirationRequired) {
      const expirationCheckbox = this.page.locator('input[name="expirationRequired"]:visible').last();
      await expirationCheckbox.check();
    }
  }

  async addRequiredDataField(fieldName, fieldType, isMandatory, validationRule) {
    const addFieldButton = this.page.locator('button:has-text("Add Field"), [data-testid="add-field"]');
    await addFieldButton.click();
    
    const fieldNameInput = this.page.locator('input[name="fieldName"]:visible').last();
    await fieldNameInput.fill(fieldName);
    
    const fieldTypeSelect = this.page.locator('select[name="fieldType"]:visible').last();
    await fieldTypeSelect.selectOption(fieldType);
    
    if (isMandatory) {
      const mandatoryCheckbox = this.page.locator('input[name="fieldMandatory"]:visible').last();
      await mandatoryCheckbox.check();
    }
    
    if (validationRule) {
      const validationInput = this.page.locator('input[name="validationRule"]:visible').last();
      await validationInput.fill(validationRule);
    }
  }

  async setEffectiveDate(date) {
    await expect(this.effectiveDateInput).toBeVisible();
    await this.effectiveDateInput.fill(date);
  }

  async setVersion(version) {
    await expect(this.versionInput).toBeVisible();
    await this.versionInput.fill(version);
  }

  async clickSaveButton() {
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRuleSetExists(payerId, payerName, version) {
    const ruleSetCard = this.page.locator(`.rule-set-card:has-text("${payerId}"):has-text("${version}"), [data-testid="rule-set-${payerId}-${version}"]`);
    await expect(ruleSetCard).toBeVisible();
    await expect(ruleSetCard).toContainText(payerName);
  }

  async verifyRuleSetNotExists(payerId) {
    const ruleSetCard = this.page.locator(`.rule-set-card:has-text("${payerId}")`);
    await expect(ruleSetCard).not.toBeVisible();
  }

  async verifyRuleSetStatus(payerId, expectedStatus) {
    const ruleSetCard = this.page.locator(`.rule-set-card:has-text("${payerId}")`);
    await expect(ruleSetCard).toBeVisible();
    const statusBadge = ruleSetCard.locator('.status-badge, [data-testid="status"]');
    await expect(statusBadge).toContainText(expectedStatus);
  }

  async selectRuleSet(payerId, version) {
    const ruleSetCard = this.page.locator(`.rule-set-card:has-text("${payerId}"):has-text("${version}")`);
    await expect(ruleSetCard).toBeVisible();
    await ruleSetCard.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickEditButton() {
    await expect(this.editButton).toBeVisible();
    await this.editButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRuleSetEffectiveDate(payerId, version, expectedDate) {
    const ruleSetCard = this.page.locator(`.rule-set-card:has-text("${payerId}"):has-text("${version}")`);
    await expect(ruleSetCard).toBeVisible();
    await expect(ruleSetCard).toContainText(expectedDate);
  }

  async verifyRuleSetEndDate(payerId, version, expectedEndDate) {
    const ruleSetCard = this.page.locator(`.rule-set-card:has-text("${payerId}"):has-text("${version}")`);
    await expect(ruleSetCard).toBeVisible();
    await expect(ruleSetCard).toContainText(expectedEndDate);
  }
};
