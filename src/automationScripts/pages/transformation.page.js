const { expect } = require('@playwright/test');

exports.TransformationPage = class TransformationPage {
  constructor(page) {
    this.page = page;
    this.stagingArea = page.locator('#stagingArea');
    this.transformBtn = page.locator('button', { hasText: 'Transform' });
    this.transformationStatus = page.locator('.transformation-status');
    this.mappingTable = page.locator('#mappingTable');
    this.mandatoryFields = page.locator('.mandatory-fields');
    this.unitConversionLog = page.locator('.conversion-log');
    this.internalCodeInput = page.locator('#internalCode');
    this.casField = page.locator('.cas-number');
    this.ghsField = page.locator('.ghs-classification');
    this.svhcField = page.locator('.svhc-status');
  }
  async assertDataInStagingArea() {
    await expect(this.stagingArea).toBeVisible();
  }
  async startTransformationProcess() {
    await expect(this.transformBtn).toBeEnabled();
    await this.transformBtn.click();
    await expect(this.transformationStatus).toContainText('Started');
  }
  async assertTransformationStarted() {
    await expect(this.transformationStatus).toContainText('Started');
  }
  async verifyFieldMapping(fields) {
    if(fields.cas) await expect(this.mappingTable).toContainText('CAS');
    if(fields.name) await expect(this.mappingTable).toContainText('Substance Name');
    if(fields.concentration) await expect(this.mappingTable).toContainText('Concentration');
    if(fields.classification) await expect(this.mappingTable).toContainText('Classification');
  }
  async assertMandatoryFieldsValidated() {
    await expect(this.mandatoryFields).toContainText('Validated');
  }
  async provideSourceData(data) {
    // Simulate providing source data
    await expect(this.stagingArea).toBeVisible();
  }
  async assertSourceDataAccepted() {
    await expect(this.stagingArea).toContainText('Source data accepted');
  }
  async assertTransformationCompleted() {
    await expect(this.transformationStatus).toContainText('Completed');
  }
  async verifyUnitConversionAndLogging() {
    await expect(this.unitConversionLog).toContainText('Converted');
    await expect(this.unitConversionLog).toContainText('Logged');
  }
  async provideSourceDataWithInternalCodes(code) {
    await expect(this.internalCodeInput).toBeVisible();
    await this.internalCodeInput.fill(code);
  }
  async assertProcessCompleted() {
    await expect(this.transformationStatus).toContainText('Completed');
  }
  async verifyMappingToRegulatoryFields() {
    await expect(this.casField).toBeVisible();
    await expect(this.ghsField).toBeVisible();
    await expect(this.svhcField).toBeVisible();
  }
};