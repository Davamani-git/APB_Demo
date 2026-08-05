const { expect } = require('@playwright/test');

exports.ProductPage = class ProductPage {
  constructor(page) {
    this.page = page;
    this.addToCartButton = page.locator('#add-to-cart');
  }
  async addToCart() {
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
  }
};
