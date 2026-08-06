const { test, expect } = require('@playwright/test');
const { AdminPage } = require('./pages/admin.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Fraud Detection and Management', () => {
  test('TC-1168: Fraud detection system flags fraudulent seller account', async ({ page }) => {
    const adminPage = new AdminPage(page);
    
    await adminPage.setupFraudulentSellerAccount('FRAUD001');
    await adminPage.triggerFraudDetection();
    await adminPage.verifySellerAccountFlagged('FRAUD001');
    await adminPage.verifyAdminNotification('admin@example.com');
  });

  test('TC-1169: Admin reviews and bans fraudulent seller account', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsAdmin('admin@example.com', 'Admin@123');
    await expect(page).toHaveURL(/.*admin.*dashboard/);
    
    await adminPage.navigateToFlaggedAccounts();
    await expect(adminPage.flaggedAccountsList).toBeVisible();
    
    await adminPage.selectFlaggedAccount('FRAUD001');
    await expect(adminPage.accountDetails).toBeVisible();
    await expect(adminPage.fraudulentActivityEvidence).toBeVisible();
    
    await adminPage.reviewAccountActivity();
    await adminPage.takeActionOnAccount('Ban account');
    await expect(adminPage.accountStatusBanned).toBeVisible();
    
    await adminPage.verifyBuyerNotifications();
  });

  test('TC-1170: Admin restores legitimate seller account incorrectly flagged', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsAdmin('admin@example.com', 'Admin@123');
    await expect(page).toHaveURL(/.*admin.*dashboard/);
    
    await adminPage.navigateToFlaggedAccounts();
    await expect(adminPage.flaggedAccountsList).toBeVisible();
    
    await adminPage.selectFlaggedAccount('LEGIT001');
    await expect(adminPage.accountDetails).toBeVisible();
    
    await adminPage.reviewAccountActivity();
    await adminPage.provideJustification('Account activity is within normal parameters, false positive');
    await adminPage.restoreAccount();
    await expect(adminPage.accountStatusActive).toBeVisible();
    
    await adminPage.verifySellerRestorationNotification('LEGIT001');
  });
});
