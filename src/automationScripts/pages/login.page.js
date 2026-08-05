const { expect } = require('@playwright/test');
const { getUrl } = require('../../data/env');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-testid="login-username"]');
    this.passwordInput = page.locator('[data-testid="login-password"]');
    this.loginButton = page.locator('[data-testid="login-submit"]');
    this.loginForm = page.locator('[data-testid="login-form"]');
  }
  async navigate() {
    await this.page.goto(getUrl('dashboard'));
    logger.info('Navigated to login page');
  }
  async assertLoginPageLoaded() {
    await expect(this.loginForm).toBeVisible();
    logger.info('Login page loaded');
  }
  async login(username, password) {
    await this.assertLoginPageLoaded();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    logger.info(`Login attempted for user: ${username}`);
  }
};
