const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-testid="username-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.loginSuccessIndicator = page.locator('[data-testid="login-success"]');
    this.errorMessage = page.locator('[data-testid="login-error-message"]');
  }

  async navigate() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoginSuccess() {
    await expect(this.loginSuccessIndicator).toBeVisible();
  }

  async verifyLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    const text = await this.errorMessage.textContent();
    return text.trim();
  }
};