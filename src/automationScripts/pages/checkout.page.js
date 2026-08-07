const { expect } = require('@playwright/test');

exports.CheckoutPage = class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.checkoutForm = page.locator('form#checkout-form, [data-testid="checkout-form"]');
    this.proceedToCheckoutButton = page.locator('button:has-text("Proceed to Checkout"), #proceed-checkout');
    this.creditCardNumberInput = page.locator('#card-number, input[name="cardNumber"]');
    this.expiryDateInput = page.locator('#expiry-date, input[name="expiryDate"]');
    this.cvvInput = page.locator('#cvv, input[name="cvv"]');
    this.addressInput = page.locator('#address, input[name="address"]');
    this.cityInput = page.locator('#city, input[name="city"]');
    this.zipInput = page.locator('#zip, input[name="zip"]');
    this.completePurchaseButton = page.locator('button:has-text("Complete Purchase"), #complete-purchase');
    this.orderConfirmation = page.locator('.order-confirmation, [data-testid="order-confirmation"]');
    this.paymentError = page.locator('.payment-error, .alert-danger, [data-testid="payment-error"]');
    this.updatePaymentPrompt = page.locator('.update-payment, [data-testid="update-payment-prompt"]');
  }

  async clickProceedToCheckout() {
    await expect(this.proceedToCheckoutButton).toBeEnabled();
    await this.proceedToCheckoutButton.click();
  }

  async enterCreditCardNumber(cardNumber) {
    await expect(this.creditCardNumberInput).toBeVisible();
    await this.creditCardNumberInput.fill(cardNumber);
  }

  async enterExpiryDate(expiryDate) {
    await expect(this.expiryDateInput).toBeVisible();
    await this.expiryDateInput.fill(expiryDate);
  }

  async enterCVV(cvv) {
    await expect(this.cvvInput).toBeVisible();
    await this.cvvInput.fill(cvv);
  }

  async enterBillingAddress(address, city, zip) {
    await expect(this.addressInput).toBeVisible();
    await this.addressInput.fill(address);
    await this.cityInput.fill(city);
    await this.zipInput.fill(zip);
  }

  async clickCompletePurchase() {
    await expect(this.completePurchaseButton).toBeEnabled();
    await this.completePurchaseButton.click();
  }

  async verifyOrderConfirmationEmail(email) {
    const emailConfirmation = this.page.locator(`.email-sent:has-text("${email}")`);
    await expect(emailConfirmation).toBeVisible();
  }

  async verifyNoOrderCreated() {
    await expect(this.checkoutForm).toBeVisible();
    const orderNumber = this.page.locator('.order-number');
    await expect(orderNumber).toHaveCount(0);
  }
};
