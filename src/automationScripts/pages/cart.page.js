const { expect } = require('@playwright/test');

exports.CartPage = class CartPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.locator('a#cart');
    this.cartContainer = page.locator('div.cart-page');
    this.checkoutButton = page.locator('button#checkout');
  }
  async openCart() {
    await expect(this.cartIcon).toBeVisible();
    await this.cartIcon.click();
    await expect(this.cartContainer).toBeVisible();
  }
  async proceedToCheckout() {
    await expect(this.checkoutButton).toBeVisible();
    await this.checkoutButton.click();
  }
};