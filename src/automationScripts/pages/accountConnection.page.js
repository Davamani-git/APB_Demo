const { expect } = require('@playwright/test');

exports.AccountConnectionPage = class AccountConnectionPage {
  constructor(page) {
    this.page = page;
    this.accountConnectionLink = page.locator('a[href*="connect-account"]');
    this.accountConnectionContainer = page.locator('[data-testid="account-connection-container"]');
    this.supportedInstitutionsList = page.locator('[data-testid="supported-institutions-list"]');
    this.bankAuthorizationFlow = page.locator('[data-testid="bank-authorization-flow"]');
    this.bankUsernameInput = page.locator('input[name="bank-username"]');
    this.bankPasswordInput = page.locator('input[name="bank-password"]');
    this.authorizeButton = page.locator('button[data-testid="authorize-bank"]');
    this.authorizationSuccessMessage = page.locator('[data-testid="authorization-success"]');
    this.syncProgressIndicator = page.locator('[data-testid="sync-progress"]');
    this.connectedAccountsLink = page.locator('a[href*="connected-accounts"]');
    this.searchInstitutionInput = page.locator('input[data-testid="search-institution"]');
    this.noResultsMessage = page.locator('[data-testid="no-results"]');
    this.unsupportedInstitutionError = page.locator('[data-testid="unsupported-institution-error"]');
    this.mfaRequirementMessage = page.locator('[data-testid="mfa-requirement-message"]');
  }

  async navigateToAccountConnection() {
    await this.accountConnectionLink.click();
    await expect(this.accountConnectionContainer).toBeVisible();
  }

  async selectBank(bankName) {
    const bankOption = this.page.locator(`[data-testid="bank-option"]`, {
      hasText: bankName
    });
    await bankOption.click();
  }

  async authorizeBankAccount(username, password) {
    await expect(this.bankUsernameInput).toBeVisible();
    await this.bankUsernameInput.fill(username);
    await this.bankPasswordInput.fill(password);
    await this.authorizeButton.click();
  }

  async waitForAccountSync() {
    await expect(this.syncProgressIndicator).toBeVisible();
    await expect(this.syncProgressIndicator).not.toBeVisible({ timeout: 30000 });
  }

  async navigateToConnectedAccounts() {
    await this.connectedAccountsLink.click();
  }

  async verifyConnectionStatus(bankName, status) {
    const accountRow = this.page.locator(`[data-testid="connected-account-row"]`, {
      hasText: bankName
    });
    await expect(accountRow).toBeVisible();
    await expect(accountRow).toContainText(status);
  }

  async searchInstitution(institutionName) {
    await this.searchInstitutionInput.fill(institutionName);
    await this.page.keyboard.press('Enter');
  }

  async attemptManualConnection() {
    const manualConnectionButton = this.page.locator('button[data-testid="manual-connection"]');
    if (await manualConnectionButton.isVisible()) {
      await manualConnectionButton.click();
    }
  }

  async attemptBankAuthorization() {
    const proceedButton = this.page.locator('button[data-testid="proceed-authorization"]');
    if (await proceedButton.isVisible()) {
      await proceedButton.click();
    }
  }
};
