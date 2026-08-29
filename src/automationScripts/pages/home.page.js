const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    
    // Home page elements
    this.homeContainer = page.locator('[data-testid="home-container"]');
    this.pageTitle = page.locator('h1');
    
    // Help Center navigation elements
    this.helpCenterNavigation = page.locator('[data-testid="help-center-navigation"]');
    this.helpCenterLink = page.locator('a[href*="help-center"]');
    this.helpCenterErrorMessage = page.locator('[data-testid="help-center-error-message"]');
  }

  async navigate() {
    await this.page.goto('/home');
  }

  async verifyPageLoaded() {
    await expect(this.homeContainer).toBeVisible({ timeout: 10000 });
    await expect(this.pageTitle).toBeVisible();
  }

  async verifyHelpCenterNavigationVisible() {
    await expect(this.helpCenterNavigation).toBeVisible();
  }

  async clickHelpCenterNavigation() {
    await expect(this.helpCenterLink).toBeVisible();
    await this.helpCenterLink.click();
  }

  async simulateHelpCenterServiceUnavailable() {
    // Simulate service unavailable via route interception
    await this.page.route('**/help-center**', route => {
      route.fulfill({
        status: 503,
        contentType: 'text/html',
        body: 'Service Unavailable'
      });
    });
  }

  async verifyHelpCenterErrorMessage() {
    await expect(this.helpCenterErrorMessage).toBeVisible({ timeout: 5000 });
    await expect(this.helpCenterErrorMessage).toContainText(/error|unavailable|alternative support/i);
  }
};