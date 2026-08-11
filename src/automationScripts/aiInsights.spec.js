const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const { TransactionPage } = require('./pages/transaction.page');
const { AIInsightsPage } = require('./pages/aiInsights.page');

test.describe('AI Insights - Unusual Spending Detection', () => {

  test('TC-1377: Detect and alert on 25% spending increase in dining category', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const transactionPage = new TransactionPage(page);
    const aiInsightsPage = new AIInsightsPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to transaction history and verify baseline
    await transactionPage.navigateToTransactionHistory();
    await transactionPage.verifyHistoricalDiningSpending('400', '420', '380');
    await transactionPage.verifyAverageSpending('400');

    // Step 4: Add new dining transactions for current month (25% increase)
    await transactionPage.addDiningTransaction('500');
    await expect(transactionPage.transactionSyncConfirmation).toBeVisible();

    // Step 5: Trigger AI engine analysis
    await aiInsightsPage.triggerAIAnalysis('Last 4 months including current');
    await expect(aiInsightsPage.analysisCompleteIndicator).toBeVisible();

    // Step 6: Verify unusual spending alert
    await dashboardPage.navigateToDashboard();
    await aiInsightsPage.navigateToAIInsightsSection();
    await expect(aiInsightsPage.unusualSpendingAlert).toBeVisible();
    await aiInsightsPage.verifyAlertDetails('Unusual Spending Increase', 'Dining', '25%');
  });

  test('TC-1378: No alert when spending increase is below 20% threshold', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const transactionPage = new TransactionPage(page);
    const aiInsightsPage = new AIInsightsPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('testuser2@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to transaction history and verify baseline
    await transactionPage.navigateToTransactionHistory();
    await transactionPage.verifyHistoricalDiningSpending('400', '420', '380');
    await transactionPage.verifyAverageSpending('400');

    // Step 4: Add new dining transactions (15% increase)
    await transactionPage.addDiningTransaction('460');
    await expect(transactionPage.transactionSyncConfirmation).toBeVisible();

    // Step 5: Trigger AI engine analysis
    await aiInsightsPage.triggerAIAnalysis('Last 4 months including current');
    await expect(aiInsightsPage.analysisCompleteIndicator).toBeVisible();

    // Step 6: Verify no alert for dining category
    await dashboardPage.navigateToDashboard();
    await aiInsightsPage.navigateToAIInsightsSection();
    await aiInsightsPage.verifyNoAlertForCategory('Dining');
  });

  test('TC-1379: Verify AI insight includes supporting data and transaction details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const aiInsightsPage = new AIInsightsPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with user who has AI insight
    await loginPage.login('testuser3@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    await expect(aiInsightsPage.aiInsightNotification).toBeVisible();

    // Step 3: Navigate to AI Insights and click notification
    await aiInsightsPage.navigateToAIInsightsSection();
    await aiInsightsPage.clickInsightNotification('INS-001', 'Dining');
    await expect(aiInsightsPage.insightDetailView).toBeVisible();

    // Step 4: Verify historical average spending
    await aiInsightsPage.verifyHistoricalAverage('400');

    // Step 5: Verify current spending comparison
    await aiInsightsPage.verifyCurrentSpendingComparison('500', '+$100');

    // Step 6: Verify percentage increase
    await aiInsightsPage.verifyPercentageIncrease('25%');

    // Step 7: Verify transaction details are accessible
    await aiInsightsPage.viewTransactionDetails();
    await expect(aiInsightsPage.transactionList).toBeVisible();
  });
});
