const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#loginBtn');
    this.loginPageTitle = page.locator('h1', { hasText: 'Login' });
  }
  async navigate(url) {
    await this.page.goto(url);
    await expect(this.loginPageTitle).toBeVisible();
  }
  async assertLoginPageDisplayed() {
    await expect(this.loginPageTitle).toBeVisible();
  }
  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }
};