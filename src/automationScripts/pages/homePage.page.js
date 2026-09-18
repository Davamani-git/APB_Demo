const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.helpCenterEntryPoint = page.locator('[data-testid="help-center-entry"], a:has-text("Help Center"), nav a[href*="help"]').first();
    this.navigationMenu = page.locator('nav[role="navigation"], header nav');
    this.existingNavLinks = page.locator('nav a:not([href*="help"])');
    this.homePageLogo = page.locator('[data-testid="logo"], .logo, header img');
    this.mainContent = page.locator('main, [role="main"]');
    this.interactiveButtons = page.locator('button:visible, a.btn:visible, input[type="submit"]:visible');
    this.forms = page.locator('form');
  }

  async navigate() {
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/.*\/$|.*\/home/i);
    await expect(this.homePageLogo).toBeVisible();
  }

  async verifyHelpCenterEntryPointVisible() {
    await expect(this.helpCenterEntryPoint).toBeVisible({ timeout: 10000 });
    await expect(this.helpCenterEntryPoint).toBeEnabled();
  }

  async clickHelpCenterEntryPoint() {
    await expect(this.helpCenterEntryPoint).toBeVisible();
    await this.helpCenterEntryPoint.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyExistingNavigationMenuFunctional() {
    await expect(this.navigationMenu).toBeVisible();
    const navLinksCount = await this.existingNavLinks.count();
    expect(navLinksCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(navLinksCount, 3); i++) {
      const link = this.existingNavLinks.nth(i);
      await expect(link).toBeVisible();
      await expect(link).toBeEnabled();
    }
  }

  async verifyHomePageLayoutIntact() {
    await expect(this.homePageLogo).toBeVisible();
    await expect(this.navigationMenu).toBeVisible();
    await expect(this.mainContent).toBeVisible();
    const mainContentBox = await this.mainContent.boundingBox();
    expect(mainContentBox).toBeTruthy();
    expect(mainContentBox.width).toBeGreaterThan(0);
    expect(mainContentBox.height).toBeGreaterThan(0);
  }

  async verifyInteractiveElementsFunctional() {
    const buttonsCount = await this.interactiveButtons.count();
    expect(buttonsCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(buttonsCount, 5); i++) {
      const button = this.interactiveButtons.nth(i);
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
    const formsCount = await this.forms.count();
    if (formsCount > 0) {
      const firstForm = this.forms.first();
      await expect(firstForm).toBeVisible();
    }
  }
};