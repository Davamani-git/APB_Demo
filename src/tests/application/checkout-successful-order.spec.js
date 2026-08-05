const { test, expect } = require('../../fixtures');
const HomePage = require('../../pages/home.page');
const LoginPage = require('../../pages/login.page');
const ProductPage = require('../../pages/product.page');
const CartPage = require('../../pages/cart.page');
const CheckoutPage = require('../../pages/checkout.page');
const TD = require('../../data/workday-test-data');

test.describe('@e2e QE-3852 TS001 TC-001 - Successful Checkout', () => {
  test('should complete checkout with valid payment', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await home.goto(TD.urls.app);
    expect(await home.isLoaded()).toBeTruthy();

    await home.goToLogin();
    await login.login(TD.users.testuser);
    expect(await home.isLoggedIn()).toBeTruthy();

    await product.addAnyPurchasableProductToCart();
    await product.goToCart();
    expect(await cart.isLoaded()).toBeTruthy();
    await cart.proceedToCheckout();
    expect(await checkout.isLoaded()).toBeTruthy();

    await checkout.selectPaymentMethod('card');
    await checkout.enterPaymentDetails(TD.cards.valid);
    expect(await checkout.arePaymentDetailsAccepted()).toBeTruthy();
    await checkout.submitPayment();
    expect(await checkout.isOrderConfirmationDisplayed()).toBeTruthy();
  });
});
