const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {

  constructor(page) {
    this.page = page;
    
    // Login Locators
    this.usernameInput = page.locator('[data-testid="username"], input[name="username"], #username');
    this.passwordInput = page.locator('[data-testid="password"], input[name="password"], #password');
    this.loginButton = page.locator('[data-testid="login-button"], button[type="submit"], button:has-text("Login")');
    
    // Help Center Integration Locators
    this.helpCenterEntryPoint = page.locator('[data-testid="help-center-link"], a:has-text("Help Center"), nav a[href*="help"]');
    this.helpCenterUnavailableError = page.locator('text=/help center.*unavailable/i, text=/temporarily.*unavailable/i');
    this.alternativeSupportOptions = page.locator('text=/email|phone|FAQ/i, [data-testid="alternative-support"]');
    
    // Navigation Locators
    this.productsLink = page.locator('a:has-text("Products"), nav a[href*="products"]');
    this.servicesLink = page.locator('a:has-text("Services"), nav a[href*="services"]');
    this.aboutUsLink = page.locator('a:has-text("About"), nav a[href*="about"]');
    this.contactLink = page.locator('a:has-text("Contact"), nav a[href*="contact"]');
    
    // Interactive Features Locators
    this.searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    this.signupButton = page.locator('button:has-text("Sign Up"), a:has-text("Sign Up")');
    this.carousel = page.locator('[data-testid="carousel"], .carousel, .slider');
    this.forms = page.locator('form');
    
    // Layout Locators
    this.mainContent = page.locator('main, [role="main"], .main-content');
    this.header = page.locator('header, [role="banner"]');
    this.footer = page.locator('footer, [role="contentinfo"]');
  }

  async navigate() {
    await this.page.goto('/home');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyHelpCenterEntryPointVisible() {
    await expect(this.helpCenterEntryPoint).toBeVisible({ timeout: 5000 });
  }

  async clickHelpCenterEntryPoint() {
    await this.helpCenterEntryPoint.click();
  }

  async verifyHelpCenterUnavailableError() {
    await expect(this.helpCenterUnavailableError).toBeVisible({ timeout: 5000 });
  }

  async verifyAlternativeSupportOptionsDisplayed() {
    await expect(this.alternativeSupportOptions).toBeVisible();
  }

  async verifyNavigationLinksWorking() {
    await expect(this.productsLink).toBeVisible();
    await expect(this.productsLink).toBeEnabled();
    await expect(this.servicesLink).toBeVisible();
    await expect(this.servicesLink).toBeEnabled();
    await expect(this.aboutUsLink).toBeVisible();
    await expect(this.aboutUsLink).toBeEnabled();
    await expect(this.contactLink).toBeVisible();
    await expect(this.contactLink).toBeEnabled();
  }

  async verifyInteractiveFeaturesWorking() {
    if (await this.searchInput.isVisible()) {
      await expect(this.searchInput).toBeEnabled();
    }
    if (await this.signupButton.isVisible()) {
      await expect(this.signupButton).toBeEnabled();
    }
    if (await this.carousel.isVisible()) {
      await expect(this.carousel).toBeVisible();
    }
  }

  async verifyLayoutIntegrity() {
    await expect(this.header).toBeVisible();
    await expect(this.mainContent).toBeVisible();
    await expect(this.footer).toBeVisible();
    
    const headerBox = await this.header.boundingBox();
    const mainBox = await this.mainContent.boundingBox();
    const footerBox = await this.footer.boundingBox();
    
    expect(headerBox).toBeTruthy();
    expect(mainBox).toBeTruthy();
    expect(footerBox).toBeTruthy();
    
    expect(headerBox.y).toBeLessThan(mainBox.y);
    expect(mainBox.y).toBeLessThan(footerBox.y);
  }

};
