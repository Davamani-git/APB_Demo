const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.helpCenterEntryPoint = page.locator('[data-testid="help-center-entry"], a:has-text("Help Center"), .help-center-link, nav a[href*="help"]');
    this.homePageTitle = page.locator('[data-testid="home-title"], h1, .home-title');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/.*\/$|.*\/home.*/, { timeout: 10000 });
    await expect(this.homePageTitle).toBeVisible({ timeout: 5000 });
  }

  async verifyHelpCenterEntryPointVisible() {
    await expect(this.helpCenterEntryPoint).toBeVisible({ timeout: 5000 });
  }

  async clickHelpCenterEntryPoint() {
    await expect(this.helpCenterEntryPoint).toBeEnabled();
    await this.helpCenterEntryPoint.click();
  }
};