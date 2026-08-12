const { test, expect } = require('@playwright/test');
const { CreditCardDashboardPage } = require('./pages/creditCardDashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Credit Card Analysis Dashboard - KPI Tests', () => {

  test('TC-001: Verify all KPIs display correctly for user with active credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid credentials for user with active cards
    await loginPage.login('testuser_active', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Verify Monthly Spend KPI
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toContainText('$2,500.00');

    // Step 4: Verify Total Credit Limit KPI
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toContainText('$15,000.00');

    // Step 5: Verify Available Credit KPI
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toContainText('$10,000.00');

    // Step 6: Verify Outstanding Amount KPI
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toContainText('$5,000.00');
  });

  test('TC-002: Verify KPI aggregation for user with multiple active credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid credentials for user with multiple cards
    await loginPage.login('testuser_multiple', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Note individual card details (verification context)
    // Card 1: Limit=$5000, Balance=$2000, Spend=$800
    // Card 2: Limit=$10000, Balance=$3000, Spend=$1200

    // Step 4: Verify Monthly Spend KPI aggregates correctly
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toContainText('$2,000.00');

    // Step 5: Verify Total Credit Limit KPI aggregates correctly
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toContainText('$15,000.00');

    // Step 6: Verify Available Credit KPI calculates correctly
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toContainText('$10,000.00');

    // Step 7: Verify Outstanding Amount KPI aggregates correctly
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toContainText('$5,000.00');
  });

  test('TC-003: Verify KPIs display correctly for user with single active credit card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid credentials for user with single card
    await loginPage.login('testuser_single', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Verify all four KPIs are visible
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();

    // Step 4: Verify KPI values match single card data
    await expect(dashboardPage.monthlySpendKPI).toContainText('$600.00');
    await expect(dashboardPage.totalCreditLimitKPI).toContainText('$8,000.00');
    await expect(dashboardPage.availableCreditKPI).toContainText('$6,500.00');
    await expect(dashboardPage.outstandingAmountKPI).toContainText('$1,500.00');
  });

  test('TC-004: Verify dashboard behavior for user with no credit cards linked', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid credentials for user with no cards
    await loginPage.login('testuser_nocards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to Dashboard KPIs section
    await dashboardPage.navigateToDashboard();
    await expect(page).not.toHaveURL(/error/);

    // Step 4: Verify appropriate message for no credit card data
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    await expect(dashboardPage.noCardsMessage).toContainText(/No credit cards linked|Please add a credit card/);

    // Step 5: Verify KPI values display zero or null appropriately
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.monthlySpendKPI);
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.totalCreditLimitKPI);
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.availableCreditKPI);
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.outstandingAmountKPI);
  });

  test('TC-005: Verify dashboard for user with previously removed credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid credentials for user with removed cards
    await loginPage.login('testuser_removed', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Access Dashboard KPIs section
    await dashboardPage.navigateToDashboard();
    await expect(page).not.toHaveURL(/error/);

    // Step 4: Verify appropriate message and zero KPI values
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    await expect(dashboardPage.noCardsMessage).toContainText(/No active credit cards found/);
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.monthlySpendKPI);
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.totalCreditLimitKPI);
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.availableCreditKPI);
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.outstandingAmountKPI);
  });

  test('TC-006: Verify dashboard empty state for new user with no linked cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Register and login as new user
    await loginPage.login('newuser_001', 'NewPass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: View Dashboard KPIs section
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 4: Verify empty state with call-to-action message
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.monthlySpendKPI);
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.totalCreditLimitKPI);
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.availableCreditKPI);
    await dashboardPage.verifyKPIDisplaysZeroOrNull(dashboardPage.outstandingAmountKPI);
    await expect(dashboardPage.emptyStateMessage).toBeVisible();
    await expect(dashboardPage.emptyStateMessage).toContainText(/Get started by adding your first credit card/);
  });

  test('TC-007: Verify error handling when KPI calculation service is unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid credentials
    await loginPage.login('testuser_active', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Simulate KPI service unavailability (503 Service Unavailable)
    // Note: This requires test configuration or API mocking setup
    await page.route('**/api/kpi/**', route => route.fulfill({
      status: 503,
      body: JSON.stringify({ error: 'Service Unavailable' })
    }));

    // Step 4: Access Dashboard KPIs section
    await dashboardPage.navigateToDashboard();
    await expect(page).not.toHaveTitle(/Error/);

    // Step 5: Verify error indicator or warning message
    await expect(dashboardPage.kpiErrorMessage).toBeVisible();
    await expect(dashboardPage.kpiErrorMessage).toContainText(/Unable to load KPI data|Please try again later/);
    await dashboardPage.verifyKPIShowsErrorIndicator(dashboardPage.monthlySpendKPI);

    // Step 6: Verify application remains stable
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    await expect(page).not.toHaveURL(/error/);
  });

  test('TC-008: Verify error handling when KPI services return invalid data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid credentials
    await loginPage.login('testuser_active', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Simulate invalid data responses
    await page.route('**/api/kpi/monthly-spend', route => route.fulfill({
      status: 200,
      body: JSON.stringify({ value: -500 })
    }));
    await page.route('**/api/kpi/total-credit-limit', route => route.fulfill({
      status: 200,
      body: JSON.stringify({ value: null })
    }));

    // Step 4: Access Dashboard KPIs section
    await dashboardPage.navigateToDashboard();
    await expect(page).not.toHaveTitle(/Error/);

    // Step 5: Verify affected KPIs display warning indicators
    await dashboardPage.verifyKPIShowsWarningIndicator(dashboardPage.monthlySpendKPI);
    await dashboardPage.verifyKPIShowsWarningIndicator(dashboardPage.totalCreditLimitKPI);

    // Step 6: Verify system does not display incorrect or negative values
    const monthlySpendText = await dashboardPage.monthlySpendKPI.textContent();
    expect(monthlySpendText).not.toContain('-500');
    expect(monthlySpendText).toMatch(/Data unavailable|Invalid data|--/);
  });

  test('TC-009: Verify partial service availability handling', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new CreditCardDashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid credentials
    await loginPage.login('testuser_active', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Simulate partial service availability
    await page.route('**/api/kpi/monthly-spend', route => route.fulfill({
      status: 200,
      body: JSON.stringify({ value: 2500 })
    }));
    await page.route('**/api/kpi/total-credit-limit', route => route.fulfill({
      status: 200,
      body: JSON.stringify({ value: 15000 })
    }));
    await page.route('**/api/kpi/available-credit', route => route.fulfill({
      status: 503,
      body: JSON.stringify({ error: 'Service Unavailable' })
    }));
    await page.route('**/api/kpi/outstanding-amount', route => route.abort('timedout'));

    // Step 4: Access Dashboard KPIs section
    await dashboardPage.navigateToDashboard();

    // Step 5: Verify available KPIs display correct values
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toContainText('$2,500.00');
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toContainText('$15,000.00');

    // Step 6: Verify unavailable KPIs display error indicators
    await dashboardPage.verifyKPIShowsErrorIndicator(dashboardPage.availableCreditKPI);
    await dashboardPage.verifyKPIShowsErrorIndicator(dashboardPage.outstandingAmountKPI);

    // Step 7: Verify overall dashboard remains functional
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    await expect(page).not.toHaveURL(/error/);
  });

});
