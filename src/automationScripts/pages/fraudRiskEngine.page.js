const { expect } = require('@playwright/test');

exports.FraudRiskEnginePage = class FraudRiskEnginePage {
  constructor(page) {
    this.page = page;
    
    // Transaction event preparation locators
    this.transactionIdInput = page.locator('#transaction-id-input');
    this.cardIdInput = page.locator('#card-id-input');
    this.amountInput = page.locator('#amount-input');
    this.currencyInput = page.locator('#currency-input');
    this.merchantInput = page.locator('#merchant-input');
    this.timestampInput = page.locator('#timestamp-input');
    this.prepareEventButton = page.locator('#prepare-event-button');
    this.transactionEventStatus = page.locator('#transaction-event-status');
    
    // Transaction submission locators
    this.sendEventButton = page.locator('#send-event-button');
    this.eventReceivedStatus = page.locator('#event-received-status');
    
    // Risk evaluation locators
    this.transactionAmountSignal = page.locator('#signal-transaction-amount');
    this.merchantCategorySignal = page.locator('#signal-merchant-category');
    this.locationSignal = page.locator('#signal-location');
    this.velocitySignal = page.locator('#signal-velocity');
    this.triggerEvaluationButton = page.locator('#trigger-evaluation-button');
    this.riskEngineProcessingStatus = page.locator('#risk-engine-processing-status');
    this.evaluatedSignals = page.locator('#evaluated-signals');
    
    // Risk score and classification locators
    this.riskScoreValue = page.locator('#risk-score-value');
    this.riskBandClassification = page.locator('#risk-band-classification');
    this.verifyRiskButton = page.locator('#verify-risk-button');
    
    // Audit trail locators
    this.auditTrailRecord = page.locator('#audit-trail-record');
    this.auditTransactionId = page.locator('#audit-transaction-id');
    this.auditRiskScore = page.locator('#audit-risk-score');
    this.auditRiskBand = page.locator('#audit-risk-band');
    this.auditModelVersion = page.locator('#audit-model-version');
    this.auditTimestamp = page.locator('#audit-timestamp');
    this.viewAuditButton = page.locator('#view-audit-button');
    
    // Malformed transaction handling locators
    this.missingFieldIndicator = page.locator('#missing-field-indicator');
    this.rejectionStatus = page.locator('#rejection-status');
    this.rejectionReason = page.locator('#rejection-reason');
    this.errorLogMessage = page.locator('#error-log-message');
    this.viewErrorLogButton = page.locator('#view-error-log-button');
    this.auditRecordCount = page.locator('#audit-record-count');
    
    // Engine unavailability locators
    this.engineStatus = page.locator('#engine-status');
    this.simulateUnavailabilityButton = page.locator('#simulate-unavailability-button');
    this.engineDetectionStatus = page.locator('#engine-detection-status');
    this.failSafeAction = page.locator('#fail-safe-action');
    this.failSafePolicyResult = page.locator('#fail-safe-policy-result');
  }
  
  async navigate() {
    await this.page.goto('/fraud-risk-engine');
    await expect(this.page).toHaveURL(/.*fraud-risk-engine/);
  }
  
  async prepareTransactionEvent(transactionData) {
    await expect(this.transactionIdInput).toBeVisible();
    if (transactionData.transaction_id) {
      await this.transactionIdInput.fill(transactionData.transaction_id);
    }
    if (transactionData.card_id) {
      await this.cardIdInput.fill(transactionData.card_id);
    }
    await this.amountInput.fill(transactionData.amount.toString());
    await this.currencyInput.fill(transactionData.currency);
    await this.merchantInput.fill(transactionData.merchant);
    await this.timestampInput.fill(transactionData.timestamp);
    await this.prepareEventButton.click();
    await expect(this.transactionEventStatus).toBeVisible();
  }
  
  async prepareMalformedTransactionEvent(malformedData) {
    await expect(this.transactionIdInput).toBeVisible();
    if (malformedData.transaction_id) {
      await this.transactionIdInput.fill(malformedData.transaction_id);
    }
    if (malformedData.card_id) {
      await this.cardIdInput.fill(malformedData.card_id);
    }
    await this.amountInput.fill(malformedData.amount.toString());
    await this.currencyInput.fill(malformedData.currency);
    await this.merchantInput.fill(malformedData.merchant);
    await this.timestampInput.fill(malformedData.timestamp);
    await this.prepareEventButton.click();
    await expect(this.transactionEventStatus).toBeVisible();
  }
  
  async sendTransactionEvent(transactionData) {
    await expect(this.sendEventButton).toBeEnabled();
    await this.sendEventButton.click();
    await expect(this.eventReceivedStatus).toBeVisible();
  }
  
  async triggerFraudRiskEvaluation(riskSignals) {
    await expect(this.transactionAmountSignal).toBeVisible();
    await this.transactionAmountSignal.fill(riskSignals.transaction_amount.toString());
    await this.merchantCategorySignal.fill(riskSignals.merchant_category);
    await this.locationSignal.fill(riskSignals.location);
    await this.velocitySignal.fill(riskSignals.velocity);
    await this.triggerEvaluationButton.click();
    await expect(this.riskEngineProcessingStatus).toBeVisible();
  }
  
  async verifyRiskScoreAndBand(expectedScore, expectedBand) {
    await expect(this.verifyRiskButton).toBeVisible();
    await this.verifyRiskButton.click();
    await expect(this.riskScoreValue).toBeVisible();
    await expect(this.riskBandClassification).toBeVisible();
  }
  
  async verifyAuditTrail(auditData) {
    await expect(this.viewAuditButton).toBeVisible();
    await this.viewAuditButton.click();
    await expect(this.auditTrailRecord).toBeVisible();
  }
  
  async attemptEvaluationWithMissingField(missingField) {
    await expect(this.missingFieldIndicator).toBeVisible();
    await this.missingFieldIndicator.fill(missingField);
    await this.triggerEvaluationButton.click();
    await expect(this.rejectionStatus).toBeVisible();
  }
  
  async verifyErrorLog(expectedError) {
    await expect(this.viewErrorLogButton).toBeVisible();
    await this.viewErrorLogButton.click();
    await expect(this.errorLogMessage).toBeVisible();
  }
  
  async verifyNoRiskScoreGenerated() {
    await expect(this.riskScoreValue).toBeVisible();
  }
  
  async verifyNoAuditRecord(transactionData) {
    await expect(this.viewAuditButton).toBeVisible();
    await this.viewAuditButton.click();
    await expect(this.auditRecordCount).toBeVisible();
  }
  
  async simulateEngineUnavailability() {
    await expect(this.simulateUnavailabilityButton).toBeVisible();
    await this.simulateUnavailabilityButton.click();
    await expect(this.engineStatus).toBeVisible();
  }
  
  async attemptEvaluationWithUnavailableEngine() {
    await expect(this.triggerEvaluationButton).toBeVisible();
    await this.triggerEvaluationButton.click();
    await expect(this.engineDetectionStatus).toBeVisible();
  }
  
  async verifyFailSafePolicyApplied(expectedAction) {
    await expect(this.failSafePolicyResult).toBeVisible();
    await expect(this.failSafeAction).toBeVisible();
  }
  
  async verifyUnavailabilityAuditRecord(auditEntry) {
    await expect(this.viewAuditButton).toBeVisible();
    await this.viewAuditButton.click();
    await expect(this.auditTrailRecord).toBeVisible();
  }
};