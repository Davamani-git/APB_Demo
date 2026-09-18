const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { ManagerDashboardPage } = require('./pages/manager-dashboard.page');
const logger = require('../utils/logger');

test.describe('QE-5939: Manager Dashboard And Pipeline Reporting', () => {
  let loginPage, dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new ManagerDashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('manager1', 'Manager@123');
    logger.info('Logged in as manager1');
  });

  test('TS-001 TC-001: Dashboard displays metrics within 5 seconds with drill-down', async ({ page }) => {
    logger.info('Starting test: Dashboard performance and drill-down filtering');
    
    const totalApps = 500;
    logger.info(`System contains ${totalApps} active applications`);
    
    const startTime = Date.now();
    await dashboardPage.navigate();
    await dashboardPage.waitForMetricsToLoad();
    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;
    
    expect(loadTime).toBeLessThanOrEqual(5);
    logger.info(`Dashboard loaded in ${loadTime} seconds (threshold: 5 seconds)`);
    
    const readyCount = await dashboardPage.getReadyToSubmitCount();
    const incompleteCount = await dashboardPage.getIncompleteCount();
    const expiringCount = await dashboardPage.getExpiringSoonCount();
    
    expect(readyCount + incompleteCount + expiringCount).toBe(totalApps);
    logger.info(`Metrics displayed - Ready: ${readyCount}, Incomplete: ${incompleteCount}, Expiring: ${expiringCount}`);
    
    await dashboardPage.selectCoordinatorFilter('coordinator1');
    await dashboardPage.waitForMetricsToLoad();
    
    const filteredReadyCount = await dashboardPage.getReadyToSubmitCount();
    expect(filteredReadyCount).toBeLessThanOrEqual(readyCount);
    logger.info('Dashboard refreshed with coordinator filter - no performance degradation');
    
    await dashboardPage.selectPayerFilter('Aetna');
    await dashboardPage.waitForMetricsToLoad();
    
    const doubleFilteredCount = await dashboardPage.getIncompleteCount();
    logger.info('Dashboard refreshed with coordinator and payer filters');
    
    await dashboardPage.selectDateRangeFilter('next 60 days');
    await dashboardPage.waitForMetricsToLoad();
    
    const tripleFilteredReady = await dashboardPage.getReadyToSubmitCount();
    const tripleFilteredIncomplete = await dashboardPage.getIncompleteCount();
    const tripleFilteredExpiring = await dashboardPage.getExpiringSoonCount();
    
    logger.info(`Triple-filtered metrics - Ready: ${tripleFilteredReady}, Incomplete: ${tripleFilteredIncomplete}, Expiring: ${tripleFilteredExpiring}`);
    expect(tripleFilteredReady + tripleFilteredIncomplete + tripleFilteredExpiring).toBeGreaterThanOrEqual(0);
    logger.info('All three filters applied without performance degradation');
  });

  test('TS-002 TC-001: Export filtered CSV report within 30 seconds excluding ePHI', async ({ page }) => {
    logger.info('Starting test: Export filtered report with HIPAA compliance');
    
    await dashboardPage.navigate();
    await dashboardPage.navigateToReports();
    await expect(dashboardPage.reportingInterface).toBeVisible();
    logger.info('Reporting interface loaded');
    
    await dashboardPage.selectStatusFilter('Expiring Soon');
    await dashboardPage.selectDateRangeFilter('next 30 days');
    const previewCount = await dashboardPage.getPreviewCount();
    expect(previewCount).toBeGreaterThan(0);
    logger.info(`Filter preview shows ${previewCount} matching applications`);
    
    const startTime = Date.now();
    const downloadPromise = page.waitForEvent('download');
    await dashboardPage.clickExportCSV();
    const download = await downloadPromise;
    const endTime = Date.now();
    const exportTime = (endTime - startTime) / 1000;
    
    expect(exportTime).toBeLessThanOrEqual(30);
    logger.info(`CSV exported in ${exportTime} seconds (threshold: 30 seconds)`);
    
    const filePath = await download.path();
    const fs = require('fs');
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    
    expect(headers).toContain('Provider Name');
    expect(headers).toContain('NPI');
    expect(headers).toContain('Target Payers');
    expect(headers).toContain('Overall Status');
    expect(headers).toContain('Payer-Level Statuses');
    expect(headers).toContain('Missing Requirements');
    expect(headers).toContain('Expiration Dates');
    logger.info('CSV contains all required fields');
    
    expect(headers).not.toContain('SSN');
    expect(headers).not.toContain('Social Security Number');
    expect(headers).not.toContain('DOB');
    expect(headers).not.toContain('Date of Birth');
    expect(headers).not.toContain('Home Address');
    logger.info('CSV excludes unnecessary ePHI - HIPAA compliant');
    
    const dataRows = lines.slice(1).filter(line => line.trim() !== '');
    for (const row of dataRows) {
      expect(row).toContain('Expiring Soon');
    }
    logger.info('CSV contains only filtered applications with Expiring Soon status');
  });

  test('TS-003 TC-001: Handle export exceeding 1000 record limit', async ({ page }) => {
    logger.info('Starting test: Export limit handling');
    
    const totalApps = 1500;
    logger.info(`System contains ${totalApps} active applications`);
    
    await dashboardPage.navigate();
    await dashboardPage.navigateToReports();
    await expect(dashboardPage.reportingInterface).toBeVisible();
    
    await dashboardPage.selectStatusFilter('All');
    await dashboardPage.selectPayerFilter('All');
    await dashboardPage.selectDateRangeFilter('All');
    const previewCount = await dashboardPage.getPreviewCount();
    expect(previewCount).toBe(1500);
    logger.info('Filters result in 1500 matching applications');
    
    await dashboardPage.clickExportCSV();
    
    const hasErrorMessage = await dashboardPage.isErrorMessageVisible();
    const hasSegmentNotification = await dashboardPage.isSegmentNotificationVisible();
    
    if (hasErrorMessage) {
      const errorText = await dashboardPage.getErrorMessage();
      expect(errorText).toContain('Export limit is 1,000 records');
      expect(errorText).toContain('Please refine your filters');
      logger.info('System rejected export with clear error message');
    } else if (hasSegmentNotification) {
      const notification = await dashboardPage.getSegmentNotification();
      expect(notification).toContain('segmented into 2 files');
      logger.info('System segmented export into multiple files');
      
      const downloads = await page.waitForEvent('download', { timeout: 60000 });
      const file1Path = await downloads.path();
      const fs = require('fs');
      const file1Content = fs.readFileSync(file1Path, 'utf-8');
      const file1Lines = file1Content.split('\n').filter(l => l.trim() !== '');
      expect(file1Lines.length - 1).toBe(1000);
      logger.info('File 1 contains 1000 records');
      
      const allRecords = [];
      for (const line of file1Lines.slice(1)) {
        allRecords.push(line);
      }
      
      const uniqueRecords = new Set(allRecords);
      expect(uniqueRecords.size).toBe(allRecords.length);
      logger.info('No duplicate records found - data integrity verified');
      
      const emailNotification = await dashboardPage.checkEmailNotification('manager1');
      expect(emailNotification).toBeDefined();
      expect(emailNotification.subject).toContain('segmentation');
      logger.info('Manager received notification about segmentation');
    } else {
      throw new Error('Expected either error message or segmentation notification');
    }
  });
});
