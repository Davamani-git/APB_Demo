const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.FraudAlertPage = class FraudAlertPage {
  constructor(page) {
    this.page = page;
    
    // Locators for threshold configuration
    this.thresholdConfigForm = page.locator('[data-testid="threshold-config-form"]');
    this.alertThresholdInput = page.locator('[data-testid="alert-threshold-input"]');
    this.riskBandInput = page.locator('[data-testid="risk-band-input"]');
    this.configureThresholdButton = page.locator('[data-testid="configure-threshold-button"]');
    this.thresholdConfigStatus = page.locator('[data-testid="threshold-config-status"]');
    
    // Locators for transaction simulation
    this.transactionSimulationForm = page.locator('[data-testid="transaction-simulation-form"]');
    this.transactionIdInput = page.locator('[data-testid="transaction-id-input"]');
    this.riskScoreInput = page.locator('[data-testid="risk-score-input"]');
    this.amountInput = page.locator('[data-testid="amount-input"]');
    this.merchantInput = page.locator('[data-testid="merchant-input"]');
    this.simulateTransactionButton = page.locator('[data-testid="simulate-transaction-button"]');
    this.transactionEvaluationStatus = page.locator('[data-testid="transaction-evaluation-status"]');
    
    // Locators for risk evaluation
    this.evaluateRiskButton = page.locator('[data-testid="evaluate-risk-button"]');
    this.thresholdExceededIndicator = page.locator('[data-testid="threshold-exceeded-indicator"]');
    this.transactionRiskBandDisplay = page.locator('[data-testid="transaction-risk-band-display"]');
    
    // Locators for alert details
    this.alertDetailsPanel = page.locator('[data-testid="alert-details-panel"]');
    this.alertIdDisplay = page.locator('[data-testid="alert-id-display"]');
    this.alertTransactionIdDisplay = page.locator('[data-testid="alert-transaction-id-display"]');
    this.alertSeverityDisplay = page.locator('[data-testid="alert-severity-display"]');
    this.alertStatusDisplay = page.locator('[data-testid="alert-status-display"]');
    
    // Locators for analytics and logging
    this.analyticsLogPanel = page.locator('[data-testid="analytics-log-panel"]');
    this.alertCreatedTimestamp = page.locator('[data-testid="alert-created-timestamp"]');
    this.alertCountDisplay = page.locator('[data-testid="alert-count-display"]');
    
    // Locators for transaction treatment
    this.transactionTreatmentDisplay = page.locator('[data-testid="transaction-treatment-display"]');
    this.processingCompleteIndicator = page.locator('[data-testid="processing-complete-indicator"]');
    
    // Locators for fail-safe scenarios
    this.thresholdConfigSimulation = page.locator('[data-testid="threshold-config-simulation"]');
    this.configUnavailableToggle = page.locator('[data-testid="config-unavailable-toggle"]');
    this.thresholdConfigStatusIndicator = page.locator('[data-testid="threshold-config-status-indicator"]');
    this.configUnavailabilityDetected = page.locator('[data-testid="config-unavailability-detected"]');
    this.failSafePolicyDisplay = page.locator('[data-testid="fail-safe-policy-display"]');
    this.systemLogsPanel = page.locator('[data-testid="system-logs-panel"]');
    this.configUnavailableTimestamp = page.locator('[data-testid="config-unavailable-timestamp"]');
    this.transactionProcessingStatusDisplay = page.locator('[data-testid="transaction-processing-status-display"]');
  }

  async configureAlertThreshold(thresholdConfig) {
    logger.info(`Configuring alert threshold: ${thresholdConfig.alert_threshold}, risk_band: ${thresholdConfig.risk_band}`);
    await expect(this.thresholdConfigForm).toBeVisible();
    
    await this.alertThresholdInput.fill(thresholdConfig.alert_threshold.toString());
    await this.riskBandInput.fill(thresholdConfig.risk_band);
    await this.configureThresholdButton.click();
    
    logger.info('Alert threshold configuration completed');
  }

  async simulateHighRiskTransaction(transactionData) {
    logger.info(`Simulating high-risk transaction: ${transactionData.transaction_id}`);
    await this.simulateTransaction(transactionData);
  }

  async simulateLowRiskTransaction(transactionData) {
    logger.info(`Simulating low-risk transaction: ${transactionData.transaction_id}`);
    await this.simulateTransaction(transactionData);
  }

  async simulateTransaction(transactionData) {
    await expect(this.transactionSimulationForm).toBeVisible();
    
    await this.transactionIdInput.fill(transactionData.transaction_id);
    await this.riskScoreInput.fill(transactionData.risk_score.toString());
    await this.amountInput.fill(transactionData.amount.toString());
    await this.merchantInput.fill(transactionData.merchant);
    await this.simulateTransactionButton.click();
    
    logger.info(`Transaction ${transactionData.transaction_id} simulated`);
  }

  async evaluateRiskAgainstThreshold() {
    logger.info('Evaluating risk score against configured threshold');
    await expect(this.evaluateRiskButton).toBeEnabled();
    await this.evaluateRiskButton.click();
    logger.info('Risk evaluation completed');
  }

  async isThresholdExceeded() {
    await expect(this.thresholdExceededIndicator).toBeVisible();
    const indicatorText = await this.thresholdExceededIndicator.textContent();
    const exceeded = indicatorText.toLowerCase().includes('true') || indicatorText.toLowerCase().includes('exceeded');
    logger.info(`Threshold exceeded: ${exceeded}`);
    return exceeded;
  }

  async getTransactionRiskBand() {
    await expect(this.transactionRiskBandDisplay).toBeVisible();
    const riskBand = await this.transactionRiskBandDisplay.textContent();
    logger.info(`Transaction risk band: ${riskBand}`);
    return riskBand;
  }

  async waitForAlertCreation() {
    logger.info('Waiting for alert creation');
    await expect(this.alertDetailsPanel).toBeVisible({ timeout: 10000 });
    logger.info('Alert created successfully');
  }

  async getAlertDetails() {
    await expect(this.alertDetailsPanel).toBeVisible();
    
    const alertId = await this.alertIdDisplay.textContent();
    const transactionId = await this.alertTransactionIdDisplay.textContent();
    const severity = await this.alertSeverityDisplay.textContent();
    const status = await this.alertStatusDisplay.textContent();
    
    const alertDetails = {
      alert_id: alertId,
      transaction_id: transactionId,
      severity: severity,
      status: status
    };
    
    logger.info(`Alert details retrieved: ${JSON.stringify(alertDetails)}`);
    return alertDetails;
  }

  async getAnalyticsLog() {
    await expect(this.analyticsLogPanel).toBeVisible();
    const log = await this.analyticsLogPanel.textContent();
    logger.info('Analytics log retrieved');
    return log;
  }

  async getAlertCount() {
    await expect(this.alertCountDisplay).toBeVisible();
    const countText = await this.alertCountDisplay.textContent();
    const count = parseInt(countText);
    logger.info(`Current alert count: ${count}`);
    return count;
  }

  async waitForProcessingComplete() {
    logger.info('Waiting for transaction processing to complete');
    await expect(this.processingCompleteIndicator).toBeVisible({ timeout: 5000 });
    logger.info('Transaction processing completed');
  }

  async getTransactionTreatment() {
    await expect(this.transactionTreatmentDisplay).toBeVisible();
    const treatment = await this.transactionTreatmentDisplay.textContent();
    logger.info(`Transaction treatment: ${treatment}`);
    return treatment;
  }

  async getAnalyticsLogForTransaction(transactionId) {
    await expect(this.analyticsLogPanel).toBeVisible();
    const log = await this.analyticsLogPanel.textContent();
    logger.info(`Analytics log for transaction ${transactionId} retrieved`);
    return log;
  }

  async simulateThresholdConfigUnavailable() {
    logger.info('Simulating threshold configuration unavailability');
    await expect(this.thresholdConfigSimulation).toBeVisible();
    await this.configUnavailableToggle.click();
    await this.page.waitForTimeout(1000); // Allow simulation to take effect
    logger.info('Threshold configuration unavailability simulated');
  }

  async getThresholdConfigStatus() {
    await expect(this.thresholdConfigStatusIndicator).toBeVisible();
    const status = await this.thresholdConfigStatusIndicator.textContent();
    logger.info(`Threshold configuration status: ${status}`);
    return status;
  }

  async attemptRiskEvaluation() {
    logger.info('Attempting risk evaluation with unavailable configuration');
    await expect(this.evaluateRiskButton).toBeEnabled();
    await this.evaluateRiskButton.click();
    logger.info('Risk evaluation attempted');
  }

  async getAppliedFailSafePolicy() {
    await expect(this.failSafePolicyDisplay).toBeVisible();
    const policy = await this.failSafePolicyDisplay.textContent();
    logger.info(`Applied fail-safe policy: ${policy}`);
    return policy;
  }

  async checkForUnintendedAlert(transactionId) {
    const analyticsLog = await this.getAnalyticsLogForTransaction(transactionId);
    const hasUnintendedAlert = analyticsLog.includes('unintended_alert') || analyticsLog.includes('error_alert');
    logger.info(`Unintended alert check for ${transactionId}: ${hasUnintendedAlert}`);
    return hasUnintendedAlert;
  }

  async isTransactionBlocked(transactionId) {
    const processingStatus = await this.getTransactionProcessingStatus(transactionId);
    const blocked = processingStatus === 'blocked' || processingStatus === 'declined';
    logger.info(`Transaction ${transactionId} blocked: ${blocked}`);
    return blocked;
  }

  async getSystemLogs() {
    await expect(this.systemLogsPanel).toBeVisible();
    const logs = await this.systemLogsPanel.textContent();
    logger.info('System logs retrieved');
    return logs;
  }

  async getTransactionProcessingStatus(transactionId) {
    await expect(this.transactionProcessingStatusDisplay).toBeVisible();
    const status = await this.transactionProcessingStatusDisplay.textContent();
    logger.info(`Transaction ${transactionId} processing status: ${status}`);
    return status;
  }
};
