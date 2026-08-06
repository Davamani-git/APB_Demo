const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"], input[id="email"], input[type="email"]');
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Login"), button:has-text("Sign In"), button[id="login"]');
    this.dashboardIndicator = page.locator('.dashboard, [data-testid="dashboard"], h1:has-text("Dashboard")');
  }

  async navigate() {
    await this.page.goto('https://shop.example.com/login');
  }

  async loginAsSeller(email, password) {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsConsumer(email, password) {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsAdmin(email, password) {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
};
