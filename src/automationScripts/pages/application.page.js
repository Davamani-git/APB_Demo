const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ApplicationPage = class ApplicationPage {
  constructor(page) {
    this.page = page;
    this.createApplicationButton = page.locator('button:has-text("Create New Application"), button:has-text("New Application")');
    this.providerNameInput = page.locator('input[name="providerName"], #providerName');
    this.npiInput = page.locator('input[name="npi"], #npi');
    this.applicationTypeSelect = page.locator('select[name="applicationType"], #applicationType');
    this.payerSelect = page.locator('select[name="targetPayers"], #targetPayers');
    this.saveApplicationButton = page.locator('button:has-text("Save"), button[type="submit"]');
    this.uploadDocumentButton = page.locator('button:has-text("Upload"), button:has-text("Upload Document")');
    this.documentNameInput = page.locator('input[name="documentName"], #documentName');
    this.documentTypeSelect = page.locator('select[name="documentType"], #documentType');
    this.expirationDateInput = page.locator('input[name="expirationDate"], #expirationDate, input[type="date"]');
    this.fileInput = page.locator('input[type="file"]');
    this.confirmUploadButton = page.locator('button:has-text("Confirm"), button:has-text("Upload")');
    this.applicationList = page.locator('.application-list, table.applications');
    this.applicationDetailView = page.locator('.application-detail, .detail-view');
    this.payerStatusBadge = page.locator('.payer-status, .status-badge');
    this.overallStatusBadge = page.locator('.overall-status, .application-status');
    this.requirementStatus = page.locator('.requirement-status, .req-status');
    this.missingRequirements = page.locator('.missing-requirement, .requirement.missing');
    this.errorMessage = page.locator('.error-message, .alert-error, .error');
    this.successMessage = page.locator('.success-message, .alert-success');
    this.dataFieldInput = page.locator('input[data-field], .data-field-input');
    this.expirationThresholdInput = page.locator('input[name="expirationThreshold"], #expirationThreshold');
    this.saveThresholdButton = page.locator('button:has-text("Save Threshold"), button:has-text("Update Threshold")');
    this.applicationRows = page.locator('table tbody tr, .application-row');
    this.applicationHeaders = page.locator('table thead th, .application-header');
    this.payerSections = page.locator('.payer-section, .payer-card');
    this.requirementItems = page.locator('.requirement-item, .requirement-row');
    this.documentList = page.locator('.document-list, .uploaded-documents');
    this.documentItems = page.locator('.document-item, .document-row');
  }

  async navigateToApplicationList() {
    logger.info('Navigating to application list');
    await this.page.goto('/applications');
    await expect(this.applicationList).toBeVisible({ timeout: 10000 });
    logger.info('Application list loaded successfully');
  }

  async createNewApplication(providerName, npi, applicationType, targetPayers) {
    logger.info(`Creating new application for provider: ${providerName}`);
    await this.createApplicationButton.click();
    await this.providerNameInput.fill(providerName);
    await this.npiInput.fill(npi);
    await this.applicationTypeSelect.selectOption(applicationType);
    for (const payer of targetPayers) {
      await this.payerSelect.selectOption(payer);
    }
    await this.saveApplicationButton.click();
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
    logger.info(`Application created successfully for ${providerName}`);
  }

  async uploadDocument(documentType, fileName, expirationDate) {
    logger.info(`Uploading document: ${documentType} with expiration: ${expirationDate}`);
    await this.uploadDocumentButton.first().click();
    await this.documentTypeSelect.selectOption(documentType);
    await this.documentNameInput.fill(fileName);
    if (expirationDate) {
      await this.expirationDateInput.fill(expirationDate);
    }
    await this.fileInput.setInputFiles(`test-data/${fileName}`);
    await this.confirmUploadButton.click();
    await this.page.waitForTimeout(1000);
    logger.info(`Document ${documentType} uploaded successfully`);
  }

  async uploadDocumentForPayer(payerName, documentType, fileName, expirationDate) {
    logger.info(`Uploading document for payer ${payerName}: ${documentType}`);
    const payerSection = this.page.locator(`.payer-section:has-text("${payerName}")`);
    await expect(payerSection).toBeVisible();
    const uploadButton = payerSection.locator('button:has-text("Upload")');
    await uploadButton.click();
    await this.documentTypeSelect.selectOption(documentType);
    await this.documentNameInput.fill(fileName);
    if (expirationDate) {
      await this.expirationDateInput.fill(expirationDate);
    }
    await this.fileInput.setInputFiles(`test-data/${fileName}`);
    await this.confirmUploadButton.click();
    await this.page.waitForTimeout(1000);
    logger.info(`Document uploaded for payer ${payerName}`);
  }

  async populateDataField(fieldName, value) {
    logger.info(`Populating data field: ${fieldName} with value: ${value}`);
    const field = this.page.locator(`input[data-field="${fieldName}"], input[name="${fieldName}"]`);
    await field.fill(value);
    await this.saveApplicationButton.click();
    logger.info(`Data field ${fieldName} populated successfully`);
  }

  async populateDataFieldForPayer(payerName, fieldName, value) {
    logger.info(`Populating data field for payer ${payerName}: ${fieldName}`);
    const payerSection = this.page.locator(`.payer-section:has-text("${payerName}")`);
    const field = payerSection.locator(`input[data-field="${fieldName}"], input[name="${fieldName}"]`);
    await field.fill(value);
    await this.saveApplicationButton.click();
    logger.info(`Data field ${fieldName} populated for payer ${payerName}`);
  }

  async navigateToApplicationDetail() {
    logger.info('Navigating to application detail view');
    await expect(this.applicationDetailView).toBeVisible({ timeout: 5000 });
    logger.info('Application detail view loaded');
  }

  getPayerStatus(payerName) {
    logger.info(`Getting payer status for: ${payerName}`);
    return this.page.locator(`.payer-section:has-text("${payerName}") .payer-status, .payer-section:has-text("${payerName}") .status-badge`);
  }

  getOverallApplicationStatus() {
    logger.info('Getting overall application status');
    return this.overallStatusBadge.first();
  }

  async getMissingRequirements(payerName) {
    logger.info(`Getting missing requirements for payer: ${payerName}`);
    const payerSection = this.page.locator(`.payer-section:has-text("${payerName}")`);
    const missing = await payerSection.locator('.requirement.missing, .requirement-status:has-text("Missing")').allTextContents();
    return missing;
  }

  async getExpiringDocuments(payerName) {
    logger.info(`Getting expiring documents for payer: ${payerName}`);
    const payerSection = this.page.locator(`.payer-section:has-text("${payerName}")`);
    const expiring = await payerSection.locator('.requirement-status:has-text("Expiring Soon")').allTextContents();
    return expiring;
  }

  async setExpirationThreshold(days) {
    logger.info(`Setting expiration threshold to ${days} days`);
    await this.expirationThresholdInput.fill(days.toString());
    await this.saveThresholdButton.click();
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
    logger.info('Expiration threshold updated successfully');
  }

  calculateDateFromToday(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  }

  async openApplication(applicationId) {
    logger.info(`Opening application: ${applicationId}`);
    await this.page.goto(`/application/${applicationId}`);
    await expect(this.applicationDetailView).toBeVisible({ timeout: 10000 });
    logger.info(`Application ${applicationId} opened successfully`);
  }

  getRequirementStatus(requirementName) {
    logger.info(`Getting requirement status for: ${requirementName}`);
    return this.page.locator(`.requirement-item:has-text("${requirementName}") .requirement-status, .requirement-row:has-text("${requirementName}") .status-badge`);
  }

  async waitForStatusRecalculation() {
    logger.info('Waiting for status recalculation');
    await this.page.waitForTimeout(2000);
    await expect(this.overallStatusBadge.first()).toBeVisible();
    logger.info('Status recalculation completed');
  }

  getErrorMessage() {
    logger.info('Getting error message');
    return this.errorMessage.first();
  }

  async deleteDocument(documentType) {
    logger.info(`Deleting document: ${documentType}`);
    const deleteButton = this.page.locator(`.document-item:has-text("${documentType}") button:has-text("Delete"), .document-row:has-text("${documentType}") .delete-button`);
    await deleteButton.click();
    await this.page.locator('button:has-text("Confirm"), button:has-text("Yes")').click();
    await this.page.waitForTimeout(1000);
    logger.info(`Document ${documentType} deleted successfully`);
  }

  async getApplicationListHeaders() {
    logger.info('Getting application list headers');
    const headers = await this.applicationHeaders.allTextContents();
    return headers;
  }

  async getAllApplications() {
    logger.info('Getting all applications from list');
    const rows = await this.applicationRows.all();
    const applications = [];
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      applications.push({
        providerName: cells[0],
        npi: cells[1],
        applicationType: cells[2],
        targetPayers: cells[3],
        overallStatus: cells[4],
        startDate: cells[5],
        coordinator: cells[6]
      });
    }
    logger.info(`Retrieved ${applications.length} applications`);
    return applications;
  }

  getApplicationDetailHeader() {
    logger.info('Getting application detail header');
    return this.page.locator('h1, h2, .application-header');
  }

  async getPayerSections() {
    logger.info('Getting payer sections');
    const sections = await this.payerSections.all();
    const payerData = [];
    for (const section of sections) {
      const payerName = await section.locator('.payer-name, h3, h4').textContent();
      const status = await section.locator('.payer-status, .status-badge').textContent();
      payerData.push({ payerName: payerName.trim(), status: status.trim() });
    }
    logger.info(`Retrieved ${payerData.length} payer sections`);
    return payerData;
  }

  async getRequirementsForPayer(payerName) {
    logger.info(`Getting requirements for payer: ${payerName}`);
    const payerSection = this.page.locator(`.payer-section:has-text("${payerName}")`);
    const requirements = await payerSection.locator('.requirement-item, .requirement-row').all();
    const reqData = [];
    for (const req of requirements) {
      const name = await req.locator('.requirement-name, strong').textContent();
      const status = await req.locator('.requirement-status, .status-badge').textContent();
      reqData.push({ name: name.trim(), status: status.trim() });
    }
    logger.info(`Retrieved ${reqData.length} requirements for ${payerName}`);
    return reqData;
  }

  async getUploadedDocuments() {
    logger.info('Getting uploaded documents');
    const documents = await this.documentItems.all();
    const docData = [];
    for (const doc of documents) {
      const cells = await doc.locator('td').allTextContents();
      docData.push({
        name: cells[0],
        type: cells[1],
        uploadDate: cells[2],
        uploadedBy: cells[3],
        expirationDate: cells[4]
      });
    }
    logger.info(`Retrieved ${docData.length} uploaded documents`);
    return docData;
  }

  async navigateToCreateApplication() {
    logger.info('Navigating to create application page');
    await this.createApplicationButton.click();
    await this.page.waitForTimeout(1000);
    logger.info('Create application page loaded');
  }

  async getAvailablePayers() {
    logger.info('Getting available payers');
    const options = await this.payerSelect.locator('option').allTextContents();
    logger.info(`Retrieved ${options.length} available payers`);
    return options;
  }
};