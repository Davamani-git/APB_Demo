const { test, expect } = require('@playwright/test');
const { ProductPage } = require('./pages/product.page');
const { CartPage } = require('./pages/cart.page');
const { CheckoutPage } = require('./pages/checkout.page');
const { logger } = require('../../data/logger');

const testData = {
  product: 'Laptop',
  shipping: '123 Main St',
  paymentCard: '4111111111111111',
};

test('TS-005 TC-1114: Checkout flow', async ({ page }) => {
  logger.info('Step 1: Add products to cart and proceed to checkout');
  const productPage = new ProductPage(page);
  await productPage.addProductToCart(testData.product, 1);
  const cartPage = new CartPage(page);
  await cartPage.openCart();
  await cartPage.proceedToCheckout();
  const checkoutPage = new CheckoutPage(page);
  await expect(checkoutPage.checkoutContainer).toBeVisible();

  logger.info('Step 2: Enter shipping and payment details');
  await checkoutPage.enterShippingDetails(testData.shipping);
  await checkoutPage.enterPaymentDetails(testData.paymentCard);
  await expect(checkoutPage.paymentDetailsAcceptedMessage).toBeVisible();

  logger.info('Step 3: Submit the order');
  await checkoutPage.submitOrder();
  await expect(checkoutPage.orderConfirmationContainer).toBeVisible();
});