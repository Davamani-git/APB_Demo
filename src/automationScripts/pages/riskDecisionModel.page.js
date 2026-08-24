const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.RiskDecisionModelPage = class RiskDecisionModelPage {
  constructor(page) {
    this.page = page;
    
    // Configuration locators
    this.thresholdConfigPanel = page.locator('[data-testid="threshold-config-panel"]');
    this.lowThresholdMin = page.locator('[data-testid="low-threshold-min"]');
    this.lowThresholdMax = page.locator('[data-testid="low-threshold-max"]');
    this.mediumThresholdMin = page.locator('[data-testid="medium-threshold-min"]');
    this.mediumThresholdMax = page.locator('[data-testid="medium-threshold-max"]');
    this.highThresholdMin = page.locator('[data-testid="high-threshold-min"]');
    this.highThresholdMax = page.locator('[data-testid="high-threshold-max"]');
    this.confirmedFraudThresholdMin = page.locator('[data-testid="confirmed-fraud-threshold-min"]');
    this.confirmedFraudThresholdMax = page.locator('[data-testid="confirmed-fraud-threshold-max"]');
    this.saveThresholdsButton = page.locator('[data-testid="save-thresholds-button"]');
    this.thresholdConfigStatus = page.locator('[data-testid="threshold-config-status"]');
    
    // Transaction submission locators
    this.transactionIdInput = page.locator('[data-testid="transaction-id-input"]');
    this.riskScoreInput = page.locator('[data-testid="risk-score-input"]');
    this.submitTransactionButton = page.locator('[data-testid="submit-transaction-button"]');
    
    // Risk categorization locators
    this.transactionRiskCategory = page.locator('[data-testid="transaction-risk-category"]');
    this.transactionRiskScore = page.locator('[data-testid="transaction-risk-score"]');
    this.transactionIdDisplay = page.locator('[data-testid="transaction-id-display"]');
    
    // Treatment path locators
    this.treatmentPathAction = page.locator('[data-testid="treatment-path-action"]');
    this.treatmentPathStatus = page.locator('[data-testid="treatment-path-status"]');
    
    // Configuration error locators
    this.configurationError = page.locator('[data-testid="configuration-error"]');
    this.configurationErrorType = page.locator('[data-testid="configuration-error-type"]');
    this.invalidThresholdToggle = page.locator('[data-testid="simulate-invalid-thresholds"]');
    
    // Fail-safe policy locators
    this.failSafePolicy = page.locator('[data-testid="fail-safe-policy"]');
    this.failSafePolicyAction = page.locator('[data-testid="fail-safe-policy-action"]');
    
    // Error logging locators
    this.errorLogTransactionId = page.locator('[data-testid="error-log-transaction-id"]');
    this.errorLogType = page.locator('[data-testid="error-log-type"]');
    this.errorLogIssue = page.locator('[data-testid="error-log-issue"]');
    
    // Multiple transaction processing locators
    this.transactionListContainer = page.locator('[data-testid="transaction-list-container"]');
    this.transactionStatusIndicator = page.locator('[data-testid="transaction-status-indicator"]');
  }
  
  async configureRiskThresholds(thresholds) {
    logger.info('Configuring risk thresholds');
    await expect(this.thresholdConfigPanel).toBeVisible();
    
    await this.lowThresholdMin.fill(thresholds.low.min.toString());
    await this.lowThresholdMax.fill(thresholds.low.max.toString());
    await this.mediumThresholdMin.fill(thresholds.medium.min.toString());
    await this.mediumThresholdMax.fill(thresholds.medium.max.toString());
    await this.highThresholdMin.fill(thresholds.high.min.toString());
    await this.highThresholdMax.fill(thresholds.high.max.toString());
    await this.confirmedFraudThresholdMin.fill(thresholds.confirmed_fraud.min.toString());
    await this.confirmedFraudThresholdMax.fill(thresholds.confirmed_fraud.max.toString());
    
    await expect(this.saveThresholdsButton).toBeEnabled();
    await this.saveThresholdsButton.click();
    logger.info('Risk thresholds configured and saved');
  }
  
  async verifyThresholdsConfigured() {
    logger.info('Verifying thresholds are configured correctly');
    await expect(this.thresholdConfigStatus).toBeVisible();
    await expect(this.thresholdConfigStatus).toContainText('configured');
    logger.info('Thresholds configuration verified');
  }
  
  async submitTransactionWithRiskScore(transactionData) {
    logger.info(`Submitting transaction ${transactionData.transaction_id} with risk score ${transactionData.risk_score}`);
    await expect(this.transactionIdInput).toBeVisible();
    await this.transactionIdInput.fill(transactionData.transaction_id);
    await this.riskScoreInput.fill(transactionData.risk_score.toString());
    
    await expect(this.submitTransactionButton).toBeEnabled();
    await this.submitTransactionButton.click();
    logger.info('Transaction submitted successfully');
  }
  
  async verifyRiskCategorization(transactionId, expectedCategory, riskScore) {
    logger.info(`Verifying risk categorization for transaction ${transactionId}`);
    await expect(this.transactionIdDisplay).toBeVisible();
    await expect(this.transactionIdDisplay).toContainText(transactionId);
    await expect(this.transactionRiskCategory).toContainText(expectedCategory);
    await expect(this.transactionRiskScore).toContainText(riskScore.toString());
    logger.info(`Transaction ${transactionId} correctly categorized as ${expectedCategory}`);
  }
  
  async verifyTreatmentPathInitiated(transactionId, expectedActions) {
    logger.info(`Verifying treatment path for transaction ${transactionId}`);
    await expect(this.treatmentPathAction).toBeVisible();
    const actionText = await this.treatmentPathAction.textContent();
    
    const actionMatched = expectedActions.some(action => actionText.toLowerCase().includes(action.toLowerCase()));
    expect(actionMatched).toBeTruthy();
    
    await expect(this.treatmentPathStatus).toContainText('initiated');
    logger.info(`Treatment path initiated for transaction ${transactionId}`);
  }
  
  async configureMissingOrInvalidThresholds() {
    logger.info('Configuring missing or invalid thresholds');
    await expect(this.invalidThresholdToggle).toBeVisible();
    await this.invalidThresholdToggle.check();
    logger.info('Invalid threshold configuration simulated');
  }
  
  async verifyInvalidThresholdConfiguration() {
    logger.info('Verifying invalid threshold configuration');
    await expect(this.thresholdConfigStatus).toBeVisible();
    await expect(this.thresholdConfigStatus).toContainText('invalid');
    logger.info('Invalid threshold configuration confirmed');
  }
  
  async verifyConfigurationErrorDetected(expectedErrors) {
    logger.info('Verifying configuration error detection');
    await expect(this.configurationError).toBeVisible();
    await expect(this.configurationErrorType).toBeVisible();
    
    const errorText = await this.configurationErrorType.textContent();
    const errorMatched = expectedErrors.some(error => errorText.includes(error));
    expect(errorMatched).toBeTruthy();
    
    logger.info('Configuration error detected successfully');
  }
  
  async verifyFailSafePolicyApplied(transactionId, expectedPolicy) {
    logger.info(`Verifying fail-safe policy applied for transaction ${transactionId}`);
    await expect(this.failSafePolicy).toBeVisible();
    await expect(this.failSafePolicyAction).toContainText(expectedPolicy);
    logger.info('Fail-safe policy verified successfully');
  }
  
  async verifyConfigurationErrorLogged(transactionId, errorType, issue) {
    logger.info(`Verifying configuration error logged for transaction ${transactionId}`);
    await expect(this.errorLogTransactionId).toBeVisible();
    await expect(this.errorLogTransactionId).toContainText(transactionId);
    await expect(this.errorLogType).toContainText(errorType);
    await expect(this.errorLogIssue).toContainText(issue);
    logger.info('Configuration error logging verified');
  }
  
  async submitMultipleTransactions(transactions) {
    logger.info(`Submitting ${transactions.length} transactions`);
    for (const transaction of transactions) {
      await this.submitTransactionWithRiskScore(transaction);
    }
    logger.info('All transactions submitted successfully');
  }
  
  async verifyAllTransactionsProcessed(transactionIds) {
    logger.info('Verifying all transactions processed');
    await expect(this.transactionListContainer).toBeVisible();
    
    for (const txnId of transactionIds) {
      const transactionRow = this.page.locator(`[data-transaction-id="${txnId}"]`);
      await expect(transactionRow).toBeVisible();
      
      const statusIndicator = transactionRow.locator('[data-testid="transaction-status-indicator"]');
      await expect(statusIndicator).toBeVisible();
      const statusText = await statusIndicator.textContent();
      expect(['PROCESSED', 'COMPLETED', 'APPROVED', 'DECLINED', 'BLOCKED']).toContain(statusText);
    }
    
    logger.info('All transactions verified as processed');
  }
};
