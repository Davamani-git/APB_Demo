const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { BudgetManagementPage } = require('./pages/budgetManagement.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Budget Threshold Alerts and Notifications', () => {

  test('TC-005: Configure budget threshold and verify alert delivery', async ({ page }) => {
    logger.info('Starting TC-005: Configure budget threshold and verify alert delivery');
    const loginPage = new LoginPage(page);
    const budgetPage = new BudgetManagementPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Log in as Enterprise Admin and configure budget threshold
    await loginPage.navigate();
    await loginPage.login('admin@enterprise.com', 'Admin@123');
    await budgetPage.navigateToBudgetManagement();
    await budgetPage.selectPortfolioCompany('Portfolio Company X');
    await budgetPage.setBudgetThreshold('10000');
    await budgetPage.saveBudgetConfiguration();
    await expect(budgetPage.successMessage).toBeVisible();
    logger.info('Budget threshold is successfully configured');

    // Step 2: Assign Operating Partners
    await budgetPage.assignOperatingPartners(['partner1@company.com', 'partner2@company.com']);
    await expect(budgetPage.assignedPartnersContainer).toContainText('partner1@company.com');
    await expect(budgetPage.assignedPartnersContainer).toContainText('partner2@company.com');
    logger.info('Operating Partners are successfully assigned');

    // Step 3: Configure notification channels
    await budgetPage.configureNotificationChannels(['Email', 'SMS']);
    await expect(budgetPage.notificationChannelsIndicator).toContainText('Email');
    await expect(budgetPage.notificationChannelsIndicator).toContainText('SMS');
    logger.info('Notification channels (email, SMS) are configured');

    // Step 4: Trigger data sync that updates AI spend to exceed threshold
    await budgetPage.triggerDataSync('Portfolio Company X', '10500');
    await expect(budgetPage.dataSyncSuccessMessage).toBeVisible();
    logger.info('Data sync completes successfully with AI spend at $10,500');

    // Step 5: Wait for alert processing (up to 5 minutes)
    await budgetPage.waitForAlertProcessing();
    await expect(budgetPage.alertTriggeredIndicator).toBeVisible();
    logger.info('Alert is triggered within the system');

    // Step 6: Verify alert delivery to all assigned Operating Partners
    await budgetPage.verifyAlertDelivery(['partner1@company.com', 'partner2@company.com']);
    await expect(budgetPage.alertDeliveryStatus('partner1@company.com')).toContainText('Delivered');
    await expect(budgetPage.alertDeliveryStatus('partner2@company.com')).toContainText('Delivered');
    logger.info('All Operating Partners receive alert via configured channels within 5 minutes');

    // Step 7: Check alert content for accuracy
    await budgetPage.viewAlertContent();
    await expect(budgetPage.alertContentContainer).toContainText('Portfolio Company X');
    await expect(budgetPage.alertContentContainer).toContainText('$10,500');
    await expect(budgetPage.alertContentContainer).toContainText('$10,000');
    await expect(budgetPage.alertContentContainer).toContainText('$500');
    logger.info('Alert contains company name, current spend, threshold, and overage amount');
  });

  test('TC-006: Verify no false positive alerts when spend is below threshold', async ({ page }) => {
    logger.info('Starting TC-006: Verify no false positive alerts');
    const loginPage = new LoginPage(page);
    const budgetPage = new BudgetManagementPage(page);

    // Step 1: Log in and configure budget threshold
    await loginPage.navigate();
    await loginPage.login('admin@enterprise.com', 'Admin@123');
    await budgetPage.navigateToBudgetManagement();
    await budgetPage.selectPortfolioCompany('Portfolio Company Y');
    await budgetPage.setBudgetThreshold('10000');
    await budgetPage.saveBudgetConfiguration();
    await expect(budgetPage.successMessage).toBeVisible();
    logger.info('Budget threshold is successfully configured');

    // Step 2: Assign Operating Partners
    await budgetPage.assignOperatingPartners(['partner3@company.com']);
    await expect(budgetPage.assignedPartnersContainer).toContainText('partner3@company.com');
    logger.info('Operating Partners are successfully assigned');

    // Step 3: Trigger data sync with spend 1% below threshold
    await budgetPage.triggerDataSync('Portfolio Company Y', '9900');
    await expect(budgetPage.dataSyncSuccessMessage).toBeVisible();
    logger.info('Data sync completes successfully with AI spend at $9,900');

    // Step 4: Wait for alert processing window (10 minutes)
    await budgetPage.waitForAlertProcessingWindow(10);
    const alertTriggered = await budgetPage.alertTriggeredIndicator.isVisible().catch(() => false);
    expect(alertTriggered).toBe(false);
    logger.info('No alert is triggered');

    // Step 5: Verify no alert was sent
    await budgetPage.verifyNoAlertDelivered('partner3@company.com');
    const alertDelivered = await budgetPage.alertDeliveryStatus('partner3@company.com').isVisible().catch(() => false);
    expect(alertDelivered).toBe(false);
    logger.info('No alert notifications are delivered to partner3@company.com');

    // Step 6: Check alert logs in admin panel
    await budgetPage.navigateToAlertLogs();
    await budgetPage.filterAlertLogs('Portfolio Company Y', 'Last 10 minutes');
    await expect(budgetPage.noAlertsMessage).toBeVisible();
    logger.info('Alert logs confirm no false positive alerts were generated');
  });

  test('TC-007: Verify error handling when Operating Partners are not assigned', async ({ page }) => {
    logger.info('Starting TC-007: Verify error handling for missing Operating Partners');
    const loginPage = new LoginPage(page);
    const budgetPage = new BudgetManagementPage(page);

    // Step 1: Log in and configure budget threshold without Operating Partners
    await loginPage.navigate();
    await loginPage.login('admin@enterprise.com', 'Admin@123');
    await budgetPage.navigateToBudgetManagement();
    await budgetPage.selectPortfolioCompany('Portfolio Company Z');
    await budgetPage.setBudgetThreshold('8000');
    await budgetPage.saveBudgetConfiguration();
    await expect(budgetPage.successMessage).toBeVisible();
    logger.info('Budget threshold is successfully configured');

    // Step 2: Trigger data sync that exceeds threshold
    await budgetPage.triggerDataSync('Portfolio Company Z', '9000');
    await expect(budgetPage.dataSyncSuccessMessage).toBeVisible();
    logger.info('Data sync completes successfully with AI spend at $9,000');

    // Step 3: Wait for alert processing
    await budgetPage.waitForAlertProcessing();
    logger.info('System attempts to trigger alert but detects missing recipients');

    // Step 4: Check system error logs
    await budgetPage.navigateToSystemErrorLogs();
    await budgetPage.filterErrorLogs('Missing Alert Recipients');
    await expect(budgetPage.errorLogEntry).toBeVisible();
    await expect(budgetPage.errorLogEntry).toContainText('Portfolio Company Z');
    logger.info('Error log entry indicates missing alert recipients for Portfolio Company Z');

    // Step 5: Verify Enterprise Admin receives notification
    await budgetPage.checkAdminNotifications();
    await expect(budgetPage.adminNotificationMessage).toBeVisible();
    await expect(budgetPage.adminNotificationMessage).toContainText('Portfolio Company Z');
    await expect(budgetPage.adminNotificationMessage).toContainText('no assigned Operating Partners');
    logger.info('Enterprise Admin receives notification about configuration issue');

    // Step 6: Check notification content
    await expect(budgetPage.adminNotificationMessage).toContainText('Portfolio Company Z');
    await expect(budgetPage.adminNotificationMessage).toContainText('$9,000');
    await expect(budgetPage.adminNotificationMessage).toContainText('$8,000');
    await expect(budgetPage.adminNotificationMessage).toContainText('assign Operating Partners');
    logger.info('Notification includes company name, spend, threshold, and instructions');
  });
});
