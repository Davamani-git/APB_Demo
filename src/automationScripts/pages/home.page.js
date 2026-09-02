const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.homePageContainer = page.locator('[data-testid="home-page-container"], .home-page, #home-page, main');
    this.helpCenterEntryPoint = page.locator('[data-testid="help-center-entry"], a[href*="help"], button:has-text("Help Center"), .help-center-link');
  }

  async navigate(url) {
    await this.page.goto(url);
    await expect(this.homePageContainer).toBeVisible();
  }

  async clickHelpCenterEntryPoint() {
    await expect(this.helpCenterEntryPoint).toBeVisible();
    await this.helpCenterEntryPoint.click();
  }
};
