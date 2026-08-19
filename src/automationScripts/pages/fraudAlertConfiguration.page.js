const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.FraudAlertConfigurationPage = class FraudAlertConfigurationPage {
  constructor(page) {
    this.page = page;
    this.lowThresholdMinInput = page.locator('#low-threshold-min');
    this.lowThresholdMaxInput = page.locator('#low-threshold-max');
    this.mediumThresholdMinInput = page.locator('#medium-threshold-min');
    this.mediumThresholdMaxInput = page.locator('#medium-threshold-max');
    this.highThresholdMinInput = page.locator('#high-threshold-min');
    this.highThresholdMaxInput = page.locator('#high-threshold-max');
    this.confirmedFraudMinInput = page.locator('#confirmed-fraud-min');
    this.confirmedFraudMaxInput = page.locator('#confirmed-fraud-max');
    this.saveThresholdsButton = page.locator('button[data-testid="save-thresholds"]');
    this.updateThresholdsButton = page.locator('button[data-testid="update-thresholds"]');
    this.thresholdSuccessMessage = page.locator('.threshold-success-message');
    this.thresholdErrorMessage = page.locator('.threshold-error-message');
    this.activeConfigurationIndicator = page.locator('.active-configuration');
    this.clientVersionDisplay = page.locator('#client-version');
    this.clientBuildDisplay = page.locator('#client-build');
    this.configurationStatusLabel = page.locator('.configuration-status');
  }

  async navigate() {
    logger.info('Navigating to Fraud Alert Configuration page');
    await this.page.goto('/fraud-alert/configuration');
    await expect(this.page).toHaveURL(/.*configuration/);
  }

  async configureAlertThresholds(lowMin, lowMax, medMin, medMax, highMin, highMax, fraudMin, fraudMax) {
    logger.info('Configuring alert thresholds');
    await expect(this.lowThresholdMinInput).toBeVisible();
    await this.lowThresholdMinInput.fill(lowMin);
    await this.lowThresholdMaxInput.fill(lowMax);
    await this.mediumThresholdMinInput.fill(medMin);
    await this.mediumThresholdMaxInput.fill(medMax);
    await this.highThresholdMinInput.fill(highMin);
    await this.highThresholdMaxInput.fill(highMax);
    await this.confirmedFraudMinInput.fill(fraudMin);
    await this.confirmedFraudMaxInput.fill(fraudMax);
    await expect(this.saveThresholdsButton).toBeEnabled();
    await this.saveThresholdsButton.click();
  }

  async verifyThresholdsConfigured() {
    logger.info('Verifying thresholds configured successfully');
    await expect(this.thresholdSuccessMessage).toBeVisible();
    await expect(this.thresholdSuccessMessage).toContainText('Alert thresholds successfully configured');
  }

  async updateAlertThresholds(lowMin, lowMax, medMin, medMax, highMin, highMax, fraudMin, fraudMax) {
    logger.info('Updating alert thresholds dynamically');
    await expect(this.lowThresholdMinInput).toBeVisible();
    await this.lowThresholdMinInput.clear();
    await this.lowThresholdMinInput.fill(lowMin);
    await this.lowThresholdMaxInput.clear();
    await this.lowThresholdMaxInput.fill(lowMax);
    await this.mediumThresholdMinInput.clear();
    await this.mediumThresholdMinInput.fill(medMin);
    await this.mediumThresholdMaxInput.clear();
    await this.mediumThresholdMaxInput.fill(medMax);
    await this.highThresholdMinInput.clear();
    await this.highThresholdMinInput.fill(highMin);
    await this.highThresholdMaxInput.clear();
    await this.highThresholdMaxInput.fill(highMax);
    await this.confirmedFraudMinInput.clear();
    await this.confirmedFraudMinInput.fill(fraudMin);
    await this.confirmedFraudMaxInput.clear();
    await this.confirmedFraudMaxInput.fill(fraudMax);
    await expect(this.updateThresholdsButton).toBeEnabled();
    await this.updateThresholdsButton.click();
  }

  async verifyThresholdsUpdated() {
    logger.info('Verifying thresholds updated successfully');
    await expect(this.thresholdSuccessMessage).toBeVisible();
    await expect(this.thresholdSuccessMessage).toContainText('Alert thresholds successfully updated');
  }

  async attemptInvalidThresholdConfiguration(lowMin, lowMax, medMin, medMax, highMin, highMax, fraudMin, fraudMax) {
    logger.info('Attempting invalid threshold configuration');
    await expect(this.lowThresholdMinInput).toBeVisible();
    await this.lowThresholdMinInput.fill(lowMin);
    await this.lowThresholdMaxInput.fill(lowMax);
    await this.mediumThresholdMinInput.fill(medMin);
    await this.mediumThresholdMaxInput.fill(medMax);
    await this.highThresholdMinInput.fill(highMin);
    await this.highThresholdMaxInput.fill(highMax);
    await this.confirmedFraudMinInput.fill(fraudMin);
    await this.confirmedFraudMaxInput.fill(fraudMax);
    await expect(this.saveThresholdsButton).toBeEnabled();
    await this.saveThresholdsButton.click();
  }

  async verifyConfigurationRejected(errorMessage) {
    logger.info('Verifying configuration rejected with error message');
    await expect(this.thresholdErrorMessage).toBeVisible();
    await expect(this.thresholdErrorMessage).toContainText(errorMessage);
  }

  async verifyPreviousConfigurationActive() {
    logger.info('Verifying previous valid configuration remains active');
    await expect(this.activeConfigurationIndicator).toBeVisible();
    await expect(this.configurationStatusLabel).toContainText('Previous valid thresholds');
  }

  async verifyClientVersion(version, build) {
    logger.info('Verifying client version and build');
    await expect(this.clientVersionDisplay).toBeVisible();
    await expect(this.clientVersionDisplay).toContainText(version);
    await expect(this.clientBuildDisplay).toContainText(build);
  }

  async verifyClientVersionUnchanged(version, build) {
    logger.info('Verifying client version remains unchanged');
    await expect(this.clientVersionDisplay).toBeVisible();
    await expect(this.clientVersionDisplay).toContainText(version);
    await expect(this.clientBuildDisplay).toContainText(build);
  }
};
