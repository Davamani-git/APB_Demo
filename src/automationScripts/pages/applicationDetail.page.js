const { expect } = require('@playwright/test');

exports.ApplicationDetailPage = class ApplicationDetailPage {
  constructor(page) {
    this.page = page;
    this.payerStatusSection = page.locator('.payer-status-section, [data-testid="payer-status"]');
    this.requirementsList = page.locator('.requirements-list, [data-testid="requirements"]');
    this.overallStatusBadge = page.locator('.overall-status, [data-testid="overall-status"]');
    this.recommendationSection = page.locator('.recommendation, [data-testid="recommendation"]');
  }

  async navigateToApplication(applicationId) {
    await this.page.goto(`http://localhost:4200/applications/${applicationId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRuleSetVersion(payerId, expectedVersion) {
    const payerSection = this.page.locator(`.payer-card:has-text("${payerId}"), [data-testid="payer-${payerId}"]`);
    await expect(payerSection).toBeVisible();
    const versionText = payerSection.locator('.rule-set-version, [data-testid="rule-version"]');
    await expect(versionText).toContainText(expectedVersion);
  }

  async verifyPayerStatus(payerId, expectedStatus) {
    const payerSection = this.page.locator(`.payer-card:has-text("${payerId}"), [data-testid="payer-${payerId}"]`);
    await expect(payerSection).toBeVisible();
    const statusBadge = payerSection.locator('.status-badge, [data-testid="status"]');
    await expect(statusBadge).toContainText(expectedStatus);
  }

  async verifyOverallStatus(expectedStatus) {
    await expect(this.overallStatusBadge).toBeVisible();
    await expect(this.overallStatusBadge).toContainText(expectedStatus);
  }

  async verifyRequirementStatus(requirementName, expectedStatus) {
    const requirementItem = this.page.locator(`.requirement-item:has-text("${requirementName}"), [data-testid="requirement-${requirementName}"]`);
    await expect(requirementItem).toBeVisible();
    const status = requirementItem.locator('.req-status, [data-testid="status"]');
    await expect(status).toContainText(expectedStatus);
  }

  async verifyRequirementHasExpirationDate(requirementName) {
    const requirementItem = this.page.locator(`.requirement-item:has-text("${requirementName}")`);
    await expect(requirementItem).toBeVisible();
    const expirationDate = requirementItem.locator('.expiration-date, :has-text("Expires:")');
    await expect(expirationDate).toBeVisible();
  }

  async verifyRecommendation(requirementName, expectedText) {
    const requirementItem = this.page.locator(`.requirement-item:has-text("${requirementName}")`);
    await expect(requirementItem).toBeVisible();
    const recommendation = requirementItem.locator('.recommendation, [data-testid="recommendation"]');
    await expect(recommendation).toContainText(expectedText);
  }

  async verifyNoRecommendations() {
    const recommendations = this.page.locator('.recommendation, [data-testid="recommendation"]');
    await expect(recommendations).toHaveCount(0);
  }

  async verifyPayerRequirementStatus(payerId, requirementName, expectedStatus) {
    const payerSection = this.page.locator(`.payer-card:has-text("${payerId}")`);
    await expect(payerSection).toBeVisible();
    const requirementItem = payerSection.locator(`.requirement-item:has-text("${requirementName}")`);
    await expect(requirementItem).toBeVisible();
    const status = requirementItem.locator('.req-status, [data-testid="status"]');
    await expect(status).toContainText(expectedStatus);
  }

  async verifyPayerRecommendation(payerId, requirementName, expectedText) {
    const payerSection = this.page.locator(`.payer-card:has-text("${payerId}")`);
    await expect(payerSection).toBeVisible();
    const requirementItem = payerSection.locator(`.requirement-item:has-text("${requirementName}")`);
    await expect(requirementItem).toBeVisible();
    const recommendation = requirementItem.locator('.recommendation, [data-testid="recommendation"]');
    await expect(recommendation).toContainText(expectedText);
  }
};
