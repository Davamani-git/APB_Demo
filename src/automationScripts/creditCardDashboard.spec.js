const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Credit Card Analysis Dashboard - KPI Tests', () => {

  test('TC-1220: Verify all KPIs are displayed correctly with active transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with valid user credentials
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to the main dashboard page
    await dashboardPage.waitForDashboardToLoad();
    await expect(dashboardPage.kpiSection).toBeVisible();

    // Step 4: Verify Monthly Spend KPI
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend).toBe('$2,500.00');

    // Step 5: Verify Total Credit Limit KPI
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('$15,000.00');

    // Step 6: Verify Available Credit KPI
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$11,000.00');

    // Step 7: Verify Outstanding Amount KPI
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$4,000.00');

    // Step 8: Validate calculation accuracy
    const calculatedAvailableCredit = await dashboardPage.calculateAvailableCredit(totalCreditLimit, outstandingAmount);
    expect(calculatedAvailableCredit).toBe(availableCredit);
  });

  test('TC-1221: Verify KPIs display correctly for user with zero transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user having zero transactions
    await loginPage.login('zerotransuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to the main dashboard page
    await dashboardPage.waitForDashboardToLoad();

    // Step 4: Verify Monthly Spend KPI displays $0.00 or null
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    const monthlySpend = await dashboardPage.getMonthlySpendValue();
    expect(monthlySpend === '$0.00' || monthlySpend === '' || monthlySpend === 'null').toBeTruthy();

    // Step 5: Check browser console for errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    await page.reload();
    await dashboardPage.waitForDashboardToLoad();
    expect(consoleErrors.length).toBe(0);

    // Step 6: Verify other KPIs are displayed correctly
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('$10,000.00');

    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$10,000.00');

    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const outstandingAmount = await dashboardPage.getOutstandingAmountValue();
    expect(outstandingAmount).toBe('$0.00');
  });

  test('TC-1222: Verify KPI aggregation for multiple linked credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user having multiple cards
    await loginPage.login('multicard@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to the main dashboard page
    await dashboardPage.waitForDashboardToLoad();
    await expect(dashboardPage.kpiSection).toBeVisible();

    // Step 4: Note individual credit limits (verification through UI or data layer)
    const cardLimits = await dashboardPage.getIndividualCardLimits();
    expect(cardLimits).toContain('$5,000.00');
    expect(cardLimits).toContain('$8,000.00');
    expect(cardLimits).toContain('$7,000.00');

    // Step 5: Verify Total Credit Limit KPI aggregates all card limits
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    const totalCreditLimit = await dashboardPage.getTotalCreditLimitValue();
    expect(totalCreditLimit).toBe('$20,000.00');

    // Step 6: Note individual outstanding amounts
    const cardOutstandings = await dashboardPage.getIndividualCardOutstandings();
    expect(cardOutstandings).toContain('$1,500.00');
    expect(cardOutstandings).toContain('$3,000.00');
    expect(cardOutstandings).toContain('$2,000.00');

    // Step 7: Verify Available Credit KPI aggregates correctly
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    const availableCredit = await dashboardPage.getAvailableCreditValue();
    expect(availableCredit).toBe('$13,500.00');

    // Step 8: Validate the aggregation formula
    const calculatedAvailableCredit = await dashboardPage.calculateAvailableCredit(totalCreditLimit, '$6,500.00');
    expect(calculatedAvailableCredit).toBe(availableCredit);
  });
});

test.describe('Credit Card Analysis Dashboard - Credit Cards Overview Tests', () => {

  test('TC-1223: Verify all linked credit cards are displayed with correct details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user having multiple cards
    await loginPage.login('multicard@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to the credit cards overview section
    await dashboardPage.navigateToCreditCardsOverview();
    await expect(dashboardPage.creditCardsOverviewSection).toBeVisible();

    // Step 4: Verify all linked credit cards are displayed
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(3);

    // Step 5: Verify each card displays masked card number
    const maskedCardNumbers = await dashboardPage.getMaskedCardNumbers();
    expect(maskedCardNumbers).toContain('**** 1234');
    expect(maskedCardNumbers).toContain('**** 5678');
    expect(maskedCardNumbers).toContain('**** 9012');

    // Step 6: Verify each card displays current balance
    const cardBalances = await dashboardPage.getCardBalances();
    expect(cardBalances).toContain('$1,500.00');
    expect(cardBalances).toContain('$3,000.00');
    expect(cardBalances).toContain('$2,000.00');

    // Step 7: Verify each card displays credit limit
    const cardLimits = await dashboardPage.getCardLimits();
    expect(cardLimits).toContain('$5,000.00');
    expect(cardLimits).toContain('$8,000.00');
    expect(cardLimits).toContain('$7,000.00');

    // Step 8: Resize browser and verify responsive layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(dashboardPage.creditCardsOverviewSection).toBeVisible();
    await dashboardPage.verifyNoOverlappingContent();

    await page.setViewportSize({ width: 375, height: 667 });
    await expect(dashboardPage.creditCardsOverviewSection).toBeVisible();
    await dashboardPage.verifyNoOverlappingContent();
  });

  test('TC-1224: Verify appropriate message when no credit cards are linked', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user having no cards
    await loginPage.login('nocards@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to the credit cards overview section
    await dashboardPage.navigateToCreditCardsOverview();
    await expect(dashboardPage.creditCardsOverviewSection).toBeVisible();

    // Step 4: Verify no credit card details are displayed
    const cardCount = await dashboardPage.getCreditCardCount();
    expect(cardCount).toBe(0);

    // Step 5: Verify appropriate message is displayed
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    const messageText = await dashboardPage.getNoCardsMessageText();
    expect(messageText).toMatch(/No credit cards|No cards available|No credit cards linked/i);

    // Step 6: Check that dashboard does not throw errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    await page.reload();
    await dashboardPage.waitForDashboardToLoad();
    expect(consoleErrors.length).toBe(0);
  });

  test('TC-1225: Verify credit utilization is calculated and displayed correctly for each card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/creditcard-dashboard/);

    // Step 2: Login with user having multiple cards with varying balances
    await loginPage.login('multicard@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);

    // Step 3: Navigate to the credit cards overview section
    await dashboardPage.navigateToCreditCardsOverview();
    await expect(dashboardPage.creditCardsOverviewSection).toBeVisible();

    // Step 4: Verify credit utilization for Card 1
    const card1Utilization = await dashboardPage.getCreditUtilizationForCard(0);
    expect(card1Utilization).toBe('30%');

    // Step 5: Verify credit utilization for Card 2
    const card2Utilization = await dashboardPage.getCreditUtilizationForCard(1);
    expect(card2Utilization).toBe('37.5%');

    // Step 6: Verify credit utilization for Card 3
    const card3Utilization = await dashboardPage.getCreditUtilizationForCard(2);
    expect(card3Utilization).toBe('28.57%');

    // Step 7: Validate calculation formula for each card
    const card1CalcUtilization = await dashboardPage.calculateCreditUtilization('$1,500.00', '$5,000.00');
    expect(card1CalcUtilization).toBe('30%');

    const card2CalcUtilization = await dashboardPage.calculateCreditUtilization('$3,000.00', '$8,000.00');
    expect(card2CalcUtilization).toBe('37.5%');

    const card3CalcUtilization = await dashboardPage.calculateCreditUtilization('$2,000.00', '$7,000.00');
    expect(card3CalcUtilization).toBe('28.57%');
  });
});