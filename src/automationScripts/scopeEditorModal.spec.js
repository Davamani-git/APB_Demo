const { test, expect } = require('@playwright/test');
const { ScopeEditorModalPage } = require('./pages/scopeEditorModal.page');
const { ScopeDashboardPage } = require('./pages/scopeDashboard.page');
const logger = require('../utils/logger');

test.describe('Scope Editor Modal', () => {
  test('Test Case - QE-3915 TS-001 TC-001: Save valid scope data', async ({ page }) => {
    const scopeDashboardPage = new ScopeDashboardPage(page);
    const scopeEditorModalPage = new ScopeEditorModalPage(page);
    logger.info('Launching application and opening scope editor modal');
    await scopeDashboardPage.launch();
    await scopeEditorModalPage.openForScope();
    await expect(scopeEditorModalPage.editorModal).toBeVisible();
    logger.info('Entering valid values');
    await scopeEditorModalPage.enterScopeFields({ completed: 5, pending: 2, total: 7, status: 'Ready' });
    await scopeEditorModalPage.save();
    await expect(scopeDashboardPage.dashboardTiles).toBeVisible();
    await scopeDashboardPage.expectKPIsRefreshed();
    await scopeDashboardPage.expectAuditEventLogged();
  });

  test('Test Case - QE-3915 TS-002 TC-001: Validation on inconsistent scope data', async ({ page }) => {
    const scopeDashboardPage = new ScopeDashboardPage(page);
    const scopeEditorModalPage = new ScopeEditorModalPage(page);
    logger.info('Launching application and opening scope editor modal');
    await scopeDashboardPage.launch();
    await scopeEditorModalPage.openForScope();
    await expect(scopeEditorModalPage.editorModal).toBeVisible();
    logger.info('Entering inconsistent values');
    await scopeEditorModalPage.enterScopeFields({ completed: 3, pending: 3, total: 7 });
    await scopeEditorModalPage.save();
    await expect(scopeEditorModalPage.validationMessage).toBeVisible();
    await scopeEditorModalPage.expectNoChangesPersisted();
  });

  test('Test Case - QE-3915 TS-003 TC-001: Discard changes with Cancel', async ({ page }) => {
    const scopeDashboardPage = new ScopeDashboardPage(page);
    const scopeEditorModalPage = new ScopeEditorModalPage(page);
    logger.info('Launching application and opening scope editor modal');
    await scopeDashboardPage.launch();
    await scopeEditorModalPage.openForScope();
    await expect(scopeEditorModalPage.editorModal).toBeVisible();
    logger.info('Modifying a field and cancelling');
    await scopeEditorModalPage.modifyField('completed', 4);
    await scopeEditorModalPage.cancel();
    await expect(scopeDashboardPage.dashboardTiles).toBeVisible();
    await scopeDashboardPage.expectScopeUnchanged();
  });
});
