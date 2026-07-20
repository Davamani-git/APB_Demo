const { expect } = require('@playwright/test');
const { logger } = require('../../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-submit');
  }
  async navigate(url) {
    logger.info(`Navigating to login page: ${url}`);
    await this.page.goto(url);
    await expect(this.usernameInput).toBeVisible();
  }
  async login(username, password) {
    logger.info('Performing login');
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.page.locator('#dashboard')).toBeVisible();
  }
};
