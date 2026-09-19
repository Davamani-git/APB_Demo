const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ReadinessEnginePage = class ReadinessEnginePage {
  constructor(page) {
    this.page = page;
    this.readinessEngineTab = page.locator('.nav-tab[data-view="readiness-engine"]');
    this.addRuleSetButton = page.locator('#add-ruleset-btn');
    this.evaluateAllButton = page.locator('#evaluate-all-btn');
    this.ruleSetFormModal = page.locator('#ruleset-form-modal');
    this.ruleSetTable = page.locator('#rulesets-table table');
    this.payerNameInput = page.locator('#payerName');
    this.payerIdInput = page.locator('#payerId');
    this.versionInput = page.locator('#version');
    this.effectiveDateInput = page.locator('#effectiveDate');
    this.expiringThresholdInput = page.locator('#expiringThreshold');
    this.requiredDocumentsTextarea = page.locator('#requiredDocuments');
    this.requiredFieldsTextarea = page.locator('#requiredFields');
    this.ruleDescriptionTextarea = page.locator('#ruleDescription');
    this.saveRuleSetButton = page.locator('#ruleset-form button[type="submit"]');
    this.cancelRuleSetButton = page.locator('#cancel-ruleset-btn');
  }

  async navigateToReadinessEngine() {
    logger.info('Navigating to Readiness Engine tab');
    await this.readinessEngineTab.click();
    await expect(this.page.locator('h2:has-text("Readiness Engine Configuration")')).toBeVisible();
    await expect(this.addRuleSetButton).toBeVisible();
    logger.info('Readiness Engine page loaded successfully');
  }

  async clickAddRuleSet() {
    logger.info('Clicking Add Rule Set button');
    await this.addRuleSetButton.click();
    await expect(this.ruleSetFormModal).toHaveClass(/active/);
    logger.info('Rule Set form modal opened');
  }

  async fillRuleSetForm(payerName, payerId, version, effectiveDate, expiringThreshold, requiredDocuments, requiredFields, ruleDescription) {
    logger.info(`Filling rule set form for payer: ${payerName}`);
    await this.payerNameInput.fill(payerName);
    await this.payerIdInput.fill(payerId);
    await this.versionInput.fill(version);
    await this.effectiveDateInput.fill(effectiveDate);
    await this.expiringThresholdInput.fill(expiringThreshold.toString());
    await this.requiredDocumentsTextarea.fill(requiredDocuments.join(', '));
    await this.requiredFieldsTextarea.fill(requiredFields.join(', '));
    await this.ruleDescriptionTextarea.fill(ruleDescription);
    logger.info('Rule set form filled successfully');
  }

  async saveRuleSet() {
    logger.info('Saving rule set');
    await this.saveRuleSetButton.click();
    await expect(this.ruleSetFormModal).not.toHaveClass(/active/, { timeout: 5000 });
    logger.info('Rule set saved successfully');
  }

  async clickEvaluateAllApplications() {
    logger.info('Clicking Evaluate All Applications button');
    await this.evaluateAllButton.click();
    logger.info('Waiting for evaluation to complete');
  }

  async viewRuleSet(payerId) {
    logger.info(`Viewing rule set for payer: ${payerId}`);
    const viewButton = this.ruleSetTable.locator(`tr:has-text("${payerId}") button:has-text("View")`);
    await viewButton.click();
    logger.info('Rule set view/edit dialog opened');
  }
};
