const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.FraudAlertSystemPage = class FraudAlertSystemPage {
  constructor(page) {
    this.page = page;
    
    // Transaction event locators
    this.transactionReceivedStatus = page.locator('[data-testid="transaction-received-status"]');
    this.eventPublishedStatus = page.locator('[data-testid="event-published-status"]');
    this.eventReceivedFlag = page.locator('[data-testid="event-received-flag"]');
    this.acknowledgmentStatus = page.locator('[data-testid="acknowledgment-status"]');
    this.allEventsReceived = page.locator('[data-testid="all-events-received"]');
    
    // Risk engine locators
    this.riskEngineStatus = page.locator('[data-testid="risk-engine-status"]');
    this.riskEngineStatusIndicator = page.locator('[data-testid="risk-engine-status-indicator"]');
    this.riskScoreValue = page.locator('[data-testid="risk-score-value"]');
    this.calculatedRiskScore = page.locator('[data-testid="calculated-risk-score"]');
    this.alertThresholdValue = page.locator('[data-testid="alert-threshold-value"]');
    this.riskBandLabel = page.locator('[data-testid="risk-band-label"]');
    this.customerHistoryMatch = page.locator('[data-testid="customer-history-match"]');
    
    // Policy decision locators
    this.policyActionLabel = page.locator('[data-testid="policy-action-label"]');
    this.policyDecisionLabel = page.locator('[data-testid="policy-decision-label"]');
    this.alertSeverityLabel = page.locator('[data-testid="alert-severity-label"]');
    
    // Alert record locators
    this.alertIdField = page.locator('[data-testid="alert-id-field"]');
    this.alertStatusField = page.locator('[data-testid="alert-status-field"]');
    this.decisionIdField = page.locator('[data-testid="decision-id-field"]');
    this.alertCreatedFlag = page.locator('[data-testid="alert-created-flag"]');
    this.fraudAlertRecordCreated = page.locator('[data-testid="fraud-alert-record-created"]');
    this.fraudAlertTriggered = page.locator('[data-testid="fraud-alert-triggered"]');
    this.recordStatus = page.locator('[data-testid="record-status"]');
    this.recordCount = page.locator('[data-testid="record-count"]');
    this.totalRecordCount = page.locator('[data-testid="total-record-count"]');
    this.alertRecordCreated = page.locator('[data-testid="alert-record-created"]');
    
    // Transaction status locators
    this.transactionStatusField = page.locator('[data-testid="transaction-status-field"]');
    
    // Audit trail locators
    this.auditTrailRecords = page.locator('[data-testid="audit-trail-records"]');
    this.auditRiskBand = page.locator('[data-testid="audit-risk-band"]');
    this.auditAlertRequired = page.locator('[data-testid="audit-alert-required"]');
    this.auditEventType = page.locator('[data-testid="audit-event-type"]');
    this.auditFailSafeApplied = page.locator('[data-testid="audit-fail-safe-applied"]');
    
    // Fail-safe policy locators
    this.failSafePolicyApplied = page.locator('[data-testid="fail-safe-policy-applied"]');
    this.riskScoreGenerated = page.locator('[data-testid="risk-score-generated"]');
    this.riskBandAssigned = page.locator('[data-testid="risk-band-assigned"]');
    
    // Monitoring alert locators
    this.monitoringAlertType = page.locator('[data-testid="monitoring-alert-type"]');
    this.monitoringAlertSeverity = page.locator('[data-testid="monitoring-alert-severity"]');
    
    // Validation locators
    this.validationResult = page.locator('[data-testid="validation-result"]');
    this.validationStatus = page.locator('[data-testid="validation-status"]');
    this.missingField = page.locator('[data-testid="missing-field"]');
    this.invalidField = page.locator('[data-testid="invalid-field"]');
    this.missingFieldsCount = page.locator('[data-testid="missing-fields-count"]');
    
    // Ingestion locators
    this.ingestionStatus = page.locator('[data-testid="ingestion-status"]');
    this.eventRejected = page.locator('[data-testid="event-rejected"]');
    this.rejectionReason = page.locator('[data-testid="rejection-reason"]');
    this.validationErrorsCount = page.locator('[data-testid="validation-errors-count"]');
    this.processingAttempted = page.locator('[data-testid="processing-attempted"]');
    
    // Error logging locators
    this.errorLogged = page.locator('[data-testid="error-logged"]');
    this.errorType = page.locator('[data-testid="error-type"]');
    this.errorMessages = page.locator('[data-testid="error-messages"]');
    
    // Fraud case locators
    this.fraudCaseCreated = page.locator('[data-testid="fraud-case-created"]');
    this.partialRecordCreated = page.locator('[data-testid="partial-record-created"]');
    this.corruptedRecordCreated = page.locator('[data-testid="corrupted-record-created"]');
    
    // Idempotency locators
    this.duplicateDetected = page.locator('[data-testid="duplicate-detected"]');
    this.idempotencyCheck = page.locator('[data-testid="idempotency-check"]');
    this.duplicateRecordsCreated = page.locator('[data-testid="duplicate-records-created"]');
    this.firstEventProcessed = page.locator('[data-testid="first-event-processed"]');
    this.duplicateEventsDetected = page.locator('[data-testid="duplicate-events-detected"]');
    
    // Context locators
    this.contextFieldsPreserved = page.locator('[data-testid="context-fields-preserved"]');
    this.contextIncluded = page.locator('[data-testid="context-included"]');
    
    // Form inputs and buttons
    this.transactionIdInput = page.locator('[data-testid="transaction-id-input"]');
    this.accountIdInput = page.locator('[data-testid="account-id-input"]');
    this.cardIdInput = page.locator('[data-testid="card-id-input"]');
    this.merchantInput = page.locator('[data-testid="merchant-input"]');
    this.amountInput = page.locator('[data-testid="amount-input"]');
    this.currencyInput = page.locator('[data-testid="currency-input"]');
    this.timestampInput = page.locator('[data-testid="timestamp-input"]');
    this.channelInput = page.locator('[data-testid="channel-input"]');
    this.submitTransactionButton = page.locator('[data-testid="submit-transaction-button"]');
    this.triggerRiskEngineButton = page.locator('[data-testid="trigger-risk-engine-button"]');
    this.verifyRiskScoreButton = page.locator('[data-testid="verify-risk-score-button"]');
    this.verifyAlertButton = page.locator('[data-testid="verify-alert-button"]');
  }

  async navigate() {
    logger.info('Navigating to Fraud Alert System page');
    await this.page.goto('/fraud-alert-system');
    await expect(this.page).toHaveURL(/.*fraud-alert-system/);
  }

  async simulateTransaction(transactionData) {
    logger.info(`Simulating transaction: ${transactionData.transaction_id}`);
    await this.transactionIdInput.fill(transactionData.transaction_id || '');
    await this.accountIdInput.fill(transactionData.account_id);
    await this.cardIdInput.fill(transactionData.card_id);
    await this.merchantInput.fill(transactionData.merchant);
    await this.amountInput.fill(String(transactionData.amount));
    await this.currencyInput.fill(transactionData.currency);
    await this.timestampInput.fill(transactionData.timestamp || '');
    await this.channelInput.fill(transactionData.channel);
    
    if (transactionData.location) {
      await this.page.locator('[data-testid="location-input"]').fill(transactionData.location);
    }
    if (transactionData.merchant_category) {
      await this.page.locator('[data-testid="merchant-category-input"]').fill(transactionData.merchant_category);
    }
    if (transactionData.device_id) {
      await this.page.locator('[data-testid="device-id-input"]').fill(transactionData.device_id);
    }
    if (transactionData.failed_auth_attempts) {
      await this.page.locator('[data-testid="failed-auth-attempts-input"]').fill(String(transactionData.failed_auth_attempts));
    }
    if (transactionData.transaction_type) {
      await this.page.locator('[data-testid="transaction-type-input"]').fill(transactionData.transaction_type);
    }
    if (transactionData.merchant_type) {
      await this.page.locator('[data-testid="merchant-type-input"]').fill(transactionData.merchant_type);
    }
    if (transactionData.ip_address) {
      await this.page.locator('[data-testid="ip-address-input"]').fill(transactionData.ip_address);
    }
    
    await this.submitTransactionButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async triggerRiskEngineEvaluation(modelVersion) {
    logger.info(`Triggering risk engine evaluation with model version: ${modelVersion}`);
    await this.page.locator('[data-testid="risk-model-version-input"]').fill(modelVersion);
    await this.triggerRiskEngineButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRiskScoreCalculation(calculatedScore, threshold) {
    logger.info(`Verifying risk score: ${calculatedScore} against threshold: ${threshold}`);
    await this.page.locator('[data-testid="calculated-score-input"]').fill(String(calculatedScore));
    await this.page.locator('[data-testid="threshold-input"]').fill(String(threshold));
    await this.verifyRiskScoreButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRiskBandClassification(riskBand) {
    logger.info(`Verifying risk band classification: ${riskBand}`);
    await this.page.locator('[data-testid="risk-band-input"]').fill(riskBand);
    await this.page.locator('[data-testid="verify-risk-band-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyPolicyDecision(policyAction, alertSeverity) {
    logger.info(`Verifying policy decision: ${policyAction}, severity: ${alertSeverity}`);
    await this.page.locator('[data-testid="policy-action-input"]').fill(policyAction);
    await this.page.locator('[data-testid="alert-severity-input"]').fill(alertSeverity);
    await this.page.locator('[data-testid="verify-policy-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAlertRecordCreation(alertId, status, decisionId) {
    logger.info(`Verifying alert record creation: ${alertId}`);
    await this.page.locator('[data-testid="alert-id-input"]').fill(alertId);
    await this.page.locator('[data-testid="alert-status-input"]').fill(status);
    await this.page.locator('[data-testid="decision-id-input"]').fill(decisionId);
    await this.verifyAlertButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async executeRiskEngineWithSignals(riskSignals, calculatedScore) {
    logger.info(`Executing risk engine with signals: ${riskSignals.join(', ')}`);
    await this.page.locator('[data-testid="risk-signals-input"]').fill(riskSignals.join(','));
    await this.page.locator('[data-testid="calculated-score-input"]').fill(String(calculatedScore));
    await this.triggerRiskEngineButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyHighRiskClassificationAndPolicy(riskBand, policyAction) {
    logger.info(`Verifying high risk classification: ${riskBand} and policy: ${policyAction}`);
    await this.page.locator('[data-testid="risk-band-input"]').fill(riskBand);
    await this.page.locator('[data-testid="policy-action-input"]').fill(policyAction);
    await this.page.locator('[data-testid="verify-classification-policy-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAuditTrail(auditRecords, decisionId) {
    logger.info(`Verifying audit trail for decision: ${decisionId}`);
    await this.page.locator('[data-testid="audit-records-input"]').fill(auditRecords.join(','));
    await this.page.locator('[data-testid="audit-decision-id-input"]').fill(decisionId);
    await this.page.locator('[data-testid="verify-audit-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async triggerRiskEngineWithSignals(riskSignals) {
    logger.info(`Triggering risk engine with signals: ${riskSignals.join(', ')}`);
    await this.page.locator('[data-testid="risk-signals-input"]').fill(riskSignals.join(','));
    await this.triggerRiskEngineButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRiskScoreBelowThreshold(riskScore, threshold) {
    logger.info(`Verifying risk score ${riskScore} is below threshold ${threshold}`);
    await this.page.locator('[data-testid="calculated-score-input"]').fill(String(riskScore));
    await this.page.locator('[data-testid="threshold-input"]').fill(String(threshold));
    await this.page.locator('[data-testid="verify-below-threshold-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyNoAlertCreated() {
    logger.info('Verifying no alert was created');
    await this.page.locator('[data-testid="verify-no-alert-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLowRiskAuditRecord(riskBand, alertRequired) {
    logger.info(`Verifying low risk audit record: ${riskBand}, alert required: ${alertRequired}`);
    await this.page.locator('[data-testid="audit-risk-band-input"]').fill(riskBand);
    await this.page.locator('[data-testid="audit-alert-required-input"]').fill(String(alertRequired));
    await this.page.locator('[data-testid="verify-audit-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async executeRiskEngineWithCustomerHistory(historyMatch, patternType, calculatedScore) {
    logger.info(`Executing risk engine with customer history match: ${historyMatch}`);
    await this.page.locator('[data-testid="customer-history-match-input"]').fill(String(historyMatch));
    await this.page.locator('[data-testid="pattern-type-input"]').fill(patternType);
    await this.page.locator('[data-testid="calculated-score-input"]').fill(String(calculatedScore));
    await this.triggerRiskEngineButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLowRiskAndPolicyDecision(riskBand, policyDecision) {
    logger.info(`Verifying low risk: ${riskBand} and policy: ${policyDecision}`);
    await this.page.locator('[data-testid="risk-band-input"]').fill(riskBand);
    await this.page.locator('[data-testid="policy-decision-input"]').fill(policyDecision);
    await this.page.locator('[data-testid="verify-low-risk-policy-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTransactionApprovedWithoutIntervention(status, alertTriggered) {
    logger.info(`Verifying transaction approved without intervention: ${status}`);
    await this.page.locator('[data-testid="transaction-status-input"]').fill(status);
    await this.page.locator('[data-testid="alert-triggered-input"]').fill(String(alertTriggered));
    await this.page.locator('[data-testid="verify-no-intervention-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async simulateRiskEngineUnavailability(status, timeoutThreshold) {
    logger.info(`Simulating risk engine unavailability: ${status}`);
    await this.page.locator('[data-testid="risk-engine-status-input"]').fill(status);
    await this.page.locator('[data-testid="timeout-threshold-input"]').fill(String(timeoutThreshold));
    await this.page.locator('[data-testid="simulate-unavailability-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyFailSafePolicyApplication(transactionType, failSafePolicy, arbitraryDecision) {
    logger.info(`Verifying fail-safe policy application for: ${transactionType}`);
    await this.page.locator('[data-testid="transaction-type-verify-input"]').fill(transactionType);
    await this.page.locator('[data-testid="fail-safe-policy-input"]').fill(failSafePolicy);
    await this.page.locator('[data-testid="arbitrary-decision-input"]').fill(String(arbitraryDecision));
    await this.page.locator('[data-testid="verify-fail-safe-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyEngineFailureAuditRecord(transactionId, failSafeApplied, policyApplied) {
    logger.info(`Verifying engine failure audit record for: ${transactionId}`);
    await this.page.locator('[data-testid="audit-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="audit-fail-safe-applied-input"]').fill(String(failSafeApplied));
    await this.page.locator('[data-testid="audit-policy-applied-input"]').fill(policyApplied);
    await this.page.locator('[data-testid="verify-failure-audit-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyNoArbitraryDecisionCreated() {
    logger.info('Verifying no arbitrary decision was created');
    await this.page.locator('[data-testid="verify-no-arbitrary-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async simulateRiskEngineFailure(status, errorCode, slaThreshold) {
    logger.info(`Simulating risk engine failure: ${status}, error: ${errorCode}`);
    await this.page.locator('[data-testid="risk-engine-status-input"]').fill(status);
    await this.page.locator('[data-testid="error-code-input"]').fill(errorCode);
    await this.page.locator('[data-testid="sla-threshold-input"]').fill(String(slaThreshold));
    await this.page.locator('[data-testid="simulate-failure-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTransactionSpecificFailSafe(transactionType, failSafePolicy, policyRationale) {
    logger.info(`Verifying transaction-specific fail-safe for: ${transactionType}`);
    await this.page.locator('[data-testid="transaction-type-verify-input"]').fill(transactionType);
    await this.page.locator('[data-testid="fail-safe-policy-input"]').fill(failSafePolicy);
    await this.page.locator('[data-testid="policy-rationale-input"]').fill(policyRationale);
    await this.page.locator('[data-testid="verify-specific-fail-safe-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyComprehensiveAuditLogging(auditEvents, transactionId, failSafePolicy) {
    logger.info(`Verifying comprehensive audit logging for: ${transactionId}`);
    await this.page.locator('[data-testid="audit-events-input"]').fill(auditEvents.join(','));
    await this.page.locator('[data-testid="audit-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="audit-fail-safe-policy-input"]').fill(failSafePolicy);
    await this.page.locator('[data-testid="verify-comprehensive-audit-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyMonitoringAlertTriggered(alertType, severity) {
    logger.info(`Verifying monitoring alert: ${alertType}, severity: ${severity}`);
    await this.page.locator('[data-testid="monitoring-alert-type-input"]').fill(alertType);
    await this.page.locator('[data-testid="monitoring-severity-input"]').fill(severity);
    await this.page.locator('[data-testid="verify-monitoring-alert-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async publishTransactionEvent(transactionData) {
    logger.info(`Publishing transaction event: ${transactionData.transaction_id}`);
    await this.transactionIdInput.fill(transactionData.transaction_id || '');
    await this.accountIdInput.fill(transactionData.account_id);
    await this.cardIdInput.fill(transactionData.card_id);
    await this.merchantInput.fill(transactionData.merchant);
    
    if (typeof transactionData.amount === 'string') {
      await this.amountInput.fill(transactionData.amount);
    } else {
      await this.amountInput.fill(String(transactionData.amount));
    }
    
    await this.currencyInput.fill(transactionData.currency);
    await this.timestampInput.fill(transactionData.timestamp || '');
    await this.channelInput.fill(transactionData.channel);
    
    if (transactionData.device_id) {
      await this.page.locator('[data-testid="device-id-input"]').fill(transactionData.device_id);
    }
    if (transactionData.ip_address) {
      await this.page.locator('[data-testid="ip-address-input"]').fill(transactionData.ip_address);
    }
    if (transactionData.location) {
      await this.page.locator('[data-testid="location-input"]').fill(transactionData.location);
    }
    if (transactionData.merchant_type) {
      await this.page.locator('[data-testid="merchant-type-input"]').fill(transactionData.merchant_type);
    }
    if (transactionData.transaction_type) {
      await this.page.locator('[data-testid="transaction-type-input"]').fill(transactionData.transaction_type);
    }
    
    await this.page.locator('[data-testid="publish-event-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyEventReceived() {
    logger.info('Verifying event received by fraud detection system');
    await this.page.locator('[data-testid="verify-event-received-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRequiredFieldsPresent(requiredFields) {
    logger.info(`Verifying required fields: ${requiredFields.join(', ')}`);
    await this.page.locator('[data-testid="required-fields-input"]').fill(requiredFields.join(','));
    await this.page.locator('[data-testid="verify-required-fields-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyIngestionSuccess() {
    logger.info('Verifying ingestion success');
    await this.page.locator('[data-testid="verify-ingestion-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyCanonicalAlertRecordCreation(decisionId, transactionId, recordStatus) {
    logger.info(`Verifying canonical alert record creation: ${decisionId}`);
    await this.page.locator('[data-testid="decision-id-input"]').fill(decisionId);
    await this.page.locator('[data-testid="transaction-id-verify-input"]').fill(transactionId);
    await this.page.locator('[data-testid="record-status-input"]').fill(recordStatus);
    await this.page.locator('[data-testid="verify-canonical-record-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyEventReceivedWithContext(contextFields) {
    logger.info(`Verifying event received with context fields: ${contextFields.join(', ')}`);
    await this.page.locator('[data-testid="context-fields-input"]').fill(contextFields.join(','));
    await this.page.locator('[data-testid="verify-event-context-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyCanonicalRecordWithContext(decisionId, transactionId, contextIncluded) {
    logger.info(`Verifying canonical record with context: ${decisionId}`);
    await this.page.locator('[data-testid="decision-id-input"]').fill(decisionId);
    await this.page.locator('[data-testid="transaction-id-verify-input"]').fill(transactionId);
    await this.page.locator('[data-testid="context-included-input"]').fill(String(contextIncluded));
    await this.page.locator('[data-testid="verify-record-context-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyInitialAlertRecordCreation(alertId, decisionId, transactionId, recordCount) {
    logger.info(`Verifying initial alert record: ${alertId}`);
    await this.page.locator('[data-testid="alert-id-input"]').fill(alertId);
    await this.page.locator('[data-testid="decision-id-input"]').fill(decisionId);
    await this.page.locator('[data-testid="transaction-id-verify-input"]').fill(transactionId);
    await this.page.locator('[data-testid="record-count-input"]').fill(String(recordCount));
    await this.page.locator('[data-testid="verify-initial-record-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async publishDuplicateTransactionEvent(transactionData, eventSequence) {
    logger.info(`Publishing duplicate transaction event: ${transactionData.transaction_id}, sequence: ${eventSequence}`);
    await this.transactionIdInput.fill(transactionData.transaction_id);
    await this.accountIdInput.fill(transactionData.account_id);
    await this.cardIdInput.fill(transactionData.card_id);
    await this.merchantInput.fill(transactionData.merchant);
    await this.amountInput.fill(String(transactionData.amount));
    await this.currencyInput.fill(transactionData.currency);
    await this.timestampInput.fill(transactionData.timestamp);
    await this.channelInput.fill(transactionData.channel);
    await this.page.locator('[data-testid="event-sequence-input"]').fill(String(eventSequence));
    await this.page.locator('[data-testid="publish-event-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyDuplicateDetection() {
    logger.info('Verifying duplicate detection');
    await this.page.locator('[data-testid="verify-duplicate-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyOnlyOneRecordExists(alertId, decisionId, transactionId, totalCount) {
    logger.info(`Verifying only one record exists: ${alertId}`);
    await this.page.locator('[data-testid="alert-id-input"]').fill(alertId);
    await this.page.locator('[data-testid="decision-id-input"]').fill(decisionId);
    await this.page.locator('[data-testid="transaction-id-verify-input"]').fill(transactionId);
    await this.page.locator('[data-testid="total-count-input"]').fill(String(totalCount));
    await this.page.locator('[data-testid="verify-single-record-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async publishMultipleDuplicateEvents(transactionData, eventCount) {
    logger.info(`Publishing ${eventCount} duplicate events for: ${transactionData.transaction_id}`);
    await this.transactionIdInput.fill(transactionData.transaction_id);
    await this.accountIdInput.fill(transactionData.account_id);
    await this.cardIdInput.fill(transactionData.card_id);
    await this.merchantInput.fill(transactionData.merchant);
    await this.amountInput.fill(String(transactionData.amount));
    await this.currencyInput.fill(transactionData.currency);
    await this.timestampInput.fill(transactionData.timestamp);
    await this.channelInput.fill(transactionData.channel);
    await this.page.locator('[data-testid="event-count-input"]').fill(String(eventCount));
    await this.page.locator('[data-testid="publish-multiple-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyIdempotencyForMultipleDuplicates(firstProcessed, duplicatesDetected) {
    logger.info(`Verifying idempotency for multiple duplicates: ${duplicatesDetected}`);
    await this.page.locator('[data-testid="first-processed-input"]').fill(String(firstProcessed));
    await this.page.locator('[data-testid="duplicates-detected-input"]').fill(String(duplicatesDetected));
    await this.page.locator('[data-testid="verify-multiple-idempotency-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAuditTrailForDuplicates(auditEntries, transactionId) {
    logger.info(`Verifying audit trail for duplicates: ${transactionId}`);
    await this.page.locator('[data-testid="audit-entries-input"]').fill(auditEntries.join(','));
    await this.page.locator('[data-testid="audit-transaction-id-input"]').fill(transactionId);
    await this.page.locator('[data-testid="verify-duplicate-audit-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyValidationFailure(missingField, isRequired) {
    logger.info(`Verifying validation failure for field: ${missingField}`);
    await this.page.locator('[data-testid="missing-field-input"]').fill(missingField);
    await this.page.locator('[data-testid="required-field-input"]').fill(String(isRequired));
    await this.page.locator('[data-testid="verify-validation-failure-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyIngestionRejection() {
    logger.info('Verifying ingestion rejection');
    await this.page.locator('[data-testid="verify-rejection-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyErrorLogged(errorType, errorMessage) {
    logger.info(`Verifying error logged: ${errorType}`);
    await this.page.locator('[data-testid="error-type-input"]').fill(errorType);
    await this.page.locator('[data-testid="error-message-input"]').fill(errorMessage);
    await this.page.locator('[data-testid="verify-error-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyNoFraudCaseCreated() {
    logger.info('Verifying no fraud case was created');
    await this.page.locator('[data-testid="verify-no-fraud-case-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyFormatValidationFailure(invalidField, expectedFormat, receivedFormat) {
    logger.info(`Verifying format validation failure for: ${invalidField}`);
    await this.page.locator('[data-testid="invalid-field-input"]').fill(invalidField);
    await this.page.locator('[data-testid="expected-format-input"]').fill(expectedFormat);
    await this.page.locator('[data-testid="received-format-input"]').fill(receivedFormat);
    await this.page.locator('[data-testid="verify-format-failure-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyFormatErrorLogged(errorType, errorMessage, transactionId) {
    logger.info(`Verifying format error logged for: ${transactionId}`);
    await this.page.locator('[data-testid="error-type-input"]').fill(errorType);
    await this.page.locator('[data-testid="error-message-input"]').fill(errorMessage);
    await this.page.locator('[data-testid="transaction-id-error-input"]').fill(transactionId);
    await this.page.locator('[data-testid="verify-format-error-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyNoRecordsCreated() {
    logger.info('Verifying no records were created');
    await this.page.locator('[data-testid="verify-no-records-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyMultipleMissingFields(missingFields, fieldsCount) {
    logger.info(`Verifying multiple missing fields: ${missingFields.join(', ')}`);
    await this.page.locator('[data-testid="missing-fields-list-input"]').fill(missingFields.join(','));
    await this.page.locator('[data-testid="fields-count-input"]').fill(String(fieldsCount));
    await this.page.locator('[data-testid="verify-multiple-missing-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyIngestionFailureWithMultipleErrors(errorsCount) {
    logger.info(`Verifying ingestion failure with ${errorsCount} errors`);
    await this.page.locator('[data-testid="errors-count-input"]').fill(String(errorsCount));
    await this.page.locator('[data-testid="verify-multiple-errors-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyComprehensiveErrorLogging(errorMessages) {
    logger.info(`Verifying comprehensive error logging: ${errorMessages.length} errors`);
    await this.page.locator('[data-testid="error-messages-list-input"]').fill(errorMessages.join('|'));
    await this.page.locator('[data-testid="verify-comprehensive-errors-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyNoProcessingOccurred() {
    logger.info('Verifying no processing occurred');
    await this.page.locator('[data-testid="verify-no-processing-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }
};