const { test, expect } = require('@playwright/test');
const { CheckoutPage } = require('./pages/checkout.page');
const { ShoppingCartPage } = require('./pages/shoppingCart.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Checkout and Payment', () => {
  test('TC-1171: Successful checkout with credit card payment', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsConsumer('user@example.com', 'User@123');
    await expect(page).toHaveURL(/.*home/);
    
    await shoppingCartPage.addProductToCart('Wireless Mouse', 2);
    await shoppingCartPage.navigateToCart();
    await expect(shoppingCartPage.cartItems).toBeVisible();
    
    await shoppingCartPage.proceedToCheckout();
    await expect(checkoutPage.checkoutPage).toBeVisible();
    
    await checkoutPage.enterShippingAddress('123 Main St', 'New York', 'NY', '10001');
    await checkoutPage.selectPaymentMethod('Credit Card');
    await expect(checkoutPage.creditCardForm).toBeVisible();
    
    await checkoutPage.enterCreditCardDetails('4111111111111111', '12/2025', '123');
    await checkoutPage.placeOrder();
    
    await expect(checkoutPage.orderConfirmation).toBeVisible({ timeout: 5000 });
    await checkoutPage.verifyOrderConfirmationEmail();
  });

  test('TC-1172: Successful checkout with PayPal payment', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsConsumer('user@example.com', 'User@123');
    await expect(page).toHaveURL(/.*home/);
    
    await shoppingCartPage.addProductToCart('Laptop Bag', 1);
    await shoppingCartPage.navigateToCart();
    await shoppingCartPage.proceedToCheckout();
    await expect(checkoutPage.checkoutPage).toBeVisible();
    
    await checkoutPage.enterShippingAddress('456 Oak Ave', 'Los Angeles', 'CA', '90001');
    await checkoutPage.selectPaymentMethod('PayPal');
    
    await checkoutPage.authenticatePayPal('paypal_user@example.com', 'PayPal@123');
    await checkoutPage.confirmPayment();
    
    await expect(checkoutPage.orderConfirmation).toBeVisible();
    await checkoutPage.verifyOrderConfirmationEmail();
  });

  test('TC-1173: Checkout fails with expired credit card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsConsumer('user@example.com', 'User@123');
    await expect(page).toHaveURL(/.*home/);
    
    await shoppingCartPage.addProductToCart('USB Cable', 3);
    await shoppingCartPage.navigateToCart();
    await shoppingCartPage.proceedToCheckout();
    await expect(checkoutPage.checkoutPage).toBeVisible();
    
    await checkoutPage.enterShippingAddress('789 Pine Rd', 'Chicago', 'IL', '60601');
    await checkoutPage.selectPaymentMethod('Credit Card');
    await expect(checkoutPage.creditCardForm).toBeVisible();
    
    await checkoutPage.enterCreditCardDetails('4111111111111111', '12/2020', '123');
    await checkoutPage.placeOrder();
    
    await expect(checkoutPage.paymentErrorMessage).toBeVisible();
    await expect(checkoutPage.paymentErrorMessage).toContainText(/expired|update payment/i);
    await checkoutPage.verifyNoOrderCreated();
  });
});
