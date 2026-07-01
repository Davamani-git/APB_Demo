const { test, expect } = require('../../fixtures');
const SellerRegistrationPage = require('../../pages/seller-registration.page');
const TD = require('../../data/workday-test-data');
const logger = require('../../integrations/logging-reporter');

test.describe('[UI] QE-1586 TS003: Seller Registration Validation', { tag: ['@regression', '@seller'] }, () => {
  let sellerReg;
  test('QE-1586 TS003 TC-001: Verify mandatory fields validation', async ({ page }) => {
    sellerReg = new SellerRegistrationPage(page);
    await sellerReg.goto(TD.urls.sellerRegistration);
    logger.info('Navigated to Seller Registration page');
    await sellerReg.fillBusinessDetails({
      businessName: '',
      address: TD.seller.address,
      taxId: '',
      contact: TD.seller.contact
    });
    await sellerReg.submit();
    await expect(sellerReg.validationMessages()).toBeVisible();
    await expect(sellerReg.businessNameField()).toHaveClass(/invalid/);
    await expect(sellerReg.taxIdField()).toHaveClass(/invalid/);
    logger.info('Validation messages displayed for missing fields');
  });
});