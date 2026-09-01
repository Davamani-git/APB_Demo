const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.url = 'https://app.example.com';
    
    // Help Center Entry Point Locators
    this.helpCenterEntryPoint = page.locator('[data-testid="help-center-entry"], #help-center-link, .help-center-entry, a[href*="help-center"]');
    this.serviceErrorMessage = page.locator('[data-testid="service-error"], .service-error-message');
    this.alternativeSupportContact = page.locator('[data-testid="alternative-support-contact"], .alternative-support-contact');
  }

  async navigate() {
    await this.page.goto(this.url);
    await expect(this.page).toHaveURL(/.*app.example.com/);
  }

  async clickHelpCenterEntry() {
    await expect(this.helpCenterEntryPoint).toBeVisible();
    await this.helpCenterEntryPoint.click();
  }
};
