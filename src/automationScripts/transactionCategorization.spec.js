const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const { TransactionPage } = require('./pages/transaction.page');

test.describe('Transaction Automatic Categorization', () => {

  test('TC-1392: Automatically categorize transaction from known grocery merchant', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('autocat@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Trigger transaction synchronization
    await transactionPage.triggerTransactionSync();
    await expect(transactionPage.syncInProgressIndicator).toBeVisible();

    // Step 4: Verify transaction from Whole Foods is synchronized
    await transactionPage.verifyTransactionExists('Whole Foods Market', '85.50', '2024-03-15');

    // Step 5: Check automatic categorization
    await transactionPage.verifyTransactionCategory('Whole Foods Market', 'Groceries');

    // Step 6: Verify confidence level
    await transactionPage.verifyCategorizationConfidence('Whole Foods Market', '90');
  });

  test('TC-1393: Flag unknown merchant transaction for manual categorization', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('unknownmerchant@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Trigger transaction synchronization
    await transactionPage.triggerTransactionSync();
    await expect(transactionPage.syncInProgressIndicator).toBeVisible();

    // Step 4: Verify unknown merchant transaction
    await transactionPage.verifyTransactionExists('ABC Store 123', '45.00', '2024-03-15');

    // Step 5: Check categorization confidence
    await transactionPage.verifyLowConfidenceOrUncategorized('ABC Store 123');

    // Step 6: Verify manual categorization prompt
    await expect(transactionPage.manualCategorizationPrompt).toBeVisible();
  });

  test('TC-1394: AI learns from user category correction for future transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const transactionPage = new TransactionPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('learninguser@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to transactions and locate auto-categorized transaction
    await transactionPage.navigateToTransactionsList();
    await transactionPage.locateTransaction('Gas Station XYZ', '50.00', 'Shopping');

    // Step 4: Click to edit category
    await transactionPage.clickEditCategory('Gas Station XYZ');
    await expect(transactionPage.categoryEditInterface).toBeVisible();

    // Step 5: Change category to Transportation
    await transactionPage.selectCategory('Transportation');

    // Step 6: Save correction
    await transactionPage.saveCategoryCorrection();
    await expect(transactionPage.categoryCorrectionConfirmation).toBeVisible();

    // Step 7: Synchronize new transaction from same merchant
    await transactionPage.triggerTransactionSync();
    await transactionPage.verifyTransactionExists('Gas Station XYZ', '45.00', '2024-03-20');

    // Step 8: Verify learned categorization
    await transactionPage.verifyTransactionCategory('Gas Station XYZ', 'Transportation');
  });
});
