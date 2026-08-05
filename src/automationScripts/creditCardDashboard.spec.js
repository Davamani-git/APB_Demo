const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { CardsListPage } = require('./pages/cardsList.page');
const { getUrl, getTestUser } = require('../data/env');
const logger = require('../utils/logger');

test.describe('Credit Card Analysis Dashboard', () => {
  test('QE-3756 TS-001 TC-001 - Verify login and dashboard overview for Credit Card Analysis Dashboard', async ({ page }) => {
    logger.info('Launching Credit Card Analysis Dashboard');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.assertLoginPageLoaded();
    logger.info('Logging in with valid customer credentials');
    await loginPage.login('validUser', 'validPass');
    await dashboardPage.assertDashboardLoaded();
    logger.info('Validating dashboard overview section');
    await dashboardPage.assertOverviewSection();
  });

  test('QE-3756 TS-002 TC-001 - Verify card list details display in dashboard', async ({ page }) => {
    logger.info('Launching Credit Card Analysis Dashboard and logging in');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const cardsListPage = new CardsListPage(page);
    await loginPage.navigate();
    await loginPage.login('validUser', 'validPass');
    await dashboardPage.assertDashboardLoaded();
    logger.info('Navigating to cards list section');
    await dashboardPage.gotoCardsList();
    await cardsListPage.assertCardsListVisible();
    logger.info('Verifying each card entry for required details and metrics');
    await cardsListPage.assertAllCardDetailsPresent();
  });

  test('QE-3756 TS-003 TC-001 - Verify sensitive cardholder data is not exposed', async ({ page }) => {
    logger.info('Logging in to dashboard');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const cardsListPage = new CardsListPage(page);
    await loginPage.navigate();
    await loginPage.login('validUser', 'validPass');
    await dashboardPage.assertDashboardLoaded();
    logger.info('Inspecting dashboard views for sensitive cardholder data');
    await cardsListPage.assertNoSensitiveDataExposed();
  });

  test('QE-3755 TS-001 TC-001 - Verify credit limit, outstanding, and available credit for multiple cards', async ({ page }) => {
    logger.info('Launching dashboard and logging in as customer with multiple active cards');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const cardsListPage = new CardsListPage(page);
    await loginPage.navigate();
    await loginPage.login('validUser', 'validPass'); // Replace with a user that has 2+ cards if possible
    await dashboardPage.assertDashboardLoaded();
    await dashboardPage.gotoCardsList();
    logger.info('Checking each card entry for credit limit, outstanding, and available credit');
    await cardsListPage.assertCreditMetricsForMultipleCards();
  });

  test('QE-3755 TS-002 TC-001 - Verify utilization ratio display for cards', async ({ page }) => {
    logger.info('Logging in to dashboard as customer with active cards');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const cardsListPage = new CardsListPage(page);
    await loginPage.navigate();
    await loginPage.login('validUser', 'validPass');
    await dashboardPage.assertDashboardLoaded();
    await dashboardPage.gotoCardsList();
    logger.info('Checking utilization ratio display for each card');
    await cardsListPage.assertUtilizationRatioDisplayed();
  });

  test('QE-3755 TS-003 TC-001 - Verify displayed card values match backend values', async ({ page, request }) => {
    logger.info('Logging in and capturing backend response for card balances');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const cardsListPage = new CardsListPage(page);
    await loginPage.navigate();
    await loginPage.login('validUser', 'validPass');
    await dashboardPage.assertDashboardLoaded();
    await dashboardPage.gotoCardsList();
    logger.info('Intercepting backend response for card balances');
    let backendCardData = null;
    await page.route('**/api/cards', async (route, request) => {
      const response = await route.fetch();
      backendCardData = (await response.json()).cards;
      route.continue();
    });
    // Trigger network call
    await cardsListPage.reloadCardsList();
    await expect(backendCardData).not.toBeNull();
    logger.info('Comparing displayed card values with backend');
    await cardsListPage.assertCardValuesMatchBackend(backendCardData);
  });
});
