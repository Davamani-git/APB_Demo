const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.homeBanner = page.locator('#home-banner');
    this.loginButton = page.locator('#login-button');
    this.dashboard = page.locator('#dashboard');
    this.productList = page.locator('.product-list .product-item');
  }
  async goto(url) {
    await this.page.goto(url);
  }
  async gotoLogin() {
    await this.loginButton.click();
  }
  async selectAnyProduct() {
    await expect(this.productList.first()).toBeVisible();
    await this.productList.first().click();
  }
};
