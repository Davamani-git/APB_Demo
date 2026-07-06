const locators = {
  productTitle: (page) => page.locator('[data-testid="product-title"]'),
  addToCartBtn: (page) => page.locator('[data-testid="add-to-cart-btn"]'),
  unavailableProductError: (page) => page.locator('[data-testid="unavailable-product-error"]'),
};
module.exports = locators;
