const { test, expect } = require('@playwright/test');
const { CreditCardDashboardPage } = require('./pages/creditCardDashboard.page');

test.describe('Credit Card Analysis Dashboard - Transaction History Tests', () => {

  test('TC-001: View transaction history for card with existing transactions', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Navigate to the card management section
    await dashboardPage.navigateToCardManagement();
    await expect(dashboardPage.cardList).toBeVisible();
    
    // Step 3: Select a credit card that has existing transaction history
    await dashboardPage.selectCard('Visa **** 1234');
    await expect(dashboardPage.cardDetails).toBeVisible();
    
    // Step 4: Navigate to transaction history view for the selected card
    await dashboardPage.navigateToTransactionHistory();
    await expect(dashboardPage.transactionList).toBeVisible();
    
    // Step 5: Verify transaction details accuracy
    await dashboardPage.verifyTransactionDetailsDisplayed();
    const categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    await dashboardPage.verifyTransactionCategories(categories);
  });

  test('TC-002: View transaction history for newly issued card with no transactions', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Navigate to the card management section
    await dashboardPage.navigateToCardManagement();
    await expect(dashboardPage.cardList).toBeVisible();
    
    // Step 3: Select a newly issued credit card with no transaction history
    await dashboardPage.selectCard('Mastercard **** 5678');
    await expect(dashboardPage.cardDetails).toBeVisible();
    
    // Step 4: Navigate to transaction history view for the selected card
    await dashboardPage.navigateToTransactionHistory();
    await expect(dashboardPage.noTransactionsMessage).toBeVisible();
    await expect(dashboardPage.noTransactionsMessage).toContainText(/No transactions available/i);
  });

  test('TC-003: Attempt to view transaction history for deactivated card', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Navigate to the card management section
    await dashboardPage.navigateToCardManagement();
    await expect(dashboardPage.cardList).toBeVisible();
    
    // Step 3: Attempt to select a credit card that has been deactivated
    await dashboardPage.selectCard('Visa **** 9012');
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText(/no longer accessible/i);
    
    // Step 4: Verify that transaction history view is not accessible for the deactivated card
    await expect(dashboardPage.transactionList).not.toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText(/no longer accessible/i);
  });

});

test.describe('Credit Card Analysis Dashboard - Card Management Tests', () => {

  test('TC-004: View consolidated interface with multiple credit cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with user credentials who has multiple credit cards
    await dashboardPage.login('testuser@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    // Step 3: Navigate to the card management section
    await dashboardPage.navigateToCardManagement();
    await expect(dashboardPage.cardList).toBeVisible();
    
    // Step 4: Verify all card details are displayed for each card
    const expectedCards = ['Visa **** 1234', 'Mastercard **** 5678', 'Amex **** 9012'];
    await dashboardPage.verifyAllCardsDisplayed(expectedCards);
    await dashboardPage.verifyCardDetailsDisplayed();
  });

  test('TC-005: Verify credit limit and balance accuracy for multiple cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with user credentials who has multiple credit cards
    await dashboardPage.login('testuser@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    // Step 3: Navigate to the card management section
    await dashboardPage.navigateToCardManagement();
    await expect(dashboardPage.cardList).toBeVisible();
    
    // Step 4: Verify credit limit accuracy for each card
    await dashboardPage.verifyCreditLimit('Visa **** 1234', '$10,000');
    await dashboardPage.verifyCreditLimit('Mastercard **** 5678', '$15,000');
    await dashboardPage.verifyCreditLimit('Amex **** 9012', '$20,000');
    
    // Step 5: Verify balance accuracy for each card
    await dashboardPage.verifyBalance('Visa **** 1234', '$2,500');
    await dashboardPage.verifyBalance('Mastercard **** 5678', '$5,000');
    await dashboardPage.verifyBalance('Amex **** 9012', '$8,000');
  });

  test('TC-006: View transaction summary and available credit for specific card', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Navigate to the card management section
    await dashboardPage.navigateToCardManagement();
    await expect(dashboardPage.cardList).toBeVisible();
    
    // Step 3: Select a specific credit card from the portfolio
    await dashboardPage.selectCard('Visa **** 1234');
    await expect(dashboardPage.cardDetailedView).toBeVisible();
    
    // Step 4: Verify transaction summary is displayed
    await expect(dashboardPage.transactionSummary).toBeVisible();
    await dashboardPage.verifyTransactionSummaryFields();
    
    // Step 5: Verify available credit is displayed
    await dashboardPage.verifyAvailableCredit('$7,500');
    
    // Step 6: Verify outstanding balance is displayed
    await dashboardPage.verifyOutstandingBalance('$2,500');
  });

  test('TC-007: View category-wise spending breakdown for specific card', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Navigate to the card management section
    await dashboardPage.navigateToCardManagement();
    await expect(dashboardPage.cardList).toBeVisible();
    
    // Step 3: Select a specific credit card from the portfolio
    await dashboardPage.selectCard('Mastercard **** 5678');
    await expect(dashboardPage.cardDetailedView).toBeVisible();
    
    // Step 4: Navigate to category-wise spending section
    await dashboardPage.navigateToCategorySpending();
    await expect(dashboardPage.categorySpendingSection).toBeVisible();
    
    // Step 5: Verify all spending categories are shown with amounts
    const expectedCategories = {
      'Food & Dining': '$500',
      'Fuel': '$200',
      'Shopping': '$800',
      'Travel': '$1,000',
      'Entertainment': '$300',
      'Utilities': '$150',
      'Healthcare': '$100',
      'Education': '$50',
      'Miscellaneous': '$100'
    };
    await dashboardPage.verifyCategorySpending(expectedCategories);
  });

  test('TC-008: View empty state for user with no credit cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with user credentials who has no credit cards registered
    await dashboardPage.login('newuser@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    
    // Step 3: Navigate to the card management section
    await dashboardPage.navigateToCardManagement();
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    await expect(dashboardPage.noCardsMessage).toContainText(/No credit cards available/i);
    
    // Step 4: Verify that no card details or placeholders are shown
    await expect(dashboardPage.cardList).not.toBeVisible();
    await dashboardPage.verifyEmptyState();
  });

});