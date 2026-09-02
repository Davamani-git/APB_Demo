const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.helpCenterEntryPoint = page.locator('[data-testid="help-center-link"], a[href*="help-center"], text=/Help Center/i');
    this.serviceUnavailableMessage = page.locator('[data-testid="service-unavailable"], .error-message, text=/unavailable/i');
    this.alternativeSupportOptions = page.locator('[data-testid="alternative-support"], .support-options, .contact-info');
    this.mainNavigation = page.locator('[data-testid="main-navigation"], nav, .navigation');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async verifyHomePageLoaded() {
    await expect(this.page).toHaveURL(/.*\/$|.*\/home.*/);
    await expect(this.mainNavigation).toBeVisible({ timeout: 5000 });
  }

  async verifyHelpCenterEntryPointVisible() {
    await expect(this.helpCenterEntryPoint).toBeVisible();
  }

  async clickHelpCenterEntryPoint() {
    await expect(this.helpCenterEntryPoint).toBeEnabled();
    await this.helpCenterEntryPoint.click();
  }

  async simulateHelpCenterServiceOutage() {
    await this.page.route('**/help-center/**', route => route.abort());
  }

  async verifyServiceUnavailableMessage() {
    await expect(this.serviceUnavailableMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyAlternativeSupportOptionsDisplayed() {
    await expect(this.alternativeSupportOptions).toBeVisible();
    const optionsCount = await this.alternativeSupportOptions.locator('a, button').count();
    expect(optionsCount).toBeGreaterThan(0);
  }
};
