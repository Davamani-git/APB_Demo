const { expect } = require('@playwright/test');

exports.CartPage = class CartPage {
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.locator('#checkout');
  }
  async proceedToCheckout() {
    await expect(this.checkoutButton).toBeVisible();
    await this.checkoutButton.click();
  }
};
