const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const config = require('../../config/config');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input[type="email"], #username, #email');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], #password');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")');
    this.errorMessage = page.locator('.error-message, .alert-error, .login-error');
    this.successMessage = page.locator('.success-message, .alert-success');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto(config.baseURL || '/');
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    logger.info('Login page loaded successfully');
  }

  async login(username, password) {
    logger.info(`Logging in with username: ${username}`);
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Login successful');
  }

  async logout() {
    logger.info('Logging out');
    await this.logoutButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Logout successful');
  }

  async verifyLoginError(expectedMessage) {
    logger.info('Verifying login error message');
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
    logger.info('Login error verified');
  }
};