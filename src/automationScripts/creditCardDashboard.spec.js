const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { CreditCardOverviewPage } = require('./pages/creditCardOverview.page');

test.describe('Credit Card Analysis Dashboard - KPI Tests', () => {

  test('TC-1566: Verify Dashboard KPIs with active transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch application
    await loginPage.navigate('https://creditcardanalysis.example.com');
    await expect(page).toHaveURL(/creditcardanalysis/);

    // Step 2: Login with valid credentials
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to main dashboard
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.verifyKPISectionVisible();

    // Step 4: Verify Monthly Spend KPI
    await dashboardPage.verifyMonthlySpendKPI('$2,450.00');

    // Step 5: Verify Total Credit Limit KPI
    await dashboardPage.verifyTotalCreditLimitKPI('$15,000.00');

    // Step 6: Verify Available Credit KPI
    await dashboardPage.verifyAvailableCreditKPI('$12,100.00');

    // Step 7: Verify Outstanding Amount KPI
    await dashboardPage.verifyOutstandingAmountKPI('$2,900.00');
  });

  test('TC-1567: Verify Dashboard KPIs with zero transaction history', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch application
    await loginPage.navigate('https://creditcardanalysis.example.com');
    await expect(page).toHaveURL(/creditcardanalysis/);

    // Step 2: Login with user having zero transactions
    await loginPage.login('newuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to main dashboard
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.verifyKPISectionVisible();

    // Step 4: Verify Monthly Spend KPI shows zero or null
    await dashboardPage.verifyMonthlySpendKPIZeroState();

    // Step 5: Verify Total Credit Limit KPI
    await dashboardPage.verifyTotalCreditLimitKPI('$10,000.00');

    // Step 6: Verify Available Credit KPI equals Total Credit Limit
    await dashboardPage.verifyAvailableCreditKPI('$10,000.00');

    // Step 7: Verify Outstanding Amount KPI shows zero
    await dashboardPage.verifyOutstandingAmountKPI('$0.00');
  });

  test('TC-1568: Verify Dashboard KPIs with backend service unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch application
    await loginPage.navigate('https://creditcardanalysis.example.com');
    await expect(page).toHaveURL(/creditcardanalysis/);

    // Step 2: Simulate backend service unavailability
    await page.route('**/api/financial-calculations', route => route.abort());

    // Step 3: Login with valid credentials
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 4: Navigate to dashboard and attempt to access KPIs
    await dashboardPage.waitForDashboardLoad();

    // Step 5: Verify error message or fallback display
    await dashboardPage.verifyKPIErrorState();
  });
});

test.describe('Credit Card Analysis Dashboard - Credit Card Overview Tests', () => {

  test('TC-1569: Verify consolidated view with multiple credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const creditCardOverviewPage = new CreditCardOverviewPage(page);

    // Step 1: Launch application
    await loginPage.navigate('https://creditcardanalysis.example.com');
    await expect(page).toHaveURL(/creditcardanalysis/);

    // Step 2: Login with user having multiple cards
    await loginPage.login('multicard@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to credit card overview section
    await creditCardOverviewPage.navigateToCreditCardOverview();
    await creditCardOverviewPage.waitForOverviewPageLoad();

    // Step 4: Verify all registered credit cards are displayed
    await creditCardOverviewPage.verifyCardCount(3);

    // Step 5: Verify each card displays masked card number
    await creditCardOverviewPage.verifyCardNumber(0, '**** 1234');
    await creditCardOverviewPage.verifyCardNumber(1, '**** 5678');
    await creditCardOverviewPage.verifyCardNumber(2, '**** 9012');

    // Step 6: Verify each card displays credit limit
    await creditCardOverviewPage.verifyCreditLimit(0, '$5,000');
    await creditCardOverviewPage.verifyCreditLimit(1, '$10,000');
    await creditCardOverviewPage.verifyCreditLimit(2, '$7,500');

    // Step 7: Verify each card displays available balance
    await creditCardOverviewPage.verifyAvailableBalance(0, '$4,200');
    await creditCardOverviewPage.verifyAvailableBalance(1, '$8,500');
    await creditCardOverviewPage.verifyAvailableBalance(2, '$6,800');

    // Step 8: Verify each card displays outstanding amount
    await creditCardOverviewPage.verifyOutstandingAmount(0, '$800');
    await creditCardOverviewPage.verifyOutstandingAmount(1, '$1,500');
    await creditCardOverviewPage.verifyOutstandingAmount(2, '$700');
  });

  test('TC-1570: Verify consolidated view with single credit card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const creditCardOverviewPage = new CreditCardOverviewPage(page);

    // Step 1: Launch application
    await loginPage.navigate('https://creditcardanalysis.example.com');
    await expect(page).toHaveURL(/creditcardanalysis/);

    // Step 2: Login with user having single card
    await loginPage.login('singlecard@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to credit card overview section
    await creditCardOverviewPage.navigateToCreditCardOverview();
    await creditCardOverviewPage.waitForOverviewPageLoad();

    // Step 4: Verify single credit card is displayed
    await creditCardOverviewPage.verifyCardCount(1);

    // Step 5: Verify card displays masked card number
    await creditCardOverviewPage.verifyCardNumber(0, '**** **** **** 5678');

    // Step 6: Verify card displays credit limit
    await creditCardOverviewPage.verifyCreditLimit(0, '$8,000.00');

    // Step 7: Verify card displays available balance
    await creditCardOverviewPage.verifyAvailableBalance(0, '$6,500.00');

    // Step 8: Verify card displays outstanding amount
    await creditCardOverviewPage.verifyOutstandingAmount(0, '$1,500.00');
  });

  test('TC-1571: Verify consolidated view with no credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const creditCardOverviewPage = new CreditCardOverviewPage(page);

    // Step 1: Launch application
    await loginPage.navigate('https://creditcardanalysis.example.com');
    await expect(page).toHaveURL(/creditcardanalysis/);

    // Step 2: Login with user having no cards
    await loginPage.login('nocard@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to credit card overview section
    await creditCardOverviewPage.navigateToCreditCardOverview();
    await creditCardOverviewPage.waitForOverviewPageLoad();

    // Step 4: Verify no credit cards are displayed
    await creditCardOverviewPage.verifyCardCount(0);

    // Step 5: Verify appropriate message is displayed
    await creditCardOverviewPage.verifyNoCardsMessage();
  });
});