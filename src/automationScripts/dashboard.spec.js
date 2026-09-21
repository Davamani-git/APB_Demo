const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Dashboard KPIs - Consolidated Credit Card KPIs', () => {
  test('QE-6092 TS-001 TC-001 - Verify consolidated KPIs display correctly for user with multiple linked credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('multicard_user', 'Pass@123');
    await dashboardPage.waitForDashboardToLoad();
    await dashboardPage.verifyMonthlySpendKPI('25,000');
    await dashboardPage.verifyTotalCreditLimitKPI('1,00,000');
    await dashboardPage.verifyAvailableCreditKPI('75,000');
    await dashboardPage.verifyOutstandingAmountKPI('25,000');
  });

  test('QE-6092 TS-002 TC-001 - Verify consolidated KPIs display correctly for user with single linked credit card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('singlecard_user', 'Pass@123');
    await dashboardPage.waitForDashboardToLoad();
    await dashboardPage.verifyMonthlySpendKPI('12,000');
    await dashboardPage.verifyTotalCreditLimitKPI('50,000');
    await dashboardPage.verifyAvailableCreditKPI('35,000');
    await dashboardPage.verifyOutstandingAmountKPI('15,000');
  });

  test('QE-6092 TS-003 TC-001 - Verify appropriate message and zero/null KPI values when user has no linked credit cards', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('nocard_user', 'Pass@123');
    await dashboardPage.waitForDashboardToLoad();
    await dashboardPage.verifyNoCardMessage();
    await dashboardPage.verifyMonthlySpendKPI('0');
    await dashboardPage.verifyTotalCreditLimitKPI('0');
    await dashboardPage.verifyAvailableCreditKPI('0');
    await dashboardPage.verifyOutstandingAmountKPI('0');
  });
});

test.describe('Dashboard KPIs - Responsive KPI Dashboard Layout', () => {
  test('QE-6093 TS-001 TC-001 - Verify dashboard KPI layout renders in multi-column grid format on desktop with large screen resolution', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardToLoad();
    await dashboardPage.verifyMultiColumnGridLayout();
    await dashboardPage.verifyAllKPICardsReadable();
    await dashboardPage.verifyKPICardsSpacing();
  });

  test('QE-6093 TS-002 TC-001 - Verify dashboard KPI layout adapts to single-column stacked format on mobile device with small screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardToLoad();
    await dashboardPage.verifySingleColumnStackedLayout();
    await dashboardPage.verifyNoHorizontalScrolling();
    await dashboardPage.verifyTouchTargetSizes();
  });

  test('QE-6093 TS-003 TC-001 - Verify dashboard displays warning or degrades gracefully on unsupported or extremely small screen resolution', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 240 });
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('testuser', 'Pass@123');
    await dashboardPage.waitForDashboardToLoad();
    await dashboardPage.verifyWarningMessageOrGracefulDegradation();
    await dashboardPage.verifyNoLayoutBreakage();
  });
});