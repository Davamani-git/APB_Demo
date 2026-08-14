const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Credit Card Analysis Dashboard - KPI Tests', () => {
  test('TC-001: Verify Dashboard KPIs for user with multiple credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);

    // Step 2-3: Login with valid credentials
    await loginPage.login('testuser_multi', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 4: Navigate to main dashboard page
    await dashboardPage.navigateToDashboard();
    await dashboardPage.verifyKPISectionVisible();

    // Step 5: Verify Monthly Spend KPI
    await dashboardPage.verifyMonthlySpendKPI('$5,450.00');

    // Step 6: Verify Total Credit Limit KPI
    await dashboardPage.verifyTotalCreditLimitKPI('$50,000.00');

    // Step 7: Verify Available Credit KPI
    await dashboardPage.verifyAvailableCreditKPI('$38,550.00');

    // Step 8: Verify Outstanding Amount KPI
    await dashboardPage.verifyOutstandingAmountKPI('$11,450.00');

    // Step 9: Validate KPI calculations accuracy
    await dashboardPage.validateKPICalculations();
  });

  test('TC-002: Verify Dashboard KPIs for over-limit credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);

    // Step 2-3: Login with over-limit user credentials
    await loginPage.login('testuser_overlimit', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 4: Navigate to Dashboard KPIs section
    await dashboardPage.navigateToKPIsSection();
    await dashboardPage.verifyKPISectionVisible();

    // Step 5: Verify Available Credit KPI displays negative value
    await dashboardPage.verifyAvailableCreditNegative('-$2,500.00');

    // Step 6: Verify Outstanding Amount KPI highlights over-limit status
    await dashboardPage.verifyOutstandingAmountOverLimit('$22,500.00');

    // Step 7: Validate over-limit warning messages
    await dashboardPage.verifyOverLimitWarning('One or more cards have exceeded credit limit');
  });

  test('TC-003: Verify Dashboard KPIs during backend service unavailability', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);

    // Step 2-3: Login with valid credentials
    await loginPage.login('testuser', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 4: Simulate backend service unavailability (503 Service Unavailable)
    // Note: This would typically be handled via API mocking or test environment configuration
    await page.route('**/api/kpis', route => route.fulfill({ status: 503 }));

    // Step 5: Navigate to Dashboard KPIs section
    await dashboardPage.navigateToKPIsSection();
    await expect(page).not.toHaveTitle(/Error/);

    // Step 6: Verify appropriate error messages for KPIs
    await dashboardPage.verifyKPIErrorMessages('KPI data unavailable. Please try again later.');

    // Step 7: Verify dashboard maintains stability
    await dashboardPage.verifyDashboardStability();

    // Step 8: Verify no data corruption
    await dashboardPage.verifyNoDataCorruption();

    // Step 9: Verify other dashboard features remain accessible
    await dashboardPage.navigateToCardsSection();
    await dashboardPage.navigateToTransactionsSection();
  });
});

test.describe('Credit Card Analysis Dashboard - Card Overview Tests', () => {
  test('TC-004: Verify consolidated credit card overview for user with multiple active cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);

    // Step 2-3: Login with multiple cards user
    await loginPage.login('testuser_multiple', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 4: Navigate to consolidated credit card overview
    await dashboardPage.navigateToCardOverview();
    await dashboardPage.verifyCardOverviewLoaded();

    // Step 5: Verify all active credit cards are displayed
    await dashboardPage.verifyCardDisplayed('Visa *1234');
    await dashboardPage.verifyCardDisplayed('MasterCard *5678');
    await dashboardPage.verifyCardDisplayed('Amex *9012');

    // Step 6: Verify current balance for each card
    await dashboardPage.verifyCardBalance('Visa *1234', '$2,500');
    await dashboardPage.verifyCardBalance('MasterCard *5678', '$5,000');
    await dashboardPage.verifyCardBalance('Amex *9012', '$1,200');

    // Step 7: Verify credit limit for each card
    await dashboardPage.verifyCardCreditLimit('Visa *1234', '$10,000');
    await dashboardPage.verifyCardCreditLimit('MasterCard *5678', '$20,000');
    await dashboardPage.verifyCardCreditLimit('Amex *9012', '$15,000');

    // Step 8: Verify key metrics for each card
    await dashboardPage.verifyCardMetrics('Visa *1234', '$7,500', '25%', '15th Jan');

    // Step 9: Verify unified view
    await dashboardPage.verifyUnifiedView();
  });

  test('TC-005: Verify credit card overview for user with no linked cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);

    // Step 2-3: Login with no cards user
    await loginPage.login('testuser_nocards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 4: Navigate to credit card overview section
    await dashboardPage.navigateToCardOverview();
    await dashboardPage.verifyCardOverviewLoaded();

    // Step 5: Verify appropriate no cards message
    await dashboardPage.verifyNoCardsMessage('You have no credit cards linked. Please add a card to get started.');

    // Step 6: Verify clean empty state
    await dashboardPage.verifyCleanEmptyState();

    // Step 7: Verify navigation remains functional
    await dashboardPage.navigateToSettingsSection();
    await dashboardPage.navigateToProfileSection();
  });

  test('TC-006: Verify credit card overview with partial data retrieval errors', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/login/);

    // Step 2-3: Login with partial data user
    await loginPage.login('testuser_partial', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 4: Simulate data retrieval errors for specific cards
    await page.route('**/api/cards/card2', route => route.fulfill({ status: 500 }));

    // Step 5: Navigate to credit card overview section
    await dashboardPage.navigateToCardOverview();
    await dashboardPage.verifyCardOverviewLoaded();

    // Step 6: Verify successfully loaded cards display normally
    await dashboardPage.verifyCardDisplayed('Visa *1234');
    await dashboardPage.verifyCardBalance('Visa *1234', '$2,500');
    await dashboardPage.verifyCardDisplayed('Amex *9012');
    await dashboardPage.verifyCardBalance('Amex *9012', '$1,200');

    // Step 7: Verify cards with errors show error indicators
    await dashboardPage.verifyCardErrorIndicator('MasterCard *5678', 'Data temporarily unavailable');

    // Step 8: Verify interface remains functional
    await dashboardPage.clickCardDetails('Visa *1234');
    await dashboardPage.navigateToTransactionsSection();

    // Step 9: Verify retry options available for failed cards
    await dashboardPage.verifyRetryOption('MasterCard *5678');
  });
});
