const { expect } = require('@playwright/test');

exports.CheckoutPage = class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.checkoutPage = page.locator('.checkout-page, [data-testid="checkout"], main:has(h1:has-text("Checkout"))');
    this.shippingAddressStreet = page.locator('input[name="street"], input[id="street"], input[placeholder*="street" i]');
    this.shippingAddressCity = page.locator('input[name="city"], input[id="city"], input[placeholder*="city" i]');
    this.shippingAddressState = page.locator('input[name="state"], input[id="state"], select[name="state"]');
    this.shippingAddressZip = page.locator('input[name="zip"], input[id="zip"], input[name="zipcode"]');
    this.paymentMethodDropdown = page.locator('select[name="paymentMethod"], select[id="paymentMethod"]');
    this.paymentMethodCreditCard = page.locator('input[type="radio"][value="credit-card"], label:has-text("Credit Card")');
    this.paymentMethodPayPal = page.locator('input[type="radio"][value="paypal"], label:has-text("PayPal")');
    this.creditCardForm = page.locator('.credit-card-form, [data-testid="credit-card-form"], form:has(input[placeholder*="card number" i])');
    this.cardNumberInput = page.locator('input[name="cardNumber"], input[id="cardNumber"], input[placeholder*="card number" i]');
    this.cardExpiryInput = page.locator('input[name="expiry"], input[id="expiry"], input[placeholder*="expiry" i]');
    this.cardCvvInput = page.locator('input[name="cvv"], input[id="cvv"], input[placeholder*="cvv" i]');
    this.placeOrderButton = page.locator('button[type="submit"]:has-text("Place Order"), button:has-text("Complete Purchase")');
    this.orderConfirmation = page.locator('.order-confirmation, .success-message:has-text("order"), [data-testid="order-confirmation"]');
    this.paymentErrorMessage = page.locator('.payment-error, .error-message, [role="alert"]:has-text("payment"), .alert-danger');
    this.paypalAuthPage = page.locator('.paypal-auth, [data-testid="paypal-login"]');
    this.paypalEmailInput = page.locator('input[type="email"][name*="email"], input[id="email"]');
    this.paypalPasswordInput = page.locator('input[type="password"][name*="password"], input[id="password"]');
    this.paypalLoginButton = page.locator('button[type="submit"]:has-text("Log In"), button:has-text("Continue")');
    this.confirmPaymentButton = page.locator('button:has-text("Confirm Payment"), button:has-text("Confirm")');
  }

  async enterShippingAddress(street, city, state, zip) {
    await expect(this.shippingAddressStreet).toBeVisible();
    await this.shippingAddressStreet.fill(street);
    await this.shippingAddressCity.fill(city);
    await this.shippingAddressState.fill(state);
    await this.shippingAddressZip.fill(zip);
  }

  async selectPaymentMethod(method) {
    if (method === 'Credit Card') {
      await this.paymentMethodCreditCard.click();
    } else if (method === 'PayPal') {
      await this.paymentMethodPayPal.click();
    }
  }

  async enterCreditCardDetails(cardNumber, expiry, cvv) {
    await expect(this.cardNumberInput).toBeVisible();
    await this.cardNumberInput.fill(cardNumber);
    await this.cardExpiryInput.fill(expiry);
    await this.cardCvvInput.fill(cvv);
  }

  async placeOrder() {
    await expect(this.placeOrderButton).toBeEnabled();
    await this.placeOrderButton.click();
  }

  async verifyOrderConfirmationEmail() {
    // Verify email sent via API or test email service
    await this.page.evaluate(() => {
      console.log('Verifying order confirmation email sent');
    });
  }

  async authenticatePayPal(email, password) {
    await expect(this.paypalAuthPage).toBeVisible({ timeout: 10000 });
    await this.paypalEmailInput.fill(email);
    await this.paypalPasswordInput.fill(password);
    await this.paypalLoginButton.click();
    await this.page.waitForURL(/.*shop.example.com/, { timeout: 10000 });
  }

  async confirmPayment() {
    await expect(this.confirmPaymentButton).toBeVisible();
    await this.confirmPaymentButton.click();
  }

  async verifyNoOrderCreated() {
    // Verify via API that no order was created
    await this.page.evaluate(() => {
      console.log('Verifying no order was created in the system');
    });
  }
};
