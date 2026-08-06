const { test, expect } = require('@playwright/test');
const { CreditCardDashboardPage } = require('./pages/creditCardDashboard.page');

test.describe('Credit Card Analysis Dashboard - KPI Tests', () => {

  test('TC-001: Verify all KPIs display correctly for user with multiple credit cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser_multiple_cards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Verify Monthly Spend KPI is displayed
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBeTruthy();
    
    // Step 4: Verify Total Credit Limit KPI is displayed
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBeTruthy();
    
    // Step 5: Verify Available Credit KPI is displayed
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBeTruthy();
    
    // Step 6: Verify Outstanding Amount KPI is displayed
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBeTruthy();
    
    // Step 7: Verify all KPI values are calculated accurately
    // Card1: Limit=50000, Outstanding=15000, MonthlySpend=8000
    // Card2: Limit=30000, Outstanding=10000, MonthlySpend=5000
    // Expected: TotalLimit=80000, TotalOutstanding=25000, TotalSpend=13000, Available=55000
    await dashboardPage.verifyKPICalculations(80000, 25000, 13000, 55000);
  });

  test('TC-002: Verify KPI calculations with varied spending patterns', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);
    
    // Step 2: Login with credentials for user with varied spend
    await dashboardPage.login('testuser_varied_spend', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Verify Monthly Spend aggregates all transactions
    // Card1: 3 transactions (5000, 200, 15000); Card2: 2 transactions (50, 8000)
    // Expected total: 28250
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toContain('28250');
    
    // Step 4: Verify Available Credit calculation
    // Card1: Limit=100000, Outstanding=28200; Card2: Limit=50000, Outstanding=8050
    // Available = (100000 + 50000) - (28200 + 8050) = 113750
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toContain('113750');
    
    // Step 5: Verify all KPIs display with proper formatting and currency symbols
    await dashboardPage.verifyKPIFormatting();
  });

  test('TC-003: Verify KPIs display correctly for user with single credit card', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login with single card user credentials
    await dashboardPage.login('testuser_single_card', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Verify Monthly Spend for single card
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toContain('12000');
    
    // Step 4: Verify Total Credit Limit for single card
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toContain('75000');
    
    // Step 5: Verify Available Credit and Outstanding Amount
    // Outstanding: 25000; Available Credit: 50000
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toContain('25000');
    
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toContain('50000');
  });

  test('TC-004: Verify KPI persistence after navigation', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Login to dashboard
    await dashboardPage.navigate();
    await dashboardPage.login('testuser_multiple_cards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 2: Note current KPI values
    const initialMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const initialTotalLimit = await dashboardPage.getTotalCreditLimitValue();
    const initialAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const initialOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    // Step 3: Navigate to Transactions section
    await dashboardPage.navigateToTransactions();
    await expect(page).toHaveURL(/transactions/);
    
    // Step 4: Navigate back to Dashboard
    await dashboardPage.navigateToDashboard();
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 5: Verify all KPIs match previously recorded values
    const currentMonthlySpend = await dashboardPage.getMonthlySpendValue();
    const currentTotalLimit = await dashboardPage.getTotalCreditLimitValue();
    const currentAvailableCredit = await dashboardPage.getAvailableCreditValue();
    const currentOutstanding = await dashboardPage.getOutstandingAmountValue();
    
    expect(currentMonthlySpend).toBe(initialMonthlySpend);
    expect(currentTotalLimit).toBe(initialTotalLimit);
    expect(currentAvailableCredit).toBe(initialAvailableCredit);
    expect(currentOutstanding).toBe(initialOutstanding);
  });

  test('TC-005: Verify responsive layout across different screen sizes', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch on desktop browser
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.navigate();
    
    // Step 2: Login with valid credentials
    await dashboardPage.login('testuser_multiple_cards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Verify all four KPIs are visible on desktop
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Step 4: Resize to tablet dimensions
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    
    // Step 5: Resize to mobile dimensions
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

});

test.describe('Credit Card Analysis Dashboard - Empty State Tests', () => {

  test('TC-006: Verify dashboard behavior for user with no credit cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login with no cards user credentials
    await dashboardPage.login('testuser_no_cards', 'Pass@123');
    await expect(page).toHaveURL(/dashboard/);
    
    // Step 3: Verify appropriate message is displayed
    await expect(dashboardPage.emptyStateMessage).toBeVisible();
    const messageText = await dashboardPage.emptyStateMessage.textContent();
    expect(messageText).toMatch(/no credit card|no cards registered/i);
    
    // Step 4: Verify Monthly Spend shows zero or empty state
    await dashboardPage.verifyKPIEmptyState(dashboardPage.monthlySpendKPI);
    
    // Step 5: Verify Total Credit Limit shows zero or empty state
    await dashboardPage.verifyKPIEmptyState(dashboardPage.totalCreditLimitKPI);
    
    // Step 6: Verify Available Credit shows zero or empty state
    await dashboardPage.verifyKPIEmptyState(dashboardPage.availableCreditKPI);
    
    // Step 7: Verify Outstanding Amount shows zero or empty state
    await dashboardPage.verifyKPIEmptyState(dashboardPage.outstandingAmountKPI);
  });

  test('TC-007: Verify empty state for visualizations when no cards registered', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login with no cards user
    await dashboardPage.login('testuser_no_cards', 'Pass@123');
    
    // Step 3: Verify all KPIs show zero or empty state
    await dashboardPage.verifyKPIEmptyState(dashboardPage.monthlySpendKPI);
    await dashboardPage.verifyKPIEmptyState(dashboardPage.totalCreditLimitKPI);
    await dashboardPage.verifyKPIEmptyState(dashboardPage.availableCreditKPI);
    await dashboardPage.verifyKPIEmptyState(dashboardPage.outstandingAmountKPI);
    
    // Step 4: Verify Category-wise Spending visualization empty state
    const categorySpendingEmpty = await dashboardPage.verifyCategorySpendingEmptyState();
    expect(categorySpendingEmpty).toBeTruthy();
    
    // Step 5: Verify Monthly Spend Trends visualization empty state
    const monthlyTrendsEmpty = await dashboardPage.verifyMonthlyTrendsEmptyState();
    expect(monthlyTrendsEmpty).toBeTruthy();
  });

  test('TC-008: Verify add credit card option in empty state', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login with no cards user
    await dashboardPage.login('testuser_no_cards', 'Pass@123');
    
    // Step 3: Verify empty state message is displayed
    await expect(dashboardPage.emptyStateMessage).toBeVisible();
    
    // Step 4: Verify Add Credit Card button is visible
    await expect(dashboardPage.addCreditCardButton).toBeVisible();
    
    // Step 5: Verify clicking add card navigates to card registration page
    await dashboardPage.addCreditCardButton.click();
    await expect(page).toHaveURL(/cards\/(add|manage)/);
  });

});

test.describe('Credit Card Analysis Dashboard - Incomplete Data Tests', () => {

  test('TC-009: Verify dashboard with missing credit limit data', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login with incomplete data user
    await dashboardPage.login('testuser_incomplete_data', 'Pass@123');
    
    // Step 3: Verify Monthly Spend displays correctly
    // Card1: Complete data, MonthlySpend=5000; Card2: Missing limit, MonthlySpend=3000
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toContain('8000');
    
    // Step 4: Verify Total Credit Limit with indicator for missing data
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await dashboardPage.verifyIncompleteDataIndicator(dashboardPage.totalCreditLimitKPI);
    
    // Step 5: Verify Available Credit with appropriate indicator
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await dashboardPage.verifyIncompleteDataIndicator(dashboardPage.availableCreditKPI);
    
    // Step 6: Verify Outstanding Amount displays available data
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBeTruthy();
    
    // Step 7: Verify indicator or tooltip explains unavailable metrics
    await dashboardPage.verifyIncompleteDataTooltip();
  });

  test('TC-010: Verify dashboard with missing outstanding amount data', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login with missing outstanding data user
    await dashboardPage.login('testuser_missing_outstanding', 'Pass@123');
    
    // Step 3: Verify Monthly Spend displays correctly
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toContain('11000');
    
    // Step 4: Verify Total Credit Limit displays correctly
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalLimit).toContain('100000');
    
    // Step 5: Verify Outstanding Amount with indicator for missing values
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await dashboardPage.verifyIncompleteDataIndicator(dashboardPage.outstandingAmountKPI);
    
    // Step 6: Verify Available Credit handles missing outstanding data
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await dashboardPage.verifyIncompleteDataIndicator(dashboardPage.availableCreditKPI);
    
    // Step 7: Verify dashboard displays warning about incomplete data
    await dashboardPage.verifyIncompleteDataWarning();
  });

  test('TC-011: Verify dashboard with mixed incomplete data across multiple cards', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login with mixed incomplete data user
    await dashboardPage.login('testuser_mixed_incomplete', 'Pass@123');
    
    // Step 3: Verify Monthly Spend aggregates all available data
    // Card1: Spend=6000; Card2: Spend=4000; Card3: Spend=5000
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toContain('15000');
    
    // Step 4: Verify Total Credit Limit with indicator
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await dashboardPage.verifyIncompleteDataIndicator(dashboardPage.totalCreditLimitKPI);
    
    // Step 5: Verify Outstanding Amount with indicator
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await dashboardPage.verifyIncompleteDataIndicator(dashboardPage.outstandingAmountKPI);
    
    // Step 6: Verify Available Credit calculated for complete data only
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await dashboardPage.verifyIncompleteDataIndicator(dashboardPage.availableCreditKPI);
    
    // Step 7: Verify comprehensive indicator explains all missing data types
    await dashboardPage.verifyComprehensiveIncompleteDataMessage();
  });

  test('TC-012: Verify dashboard when all cards have incomplete data', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login with all incomplete data user
    await dashboardPage.login('testuser_all_incomplete', 'Pass@123');
    
    // Step 3: Verify dashboard loads without errors
    await expect(page).toHaveURL(/dashboard/);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    
    // Step 4: Verify all KPIs display with N/A or empty state indicators
    await dashboardPage.verifyAllKPIsIncomplete();
    
    // Step 5: Verify prominent message about incomplete data
    await expect(dashboardPage.incompleteDataMessage).toBeVisible();
    const messageText = await dashboardPage.incompleteDataMessage.textContent();
    expect(messageText).toMatch(/incomplete|unavailable|update/i);
    
    // Step 6: Verify option to manage credit card information
    await expect(dashboardPage.manageCardsButton).toBeVisible();
  });

  test('TC-013: Verify tooltips for incomplete data indicators', async ({ page }) => {
    const dashboardPage = new CreditCardDashboardPage(page);
    
    // Step 1: Launch application
    await dashboardPage.navigate();
    
    // Step 2: Login with incomplete data user
    await dashboardPage.login('testuser_incomplete_data', 'Pass@123');
    
    // Step 3: Identify KPIs with incomplete data indicators
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    
    // Step 4: Hover over Total Credit Limit indicator
    await dashboardPage.hoverOverIncompleteDataIndicator(dashboardPage.totalCreditLimitKPI);
    await dashboardPage.verifyTooltipContent(/credit limit unavailable|missing/i);
    
    // Step 5: Hover over Available Credit indicator
    await dashboardPage.hoverOverIncompleteDataIndicator(dashboardPage.availableCreditKPI);
    await dashboardPage.verifyTooltipContent(/partially calculated|incomplete/i);
    
    // Step 6: Hover over Outstanding Amount indicator
    await dashboardPage.hoverOverIncompleteDataIndicator(dashboardPage.outstandingAmountKPI);
    await dashboardPage.verifyTooltipContent(/outstanding.*unavailable|missing/i);
    
    // Step 7: Verify tooltips provide actionable guidance
    await dashboardPage.verifyTooltipActionableGuidance();
  });

});
