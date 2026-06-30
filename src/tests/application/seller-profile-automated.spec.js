const { test, expect } = require('../../fixtures');
const SellerProfilePage = require('../../pages/seller-profile.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] QE-1586: Seller Profile Management', { tag: ['@regression', '@e2e'] }, () => {
  let sellerProfile;

  test.beforeEach(async ({ page }) => {
    sellerProfile = new SellerProfilePage(page);
    await sellerProfile.login(TD.seller.username, TD.seller.password);
  });

  test('[QE-1586 TS002 TC-001] Update profile information', async ({ page }) => {
    await expect(page).toHaveURL(TD.urls.sellerDashboard);
    await sellerProfile.gotoProfileSettings();
    await expect(sellerProfile.profileForm).toBeVisible();
    await sellerProfile.updateProfile({
      phone: TD.seller.updatedPhone,
      address: TD.seller.updatedAddress
    });
    await sellerProfile.saveChanges();
    await expect(sellerProfile.successMessage).toHaveText(TD.seller.profileUpdateSuccess);
    await expect(sellerProfile.profileForm.fields.phone).toHaveValue(TD.seller.updatedPhone);
    await expect(sellerProfile.profileForm.fields.address).toHaveValue(TD.seller.updatedAddress);
  });
});
