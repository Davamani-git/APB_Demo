const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.logoutButton = page.locator('button:has-text("Logout")');
    this.errorMessage = page.locator('.error-message');
  }

  async navigate() {
    const config = require('../../data/config.json');
    await this.page.goto(config.baseUrl);
    await expect(this.page).toHaveURL(/.*/);
    logger.info('Navigated to login page');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info(`Logged in as ${username}`);
  }

  async logout() {
    await expect(this.logoutButton).toBeVisible();
    await this.logoutButton.click();
    await this.page.waitForLoadState('networkidle');
    logger.info('Logged out successfully');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }
};