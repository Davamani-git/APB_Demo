const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { SearchPage } = require('./pages/search.page');
const { ProductPage } = require('./pages/product.page');
const { CartPage } = require('./pages/cart.page');
const { logger } = require('../../data/logger');

const testData = {
  username: 'testuser',
  password: 'Pass@123',
  product: 'Laptop',
};

test('TS-004 TC-1113: Add product to cart and verify cart', async ({ page }) => {
  logger.info('Step 1: Login and search for a product');
  const loginPage = new LoginPage(page);
  await loginPage.login(testData.username, testData.password);
  await expect(loginPage.dashboardContainer).toBeVisible();

  const searchPage = new SearchPage(page);
  await searchPage.searchProduct(testData.product);
  await expect(searchPage.productList).toBeVisible();

  logger.info('Step 2: Select product and add to cart');
  const productPage = new ProductPage(page);
  await productPage.addProductToCart(testData.product, 1);

  logger.info('Step 3: Open the shopping cart');
  const cartPage = new CartPage(page);
  await cartPage.openCart();
  await expect(cartPage.cartContainer).toBeVisible();
  await expect(cartPage.cartProduct(testData.product)).toBeVisible();
});