const { test, expect } = require('../../fixtures');
const CheckoutPage = require('../../pages/checkout.page');
const EmailUtils = require('../../helpers/email.utils');
const NotificationPage = require('../../pages/notification.page');
const TD = require('../../data/workday-test-data');

test.describe('@e2e QE-3852 TS003 TC-001 - Order Confirmation Notifications', () => {
  test('should receive order confirmation via email and in-app notification', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    const notification = new NotificationPage(page);

    await checkout.completeOrderWithValidPayment(TD.users.testuser, TD.cards.valid);
    expect(await checkout.isOrderConfirmationDisplayed()).toBeTruthy();

    const emailReceived = await EmailUtils.isOrderConfirmationEmailReceived(TD.users.testuser.email);
    expect(emailReceived).toBeTruthy();

    await notification.goto();
    expect(await notification.hasOrderConfirmationNotification()).toBeTruthy();
  });
});
