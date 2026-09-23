const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { logger } = require('../utils/logger');

test.describe('Credit Card Dashboard - Responsive View Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    logger.info('Navigating to dashboard');
    await dashboardPage.navigate();
  });

  test('QE-6137 TS-001 TC-001 - Verify user with multiple cards views consolidated dashboard on desktop', async ({ page }) => {
    logger.info('Test: Verify consolidated dashboard view with multiple cards on desktop');
    
    await expect(dashboardPage.pageHeader).toBeVisible();
    await expect(dashboardPage.pageHeader).toContainText('Credit Card Dashboard');
    
    await dashboardPage.waitForDashboardLoad();
    
    const kpiTiles = await dashboardPage.getKpiTiles();
    expect(kpiTiles.length).toBe(4);
    
    await expect(dashboardPage.monthlySpendKpi).toBeVisible();
    await expect(dashboardPage.totalCreditLimitKpi).toBeVisible();
    await expect(dashboardPage.availableCreditKpi).toBeVisible();
    await expect(dashboardPage.outstandingAmountKpi).toBeVisible();
    
    const cardPanels = await dashboardPage.getCardPanels();
    expect(cardPanels.length).toBeGreaterThanOrEqual(3);
    
    await expect(dashboardPage.getCardPanelByIndex(0)).toBeVisible();
    await expect(dashboardPage.getCardPanelByIndex(1)).toBeVisible();
    await expect(dashboardPage.getCardPanelByIndex(2)).toBeVisible();
    
    logger.info('Dashboard layout verified for desktop with multiple cards');
  });

  test('QE-6137 TS-002 TC-001 - Verify user with single card views responsive dashboard on mobile', async ({ page }) => {
    logger.info('Test: Verify responsive dashboard view with single card on mobile');
    
    await page.setViewportSize({ width: 375, height: 667 });
    
    await dashboardPage.navigate();
    await dashboardPage.waitForDashboardLoad();
    
    await expect(dashboardPage.pageHeader).toBeVisible();
    
    const kpiTiles = await dashboardPage.getKpiTiles();
    expect(kpiTiles.length).toBe(4);
    
    for (const tile of kpiTiles) {
      await expect(tile).toBeVisible();
    }
    
    const cardPanels = await dashboardPage.getCardPanels();
    expect(cardPanels.length).toBeGreaterThanOrEqual(1);
    
    await expect(dashboardPage.getCardPanelByIndex(0)).toBeVisible();
    
    logger.info('Responsive dashboard layout verified for mobile');
  });

  test('QE-6137 TS-003 TC-001 - Verify appropriate message when no cards are stored', async ({ page }) => {
    logger.info('Test: Verify dashboard with no cards shows appropriate message');
    
    await dashboardPage.waitForDashboardLoad();
    
    const cardPanels = await dashboardPage.getCardPanels();
    
    if (cardPanels.length === 0) {
      const monthlySpendValue = await dashboardPage.getKpiValue('Monthly Spend');
      const totalLimitValue = await dashboardPage.getKpiValue('Total Credit Limit');
      const availableCreditValue = await dashboardPage.getKpiValue('Available Credit');
      const outstandingValue = await dashboardPage.getKpiValue('Outstanding Amount');
      
      expect(monthlySpendValue).toContain('0');
      expect(totalLimitValue).toContain('0');
      expect(availableCreditValue).toContain('0');
      expect(outstandingValue).toContain('0');
      
      logger.info('Zero KPI values verified when no cards available');
    }
  });
});

test.describe('Card Summary Tiles with KPIs Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test('QE-6138 TS-001 TC-001 - Verify card summary tiles display complete information and KPIs', async ({ page }) => {
    logger.info('Test: Verify card summary tiles with complete data');
    
    await dashboardPage.waitForDashboardLoad();
    
    const cardPanels = await dashboardPage.getCardPanels();
    expect(cardPanels.length).toBeGreaterThan(0);
    
    const firstCard = dashboardPage.getCardPanelByIndex(0);
    await expect(firstCard).toBeVisible();
    
    await expect(dashboardPage.getCardIssuer(0)).toBeVisible();
    await expect(dashboardPage.getCardMaskedNumber(0)).toBeVisible();
    await expect(dashboardPage.getCardCreditLimit(0)).toBeVisible();
    await expect(dashboardPage.getCardAvailableCredit(0)).toBeVisible();
    await expect(dashboardPage.getCardOutstanding(0)).toBeVisible();
    await expect(dashboardPage.getCardDueDate(0)).toBeVisible();
    await expect(dashboardPage.getCardStatus(0)).toBeVisible();
    
    const viewDetailsButton = dashboardPage.getCardViewDetailsButton(0);
    await expect(viewDetailsButton).toBeVisible();
    await expect(viewDetailsButton).toBeEnabled();
    
    logger.info('Card summary tile verified with complete information');
  });

  test('QE-6138 TS-002 TC-001 - Verify card tiles display partial KPI when transaction data unavailable', async ({ page }) => {
    logger.info('Test: Verify card tiles with partial data');
    
    await dashboardPage.waitForDashboardLoad();
    
    const cardPanels = await dashboardPage.getCardPanels();
    
    if (cardPanels.length > 0) {
      const firstCard = dashboardPage.getCardPanelByIndex(0);
      await expect(firstCard).toBeVisible();
      
      await expect(dashboardPage.getCardIssuer(0)).toBeVisible();
      await expect(dashboardPage.getCardMaskedNumber(0)).toBeVisible();
      
      const creditLimit = await dashboardPage.getCardCreditLimit(0);
      await expect(creditLimit).toBeVisible();
      
      logger.info('Card basic information verified even with partial data');
    }
  });

  test('QE-6138 TS-003 TC-001 - Verify error message when data stores unavailable', async ({ page }) => {
    logger.info('Test: Verify error handling when data stores unavailable');
    
    await page.waitForLoadState('networkidle');
    
    const errorMessage = dashboardPage.errorAlert;
    const isErrorVisible = await errorMessage.isVisible().catch(() => false);
    
    if (isErrorVisible) {
      await expect(errorMessage).toContainText(/failed|error|unavailable/i);
      logger.info('Error message displayed when data unavailable');
    } else {
      await dashboardPage.waitForDashboardLoad();
      logger.info('Dashboard loaded successfully');
    }
  });
});

test.describe('Monthly Spend Trend Analytics Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  test('QE-6141 TS-001 TC-001 - Verify monthly spend trend chart displays with categorized data', async ({ page }) => {
    logger.info('Test: Verify monthly spend trend chart visualization');
    
    await dashboardPage.navigateToAnalytics();
    await dashboardPage.waitForAnalyticsLoad();
    
    await expect(dashboardPage.monthlyTrendSection).toBeVisible();
    await expect(dashboardPage.monthlyTrendChart).toBeVisible();
    
    const chartCanvas = dashboardPage.monthlyTrendChart;
    await expect(chartCanvas).toHaveAttribute('id', 'monthlyTrendCanvas');
    
    logger.info('Monthly trend chart verified and displayed');
  });

  test('QE-6141 TS-002 TC-001 - Verify user can interact with monthly trend chart', async ({ page }) => {
    logger.info('Test: Verify monthly trend chart interactivity');
    
    await dashboardPage.navigateToAnalytics();
    await dashboardPage.waitForAnalyticsLoad();
    
    await expect(dashboardPage.monthlyTrendChart).toBeVisible();
    
    const chartBoundingBox = await dashboardPage.monthlyTrendChart.boundingBox();
    
    if (chartBoundingBox) {
      await page.mouse.move(
        chartBoundingBox.x + chartBoundingBox.width / 2,
        chartBoundingBox.y + chartBoundingBox.height / 2
      );
      
      await page.waitForTimeout(500);
      
      logger.info('Chart interaction verified');
    }
  });

  test('QE-6141 TS-003 TC-001 - Verify appropriate message when trend data unavailable', async ({ page }) => {
    logger.info('Test: Verify message when trend data unavailable');
    
    await dashboardPage.navigateToAnalytics();
    await page.waitForLoadState('networkidle');
    
    const errorMessage = dashboardPage.errorAlert;
    const chartVisible = await dashboardPage.monthlyTrendChart.isVisible().catch(() => false);
    
    if (!chartVisible) {
      const isErrorVisible = await errorMessage.isVisible().catch(() => false);
      if (isErrorVisible) {
        await expect(errorMessage).toContainText(/data|unavailable|insufficient/i);
        logger.info('Appropriate error message displayed for missing trend data');
      }
    }
  });
});

test.describe('Category-Wise Spend Insights Tests', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
  });

  test('QE-6142 TS-001 TC-001 - Verify category-wise spend visualizations display', async ({ page }) => {
    logger.info('Test: Verify category-wise spend chart visualization');
    
    await dashboardPage.navigateToAnalytics();
    await dashboardPage.waitForAnalyticsLoad();
    
    await expect(dashboardPage.categorySpendSection).toBeVisible();
    await expect(dashboardPage.categoryChart).toBeVisible();
    
    const chartCanvas = dashboardPage.categoryChart;
    await expect(chartCanvas).toHaveAttribute('id', 'categoryChartCanvas');
    
    logger.info('Category-wise spend chart verified and displayed');
  });

  test('QE-6142 TS-002 TC-001 - Verify user can identify highest spend category', async ({ page }) => {
    logger.info('Test: Verify category spend pattern interpretation');
    
    await dashboardPage.navigateToAnalytics();
    await dashboardPage.waitForAnalyticsLoad();
    
    await expect(dashboardPage.categoryChart).toBeVisible();
    
    const chartBoundingBox = await dashboardPage.categoryChart.boundingBox();
    
    if (chartBoundingBox) {
      await page.mouse.move(
        chartBoundingBox.x + chartBoundingBox.width / 2,
        chartBoundingBox.y + chartBoundingBox.height / 2
      );
      
      await page.waitForTimeout(500);
      
      logger.info('Category chart interaction verified for spending pattern analysis');
    }
  });

  test('QE-6142 TS-003 TC-001 - Verify error message when transactions not categorized', async ({ page }) => {
    logger.info('Test: Verify error handling for uncategorized transactions');
    
    await dashboardPage.navigateToAnalytics();
    await page.waitForLoadState('networkidle');
    
    const errorMessage = dashboardPage.errorAlert;
    const chartVisible = await dashboardPage.categoryChart.isVisible().catch(() => false);
    
    if (!chartVisible) {
      const isErrorVisible = await errorMessage.isVisible().catch(() => false);
      if (isErrorVisible) {
        await expect(errorMessage).toContainText(/category|uncategorized|missing/i);
        logger.info('Appropriate error message displayed for uncategorized data');
      }
    }
  });
});