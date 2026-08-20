const { expect } = require('@playwright/test');

exports.PolicyEnginePage = class PolicyEnginePage {
  constructor(page) {
    this.page = page;
    
    // Threshold configuration locators
    this.alertThresholdInput = page.locator('#alert-threshold-input');
    this.configureThresholdButton = page.locator('#configure-threshold-button');
    this.alertThresholdValue = page.locator('#alert-threshold-value');
    this.activeAlertThreshold = page.locator('#active-alert-threshold');
    this.updateThresholdButton = page.locator('#update-threshold-button');
    this.appliedThreshold = page.locator('#applied-threshold');
    
    // Transaction generation locators
    this.transactionIdInput = page.locator('#transaction-id-input');
    this.riskScoreInput = page.locator('#risk-score-input');
    this.generateTransactionButton = page.locator('#generate-transaction-button');
    this.riskScoreCalculated = page.locator('#risk-score-calculated');
    
    // Risk evaluation locators
    this.evaluateRiskButton = page.locator('#evaluate-risk-button');
    this.thresholdEvaluationResult = page.locator('#threshold-evaluation-result');
    
    // Alert creation locators
    this.alertRecord = page.locator('#alert-record');
    this.alertIdField = page.locator('#alert-id-field');
    this.alertRiskBand = page.locator('#alert-risk-band');
    this.alertTransactionId = page.locator('#alert-transaction-id');
    this.verifyAlertButton = page.locator('#verify-alert-button');
    this.alertQueryResult = page.locator('#alert-query-result');
    this.searchAlertButton = page.locator('#search-alert-button');
    
    // Action determination locators
    this.determinedAction = page.locator('#determined-action');
    this.riskToActionMapping = page.locator('#risk-to-action-mapping');
    this.verifyActionButton = page.locator('#verify-action-button');
    
    // Transaction processing locators
    this.transactionStatus = page.locator('#transaction-status');
    this.fraudIntervention = page.locator('#fraud-intervention');
    this.processingStatus = page.locator('#processing-status');
    this.viewTransactionButton = page.locator('#view-transaction-button');
  }
  
  async navigate() {
    await this.page.goto('/policy-engine');
    await expect(this.page).toHaveURL(/.*policy-engine/);
  }
  
  async configureAlertThreshold(threshold) {
    await expect(this.alertThresholdInput).toBeVisible();
    await this.alertThresholdInput.fill(threshold.toString());
    await this.configureThresholdButton.click();
    await expect(this.alertThresholdValue).toBeVisible();
  }
  
  async updateAlertThresholdWithoutRestart(newThreshold) {
    await expect(this.alertThresholdInput).toBeVisible();
    await this.alertThresholdInput.clear();
    await this.alertThresholdInput.fill(newThreshold.toString());
    await this.updateThresholdButton.click();
    await expect(this.alertThresholdValue).toBeVisible();
  }
  
  async verifyActiveThreshold(expectedThreshold) {
    await expect(this.activeAlertThreshold).toBeVisible();
    await expect(this.activeAlertThreshold).toHaveText(expectedThreshold.toString());
  }
  
  async generateTransactionWithRiskScore(transactionData) {
    await expect(this.transactionIdInput).toBeVisible();
    await this.transactionIdInput.fill(transactionData.transaction_id);
    await this.riskScoreInput.fill(transactionData.risk_score.toString());
    await this.generateTransactionButton.click();
    await expect(this.riskScoreCalculated).toBeVisible();
  }
  
  async evaluateRiskAgainstThreshold(riskScore, threshold) {
    await expect(this.evaluateRiskButton).toBeVisible();
    await this.evaluateRiskButton.click();
    await expect(this.thresholdEvaluationResult).toBeVisible();
  }
  
  async verifyAlertCreated(alertData) {
    await expect(this.verifyAlertButton).toBeVisible();
    await this.verifyAlertButton.click();
    await expect(this.alertRecord).toBeVisible();
    await expect(this.alertRiskBand).toBeVisible();
  }
  
  async verifyActionDetermined(expectedAction, riskBand) {
    await expect(this.verifyActionButton).toBeVisible();
    await this.verifyActionButton.click();
    await expect(this.determinedAction).toBeVisible();
  }
  
  async verifyNoAlertCreated(transactionId) {
    await expect(this.searchAlertButton).toBeVisible();
    await this.transactionIdInput.fill(transactionId);
    await this.searchAlertButton.click();
    await expect(this.alertQueryResult).toBeVisible();
  }
  
  async verifyTransactionProceedsNormally(transactionId) {
    await expect(this.viewTransactionButton).toBeVisible();
    await this.viewTransactionButton.click();
    await expect(this.transactionStatus).toBeVisible();
    await expect(this.fraudIntervention).toBeVisible();
  }
  
  async verifyTransactionProcessingNormal(transactionId) {
    await expect(this.viewTransactionButton).toBeVisible();
    await this.viewTransactionButton.click();
    await expect(this.transactionStatus).toBeVisible();
    await expect(this.processingStatus).toBeVisible();
  }
};