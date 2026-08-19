const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.FraudRiskEnginePage = class FraudRiskEnginePage {
  constructor(page) {
    this.page = page;
    
    // Locators for transaction event preparation
    this.transactionEventForm = page.locator('[data-testid="transaction-event-form"]');
    this.transactionIdInput = page.locator('[data-testid="transaction-id-input"]');
    this.cardIdInput = page.locator('[data-testid="card-id-input"]');
    this.amountInput = page.locator('[data-testid="amount-input"]');
    this.merchantInput = page.locator('[data-testid="merchant-input"]');
    this.geographyInput = page.locator('[data-testid="geography-input"]');
    this.deviceInput = page.locator('[data-testid="device-input"]');
    this.velocityInput = page.locator('[data-testid="velocity-input"]');
    this.timestampInput = page.locator('[data-testid="timestamp-input"]');
    this.prepareEventButton = page.locator('[data-testid="prepare-event-button"]');
    this.transactionEventStatus = page.locator('[data-testid="transaction-event-status"]');
    
    // Locators for sending transaction to engine
    this.sendToEngineButton = page.locator('[data-testid="send-to-engine-button"]');
    this.engineReceiptStatus = page.locator('[data-testid="engine-receipt-status"]');
    
    // Locators for risk analysis
    this.riskAnalysisStatus = page.locator('[data-testid="risk-analysis-status"]');
    this.riskScoreDisplay = page.locator('[data-testid="risk-score-display"]');
    this.riskBandDisplay = page.locator('[data-testid="risk-band-display"]');
    
    // Locators for error handling
    this.systemErrorStatus = page.locator('[data-testid="system-error-status"]');
    this.failSafeLog = page.locator('[data-testid="fail-safe-log"]');
    this.systemLogsPanel = page.locator('[data-testid="system-logs-panel"]');
    
    // Locators for engine availability
    this.engineStatusIndicator = page.locator('[data-testid="engine-status-indicator"]');
    this.engineUnavailabilityDetected = page.locator('[data-testid="engine-unavailability-detected"]');
    this.failSafePolicyDisplay = page.locator('[data-testid="fail-safe-policy-display"]');
    this.auditLogPanel = page.locator('[data-testid="audit-log-panel"]');
    this.auditLogTimestamp = page.locator('[data-testid="audit-log-timestamp"]');
    this.transactionCompletionStatus = page.locator('[data-testid="transaction-completion-status"]');
    this.engineSimulationControl = page.locator('[data-testid="engine-simulation-control"]');
    this.engineUnavailableToggle = page.locator('[data-testid="engine-unavailable-toggle"]');
  }

  async prepareTransactionEvent(transactionData) {
    logger.info('Preparing transaction event with provided data');
    await expect(this.transactionEventForm).toBeVisible();
    
    await this.transactionIdInput.fill(transactionData.transaction_id);
    await this.cardIdInput.fill(transactionData.card_id);
    await this.amountInput.fill(transactionData.amount.toString());
    await this.merchantInput.fill(transactionData.merchant);
    
    if (transactionData.geography !== null && transactionData.geography !== undefined) {
      await this.geographyInput.fill(transactionData.geography);
    }
    
    if (transactionData.device !== null && transactionData.device !== undefined) {
      await this.deviceInput.fill(transactionData.device);
    }
    
    if (transactionData.velocity) {
      await this.velocityInput.fill(transactionData.velocity);
    }
    
    if (transactionData.timestamp) {
      await this.timestampInput.fill(transactionData.timestamp);
    }
    
    await this.prepareEventButton.click();
    logger.info('Transaction event preparation completed');
  }

  async sendTransactionToFraudEngine(transactionData) {
    logger.info(`Sending transaction ${transactionData.transaction_id} to fraud-risk engine`);
    await expect(this.sendToEngineButton).toBeEnabled();
    await this.sendToEngineButton.click();
    logger.info('Transaction sent to fraud-risk engine');
  }

  async waitForRiskAnalysis() {
    logger.info('Waiting for risk analysis to complete');
    await expect(this.riskAnalysisStatus).toBeVisible({ timeout: 10000 });
    await this.page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector);
        return element && (element.textContent === 'completed' || element.textContent === 'processed');
      },
      '[data-testid="risk-analysis-status"]',
      { timeout: 10000 }
    );
    logger.info('Risk analysis completed');
  }

  async getRiskScore() {
    await expect(this.riskScoreDisplay).toBeVisible();
    const scoreText = await this.riskScoreDisplay.textContent();
    const score = parseFloat(scoreText);
    logger.info(`Retrieved risk score: ${score}`);
    return score;
  }

  async getRiskBand() {
    await expect(this.riskBandDisplay).toBeVisible();
    const band = await this.riskBandDisplay.textContent();
    logger.info(`Retrieved risk band: ${band}`);
    return band;
  }

  async isFailSafePolicyApplied() {
    const isVisible = await this.failSafeLog.isVisible();
    logger.info(`Fail-safe policy applied: ${isVisible}`);
    return isVisible;
  }

  async getSystemLogs() {
    await expect(this.systemLogsPanel).toBeVisible();
    const logs = await this.systemLogsPanel.textContent();
    logger.info('Retrieved system logs');
    return logs;
  }

  async simulateEngineUnavailability() {
    logger.info('Simulating fraud-risk engine unavailability');
    await expect(this.engineSimulationControl).toBeVisible();
    await this.engineUnavailableToggle.click();
    await this.page.waitForTimeout(1000); // Allow simulation to take effect
    logger.info('Engine unavailability simulated');
  }

  async getEngineStatus() {
    await expect(this.engineStatusIndicator).toBeVisible();
    const status = await this.engineStatusIndicator.textContent();
    logger.info(`Engine status: ${status}`);
    return status;
  }

  async waitForEngineDetection() {
    logger.info('Waiting for system to detect engine unavailability');
    await expect(this.engineUnavailabilityDetected).toBeVisible({ timeout: 5000 });
    logger.info('Engine unavailability detected by system');
  }

  async getAppliedFailSafePolicy() {
    await expect(this.failSafePolicyDisplay).toBeVisible();
    const policy = await this.failSafePolicyDisplay.textContent();
    logger.info(`Applied fail-safe policy: ${policy}`);
    return policy;
  }

  async getAuditLog() {
    await expect(this.auditLogPanel).toBeVisible();
    const auditLog = await this.auditLogPanel.textContent();
    logger.info('Retrieved audit log');
    return auditLog;
  }

  async waitForTransactionCompletion(timeoutMs) {
    logger.info(`Waiting for transaction completion within ${timeoutMs}ms`);
    try {
      await expect(this.transactionCompletionStatus).toHaveText('completed', { timeout: timeoutMs });
      logger.info('Transaction completed within timeout');
      return true;
    } catch (error) {
      logger.error('Transaction did not complete within timeout');
      return false;
    }
  }
};
