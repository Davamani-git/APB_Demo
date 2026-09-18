const { expect } = require('@playwright/test');

exports.FraudAlertSystemPage = class FraudAlertSystemPage {
  constructor(page) {
    this.page = page;
    
    // System status locators
    this.systemStatusIndicator = page.locator('[data-testid="system-status"]');
    this.authorizationPlatformStatus = page.locator('[data-testid="auth-platform-status"]');
    
    // Transaction submission locators
    this.transactionIdInput = page.locator('#transaction-id');
    this.amountInput = page.locator('#amount');
    this.currencyInput = page.locator('#currency');
    this.merchantInput = page.locator('#merchant');
    this.timestampInput = page.locator('#timestamp');
    this.cardIdInput = page.locator('#card-id');
    this.transactionTypeInput = page.locator('#transaction-type');
    this.riskScoreInput = page.locator('#risk-score');
    this.submitTransactionButton = page.locator('[data-testid="submit-transaction-btn"]');
    
    // Transaction status locators
    this.transactionAcceptedMessage = page.locator('[data-testid="transaction-accepted"]');
    this.transactionReceivedMessage = page.locator('[data-testid="transaction-received"]');
    this.transactionProcessedStatus = page.locator('[data-testid="transaction-processed"]');
    
    // Fraud-risk engine locators
    this.triggerEngineButton = page.locator('[data-testid="trigger-fraud-engine-btn"]');
    this.engineEvaluationStatus = page.locator('[data-testid="engine-evaluation-status"]');
    this.riskScoreDisplay = page.locator('[data-testid="risk-score-display"]');
    this.riskDecisionDisplay = page.locator('[data-testid="risk-decision-display"]');
    this.modelVersionDisplay = page.locator('[data-testid="model-version-display"]');
    
    // Audit trail locators
    this.auditTrailSection = page.locator('[data-testid="audit-trail"]');
    this.auditRecordTransactionId = page.locator('[data-testid="audit-transaction-id"]');
    this.auditRecordRiskScore = page.locator('[data-testid="audit-risk-score"]');
    this.auditRecordDecision = page.locator('[data-testid="audit-decision"]');
    this.auditRecordModelVersion = page.locator('[data-testid="audit-model-version"]');
    this.auditRecordStatus = page.locator('[data-testid="audit-status"]');
    this.auditRecordError = page.locator('[data-testid="audit-error"]');
    this.auditRecordEvent = page.locator('[data-testid="audit-event"]');
    this.auditRecordPolicyApplied = page.locator('[data-testid="audit-policy-applied"]');
    this.auditRecordAction = page.locator('[data-testid="audit-action"]');
    
    // Error log locators
    this.errorLogSection = page.locator('[data-testid="error-log"]');
    this.errorLogEntry = page.locator('[data-testid="error-log-entry"]');
    
    // Fail-safe policy locators
    this.failSafePolicyIndicator = page.locator('[data-testid="fail-safe-policy-applied"]');
    this.failSafePolicyType = page.locator('[data-testid="fail-safe-policy-type"]');
    
    // Engine simulation locators
    this.engineSimulationPanel = page.locator('[data-testid="engine-simulation-panel"]');
    this.simulateUnavailableButton = page.locator('[data-testid="simulate-unavailable-btn"]');
    this.simulateTimeoutButton = page.locator('[data-testid="simulate-timeout-btn"]');
    this.timeoutThresholdInput = page.locator('#timeout-threshold');
    this.engineStatusDisplay = page.locator('[data-testid="engine-status-display"]');
    
    // Alert locators
    this.alertGeneratedIndicator = page.locator('[data-testid="alert-generated"]');
    this.alertIdDisplay = page.locator('[data-testid="alert-id"]');
    this.alertTransactionId = page.locator('[data-testid="alert-transaction-id"]');
    this.alertRiskScore = page.locator('[data-testid="alert-risk-score"]');
    this.alertThresholdUsed = page.locator('[data-testid="alert-threshold-used"]');
    this.noAlertIndicator = page.locator('[data-testid="no-alert-generated"]');
    
    // Threshold configuration locators
    this.thresholdConfigSection = page.locator('[data-testid="threshold-config"]');
    this.cardPresentThreshold = page.locator('[data-testid="threshold-card-present"]');
    this.cardNotPresentThreshold = page.locator('[data-testid="threshold-card-not-present"]');
    this.internationalThreshold = page.locator('[data-testid="threshold-international"]');
    this.appliedThresholdDisplay = page.locator('[data-testid="applied-threshold"]');
    
    // Transaction log locators
    this.transactionLogSection = page.locator('[data-testid="transaction-log"]');
    this.logTransactionId = page.locator('[data-testid="log-transaction-id"]');
    this.logTransactionType = page.locator('[data-testid="log-transaction-type"]');
    this.logRiskScore = page.locator('[data-testid="log-risk-score"]');
    this.logThreshold = page.locator('[data-testid="log-threshold"]');
    this.logAlertTriggered = page.locator('[data-testid="log-alert-triggered"]');
  }

  async navigate(url) {
    await this.page.goto(url);
    await expect(this.page).toHaveURL(url);
  }

  async verifySystemOperational() {
    await expect(this.systemStatusIndicator).toBeVisible();
    await expect(this.systemStatusIndicator).toHaveText(/operational|ready/i);
    await expect(this.authorizationPlatformStatus).toHaveText(/connected/i);
  }

  async submitTransaction(transactionData) {
    await expect(this.transactionIdInput).toBeVisible();
    await this.transactionIdInput.fill(transactionData.transaction_id);
    
    if (transactionData.amount) {
      await this.amountInput.fill(transactionData.amount);
    }
    
    if (transactionData.currency) {
      await this.currencyInput.fill(transactionData.currency);
    }
    
    if (transactionData.merchant !== undefined) {
      if (transactionData.merchant === null) {
        await this.merchantInput.clear();
      } else {
        await this.merchantInput.fill(transactionData.merchant);
      }
    }
    
    if (transactionData.timestamp) {
      await this.timestampInput.fill(transactionData.timestamp);
    }
    
    if (transactionData.card_id) {
      await this.cardIdInput.fill(transactionData.card_id);
    }
    
    if (transactionData.transaction_type) {
      await this.transactionTypeInput.fill(transactionData.transaction_type);
    }
    
    if (transactionData.risk_score) {
      await this.riskScoreInput.fill(transactionData.risk_score);
    }
    
    await expect(this.submitTransactionButton).toBeEnabled();
    await this.submitTransactionButton.click();
  }

  async verifyTransactionAccepted() {
    await expect(this.transactionAcceptedMessage).toBeVisible();
    await expect(this.transactionAcceptedMessage).toHaveText(/accepted/i);
  }

  async verifyTransactionReceived() {
    await expect(this.transactionReceivedMessage).toBeVisible();
    await expect(this.transactionReceivedMessage).toHaveText(/received/i);
  }

  async triggerFraudRiskEngine() {
    await expect(this.triggerEngineButton).toBeVisible();
    await expect(this.triggerEngineButton).toBeEnabled();
    await this.triggerEngineButton.click();
  }

  async verifyFraudRiskEngineEvaluated() {
    await expect(this.engineEvaluationStatus).toBeVisible();
    await expect(this.engineEvaluationStatus).toHaveText(/evaluated successfully|evaluation complete/i);
  }

  async verifyFraudRiskEngineAttemptedEvaluation() {
    await expect(this.engineEvaluationStatus).toBeVisible();
    await expect(this.engineEvaluationStatus).toHaveText(/attempted|evaluation attempted/i);
  }

  async verifyRiskScoreGenerated() {
    await expect(this.riskScoreDisplay).toBeVisible();
    await expect(this.riskScoreDisplay).not.toBeEmpty();
  }

  async verifyRiskDecisionGenerated() {
    await expect(this.riskDecisionDisplay).toBeVisible();
    await expect(this.riskDecisionDisplay).toHaveText(/(Low|Medium|High)/i);
  }

  async verifyModelVersionGenerated() {
    await expect(this.modelVersionDisplay).toBeVisible();
    await expect(this.modelVersionDisplay).toHaveText(/v\d+\.\d+/i);
  }

  async verifyAuditTrailRecord(expectedFields) {
    await expect(this.auditTrailSection).toBeVisible();
    
    if (expectedFields.transaction_id) {
      await expect(this.auditRecordTransactionId).toHaveText(expectedFields.transaction_id);
    }
    
    if (expectedFields.risk_score) {
      await expect(this.auditRecordRiskScore).toHaveText(expectedFields.risk_score);
    }
    
    if (expectedFields.decision) {
      await expect(this.auditRecordDecision).toHaveText(expectedFields.decision);
    }
    
    if (expectedFields.model_version) {
      await expect(this.auditRecordModelVersion).toHaveText(expectedFields.model_version);
    }
    
    if (expectedFields.status) {
      await expect(this.auditRecordStatus).toHaveText(expectedFields.status);
    }
    
    if (expectedFields.error) {
      await expect(this.auditRecordError).toHaveText(expectedFields.error);
    }
    
    if (expectedFields.event) {
      await expect(this.auditRecordEvent).toHaveText(expectedFields.event);
    }
    
    if (expectedFields.policy_applied) {
      await expect(this.auditRecordPolicyApplied).toHaveText(expectedFields.policy_applied);
    }
    
    if (expectedFields.action) {
      await expect(this.auditRecordAction).toHaveText(expectedFields.action);
    }
  }

  async verifyErrorLogForMissingField(fieldName, transactionId) {
    await expect(this.errorLogSection).toBeVisible();
    await expect(this.errorLogEntry).toBeVisible();
    await expect(this.errorLogEntry).toContainText(`Missing required field: ${fieldName}`);
    await expect(this.errorLogEntry).toContainText(transactionId);
  }

  async verifyFailSafePolicyApplied() {
    await expect(this.failSafePolicyIndicator).toBeVisible();
    await expect(this.failSafePolicyIndicator).toHaveText(/fail-safe applied|policy applied/i);
  }

  async simulateEngineUnavailability() {
    await expect(this.engineSimulationPanel).toBeVisible();
    await expect(this.simulateUnavailableButton).toBeEnabled();
    await this.simulateUnavailableButton.click();
  }

  async verifyEngineUnavailable() {
    await expect(this.engineStatusDisplay).toBeVisible();
    await expect(this.engineStatusDisplay).toHaveText(/unavailable|not responding/i);
  }

  async verifyEngineUnavailabilityDetected(transactionId) {
    await expect(this.errorLogSection).toBeVisible();
    await expect(this.errorLogEntry).toContainText('Fraud-risk engine unavailable');
    await expect(this.errorLogEntry).toContainText(transactionId);
  }

  async verifyFailSafePolicyAppliedByTransactionType(transactionType, expectedPolicy) {
    await expect(this.failSafePolicyIndicator).toBeVisible();
    await expect(this.failSafePolicyType).toHaveText(expectedPolicy);
  }

  async verifyTransactionProcessed(transactionId) {
    await expect(this.transactionProcessedStatus).toBeVisible();
    await expect(this.transactionProcessedStatus).toContainText(transactionId);
    await expect(this.transactionProcessedStatus).toContainText(/processed|completed/i);
  }

  async simulateEngineTimeout(timeoutSeconds) {
    await expect(this.engineSimulationPanel).toBeVisible();
    await this.timeoutThresholdInput.fill(timeoutSeconds.toString());
    await expect(this.simulateTimeoutButton).toBeEnabled();
    await this.simulateTimeoutButton.click();
  }

  async verifyEngineTimeout() {
    await expect(this.engineStatusDisplay).toBeVisible();
    await expect(this.engineStatusDisplay).toHaveText(/timeout|not responding within/i);
  }

  async verifyEngineTimeoutDetected(transactionId) {
    await expect(this.errorLogSection).toBeVisible();
    await expect(this.errorLogEntry).toContainText('Fraud-risk engine timeout');
    await expect(this.errorLogEntry).toContainText(transactionId);
  }

  async verifyFailClosedPolicyApplied(transactionType) {
    await expect(this.failSafePolicyIndicator).toBeVisible();
    await expect(this.failSafePolicyType).toHaveText(/fail-closed/i);
  }

  async verifyMultipleThresholdConfigurations(thresholds) {
    await expect(this.thresholdConfigSection).toBeVisible();
    
    if (thresholds['card-present']) {
      await expect(this.cardPresentThreshold).toHaveText(thresholds['card-present']);
    }
    
    if (thresholds['card-not-present']) {
      await expect(this.cardNotPresentThreshold).toHaveText(thresholds['card-not-present']);
    }
    
    if (thresholds['international']) {
      await expect(this.internationalThreshold).toHaveText(thresholds['international']);
    }
  }

  async verifyTransactionTypeIdentified(transactionType) {
    await expect(this.transactionProcessedStatus).toBeVisible();
    await expect(this.transactionProcessedStatus).toContainText(transactionType);
  }

  async verifyThresholdApplied(threshold) {
    await expect(this.appliedThresholdDisplay).toBeVisible();
    await expect(this.appliedThresholdDisplay).toHaveText(threshold);
  }

  async verifyAlertGenerated(transactionId, riskScore, threshold) {
    await expect(this.alertGeneratedIndicator).toBeVisible();
    await expect(this.alertTransactionId).toHaveText(transactionId);
    await expect(this.alertRiskScore).toHaveText(riskScore);
    await expect(this.alertThresholdUsed).toHaveText(threshold);
  }

  async verifyAlertRecordTransactionType(transactionId, transactionType, threshold, riskScore) {
    await expect(this.auditTrailSection).toBeVisible();
    await expect(this.auditRecordTransactionId).toHaveText(transactionId);
    await expect(this.alertThresholdUsed).toHaveText(threshold);
    await expect(this.alertRiskScore).toHaveText(riskScore);
  }

  async verifyNoAlertGenerated(transactionId) {
    await expect(this.noAlertIndicator).toBeVisible();
    await expect(this.noAlertIndicator).toContainText(transactionId);
  }

  async verifyTransactionLog(transactionId, transactionType, riskScore, threshold, alertTriggered) {
    await expect(this.transactionLogSection).toBeVisible();
    await expect(this.logTransactionId).toHaveText(transactionId);
    await expect(this.logTransactionType).toHaveText(transactionType);
    await expect(this.logRiskScore).toHaveText(riskScore);
    await expect(this.logThreshold).toHaveText(threshold);
    await expect(this.logAlertTriggered).toHaveText(alertTriggered.toString());
  }
};
