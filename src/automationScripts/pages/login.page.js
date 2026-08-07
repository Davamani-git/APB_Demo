const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username, input[name="username"], input[type="email"]');
    this.passwordInput = page.locator('#password, input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), #login-button');
  }

  async navigate() {
    await this.page.goto('https://platform.example.com');
    await expect(this.page).toHaveURL(/platform\.example\.com/);
  }

  async enterUsername(username) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async simulateLoginFromUnusualLocation(username, password, location) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.page.evaluate((loc) => {
      window.localStorage.setItem('simulatedLocation', loc);
    }, location);
    await this.clickLoginButton();
  }
};
