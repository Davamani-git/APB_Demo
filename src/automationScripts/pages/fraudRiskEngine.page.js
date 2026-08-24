const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.FraudRiskEnginePage = class FraudRiskEnginePage {
  constructor(page) {
    this.page = page;
    
    // API endpoint locators
    this.fraudEvaluateEndpoint = '/api/fraud/evaluate';
    
    // Response locators
    this.apiResponseStatus = page.locator('[data-testid="api-response-status"]');
    this.apiResponseBody = page.locator('[data-testid="api-response-body"]');
    this.riskScoreDisplay = page.locator('[data-testid="risk-score"]');
    this.responseTimeDisplay = page.locator('[data-testid="response-time"]');
    
    // Risk signals locators
    this.riskSignalAmount = page.locator('[data-testid="risk-signal-amount"]');
    this.riskSignalMerchantCategory = page.locator('[data-testid="risk-signal-merchant-category"]');
    this.riskSignalGeoConsistency = page.locator('[data-testid="risk-signal-geo-consistency"]');
    this.riskSignalVelocity = page.locator('[data-testid="risk-signal-velocity"]');
    
    // Validation error locators
    this.validationErrorType = page.locator('[data-testid="validation-error-type"]');
    this.validationErrorField = page.locator('[data-testid="validation-error-field"]');
    this.validationErrorValue = page.locator('[data-testid="validation-error-value"]');
    
    // Error log locators
    this.errorLogType = page.locator('[data-testid="error-log-type"]');
    this.errorLogField = page.locator('[data-testid="error-log-field"]');
    this.errorLogValue = page.locator('[data-testid="error-log-value"]');
    this.riskScoreGenerated = page.locator('[data-testid="risk-score-generated"]');
    
    // Fail-safe policy locators
    this.failSafePolicyType = page.locator('[data-testid="fail-safe-policy-type"]');
    this.failSafePolicyAction = page.locator('[data-testid="fail-safe-policy-action"]');
    
    // Audit trail locators
    this.auditTrailTransactionId = page.locator('[data-testid="audit-trail-transaction-id"]');
    this.auditTrailCondition = page.locator('[data-testid="audit-trail-condition"]');
    this.auditTrailPolicyApplied = page.locator('[data-testid="audit-trail-policy-applied"]');
    
    // Transaction status locators
    this.transactionStatus = page.locator('[data-testid="transaction-status"]');
    
    // Simulation controls
    this.engineUnavailabilityToggle = page.locator('[data-testid="simulate-unavailability"]');
  }
  
  async submitTransactionToFraudEngine(transactionData) {
    logger.info(`Submitting transaction to fraud engine: ${JSON.stringify(transactionData)}`);
    await expect(this.page).toHaveURL(/.*/);
    
    const response = await this.page.request.post(this.fraudEvaluateEndpoint, {
      data: transactionData
    });
    
    await this.page.evaluate((status) => {
      document.querySelector('[data-testid="api-response-status"]').textContent = status;
    }, response.status().toString());
    
    logger.info(`Transaction submitted with status: ${response.status()}`);
  }
  
  async verifyRiskSignalsProcessed(riskSignals) {
    logger.info('Verifying risk signals processing');
    await expect(this.riskSignalAmount).toBeVisible();
    await expect(this.riskSignalAmount).toContainText(riskSignals.amount.toString());
    await expect(this.riskSignalMerchantCategory).toContainText(riskSignals.merchant_category);
    await expect(this.riskSignalGeoConsistency).toContainText(riskSignals.geo_consistency.toString());
    await expect(this.riskSignalVelocity).toContainText(riskSignals.velocity);
    logger.info('Risk signals verified successfully');
  }
  
  async verifyRiskScoreInRange(minScore, maxScore) {
    logger.info(`Verifying risk score is between ${minScore} and ${maxScore}`);
    await expect(this.riskScoreDisplay).toBeVisible();
    const scoreText = await this.riskScoreDisplay.textContent();
    const score = parseInt(scoreText);
    expect(score).toBeGreaterThanOrEqual(minScore);
    expect(score).toBeLessThanOrEqual(maxScore);
    logger.info(`Risk score ${score} is within valid range`);
  }
  
  async verifyResponseTimeSLA(slaThresholdMs) {
    logger.info(`Verifying response time is under ${slaThresholdMs}ms`);
    await expect(this.responseTimeDisplay).toBeVisible();
    const responseTimeText = await this.responseTimeDisplay.textContent();
    const responseTime = parseInt(responseTimeText);
    expect(responseTime).toBeLessThan(slaThresholdMs);
    logger.info(`Response time ${responseTime}ms meets SLA requirement`);
  }
  
  async verifyValidationError(expectedErrorType, expectedField) {
    logger.info(`Verifying validation error: ${expectedErrorType} for field: ${expectedField}`);
    await expect(this.validationErrorType).toBeVisible();
    await expect(this.validationErrorType).toContainText(expectedErrorType);
    await expect(this.validationErrorField).toContainText(expectedField);
    logger.info('Validation error verified successfully');
  }
  
  async verifyErrorLogged(errorType, field) {
    logger.info(`Verifying error logged: ${errorType} for field: ${field}`);
    await expect(this.errorLogType).toBeVisible();
    await expect(this.errorLogType).toContainText(errorType);
    await expect(this.errorLogField).toContainText(field);
    logger.info('Error logging verified successfully');
  }
  
  async verifyErrorLoggedWithValue(errorType, field, providedValue) {
    logger.info(`Verifying error logged: ${errorType} for field: ${field} with value: ${providedValue}`);
    await expect(this.errorLogType).toBeVisible();
    await expect(this.errorLogType).toContainText(errorType);
    await expect(this.errorLogField).toContainText(field);
    await expect(this.errorLogValue).toContainText(providedValue);
    logger.info('Error logging with value verified successfully');
  }
  
  async verifyNoRiskScoreGenerated() {
    logger.info('Verifying no risk score was generated');
    await expect(this.riskScoreGenerated).toBeVisible();
    await expect(this.riskScoreGenerated).toContainText('false');
    logger.info('Confirmed no risk score generated');
  }
  
  async simulateFraudEngineUnavailability() {
    logger.info('Simulating fraud engine unavailability');
    await expect(this.engineUnavailabilityToggle).toBeVisible();
    await this.engineUnavailabilityToggle.check();
    logger.info('Fraud engine unavailability simulated');
  }
  
  async verifyFailSafePolicyApplied(transactionType, expectedPolicy) {
    logger.info(`Verifying fail-safe policy ${expectedPolicy} applied for transaction type: ${transactionType}`);
    await expect(this.failSafePolicyType).toBeVisible();
    await expect(this.failSafePolicyType).toContainText(transactionType);
    await expect(this.failSafePolicyAction).toContainText(expectedPolicy);
    logger.info('Fail-safe policy verified successfully');
  }
  
  async verifyAuditTrailLogged(transactionId, condition, policyApplied) {
    logger.info(`Verifying audit trail for transaction: ${transactionId}`);
    await expect(this.auditTrailTransactionId).toBeVisible();
    await expect(this.auditTrailTransactionId).toContainText(transactionId);
    await expect(this.auditTrailCondition).toContainText(condition);
    await expect(this.auditTrailPolicyApplied).toContainText(policyApplied);
    logger.info('Audit trail logging verified successfully');
  }
  
  async verifyTransactionProcessed(transactionId) {
    logger.info(`Verifying transaction ${transactionId} was processed`);
    await expect(this.transactionStatus).toBeVisible();
    const statusText = await this.transactionStatus.textContent();
    expect(['PROCESSED', 'APPROVED']).toContain(statusText);
    logger.info(`Transaction ${transactionId} processed with status: ${statusText}`);
  }
};
