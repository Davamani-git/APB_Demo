const { test, expect } = require('../../fixtures');
const testData = require('../../data/workday-test-data');
const Logging = require('../../integrations/logging-reporter');
const CheckoutPage = require('../../pages/workday-checkout.page');

test.describe('Checkout Page Payment Flows', () => {
  test('QE-1571 TS-001 TC-001 - Successful payment and PCI DSS log validation', async ({ page }) => {
    Logging.info('Launching checkout page');
    const checkout = new CheckoutPage(page);
    await checkout.goto(testData.checkout.url);
    await expect(page).toHaveURL(testData.checkout.url);
    Logging.info('Entering valid payment details');
    await checkout.enterPaymentDetails(testData.checkout.validCard);
    Logging.info('Submitting payment');
    await checkout.submitPayment();
    Logging.info('Validating payment processed');
    await expect(checkout.successMessage()).toBeVisible();
    Logging.info('Validating PCI DSS compliance in logs');
    await expect(checkout.isPciDssCompliantLog()).toBeTruthy();
  });

  test('QE-1571 TS-002 TC-001 - Invalid payment details show error', async ({ page }) => {
    Logging.info('Launching checkout page');
    const checkout = new CheckoutPage(page);
    await checkout.goto(testData.checkout.url);
    await expect(page).toHaveURL(testData.checkout.url);
    Logging.info('Entering invalid payment details');
    await checkout.enterPaymentDetails(testData.checkout.invalidCard);
    Logging.info('Submitting payment');
    await checkout.submitPayment();
    Logging.info('Validating error message');
    await expect(checkout.errorMessage()).toBeVisible();
  });

  test('QE-1571 TS-003 TC-001 - Secure connection failure blocks payment', async ({ page, context }) => {
    Logging.info('Simulating SSL failure');
    await context.route('**/checkout', route => route.abort('ssl')); // Simulate SSL failure
    const checkout = new CheckoutPage(page);
    Logging.info('Attempting to load checkout page');
    await expect(checkout.goto(testData.checkout.url)).rejects.toThrow();
    Logging.info('Validating secure connection error');
    await expect(checkout.secureConnectionError()).toBeVisible();
  });
});