const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ProviderEnrollmentPage = class ProviderEnrollmentPage {
  constructor(page) {
    this.page = page;
    
    // Navigation elements
    this.newEnrollmentButton = page.locator('button:has-text("New Enrollment")');
    this.applicationForm = page.locator('form#enrollment-application-form');
    
    // Provider data fields
    this.providerNameInput = page.locator('#provider-name');
    this.npiInput = page.locator('#npi');
    this.licenseInput = page.locator('#license-number');
    this.specialtyInput = page.locator('#specialty');
    this.emailInput = page.locator('#email');
    
    // Document upload
    this.documentUploadInput = page.locator('input[type="file"]');
    this.documentExpirationInput = page.locator('#document-expiration');
    this.documentUploadSuccess = page.locator('.upload-success-message');
    this.uploadedDocumentsList = page.locator('.uploaded-documents-list');
    
    // Payer selection
    this.payerCheckbox = page.locator('.payer-checkbox');
    this.payerSelectionConfirmation = page.locator('.payer-selection-confirmed');
    
    // Actions
    this.saveButton = page.locator('button:has-text("Save")');
    this.saveConfirmationMessage = page.locator('.save-confirmation');
    this.updateButton = page.locator('button:has-text("Update")');
    
    // Status and validation
    this.applicationStatus = page.locator('.application-status');
    this.validationErrorMessage = page.locator('.validation-error');
    this.payerReadinessStatus = page.locator('.payer-readiness-status');
    this.missingDocumentIndicator = page.locator('.missing-document');
    
    // Application details
    this.applicationDetailView = page.locator('.application-detail-view');
    this.viewDetailsButton = page.locator('button:has-text("View Details")');
    this.documentPayerAssociations = page.locator('.document-payer-association');
    this.requirementDetailsSection = page.locator('.requirement-details');
    this.documentStatusLabel = page.locator('.document-status');
    
    // Deficiency guidance
    this.deficiencyGuidanceButton = page.locator('button:has-text("Generate Deficiency Guidance")');
    this.deficiencyGuidanceSection = page.locator('.deficiency-guidance-section');
    this.deficiencyIndicator = page.locator('.deficiency-indicator');
    this.deficiencyItem = page.locator('.deficiency-item');
    this.deficiencyDeadline = page.locator('.deficiency-deadline');
    this.deficiencyUrgency = page.locator('.deficiency-urgency');
    this.deficiencyGuidanceText = page.locator('.deficiency-guidance-text');
    this.noDeficienciesMessage = page.locator('.no-deficiencies-message');
    this.payerDeficiencySection = page.locator('.payer-deficiency-section');
    
    // Evaluation
    this.evaluateButton = page.locator('button:has-text("Evaluate")');
    this.evaluationCompleteIndicator = page.locator('.evaluation-complete');
    this.requirementStatus = page.locator('.requirement-status');
    this.expirationWarning = page.locator('.expiration-warning');
    this.missingDocumentList = page.locator('.missing-documents');
    this.evaluationMetadata = page.locator('.evaluation-metadata');
    
    // Rule set management
    this.ruleSetManagementLink = page.locator('a:has-text("Rule Set Management")');
    this.ruleSetVersions = page.locator('.rule-set-version');
    this.submissionDateLabel = page.locator('.submission-date');
    this.evaluationRuleSetVersion = page.locator('.evaluation-rule-set-version');
    this.evaluationRequirements = page.locator('.evaluation-requirement');
    
    // Priority scoring
    this.calculatePriorityButton = page.locator('button:has-text("Calculate Priority")');
    this.priorityScoreLabel = page.locator('.priority-score');
    this.payerExpirationDays = page.locator('.payer-expiration-days');
    
    // System logs
    this.systemLogsLink = page.locator('a:has-text("System Logs")');
    this.logEntries = page.locator('.log-entry');
    
    // Error handling
    this.errorMessage = page.locator('.error-message');
  }

  async navigateToNewEnrollment() {
    await expect(this.newEnrollmentButton).toBeVisible();
    await this.newEnrollmentButton.click();
    await expect(this.applicationForm).toBeVisible();
    logger.info('Navigated to new enrollment form');
  }

  async fillProviderData(name, npi, license, specialty, email) {
    await expect(this.providerNameInput).toBeVisible();
    await this.providerNameInput.fill(name);
    await this.npiInput.fill(npi);
    await this.licenseInput.fill(license);
    await this.specialtyInput.fill(specialty);
    await this.emailInput.fill(email);
    logger.info('Provider data filled');
  }

  async fillProviderDataPartial(name, npi, license, specialty) {
    await expect(this.providerNameInput).toBeVisible();
    await this.providerNameInput.fill(name);
    if (npi) await this.npiInput.fill(npi);
    if (license) await this.licenseInput.fill(license);
    await this.specialtyInput.fill(specialty);
    logger.info('Partial provider data filled');
  }

  async uploadDocument(filename, expirationDate) {
    await expect(this.documentUploadInput).toBeVisible();
    const filePath = `./test-data/documents/${filename}`;
    await this.documentUploadInput.setInputFiles(filePath);
    await this.documentExpirationInput.fill(expirationDate);
    await this.page.locator('button:has-text("Upload")').click();
    logger.info(`Document ${filename} uploaded with expiration ${expirationDate}`);
  }

  async uploadDocumentForPayer(payer, filename, expirationYears) {
    await this.page.locator(`#payer-${payer.replace(/\s+/g, '-').toLowerCase()}`).click();
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + parseInt(expirationYears));
    const formattedDate = futureDate.toLocaleDateString('en-US');
    await this.uploadDocument(filename, formattedDate);
    logger.info(`Document uploaded for payer ${payer}`);
  }

  async selectPayers(payers) {
    for (const payer of payers) {
      const checkbox = this.page.locator(`input[type="checkbox"][value="${payer}"]`);
      await expect(checkbox).toBeVisible();
      await checkbox.check();
    }
    logger.info(`Selected payers: ${payers.join(', ')}`);
  }

  async saveApplication() {
    await expect(this.saveButton).toBeVisible();
    await this.saveButton.click();
    logger.info('Save button clicked');
  }

  async getPayerReadinessStatus() {
    await expect(this.payerReadinessStatus).toBeVisible();
    const status = await this.payerReadinessStatus.textContent();
    return status;
  }

  async viewApplicationDetails() {
    await expect(this.viewDetailsButton).toBeVisible();
    await this.viewDetailsButton.click();
    await expect(this.applicationDetailView).toBeVisible();
    logger.info('Application details viewed');
  }

  async getDocumentPayerAssociations() {
    await expect(this.documentPayerAssociations.first()).toBeVisible();
    const associations = await this.documentPayerAssociations.allTextContents();
    return associations;
  }

  async navigateToApplication(applicationId) {
    await this.page.goto(`/applications/${applicationId}`);
    await expect(this.applicationDetailView).toBeVisible();
    logger.info(`Navigated to application ${applicationId}`);
  }

  async getPayerStatus(payerName) {
    const statusLocator = this.page.locator(`.payer-status[data-payer="${payerName}"]`);
    await expect(statusLocator).toBeVisible();
    const status = await statusLocator.textContent();
    return status.trim();
  }

  async viewRequirementDetails(payerName = null) {
    if (payerName) {
      const detailsButton = this.page.locator(`button:has-text("View ${payerName} Requirements")`);
      await detailsButton.click();
    } else {
      await this.page.locator('button:has-text("View Requirements")').click();
    }
    await expect(this.requirementDetailsSection).toBeVisible();
    logger.info('Requirement details viewed');
  }

  async getDocumentStatus(documentName) {
    const statusLocator = this.page.locator(`.document-status[data-document="${documentName}"]`);
    await expect(statusLocator).toBeVisible();
    const status = await statusLocator.textContent();
    return status.trim();
  }

  async getApplicationStatus() {
    await expect(this.applicationStatus).toBeVisible();
    const status = await this.applicationStatus.textContent();
    return status.trim();
  }

  async getDocumentStatusWithExpiration(documentName) {
    const statusLocator = this.page.locator(`.document-row[data-document="${documentName}"]`);
    await expect(statusLocator).toBeVisible();
    const status = await statusLocator.locator('.status').textContent();
    const expiration = await statusLocator.locator('.expiration-date').textContent();
    return { status: status.trim(), expirationDate: expiration.trim() };
  }

  async getValidationErrors() {
    await expect(this.validationErrorMessage).toBeVisible();
    const errors = await this.page.locator('.validation-error-item').allTextContents();
    return errors;
  }

  async getProviderNameValue() {
    const value = await this.providerNameInput.inputValue();
    return value;
  }

  async getSpecialtyValue() {
    const value = await this.specialtyInput.inputValue();
    return value;
  }

  async generateDeficiencyGuidance() {
    await expect(this.deficiencyGuidanceButton).toBeVisible();
    await this.deficiencyGuidanceButton.click();
    logger.info('Deficiency guidance generation triggered');
  }

  async getDeficiencyList() {
    const count = await this.deficiencyItem.count();
    if (count === 0) return [];
    const deficiencies = await this.deficiencyItem.allTextContents();
    return deficiencies;
  }

  async getDeficiencyDeadlines() {
    const count = await this.deficiencyDeadline.count();
    if (count === 0) return [];
    const deadlines = await this.deficiencyDeadline.allTextContents();
    return deadlines;
  }

  async getDeficiencyUrgencyLevels() {
    const count = await this.deficiencyUrgency.count();
    if (count === 0) return [];
    const urgencies = await this.deficiencyUrgency.allTextContents();
    return urgencies;
  }

  async getDeficiencyGuidanceText() {
    await expect(this.deficiencyGuidanceText).toBeVisible();
    const text = await this.deficiencyGuidanceText.textContent();
    return text;
  }

  async getApplicationPayers() {
    const payerElements = await this.page.locator('.application-payer').allTextContents();
    return payerElements.map(p => p.trim());
  }

  async getPayerDeficiencies(payerName) {
    const section = this.page.locator(`.payer-deficiency-section[data-payer="${payerName}"]`);
    await expect(section).toBeVisible();
    const deficiencies = await section.locator('.deficiency-item').allTextContents();
    return deficiencies.map(d => d.trim());
  }

  async getPayerDeficiencyStatus(payerName, documentName) {
    const section = this.page.locator(`.payer-deficiency-section[data-payer="${payerName}"]`);
    const docStatus = await section.locator(`.deficiency-item[data-document="${documentName}"] .status`).textContent();
    return docStatus.trim();
  }

  async getDeficiencyPayerSections() {
    const count = await this.payerDeficiencySection.count();
    const sections = [];
    for (let i = 0; i < count; i++) {
      const section = await this.payerDeficiencySection.nth(i).getAttribute('data-payer');
      sections.push(section);
    }
    return sections;
  }

  async getUploadedDocuments() {
    await expect(this.uploadedDocumentsList).toBeVisible();
    const docs = await this.page.locator('.uploaded-document-name').allTextContents();
    return docs.map(d => d.trim());
  }

  async getProviderData() {
    const name = await this.providerNameInput.inputValue();
    const npi = await this.npiInput.inputValue();
    const license = await this.licenseInput.inputValue();
    const specialty = await this.specialtyInput.inputValue();
    return { name, npi, license, specialty };
  }

  async triggerEvaluation(payerName) {
    const evalButton = this.page.locator(`button:has-text("Evaluate ${payerName}")`).or(this.evaluateButton);
    await expect(evalButton).toBeVisible();
    await evalButton.click();
    logger.info(`Evaluation triggered for ${payerName}`);
  }

  async getAllRequirementStatuses() {
    await expect(this.requirementStatus.first()).toBeVisible();
    const statuses = await this.requirementStatus.allTextContents();
    return statuses.map(s => s.trim());
  }

  async getExpirationWarnings() {
    const count = await this.expirationWarning.count();
    if (count === 0) return [];
    const warnings = await this.expirationWarning.allTextContents();
    return warnings;
  }

  async getMissingDocuments(payerName) {
    const section = this.page.locator(`.missing-documents[data-payer="${payerName}"]`);
    await expect(section).toBeVisible();
    const docs = await section.locator('.missing-document-item').allTextContents();
    return docs.map(d => d.trim());
  }

  async navigateToRuleSetManagement() {
    await expect(this.ruleSetManagementLink).toBeVisible();
    await this.ruleSetManagementLink.click();
    await this.page.waitForURL(/.*rule-sets.*/);
    logger.info('Navigated to rule set management');
  }

  async getRuleSetVersions(payerName) {
    const payerSection = this.page.locator(`.rule-set-payer[data-payer="${payerName}"]`);
    await expect(payerSection).toBeVisible();
    const versionElements = await payerSection.locator('.rule-set-version').all();
    const versions = [];
    for (const elem of versionElements) {
      const version = await elem.getAttribute('data-version');
      const effectiveUntil = await elem.locator('.effective-until').textContent();
      const effectiveFrom = await elem.locator('.effective-from').textContent();
      versions.push({
        version,
        effectiveUntil: effectiveUntil ? effectiveUntil.trim() : null,
        effectiveFrom: effectiveFrom ? effectiveFrom.trim() : null
      });
    }
    return versions;
  }

  async getSubmissionDate() {
    await expect(this.submissionDateLabel).toBeVisible();
    const date = await this.submissionDateLabel.textContent();
    return date.trim();
  }

  async getEvaluationRuleSetVersion() {
    await expect(this.evaluationRuleSetVersion).toBeVisible();
    const version = await this.evaluationRuleSetVersion.textContent();
    return version.trim();
  }

  async getEvaluationRequirements() {
    await expect(this.evaluationRequirements.first()).toBeVisible();
    const reqs = await this.evaluationRequirements.allTextContents();
    return reqs.map(r => r.trim());
  }

  async getEvaluationMetadata() {
    await expect(this.evaluationMetadata).toBeVisible();
    const metadata = await this.evaluationMetadata.textContent();
    return metadata.trim();
  }

  async getApplicationPayer() {
    const payer = await this.page.locator('.application-payer').first().textContent();
    return payer.trim();
  }

  async getDocumentExpirationDays(documentName) {
    const docRow = this.page.locator(`.document-row[data-document="${documentName}"]`);
    await expect(docRow).toBeVisible();
    const days = await docRow.locator('.expiration-days').textContent();
    return parseInt(days.trim());
  }

  async calculatePriorityScore() {
    await expect(this.calculatePriorityButton).toBeVisible();
    await this.calculatePriorityButton.click();
    await this.page.waitForTimeout(1000); // Allow calculation to complete
    logger.info('Priority score calculated');
  }

  async getPriorityScore() {
    await expect(this.priorityScoreLabel).toBeVisible();
    const score = await this.priorityScoreLabel.textContent();
    return parseInt(score.trim());
  }

  async getPayerExpirationDays(payerName) {
    const payerRow = this.page.locator(`.payer-row[data-payer="${payerName}"]`);
    await expect(payerRow).toBeVisible();
    const days = await payerRow.locator('.expiration-days').textContent();
    return parseInt(days.trim());
  }

  async navigateToSystemLogs() {
    await expect(this.systemLogsLink).toBeVisible();
    await this.systemLogsLink.click();
    await this.page.waitForURL(/.*logs.*/);
    logger.info('Navigated to system logs');
  }

  async getRecentLogs() {
    await expect(this.logEntries.first()).toBeVisible();
    const logs = await this.logEntries.allTextContents();
    return logs.map(l => l.trim());
  }

  async getPayerRequirements(payerName) {
    const payerSection = this.page.locator(`.payer-requirements[data-payer="${payerName}"]`);
    await expect(payerSection).toBeVisible();
    const reqElements = await payerSection.locator('.requirement-row').all();
    const requirements = [];
    for (const elem of reqElements) {
      const document = await elem.locator('.document-name').textContent();
      const expirationDate = await elem.locator('.expiration-date').textContent();
      requirements.push({
        document: document.trim(),
        expirationDate: expirationDate.trim()
      });
    }
    return requirements;
  }

  async getExpiringDocuments() {
    const count = await this.page.locator('.expiring-document').count();
    if (count === 0) return [];
    const docs = await this.page.locator('.expiring-document').allTextContents();
    return docs.map(d => d.trim());
  }
};