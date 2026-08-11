const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const { AccountConnectionPage } = require('./pages/accountConnection.page');

test.describe('Financial Account Connection', () => {

  test('TC-1389: Successfully connect bank account with MFA enabled user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const accountPage = new AccountConnectionPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with MFA enabled user
    await loginPage.loginWithMFA('mfauser@example.com', 'Test@123', '123456');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to account connection section
    await accountPage.navigateToAccountConnection();
    await expect(accountPage.supportedInstitutionsList).toBeVisible();

    // Step 4: Select bank from supported institutions
    await accountPage.selectBank('Chase Bank');
    await expect(accountPage.bankAuthorizationFlow).toBeVisible();

    // Step 5: Complete bank authorization
    await accountPage.authorizeBankAccount('bankuser123', 'BankPass@456');
    await expect(accountPage.authorizationSuccessMessage).toBeVisible();

    // Step 6: Wait for synchronization
    await accountPage.waitForAccountSync();

    // Step 7: Verify connection status
    await accountPage.navigateToConnectedAccounts();
    await accountPage.verifyConnectionStatus('Chase Bank', 'Active');
  });

  test('TC-1390: Prevent connection to unsupported financial institution', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const accountPage = new AccountConnectionPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('unsupportedbank@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to account connection section
    await accountPage.navigateToAccountConnection();
    await expect(accountPage.accountConnectionContainer).toBeVisible();

    // Step 4: Search for unsupported institution
    await accountPage.searchInstitution('Local Credit Union XYZ');
    await expect(accountPage.noResultsMessage).toBeVisible();

    // Step 5: Attempt to proceed if manual entry exists
    await accountPage.attemptManualConnection();

    // Step 6: Verify error message
    await expect(accountPage.unsupportedInstitutionError).toBeVisible();
    await expect(accountPage.unsupportedInstitutionError).toContainText('not currently available');
  });

  test('TC-1391: Require MFA setup before connecting financial accounts', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const accountPage = new AccountConnectionPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with user without MFA
    await loginPage.login('nomfauser@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to account connection section
    await accountPage.navigateToAccountConnection();
    await expect(accountPage.accountConnectionContainer).toBeVisible();

    // Step 4: Select supported bank
    await accountPage.selectBank('Wells Fargo');

    // Step 5: Attempt to proceed with authorization
    await accountPage.attemptBankAuthorization();

    // Step 6: Verify MFA requirement prompt
    await expect(accountPage.mfaRequirementMessage).toBeVisible();
    await expect(accountPage.mfaRequirementMessage).toContainText('Multi-factor authentication is required');
  });
});
