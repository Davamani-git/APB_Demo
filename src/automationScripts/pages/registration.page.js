const { expect } = require('@playwright/test');

exports.RegistrationPage = class RegistrationPage {
  constructor(page) {
    this.page = page;
    this.loginOrRegisterContainer = page.locator('div.login-register');
    this.registerButton = page.locator('button#register');
    this.registrationFormContainer = page.locator('form#registration');
    this.usernameInput = page.locator('input[name="username"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.registrationSubmitButton = page.locator('button[type="submit"]');
    this.dashboardContainer = page.locator('div.dashboard');
  }
  async navigate(url) {
    await this.page.goto(url);
  }
  async clickRegisterButton() {
    await expect(this.registerButton).toBeVisible();
    await this.registerButton.click();
  }
  async enterRegistrationDetails(username, email, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }
  async submitRegistration() {
    await expect(this.registrationSubmitButton).toBeEnabled();
    await this.registrationSubmitButton.click();
  }
};