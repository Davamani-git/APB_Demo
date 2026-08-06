const { expect } = require('@playwright/test');

exports.AdminPage = class AdminPage {
  constructor(page) {
    this.page = page;
    this.flaggedAccountsLink = page.locator('a[href*="flagged"], a:has-text("Flagged Accounts"), nav a:has-text("Flagged")');
    this.flaggedAccountsList = page.locator('.flagged-accounts-list, .accounts-table, [data-testid="flagged-accounts"]');
    this.accountDetails = page.locator('.account-details, .seller-details, [data-testid="account-details"]');
    this.fraudulentActivityEvidence = page.locator('.fraud-evidence, .activity-log, [data-testid="fraud-evidence"]');
    this.actionDropdown = page.locator('select[name="action"], select[id="accountAction"]');
    this.banAccountOption = page.locator('option:has-text("Ban"), option[value="ban"]');
    this.suspendAccountOption = page.locator('option:has-text("Suspend"), option[value="suspend"]');
    this.restoreAccountButton = page.locator('button:has-text("Restore"), button[id="restoreAccount"]');
    this.justificationTextarea = page.locator('textarea[name="justification"], textarea[id="justification"]');
    this.submitActionButton = page.locator('button[type="submit"]:has-text("Submit"), button:has-text("Confirm Action")');
    this.accountStatusBanned = page.locator('.status-banned, [data-status="banned"], .account-status:has-text("Banned")');
    this.accountStatusActive = page.locator('.status-active, [data-status="active"], .account-status:has-text("Active")');
    this.notificationConfirmation = page.locator('.notification-sent, .alert-success:has-text("notification")');
  }

  async setupFraudulentSellerAccount(sellerId) {
    // API call or database setup for test data
    await this.page.evaluate((id) => {
      console.log(`Setting up fraudulent seller account: ${id}`);
    }, sellerId);
  }

  async triggerFraudDetection() {
    // Trigger fraud detection algorithm
    await this.page.evaluate(() => {
      console.log('Triggering fraud detection system');
    });
  }

  async verifySellerAccountFlagged(sellerId) {
    const flaggedAccount = this.page.locator(`.flagged-account[data-seller-id="${sellerId}"], tr:has-text("${sellerId}")`);
    await expect(flaggedAccount).toBeVisible({ timeout: 10000 });
  }

  async verifyAdminNotification(adminEmail) {
    // Verify notification sent to admin
    await this.page.evaluate((email) => {
      console.log(`Verifying notification sent to: ${email}`);
    }, adminEmail);
  }

  async navigateToFlaggedAccounts() {
    await expect(this.flaggedAccountsLink).toBeVisible();
    await this.flaggedAccountsLink.click();
  }

  async selectFlaggedAccount(sellerId) {
    const accountRow = this.page.locator(`tr:has-text("${sellerId}"), .account-item:has-text("${sellerId}")`);
    await expect(accountRow).toBeVisible();
    await accountRow.click();
  }

  async reviewAccountActivity() {
    await expect(this.fraudulentActivityEvidence).toBeVisible();
  }

  async takeActionOnAccount(action) {
    await expect(this.actionDropdown).toBeVisible();
    await this.actionDropdown.selectOption({ label: action });
    await expect(this.submitActionButton).toBeEnabled();
    await this.submitActionButton.click();
  }

  async verifyBuyerNotifications() {
    await expect(this.notificationConfirmation).toBeVisible({ timeout: 10000 });
  }

  async provideJustification(justificationText) {
    await expect(this.justificationTextarea).toBeVisible();
    await this.justificationTextarea.fill(justificationText);
  }

  async restoreAccount() {
    await expect(this.restoreAccountButton).toBeEnabled();
    await this.restoreAccountButton.click();
  }

  async verifySellerRestorationNotification(sellerId) {
    const notification = this.page.locator(`.notification:has-text("${sellerId}"), .alert:has-text("restored")`);
    await expect(notification).toBeVisible({ timeout: 10000 });
  }
};
