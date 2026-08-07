const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.homeContainer = page.locator('div.home-page');
    this.loginButton = page.locator('button#login');
  }
  async navigate(url) {
    await this.page.goto(url);
  }
  async goToLogin() {
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
  }
};