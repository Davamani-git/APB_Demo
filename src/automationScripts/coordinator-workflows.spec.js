const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { ApplicationListPage } = require('./pages/application-list.page');
const { AuditLogPage } = require('./pages/audit-log.page');
const logger = require('../utils/logger');

test.describe('QE-5938: Coordinator Application List Management', () => {
  let loginPage, applicationListPage, auditLogPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    applicationListPage = new ApplicationListPage(page);
    auditLogPage = new AuditLogPage(page);
  });

  test('TS-001 TC-001: Filter and view applications with performance within 3 seconds', async ({ page }) => {
    logger.info('Starting test: Filter application list with performance check');
    
    await loginPage.navigate();
    await loginPage.login('coordinator1', 'Pass@123');
    logger.info('Logged in as coordinator1');
    
    await applicationListPage.waitForApplicationsToLoad();
    const appCount = await applicationListPage.getApplicationCount();
    expect(appCount).toBeGreaterThanOrEqual(50);
    logger.info(`Verified ${appCount} applications with mixed statuses`);
    
    await applicationListPage.selectStatusFilter('Incomplete');
    await applicationListPage.selectPayerFilter('BCBS');
    logger.info('Filters applied: Status=Incomplete, Payer=BCBS');
    
    const startTime = Date.now();
    await applicationListPage.clickApplyFilters();
    await applicationListPage.waitForFilteredResults();
    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;
    
    expect(loadTime).toBeLessThanOrEqual(3);
    logger.info(`Application list loaded in ${loadTime} seconds (threshold: 3 seconds)`);
    
    const filteredApps = await applicationListPage.getFilteredApplications();
    for (const app of filteredApps) {
      expect(app.status).toBe('Incomplete');
      expect(app.payers).toContain('BCBS');
    }
    logger.info('Filtered results verified - all show Incomplete status for BCBS');
    
    const firstApp = await applicationListPage.selectFirstApplication();
    const overallStatus = await applicationListPage.getOverallStatus(firstApp);
    const payerStatuses = await applicationListPage.getPayerStatuses(firstApp);
    
    let hasIncomplete = false;
    for (const [payer, status] of Object.entries(payerStatuses)) {
      if (status === 'Incomplete') {
        hasIncomplete = true;
        break;
      }
    }
    expect(hasIncomplete).toBe(true);
    expect(overallStatus).toBe('Incomplete');
    logger.info('Overall status reflects worst-case across all payers');
  });

  test('TS-002 TC-001: Sort 500 applications by Days Until Start within 3 seconds', async ({ page }) => {
    logger.info('Starting test: Sort large application list with performance check');
    
    await loginPage.navigate();
    await loginPage.login('coordinator1', 'Pass@123');
    
    await applicationListPage.waitForApplicationsToLoad();
    const appCount = await applicationListPage.getApplicationCount();
    expect(appCount).toBe(500);
    logger.info('Verified 500 active applications loaded');
    
    const startTime = Date.now();
    await applicationListPage.clickColumnHeader('Days Until Start');
    await applicationListPage.waitForSortCompletion();
    const endTime = Date.now();
    const sortTime = (endTime - startTime) / 1000;
    
    expect(sortTime).toBeLessThanOrEqual(3);
    logger.info(`List sorted in ${sortTime} seconds (threshold: 3 seconds)`);
    
    const firstFiveApps = await applicationListPage.getApplications(0, 5);
    const lastFiveApps = await applicationListPage.getApplications(495, 500);
    
    for (let i = 0; i < firstFiveApps.length - 1; i++) {
      expect(firstFiveApps[i].daysUntilStart).toBeLessThanOrEqual(firstFiveApps[i + 1].daysUntilStart);
    }
    logger.info('First 5 applications verified in ascending order');
    
    for (let i = 0; i < lastFiveApps.length - 1; i++) {
      expect(lastFiveApps[i].daysUntilStart).toBeLessThanOrEqual(lastFiveApps[i + 1].daysUntilStart);
    }
    logger.info('Last 5 applications verified in ascending order');
    
    await applicationListPage.clickColumnHeader('Days Until Start');
    await applicationListPage.waitForSortCompletion();
    const descendingApps = await applicationListPage.getApplications(0, 5);
    
    for (let i = 0; i < descendingApps.length - 1; i++) {
      expect(descendingApps[i].daysUntilStart).toBeGreaterThanOrEqual(descendingApps[i + 1].daysUntilStart);
    }
    logger.info('Descending sort verified');
    
    const totalPages = await applicationListPage.getTotalPages();
    expect(totalPages).toBeGreaterThan(0);
    const noDuplicates = await applicationListPage.verifyNoDuplicateRecords();
    expect(noDuplicates).toBe(true);
    logger.info('No pagination errors - all records accessible');
  });

  test('TS-003 TC-001: Deny access to unassigned applications with audit logging', async ({ page }) => {
    logger.info('Starting test: Verify access control and audit logging');
    
    await loginPage.navigate();
    await loginPage.login('coordinator2', 'Pass@123');
    logger.info('Logged in as coordinator2 (Region A only)');
    
    await applicationListPage.waitForApplicationsToLoad();
    const assignedApps = await applicationListPage.getApplications();
    for (const app of assignedApps) {
      expect(app.region).toBe('A');
    }
    logger.info('Verified only Region A applications visible');
    
    const unauthorizedAppId = 'APP-9999';
    const unauthorizedUrl = `${process.env.BASE_URL}/applications/${unauthorizedAppId}`;
    logger.info(`Attempting to access unauthorized application: ${unauthorizedAppId}`);
    
    await page.goto(unauthorizedUrl);
    
    await expect(applicationListPage.accessDeniedMessage).toBeVisible();
    const message = await applicationListPage.getAccessDeniedMessage();
    expect(message).toContain('Access Denied');
    logger.info('Access denied message displayed');
    
    await expect(page).toHaveURL(/\/applications$/);
    logger.info('User redirected to assigned application list');
    
    await loginPage.logout();
    await loginPage.login('admin1', 'Admin@123');
    
    await auditLogPage.navigate();
    await auditLogPage.filterByUser('coordinator2');
    await auditLogPage.filterByEventType('UnauthorizedAccessAttempt');
    
    const auditEntry = await auditLogPage.getLatestEntry();
    expect(auditEntry.eventType).toBe('UnauthorizedAccessAttempt');
    expect(auditEntry.userId).toBe('coordinator2');
    expect(auditEntry.attemptedApplicationId).toBe(unauthorizedAppId);
    expect(auditEntry.result).toBe('Denied');
    logger.info('Unauthorized access attempt logged in audit trail');
  });
});
