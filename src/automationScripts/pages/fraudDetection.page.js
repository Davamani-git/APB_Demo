const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.FraudDetectionPage = class FraudDetectionPage {
  constructor(page) {
    this.page = page;
    
    // Transaction Event Preparation Locators
    this.transactionIdInput = page.locator('#transaction-id-input');
    this.accountIdInput = page.locator('#account-id-input');
    this.cardIdInput = page.locator('#card-id-input');
    this.merchantInput = page.locator('#merchant-input');
    this.amountInput = page.locator('#amount-input');
    this.currencyInput = page.locator('#currency-input');
    this.timestampInput = page.locator('#timestamp-input');
    this.channelInput = page.locator('#channel-input');
    this.locationInput = page.locator('#location-input');
    this.previousLocationInput = page.locator('#previous-location-input');
    this.velocityInput = page.locator('#velocity-input');
    this.merchantCategoryInput = page.locator('#merchant-category-input');
    this.customerAvgTransactionInput = page.locator('#customer-avg-transaction-input');
    this.prepareEventButton = page.locator('#prepare-event-button');
    this.eventPreparedStatus = page.locator('#event-prepared-status');
    this.preparedEventId = page.locator('#prepared-event-id');
    
    // Transaction Publishing Locators
    this.publishEventButton = page.locator('#publish-event-button');
    this.publishStatus = page.locator('#publish-status');
    this.engineReceivedStatus = page.locator('#engine-received-status');
    this.systemReceivedStatus = page.locator('#system-received-status');
    this.eventAcknowledgement = page.locator('#event-acknowledgement');
    
    // Risk Evaluation Locators
    this.triggerEvaluationButton = page.locator('#trigger-evaluation-button');
    this.evaluationStatus = page.locator('#evaluation-status');
    this.riskScoreDisplay = page.locator('#risk-score-display');
    this.riskBandDisplay = page.locator('#risk-band-display');
    this.evaluationTimestamp = page.locator('#evaluation-timestamp');
    this.evaluationLatency = page.locator('#evaluation-latency');
    this.decisionIdField = page.locator('#decision-id');
    this.transactionIdField = page.locator('#transaction-id-field');
    this.modelVersionField = page.locator('#model-version');
    this.decisionField = page.locator('#decision-field');
    this.timestampField = page.locator('#timestamp-field');
    
    // Engine Availability Control Locators
    this.engineControlPanel = page.locator('#engine-control-panel');
    this.simulateUnavailabilityButton = page.locator('#simulate-unavailability-button');
    this.engineStatusIndicator = page.locator('#engine-status-indicator');
    this.timeoutThresholdInput = page.locator('#timeout-threshold-input');
    this.engineDelayInput = page.locator('#engine-delay-input');
    this.configureTimeoutButton = page.locator('#configure-timeout-button');
    this.timeoutConfigStatus = page.locator('#timeout-config-status');
    
    // Fail-Safe Policy Locators
    this.failSafePolicyDisplay = page.locator('#fail-safe-policy-display');
    this.failSafeActionDisplay = page.locator('#fail-safe-action-display');
    this.transactionTypeDisplay = page.locator('#transaction-type-display');
    this.timeoutDetectedIndicator = page.locator('#timeout-detected-indicator');
    
    // System Logs Locators
    this.systemLogsPanel = page.locator('#system-logs-panel');
    this.logEntryByType = (logType) => page.locator(`[data-log-type="${logType}"]`);
    this.logTransactionId = page.locator('.log-transaction-id');
    this.logErrorReason = page.locator('.log-error-reason');
    this.logFailSafeAction = page.locator('.log-fail-safe-action');
    this.logMissingFields = page.locator('.log-missing-fields');
    
    // Alert and Decision Locators
    this.alertCreatedIndicator = page.locator('#alert-created-indicator');
    this.transactionDecisionDisplay = page.locator('#transaction-decision-display');
    this.noAlertIndicator = page.locator('#no-alert-indicator');
    
    // Queue Management Locators
    this.queueStatusDisplay = page.locator('#queue-status-display');
    this.queuedTransactionRecord = page.locator('#queued-transaction-record');
    this.queuedTransactionId = page.locator('#queued-transaction-id');
    this.queuedAccountId = page.locator('#queued-account-id');
    this.queuedCardId = page.locator('#queued-card-id');
    this.queuedMerchant = page.locator('#queued-merchant');
    this.queuedAmount = page.locator('#queued-amount');
    this.queuedCurrency = page.locator('#queued-currency');
    this.queuedTimestamp = page.locator('#queued-timestamp');
    this.queuedChannel = page.locator('#queued-channel');
    this.transactionRecordCount = page.locator('#transaction-record-count');
    this.canonicalRecordIndicator = page.locator('#canonical-record-indicator');
    
    // Idempotency Locators
    this.duplicateEventCounter = page.locator('#duplicate-event-counter');
    this.idempotencyLogEntry = page.locator('[data-log-type="duplicate_transaction_ignored"]');
    
    // Malformed Event Locators
    this.malformedEventPanel = page.locator('#malformed-event-panel');
    this.missingFieldIndicator = (fieldName) => page.locator(`[data-missing-field="${fieldName}"]`);
    this.validationErrorDisplay = page.locator('#validation-error-display');
    this.rejectionReasonDisplay = page.locator('#rejection-reason-display');
    this.errorLogPanel = page.locator('#error-log-panel');
  }

  // Transaction Event Preparation Methods
  async prepareTransactionEvent(transactionData) {
    logger.info(`Preparing transaction event: ${JSON.stringify(transactionData)}`);
    
    if (transactionData.transaction_id) {
      await expect(this.transactionIdInput).toBeVisible();
      await this.transactionIdInput.fill(transactionData.transaction_id);
    }
    
    if (transactionData.account_id) {
      await expect(this.accountIdInput).toBeVisible();
      await this.accountIdInput.fill(transactionData.account_id);
    }
    
    if (transactionData.card_id) {
      await expect(this.cardIdInput).toBeVisible();
      await this.cardIdInput.fill(transactionData.card_id);
    }
    
    if (transactionData.merchant) {
      await expect(this.merchantInput).toBeVisible();
      await this.merchantInput.fill(transactionData.merchant);
    }
    
    if (transactionData.amount !== undefined) {
      await expect(this.amountInput).toBeVisible();
      await this.amountInput.fill(transactionData.amount.toString());
    }
    
    if (transactionData.currency) {
      await expect(this.currencyInput).toBeVisible();
      await this.currencyInput.fill(transactionData.currency);
    }
    
    if (transactionData.timestamp) {
      await expect(this.timestampInput).toBeVisible();
      await this.timestampInput.fill(transactionData.timestamp);
    }
    
    if (transactionData.channel) {
      await expect(this.channelInput).toBeVisible();
      await this.channelInput.fill(transactionData.channel);
    }
    
    if (transactionData.location) {
      await expect(this.locationInput).toBeVisible();
      await this.locationInput.fill(transactionData.location);
    }
    
    if (transactionData.previous_location) {
      await expect(this.previousLocationInput).toBeVisible();
      await this.previousLocationInput.fill(transactionData.previous_location);
    }
    
    if (transactionData.velocity) {
      await expect(this.velocityInput).toBeVisible();
      await this.velocityInput.fill(transactionData.velocity);
    }
    
    if (transactionData.merchant_category) {
      await expect(this.merchantCategoryInput).toBeVisible();
      await this.merchantCategoryInput.fill(transactionData.merchant_category);
    }
    
    if (transactionData.customer_avg_transaction !== undefined) {
      await expect(this.customerAvgTransactionInput).toBeVisible();
      await this.customerAvgTransactionInput.fill(transactionData.customer_avg_transaction.toString());
    }
    
    await expect(this.prepareEventButton).toBeEnabled();
    await this.prepareEventButton.click();
    logger.info('Transaction event preparation initiated');
  }

  async verifyTransactionEventPrepared(transactionId) {
    await expect(this.eventPreparedStatus).toBeVisible();
    await expect(this.eventPreparedStatus).toHaveText('prepared');
    await expect(this.preparedEventId).toHaveText(transactionId);
    logger.info(`Transaction event prepared: ${transactionId}`);
  }

  async verifyTransactionEventComplete(transactionData) {
    await expect(this.eventPreparedStatus).toBeVisible();
    await expect(this.eventPreparedStatus).toHaveText('complete');
    logger.info('Transaction event is complete with all required attributes');
  }

  // Transaction Publishing Methods
  async publishTransactionEvent(transactionId) {
    logger.info(`Publishing transaction event: ${transactionId}`);
    await expect(this.publishEventButton).toBeEnabled();
    await this.publishEventButton.click();
    await expect(this.publishStatus).toBeVisible();
    await expect(this.publishStatus).toHaveText('published');
  }

  async verifyEventReceivedByEngine(transactionId) {
    await expect(this.engineReceivedStatus).toBeVisible();
    await expect(this.engineReceivedStatus).toHaveText('received');
    logger.info(`Event received by fraud-risk engine: ${transactionId}`);
  }

  async verifyEventReceivedBySystem(transactionId) {
    await expect(this.systemReceivedStatus).toBeVisible();
    await expect(this.systemReceivedStatus).toHaveText('received');
    logger.info(`Event received by fraud detection system: ${transactionId}`);
  }

  async publishTransactionFromAuthPlatform(transactionId) {
    logger.info(`Publishing transaction from authorization platform: ${transactionId}`);
    await expect(this.publishEventButton).toBeEnabled();
    await this.publishEventButton.click();
  }

  async verifyEventPublished(transactionId) {
    await expect(this.publishStatus).toBeVisible();
    await expect(this.publishStatus).toHaveText('published');
    logger.info(`Transaction event published: ${transactionId}`);
  }

  async verifySystemReceivesEvent(transactionId) {
    await expect(this.systemReceivedStatus).toBeVisible();
    await expect(this.systemReceivedStatus).toHaveText('received');
    logger.info(`System receives event: ${transactionId}`);
  }

  async verifySystemAcknowledgesReceipt(transactionId) {
    await expect(this.eventAcknowledgement).toBeVisible();
    await expect(this.eventAcknowledgement).toHaveText('acknowledged');
    logger.info(`System acknowledges receipt: ${transactionId}`);
  }

  async verifyEventPublishedAndReceived(transactionId) {
    await this.verifyEventPublished(transactionId);
    await this.verifySystemReceivesEvent(transactionId);
  }

  async verifyEventSentToEngine(transactionId) {
    await expect(this.engineReceivedStatus).toBeVisible();
    logger.info(`Event sent to fraud-risk engine: ${transactionId}`);
  }

  // Risk Evaluation Methods
  async triggerRiskEvaluation(transactionId) {
    logger.info(`Triggering risk evaluation for: ${transactionId}`);
    await expect(this.triggerEvaluationButton).toBeEnabled();
    await this.triggerEvaluationButton.click();
  }

  async verifyRiskEvaluationTriggered(transactionId) {
    await expect(this.evaluationStatus).toBeVisible();
    await expect(this.evaluationStatus).toHaveText('evaluating');
    logger.info(`Risk evaluation triggered: ${transactionId}`);
  }

  async verifyRiskEvaluationAgainstHistory(transactionId) {
    await expect(this.evaluationStatus).toBeVisible();
    await expect(this.evaluationStatus).toContainText('evaluated_against_history');
    logger.info(`Risk evaluation completed against customer history: ${transactionId}`);
  }

  async getEvaluationResult(transactionId) {
    await expect(this.evaluationStatus).toHaveText('completed');
    
    const riskScore = await this.riskScoreDisplay.textContent();
    const riskBand = await this.riskBandDisplay.textContent();
    const latency = await this.evaluationLatency.textContent();
    const decisionId = await this.decisionIdField.textContent();
    const modelVersion = await this.modelVersionField.textContent();
    const decision = await this.decisionField.textContent();
    const timestamp = await this.timestampField.textContent();
    
    logger.info(`Evaluation result retrieved for ${transactionId}: Score=${riskScore}, Band=${riskBand}`);
    
    return {
      risk_score: parseInt(riskScore),
      risk_band: riskBand,
      latency: parseInt(latency),
      decision_id: decisionId,
      transaction_id: transactionId,
      model_version: modelVersion,
      decision: decision,
      timestamp: timestamp
    };
  }

  async verifyRiskScore(evaluationResult, threshold, operator) {
    const score = evaluationResult.risk_score;
    
    if (operator === 'gte') {
      expect(score).toBeGreaterThanOrEqual(threshold);
      logger.info(`Risk score ${score} is >= ${threshold}`);
    } else if (operator === 'lte') {
      expect(score).toBeLessThanOrEqual(threshold);
      logger.info(`Risk score ${score} is <= ${threshold}`);
    }
  }

  async verifyRiskBand(evaluationResult, expectedBand) {
    expect(evaluationResult.risk_band).toBe(expectedBand);
    logger.info(`Risk band verified: ${expectedBand}`);
  }

  async verifyEvaluationLatency(evaluationResult, maxLatencyMs) {
    expect(evaluationResult.latency).toBeLessThan(maxLatencyMs);
    logger.info(`Evaluation latency ${evaluationResult.latency}ms is within SLA (< ${maxLatencyMs}ms)`);
  }

  async verifyRiskDecisionFields(evaluationResult, requiredFields) {
    for (const field of requiredFields) {
      expect(evaluationResult[field]).toBeDefined();
      expect(evaluationResult[field]).not.toBe('');
      logger.info(`Risk decision field verified: ${field}`);
    }
  }

  // Engine Availability Control Methods
  async simulateEngineUnavailability() {
    logger.info('Simulating fraud-risk engine unavailability');
    await expect(this.engineControlPanel).toBeVisible();
    await expect(this.simulateUnavailabilityButton).toBeEnabled();
    await this.simulateUnavailabilityButton.click();
  }

  async verifyEngineUnavailable() {
    await expect(this.engineStatusIndicator).toBeVisible();
    await expect(this.engineStatusIndicator).toHaveText('unavailable');
    logger.info('Fraud-risk engine is unavailable');
  }

  async configureEngineTimeout(thresholdMs, delayMs) {
    logger.info(`Configuring engine timeout: threshold=${thresholdMs}ms, delay=${delayMs}ms`);
    await expect(this.timeoutThresholdInput).toBeVisible();
    await this.timeoutThresholdInput.fill(thresholdMs.toString());
    await expect(this.engineDelayInput).toBeVisible();
    await this.engineDelayInput.fill(delayMs.toString());
    await expect(this.configureTimeoutButton).toBeEnabled();
    await this.configureTimeoutButton.click();
  }

  async verifyEngineTimeoutConfigured(delayMs) {
    await expect(this.timeoutConfigStatus).toBeVisible();
    await expect(this.timeoutConfigStatus).toContainText(delayMs.toString());
    logger.info(`Engine timeout configured: ${delayMs}ms`);
  }

  // Fail-Safe Policy Methods
  async verifyFailSafePolicyApplied(transactionId, transactionType, expectedPolicy) {
    await expect(this.failSafePolicyDisplay).toBeVisible();
    await expect(this.transactionTypeDisplay).toHaveText(transactionType);
    await expect(this.failSafeActionDisplay).toHaveText(expectedPolicy);
    logger.info(`Fail-safe policy applied for ${transactionId}: type=${transactionType}, policy=${expectedPolicy}`);
  }

  async verifyTimeoutDetected(transactionId) {
    await expect(this.timeoutDetectedIndicator).toBeVisible();
    await expect(this.timeoutDetectedIndicator).toHaveText('timeout_detected');
    logger.info(`Timeout detected for transaction: ${transactionId}`);
  }

  // System Logs Methods
  async verifySystemLog(logType, transactionId) {
    const logEntry = this.logEntryByType(logType);
    await expect(logEntry).toBeVisible();
    
    const logTxnId = logEntry.locator('.log-transaction-id');
    await expect(logTxnId).toHaveText(transactionId);
    
    logger.info(`System log verified: type=${logType}, transaction_id=${transactionId}`);
  }

  async verifySystemLogWithAction(logType, transactionId, failSafeAction) {
    const logEntry = this.logEntryByType(logType);
    await expect(logEntry).toBeVisible();
    
    const logTxnId = logEntry.locator('.log-transaction-id');
    await expect(logTxnId).toHaveText(transactionId);
    
    const logAction = logEntry.locator('.log-fail-safe-action');
    await expect(logAction).toHaveText(failSafeAction);
    
    logger.info(`System log verified: type=${logType}, transaction_id=${transactionId}, action=${failSafeAction}`);
  }

  async verifyIdempotencyLog(logType, transactionId) {
    await expect(this.idempotencyLogEntry).toBeVisible();
    const logTxnId = this.idempotencyLogEntry.locator('.log-transaction-id');
    await expect(logTxnId).toHaveText(transactionId);
    logger.info(`Idempotency log verified: ${transactionId}`);
  }

  async verifyErrorLog(logType, reason, identifier) {
    const logEntry = this.logEntryByType(logType);
    await expect(logEntry).toBeVisible();
    
    const logReason = logEntry.locator('.log-error-reason');
    await expect(logReason).toContainText(reason);
    
    logger.info(`Error log verified: type=${logType}, reason=${reason}, identifier=${identifier}`);
  }

  async verifyErrorLogMultipleFields(logType, missingFields) {
    const logEntry = this.logEntryByType(logType);
    await expect(logEntry).toBeVisible();
    
    const logMissingFields = logEntry.locator('.log-missing-fields');
    const logText = await logMissingFields.textContent();
    
    for (const field of missingFields) {
      expect(logText).toContain(field);
    }
    
    logger.info(`Error log verified with multiple missing fields: ${missingFields.join(', ')}`);
  }

  // Alert and Decision Methods
  async verifyTransactionDecision(transactionId, expectedDecision) {
    await expect(this.transactionDecisionDisplay).toBeVisible();
    await expect(this.transactionDecisionDisplay).toHaveText(expectedDecision);
    logger.info(`Transaction decision verified: ${transactionId} = ${expectedDecision}`);
  }

  async verifyNoAlertCreated(transactionId) {
    await expect(this.noAlertIndicator).toBeVisible();
    await expect(this.alertCreatedIndicator).not.toBeVisible();
    logger.info(`No fraud alert created for transaction: ${transactionId}`);
  }

  // Queue Management Methods
  async verifyTransactionQueued(transactionId) {
    await expect(this.queuedTransactionRecord).toBeVisible();
    await expect(this.queuedTransactionId).toHaveText(transactionId);
    logger.info(`Transaction queued for risk evaluation: ${transactionId}`);
  }

  async verifyQueueStatus(transactionId, expectedStatus) {
    await expect(this.queueStatusDisplay).toBeVisible();
    await expect(this.queueStatusDisplay).toHaveText(expectedStatus);
    logger.info(`Queue status verified: ${transactionId} = ${expectedStatus}`);
  }

  async verifyQueuedTransactionAttributes(transactionData) {
    await expect(this.queuedTransactionId).toHaveText(transactionData.transaction_id);
    await expect(this.queuedAccountId).toHaveText(transactionData.account_id);
    await expect(this.queuedCardId).toHaveText(transactionData.card_id);
    await expect(this.queuedMerchant).toHaveText(transactionData.merchant);
    await expect(this.queuedAmount).toHaveText(transactionData.amount.toString());
    await expect(this.queuedCurrency).toHaveText(transactionData.currency);
    await expect(this.queuedTimestamp).toHaveText(transactionData.timestamp);
    await expect(this.queuedChannel).toHaveText(transactionData.channel);
    logger.info(`All queued transaction attributes verified for: ${transactionData.transaction_id}`);
  }

  async verifyCanonicalRecordCreated(transactionId) {
    await expect(this.canonicalRecordIndicator).toBeVisible();
    await expect(this.canonicalRecordIndicator).toHaveText('canonical');
    logger.info(`Canonical transaction record created: ${transactionId}`);
  }

  async verifyTransactionRecordCount(transactionId, expectedCount) {
    await expect(this.transactionRecordCount).toBeVisible();
    const count = await this.transactionRecordCount.textContent();
    expect(parseInt(count)).toBe(expectedCount);
    logger.info(`Transaction record count verified: ${transactionId} = ${expectedCount}`);
  }

  async verifyNoDuplicateCasesCreated(transactionId) {
    await this.verifyTransactionRecordCount(transactionId, 1);
    logger.info(`No duplicate fraud cases created for: ${transactionId}`);
  }

  async verifyNoTransactionQueued(accountId) {
    await expect(this.queuedTransactionRecord).not.toBeVisible();
    logger.info(`No transaction queued for account: ${accountId}`);
  }

  async verifyNoTransactionQueuedByTransactionId(transactionId) {
    await expect(this.queuedTransactionRecord).not.toBeVisible();
    logger.info(`No transaction queued for transaction_id: ${transactionId}`);
  }

  async verifyNoTransactionQueuedForMalformedEvent() {
    await expect(this.queuedTransactionRecord).not.toBeVisible();
    logger.info('No transaction queued for malformed event');
  }

  // Idempotency Methods
  async publishDuplicateEvents(transactionId, count) {
    logger.info(`Publishing ${count} duplicate events for: ${transactionId}`);
    for (let i = 0; i < count; i++) {
      await expect(this.publishEventButton).toBeEnabled();
      await this.publishEventButton.click();
    }
  }

  async verifyDuplicateEventsReceived(transactionId) {
    await expect(this.duplicateEventCounter).toBeVisible();
    const count = await this.duplicateEventCounter.textContent();
    expect(parseInt(count)).toBeGreaterThan(1);
    logger.info(`Duplicate events received for: ${transactionId}`);
  }

  // Malformed Event Methods
  async prepareMalformedEvent(malformedData) {
    logger.info(`Preparing malformed event: ${JSON.stringify(malformedData)}`);
    await expect(this.malformedEventPanel).toBeVisible();
    
    if (malformedData.transaction_id) {
      await this.transactionIdInput.fill(malformedData.transaction_id);
    }
    
    if (malformedData.account_id) {
      await this.accountIdInput.fill(malformedData.account_id);
    }
    
    if (malformedData.card_id) {
      await this.cardIdInput.fill(malformedData.card_id);
    }
    
    if (malformedData.merchant) {
      await this.merchantInput.fill(malformedData.merchant);
    }
    
    if (malformedData.amount !== undefined) {
      await this.amountInput.fill(malformedData.amount.toString());
    }
    
    if (malformedData.currency) {
      await this.currencyInput.fill(malformedData.currency);
    }
    
    if (malformedData.timestamp) {
      await this.timestampInput.fill(malformedData.timestamp);
    }
    
    if (malformedData.channel) {
      await this.channelInput.fill(malformedData.channel);
    }
    
    await this.prepareEventButton.click();
  }

  async verifyEventMissingField(fieldName) {
    const missingIndicator = this.missingFieldIndicator(fieldName);
    await expect(missingIndicator).toBeVisible();
    logger.info(`Event missing field verified: ${fieldName}`);
  }

  async verifyEventMissingMultipleFields(missingFields) {
    for (const field of missingFields) {
      const missingIndicator = this.missingFieldIndicator(field);
      await expect(missingIndicator).toBeVisible();
    }
    logger.info(`Event missing multiple fields verified: ${missingFields.join(', ')}`);
  }

  async publishMalformedEvent(malformedData) {
    logger.info('Publishing malformed event');
    await expect(this.publishEventButton).toBeEnabled();
    await this.publishEventButton.click();
  }

  async verifyMalformedEventSent() {
    await expect(this.publishStatus).toBeVisible();
    await expect(this.publishStatus).toHaveText('sent');
    logger.info('Malformed event sent to fraud detection system');
  }

  async verifySystemAttemptsIngestion() {
    await expect(this.systemReceivedStatus).toBeVisible();
    logger.info('System attempts to ingest event');
  }

  async verifySystemValidatesEvent() {
    await expect(this.validationErrorDisplay).toBeVisible();
    logger.info('System validates event');
  }

  async verifyEventRejected(expectedError) {
    await expect(this.rejectionReasonDisplay).toBeVisible();
    await expect(this.rejectionReasonDisplay).toContainText(expectedError);
    logger.info(`Event rejected with error: ${expectedError}`);
  }

  async verifyEventRejectedMultipleFields(missingFields) {
    await expect(this.rejectionReasonDisplay).toBeVisible();
    const rejectionText = await this.rejectionReasonDisplay.textContent();
    
    for (const field of missingFields) {
      expect(rejectionText).toContain(field);
    }
    
    logger.info(`Event rejected due to multiple missing fields: ${missingFields.join(', ')}`);
  }
};