const locators = {
  cartCount: (page) => page.locator('[data-testid="cart-count"]'),
  cartProduct: (page, name) => page.locator(`[data-testid="cart-product-${name}"]`),
  checkoutBtn: (page) => page.locator('[data-testid="checkout-btn"]'),
  orderSummaryProduct: (page, name) => page.locator(`[data-testid="order-summary-product-${name}"]`),
};
module.exports = locators;
