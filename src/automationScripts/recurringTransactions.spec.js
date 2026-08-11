const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const { TransactionPage } = require('./pages/transaction.page');
const { RecurringTransactionsPage } = require('./pages/recurringTransactions.page');

test.describe('Recurring Transaction Detection', () => {

  test('TC-1380: Detect monthly recurring subscription with 3 consecutive payments', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const transactionPage = new TransactionPage(page);
    const recurringPage = new RecurringTransactionsPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('recurringuser@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Synchronize recurring transactions
    await transactionPage.synchronizeTransactions('Netflix', '15.99', ['2024-01-15', '2024-02-15', '2024-03-15']);
    await expect(transactionPage.transactionSyncConfirmation).toBeVisible();

    // Step 4: Trigger recurring transaction detection
    await recurringPage.triggerRecurringDetection('Last 3 months');
    await expect(recurringPage.detectionCompleteIndicator).toBeVisible();

    // Step 5: Navigate to recurring transactions section
    await recurringPage.navigateToRecurringSection();
    await expect(recurringPage.recurringTransactionsContainer).toBeVisible();

    // Step 6: Verify Netflix is flagged as recurring
    await recurringPage.verifyRecurringTransaction('Netflix', '15.99', 'Monthly');
  });

  test('TC-1381: Do not flag irregular payments as recurring', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const transactionPage = new TransactionPage(page);
    const recurringPage = new RecurringTransactionsPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('irregularuser@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Synchronize irregular transactions
    await transactionPage.synchronizeTransactions('Amazon', '50.00', ['2024-01-10', '2024-03-20']);
    await expect(transactionPage.transactionSyncConfirmation).toBeVisible();

    // Step 4: Trigger recurring transaction detection
    await recurringPage.triggerRecurringDetection('Last 3 months');
    await expect(recurringPage.detectionCompleteIndicator).toBeVisible();

    // Step 5: Navigate to recurring transactions section
    await recurringPage.navigateToRecurringSection();
    await expect(recurringPage.recurringTransactionsContainer).toBeVisible();

    // Step 6: Verify Amazon is NOT flagged as recurring
    await recurringPage.verifyTransactionNotRecurring('Amazon');
  });

  test('TC-1382: Detect multiple recurring transactions with different frequencies', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const transactionPage = new TransactionPage(page);
    const recurringPage = new RecurringTransactionsPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('multirecurring@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Synchronize monthly recurring transactions
    await transactionPage.synchronizeTransactions('Spotify', '9.99', ['2024-01-05', '2024-02-05', '2024-03-05']);
    await expect(transactionPage.transactionSyncConfirmation).toBeVisible();

    // Step 4: Synchronize weekly recurring transactions
    await transactionPage.synchronizeWeeklyTransactions('Coffee Shop', '5.50', 12);
    await expect(transactionPage.transactionSyncConfirmation).toBeVisible();

    // Step 5: Trigger recurring transaction detection
    await recurringPage.triggerRecurringDetection('Last 3 months');
    await expect(recurringPage.detectionCompleteIndicator).toBeVisible();

    // Step 6: Verify monthly subscription is flagged
    await recurringPage.navigateToRecurringSection();
    await recurringPage.verifyRecurringTransaction('Spotify', '9.99', 'Monthly');

    // Step 7: Verify weekly recurring transaction is flagged
    await recurringPage.verifyRecurringTransaction('Coffee Shop', '5.50', 'Weekly');
  });
});
