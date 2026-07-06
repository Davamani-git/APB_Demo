const loc = require('./locators/shop-product.locators');

class ProductPage {
  constructor(page) { this.page = page; }
  async isProductDetailsLoaded() { return (await loc.productTitle(this.page)).isVisible(); }
  async addToCart() { await (await loc.addToCartBtn(this.page)).click(); }
  async isUnavailableProductErrorVisible() { return (await loc.unavailableProductError(this.page)).isVisible(); }
}
module.exports = ProductPage;
