const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username, [name="username"], [data-testid="username"]');
    this.passwordInput = page.locator('#password, [name="password"], [data-testid="password"]');
    this.loginButton = page.locator('button[type="submit"], #login-button, [data-testid="login-button"]');
    this.loginForm = page.locator('form, [data-testid="login-form"]');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await expect(this.loginForm).toBeVisible();
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