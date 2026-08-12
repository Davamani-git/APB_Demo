const { test, expect } = require('@playwright/test');
const { CreditCardDashboardPage } = require('./pages/creditCardDashboard.page');

test.describe('Credit Card Analysis Dashboard - KPI Aggregation Tests', () => {

  test('TC-1520: Verify consolidated KPI dashboard displays correct aggregated values for user with multiple active credit cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials for a user with multiple active credit cards
    await dashboardPage.login('testuser_multicard', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to the consolidated KPI dashboard section
    await dashboardPage.navigateToKPIDashboard();
    await dashboardPage.verifyKPIWidgetsVisible();
    
    // Step 4: Verify Monthly Spend KPI displays the sum of current month spending across all registered cards
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    await expect(monthlySpend).toBe('$1000');
    
    // Step 5: Verify Total Credit Limit KPI displays the sum of credit limits across all registered cards
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    await expect(totalCreditLimit).toBe('$10000');
    
    // Step 6: Verify Available Credit KPI displays the sum of available credit across all registered cards
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    await expect(availableCredit).toBe('$9000');
    
    // Step 7: Verify Outstanding Amount KPI displays the sum of outstanding balances across all registered cards
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    await expect(outstandingAmount).toBe('$1000');
  });

  test('TC-1521: Verify KPI calculations correctly handle credit cards with zero credit limit', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials for a user having multiple credit cards where one card has zero credit limit
    await dashboardPage.login('testuser_zerolimit', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to the consolidated KPI dashboard section
    await dashboardPage.navigateToKPIDashboard();
    await dashboardPage.verifyKPIWidgetsVisible();
    
    // Step 4: Verify Total Credit Limit KPI excludes the zero-limit card and displays sum of only valid credit limits
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    await expect(totalCreditLimit).toBe('$8000');
    
    // Step 5: Verify Available Credit KPI calculation correctly reflects only cards with valid credit limits
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    await expect(availableCredit).toContain('$');
    await dashboardPage.verifyAvailableCreditCalculation();
    
    // Step 6: Verify all other KPIs (Monthly Spend, Outstanding Amount) include data from all cards including zero-limit card
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    await expect(monthlySpend).toContain('$');
    await expect(outstandingAmount).toContain('$');
  });

  test('TC-1522: Verify appropriate error handling when backend service is unavailable for KPI aggregation', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Simulate backend service unavailability for KPI aggregation metrics
    await dashboardPage.mockBackendServiceUnavailable();
    
    // Step 4: Navigate to the consolidated KPI dashboard section
    await dashboardPage.navigateToKPIDashboard();
    
    // Step 5: Verify appropriate error message is displayed to the user
    const errorMessage = await dashboardPage.getErrorMessage();
    await expect(errorMessage).toContain('KPIs cannot be displayed at this time');
    
    // Step 6: Verify KPI widgets show placeholder or empty state instead of incorrect/stale data
    await dashboardPage.verifyKPIWidgetsShowErrorState();
  });
});

test.describe('Credit Card Analysis Dashboard - Card Overview Tests', () => {

  test('TC-1523: Verify consolidated view displays all registered credit cards with correct details', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials for a user with three registered credit cards
    await dashboardPage.login('testuser_threecards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to the card overview section
    await dashboardPage.navigateToCardOverview();
    
    // Step 4: Verify all three credit cards are displayed in a consolidated list
    const cardCount = await dashboardPage.getCardCount();
    await expect(cardCount).toBe(3);
    await dashboardPage.verifyCardDisplayed('Visa *1234');
    await dashboardPage.verifyCardDisplayed('MasterCard *5678');
    await dashboardPage.verifyCardDisplayed('Amex *9012');
    
    // Step 5: Verify each card displays its respective credit limit
    await dashboardPage.verifyCardCreditLimit('Visa *1234', '$5000');
    await dashboardPage.verifyCardCreditLimit('MasterCard *5678', '$3000');
    await dashboardPage.verifyCardCreditLimit('Amex *9012', '$2000');
    
    // Step 6: Verify each card displays its current balance
    await dashboardPage.verifyCardBalance('Visa *1234', '$600');
    await dashboardPage.verifyCardBalance('MasterCard *5678', '$250');
    await dashboardPage.verifyCardBalance('Amex *9012', '$150');
  });

  test('TC-1524: Verify appropriate message is displayed when user has no registered credit cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials for a user with no registered credit cards
    await dashboardPage.login('testuser_nocards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to the card overview section
    await dashboardPage.navigateToCardOverview();
    
    // Step 4: Verify appropriate message is displayed indicating no cards are available
    const noCardsMessage = await dashboardPage.getNoCardsMessage();
    await expect(noCardsMessage).toContain('No credit cards are available to display');
    
    // Step 5: Verify the card list section is empty with no card entries shown
    const cardCount = await dashboardPage.getCardCount();
    await expect(cardCount).toBe(0);
  });

  test('TC-1525: Verify expired or deactivated cards are handled correctly in consolidated view', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch the Credit Card Analysis Dashboard application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials for a user with registered credit cards including expired or deactivated cards
    await dashboardPage.login('testuser_expiredcards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to the card overview section
    await dashboardPage.navigateToCardOverview();
    
    // Step 4: Verify expired or deactivated cards are either excluded from the consolidated view or clearly flagged with status indicator
    await dashboardPage.verifyCardStatusHandling();
    
    // Step 5: Verify only active cards are included in KPI calculations if expired/deactivated cards are shown
    await dashboardPage.verifyOnlyActiveCardsInKPICalculations();
    
    // Step 6: Verify the system correctly identifies and handles card status based on expiration date or deactivation flag
    await dashboardPage.verifyCardStatusLogic();
  });
});