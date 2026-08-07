const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/home.page');
const { LoginPage } = require('./pages/login.page');
const { ProductPage } = require('./pages/product.page');
const { CheckoutPage } = require('./pages/checkout.page');
const { logger } = require('../../data/logger');

const testData = {
  url: 'https://app.example.com',
  username: 'testuser',
  password: 'Pass@123',
  cardNumber: '4111111111111111',
  cardExp: '12/26',
  cardCvv: '123',
};

test('TS-001 TC-1094: Complete purchase flow', async ({ page }) => {
  logger.info('Step 1: Launch the online shopping platform');
  const homePage = new HomePage(page);
  await homePage.navigate(testData.url);
  await expect(homePage.homeContainer).toBeVisible();

  logger.info('Step 2: Login with valid credentials');
  const loginPage = new LoginPage(page);
  await homePage.goToLogin();
  await expect(loginPage.usernameInput).toBeVisible();
  await loginPage.login(testData.username, testData.password);
  await expect(loginPage.dashboardContainer).toBeVisible();

  logger.info('Step 3: Add product(s) to cart and proceed to checkout');
  const productPage = new ProductPage(page);
  await productPage.addAnyProductToCart();
  await productPage.proceedToCheckout();
  const checkoutPage = new CheckoutPage(page);
  await expect(checkoutPage.checkoutContainer).toBeVisible();

  logger.info('Step 4: Select payment method and enter details');
  await checkoutPage.selectPaymentMethod('card');
  await checkoutPage.enterPaymentDetails(testData.cardNumber, testData.cardExp, testData.cardCvv);
  await expect(checkoutPage.paymentDetailsAcceptedMessage).toBeVisible();

  logger.info('Step 5: Confirm and submit the payment');
  await checkoutPage.confirmAndSubmitPayment();
  await expect(checkoutPage.orderConfirmationContainer).toBeVisible();
});