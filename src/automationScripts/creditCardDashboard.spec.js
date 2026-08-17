const { test, expect } = require('@playwright/test');
const { CreditCardDashboardPage } = require('./pages/creditCardDashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Credit Card Analysis Dashboard - Transaction Management', () => {

  test('TC-1572: View consolidated transaction list from multiple credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid user credentials who has multiple credit cards with transaction history
    await loginPage.login('testuser_multicard', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to the transaction management interface
    await dashboardPage.navigateToTransactionManagement();
    await expect(dashboardPage.transactionManagementPage).toBeVisible();

    // Step 4: View the consolidated transaction list
    await expect(dashboardPage.transactionList).toBeVisible();
    await dashboardPage.verifyConsolidatedTransactionList();
    await dashboardPage.verifyTransactionDetails();
    await dashboardPage.verifyCardIdentifiers(['Visa *1234', 'Master *5678']);
  });

  test('TC-1573: View consolidated transaction history across all time periods and cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid user credentials who has multiple cards with historical transactions
    await loginPage.login('testuser_history', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Access the consolidated transaction history view
    await dashboardPage.navigateToTransactionHistory();
    await expect(dashboardPage.transactionHistoryPage).toBeVisible();

    // Step 4: Verify transactions from all time periods are displayed
    await dashboardPage.verifyTransactionDateRange('01-Jan-2023');
    await expect(dashboardPage.transactionList).toBeVisible();

    // Step 5: Verify transactions from all registered cards are included
    await dashboardPage.verifyCardIdentifiers(['Visa *1234', 'Master *5678', 'Amex *9012']);
    await dashboardPage.verifyAllCardsHaveTransactions();

    // Step 6: Analyze spending patterns across the portfolio
    await dashboardPage.verifyFilteringSortingCapability();
  });

  test('TC-1574: Handle transaction data service unavailability gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid user credentials
    await loginPage.login('testuser', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Simulate transaction data service unavailability
    await page.route('**/api/transactions**', route => route.abort('failed'));

    // Step 4: Attempt to access transaction history
    await dashboardPage.navigateToTransactionHistory();
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText('Transaction data cannot be retrieved at this time. Please try again later.');

    // Step 5: Verify the application remains stable and other features are accessible
    await dashboardPage.verifyApplicationStability();
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.dashboardContainer).toBeVisible();
  });

});

test.describe('Credit Card Analysis Dashboard - Transaction Monitoring', () => {

  test('TC-1575: View consolidated transaction list with card identification', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user credentials who has transactions across multiple credit cards
    await loginPage.login('testuser_multicardtxn', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to the transaction monitoring dashboard
    await dashboardPage.navigateToTransactionMonitoring();
    await expect(dashboardPage.transactionMonitoringDashboard).toBeVisible();

    // Step 4: View the consolidated transaction list
    await expect(dashboardPage.transactionList).toBeVisible();
    await dashboardPage.verifyConsolidatedTransactionList();
    await dashboardPage.verifyCardIdentifiers(['Visa *1234', 'Master *5678', 'Amex *9012']);

    // Step 5: Verify each transaction displays clear card identification
    await dashboardPage.verifyCardIdentificationInTransactions();
  });

  test('TC-1576: Verify transaction attribution to correct source cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user credentials who has multiple registered cards
    await loginPage.login('testuser_allcards', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Access the consolidated transaction view
    await dashboardPage.navigateToConsolidatedTransactionView();
    await expect(dashboardPage.consolidatedTransactionView).toBeVisible();

    // Step 4: Verify transactions from all registered cards are present
    await dashboardPage.verifyCardIdentifiers(['Visa *1234', 'Master *5678', 'Amex *9012']);

    // Step 5: Verify each transaction displays the correct source card identifier
    await dashboardPage.verifySpecificTransactionCardAttribution('$50.00', 'Starbucks', 'Visa *1234');

    // Step 6: Cross-verify transaction count matches individual card transaction counts
    await dashboardPage.verifyTransactionCount(10, 15, 8, 33);
  });

  test('TC-1577: Handle empty transaction sets gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user credentials who has one or more cards with no transactions
    await loginPage.login('testuser_emptycards', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to the consolidated transaction view
    await dashboardPage.navigateToConsolidatedTransactionView();
    await expect(dashboardPage.consolidatedTransactionView).toBeVisible();

    // Step 4: Verify empty transaction sets are handled gracefully
    await dashboardPage.verifyEmptyTransactionHandling();

    // Step 5: Verify no errors or blank screens are displayed
    await dashboardPage.verifyNoErrorsDisplayed();
  });

});

test.describe('Credit Card Analysis Dashboard - KPI Display', () => {

  test('TC-1578: Verify all KPIs are displayed with accurate values', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid user credentials
    await loginPage.login('testuser_kpi', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Access the main dashboard
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.mainDashboard).toBeVisible();

    // Step 4: Verify Monthly Spend KPI is displayed with accurate value
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await dashboardPage.verifyKPIValue(dashboardPage.monthlySpendKPI, '$2,450.00');

    // Step 5: Verify Total Credit Limit KPI is displayed with accurate value
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await dashboardPage.verifyKPIValue(dashboardPage.totalCreditLimitKPI, '$15,000.00');

    // Step 6: Verify Available Credit KPI is displayed with accurate value
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await dashboardPage.verifyKPIValue(dashboardPage.availableCreditKPI, '$12,550.00');

    // Step 7: Verify Outstanding Amount KPI is displayed with accurate value
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await dashboardPage.verifyKPIValue(dashboardPage.outstandingAmountKPI, '$2,450.00');
  });

  test('TC-1579: Verify Monthly Spend KPI updates dynamically', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user credentials who has recent transactions
    await loginPage.login('testuser_recenttxn', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Access the main dashboard and note the current Monthly Spend KPI value
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.mainDashboard).toBeVisible();
    await dashboardPage.verifyKPIValue(dashboardPage.monthlySpendKPI, '$1,200.00');

    // Step 4: Verify Monthly Spend includes only current month's transactions
    await dashboardPage.verifyMonthlySpendCalculation('December 2024');

    // Step 5: Post a new transaction (or simulate transaction posting)
    await dashboardPage.simulateNewTransaction('$150.00', 'Amazon');

    // Step 6: Refresh the dashboard or wait for auto-refresh
    await dashboardPage.refreshDashboard();
    await dashboardPage.verifyKPIValue(dashboardPage.monthlySpendKPI, '$1,350.00');
  });

  test('TC-1580: Verify KPI handling for over-limit credit scenario', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user credentials who has exceeded credit limit
    await loginPage.login('testuser_overlimit', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Access the main dashboard
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.mainDashboard).toBeVisible();

    // Step 4: Verify Available Credit KPI displays negative value or zero
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await dashboardPage.verifyOverLimitAvailableCredit(['-$250.00', '$0.00']);

    // Step 5: Verify Outstanding Amount KPI correctly reflects over-limit balance
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await dashboardPage.verifyKPIValue(dashboardPage.outstandingAmountKPI, '$5,250.00');

    // Step 6: Verify visual indicators or warnings for over-limit status
    await dashboardPage.verifyOverLimitWarningIndicators();
  });

});

test.describe('Credit Card Analysis Dashboard - Consolidated Card View', () => {

  test('TC-1581: View all registered credit cards with balance and limit', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user credentials who has multiple registered credit cards
    await loginPage.login('testuser_multicard', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Access the dashboard
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.consolidatedOverviewSection).toBeVisible();

    // Step 4: Verify all registered credit cards are displayed
    await dashboardPage.verifyRegisteredCardsDisplayed(3);
    await dashboardPage.verifyCardIdentifiers(['Visa *1234', 'Master *5678', 'Amex *9012']);

    // Step 5: Verify each card displays current balance
    await dashboardPage.verifyCardBalance('Visa *1234', '$1,200.00');
    await dashboardPage.verifyCardBalance('Master *5678', '$850.00');
    await dashboardPage.verifyCardBalance('Amex *9012', '$400.00');

    // Step 6: Verify each card displays credit limit
    await dashboardPage.verifyCardLimit('Visa *1234', '$5,000.00');
    await dashboardPage.verifyCardLimit('Master *5678', '$7,000.00');
    await dashboardPage.verifyCardLimit('Amex *9012', '$3,000.00');
  });

  test('TC-1582: Verify no data misattribution between multiple cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user credentials who has three or more credit cards
    await loginPage.login('testuser_threecards', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Access the consolidated card view on the dashboard
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.consolidatedCardView).toBeVisible();

    // Step 4: Verify Card 1 balance and limit data accuracy
    await dashboardPage.verifyCardBalanceAndLimit('Visa *1234', '$1,200.00', '$5,000.00');

    // Step 5: Verify Card 2 balance and limit data accuracy
    await dashboardPage.verifyCardBalanceAndLimit('Master *5678', '$850.00', '$7,000.00');

    // Step 6: Verify Card 3 balance and limit data accuracy
    await dashboardPage.verifyCardBalanceAndLimit('Amex *9012', '$400.00', '$3,000.00');

    // Step 7: Verify no data misattribution between cards
    await dashboardPage.verifyNoDataMisattribution();
  });

  test('TC-1583: Handle no registered credit cards scenario gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the Credit Card Analysis Dashboard application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user credentials who has no registered credit cards
    await loginPage.login('testuser_nocards', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Access the dashboard
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.mainDashboard).toBeVisible();

    // Step 4: Verify appropriate message is displayed in the consolidated view
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    await expect(dashboardPage.noCardsMessage).toContainText(/No credit cards are registered|Please add a credit card/);

    // Step 5: Verify no errors or broken UI elements are displayed
    await dashboardPage.verifyNoErrorsDisplayed();

    // Step 6: Verify option to add a card is available (if applicable)
    await dashboardPage.verifyAddCardOptionAvailable();
  });

});