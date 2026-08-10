const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.loginPageContainer = page.locator('[data-testid="login-page"], .login-container, #login-page');
    this.usernameInput = page.locator('input[name="username"], input[type="email"], #username, #email');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], #password');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), #login-button');
    this.logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), [data-testid="logout-button"], .logout-btn');
    this.errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
  }

  async navigate() {
    logger.info('Navigating to application login page');
    await this.page.goto('/');
    await expect(this.loginPageContainer).toBeVisible({ timeout: 10000 });
  }

  async fillUsername(username) {
    logger.info(`Filling username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  async fillPassword(password) {
    logger.info('Filling password');
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    logger.info('Clicking login button');
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async login(username, password) {
    logger.info(`Logging in as: ${username}`);
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async logout() {
    logger.info('Logging out');
    await expect(this.logoutButton).toBeVisible();
    await this.logoutButton.click();
    await expect(this.loginPageContainer).toBeVisible({ timeout: 10000 });
  }
};
