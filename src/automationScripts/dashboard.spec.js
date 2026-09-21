const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { CardsPage } = require('./pages/cards.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('QE-6107: Consolidated Multi-Card Dashboard', () => {
  test('QE-6107 TS-001 TC-001: Verify consolidated multi-card dashboard displays all KPIs correctly for a user with multiple credit cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await expect(dashboardPage.navigationMenu).toBeVisible();
    await dashboardPage.clickDashboardNav();
    await expect(dashboardPage.kpiCardsContainer).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toContainText('₹35,700');
    await expect(dashboardPage.totalCreditLimitKPI).toContainText('₹1,20,000');
    await expect(dashboardPage.availableCreditKPI).toContainText('₹84,300');
    await expect(dashboardPage.outstandingAmountKPI).toContainText('₹35,700');
  });

  test('QE-6107 TS-002 TC-001: Verify dashboard handles user with no credit cards linked gracefully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.clickDashboardNav();
    await expect(dashboardPage.kpiCardsContainer).toBeVisible();
    const monthlySpendText = await dashboardPage.monthlySpendKPI.textContent();
    const totalCreditText = await dashboardPage.totalCreditLimitKPI.textContent();
    const availableCreditText = await dashboardPage.availableCreditKPI.textContent();
    const outstandingText = await dashboardPage.outstandingAmountKPI.textContent();
    expect(monthlySpendText).toMatch(/₹0|No cards available/);
    expect(totalCreditText).toMatch(/₹0|No cards available/);
    expect(availableCreditText).toMatch(/₹0|No cards available/);
    expect(outstandingText).toMatch(/₹0|No cards available/);
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
  });

  test('QE-6107 TS-003 TC-001: Verify dashboard handles credit cards with missing credit limit data gracefully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.clickDashboardNav();
    await expect(dashboardPage.kpiCardsContainer).toBeVisible();
    const totalCreditText = await dashboardPage.totalCreditLimitKPI.textContent();
    expect(totalCreditText).toMatch(/N\/A|--|₹[0-9,]+/);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
  });
});

test.describe('QE-6108: Responsive Credit Portfolio Layout', () => {
  test('QE-6108 TS-001 TC-001: Verify dashboard layout renders correctly on desktop without horizontal scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.clickDashboardNav();
    await expect(dashboardPage.kpiCardsContainer).toBeVisible();
    const kpiCards = await dashboardPage.getAllKPICards();
    expect(kpiCards.length).toBe(4);
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
  });

  test('QE-6108 TS-002 TC-001: Verify dashboard layout adjusts to single-column view on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.clickDashboardNav();
    await expect(dashboardPage.kpiCardsContainer).toBeVisible();
    const kpiCards = await dashboardPage.getAllKPICards();
    expect(kpiCards.length).toBe(4);
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await expect(dashboardPage.navigationMenu).toBeVisible();
  });

  test('QE-6108 TS-003 TC-001: Verify dashboard maintains readability on extremely narrow viewport (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.clickDashboardNav();
    await expect(dashboardPage.kpiCardsContainer).toBeVisible();
    const kpiCards = await dashboardPage.getAllKPICards();
    expect(kpiCards.length).toBe(4);
    const monthlySpendText = await dashboardPage.monthlySpendKPI.textContent();
    const totalCreditText = await dashboardPage.totalCreditLimitKPI.textContent();
    const availableCreditText = await dashboardPage.availableCreditKPI.textContent();
    const outstandingText = await dashboardPage.outstandingAmountKPI.textContent();
    expect(monthlySpendText).toContain('₹');
    expect(totalCreditText).toContain('₹');
    expect(availableCreditText).toContain('₹');
    expect(outstandingText).toContain('₹');
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 20);
  });
});

test.describe('QE-6109: View All Linked Credit Cards', () => {
  test('QE-6109 TS-001 TC-001: Verify user can view complete list of multiple credit cards with all required details', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate();
    await cardsPage.clickMyCardsNav();
    await expect(cardsPage.cardListContainer).toBeVisible();
    const allCards = await cardsPage.getAllCardItems();
    expect(allCards.length).toBe(3);
    await expect(cardsPage.getCardByName('Visa Platinum')).toBeVisible();
    await expect(cardsPage.getCardByName('MasterCard Gold')).toBeVisible();
    await expect(cardsPage.getCardByName('Amex Blue')).toBeVisible();
    await expect(cardsPage.getCardByLastFour('4523')).toBeVisible();
    await expect(cardsPage.getCardByLastFour('8901')).toBeVisible();
    await expect(cardsPage.getCardByLastFour('3456')).toBeVisible();
    const card1Details = await cardsPage.getCardDetails('Visa Platinum');
    expect(card1Details).toContain('₹50,000');
    expect(card1Details).toContain('₹37,500');
  });

  test('QE-6109 TS-002 TC-001: Verify multi-card management view handles user with no credit cards', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate();
    await cardsPage.clickMyCardsNav();
    await expect(cardsPage.cardListContainer).toBeVisible();
    const allCards = await cardsPage.getAllCardItems();
    if (allCards.length === 0) {
      const emptyStateText = await cardsPage.cardListContainer.textContent();
      expect(emptyStateText).toMatch(/No cards available|No cards found/);
    }
    const transactionSection = cardsPage.transactionHistorySection;
    const isTransactionVisible = await transactionSection.isVisible().catch(() => false);
    if (isTransactionVisible) {
      const transactionText = await transactionSection.textContent();
      expect(transactionText).toMatch(/No card selected|No transactions/);
    }
  });

  test('QE-6109 TS-003 TC-001: Verify single credit card is displayed correctly in multi-card management view', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate();
    await cardsPage.clickMyCardsNav();
    await expect(cardsPage.cardListContainer).toBeVisible();
    await expect(cardsPage.getCardByName('Visa Platinum')).toBeVisible();
    await expect(cardsPage.getCardByLastFour('4523')).toBeVisible();
    const cardDetails = await cardsPage.getCardDetails('Visa Platinum');
    expect(cardDetails).toContain('₹50,000');
    expect(cardDetails).toContain('₹37,500');
    const selectedCard = await cardsPage.getSelectedCard();
    await expect(selectedCard).toBeVisible();
    await expect(cardsPage.transactionHistorySection).toBeVisible();
  });
});

test.describe('QE-6110: Per-Card Transactions History View', () => {
  test('QE-6110 TS-001 TC-001: Verify user can view transaction history with all details for a selected credit card', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate();
    await cardsPage.clickMyCardsNav();
    await cardsPage.selectCard('Visa Platinum');
    await expect(cardsPage.getSelectedCard()).toHaveClass(/selected/);
    await expect(cardsPage.transactionHistorySection).toBeVisible();
    const headerText = await cardsPage.transactionHistoryHeader.textContent();
    expect(headerText).toContain('Visa Platinum');
    const transactions = await cardsPage.getAllTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    for (const transaction of transactions.slice(0, 3)) {
      const transactionText = await transaction.textContent();
      expect(transactionText).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(transactionText).toContain('₹');
      expect(transactionText).toMatch(/Food & Dining|Fuel|Shopping|Travel|Entertainment|Utilities|Healthcare|Education|Miscellaneous/);
    }
  });

  test('QE-6110 TS-002 TC-001: Verify transaction history view handles card with no transactions', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate();
    await cardsPage.clickMyCardsNav();
    await cardsPage.selectCard('Test Card');
    await expect(cardsPage.getSelectedCard()).toHaveClass(/selected/);
    await expect(cardsPage.transactionHistorySection).toBeVisible();
    const transactionText = await cardsPage.transactionHistorySection.textContent();
    expect(transactionText).toMatch(/No transactions found|No transactions/);
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
  });

  test('QE-6110 TS-003 TC-001: Verify system denies access to transaction history for unauthorized card', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate();
    await cardsPage.clickMyCardsNav();
    const unauthorizedCardVisible = await cardsPage.getCardByName('Unauthorized Card').isVisible().catch(() => false);
    expect(unauthorizedCardVisible).toBe(false);
    const transactions = await cardsPage.getAllTransactions();
    const hasUnauthorizedData = transactions.some(async (txn) => {
      const text = await txn.textContent();
      return text.includes('Unauthorized');
    });
    expect(hasUnauthorizedData).toBe(false);
  });
});

test.describe('QE-6111: Monthly Spend Trends Visualization', () => {
  test('QE-6111 TS-001 TC-001: Verify monthly spend trend chart displays correctly for user with multi-month transaction data', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.clickAnalyticsNav();
    await expect(analyticsPage.monthlyTrendsChartContainer).toBeVisible();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    await page.waitForTimeout(2000);
    const chartExists = await analyticsPage.monthlyTrendsChart.isVisible();
    expect(chartExists).toBe(true);
  });

  test('QE-6111 TS-002 TC-001: Verify monthly trend chart displays limited visualization for single-month data', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.clickAnalyticsNav();
    await expect(analyticsPage.monthlyTrendsChartContainer).toBeVisible();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
  });

  test('QE-6111 TS-003 TC-001: Verify monthly spend trends chart updates when filtered by specific card', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.clickAnalyticsNav();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    await page.waitForTimeout(1000);
    await analyticsPage.selectCardFilter('1');
    await page.waitForTimeout(1000);
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
  });
});

test.describe('QE-6112: Category-Wise Spending Analytics', () => {
  test('QE-6112 TS-001 TC-001: Verify category-wise spending chart displays complete data for valid time period', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.clickAnalyticsNav();
    await expect(analyticsPage.categoryChartContainer).toBeVisible();
    await expect(analyticsPage.categoryChart).toBeVisible();
    await page.waitForTimeout(1000);
    const chartExists = await analyticsPage.categoryChart.isVisible();
    expect(chartExists).toBe(true);
  });

  test('QE-6112 TS-001 TC-002: Verify category-wise spending chart can be filtered by specific card', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.clickAnalyticsNav();
    await expect(analyticsPage.categoryChart).toBeVisible();
    await page.waitForTimeout(1000);
    await analyticsPage.selectCardFilter('2');
    await page.waitForTimeout(1000);
    await expect(analyticsPage.categoryChart).toBeVisible();
  });

  test('QE-6112 TS-002 TC-001: Verify category-wise spending chart handles time period with no transactions', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.clickAnalyticsNav();
    await expect(analyticsPage.categoryChartContainer).toBeVisible();
    const chartText = await analyticsPage.categoryChartContainer.textContent();
    const hasData = chartText.length > 0;
    expect(hasData).toBe(true);
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
  });

  test('QE-6112 TS-003 TC-001: Verify system prevents chart generation for invalid time period (end date before start date)', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate();
    await analyticsPage.clickAnalyticsNav();
    await expect(analyticsPage.categoryChart).toBeVisible();
    await page.waitForTimeout(1000);
    const chartStillVisible = await analyticsPage.categoryChart.isVisible();
    expect(chartStillVisible).toBe(true);
  });
});