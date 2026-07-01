const { test, expect } = require('../../fixtures');
const SellerProfilePage = require('../../pages/seller-profile.page');
const TD = require('../../data/workday-test-data');
const logger = require('../../integrations/logging-reporter');

test.describe('[UI] QE-1586 TS002: Seller Profile Update', { tag: ['@regression', '@seller'] }, () => {
  let sellerProfile;
  test('QE-1586 TS002 TC-001: Verify updating profile information', async ({ page }) => {
    sellerProfile = new SellerProfilePage(page);
    await sellerProfile.login(TD.seller.username, TD.seller.password);
    logger.info('Logged in as seller');
    await expect(page).toHaveURL(TD.urls.sellerDashboard);
    await sellerProfile.gotoProfileSettings();
    await expect(sellerProfile.profileForm()).toBeVisible();
    await sellerProfile.updateProfile({
      phone: TD.seller.updatedPhone,
      address: TD.seller.updatedAddress
    });
    await sellerProfile.saveChanges();
    await expect(sellerProfile.successMessage()).toBeVisible();
    await expect(sellerProfile.profilePhone()).toHaveText(TD.seller.updatedPhone);
    await expect(sellerProfile.profileAddress()).toHaveText(TD.seller.updatedAddress);
    logger.info('Profile updated and dashboard reflects changes');
  });
});