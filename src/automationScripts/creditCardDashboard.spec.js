const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

const logger = require('../../utils/logger');
const env = require('../../data/env');

test.describe('Credit Card Analysis Dashboard', () => {

  test('QE-3755 TS-001 TC-001 - Dashboard loads with multiple active cards and shows correct card data', async ({ page }) => {
    logger.info('Launching dashboard and logging in as customer with multiple active cards');
    const loginPage = new LoginPage(page);
    await loginPage.goto(env.APP_URL);
    await loginPage.login('multiCardUser', 'ValidPass@123'); // Replace with actual test data user
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();
    logger.info('Checking card overview for multiple cards');
    const cards = await dashboardPage.getAllCardSummaries();
    expect(cards.length).toBeGreaterThanOrEqual(2);
    expect(cards[0]).toMatchObject({ creditLimit: '$5000', outstanding: '$1500' });
    expect(cards[1]).toMatchObject({ creditLimit: '$8000', outstanding: '$2000' });
  });

  test('QE-3803 TS-001 TC-001 - Application login and dashboard card summary with all fields', async ({ page }) => {
    logger.info('Launching application and logging in');
    const loginPage = new LoginPage(page);
    await loginPage.goto('https://app.example.com');
    await loginPage.login('validUser', 'ValidPass@123');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();
    logger.info('Validating multiple credit cards in dashboard');
    const cards = await dashboardPage.getAllCardSummaries();
    expect(cards.length).toBeGreaterThanOrEqual(2);
    expect(cards[0]).toMatchObject({
      creditLimit: '$2000',
      monthlySpend: '$500',
      availableCredit: '$1500',
      outstanding: '$500'
    });
    expect(cards[1]).toMatchObject({
      creditLimit: '$5000',
      monthlySpend: '$1000',
      availableCredit: '$4000',
      outstanding: '$1000'
    });
  });

  test('QE-3803 TS-002 TC-001 - Dashboard category-wise spending visualizations', async ({ page }) => {
    logger.info('Launching application and logging in');
    const loginPage = new LoginPage(page);
    await loginPage.goto('https://app.example.com');
    await loginPage.login('validUser', 'ValidPass@123');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();
    logger.info('Verifying category-wise spending visualizations');
    await dashboardPage.expectCategoryVisualizationVisible('Food & Dining');
    await dashboardPage.expectCategoryVisualizationVisible('Fuel');
    await dashboardPage.expectCategoryVisualizationVisible('Shopping');
    await dashboardPage.expectCategoryVisualizationVisible('Travel');
    await dashboardPage.expectCategoryVisualizationVisible('Entertainment');
    await dashboardPage.expectCategoryVisualizationVisible('Utilities');
    await dashboardPage.expectCategoryVisualizationVisible('Healthcare');
    await dashboardPage.expectCategoryVisualizationVisible('Education');
    await dashboardPage.expectCategoryVisualizationVisible('Miscellaneous');
    logger.info('Interacting with category visualizations');
    await dashboardPage.selectCategory('Shopping');
    await dashboardPage.hoverCategory('Fuel');
    await dashboardPage.expectCategoryDrilldownOrTooltip('Fuel');
  });

  test('QE-3803 TS-003 TC-001 - No credit cards linked scenario', async ({ page }) => {
    logger.info('Launching application and logging in with user having no credit cards');
    const loginPage = new LoginPage(page);
    await loginPage.goto('https://app.example.com');
    await loginPage.login('noCardUser', 'ValidPass@123');
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();
    logger.info('Checking dashboard for no credit card message');
    await dashboardPage.expectNoCardsMessage();
  });

});
