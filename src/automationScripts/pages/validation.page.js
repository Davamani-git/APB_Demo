const { expect } = require('@playwright/test');

exports.ValidationPage = class ValidationPage {
  constructor(page) {
    this.page = page;
    this.transformedData = page.locator('#transformedData');
    this.validationBtn = page.locator('button', { hasText: 'Validate' });
    this.validationStatus = page.locator('.validation-status');
    this.mandatoryFieldsStatus = page.locator('.mandatory-fields-status');
    this.validationReport = page.locator('#validationReport');
  }
  async assertTransformedDataAvailable() {
    await expect(this.transformedData).toBeVisible();
  }
  async executeValidationRulesEngine() {
    await expect(this.validationBtn).toBeEnabled();
    await this.validationBtn.click();
    await expect(this.validationStatus).toContainText('Completed');
  }
  async assertValidationProcessCompleted() {
    await expect(this.validationStatus).toContainText('Completed');
  }
  async assertMandatoryFieldsValidity() {
    await expect(this.mandatoryFieldsStatus).toContainText('Validated');
  }
  async reviewValidationReport() {
    await expect(this.validationReport).toBeVisible();
    await expect(this.validationReport).toContainText('issues found');
  }
};