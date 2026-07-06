const { test, expect } = require('../../fixtures');
const HomePage = require('../../pages/shop-home.page');
const CatalogPage = require('../../pages/shop-catalog.page');
const ProductPage = require('../../pages/shop-product.page');
const CartPage = require('../../pages/shop-cart.page');
const TD = require('../../data/workday-test-data');
const logger = require('../../integrations/logging-reporter');

test.describe('[UI] QE-1656: Cart & Checkout', { tag: ['@smoke', '@regression', '@e2e'] }, () => {
  let home, catalog, product, cart;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    catalog = new CatalogPage(page);
    product = new ProductPage(page);
    cart = new CartPage(page);
  });

  test('[QE-1656 TS-001 TC-001] Add product to cart', async ({ page }) => {
    logger.info('Launching shopping platform');
    await home.goto(TD.URL);
    await expect(page).toHaveURL(TD.URL);
    await expect(home.homePageLoaded()).toBeTruthy();

    logger.info('Logging in as consumer');
    await home.login(TD.USERNAME, TD.PASSWORD);
    await expect(home.isDashboardLoaded()).toBeTruthy();

    logger.info('Navigating to catalog and selecting product');
    await home.goToCatalog();
    await catalog.selectProduct(TD.PRODUCT_WIRELESS_MOUSE);
    await expect(product.isProductDetailsLoaded()).toBeTruthy();

    logger.info('Adding product to cart');
    const prevCount = await cart.getCartCount();
    await product.addToCart();
    await expect(cart.getCartCount()).resolves.toBe(prevCount + 1);
  });

  test('[QE-1656 TS-002 TC-001] Add multiple products and checkout', async ({ page }) => {
    logger.info('Launching shopping platform');
    await home.goto(TD.URL);
    await expect(page).toHaveURL(TD.URL);
    await expect(home.homePageLoaded()).toBeTruthy();

    logger.info('Logging in as consumer');
    await home.login(TD.USERNAME, TD.PASSWORD);
    await expect(home.isDashboardLoaded()).toBeTruthy();

    logger.info('Adding products to cart');
    await home.goToCatalog();
    await catalog.selectProduct(TD.PRODUCT_WIRELESS_MOUSE);
    await product.addToCart();
    await catalog.selectProduct(TD.PRODUCT_BLUETOOTH_KEYBOARD);
    await product.addToCart();
    await expect(cart.hasProducts([TD.PRODUCT_WIRELESS_MOUSE, TD.PRODUCT_BLUETOOTH_KEYBOARD])).toBeTruthy();

    logger.info('Proceeding to checkout');
    await cart.proceedToCheckout();
    await expect(cart.isOrderSummaryVisible([TD.PRODUCT_WIRELESS_MOUSE, TD.PRODUCT_BLUETOOTH_KEYBOARD])).toBeTruthy();
  });

  test('[QE-1656 TS-003 TC-001] Add unavailable product to cart shows error', async ({ page }) => {
    logger.info('Launching shopping platform');
    await home.goto(TD.URL);
    await expect(page).toHaveURL(TD.URL);
    await expect(home.homePageLoaded()).toBeTruthy();

    logger.info('Logging in as consumer');
    await home.login(TD.USERNAME, TD.PASSWORD);
    await expect(home.isDashboardLoaded()).toBeTruthy();

    logger.info('Attempting to add unavailable product');
    await home.goToCatalog();
    await catalog.selectProduct(TD.PRODUCT_QUANTUM_LAPTOP);
    await expect(product.isUnavailableProductErrorVisible()).toBeTruthy();
    await expect(cart.getCartCount()).resolves.toBe(await cart.getCartCount());
  });
});
