const { test, expect } = require('../../fixtures');
const testData = require('../../data/workday-test-data');
const Logging = require('../../integrations/logging-reporter');
const CheckoutPage = require('../../pages/workday-checkout.page');
const NotificationPage = require('../../pages/workday-notification.page');

test.describe('Notification Flows', () => {
  test('QE-1570 TS-001 TC-001 - Success payment triggers email and SMS', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    const notification = new NotificationPage(page);
    Logging.info('Completing payment with valid card');
    await checkout.goto(testData.checkout.url);
    await checkout.enterPaymentDetails(testData.checkout.validCard);
    await checkout.submitPayment();
    Logging.info('Verifying success notification email');
    await expect(notification.hasEmail(testData.notifications.successEmail)).toBeTruthy();
    Logging.info('Verifying success notification SMS');
    await expect(notification.hasSms(testData.notifications.successPhone)).toBeTruthy();
  });

  test('QE-1570 TS-002 TC-001 - Failed payment triggers failure notifications', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    const notification = new NotificationPage(page);
    Logging.info('Attempting payment with invalid card');
    await checkout.goto(testData.checkout.url);
    await checkout.enterPaymentDetails(testData.checkout.invalidCard);
    await checkout.submitPayment();
    Logging.info('Verifying failure email notification');
    await expect(notification.hasEmail(testData.notifications.failureEmail)).toBeTruthy();
    Logging.info('Verifying failure SMS notification');
    await expect(notification.hasSms(testData.notifications.failurePhone)).toBeTruthy();
  });

  test('QE-1570 TS-003 TC-001 - Invalid notification destinations are logged as errors', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    const notification = new NotificationPage(page);
    Logging.info('Completing payment with invalid notification details');
    await checkout.goto(testData.checkout.url);
    await checkout.enterPaymentDetails(testData.checkout.validCard, testData.notifications.invalidEmail, testData.notifications.invalidPhone);
    await checkout.submitPayment();
    Logging.info('Checking notification delivery failed');
    await expect(notification.deliveryFailed()).toBeTruthy();
    Logging.info('Checking error log for false success absence');
    await expect(notification.hasNoFalseSuccess()).toBeTruthy();
  });
});