const { test, expect } = require('@playwright/test');
const { CreditCardDashboardPage } = require('./pages/creditCardDashboard.page');

test.describe('Credit Card Analysis Dashboard - Transaction Management', () => {

  test('TC-001: View complete transaction list across multiple credit cards with valid data', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate('https://creditcard-dashboard.example.com');
    await expect(page).toHaveURL(/creditcard-dashboard/);
    await dashboardPage.verifyDashboardLoaded();
    
    // Step 2: Login with valid user credentials who has multiple credit cards with existing transactions
    await dashboardPage.login('testuser_multi_cards', 'Test@123');
    await dashboardPage.verifyDashboardHomePageDisplayed();
    
    // Step 3: Navigate to the transaction management section
    await dashboardPage.navigateToTransactionManagement();
    await dashboardPage.verifyTransactionManagementSectionLoaded();
    
    // Step 4: View the complete list of all transactions across all credit cards
    await dashboardPage.verifyTransactionListDisplayed();
    await dashboardPage.verifyMinimumTransactionCount(5);
    await dashboardPage.verifyTransactionDetailsDisplayed();
    
    // Step 5: Verify that timestamps are displayed in correct format and chronological order
    await dashboardPage.verifyTimestampFormat('DD/MM/YYYY HH:MM');
    await dashboardPage.verifyTransactionsChronologicalOrder();
    
    // Step 6: Verify that transaction amounts are displayed accurately with proper currency formatting
    await dashboardPage.verifyCurrencyFormatting();
  });

  test('TC-002: View transaction history for user with no transactions', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate('https://creditcard-dashboard.example.com');
    await expect(page).toHaveURL(/creditcard-dashboard/);
    await dashboardPage.verifyDashboardLoaded();
    
    // Step 2: Login with valid user credentials who has credit cards but no transaction history
    await dashboardPage.login('testuser_no_transactions', 'Test@123');
    await dashboardPage.verifyDashboardHomePageDisplayed();
    
    // Step 3: Navigate to the transaction management section
    await dashboardPage.navigateToTransactionManagement();
    await dashboardPage.verifyTransactionManagementSectionLoaded();
    
    // Step 4: Attempt to view the transaction history list
    await dashboardPage.verifyEmptyTransactionState();
    
    // Step 5: Verify that no error is thrown and the page remains functional
    await dashboardPage.verifyNoErrorsDisplayed();
    await dashboardPage.verifyNavigationFunctional();
  });

  test('TC-003: View transaction list with invalid or corrupted data entries', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate('https://creditcard-dashboard.example.com');
    await expect(page).toHaveURL(/creditcard-dashboard/);
    await dashboardPage.verifyDashboardLoaded();
    
    // Step 2: Login with valid user credentials who has transactions containing invalid or corrupted data
    await dashboardPage.login('testuser_invalid_data', 'Test@123');
    await dashboardPage.verifyDashboardHomePageDisplayed();
    
    // Step 3: Navigate to the transaction management section
    await dashboardPage.navigateToTransactionManagement();
    await dashboardPage.verifyTransactionManagementSectionLoaded();
    
    // Step 4: Attempt to view the transaction list containing invalid or corrupted data entries
    await dashboardPage.verifyGracefulErrorHandling();
    
    // Step 5: Verify that the application does not crash and remains functional
    await dashboardPage.verifyApplicationStable();
    await dashboardPage.verifyNavigationFunctional();
  });

  test('TC-004: View transaction list when all data is corrupted', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate('https://creditcard-dashboard.example.com');
    await expect(page).toHaveURL(/creditcard-dashboard/);
    await dashboardPage.verifyDashboardLoaded();
    
    // Step 2: Login with valid user credentials who has only corrupted transaction data
    await dashboardPage.login('testuser_all_corrupted', 'Test@123');
    await dashboardPage.verifyDashboardHomePageDisplayed();
    
    // Step 3: Navigate to the transaction management section
    await dashboardPage.navigateToTransactionManagement();
    await dashboardPage.verifyTransactionManagementSectionLoaded();
    
    // Step 4: Attempt to view the transaction list when all data is corrupted
    await dashboardPage.verifyUserFriendlyErrorMessage();
    
    // Step 5: Verify that the application does not crash and user can navigate to other sections
    await dashboardPage.verifyApplicationStable();
    await dashboardPage.verifyNavigationToOtherSections();
  });

});