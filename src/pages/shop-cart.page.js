const loc = require('./locators/shop-cart.locators');

class CartPage {
  constructor(page) { this.page = page; }
  async getCartCount() { return Number(await (await loc.cartCount(this.page)).innerText()); }
  async hasProducts(productNames) {
    for (const name of productNames) {
      if (!await (await loc.cartProduct(this.page, name)).isVisible()) return false;
    }
    return true;
  }
  async proceedToCheckout() { await (await loc.checkoutBtn(this.page)).click(); }
  async isOrderSummaryVisible(productNames) {
    for (const name of productNames) {
      if (!await (await loc.orderSummaryProduct(this.page, name)).isVisible()) return false;
    }
    return true;
  }
}
module.exports = CartPage;
