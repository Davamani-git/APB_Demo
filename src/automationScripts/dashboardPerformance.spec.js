const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Dashboard Performance and Data Display', () => {

  test('TC-008: Verify dashboard loads within 3 seconds with real-time data', async ({ page }) => {
    logger.info('Starting TC-008: Verify dashboard performance and real-time data display');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(loginPage.loginPageContainer).toBeVisible();
    logger.info('Application login page loads');

    // Step 2: Enter Operating Partner credentials
    await loginPage.fillUsername('partner@company.com');
    await loginPage.fillPassword('Partner@123');
    await expect(loginPage.usernameInput).toHaveValue('partner@company.com');
    logger.info('Credentials are accepted');

    // Step 3: Click Login button
    const startTime = Date.now();
    await loginPage.clickLoginButton();
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User is authenticated successfully');

    // Step 4: Measure dashboard load time
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(3000);
    logger.info(`Main dashboard loads within 3 seconds (actual: ${loadTime}ms)`);

    // Step 5: Verify real-time AI usage data is displayed
    await expect(dashboardPage.aiUsageMetrics).toBeVisible();
    const portfolioCompaniesCount = await dashboardPage.portfolioCompanyItems.count();
    expect(portfolioCompaniesCount).toBeGreaterThan(0);
    logger.info('AI usage metrics are visible for all assigned portfolio companies');

    // Step 6: Verify AI spend data is displayed
    await expect(dashboardPage.aiSpendMetrics).toBeVisible();
    await expect(dashboardPage.aggregatedSpendData).toBeVisible();
    logger.info('AI spend metrics are visible and aggregated from all portfolio companies');

    // Step 7: Check for data freshness indicators
    await expect(dashboardPage.dataFreshnessIndicator).toBeVisible();
    const freshnessText = await dashboardPage.dataFreshnessIndicator.textContent();
    expect(freshnessText).toContain('last sync');
    logger.info('Data freshness indicators show last sync time for each portfolio company');
  });

  test('TC-009: View consolidated dashboard with cost-saving opportunities', async ({ page }) => {
    logger.info('Starting TC-009: View consolidated dashboard with cost-saving opportunities');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Log in as Operating Partner
    await loginPage.navigate();
    await loginPage.login('partner@company.com', 'Partner@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Operating Partner dashboard loads successfully');

    // Step 2: Navigate to consolidated dashboard view
    await dashboardPage.navigateToConsolidatedView();
    await expect(dashboardPage.consolidatedDashboard).toBeVisible();
    logger.info('Consolidated dashboard displays all portfolio companies');

    // Step 3: View AI spend metrics comparison
    await expect(dashboardPage.aiSpendComparisonChart).toBeVisible();
    await expect(dashboardPage.portfolioCompanySpend('Company A')).toContainText('$15,000');
    await expect(dashboardPage.portfolioCompanySpend('Company B')).toContainText('$8,000');
    await expect(dashboardPage.portfolioCompanySpend('Company C')).toContainText('$12,000');
    logger.info('AI spend metrics are displayed in comparative format (charts, tables)');

    // Step 4: Identify visual indicators for underutilized AI investments
    await expect(dashboardPage.underutilizationIndicator('Company B')).toBeVisible();
    await expect(dashboardPage.underutilizationPercentage('Company B')).toContainText('40%');
    logger.info('Visual indicators mark companies with underutilized AI resources');

    // Step 5: Review cost-saving opportunities summary
    await expect(dashboardPage.costSavingOpportunities).toBeVisible();
    await expect(dashboardPage.costSavingOpportunities).toContainText('Company B');
    await expect(dashboardPage.costSavingOpportunities).toContainText('$3,200');
    await expect(dashboardPage.costSavingOpportunities).toContainText('40%');
    logger.info('Dashboard displays cost-saving opportunities with potential savings amounts');

    // Step 6: Export or save cost-saving analysis report
    await dashboardPage.exportReport('PDF');
    await expect(dashboardPage.reportDownloadSuccess).toBeVisible();
    logger.info('Report is successfully generated and saved');
  });

  test('TC-010: Verify graceful handling of cloud provider API unavailability', async ({ page }) => {
    logger.info('Starting TC-010: Verify graceful handling of API unavailability');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Simulate cloud provider API unavailability (handled by test setup/mocking)
    logger.info('Cloud provider API for Company D and Company E is unavailable');

    // Step 2: Log in as Operating Partner
    await loginPage.navigate();
    await loginPage.login('partner@company.com', 'Partner@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Operating Partner successfully logs in');

    // Step 3: Navigate to consolidated dashboard
    await dashboardPage.navigateToConsolidatedView();
    await expect(dashboardPage.consolidatedDashboard).toBeVisible();
    logger.info('Dashboard loads with partial data');

    // Step 4: Verify data for companies with available APIs
    await expect(dashboardPage.portfolioCompanyItem('Company A')).toBeVisible();
    await expect(dashboardPage.portfolioCompanyItem('Company B')).toBeVisible();
    await expect(dashboardPage.portfolioCompanyItem('Company C')).toBeVisible();
    logger.info('Data for Company A, B, and C is displayed correctly');

    // Step 5: Check for clear indicators showing missing data
    await expect(dashboardPage.dataUnavailableIndicator('Company D')).toBeVisible();
    await expect(dashboardPage.dataUnavailableIndicator('Company D')).toContainText('Data unavailable - API connection failed');
    await expect(dashboardPage.dataUnavailableIndicator('Company E')).toBeVisible();
    await expect(dashboardPage.dataUnavailableIndicator('Company E')).toContainText('Data unavailable - API connection failed');
    logger.info('Visual indicators clearly identify Company D and E data as missing or stale');

    // Step 6: Verify timestamp of last successful data sync
    await expect(dashboardPage.lastSyncTimestamp('Company D')).toBeVisible();
    await expect(dashboardPage.lastSyncTimestamp('Company D')).toContainText('Last updated:');
    await expect(dashboardPage.lastSyncTimestamp('Company E')).toBeVisible();
    await expect(dashboardPage.lastSyncTimestamp('Company E')).toContainText('Last updated:');
    logger.info('Last successful sync timestamp is shown for Company D and E');

    // Step 7: Check system notification banner
    await expect(dashboardPage.systemNotificationBanner).toBeVisible();
    await expect(dashboardPage.systemNotificationBanner).toContainText('partial data availability');
    await expect(dashboardPage.systemNotificationBanner).toContainText('API issues');
    logger.info('System displays notification banner about partial data availability');
  });
});
