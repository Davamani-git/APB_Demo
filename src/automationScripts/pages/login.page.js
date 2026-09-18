const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.logoutButton = page.locator('a[href="/logout"]');
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigate() {
    await this.page.goto(process.env.BASE_URL || 'https://app.providerenrollment.com');
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    logger.info('Navigated to login page');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    logger.info(`Entering credentials for user: ${username}`);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Login submitted');
  }

  async logout() {
    await expect(this.logoutButton).toBeVisible();
    await this.logoutButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('User logged out');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};
