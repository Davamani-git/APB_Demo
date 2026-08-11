const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.mfaCodeInput = page.locator('#mfa-code');
    this.loginButton = page.locator('button[type="submit"]');
    this.mfaSubmitButton = page.locator('button#mfa-submit');
  }

  async navigate() {
    await this.page.goto('https://app.personalfinancemanager.com');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithMFA(username, password, mfaCode) {
    await this.login(username, password);
    await expect(this.mfaCodeInput).toBeVisible();
    await this.mfaCodeInput.fill(mfaCode);
    await this.mfaSubmitButton.click();
  }
};
