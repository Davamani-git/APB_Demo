const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    
    // Home Page Locators
    this.homePageContainer = page.locator('[data-testid="home-page"], .home-page-container, main');
    this.helpCenterEntryPoint = page.locator('[data-testid="help-center-link"], .help-center-nav, a:has-text("Help Center")');
    this.mainNavigation = page.locator('[data-testid="main-nav"], .main-navigation, nav');
    this.serviceErrorMessage = page.locator('[data-testid="service-error"], .service-error-message, .error-alert');
    this.alternativeSupportOptions = page.locator('[data-testid="alternative-support"], .alternative-contact');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async navigateOnMobile() {
    await this.page.goto('/');
  }

  async verifyPageLoaded() {
    await expect(this.homePageContainer).toBeVisible({ timeout: 2000 });
  }

  async verifyPageLoadedOnMobile() {
    await expect(this.homePageContainer).toBeVisible({ timeout: 2000 });
    const viewport = this.page.viewportSize();
    expect(viewport.width).toBeLessThanOrEqual(768);
  }

  async verifyPageLoadedWithHelpCenterEntryPoint() {
    await expect(this.homePageContainer).toBeVisible({ timeout: 2000 });
    await expect(this.helpCenterEntryPoint).toBeVisible();
    await expect(this.mainNavigation).toContainText(/Help Center/i);
  }

  async clickHelpCenterEntryPoint() {
    await expect(this.helpCenterEntryPoint).toBeVisible();
    await expect(this.helpCenterEntryPoint).toBeEnabled();
    await this.helpCenterEntryPoint.click();
  }

  async simulateHelpCenterServiceDown() {
    // Implementation depends on test environment configuration
    // This could involve API mocking, network interception, or test data setup
    await this.page.route('**/help-center/**', route => route.abort());
  }

  async attemptToAccessHelpCenter() {
    await this.helpCenterEntryPoint.click();
  }

  async verifyHelpCenterServiceErrorMessage() {
    await expect(this.serviceErrorMessage).toBeVisible();
    await expect(this.serviceErrorMessage).toContainText(/unavailable|service.*down|error/i);
    await expect(this.alternativeSupportOptions).toBeVisible();
  }
};
