const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input[type="email"], #username');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], #password');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
  }

  async navigate(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async enterUsername(username) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
};
