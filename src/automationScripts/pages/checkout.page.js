const { expect } = require('@playwright/test');

exports.CheckoutPage = class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.checkoutHeader = page.locator('#checkout-header');
    this.cardInput = page.locator('#card-number');
    this.expInput = page.locator('#card-exp');
    this.cvvInput = page.locator('#card-cvv');
    this.submitPaymentButton = page.locator('#submit-payment');
    this.paymentAcceptedBanner = page.locator('.payment-accepted');
    this.paymentDeclinedBanner = page.locator('.payment-declined');
    this.retryButton = page.locator('#retry-payment');
    this.selectDifferentMethodButton = page.locator('#select-different-method');
    this.orderConfirmation = page.locator('#order-confirmation');
  }
  async enterPaymentDetails({ card, exp, cvv }) {
    await expect(this.cardInput).toBeVisible();
    await this.cardInput.fill(card);
    await this.expInput.fill(exp);
    await this.cvvInput.fill(cvv);
  }
  async submitPayment() {
    await expect(this.submitPaymentButton).toBeVisible();
    await this.submitPaymentButton.click();
  }
};
