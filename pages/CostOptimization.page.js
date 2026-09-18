class CostOptimizationPage {
  constructor(page) {
    this.page = page;
    this.companyDropdown = page.locator('[data-testid="company-dropdown"]');
    this.thresholdInput = page.locator('[data-testid="threshold-input"]');
    this.saveButton = page.locator('[data-testid="save-button"]');
    this.confirmationMessage = page.locator('[data-testid="confirmation-message"]');
    this.validationError = page.locator('[data-testid="validation-error"]');
  }

  async navigate() {
    await this.page.goto('/cost-optimization');
    await this.page.waitForLoadState('networkidle');
  }

  async selectCompany(companyName) {
    await this.companyDropdown.click();
    await this.page.locator(`text=${companyName}`).click();
  }

  async enterThreshold(amount) {
    await this.thresholdInput.fill(amount);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async verifyThresholdStored(amount) {
    await this.page.waitForTimeout(1000);
    const storedValue = await this.thresholdInput.inputValue();
    if (storedValue !== amount) {
      throw new Error(`Expected threshold ${amount}, but got ${storedValue}`);
    }
  }
}

module.exports = CostOptimizationPage;