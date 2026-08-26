const { test, expect } = require('@playwright/test');
const { CreditCardDashboardPage } = require('./pages/creditCardDashboard.page');

test.describe('Credit Card Analysis Dashboard - KPI Tests', () => {
  test('TC-001: Verify KPIs for user with multiple credit cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser_multiple_cards', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to dashboard home page
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.kpiSection).toBeVisible();
    
    // Step 4: Verify Monthly Spend KPI
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toContainText('$2,450.00');
    
    // Step 5: Verify Total Credit Limit KPI
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toContainText('$15,000.00');
    
    // Step 6: Verify Available Credit KPI
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toContainText('$12,550.00');
    
    // Step 7: Verify Outstanding Amount KPI
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toContainText('$2,450.00');
  });

  test('TC-002: Verify KPIs for user with no transaction data', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser_no_transactions', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to dashboard home page
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.kpiSection).toBeVisible();
    
    // Step 4: Verify Monthly Spend KPI value
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toContainText('$0.00');
    
    // Step 5: Check for data completeness indicator
    await expect(dashboardPage.noTransactionsMessage).toBeVisible();
    await expect(dashboardPage.noTransactionsMessage).toContainText(/No transactions recorded/i);
  });

  test('TC-003: Verify KPIs for user with partial transaction data', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser_partial_data', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to dashboard home page
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.kpiSection).toBeVisible();
    
    // Step 4: Verify Monthly Spend KPI value
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toContainText('$850.00');
    
    // Step 5: Check for data completeness indicator
    await expect(dashboardPage.warningIcon).toBeVisible();
    await dashboardPage.warningIcon.hover();
    await expect(dashboardPage.warningTooltip).toContainText(/Some transaction data unavailable/i);
  });

  test('TC-004: Verify error handling when KPI calculation service is unavailable', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Simulate backend KPI calculation service unavailability
    await page.route('**/api/kpi/calculate', route => route.abort());
    
    // Step 4: Navigate to dashboard home page
    await dashboardPage.navigateToDashboard();
    
    // Step 5: Verify error message is displayed in KPI section
    await expect(dashboardPage.kpiErrorMessage).toBeVisible();
    await expect(dashboardPage.kpiErrorMessage).toContainText(/KPIs cannot be loaded at this time/i);
    
    // Step 6: Verify KPI values are not displayed or show placeholder
    await expect(dashboardPage.monthlySpendKPI).toContainText(/--|N\/A/);
  });
});

test.describe('Credit Card Analysis Dashboard - Credit Cards Display Tests', () => {
  test('TC-005: Verify consolidated view of multiple credit cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser_3cards', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to dashboard home page
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.creditCardsSection).toBeVisible();
    
    // Step 4: Verify all three credit cards are displayed
    await expect(dashboardPage.getCreditCardByIdentifier('Visa *1234')).toBeVisible();
    await expect(dashboardPage.getCreditCardByIdentifier('MasterCard *5678')).toBeVisible();
    await expect(dashboardPage.getCreditCardByIdentifier('Amex *9012')).toBeVisible();
    
    // Step 5: Verify each card displays its current balance
    await expect(dashboardPage.getCardBalance('Visa *1234')).toContainText('$1,200.00');
    await expect(dashboardPage.getCardBalance('MasterCard *5678')).toContainText('$850.00');
    await expect(dashboardPage.getCardBalance('Amex *9012')).toContainText('$400.00');
    
    // Step 6: Verify each card displays its credit limit
    await expect(dashboardPage.getCardLimit('Visa *1234')).toContainText('$5,000.00');
    await expect(dashboardPage.getCardLimit('MasterCard *5678')).toContainText('$7,000.00');
    await expect(dashboardPage.getCardLimit('Amex *9012')).toContainText('$3,000.00');
    
    // Step 7: Verify consolidated interface layout
    await expect(dashboardPage.creditCardsSection).toBeVisible();
    const cardCount = await dashboardPage.getAllCreditCards().count();
    expect(cardCount).toBe(3);
  });

  test('TC-006: Verify message when user has no active credit cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser_no_cards', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to dashboard home page
    await dashboardPage.navigateToDashboard();
    
    // Step 4: Verify credit cards section displays appropriate message
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    await expect(dashboardPage.noCardsMessage).toContainText(/No credit cards are available to display|You have no active credit cards/i);
    
    // Step 5: Verify no credit card details are shown
    const cardCount = await dashboardPage.getAllCreditCards().count();
    expect(cardCount).toBe(0);
  });

  test('TC-007: Verify error handling for credit card with missing balance data', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser_missing_balance', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to dashboard home page
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.creditCardsSection).toBeVisible();
    
    // Step 4: Verify affected credit card is displayed
    await expect(dashboardPage.getCreditCardByIdentifier('Visa *1234')).toBeVisible();
    
    // Step 5: Verify error indicator or default value is displayed for missing balance
    await expect(dashboardPage.getCardBalance('Visa *1234')).toContainText(/N\/A|--|/i);
    await expect(dashboardPage.getCardErrorIcon('Visa *1234')).toBeVisible();
    
    // Step 6: Verify system handles the missing data gracefully without crashing
    await expect(dashboardPage.creditCardsSection).toBeVisible();
    const cardCount = await dashboardPage.getAllCreditCards().count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('TC-008: Verify error handling for credit card with invalid limit data', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser_invalid_limit', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to dashboard home page
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.creditCardsSection).toBeVisible();
    
    // Step 4: Verify affected credit card is displayed
    await expect(dashboardPage.getCreditCardByIdentifier('MasterCard *5678')).toBeVisible();
    
    // Step 5: Verify error indicator or default value is displayed for invalid limit
    await expect(dashboardPage.getCardLimit('MasterCard *5678')).toContainText(/Invalid|--|/i);
    await expect(dashboardPage.getCardErrorIcon('MasterCard *5678')).toBeVisible();
    
    // Step 6: Verify system handles the invalid data gracefully without crashing
    await expect(dashboardPage.creditCardsSection).toBeVisible();
    const cardCount = await dashboardPage.getAllCreditCards().count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('TC-009: Verify error handling for credit card with multiple data errors', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser_multiple_errors', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Navigate to dashboard home page
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.creditCardsSection).toBeVisible();
    
    // Step 4: Verify affected credit card is displayed
    await expect(dashboardPage.getCreditCardByIdentifier('Amex *9012')).toBeVisible();
    
    // Step 5: Verify error indicators are displayed for both balance and limit fields
    await expect(dashboardPage.getCardBalance('Amex *9012')).toContainText(/N\/A/i);
    await expect(dashboardPage.getCardLimit('Amex *9012')).toContainText(/--|/i);
    await expect(dashboardPage.getCardErrorIcon('Amex *9012')).toBeVisible();
    
    // Step 6: Verify system handles multiple data errors gracefully without crashing
    await expect(dashboardPage.creditCardsSection).toBeVisible();
    const cardCount = await dashboardPage.getAllCreditCards().count();
    expect(cardCount).toBeGreaterThan(0);
  });
});