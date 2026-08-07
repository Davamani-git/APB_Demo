const { expect } = require('@playwright/test');

exports.ProductPage = class ProductPage {
  constructor(page) {
    this.page = page;
    this.productList = page.locator('div.product-list');
    this.addToCartButton = page.locator('button.add-to-cart');
  }
  async addProductToCart(product, quantity) {
    await expect(this.productList).toBeVisible();
    const productItem = this.page.locator(`div.product-item:has-text("${product}")`);
    await expect(productItem).toBeVisible();
    const addButton = productItem.locator('button.add-to-cart');
    await expect(addButton).toBeVisible();
    for (let i = 0; i < quantity; i++) {
      await addButton.click();
    }
  }
};