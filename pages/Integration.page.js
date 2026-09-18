class IntegrationPage {
  constructor(page) {
    this.page = page;
    this.addButton = page.locator('[data-testid="add-integration-button"]');
    this.providerDropdown = page.locator('[data-testid="provider-dropdown"]');
    this.accessKeyInput = page.locator('[data-testid="access-key-input"]');
    this.secretKeyInput = page.locator('[data-testid="secret-key-input"]');
    this.validateButton = page.locator('[data-testid="validate-button"]');
    this.saveButton = page.locator('[data-testid="save-button"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.integrationStatus = page.locator('[data-testid="integration-status"]');
  }

  async navigate() {
    await this.page.goto('/admin/integrations');
  }

  async clickAddIntegration() {
    await this.addButton.click();
  }

  async selectProvider(provider) {
    await this.providerDropdown.selectOption(provider);
  }

  async enterCredentials(accessKey, secretKey) {
    await this.accessKeyInput.fill(accessKey);
    await this.secretKeyInput.fill(secretKey);
  }

  async validateConnectivity() {
    await this.validateButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async configureIntegration(provider, credentials) {
    await this.clickAddIntegration();
    await this.selectProvider(provider);
  }

  async simulateServiceUnreachable() {
    await this.page.route('**/api/validate-integration', route => route.abort());
  }

  async verifyRetryInitiated() {
    await this.page.waitForTimeout(5000);
    const retryAttempts = await this.page.evaluate(() => window.getRetryAttempts());
    if (retryAttempts === 0) {
      throw new Error('Retry not initiated');
    }
  }
}

module.exports = IntegrationPage;