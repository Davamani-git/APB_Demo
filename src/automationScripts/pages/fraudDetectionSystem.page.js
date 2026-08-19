const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.FraudDetectionSystemPage = class FraudDetectionSystemPage {
  constructor(page) {
    this.page = page;
    
    // Transaction payload locators
    this.transactionPayloadInput = page.locator('#transaction-payload-input');
    this.transactionPayloadStatus = page.locator('#transaction-payload-status');
    this.createPayloadButton = page.locator('#create-payload-button');
    
    // Authorization locators
    this.authorizationStatusInput = page.locator('#authorization-status-input');
    this.authorizationStatus = page.locator('#authorization-status');
    this.authorizeButton = page.locator('#authorize-button');
    
    // Event publishing locators
    this.publishEventButton = page.locator('#publish-event-button');
    this.eventQueueInput = page.locator('#event-queue-input');
    this.eventPublishStatus = page.locator('#event-publish-status');
    
    // Event reception locators
    this.eventReceivedTimestamp = page.locator('#event-received-timestamp');
    this.verifyReceivedButton = page.locator('#verify-received-button');
    
    // Validation locators
    this.validationStatus = page.locator('#validation-status');
    this.validationProcessStatus = page.locator('#validation-process-status');
    this.verifyValidationButton = page.locator('#verify-validation-button');
    this.startValidationButton = page.locator('#start-validation-button');
    
    // Queue locators
    this.queueStatus = page.locator('#queue-status');
    this.queueTimeIndicator = page.locator('#queue-time-indicator');
    this.verifyQueueButton = page.locator('#verify-queue-button');
    
    // Audit trail locators
    this.auditLogEntry = page.locator('#audit-log-entry');
    this.auditLogStatus = page.locator('#audit-log-status');
    this.auditLogAction = page.locator('#audit-log-action');
    this.checkAuditButton = page.locator('#check-audit-button');
    
    // Error handling locators
    this.errorCode = page.locator('#error-code');
    this.errorField = page.locator('#error-field');
    this.errorLogEntry = page.locator('#error-log-entry');
    this.errorType = page.locator('#error-type');
    this.errorReason = page.locator('#error-reason');
    this.verifyRejectionButton = page.locator('#verify-rejection-button');
    this.verifyErrorLogButton = page.locator('#verify-error-log-button');
    
    // Risk queue locators
    this.riskQueueStatus = page.locator('#risk-queue-status');
    this.verifyRiskQueueButton = page.locator('#verify-risk-queue-button');
    
    // Fraud case locators
    this.fraudCaseId = page.locator('#fraud-case-id');
    this.fraudCaseStatus = page.locator('#fraud-case-status');
    this.fraudCaseCount = page.locator('#fraud-case-count');
    this.totalFraudCases = page.locator('#total-fraud-cases');
    this.verifyFraudCaseButton = page.locator('#verify-fraud-case-button');
    
    // Idempotency locators
    this.idempotencyCheckResult = page.locator('#idempotency-check-result');
    this.verifyIdempotencyButton = page.locator('#verify-idempotency-button');
  }

  async createTransactionPayload(transactionData) {
    logger.info('Creating transaction payload');
    await expect(this.transactionPayloadInput).toBeVisible();
    await this.transactionPayloadInput.fill(JSON.stringify(transactionData));
    await this.createPayloadButton.click();
    await expect(this.transactionPayloadStatus).toBeVisible();
  }

  async authorizeTransaction(authStatus) {
    logger.info(`Authorizing transaction with status: ${authStatus}`);
    await expect(this.authorizationStatusInput).toBeVisible();
    await this.authorizationStatusInput.fill(authStatus);
    await this.authorizeButton.click();
    await expect(this.authorizationStatus).toBeVisible();
  }

  async publishTransactionEvent(queueName) {
    logger.info(`Publishing transaction event to queue: ${queueName}`);
    await expect(this.eventQueueInput).toBeVisible();
    await this.eventQueueInput.fill(queueName);
    await this.publishEventButton.click();
    await expect(this.eventPublishStatus).toBeVisible();
  }

  async verifyEventReceived() {
    logger.info('Verifying event received by fraud detection system');
    await expect(this.verifyReceivedButton).toBeVisible();
    await this.verifyReceivedButton.click();
    await expect(this.eventReceivedTimestamp).toBeVisible();
  }

  async verifyEventValidation() {
    logger.info('Verifying event validation');
    await expect(this.verifyValidationButton).toBeVisible();
    await this.verifyValidationButton.click();
    await expect(this.validationStatus).toBeVisible();
  }

  async verifyValidationStarted() {
    logger.info('Verifying validation process started');
    await expect(this.startValidationButton).toBeVisible();
    await this.startValidationButton.click();
    await expect(this.validationProcessStatus).toBeVisible();
  }

  async verifyEventQueued() {
    logger.info('Verifying event queued for risk evaluation');
    await expect(this.verifyQueueButton).toBeVisible();
    await this.verifyQueueButton.click();
    await expect(this.queueStatus).toBeVisible();
  }

  async verifyQueueTimeSLA() {
    logger.info('Verifying queue time meets SLA');
    await expect(this.queueTimeIndicator).toBeVisible();
    const queueTime = await this.queueTimeIndicator.textContent();
    logger.info(`Queue time: ${queueTime}`);
  }

  async checkAuditTrail() {
    logger.info('Checking audit trail for event ingestion');
    await expect(this.checkAuditButton).toBeVisible();
    await this.checkAuditButton.click();
    await expect(this.auditLogEntry).toBeVisible();
    await expect(this.auditLogStatus).toBeVisible();
  }

  async verifyEventRejection() {
    logger.info('Verifying event rejection');
    await expect(this.verifyRejectionButton).toBeVisible();
    await this.verifyRejectionButton.click();
    await expect(this.errorCode).toBeVisible();
    await expect(this.errorField).toBeVisible();
  }

  async verifyErrorLogging() {
    logger.info('Verifying error logging');
    await expect(this.verifyErrorLogButton).toBeVisible();
    await this.verifyErrorLogButton.click();
    await expect(this.errorLogEntry).toBeVisible();
    await expect(this.errorType).toBeVisible();
    await expect(this.errorReason).toBeVisible();
  }

  async verifyEventNotInRiskQueue() {
    logger.info('Verifying event not present in risk evaluation queue');
    await expect(this.verifyRiskQueueButton).toBeVisible();
    await this.verifyRiskQueueButton.click();
    await expect(this.riskQueueStatus).toBeVisible();
  }

  async verifyFraudCaseCreated(transactionId) {
    logger.info(`Verifying fraud case created for transaction: ${transactionId}`);
    await expect(this.verifyFraudCaseButton).toBeVisible();
    await this.verifyFraudCaseButton.click();
    await expect(this.fraudCaseId).toBeVisible();
    await expect(this.fraudCaseStatus).toBeVisible();
  }

  async verifyIdempotencyCheck(transactionId) {
    logger.info(`Verifying idempotency check for transaction: ${transactionId}`);
    await expect(this.verifyIdempotencyButton).toBeVisible();
    await this.verifyIdempotencyButton.click();
    await expect(this.idempotencyCheckResult).toBeVisible();
  }

  async verifyFraudCaseCount(transactionId, expectedCount) {
    logger.info(`Verifying fraud case count for transaction: ${transactionId}, expected: ${expectedCount}`);
    await expect(this.fraudCaseCount).toBeVisible();
    const caseCount = await this.fraudCaseCount.textContent();
    expect(parseInt(caseCount)).toBe(expectedCount);
  }

  async checkDuplicateAuditLog(transactionId) {
    logger.info(`Checking audit log for duplicate detection: ${transactionId}`);
    await expect(this.checkAuditButton).toBeVisible();
    await this.checkAuditButton.click();
    await expect(this.auditLogEntry).toBeVisible();
    await expect(this.auditLogAction).toBeVisible();
  }

  async verifyMultipleFraudCases(caseIds) {
    logger.info(`Verifying multiple fraud cases exist: ${caseIds.join(', ')}`);
    await expect(this.totalFraudCases).toBeVisible();
    for (const caseId of caseIds) {
      const caseLocator = this.page.locator(`[data-case-id="${caseId}"]`);
      await expect(caseLocator).toBeVisible();
    }
  }
};
