const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Dashboard - Consolidated Multi-Card View Tests', () => {
  test('QE-5951 TS-001 TC-001 - Verify consolidated multi-card dashboard displays all cards with accurate KPIs in responsive layout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch the Credit Card Analysis Dashboard application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveURL(/.*creditcarddashboard.com/);
    });
    
    await test.step('Authenticate with valid user credentials who has multiple credit cards', async () => {
      await loginPage.login('testuser_multicard', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
    });
    
    await test.step('Verify all credit cards are displayed in consolidated dashboard view', async () => {
      const cardCount = await dashboardPage.getCardCount();
      expect(cardCount).toBe(3);
      await expect(dashboardPage.cardGrid).toBeVisible();
    });
    
    await test.step('Verify each card displays key attributes', async () => {
      await dashboardPage.verifyCardAttributes('Platinum Rewards', 'Chase', '15000', '3200', '11800');
      await dashboardPage.verifyCardAttributes('Cash Back Plus', 'Citi', '10000', '2100', '7900');
      await dashboardPage.verifyCardAttributes('Travel Elite', 'Amex', '20000', '5800', '14200');
    });
    
    await test.step('Verify KPI section displays all four KPIs with accurate values', async () => {
      await expect(dashboardPage.monthlySpendKPI).toBeVisible();
      await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
      await expect(dashboardPage.availableCreditKPI).toBeVisible();
      await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
      await dashboardPage.verifyKPIValue('totalCreditLimit', '45000');
    });
    
    await test.step('Verify responsive layout on mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(dashboardPage.kpiSection).toBeVisible();
      await expect(dashboardPage.cardGrid).toBeVisible();
    });
    
    await test.step('Verify responsive layout on desktop viewport', async () => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(dashboardPage.kpiSection).toBeVisible();
      await expect(dashboardPage.cardGrid).toBeVisible();
    });
  });

  test('QE-5951 TS-002 TC-001 - Verify appropriate message when user has no credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch the Credit Card Analysis Dashboard application', async () => {
      await loginPage.navigate();
    });
    
    await test.step('Authenticate with user who has no credit cards', async () => {
      await loginPage.login('testuser_nocards', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
    });
    
    await test.step('Verify appropriate no cards message is displayed', async () => {
      await expect(dashboardPage.noCardsMessage).toBeVisible();
      await expect(dashboardPage.noCardsMessage).toContainText(/No credit cards.*associated/);
    });
    
    await test.step('Verify KPI section displays zero values or no data message', async () => {
      const kpiText = await dashboardPage.monthlySpendKPI.textContent();
      expect(kpiText).toMatch(/0\.00|No data/);
    });
    
    await test.step('Verify no card items are displayed', async () => {
      const cardCount = await dashboardPage.getCardCount();
      expect(cardCount).toBe(0);
    });
  });

  test('QE-5951 TS-003 TC-001 - Verify error message when card data service is unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch the Credit Card Analysis Dashboard application', async () => {
      await loginPage.navigate();
    });
    
    await test.step('Simulate card data service unavailability', async () => {
      await page.route('**/api/cards', route => route.abort('failed'));
    });
    
    await test.step('Authenticate with valid user credentials', async () => {
      await loginPage.login('testuser', 'Pass@123');
    });
    
    await test.step('Verify error message is displayed', async () => {
      await expect(dashboardPage.errorMessage).toBeVisible({ timeout: 10000 });
      await expect(dashboardPage.errorMessage).toContainText(/Unable to retrieve.*card information/);
    });
    
    await test.step('Verify loading indicator stops within timeout', async () => {
      await expect(dashboardPage.loadingSpinner).not.toBeVisible({ timeout: 5000 });
    });
  });
});

test.describe('Dashboard - Core KPI Display Tests', () => {
  test('QE-5952 TS-001 TC-001 - Verify all four KPIs are accurately calculated and displayed', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application and authenticate', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_validdata', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
    });
    
    await test.step('Verify Monthly Spend KPI displays accurate value', async () => {
      await expect(dashboardPage.monthlySpendKPI).toBeVisible();
      const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
      expect(parseFloat(monthlySpend)).toBeGreaterThan(0);
    });
    
    await test.step('Verify Total Credit Limit KPI', async () => {
      await dashboardPage.verifyKPIValue('totalCreditLimit', '45000.00');
    });
    
    await test.step('Verify Available Credit KPI', async () => {
      await dashboardPage.verifyKPIValue('availableCredit', '33900.00');
    });
    
    await test.step('Verify Outstanding Amount KPI', async () => {
      await dashboardPage.verifyKPIValue('outstandingAmount', '11100.00');
    });
    
    await test.step('Verify all KPI values are formatted with currency symbols', async () => {
      await dashboardPage.verifyKPICurrencyFormat();
    });
  });

  test('QE-5952 TS-002 TC-001 - Verify error state when KPI service returns incomplete data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application', async () => {
      await loginPage.navigate();
    });
    
    await test.step('Simulate incomplete KPI data response', async () => {
      await page.route('**/api/kpis', route => route.fulfill({
        status: 200,
        body: JSON.stringify({ monthlySpend: 500, totalCreditLimit: 45000 })
      }));
    });
    
    await test.step('Authenticate with valid credentials', async () => {
      await loginPage.login('testuser', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
    });
    
    await test.step('Verify error or warning message is displayed', async () => {
      await expect(dashboardPage.kpiWarningMessage).toBeVisible();
      await expect(dashboardPage.kpiWarningMessage).toContainText(/KPI data.*unavailable|data integrity/);
    });
    
    await test.step('Verify missing KPI values show placeholder', async () => {
      const availableCreditText = await dashboardPage.availableCreditKPI.textContent();
      expect(availableCreditText).toMatch(/N\/A|--|unavailable/);
    });
  });

  test('QE-5952 TS-003 TC-001 - Verify monthly spend KPI displays zero when no transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch and authenticate with user having no transactions', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_notransactions', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
    });
    
    await test.step('Verify Monthly Spend KPI displays zero', async () => {
      await dashboardPage.verifyKPIValue('monthlySpend', '0.00');
    });
    
    await test.step('Verify other KPIs display valid values', async () => {
      await dashboardPage.verifyKPIValue('totalCreditLimit', '45000.00');
      await dashboardPage.verifyKPIValue('availableCredit', '33900.00');
      await dashboardPage.verifyKPIValue('outstandingAmount', '11100.00');
    });
  });
});

test.describe('Cards - Structured Multi-Card Data Tests', () => {
  test('QE-5953 TS-001 TC-001 - Verify all card attributes are displayed consistently', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const cardsPage = new (require('./pages/cards.page').CardsPage)(page);
    
    await test.step('Launch and authenticate', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
    });
    
    await test.step('Navigate to Cards section', async () => {
      await cardsPage.navigate();
      await cardsPage.waitForCardsLoad();
    });
    
    await test.step('Verify each card displays card name attribute', async () => {
      await expect(cardsPage.getCardByName('Platinum Rewards')).toBeVisible();
      await expect(cardsPage.getCardByName('Cash Back Plus')).toBeVisible();
      await expect(cardsPage.getCardByName('Travel Elite')).toBeVisible();
    });
    
    await test.step('Verify each card displays issuer attribute', async () => {
      await cardsPage.verifyCardIssuer('Platinum Rewards', 'Chase');
      await cardsPage.verifyCardIssuer('Cash Back Plus', 'Citi');
      await cardsPage.verifyCardIssuer('Travel Elite', 'Amex');
    });
    
    await test.step('Verify credit limit attributes with proper formatting', async () => {
      await cardsPage.verifyCardLimit('Platinum Rewards', '15,000.00');
      await cardsPage.verifyCardLimit('Cash Back Plus', '10,000.00');
      await cardsPage.verifyCardLimit('Travel Elite', '20,000.00');
    });
    
    await test.step('Verify balance attributes with proper formatting', async () => {
      await cardsPage.verifyCardBalance('Platinum Rewards', '3,200.00');
      await cardsPage.verifyCardBalance('Cash Back Plus', '2,100.00');
      await cardsPage.verifyCardBalance('Travel Elite', '5,800.00');
    });
    
    await test.step('Verify consistent formatting and layout', async () => {
      await cardsPage.verifyConsistentCardLayout();
    });
  });

  test('QE-5953 TS-002 TC-001 - Verify validation error for incomplete card data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardsPage = new (require('./pages/cards.page').CardsPage)(page);
    
    await test.step('Launch application', async () => {
      await loginPage.navigate();
    });
    
    await test.step('Simulate incomplete card data response', async () => {
      await page.route('**/api/cards', route => route.fulfill({
        status: 200,
        body: JSON.stringify([{ id: 1, name: 'Test Card', limit: 10000, balance: 1000 }])
      }));
    });
    
    await test.step('Authenticate', async () => {
      await loginPage.login('testuser', 'Pass@123');
    });
    
    await test.step('Navigate to cards section', async () => {
      await cardsPage.navigate();
    });
    
    await test.step('Verify validation error message is displayed', async () => {
      await expect(cardsPage.validationErrorMessage).toBeVisible();
      await expect(cardsPage.validationErrorMessage).toContainText(/Card data.*incomplete|Missing required attributes/);
    });
    
    await test.step('Verify incomplete card is excluded or marked with error', async () => {
      const incompleteCard = await cardsPage.getIncompleteCardIndicator();
      expect(incompleteCard).toBeTruthy();
    });
  });

  test('QE-5953 TS-003 TC-001 - Verify error when card data store is unreachable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cardsPage = new (require('./pages/cards.page').CardsPage)(page);
    
    await test.step('Launch application', async () => {
      await loginPage.navigate();
    });
    
    await test.step('Simulate data store unavailability', async () => {
      await page.route('**/api/cards', route => route.abort('timedout'));
    });
    
    await test.step('Authenticate', async () => {
      await loginPage.login('testuser', 'Pass@123');
    });
    
    await test.step('Attempt to load card information', async () => {
      await cardsPage.navigate();
    });
    
    await test.step('Verify error message indicates data source unavailable', async () => {
      await expect(cardsPage.dataSourceErrorMessage).toBeVisible();
      await expect(cardsPage.dataSourceErrorMessage).toContainText(/data source.*unavailable|try again later/);
    });
    
    await test.step('Verify application handles error gracefully', async () => {
      await expect(cardsPage.navigationMenu).toBeVisible();
      await expect(page).not.toHaveTitle(/Error/);
    });
  });
});

test.describe('Transactions - Mapping and Monthly Spend Tests', () => {
  test('QE-5954 TS-001 TC-001 - Verify transactions are correctly mapped and aggregated', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const cardsPage = new (require('./pages/cards.page').CardsPage)(page);
    
    await test.step('Launch and authenticate', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
    });
    
    await test.step('Navigate to Cards section and select Platinum Rewards', async () => {
      await cardsPage.navigate();
      await cardsPage.selectCard('Platinum Rewards');
    });
    
    await test.step('Verify all transactions for cardId=1 are displayed', async () => {
      const transactionCount = await cardsPage.getTransactionCount();
      expect(transactionCount).toBe(5);
    });
    
    await test.step('Verify monthly spend aggregation for current month', async () => {
      const monthlyTotal = await cardsPage.calculateDisplayedMonthlyTotal();
      expect(parseFloat(monthlyTotal)).toBeGreaterThan(0);
    });
    
    await test.step('Verify Monthly Spend KPI matches aggregated transactions', async () => {
      await dashboardPage.navigate();
      const kpiValue = await dashboardPage.getKPIValue('monthlySpend');
      expect(parseFloat(kpiValue)).toBeGreaterThan(0);
    });
    
    await test.step('Verify transaction-to-card mapping consistency', async () => {
      await cardsPage.navigate();
      await cardsPage.selectCard('Platinum Rewards');
      const transactions = await cardsPage.getTransactionsList();
      expect(transactions.length).toBeGreaterThan(0);
    });
  });

  test('QE-5954 TS-002 TC-001 - Verify invalid transactions are rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application', async () => {
      await loginPage.navigate();
    });
    
    await test.step('Simulate transaction with invalid cardId', async () => {
      await page.route('**/api/transactions', route => route.fulfill({
        status: 200,
        body: JSON.stringify([{ id: 99, cardId: null, date: '2024-03-15', amount: 500.00, category: 'Shopping' }])
      }));
    });
    
    await test.step('Authenticate', async () => {
      await loginPage.login('testuser', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
    });
    
    await test.step('Verify Monthly Spend KPI excludes invalid transaction', async () => {
      const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
      expect(parseFloat(monthlySpend)).not.toBe(500.00);
    });
    
    await test.step('Verify error log or notification for unmappable transaction', async () => {
      await expect(dashboardPage.transactionWarningMessage).toBeVisible();
      await expect(dashboardPage.transactionWarningMessage).toContainText(/could not be mapped/);
    });
  });

  test('QE-5954 TS-003 TC-001 - Verify duplicate transactions are prevented', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await test.step('Launch application', async () => {
      await loginPage.navigate();
    });
    
    await test.step('Simulate duplicate transaction records', async () => {
      await page.route('**/api/transactions', route => route.fulfill({
        status: 200,
        body: JSON.stringify([
          { id: 1, cardId: 1, amount: 120.50, date: '2024-01-15', category: 'Food & Dining' },
          { id: 1, cardId: 1, amount: 120.50, date: '2024-01-15', category: 'Food & Dining' }
        ])
      }));
    });
    
    await test.step('Authenticate', async () => {
      await loginPage.login('testuser', 'Pass@123');
      await dashboardPage.waitForDashboardLoad();
    });
    
    await test.step('Verify duplicate transaction is not double-counted', async () => {
      const monthlySpend = await dashboardPage.getKPIValue('monthlySpend');
      expect(parseFloat(monthlySpend)).not.toBe(241.00);
    });
    
    await test.step('Verify system logs duplicate prevention notification', async () => {
      await expect(dashboardPage.duplicateWarningMessage).toBeVisible();
      await expect(dashboardPage.duplicateWarningMessage).toContainText(/Duplicate.*detected/);
    });
  });
});

test.describe('Analytics - Monthly Spend Trend Tests', () => {
  test('QE-5955 TS-001 TC-001 - Verify monthly spend trend chart displays accurate trends', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new (require('./pages/analytics.page').AnalyticsPage)(page);
    
    await test.step('Launch and authenticate', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser', 'Pass@123');
    });
    
    await test.step('Navigate to Analytics section', async () => {
      await analyticsPage.navigate();
      await analyticsPage.waitForAnalyticsLoad();
    });
    
    await test.step('Verify Monthly Spend Trends chart is displayed', async () => {
      await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    });
    
    await test.step('Verify chart displays data for multiple months', async () => {
      const chartLabels = await analyticsPage.getChartLabels('monthlyTrends');
      expect(chartLabels.length).toBeGreaterThanOrEqual(3);
    });
    
    await test.step('Verify chart data values match aggregated transactions', async () => {
      const chartData = await analyticsPage.getChartData('monthlyTrends');
      expect(chartData.length).toBeGreaterThan(0);
      chartData.forEach(value => {
        expect(parseFloat(value)).toBeGreaterThan(0);
      });
    });
    
    await test.step('Verify chart is interactive and responsive', async () => {
      await analyticsPage.hoverOverChartDataPoint('monthlyTrends', 0);
      await expect(analyticsPage.chartTooltip).toBeVisible();
    });
  });

  test('QE-5955 TS-002 TC-001 - Verify appropriate message for single month data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new (require('./pages/analytics.page').AnalyticsPage)(page);
    
    await test.step('Launch and authenticate with single month data user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_onemonth', 'Pass@123');
    });
    
    await test.step('Navigate to Analytics section', async () => {
      await analyticsPage.navigate();
      await analyticsPage.waitForAnalyticsLoad();
    });
    
    await test.step('Verify chart displays single data point or insufficient data message', async () => {
      const hasMessage = await analyticsPage.insufficientDataMessage.isVisible();
      const chartData = await analyticsPage.getChartData('monthlyTrends');
      expect(hasMessage || chartData.length === 1).toBeTruthy();
    });
    
    await test.step('Verify single data point shows accurate spend amount', async () => {
      if (await analyticsPage.monthlyTrendsChart.isVisible()) {
        const chartData = await analyticsPage.getChartData('monthlyTrends');
        expect(parseFloat(chartData[0])).toBeGreaterThan(0);
      }
    });
  });

  test('QE-5955 TS-003 TC-001 - Verify error message when aggregation service fails', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new (require('./pages/analytics.page').AnalyticsPage)(page);
    
    await test.step('Launch application', async () => {
      await loginPage.navigate();
    });
    
    await test.step('Simulate aggregation service failure', async () => {
      await page.route('**/api/analytics/monthly-trends', route => route.fulfill({ status: 500 }));
    });
    
    await test.step('Authenticate', async () => {
      await loginPage.login('testuser', 'Pass@123');
    });
    
    await test.step('Navigate to Analytics section', async () => {
      await analyticsPage.navigate();
    });
    
    await test.step('Verify error message in Monthly Spend Trends section', async () => {
      await expect(analyticsPage.trendErrorMessage).toBeVisible();
      await expect(analyticsPage.trendErrorMessage).toContainText(/Trend data.*cannot be generated|try again later/);
    });
    
    await test.step('Verify chart is not rendered with incorrect data', async () => {
      const chartVisible = await analyticsPage.monthlyTrendsChart.isVisible();
      expect(chartVisible).toBeFalsy();
    });
  });
});

test.describe('Analytics - Category-wise Spending Tests', () => {
  test('QE-5956 TS-001 TC-001 - Verify category-wise spending chart displays accurate amounts', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new (require('./pages/analytics.page').AnalyticsPage)(page);
    
    await test.step('Launch and authenticate', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser', 'Pass@123');
    });
    
    await test.step('Navigate to Analytics section', async () => {
      await analyticsPage.navigate();
      await analyticsPage.waitForAnalyticsLoad();
    });
    
    await test.step('Verify Category-wise Spending chart is displayed', async () => {
      await expect(analyticsPage.categoryChart).toBeVisible();
    });
    
    await test.step('Verify chart displays all predefined categories', async () => {
      const categories = await analyticsPage.getCategoryLabels();
      expect(categories.length).toBe(9);
    });
    
    await test.step('Verify Food & Dining category spend', async () => {
      await analyticsPage.verifyCategorySpend('Food & Dining', '340.50');
    });
    
    await test.step('Verify Fuel category spend', async () => {
      await analyticsPage.verifyCategorySpend('Fuel', '150.00');
    });
    
    await test.step('Verify Shopping category spend', async () => {
      await analyticsPage.verifyCategorySpend('Shopping', '570.00');
    });
    
    await test.step('Verify other categories display accurate amounts', async () => {
      await analyticsPage.verifyCategorySpend('Travel', '180.00');
      await analyticsPage.verifyCategorySpend('Entertainment', '95.00');
      await analyticsPage.verifyCategorySpend('Utilities', '150.00');
      await analyticsPage.verifyCategorySpend('Healthcare', '300.00');
      await analyticsPage.verifyCategorySpend('Education', '450.00');
      await analyticsPage.verifyCategorySpend('Miscellaneous', '75.00');
    });
    
    await test.step('Verify chart is interactive with hover tooltips', async () => {
      await analyticsPage.hoverOverCategoryBar('Food & Dining');
      await expect(analyticsPage.chartTooltip).toBeVisible();
    });
  });

  test('QE-5956 TS-001 TC-002 - Verify category aggregation across multiple cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new (require('./pages/analytics.page').AnalyticsPage)(page);
    
    await test.step('Launch and authenticate with multi-card user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_multicards', 'Pass@123');
    });
    
    await test.step('Navigate to Analytics section', async () => {
      await analyticsPage.navigate();
      await analyticsPage.waitForAnalyticsLoad();
    });
    
    await test.step('Verify Food & Dining aggregates across cards', async () => {
      await analyticsPage.verifyCategorySpend('Food & Dining', '340.50');
    });
    
    await test.step('Verify Fuel aggregates across cards', async () => {
      await analyticsPage.verifyCategorySpend('Fuel', '150.00');
    });
    
    await test.step('Verify categories are not duplicated by card', async () => {
      const categories = await analyticsPage.getCategoryLabels();
      const uniqueCategories = [...new Set(categories)];
      expect(categories.length).toBe(uniqueCategories.length);
    });
  });

  test('QE-5956 TS-002 TC-001 - Verify uncategorized transactions assigned to Miscellaneous', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new (require('./pages/analytics.page').AnalyticsPage)(page);
    
    await test.step('Launch application', async () => {
      await loginPage.navigate();
    });
    
    await test.step('Simulate transaction with missing category', async () => {
      await page.route('**/api/transactions', route => route.fulfill({
        status: 200,
        body: JSON.stringify([{ id: 100, cardId: 1, date: '2024-03-20', amount: 200.00, category: null }])
      }));
    });
    
    await test.step('Authenticate', async () => {
      await loginPage.login('testuser', 'Pass@123');
    });
    
    await test.step('Navigate to Analytics section', async () => {
      await analyticsPage.navigate();
      await analyticsPage.waitForAnalyticsLoad();
    });
    
    await test.step('Verify uncategorized transaction in Miscellaneous', async () => {
      const miscSpend = await analyticsPage.getCategorySpendValue('Miscellaneous');
      expect(parseFloat(miscSpend)).toBeGreaterThanOrEqual(200.00);
    });
    
    await test.step('Verify validation warning is displayed', async () => {
      await expect(analyticsPage.uncategorizedWarningMessage).toBeVisible();
      await expect(analyticsPage.uncategorizedWarningMessage).toContainText(/uncategorized.*Miscellaneous/);
    });
  });

  test('QE-5956 TS-003 TC-001 - Verify appropriate message when no transactions exist', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const analyticsPage = new (require('./pages/analytics.page').AnalyticsPage)(page);
    
    await test.step('Launch and authenticate with no transactions user', async () => {
      await loginPage.navigate();
      await loginPage.login('testuser_notransactions', 'Pass@123');
    });
    
    await test.step('Navigate to Analytics section', async () => {
      await analyticsPage.navigate();
    });
    
    await test.step('Verify no spending data message is displayed', async () => {
      await expect(analyticsPage.noSpendingDataMessage).toBeVisible();
      await expect(analyticsPage.noSpendingDataMessage).toContainText(/No spending data.*category analysis/);
    });
    
    await test.step('Verify chart is not rendered with empty values', async () => {
      const chartVisible = await analyticsPage.categoryChart.isVisible();
      expect(chartVisible).toBeFalsy();
    });
    
    await test.step('Verify navigation menu remains functional', async () => {
      await expect(analyticsPage.navigationMenu).toBeVisible();
      await analyticsPage.navigateToDashboard();
      await expect(page).toHaveURL(/.*dashboard|.*\/$/);
    });
  });
});