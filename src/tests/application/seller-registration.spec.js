const { test, expect } = require('../../fixtures');
const SellerRegistrationPage = require('../../pages/seller-registration.page');
const TD = require('../../data/workday-test-data');
const logger = require('../../integrations/logging-reporter');

test.describe('[UI] QE-1586 TS001: Seller Registration', { tag: ['@regression', '@seller'] }, () => {
  let sellerReg;
  test('QE-1586 TS001 TC-001: Verify registration with valid business details', async ({ page }) => {
    sellerReg = new SellerRegistrationPage(page);
    await sellerReg.goto(TD.urls.sellerRegistration);
    logger.info('Navigated to Seller Registration page');
    await expect(page).toHaveURL(TD.urls.sellerRegistration);
    await sellerReg.navigateToSellerRegistration();
    await expect(sellerReg.form()).toBeVisible();
    logger.info('Seller registration form is displayed');
    await sellerReg.fillBusinessDetails({
      businessName: TD.seller.businessName,
      address: TD.seller.address,
      taxId: TD.seller.taxId,
      contact: TD.seller.contact
    });
    logger.info('Filled business details');
    await sellerReg.agreeToTerms();
    await expect(sellerReg.termsCheckbox()).toBeChecked();
    logger.info('Agreed to terms and conditions');
    await sellerReg.submit();
    await expect(sellerReg.successMessage()).toBeVisible();
    logger.info('Seller registration successful, confirmation message displayed');
  });
});