const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.RiskEvaluationPage = class RiskEvaluationPage {
  constructor(page) {
    this.page = page;
    this.transactionSearchInput = page.locator('#transaction-search');
    this.searchButton = page.locator('button[data-testid="search-transaction"]');
    this.riskScoreDisplay = page.locator('.risk-score-value');
    this.riskBandDisplay = page.locator('.risk-band-value');
    this.decisionDisplay = page.locator('.decision-value');
    this.processingTimeDisplay = page.locator('.processing-time');
    this.riskDecisionRecord = page.locator('.risk-decision-record');
    this.decisionIdDisplay = page.locator('.decision-id');
    this.modelVersionDisplay = page.locator('.model-version');
    this.riskSignalsDisplay = page.locator('.risk-signals');
    this.incompleteDataIndicator = page.locator('.incomplete-data-indicator');
    this.failSafePolicyDisplay = page.locator('.fail-safe-policy');
    this.invalidDataIndicator = page.locator('.invalid-data-indicator');
    this.missingFieldsDisplay = page.locator('.missing-fields');
    this.engineStatusDisplay = page.locator('.engine-status');
    this.pipelineStatusDisplay = page.locator('.pipeline-status');
    this.engineControlPanel = page.locator('.engine-control-panel');
    this.simulateUnavailableButton = page.locator('button[data-testid="simulate-unavailable"]');
    this.simulateTimeoutButton = page.locator('button[data-testid="simulate-timeout"]');
    this.timeoutThresholdInput = page.locator('#timeout-threshold');
    this.simulatedResponseTimeInput = page.locator('#simulated-response-time');
  }

  async navigate() {
    logger.info('Navigating to Risk Evaluation page');
    await this.page.goto('/fraud-alert/risk-evaluation');
    await expect(this.page).toHaveURL(/.*risk-evaluation/);
  }

  async searchTransaction(transactionId) {
    logger.info(`Searching for transaction: ${transactionId}`);
    await expect(this.transactionSearchInput).toBeVisible();
    await this.transactionSearchInput.fill(transactionId);
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }

  async verifyRiskScoreCalculated(transactionId, expectedScore, expectedBand) {
    logger.info(`Verifying risk score calculated for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.riskScoreDisplay).toBeVisible();
    await expect(this.riskScoreDisplay).toContainText(expectedScore);
    await expect(this.riskBandDisplay).toContainText(expectedBand);
  }

  async evaluateRiskSignals(transactionId, avgTransaction, currentTransaction, homeLocation, transactionLocation) {
    logger.info(`Evaluating risk signals for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.riskSignalsDisplay).toBeVisible();
  }

  async verifyRiskScoreWithinSLA(transactionId, expectedScore, expectedBand, expectedDecision, processingTime) {
    logger.info(`Verifying risk score within SLA for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.riskScoreDisplay).toBeVisible();
    await expect(this.riskScoreDisplay).toContainText(expectedScore);
    await expect(this.riskBandDisplay).toContainText(expectedBand);
    await expect(this.decisionDisplay).toContainText(expectedDecision);
    await expect(this.processingTimeDisplay).toBeVisible();
    const actualProcessingTime = await this.processingTimeDisplay.textContent();
    const timeValue = parseInt(actualProcessingTime.replace('ms', ''));
    expect(timeValue).toBeLessThan(500);
  }

  async verifyRiskDecisionRecord(decisionId, transactionId, riskScore, riskBand, modelVersion, decision) {
    logger.info(`Verifying risk decision record: ${decisionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.riskDecisionRecord).toBeVisible();
    await expect(this.decisionIdDisplay).toContainText(decisionId);
    await expect(this.riskScoreDisplay).toContainText(riskScore);
    await expect(this.riskBandDisplay).toContainText(riskBand);
    if (modelVersion) {
      await expect(this.modelVersionDisplay).toContainText(modelVersion);
    }
    await expect(this.decisionDisplay).toContainText(decision);
  }

  async verifyRiskDecisionWithSignals(decisionId, transactionId, riskScore, riskBand, signals, decision) {
    logger.info(`Verifying risk decision with signals: ${decisionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.riskDecisionRecord).toBeVisible();
    await expect(this.decisionIdDisplay).toContainText(decisionId);
    await expect(this.riskScoreDisplay).toContainText(riskScore);
    await expect(this.riskBandDisplay).toContainText(riskBand);
    await expect(this.riskSignalsDisplay).toContainText(signals);
    await expect(this.decisionDisplay).toContainText(decision);
  }

  async evaluateVelocitySignals(transactionId, transactionCount, failedAttempts, normalVelocity) {
    logger.info(`Evaluating velocity signals for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.riskSignalsDisplay).toBeVisible();
  }

  async evaluateNormalRiskSignals(transactionId, avgTransaction, currentTransaction, merchantType, locationType, velocityType) {
    logger.info(`Evaluating normal risk signals for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.riskSignalsDisplay).toBeVisible();
  }

  async verifyIncompleteDataDetected(transactionId, missingField) {
    logger.info(`Verifying incomplete data detected for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.incompleteDataIndicator).toBeVisible();
    await expect(this.missingFieldsDisplay).toContainText(missingField);
  }

  async verifyFailSafePolicyApplied(transactionId, failSafeAction) {
    logger.info(`Verifying fail-safe policy applied for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.failSafePolicyDisplay).toBeVisible();
    await expect(this.failSafePolicyDisplay).toContainText(failSafeAction);
  }

  async verifyNoInvalidRiskScore(transactionId, status) {
    logger.info(`Verifying no invalid risk score for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.riskDecisionRecord).toBeVisible();
    const riskScoreText = await this.riskScoreDisplay.textContent();
    expect(riskScoreText).toMatch(/null|N\/A|fail-safe/);
  }

  async verifyInvalidDataDetected(transactionId, invalidField) {
    logger.info(`Verifying invalid data detected for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.invalidDataIndicator).toBeVisible();
    await expect(this.invalidDataIndicator).toContainText(invalidField);
  }

  async verifyMultipleMissingFields(transactionId, missingFields) {
    logger.info(`Verifying multiple missing fields for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.incompleteDataIndicator).toBeVisible();
    await expect(this.missingFieldsDisplay).toContainText(missingFields);
  }

  async simulateEngineUnavailability() {
    logger.info('Simulating fraud-risk engine unavailability');
    await expect(this.engineControlPanel).toBeVisible();
    await expect(this.simulateUnavailableButton).toBeEnabled();
    await this.simulateUnavailableButton.click();
    await expect(this.engineStatusDisplay).toContainText('unavailable');
  }

  async simulateEngineTimeout(thresholdMs, responseTimeMs) {
    logger.info('Simulating fraud-risk engine timeout');
    await expect(this.engineControlPanel).toBeVisible();
    await this.timeoutThresholdInput.fill(thresholdMs);
    await this.simulatedResponseTimeInput.fill(responseTimeMs);
    await expect(this.simulateTimeoutButton).toBeEnabled();
    await this.simulateTimeoutButton.click();
  }

  async verifyEngineUnavailabilityDetected(transactionId, timeoutMs) {
    logger.info(`Verifying engine unavailability detected for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.engineStatusDisplay).toBeVisible();
    await expect(this.engineStatusDisplay).toContainText('unavailable');
  }

  async verifyEngineTimeout(transactionId, timeoutMs) {
    logger.info(`Verifying engine timeout for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.engineStatusDisplay).toBeVisible();
    await expect(this.engineStatusDisplay).toContainText('timeout');
  }

  async verifyTransactionSpecificFailSafe(transactionId, failSafeAction, transactionAmount) {
    logger.info(`Verifying transaction-specific fail-safe for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.failSafePolicyDisplay).toBeVisible();
    await expect(this.failSafePolicyDisplay).toContainText(failSafeAction);
  }

  async verifyPipelineNotBlocked(transactionId) {
    logger.info(`Verifying pipeline not blocked for: ${transactionId}`);
    await this.searchTransaction(transactionId);
    await expect(this.pipelineStatusDisplay).toBeVisible();
    await expect(this.pipelineStatusDisplay).toContainText('processed');
    const blockedText = await this.pipelineStatusDisplay.textContent();
    expect(blockedText).not.toContain('blocked');
  }

  async verifyBothTransactionsProcessed(transactionId1, status1, transactionId2, status2) {
    logger.info(`Verifying both transactions processed: ${transactionId1} and ${transactionId2}`);
    await this.searchTransaction(transactionId1);
    await expect(this.failSafePolicyDisplay).toContainText(status1);
    await this.searchTransaction(transactionId2);
    await expect(this.failSafePolicyDisplay).toContainText(status2);
  }
};
