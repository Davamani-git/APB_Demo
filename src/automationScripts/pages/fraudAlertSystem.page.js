const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.FraudAlertSystemPage = class FraudAlertSystemPage {
  constructor(page) {
    this.page = page;
    
    // Transaction input fields
    this.transactionIdInput = page.locator('#transaction-id');
    this.cardIdInput = page.locator('#card-id');
    this.amountInput = page.locator('#amount');
    this.currencyInput = page.locator('#currency');
    this.merchantInput = page.locator('#merchant');
    this.timestampInput = page.locator('#timestamp');
    this.locationInput = page.locator('#location');
    this.submitTransactionButton = page.locator('#submit-transaction');
    
    // Transaction status and results
    this.transactionReceivedStatus = page.locator('[data-testid="transaction-received"]');
    this.riskEngineProcessingStatus = page.locator('[data-testid="risk-engine-processing"]');
    this.riskScoreDisplay = page.locator('[data-testid="risk-score"]');
    this.riskDecisionDisplay = page.locator('[data-testid="risk-decision"]');
    this.actionDisplay = page.locator('[data-testid="action"]');
    this.riskSignalsDisplay = page.locator('[data-testid="risk-signals"]');
    
    // Error handling elements
    this.validationErrorMessage = page.locator('[data-testid="validation-error"]');
    this.missingFieldError = page.locator('[data-testid="missing-field-error"]');
    this.malformedDataError = page.locator('[data-testid="malformed-data-error"]');
    this.failSafeDecisionDisplay = page.locator('[data-testid="fail-safe-decision"]');
    this.errorLogDisplay = page.locator('[data-testid="error-log"]');
    this.systemOperationalStatus = page.locator('[data-testid="system-operational"]');
    
    // Concurrent processing elements
    this.batchTransactionInput = page.locator('#batch-transactions');
    this.submitBatchButton = page.locator('#submit-batch');
    this.processingTimeDisplay = page.locator('[data-testid="processing-time"]');
    this.transactionResultsList = page.locator('[data-testid="transaction-results"]');
    this.velocityIndicator = page.locator('[data-testid="velocity-detected"]');
    
    // Login and authentication
    this.usernameInput = page.locator('#username');
    this.roleInput = page.locator('#role');
    this.loginButton = page.locator('#login-button');
    this.authenticationStatus = page.locator('[data-testid="auth-status"]');
    
    // Threshold configuration
    this.thresholdConfigLink = page.locator('a[href*="threshold"]');
    this.currentThresholdDisplay = page.locator('[data-testid="current-threshold"]');
    this.thresholdInput = page.locator('#threshold-value');
    this.updateThresholdButton = page.locator('#update-threshold');
    this.thresholdUpdateConfirmation = page.locator('[data-testid="threshold-update-confirmation"]');
    this.serviceStatusDisplay = page.locator('[data-testid="service-status"]');
    this.serviceUptimeDisplay = page.locator('[data-testid="service-uptime"]');
    this.configPersistenceStatus = page.locator('[data-testid="config-persisted"]');
    
    // Alert management
    this.alertTriggeredIndicator = page.locator('[data-testid="alert-triggered"]');
    this.alertDetailsDisplay = page.locator('[data-testid="alert-details"]');
    this.alertCountDisplay = page.locator('[data-testid="alert-count"]');
    this.testTransactionButton = page.locator('#submit-test-transaction');
    
    // Access control
    this.accessDeniedMessage = page.locator('[data-testid="access-denied"]');
    this.authorizationErrorMessage = page.locator('[data-testid="authorization-error"]');
    this.loginRedirectIndicator = page.locator('[data-testid="login-redirect"]');
    this.readOnlyModeIndicator = page.locator('[data-testid="read-only-mode"]');
    this.auditLogDisplay = page.locator('[data-testid="audit-log"]');
  }

  async navigate() {
    logger.info('Navigating to Fraud Alert System page');
    await this.page.goto('/fraud-alert-system');
    await expect(this.page).toHaveURL(/.*fraud-alert-system/);
  }

  async prepareTransaction(transactionData) {
    logger.info(`Preparing transaction: ${JSON.stringify(transactionData)}`);
    
    if (transactionData.transaction_id !== null) {
      await this.transactionIdInput.waitFor({ state: 'visible' });
      await this.transactionIdInput.fill(transactionData.transaction_id);
    }
    
    if (transactionData.card_id) {
      await this.cardIdInput.fill(transactionData.card_id);
    }
    
    if (transactionData.amount !== null && transactionData.amount !== undefined) {
      await this.amountInput.fill(String(transactionData.amount));
    }
    
    if (transactionData.currency) {
      await this.currencyInput.fill(transactionData.currency);
    }
    
    if (transactionData.merchant) {
      await this.merchantInput.fill(transactionData.merchant);
    }
    
    if (transactionData.timestamp) {
      await this.timestampInput.fill(transactionData.timestamp);
    }
    
    if (transactionData.location) {
      await this.locationInput.fill(transactionData.location);
    }
    
    logger.info('Transaction data prepared');
  }

  async submitTransaction(identifier) {
    logger.info(`Submitting transaction: ${identifier}`);
    await this.submitTransactionButton.waitFor({ state: 'visible' });
    await this.submitTransactionButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTransactionReceived() {
    logger.info('Verifying transaction received by authorization platform');
    await this.transactionReceivedStatus.waitFor({ state: 'visible' });
    await expect(this.transactionReceivedStatus).toContainText('Transaction received');
  }

  async verifyRiskEngineProcessing(riskSignals) {
    logger.info(`Verifying risk engine processes transaction with signals: ${riskSignals.join(', ')}`);
    await this.riskEngineProcessingStatus.waitFor({ state: 'visible' });
    await expect(this.riskEngineProcessingStatus).toContainText('Risk engine processing');
    
    for (const signal of riskSignals) {
      await expect(this.riskSignalsDisplay).toContainText(signal);
    }
  }

  async verifyRiskScoreCalculated(minScore, maxScore) {
    logger.info(`Verifying risk score calculated in range: ${minScore}-${maxScore}`);
    await this.riskScoreDisplay.waitFor({ state: 'visible' });
    const scoreText = await this.riskScoreDisplay.textContent();
    const score = parseInt(scoreText.match(/\d+/)[0]);
    
    expect(score).toBeGreaterThanOrEqual(minScore);
    expect(score).toBeLessThanOrEqual(maxScore);
    logger.info(`Risk score: ${score}`);
  }

  async verifyRiskDecision(expectedDecision, expectedAction) {
    logger.info(`Verifying risk decision: ${expectedDecision}, action: ${expectedAction}`);
    await this.riskDecisionDisplay.waitFor({ state: 'visible' });
    await expect(this.riskDecisionDisplay).toContainText(expectedDecision);
    await expect(this.actionDisplay).toContainText(expectedAction);
  }

  async verifyMissingFieldDetected(fieldName) {
    logger.info(`Verifying missing field detected: ${fieldName}`);
    await this.missingFieldError.waitFor({ state: 'visible' });
    await expect(this.missingFieldError).toContainText(`Missing required field - ${fieldName}`);
  }

  async verifyMalformedDataDetected() {
    logger.info('Verifying malformed data detected');
    await this.malformedDataError.waitFor({ state: 'visible' });
    await expect(this.malformedDataError).toContainText('Data validation failure');
  }

  async verifyFailSafeDecisionApplied(expectedPolicy) {
    logger.info(`Verifying fail-safe decision applied: ${expectedPolicy}`);
    await this.failSafeDecisionDisplay.waitFor({ state: 'visible' });
    await expect(this.failSafeDecisionDisplay).toContainText(expectedPolicy);
  }

  async verifyErrorLogged() {
    logger.info('Verifying error logged in audit trail');
    await this.errorLogDisplay.waitFor({ state: 'visible' });
    await expect(this.errorLogDisplay).toContainText('Error recorded');
    await expect(this.systemOperationalStatus).toContainText('operational');
  }

  async prepareMultipleTransactions(transactions) {
    logger.info(`Preparing ${transactions.length} transactions`);
    const transactionJson = JSON.stringify(transactions);
    await this.batchTransactionInput.waitFor({ state: 'visible' });
    await this.batchTransactionInput.fill(transactionJson);
  }

  async submitMultipleTransactionsSimultaneously(transactions, timestamp) {
    logger.info(`Submitting ${transactions.length} transactions simultaneously at ${timestamp}`);
    await this.submitBatchButton.waitFor({ state: 'visible' });
    await this.submitBatchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyIndependentProcessing(transactions) {
    logger.info('Verifying independent processing of transactions');
    await this.transactionResultsList.waitFor({ state: 'visible' });
    
    for (const txn of transactions) {
      const resultRow = this.page.locator(`[data-transaction-id="${txn.transaction_id}"]`);
      await expect(resultRow).toBeVisible();
      await expect(resultRow).toContainText(txn.card_id);
    }
  }

  async verifyIndividualRiskScores(scoreExpectations) {
    logger.info('Verifying individual risk scores');
    
    for (const expectation of scoreExpectations) {
      const scoreElement = this.page.locator(`[data-transaction-id="${expectation.transaction_id}"] [data-field="risk-score"]`);
      await expect(scoreElement).toBeVisible();
      const scoreText = await scoreElement.textContent();
      const score = parseInt(scoreText.match(/\d+/)[0]);
      
      logger.info(`Transaction ${expectation.transaction_id}: score=${score}, expected~${expectation.expectedScore}`);
      expect(Math.abs(score - expectation.expectedScore)).toBeLessThanOrEqual(15);
    }
  }

  async verifyIndependentRiskDecisions(decisionExpectations) {
    logger.info('Verifying independent risk decisions');
    
    for (const expectation of decisionExpectations) {
      const decisionElement = this.page.locator(`[data-transaction-id="${expectation.transaction_id}"] [data-field="decision"]`);
      await expect(decisionElement).toBeVisible();
      await expect(decisionElement).toContainText(expectation.decision.split('/')[0]);
    }
  }

  async verifyProcessingTime(maxTimeMs) {
    logger.info(`Verifying processing time < ${maxTimeMs}ms`);
    await this.processingTimeDisplay.waitFor({ state: 'visible' });
    const timeText = await this.processingTimeDisplay.textContent();
    const time = parseInt(timeText.match(/\d+/)[0]);
    
    expect(time).toBeLessThan(maxTimeMs);
    logger.info(`Processing time: ${time}ms`);
  }

  async submitRapidSequenceTransactions(transactions, intervalSeconds) {
    logger.info(`Submitting ${transactions.length} transactions in rapid sequence (${intervalSeconds}s interval)`);
    await this.submitBatchButton.waitFor({ state: 'visible' });
    await this.submitBatchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyVelocityDetection() {
    logger.info('Verifying velocity detection');
    await this.velocityIndicator.waitFor({ state: 'visible' });
    await expect(this.velocityIndicator).toContainText('velocity detected');
  }

  async verifyNoCrossContamination(expectedCount) {
    logger.info(`Verifying no cross-contamination for ${expectedCount} transactions`);
    const decisionRecords = this.page.locator('[data-testid="decision-record"]');
    await expect(decisionRecords).toHaveCount(expectedCount);
    
    const decisionIds = await decisionRecords.evaluateAll(elements => 
      elements.map(el => el.getAttribute('data-decision-id'))
    );
    
    const uniqueIds = new Set(decisionIds);
    expect(uniqueIds.size).toBe(expectedCount);
  }

  async prepareLargeTransactionBatch(count) {
    logger.info(`Preparing large batch of ${count} transactions`);
    const transactions = [];
    
    for (let i = 1; i <= count; i++) {
      transactions.push({
        transaction_id: `TXN_BATCH_${i}`,
        card_id: `CARD_${i % 10}`,
        amount: Math.floor(Math.random() * 3000) + 10,
        merchant: `Merchant_${i % 20}`
      });
    }
    
    await this.batchTransactionInput.fill(JSON.stringify(transactions));
  }

  async submitHighVolumeTransactions(count, timestamp) {
    logger.info(`Submitting high volume of ${count} transactions at ${timestamp}`);
    await this.submitBatchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAllTransactionsProcessedIndependently(count) {
    logger.info(`Verifying all ${count} transactions processed independently`);
    const results = this.page.locator('[data-testid="transaction-result"]');
    await expect(results).toHaveCount(count);
  }

  async verifyAllRiskScoresCalculated(count) {
    logger.info(`Verifying all ${count} risk scores calculated`);
    const scores = this.page.locator('[data-field="risk-score"]');
    await expect(scores).toHaveCount(count);
  }

  async verifyAllRiskDecisionsMapped(count) {
    logger.info(`Verifying all ${count} risk decisions mapped`);
    const decisions = this.page.locator('[data-field="decision"]');
    await expect(decisions).toHaveCount(count);
  }

  async verifyAverageProcessingTime(avgMaxMs, maxIndividualMs) {
    logger.info(`Verifying average processing time < ${avgMaxMs}ms, max individual < ${maxIndividualMs}ms`);
    const avgTimeElement = this.page.locator('[data-testid="avg-processing-time"]');
    const maxTimeElement = this.page.locator('[data-testid="max-processing-time"]');
    
    await expect(avgTimeElement).toBeVisible();
    await expect(maxTimeElement).toBeVisible();
    
    const avgTime = parseInt(await avgTimeElement.textContent());
    const maxTime = parseInt(await maxTimeElement.textContent());
    
    expect(avgTime).toBeLessThan(avgMaxMs);
    expect(maxTime).toBeLessThan(maxIndividualMs);
  }

  async login(username, role) {
    logger.info(`Logging in as ${username} with role ${role}`);
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
    await this.roleInput.fill(role);
    await this.loginButton.click();
    await this.authenticationStatus.waitFor({ state: 'visible' });
    await expect(this.authenticationStatus).toContainText('authenticated');
  }

  async navigateToThresholdConfig() {
    logger.info('Navigating to threshold configuration page');
    await this.thresholdConfigLink.waitFor({ state: 'visible' });
    await this.thresholdConfigLink.click();
    await this.currentThresholdDisplay.waitFor({ state: 'visible' });
  }

  async verifyCurrentThreshold(expectedThreshold) {
    logger.info(`Verifying current threshold: ${expectedThreshold}`);
    await this.currentThresholdDisplay.waitFor({ state: 'visible' });
    await expect(this.currentThresholdDisplay).toContainText(String(expectedThreshold));
  }

  async updateThreshold(oldValue, newValue) {
    logger.info(`Updating threshold from ${oldValue} to ${newValue}`);
    await this.thresholdInput.waitFor({ state: 'visible' });
    await this.thresholdInput.clear();
    await this.thresholdInput.fill(String(newValue));
  }

  async submitThresholdUpdate(newValue) {
    logger.info(`Submitting threshold update: ${newValue}`);
    await this.updateThresholdButton.waitFor({ state: 'visible' });
    await this.updateThresholdButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyThresholdUpdateSuccess(newValue) {
    logger.info(`Verifying threshold update success: ${newValue}`);
    await this.thresholdUpdateConfirmation.waitFor({ state: 'visible' });
    await expect(this.thresholdUpdateConfirmation).toContainText(`Threshold updated successfully to ${newValue}`);
    await expect(this.currentThresholdDisplay).toContainText(String(newValue));
  }

  async verifyNoServiceInterruption() {
    logger.info('Verifying no service interruption occurred');
    await this.serviceUptimeDisplay.waitFor({ state: 'visible' });
    await expect(this.serviceUptimeDisplay).toContainText('continuous');
    await expect(this.serviceStatusDisplay).toContainText('operational');
  }

  async verifyServicesRunningWithoutRestart() {
    logger.info('Verifying services running without restart');
    await this.serviceStatusDisplay.waitFor({ state: 'visible' });
    await expect(this.serviceStatusDisplay).toContainText('Running');
    
    const lastRestartElement = this.page.locator('[data-testid="last-restart"]');
    await expect(lastRestartElement).toContainText('No recent restart');
  }

  async verifyTransactionProcessingContinues() {
    logger.info('Verifying transaction processing continues');
    const processingRateElement = this.page.locator('[data-testid="processing-rate"]');
    await expect(processingRateElement).toBeVisible();
    await expect(processingRateElement).toContainText('Maintained');
  }

  async verifyConfigurationPersisted(expectedValue) {
    logger.info(`Verifying configuration persisted: ${expectedValue}`);
    await this.configPersistenceStatus.waitFor({ state: 'visible' });
    await expect(this.configPersistenceStatus).toContainText(String(expectedValue));
  }

  async verifyFinalThreshold(expectedValue) {
    logger.info(`Verifying final threshold value: ${expectedValue}`);
    await this.currentThresholdDisplay.waitFor({ state: 'visible' });
    await expect(this.currentThresholdDisplay).toContainText(String(expectedValue));
  }

  async verifySystemStability() {
    logger.info('Verifying system stability');
    const stabilityElement = this.page.locator('[data-testid="system-stability"]');
    await expect(stabilityElement).toBeVisible();
    await expect(stabilityElement).toContainText('Stable');
    await expect(this.serviceStatusDisplay).toContainText('operational');
  }

  async submitTestTransaction(transactionId, riskScore) {
    logger.info(`Submitting test transaction ${transactionId} with risk score ${riskScore}`);
    const testTxnIdInput = this.page.locator('#test-transaction-id');
    const testRiskScoreInput = this.page.locator('#test-risk-score');
    
    await testTxnIdInput.fill(transactionId);
    await testRiskScoreInput.fill(String(riskScore));
    await this.testTransactionButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAlertTriggered(transactionId) {
    logger.info(`Verifying alert triggered for transaction ${transactionId}`);
    const alertElement = this.page.locator(`[data-transaction-id="${transactionId}"] [data-testid="alert-triggered"]`);
    await expect(alertElement).toBeVisible();
    await expect(alertElement).toContainText('Alert created');
  }

  async verifyAlertNotTriggered(transactionId) {
    logger.info(`Verifying alert NOT triggered for transaction ${transactionId}`);
    const noAlertElement = this.page.locator(`[data-transaction-id="${transactionId}"] [data-testid="no-alert"]`);
    await expect(noAlertElement).toBeVisible();
    await expect(noAlertElement).toContainText('No alert');
  }

  async verifyImmediateThresholdEffect() {
    logger.info('Verifying immediate threshold effect');
    const effectTimeElement = this.page.locator('[data-testid="threshold-effect-time"]');
    await expect(effectTimeElement).toBeVisible();
    const effectTime = await effectTimeElement.textContent();
    expect(effectTime).toContain('< 1 second');
  }

  async verifyAlertDetails(transactionId, riskScore, severity) {
    logger.info(`Verifying alert details for ${transactionId}`);
    const alertDetailsElement = this.page.locator(`[data-transaction-id="${transactionId}"] [data-testid="alert-details"]`);
    await expect(alertDetailsElement).toBeVisible();
    await expect(alertDetailsElement).toContainText(transactionId);
    await expect(alertDetailsElement).toContainText(String(riskScore));
    await expect(alertDetailsElement).toContainText(severity);
  }

  async verifyThresholdRulesApplied(riskScore, threshold) {
    logger.info(`Verifying threshold rules: ${riskScore} > ${threshold}`);
    const comparisonElement = this.page.locator('[data-testid="threshold-comparison"]');
    await expect(comparisonElement).toBeVisible();
    await expect(comparisonElement).toContainText(`${riskScore} > ${threshold}`);
  }

  async submitMultipleTestTransactions(transactions) {
    logger.info(`Submitting ${transactions.length} test transactions`);
    
    for (const txn of transactions) {
      await this.submitTestTransaction(txn.transaction_id, txn.risk_score);
    }
  }

  async verifyNoAlertsTriggered(count) {
    logger.info(`Verifying no alerts triggered for ${count} transactions`);
    await this.alertCountDisplay.waitFor({ state: 'visible' });
    await expect(this.alertCountDisplay).toContainText('0');
  }

  async verifyTransactionsApproved(transactionIds) {
    logger.info(`Verifying transactions approved: ${transactionIds.join(', ')}`);
    
    for (const txnId of transactionIds) {
      const approvalElement = this.page.locator(`[data-transaction-id="${txnId}"] [data-field="status"]`);
      await expect(approvalElement).toContainText('approved');
    }
  }

  async verifyConsistentThresholdApplication(threshold) {
    logger.info(`Verifying consistent threshold application: ${threshold}`);
    const validationElement = this.page.locator('[data-testid="threshold-validation"]');
    await expect(validationElement).toBeVisible();
    await expect(validationElement).toContainText(`All scores < ${threshold}`);
  }

  async attemptNavigateToThresholdConfig() {
    logger.info('Attempting to navigate to threshold config (unauthorized)');
    await this.thresholdConfigLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAccessDenied() {
    logger.info('Verifying access denied');
    await this.accessDeniedMessage.waitFor({ state: 'visible' });
    await expect(this.accessDeniedMessage).toContainText('Access denied');
  }

  async attemptDirectAPICall(endpoint, method, payload) {
    logger.info(`Attempting direct API call: ${method} ${endpoint}`);
    const apiButton = this.page.locator('#api-test-call');
    const apiEndpointInput = this.page.locator('#api-endpoint');
    const apiMethodInput = this.page.locator('#api-method');
    const apiPayloadInput = this.page.locator('#api-payload');
    
    await apiEndpointInput.fill(endpoint);
    await apiMethodInput.fill(method);
    await apiPayloadInput.fill(JSON.stringify(payload));
    await apiButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAuthorizationError(statusCode, errorMessage) {
    logger.info(`Verifying authorization error: ${statusCode} - ${errorMessage}`);
    await this.authorizationErrorMessage.waitFor({ state: 'visible' });
    await expect(this.authorizationErrorMessage).toContainText(String(statusCode));
    await expect(this.authorizationErrorMessage).toContainText(errorMessage);
  }

  async verifyThresholdUnchanged(expectedValue) {
    logger.info(`Verifying threshold unchanged: ${expectedValue}`);
    await this.currentThresholdDisplay.waitFor({ state: 'visible' });
    await expect(this.currentThresholdDisplay).toContainText(String(expectedValue));
  }

  async verifyUnauthorizedAccessLogged(username) {
    logger.info(`Verifying unauthorized access logged for ${username}`);
    await this.auditLogDisplay.waitFor({ state: 'visible' });
    await expect(this.auditLogDisplay).toContainText(`Unauthorized access attempt by ${username}`);
  }

  async attemptAccessWithoutAuth(url) {
    logger.info(`Attempting access without authentication: ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRedirectToLogin() {
    logger.info('Verifying redirect to login page');
    await this.loginRedirectIndicator.waitFor({ state: 'visible' });
    await expect(this.page).toHaveURL(/.*login/);
  }

  async attemptAPICallWithoutAuth(endpoint, method) {
    logger.info(`Attempting API call without auth: ${method} ${endpoint}`);
    const apiButton = this.page.locator('#api-test-call-noauth');
    const apiEndpointInput = this.page.locator('#api-endpoint-noauth');
    const apiMethodInput = this.page.locator('#api-method-noauth');
    
    await apiEndpointInput.fill(endpoint);
    await apiMethodInput.fill(method);
    await apiButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAuthenticationError(statusCode, errorMessage) {
    logger.info(`Verifying authentication error: ${statusCode} - ${errorMessage}`);
    const authErrorElement = this.page.locator('[data-testid="authentication-error"]');
    await expect(authErrorElement).toBeVisible();
    await expect(authErrorElement).toContainText(String(statusCode));
    await expect(authErrorElement).toContainText(errorMessage);
  }

  async verifyUnauthenticatedAccessLogged() {
    logger.info('Verifying unauthenticated access logged');
    await this.auditLogDisplay.waitFor({ state: 'visible' });
    await expect(this.auditLogDisplay).toContainText('Unauthenticated access attempt');
  }

  async verifyReadOnlyMode(currentThreshold) {
    logger.info(`Verifying read-only mode with threshold ${currentThreshold}`);
    await this.readOnlyModeIndicator.waitFor({ state: 'visible' });
    await expect(this.readOnlyModeIndicator).toBeVisible();
    await expect(this.currentThresholdDisplay).toContainText(String(currentThreshold));
    await expect(this.thresholdInput).toBeDisabled();
  }

  async attemptModifyThreshold(newValue) {
    logger.info(`Attempting to modify threshold to ${newValue} (should be prevented)`);
    const isDisabled = await this.thresholdInput.isDisabled();
    
    if (!isDisabled) {
      await this.thresholdInput.fill(String(newValue));
      await this.updateThresholdButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async verifyModificationPrevented() {
    logger.info('Verifying modification prevented');
    const preventionMessage = this.page.locator('[data-testid="modification-prevented"]');
    await expect(preventionMessage).toBeVisible();
    await expect(preventionMessage).toContainText('modification not permitted');
  }

  async attemptAPICall(endpoint, method, payload) {
    logger.info(`Attempting API call: ${method} ${endpoint}`);
    await this.attemptDirectAPICall(endpoint, method, payload);
  }
};
