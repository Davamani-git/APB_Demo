const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.roleDropdown = page.locator('#role');
    this.loginButton = page.locator('button[type="submit"]');
    this.dashboardHeader = page.locator('h1:has-text("Dashboard")');
    this.errorMessage = page.locator('.error-message');
  }

  async navigate() {
    await this.page.goto('/login');
    await expect(this.loginButton).toBeVisible();
    logger.info('Navigated to login page');
  }

  async login(role) {
    await expect(this.roleDropdown).toBeVisible();
    await this.roleDropdown.selectOption({ label: role });
    await this.usernameInput.fill('testuser');
    await this.passwordInput.fill('testpass');
    await this.loginButton.click();
    await expect(this.dashboardHeader).toBeVisible({ timeout: 10000 });
    logger.info(`Logged in as ${role}`);
  }

  async loginWithNoAssignments(role) {
    await expect(this.roleDropdown).toBeVisible();
    await this.roleDropdown.selectOption({ label: role });
    await this.usernameInput.fill('noassignments');
    await this.passwordInput.fill('testpass');
    await this.loginButton.click();
    await expect(this.dashboardHeader).toBeVisible({ timeout: 10000 });
    logger.info(`Logged in as ${role} with no assignments`);
  }
};