const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { CardsPage } = require('./pages/cards.page');
const { AnalyticsPage } = require('./pages/analytics.page');

test.describe('QE-5966 - Unified Credit Portfolio Dashboard', () => {
  test('QE-5966 TS-001 TC-001 - Verify consolidated portfolio KPIs display correctly for user with multiple credit cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate('https://app.creditcard-dashboard.com');
    await dashboardPage.login('testuser_multicard', 'Test@123');
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toContainText('23,550');
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toContainText('1,00,000');
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toContainText('75,000');
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toContainText('25,000');
    await expect(dashboardPage.totalCardsCount).toContainText('3');
    await expect(dashboardPage.utilizationRate).toContainText('25');
  });

  test('QE-5966 TS-002 TC-001 - Verify appropriate message and empty state display for user with no credit cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate('https://app.creditcard-dashboard.com');
    await dashboardPage.login('testuser_nocard', 'Test@123');
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.noCardsMessage).toBeVisible();
    await expect(dashboardPage.monthlySpendKPI).toContainText('0');
    await expect(dashboardPage.totalCreditLimitKPI).toContainText('0');
    await expect(dashboardPage.availableCreditKPI).toContainText('0');
    await expect(dashboardPage.outstandingAmountKPI).toContainText('0');
    await expect(dashboardPage.totalCardsCount).toContainText('0');
  });

  test('QE-5966 TS-003 TC-001 - Verify error handling when card data service is unavailable', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await page.route('**/api/cards**', route => route.abort());
    await dashboardPage.navigate('https://app.creditcard-dashboard.com');
    await dashboardPage.login('testuser', 'Test@123');
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText(/Failed to load dashboard data|Service temporarily unavailable/);
    await expect(page).not.toHaveTitle(/Error/);
    await expect(dashboardPage.navigationMenu).toBeVisible();
  });
});

test.describe('QE-5967 - Responsive Dashboard Layout Support', () => {
  test('QE-5967 TS-001 TC-001 - Verify responsive dashboard rendering on desktop with standard resolution', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await dashboardPage.navigate('https://app.creditcard-dashboard.com');
    await dashboardPage.login('testuser', 'Test@123');
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const kpiGrid = await dashboardPage.kpiGrid.boundingBox();
    expect(kpiGrid.width).toBeLessThanOrEqual(1920);
    await expect(dashboardPage.navigationMenu).toBeVisible();
    const horizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(horizontalScroll).toBe(false);
  });

  test('QE-5967 TS-002 TC-001 - Verify responsive dashboard layout adaptation on mobile device', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.navigate('https://app.creditcard-dashboard.com');
    await dashboardPage.login('testuser', 'Test@123');
    await dashboardPage.navigateToDashboard();
    await expect(dashboardPage.monthlySpendKPI).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKPI).toBeVisible();
    await expect(dashboardPage.availableCreditKPI).toBeVisible();
    await expect(dashboardPage.outstandingAmountKPI).toBeVisible();
    const horizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(horizontalScroll).toBe(false);
    await expect(dashboardPage.navigationMenu).toBeVisible();
    const viewDetailsButton = dashboardPage.cardViewDetailsButton.first();
    const buttonBox = await viewDetailsButton.boundingBox();
    expect(buttonBox.width).toBeGreaterThanOrEqual(44);
    expect(buttonBox.height).toBeGreaterThanOrEqual(44);
  });

  test('QE-5967 TS-003 TC-001 - Verify graceful handling of unsupported screen resolution', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await page.setViewportSize({ width: 320, height: 480 });
    await dashboardPage.navigate('https://app.creditcard-dashboard.com');
    await dashboardPage.login('testuser', 'Test@123');
    await dashboardPage.navigateToDashboard();
    const hasMinSizeMessage = await dashboardPage.minScreenSizeMessage.isVisible().catch(() => false);
    if (!hasMinSizeMessage) {
      await expect(dashboardPage.monthlySpendKPI).toBeVisible();
      const overlappingElements = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('.kpi-card'));
        for (let i = 0; i < elements.length - 1; i++) {
          const rect1 = elements[i].getBoundingClientRect();
          const rect2 = elements[i + 1].getBoundingClientRect();
          if (rect1.bottom > rect2.top && rect1.right > rect2.left) return true;
        }
        return false;
      });
      expect(overlappingElements).toBe(false);
    }
    await expect(dashboardPage.navigationMenu).toBeVisible();
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    await page.waitForTimeout(1000);
    expect(consoleErrors.length).toBe(0);
  });
});

test.describe('QE-5968 - Multiple Card Portfolio Management', () => {
  test('QE-5968 TS-001 TC-001 - Verify card list and portfolio summary display for user with three credit cards', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate('https://app.creditcard-dashboard.com');
    await cardsPage.login('testuser_threecard', 'Test@123');
    await cardsPage.navigateToCardsSection();
    await expect(cardsPage.cardListItems).toHaveCount(3);
    await expect(cardsPage.getCardByName('Platinum Rewards Card')).toBeVisible();
    await expect(cardsPage.getCardByName('Travel Elite Card')).toBeVisible();
    await expect(cardsPage.getCardByName('Cashback Plus Card')).toBeVisible();
    await expect(cardsPage.getCardType('CC001')).toContainText('Platinum');
    await expect(cardsPage.getCardType('CC002')).toContainText('Gold');
    await expect(cardsPage.getCardType('CC003')).toContainText('Silver');
    await expect(cardsPage.getCardLimit('CC001')).toContainText('50,000');
    await expect(cardsPage.getCardLimit('CC002')).toContainText('30,000');
    await expect(cardsPage.getCardLimit('CC003')).toContainText('20,000');
    await expect(cardsPage.getCardAvailable('CC001')).toContainText('35,000');
    await expect(cardsPage.getCardAvailable('CC002')).toContainText('22,000');
    await expect(cardsPage.getCardAvailable('CC003')).toContainText('18,000');
    await expect(cardsPage.getCardOutstanding('CC001')).toContainText('15,000');
    await expect(cardsPage.getCardOutstanding('CC002')).toContainText('8,000');
    await expect(cardsPage.getCardOutstanding('CC003')).toContainText('2,000');
    await expect(cardsPage.portfolioTotalCards).toContainText('3');
    await expect(cardsPage.portfolioTotalLimit).toContainText('1,00,000');
    await expect(cardsPage.portfolioTotalAvailable).toContainText('75,000');
    await expect(cardsPage.portfolioTotalOutstanding).toContainText('25,000');
  });

  test('QE-5968 TS-002 TC-001 - Verify card list and portfolio summary display for user with single credit card', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate('https://app.creditcard-dashboard.com');
    await cardsPage.login('testuser_onecard', 'Test@123');
    await cardsPage.navigateToCardsSection();
    await expect(cardsPage.cardListItems).toHaveCount(1);
    await expect(cardsPage.getCardByName('Platinum Rewards Card')).toBeVisible();
    await expect(cardsPage.getCardType('CC001')).toContainText('Platinum');
    await expect(cardsPage.getCardLimit('CC001')).toContainText('50,000');
    await expect(cardsPage.getCardAvailable('CC001')).toContainText('35,000');
    await expect(cardsPage.getCardOutstanding('CC001')).toContainText('15,000');
    await expect(cardsPage.portfolioTotalCards).toContainText('1');
    await expect(cardsPage.portfolioTotalLimit).toContainText('50,000');
    await expect(cardsPage.portfolioTotalAvailable).toContainText('35,000');
    await expect(cardsPage.portfolioTotalOutstanding).toContainText('15,000');
    await expect(cardsPage.portfolioUtilizationRate).toContainText('30');
  });

  test('QE-5968 TS-003 TC-001 - Verify error handling when card data repository is temporarily unavailable', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await page.route('**/api/cards**', route => route.abort());
    await cardsPage.navigate('https://app.creditcard-dashboard.com');
    await cardsPage.login('testuser', 'Test@123');
    await cardsPage.navigateToCardsSection();
    await expect(cardsPage.errorMessage).toBeVisible();
    await expect(cardsPage.errorMessage).toContainText(/Failed to load cards|Service is unavailable/);
    await expect(cardsPage.cardListItems).toHaveCount(0);
    const staleData = await cardsPage.cardListItems.count();
    expect(staleData).toBe(0);
    await expect(cardsPage.navigationMenu).toBeVisible();
  });
});

test.describe('QE-5969 - Card-Level KPI Insights Navigation', () => {
  test('QE-5969 TS-001 TC-001 - Verify card selection updates dashboard with card-level KPIs within acceptable latency', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate('https://app.creditcard-dashboard.com');
    await cardsPage.login('testuser_multicard', 'Test@123');
    await cardsPage.navigateToCardsSection();
    const startTime = Date.now();
    await cardsPage.selectCard('CC001');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    await expect(cardsPage.cardDetailMonthlySpend).toBeVisible();
    await expect(cardsPage.cardDetailCreditLimit).toContainText('50,000');
    await expect(cardsPage.cardDetailAvailableCredit).toContainText('35,000');
    await expect(cardsPage.cardDetailOutstandingAmount).toContainText('15,000');
  });

  test('QE-5969 TS-002 TC-001 - Verify consistent performance when switching between multiple cards in succession', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate('https://app.creditcard-dashboard.com');
    await cardsPage.login('testuser_threecard', 'Test@123');
    await cardsPage.navigateToCardsSection();
    const startTime1 = Date.now();
    await cardsPage.selectCard('CC001');
    const loadTime1 = Date.now() - startTime1;
    await expect(cardsPage.cardDetailCreditLimit).toContainText('50,000');
    await expect(cardsPage.cardDetailAvailableCredit).toContainText('35,000');
    await expect(cardsPage.cardDetailOutstandingAmount).toContainText('15,000');
    await cardsPage.backToCardsList();
    const startTime2 = Date.now();
    await cardsPage.selectCard('CC002');
    const loadTime2 = Date.now() - startTime2;
    await expect(cardsPage.cardDetailCreditLimit).toContainText('30,000');
    await expect(cardsPage.cardDetailAvailableCredit).toContainText('22,000');
    await expect(cardsPage.cardDetailOutstandingAmount).toContainText('8,000');
    await cardsPage.backToCardsList();
    const startTime3 = Date.now();
    await cardsPage.selectCard('CC003');
    const loadTime3 = Date.now() - startTime3;
    await expect(cardsPage.cardDetailCreditLimit).toContainText('20,000');
    await expect(cardsPage.cardDetailAvailableCredit).toContainText('18,000');
    await expect(cardsPage.cardDetailOutstandingAmount).toContainText('2,000');
    await cardsPage.backToCardsList();
    const startTime4 = Date.now();
    await cardsPage.selectCard('CC001');
    const loadTime4 = Date.now() - startTime4;
    await expect(cardsPage.cardDetailCreditLimit).toContainText('50,000');
    expect(loadTime1).toBeLessThan(2000);
    expect(loadTime2).toBeLessThan(2000);
    expect(loadTime3).toBeLessThan(2000);
    expect(loadTime4).toBeLessThan(2000);
  });

  test('QE-5969 TS-003 TC-001 - Verify error handling when selecting a recently deactivated or removed card', async ({ page }) => {
    const cardsPage = new CardsPage(page);
    await cardsPage.navigate('https://app.creditcard-dashboard.com');
    await cardsPage.login('testuser', 'Test@123');
    await cardsPage.navigateToCardsSection();
    await page.route('**/api/cards/CC004**', route => route.fulfill({ status: 404, body: JSON.stringify({ error: 'Card not found' }) }));
    await page.goto('https://app.creditcard-dashboard.com/#!/cards/CC004');
    await expect(cardsPage.cardNotFoundError).toBeVisible();
    await expect(cardsPage.cardNotFoundError).toContainText(/Card not found|This card has been deactivated/);
    const staleKPIVisible = await cardsPage.cardDetailCreditLimit.isVisible().catch(() => false);
    expect(staleKPIVisible).toBe(false);
    const currentUrl = page.url();
    const isRedirected = currentUrl.includes('/cards') && !currentUrl.includes('/cards/CC004');
    expect(isRedirected || await cardsPage.cardNotFoundError.isVisible()).toBeTruthy();
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    await page.waitForTimeout(500);
  });
});

test.describe('QE-5970 - Monthly Spend Trends Visualization', () => {
  test('QE-5970 TS-001 TC-001 - Verify monthly spend trends chart displays correctly for user with multi-month transaction history', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate('https://app.creditcard-dashboard.com');
    await analyticsPage.login('testuser_multimonth', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.monthlyTrendsSection).toBeVisible();
    const startTime = Date.now();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    const chartData = await analyticsPage.getMonthlyTrendsChartData();
    expect(chartData).toContain('2024-1');
    expect(chartData).toContain('2024-2');
    await analyticsPage.hoverOverChartDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
  });

  test('QE-5970 TS-002 TC-001 - Verify monthly spend trends chart remains responsive and interactive on desktop and mobile', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await analyticsPage.navigate('https://app.creditcard-dashboard.com');
    await analyticsPage.login('testuser', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    await analyticsPage.hoverOverChartDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.monthlyTrendsChart).toBeVisible();
    await analyticsPage.tapChartDataPoint(0);
    await expect(analyticsPage.chartTooltip).toBeVisible();
    const responsiveIssues = await page.evaluate(() => {
      const chart = document.querySelector('#monthlyTrendsChart');
      return chart && chart.scrollWidth > window.innerWidth;
    });
    expect(responsiveIssues).toBe(false);
  });

  test('QE-5970 TS-003 TC-001 - Verify appropriate message display for user with no or insufficient transaction history', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate('https://app.creditcard-dashboard.com');
    await analyticsPage.login('testuser_notxn', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.insufficientDataMessage).toBeVisible();
    await expect(analyticsPage.insufficientDataMessage).toContainText(/Insufficient data for trend analysis|No transaction history available/);
    const misleadingTrendLines = await analyticsPage.monthlyTrendsChart.locator('line').count();
    expect(misleadingTrendLines).toBe(0);
    await page.goto('https://app.creditcard-dashboard.com');
    await analyticsPage.login('testuser_onemonth', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    const dataPoints = await analyticsPage.getMonthlyTrendsDataPointCount();
    expect(dataPoints).toBe(1);
    const trendLines = await analyticsPage.monthlyTrendsChart.locator('line').count();
    expect(trendLines).toBe(0);
  });
});

test.describe('QE-5971 - Category-Wise Spend Analysis Charts', () => {
  test('QE-5971 TS-001 TC-001 - Verify category-wise spending chart displays accurate breakdown across all predefined categories', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate('https://app.creditcard-dashboard.com');
    await analyticsPage.login('testuser_multicategory', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.categoryWiseSection).toBeVisible();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const categories = await analyticsPage.getCategoryLabels();
    expect(categories).toContain('Food & Dining');
    expect(categories).toContain('Fuel');
    expect(categories).toContain('Shopping');
    expect(categories).toContain('Travel');
    expect(categories).toContain('Entertainment');
    expect(categories).toContain('Utilities');
    expect(categories).toContain('Healthcare');
    expect(categories).toContain('Education');
    expect(categories).toContain('Miscellaneous');
    await expect(analyticsPage.getCategoryAmount('Food & Dining')).toContainText('4,300');
    await expect(analyticsPage.getCategoryAmount('Fuel')).toContainText('1,200');
    await expect(analyticsPage.getCategoryAmount('Shopping')).toContainText('4,500');
    await expect(analyticsPage.getCategoryAmount('Travel')).toContainText('8,000');
    await expect(analyticsPage.getCategoryAmount('Entertainment')).toContainText('800');
    await expect(analyticsPage.getCategoryAmount('Utilities')).toContainText('1,500');
    await expect(analyticsPage.getCategoryAmount('Healthcare')).toContainText('950');
    await expect(analyticsPage.getCategoryAmount('Education')).toContainText('3,000');
    await expect(analyticsPage.getCategoryAmount('Miscellaneous')).toContainText('600');
    await expect(analyticsPage.categoryTable).toBeVisible();
  });

  test('QE-5971 TS-002 TC-001 - Verify category chart interaction maintains user privacy without exposing sensitive details', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate('https://app.creditcard-dashboard.com');
    await analyticsPage.login('testuser', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await analyticsPage.selectCategory('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toBeVisible();
    await expect(analyticsPage.categoryTooltip).toContainText('Food & Dining');
    await expect(analyticsPage.categoryTooltip).toContainText('4,300');
    const merchantVisible = await analyticsPage.categoryTooltip.locator('text=/SuperMart|Dine Fine/').isVisible().catch(() => false);
    expect(merchantVisible).toBe(false);
    const dateVisible = await analyticsPage.categoryTooltip.locator('text=/2024-01-15|2024-01-22/').isVisible().catch(() => false);
    expect(dateVisible).toBe(false);
    const categories = ['Fuel', 'Shopping', 'Travel', 'Entertainment'];
    for (const category of categories) {
      await analyticsPage.selectCategory(category);
      const merchantInfo = await page.locator('text=/merchant|store|vendor/i').isVisible().catch(() => false);
      expect(merchantInfo).toBe(false);
    }
  });

  test('QE-5971 TS-003 TC-001 - Verify handling of transactions with missing or uncategorized category tags', async ({ page }) => {
    const analyticsPage = new AnalyticsPage(page);
    await analyticsPage.navigate('https://app.creditcard-dashboard.com');
    await analyticsPage.login('testuser_uncategorized', 'Test@123');
    await analyticsPage.navigateToAnalytics();
    await expect(analyticsPage.categoryChart).toBeVisible();
    const miscellaneousAmount = await analyticsPage.getCategoryAmount('Miscellaneous');
    await expect(miscellaneousAmount).toBeVisible();
    const uncategorizedNotification = await analyticsPage.uncategorizedNotification.isVisible().catch(() => false);
    if (uncategorizedNotification) {
      await expect(analyticsPage.uncategorizedNotification).toContainText(/uncategorized|Miscellaneous/i);
    }
    const chartError = await page.locator('text=/error|failed/i').isVisible().catch(() => false);
    expect(chartError).toBe(false);
    const categoryTotals = await analyticsPage.getAllCategoryTotals();
    const totalSpend = categoryTotals.reduce((sum, val) => sum + val, 0);
    const overallTotal = await analyticsPage.getOverallTransactionTotal();
    expect(Math.abs(totalSpend - overallTotal)).toBeLessThan(1);
    const categories = await analyticsPage.getCategoryLabels();
    for (const category of categories) {
      if (category !== 'Miscellaneous') {
        const amount = await analyticsPage.getCategoryAmountValue(category);
        expect(amount).toBeGreaterThanOrEqual(0);
      }
    }
  });
});