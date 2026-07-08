const { test, expect } = require('../../fixtures');
const ConsumerPage = require('../../pages/consumer.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] Checkout Flow', () => {
  test('[QE-1871 TS-001 TC-001] Consumer completes checkout with supported payment', async ({ page }) => {
    const consumer = new ConsumerPage(page);
    await consumer.login(TD.users.consumer1);
    await consumer.addToCart(TD.products.WidgetA);
    await expect(await consumer.isItemInCart(TD.products.WidgetA)).toBeTruthy();
    await consumer.proceedToCheckout();
    await consumer.selectPaymentMethod(TD.payments.creditCard);
    await expect(await consumer.isPaymentMethodAccepted(TD.payments.creditCard)).toBeTruthy();
    await consumer.completePayment();
    await expect(await consumer.isOrderConfirmed()).toBeTruthy();
  });
});
