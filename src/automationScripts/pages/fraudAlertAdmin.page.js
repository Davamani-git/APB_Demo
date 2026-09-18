const { expect } = require('@playwright/test');

exports.FraudAlertAdminPage = class FraudAlertAdminPage {
  constructor(page) {
    this.page = page;
    
    // Admin console locators
    this.adminConsoleHeader = page.locator('[data-testid="admin-console-header"]');
    this.adminConsoleTitle = page.locator('h1');
    
    // Login locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('[data-testid="login-btn"]');
    this.authenticationStatus = page.locator('[data-testid="auth-status"]');
    this.managerAccessIndicator = page.locator('[data-testid="manager-access"]');
    
    // Navigation locators
    this.thresholdConfigLink = page.locator('[data-testid="threshold-config-link"]');
    this.thresholdConfigPage = page.locator('[data-testid="threshold-config-page"]');
    
    // Threshold configuration locators
    this.currentThresholdDisplay = page.locator('[data-testid="current-threshold"]');
    this.thresholdInput = page.locator('#threshold-value');
    this.updateThresholdButton = page.locator('[data-testid="update-threshold-btn"]');
    this.thresholdSavedMessage = page.locator('[data-testid="threshold-saved"]');
    this.validationErrorMessage = page.locator('[data-testid="validation-error"]');
    
    // Transaction evaluation locators
    this.evaluationSection = page.locator('[data-testid="evaluation-section"]');
    this.evalTransactionIdInput = page.locator('#eval-transaction-id');
    this.evalRiskScoreInput = page.locator('#eval-risk-score');
    this.evalAmountInput = page.locator('#eval-amount');
    this.evalMerchantInput = page.locator('#eval-merchant');
    this.submitEvaluationButton = page.locator('[data-testid="submit-evaluation-btn"]');
    
    // Alert verification locators
    this.alertCreatedIndicator = page.locator('[data-testid="alert-created"]');
    this.alertIdDisplay = page.locator('[data-testid="alert-id"]');
    this.alertTransactionId = page.locator('[data-testid="alert-transaction-id"]');
    this.alertThresholdUsed = page.locator('[data-testid="alert-threshold-used"]');
    
    // Alert record locators
    this.alertRecordSection = page.locator('[data-testid="alert-record"]');
    this.recordTransactionId = page.locator('[data-testid="record-transaction-id"]');
    this.recordThresholdValue = page.locator('[data-testid="record-threshold-value"]');
    this.recordDeploymentVersion = page.locator('[data-testid="record-deployment-version"]');
  }

  async navigate(url) {
    await this.page.goto(url);
    await expect(this.page).toHaveURL(url);
  }

  async verifyAdminConsoleLoaded() {
    await expect(this.adminConsoleHeader).toBeVisible();
    await expect(this.adminConsoleTitle).toContainText(/admin console|fraud alert admin/i);
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async verifyManagerAuthenticated() {
    await expect(this.authenticationStatus).toBeVisible();
    await expect(this.authenticationStatus).toHaveText(/authenticated|logged in/i);
    await expect(this.managerAccessIndicator).toBeVisible();
    await expect(this.managerAccessIndicator).toHaveText(/threshold configuration access|manager access/i);
  }

  async navigateToThresholdConfiguration() {
    await expect(this.thresholdConfigLink).toBeVisible();
    await this.thresholdConfigLink.click();
    await expect(this.thresholdConfigPage).toBeVisible();
  }

  async verifyCurrentThreshold(threshold) {
    await expect(this.currentThresholdDisplay).toBeVisible();
    await expect(this.currentThresholdDisplay).toHaveText(threshold);
  }

  async updateThreshold(newThreshold) {
    await expect(this.thresholdInput).toBeVisible();
    await this.thresholdInput.clear();
    await this.thresholdInput.fill(newThreshold);
    await expect(this.updateThresholdButton).toBeEnabled();
    await this.updateThresholdButton.click();
  }

  async attemptUpdateThreshold(newThreshold) {
    await expect(this.thresholdInput).toBeVisible();
    await this.thresholdInput.clear();
    await this.thresholdInput.fill(newThreshold);
    await expect(this.updateThresholdButton).toBeEnabled();
    await this.updateThresholdButton.click();
  }

  async verifyThresholdSaved(threshold) {
    await expect(this.thresholdSavedMessage).toBeVisible();
    await expect(this.thresholdSavedMessage).toContainText(/saved successfully|threshold updated/i);
    await expect(this.currentThresholdDisplay).toHaveText(threshold);
  }

  async submitTransactionForEvaluation(transactionData) {
    await expect(this.evaluationSection).toBeVisible();
    
    if (transactionData.transaction_id) {
      await this.evalTransactionIdInput.fill(transactionData.transaction_id);
    }
    
    if (transactionData.risk_score) {
      await this.evalRiskScoreInput.fill(transactionData.risk_score);
    }
    
    if (transactionData.amount) {
      await this.evalAmountInput.fill(transactionData.amount);
    }
    
    if (transactionData.merchant) {
      await this.evalMerchantInput.fill(transactionData.merchant);
    }
    
    await expect(this.submitEvaluationButton).toBeEnabled();
    await this.submitEvaluationButton.click();
  }

  async verifyAlertCreatedWithThreshold(transactionId, threshold) {
    await expect(this.alertCreatedIndicator).toBeVisible();
    await expect(this.alertTransactionId).toHaveText(transactionId);
    await expect(this.alertThresholdUsed).toHaveText(threshold);
  }

  async verifyAlertRecordThreshold(transactionId, threshold) {
    await expect(this.alertRecordSection).toBeVisible();
    await expect(this.recordTransactionId).toHaveText(transactionId);
    await expect(this.recordThresholdValue).toHaveText(threshold);
    await expect(this.recordDeploymentVersion).toContainText(/unchanged|no redeployment/i);
  }

  async verifyValidationError(expectedErrorMessage) {
    await expect(this.validationErrorMessage).toBeVisible();
    await expect(this.validationErrorMessage).toHaveText(expectedErrorMessage);
  }
};
