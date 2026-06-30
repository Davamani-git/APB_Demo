const { test, expect } = require('../../fixtures');
const ShoppingCartPage = require('../../pages/shopping-cart.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] QE-1584: Shopping Cart', { tag: ['@regression', '@e2e'] }, () => {
  let cart;

  test.beforeEach(async ({ page }) => {
    cart = new ShoppingCartPage(page);
  });

  test('[QE-1584 TS001 TC-001] Add product to cart and verify', async ({ page }) => {
    await cart.login(TD.consumer.username, TD.consumer.password);
    await expect(page).toHaveURL(TD.urls.consumerDashboard);
    await cart.browseCatalog();
    await cart.selectProduct(TD.products.productA);
    await expect(cart.productDetailsPage).toBeVisible();
    await cart.addToCart(TD.products.productA);
    await expect(cart.cartSummary).toContainText(TD.products.productA);
    await expect(cart.cartSummary).toContainText('$25');
    await expect(cart.cartSummary).toContainText('Qty: 1');
  });

  test('[QE-1584 TS002 TC-001] Update and remove items', async ({ page }) => {
    await cart.viewCartWithProduct(TD.products.productB, 2);
    await expect(cart.cartSummary).toContainText('Qty: 2');
    await cart.updateCartQuantity(TD.products.productB, 1);
    await expect(cart.cartSummary).toContainText('Qty: 1');
    await cart.removeFromCart(TD.products.productB);
    await expect(cart.cartSummary).not.toContainText(TD.products.productB);
  });

  test('[QE-1584 TS003 TC-001] Empty cart scenario', async ({ page }) => {
    await cart.removeAllItems();
    await expect(cart.cartSummary).not.toContainText(TD.products.anyProduct);
    await cart.viewCart();
    await expect(cart.emptyCartMessage).toHaveText(TD.cart.emptyMessage);
  });
});
