const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-testid="username"], input[name="username"], input[type="email"]');
    this.passwordInput = page.locator('[data-testid="password"], input[name="password"], input[type="password"]');
    this.loginButton = page.locator('[data-testid="login-button"], button[type="submit"]');
    this.logoutButton = page.locator('[data-testid="logout-button"], .logout-link');
    this.dashboardIndicator = page.locator('[data-testid="dashboard"], .dashboard-container');
  }

  async navigate() {
    logger.info('Navigating to login page');
    await this.page.goto('https://helpcenter.example.com/login');
  }

  async login(username, password) {
    logger.info(`Logging in as: ${username}`);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyAuthenticationSuccess() {
    logger.info('Verifying authentication success');
    await expect(this.dashboardIndicator).toBeVisible();
  }

  async logout() {
    logger.info('Logging out');
    await this.logoutButton.click();
  }
};
