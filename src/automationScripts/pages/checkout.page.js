const { expect } = require('@playwright/test');

exports.CheckoutPage = class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.checkoutContainer = page.locator('div.checkout-page');
    this.shippingInput = page.locator('input[name="shipping"]');
    this.paymentCardInput = page.locator('input[name="paymentCard"]');
    this.paymentDetailsAcceptedMessage = page.locator('div.payment-accepted');
    this.submitOrderButton = page.locator('button#submit-order');
    this.orderConfirmationContainer = page.locator('div.order-confirmation');
  }
  async enterShippingDetails(address) {
    await expect(this.shippingInput).toBeVisible();
    await this.shippingInput.fill(address);
  }
  async enterPaymentDetails(card) {
    await expect(this.paymentCardInput).toBeVisible();
    await this.paymentCardInput.fill(card);
  }
  async submitOrder() {
    await expect(this.submitOrderButton).toBeVisible();
    await this.submitOrderButton.click();
  }
};