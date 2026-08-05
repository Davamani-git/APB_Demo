const { test, expect } = require('@playwright/test');
const { ScopeDashboardPage } = require('./pages/scopeDashboard.page');
const logger = require('../utils/logger');

test.describe('Scope Dashboard Data Handling', () => {
  test('Test Case - QE-3916 TS-001 TC-001: Load dashboard with valid scope data', async ({ page }) => {
    const scopeDashboardPage = new ScopeDashboardPage(page);
    logger.info('Launching application with valid scope data');
    await scopeDashboardPage.launchWithScopeData({ scopes: [...], version: 1 });
    await expect(scopeDashboardPage.dashboardTiles).toBeVisible();
    await expect(scopeDashboardPage.summaryBar).toBeVisible();
    await scopeDashboardPage.expectScopesGroupedByReadiness();
  });

  test('Test Case - QE-3916 TS-002 TC-001: Default scopes created when storage is empty', async ({ page }) => {
    const scopeDashboardPage = new ScopeDashboardPage(page);
    logger.info('Clearing browser storage and launching application');
    await scopeDashboardPage.clearScopeData();
    await scopeDashboardPage.launch();
    await expect(scopeDashboardPage.dashboardTiles).toBeVisible();
    await expect(scopeDashboardPage.summaryBar).toBeVisible();
    await scopeDashboardPage.expectDefaultScopes();
  });

  test('Test Case - QE-3916 TS-003 TC-001: Handle corrupt scope data in storage', async ({ page }) => {
    const scopeDashboardPage = new ScopeDashboardPage(page);
    logger.info('Storing corrupt scope data and launching application');
    await scopeDashboardPage.storeCorruptScopeData({ scopes: 'invalid', version: 99 });
    await scopeDashboardPage.launch();
    await expect(scopeDashboardPage.dashboardTiles).toBeVisible();
    await expect(scopeDashboardPage.summaryBar).toBeVisible();
    await expect(scopeDashboardPage.notificationDataReset).toBeVisible();
    await scopeDashboardPage.expectDefaultScopes();
  });
});
