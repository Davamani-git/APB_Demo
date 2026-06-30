const { test, expect } = require('../../fixtures');
const SellerRegistrationPage = require('../../pages/seller-registration.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] QE-1586: Seller Registration', { tag: ['@regression', '@e2e'] }, () => {
  let sellerReg;

  test.beforeEach(async ({ page }) => {
    sellerReg = new SellerRegistrationPage(page);
    await sellerReg.goto(TD.urls.sellerRegistration);
  });

  test('[QE-1586 TS001 TC-001] Seller can register with valid details', async ({ page }) => {
    await expect(page).toHaveURL(TD.urls.sellerRegistration);
    await expect(sellerReg.form).toBeVisible();
    await sellerReg.openSellerRegistration();
    await expect(sellerReg.registrationForm).toBeVisible();
    await sellerReg.fillBusinessDetails({
      name: TD.seller.validBusinessName,
      address: TD.seller.validAddress,
      taxId: TD.seller.validTaxId,
      contact: TD.seller.validContact
    });
    await expect(sellerReg.fields.businessName).toHaveValue(TD.seller.validBusinessName);
    await expect(sellerReg.fields.address).toHaveValue(TD.seller.validAddress);
    await expect(sellerReg.fields.taxId).toHaveValue(TD.seller.validTaxId);
    await expect(sellerReg.fields.contact).toHaveValue(TD.seller.validContact);
    await sellerReg.agreeToTerms();
    await expect(sellerReg.termsCheckbox).toBeChecked();
    await sellerReg.submitRegistration();
    await expect(sellerReg.successMessage).toHaveText(TD.seller.registrationSuccessMessage);
  });

  test('[QE-1586 TS003 TC-001] Validation of mandatory fields', async ({ page }) => {
    await expect(sellerReg.registrationForm).toBeVisible();
    await sellerReg.fillBusinessDetails({
      name: '',
      address: TD.seller.validAddress,
      taxId: '',
      contact: TD.seller.validContact
    });
    await sellerReg.submitRegistration();
    await expect(sellerReg.validationMessages.businessName).toHaveText(TD.seller.validation.businessNameRequired);
    await expect(sellerReg.validationMessages.taxId).toHaveText(TD.seller.validation.taxIdRequired);
  });
});
