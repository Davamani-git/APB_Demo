const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { ApplicationListPage } = require('./pages/applicationList.page');
const { ApplicationDetailPage } = require('./pages/applicationDetail.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { AdminPage } = require('./pages/admin.page');
const { RuleManagementPage } = require('./pages/ruleManagement.page');
const { AuditLogPage } = require('./pages/auditLog.page');
const testData = require('../data/testData.json');
const logger = require('../utils/logger');

test.describe('VK002Demo - Provider Enrollment Readiness System', () => {
  let loginPage;
  let applicationListPage;
  let applicationDetailPage;
  let dashboardPage;
  let adminPage;
  let ruleManagementPage;
  let auditLogPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    applicationListPage = new ApplicationListPage(page);
    applicationDetailPage = new ApplicationDetailPage(page);
    dashboardPage = new DashboardPage(page);
    adminPage = new AdminPage(page);
    ruleManagementPage = new RuleManagementPage(page);
    auditLogPage = new AuditLogPage(page);
    logger.info('Test setup completed');
  });

  test('QE-5981 TS-001 TC-001 - All Required Documents Classification', async ({ page }) => {
    logger.info('Starting test: QE-5981 TS-001 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
      logger.info('Application launched successfully');
    });

    await test.step('Step 2: Login as coordinator', async () => {
      await loginPage.login(testData.users.coordinator1.username, testData.users.coordinator1.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
      logger.info('Coordinator logged in successfully');
    });

    await test.step('Step 3: Create new provider enrollment application', async () => {
      await applicationListPage.clickCreateApplication();
      await applicationDetailPage.fillProviderName('Dr. John Smith');
      await applicationDetailPage.fillProviderNPI('1234567890');
      await applicationDetailPage.selectPayer('Blue Cross Blue Shield');
      await applicationDetailPage.clickSaveApplication();
      await expect(applicationDetailPage.applicationIdLabel).toBeVisible();
      logger.info('Application created successfully');
    });

    await test.step('Step 4: Upload all required documents', async () => {
      await applicationDetailPage.uploadDocument('Medical License', 'test-files/medical_license.pdf', '2025-12-31');
      await applicationDetailPage.uploadDocument('Malpractice Insurance', 'test-files/malpractice_insurance.pdf', '2025-06-30');
      await applicationDetailPage.uploadDocument('DEA Certificate', 'test-files/dea_certificate.pdf', '2026-03-15');
      await expect(applicationDetailPage.getDocumentRow('Medical License')).toBeVisible();
      await expect(applicationDetailPage.getDocumentRow('Malpractice Insurance')).toBeVisible();
      await expect(applicationDetailPage.getDocumentRow('DEA Certificate')).toBeVisible();
      logger.info('All documents uploaded successfully');
    });

    await test.step('Step 5: Trigger evaluation', async () => {
      const startTime = Date.now();
      await applicationDetailPage.clickEvaluateButton();
      const evaluationTime = Date.now() - startTime;
      expect(evaluationTime).toBeLessThan(5000);
      logger.info(`Evaluation completed in ${evaluationTime}ms`);
    });

    await test.step('Step 6: Verify Ready to Submit status', async () => {
      await expect(applicationDetailPage.overallStatusBadge).toHaveText('Ready to Submit');
      await expect(applicationDetailPage.getPayerStatus('Blue Cross Blue Shield')).toHaveText('Ready to Submit');
      const rationale = await applicationDetailPage.getRequirementRationale('Medical License');
      expect(rationale).toContain('All required documents are present and valid');
      logger.info('Application status verified as Ready to Submit');
    });
  });

  test('QE-5981 TS-002 TC-001 - Missing Required Documents Classification', async ({ page }) => {
    logger.info('Starting test: QE-5981 TS-002 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as coordinator', async () => {
      await loginPage.login(testData.users.coordinator1.username, testData.users.coordinator1.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
    });

    await test.step('Step 3: Create new provider enrollment application', async () => {
      await applicationListPage.clickCreateApplication();
      await applicationDetailPage.fillProviderName('Dr. Jane Doe');
      await applicationDetailPage.fillProviderNPI('9876543210');
      await applicationDetailPage.selectPayer('UnitedHealthcare');
      await applicationDetailPage.clickSaveApplication();
      await expect(applicationDetailPage.applicationIdLabel).toBeVisible();
    });

    await test.step('Step 4: Upload only Medical License', async () => {
      await applicationDetailPage.uploadDocument('Medical License', 'test-files/medical_license.pdf', '2025-12-31');
      await expect(applicationDetailPage.getDocumentRow('Medical License')).toBeVisible();
      logger.info('Medical License uploaded, other documents intentionally missing');
    });

    await test.step('Step 5: Trigger evaluation', async () => {
      await applicationDetailPage.clickEvaluateButton();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 6: Verify Incomplete status', async () => {
      await expect(applicationDetailPage.overallStatusBadge).toHaveText('Incomplete');
      await expect(applicationDetailPage.getPayerStatus('UnitedHealthcare')).toHaveText('Incomplete');
      const rationale = await applicationDetailPage.getRequirementRationale('Malpractice Insurance');
      expect(rationale).toContain('Missing required document type');
      logger.info('Application status verified as Incomplete with correct rationale');
    });
  });

  test('QE-5981 TS-003 TC-001 - Expiring Document Classification', async ({ page }) => {
    logger.info('Starting test: QE-5981 TS-003 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as coordinator', async () => {
      await loginPage.login(testData.users.coordinator1.username, testData.users.coordinator1.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
    });

    await test.step('Step 3: Create new provider enrollment application', async () => {
      await applicationListPage.clickCreateApplication();
      await applicationDetailPage.fillProviderName('Dr. Michael Chen');
      await applicationDetailPage.fillProviderNPI('1122334455');
      await applicationDetailPage.selectPayer('Aetna');
      await applicationDetailPage.clickSaveApplication();
      await expect(applicationDetailPage.applicationIdLabel).toBeVisible();
    });

    await test.step('Step 4: Upload documents with expiring Medical License', async () => {
      const expiringDate = new Date();
      expiringDate.setDate(expiringDate.getDate() + 25);
      const expiringDateStr = expiringDate.toISOString().split('T')[0];
      
      await applicationDetailPage.uploadDocument('Medical License', 'test-files/medical_license.pdf', expiringDateStr);
      await applicationDetailPage.uploadDocument('Malpractice Insurance', 'test-files/malpractice_insurance.pdf', '2025-12-31');
      await applicationDetailPage.uploadDocument('DEA Certificate', 'test-files/dea_certificate.pdf', '2026-03-15');
      await expect(applicationDetailPage.getDocumentRow('Medical License')).toBeVisible();
      logger.info('Documents uploaded with expiring Medical License');
    });

    await test.step('Step 5: Trigger evaluation', async () => {
      await applicationDetailPage.clickEvaluateButton();
      await page.waitForTimeout(1000);
    });

    await test.step('Step 6: Verify Expiring Soon status', async () => {
      await expect(applicationDetailPage.overallStatusBadge).toHaveText('Expiring Soon');
      await expect(applicationDetailPage.getPayerStatus('Aetna')).toHaveText('Expiring Soon');
      const rationale = await applicationDetailPage.getRequirementRationale('Medical License');
      expect(rationale).toContain('expiring soon');
      logger.info('Application status verified as Expiring Soon');
    });
  });

  test('QE-5982 TS-001 TC-001 - Status Upgrade After Document Upload', async ({ page }) => {
    logger.info('Starting test: QE-5982 TS-001 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as coordinator', async () => {
      await loginPage.login(testData.users.coordinator1.username, testData.users.coordinator1.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
    });

    await test.step('Step 3: Navigate to incomplete application', async () => {
      await applicationListPage.searchApplication('APP-001');
      await applicationListPage.clickApplicationRow('APP-001');
      await expect(applicationDetailPage.overallStatusBadge).toHaveText('Incomplete');
      logger.info('Navigated to incomplete application APP-001');
    });

    await test.step('Step 4: Record timestamp before upload', async () => {
      const startTime = Date.now();
      logger.info(`Start time recorded: ${startTime}`);
    });

    await test.step('Step 5: Upload missing Malpractice Insurance document', async () => {
      const startTime = Date.now();
      await applicationDetailPage.uploadDocument('Malpractice Insurance', 'test-files/malpractice_insurance.pdf', '2025-12-31');
      await expect(applicationDetailPage.getDocumentRow('Malpractice Insurance')).toBeVisible();
      const uploadTime = Date.now() - startTime;
      logger.info(`Document uploaded in ${uploadTime}ms`);
    });

    await test.step('Step 6: Verify status update within 5 seconds', async () => {
      const startTime = Date.now();
      await expect(applicationDetailPage.overallStatusBadge).toHaveText('Ready to Submit', { timeout: 5000 });
      await expect(applicationDetailPage.getPayerStatus('Blue Cross Blue Shield')).toHaveText('Ready to Submit');
      const statusUpdateTime = Date.now() - startTime;
      expect(statusUpdateTime).toBeLessThan(5000);
      logger.info(`Status updated to Ready to Submit in ${statusUpdateTime}ms`);
    });
  });

  test('QE-5982 TS-002 TC-001 - Status Downgrade After Document Removal', async ({ page }) => {
    logger.info('Starting test: QE-5982 TS-002 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as coordinator', async () => {
      await loginPage.login(testData.users.coordinator1.username, testData.users.coordinator1.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
    });

    await test.step('Step 3: Navigate to Ready to Submit application', async () => {
      await applicationListPage.searchApplication('APP-002');
      await applicationListPage.clickApplicationRow('APP-002');
      await expect(applicationDetailPage.overallStatusBadge).toHaveText('Ready to Submit');
      logger.info('Navigated to Ready to Submit application APP-002');
    });

    await test.step('Step 4: Record timestamp before removal', async () => {
      const startTime = Date.now();
      logger.info(`Start time recorded: ${startTime}`);
    });

    await test.step('Step 5: Delete DEA Certificate document', async () => {
      await applicationDetailPage.deleteDocument('DEA_Certificate_001');
      await expect(applicationDetailPage.getDocumentRow('DEA Certificate')).not.toBeVisible();
      logger.info('DEA Certificate document deleted');
    });

    await test.step('Step 6: Verify status downgrade within 5 seconds', async () => {
      const startTime = Date.now();
      await expect(applicationDetailPage.overallStatusBadge).toHaveText('Incomplete', { timeout: 5000 });
      await expect(applicationDetailPage.getPayerStatus('Blue Cross Blue Shield')).toHaveText('Incomplete');
      const rationale = await applicationDetailPage.getRequirementRationale('DEA Certificate');
      expect(rationale).toContain('Missing');
      const statusUpdateTime = Date.now() - startTime;
      expect(statusUpdateTime).toBeLessThan(5000);
      logger.info(`Status downgraded to Incomplete in ${statusUpdateTime}ms`);
    });
  });

  test('QE-5982 TS-002 TC-002 - Status Downgrade After Expiration Update', async ({ page }) => {
    logger.info('Starting test: QE-5982 TS-002 TC-002');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as coordinator', async () => {
      await loginPage.login(testData.users.coordinator1.username, testData.users.coordinator1.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
    });

    await test.step('Step 3: Navigate to Ready to Submit application', async () => {
      await applicationListPage.searchApplication('APP-003');
      await applicationListPage.clickApplicationRow('APP-003');
      await expect(applicationDetailPage.overallStatusBadge).toHaveText('Ready to Submit');
    });

    await test.step('Step 4: Record timestamp before update', async () => {
      const startTime = Date.now();
      logger.info(`Start time recorded: ${startTime}`);
    });

    await test.step('Step 5: Update Medical License expiration date', async () => {
      const expiringDate = new Date();
      expiringDate.setDate(expiringDate.getDate() + 25);
      const expiringDateStr = expiringDate.toISOString().split('T')[0];
      
      await applicationDetailPage.editDocumentExpiration('Medical License', expiringDateStr);
      logger.info('Medical License expiration date updated to within threshold');
    });

    await test.step('Step 6: Verify status downgrade to Expiring Soon within 5 seconds', async () => {
      const startTime = Date.now();
      await expect(applicationDetailPage.overallStatusBadge).toHaveText('Expiring Soon', { timeout: 5000 });
      await expect(applicationDetailPage.getPayerStatus('Blue Cross Blue Shield')).toHaveText('Expiring Soon');
      const rationale = await applicationDetailPage.getRequirementRationale('Medical License');
      expect(rationale).toContain('expiring soon');
      const statusUpdateTime = Date.now() - startTime;
      expect(statusUpdateTime).toBeLessThan(5000);
      logger.info(`Status downgraded to Expiring Soon in ${statusUpdateTime}ms`);
    });
  });

  test('QE-5982 TS-003 TC-001 - Performance Threshold Validation', async ({ page }) => {
    logger.info('Starting test: QE-5982 TS-003 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as coordinator', async () => {
      await loginPage.login(testData.users.coordinator1.username, testData.users.coordinator1.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
    });

    await test.step('Step 3: Navigate to application with 10 payers', async () => {
      await applicationListPage.searchApplication('APP-PERF-001');
      await applicationListPage.clickApplicationRow('APP-PERF-001');
      const payerCount = await applicationDetailPage.getPayerCount();
      expect(payerCount).toBe(10);
      logger.info('Navigated to application with 10 payers and 50 rules per payer');
    });

    await test.step('Step 4: Record timestamp before upload', async () => {
      const startTime = Date.now();
      logger.info(`Start time recorded: ${startTime}`);
    });

    await test.step('Step 5: Upload document impacting multiple payers', async () => {
      await applicationDetailPage.uploadDocument('Malpractice Insurance', 'test-files/malpractice_insurance_updated.pdf', '2025-12-31');
      await expect(applicationDetailPage.getDocumentRow('Malpractice Insurance')).toBeVisible();
      logger.info('Document uploaded');
    });

    await test.step('Step 6: Verify recalculation within 5 seconds', async () => {
      const startTime = Date.now();
      await page.waitForSelector('[data-testid="status-updated"]', { timeout: 5000 });
      const recalculationTime = Date.now() - startTime;
      expect(recalculationTime).toBeLessThan(5000);
      logger.info(`All 10 payer statuses recalculated in ${recalculationTime}ms`);
    });
  });

  test('QE-5983 TS-001 TC-001 - Application List View with Filtering', async ({ page }) => {
    logger.info('Starting test: QE-5983 TS-001 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as coordinator', async () => {
      await loginPage.login(testData.users.coordinator1.username, testData.users.coordinator1.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
    });

    await test.step('Step 3: Verify application list displays all active applications', async () => {
      const applicationCount = await applicationListPage.getApplicationCount();
      expect(applicationCount).toBeGreaterThan(0);
      await expect(applicationListPage.getColumnHeader('Provider Name')).toBeVisible();
      await expect(applicationListPage.getColumnHeader('Overall Status')).toBeVisible();
      await expect(applicationListPage.getColumnHeader('Per-Payer Status')).toBeVisible();
      logger.info(`Application list displays ${applicationCount} applications`);
    });

    await test.step('Step 4: Apply filter for Incomplete status', async () => {
      await applicationListPage.selectStatusFilter('Incomplete');
      await page.waitForTimeout(500);
      const filteredCount = await applicationListPage.getApplicationCount();
      const allStatuses = await applicationListPage.getAllApplicationStatuses();
      allStatuses.forEach(status => {
        expect(status).toBe('Incomplete');
      });
      logger.info(`Filter applied: ${filteredCount} Incomplete applications displayed`);
    });

    await test.step('Step 5: Sort by Start Date descending', async () => {
      await applicationListPage.clickColumnHeader('Start Date');
      await page.waitForTimeout(500);
      const dates = await applicationListPage.getAllStartDates();
      for (let i = 0; i < dates.length - 1; i++) {
        expect(new Date(dates[i])).toBeGreaterThanOrEqual(new Date(dates[i + 1]));
      }
      logger.info('Applications sorted by Start Date in descending order');
    });

    await test.step('Step 6: Apply payer filter', async () => {
      await applicationListPage.selectPayerFilter('Blue Cross Blue Shield');
      await page.waitForTimeout(500);
      const filteredCount = await applicationListPage.getApplicationCount();
      logger.info(`Payer filter applied: ${filteredCount} applications targeting Blue Cross Blue Shield`);
    });
  });

  test('QE-5983 TS-002 TC-001 - Multi-Payer Independent Status Display', async ({ page }) => {
    logger.info('Starting test: QE-5983 TS-002 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as coordinator', async () => {
      await loginPage.login(testData.users.coordinator1.username, testData.users.coordinator1.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
    });

    await test.step('Step 3: Navigate to multi-payer application', async () => {
      await applicationListPage.searchApplication('APP-MULTI-001');
      await applicationListPage.clickApplicationRow('APP-MULTI-001');
      await expect(applicationDetailPage.applicationIdLabel).toBeVisible();
      logger.info('Navigated to multi-payer application APP-MULTI-001');
    });

    await test.step('Step 4: Verify per-payer status section', async () => {
      await expect(applicationDetailPage.getPayerStatus('Blue Cross Blue Shield')).toHaveText('Ready to Submit');
      await expect(applicationDetailPage.getPayerStatus('UnitedHealthcare')).toHaveText('Incomplete');
      await expect(applicationDetailPage.getPayerStatus('Aetna')).toHaveText('Expiring Soon');
      logger.info('Per-payer statuses verified: BCBS=Ready, UHC=Incomplete, Aetna=Expiring Soon');
    });

    await test.step('Step 5: Verify overall status reflects worst-case', async () => {
      await expect(applicationDetailPage.overallStatusBadge).toHaveText('Incomplete');
      logger.info('Overall status correctly reflects worst-case status: Incomplete');
    });

    await test.step('Step 6: Verify requirement-level detail per payer', async () => {
      await applicationDetailPage.expandPayerRequirements('UnitedHealthcare');
      await expect(applicationDetailPage.getRequirementStatus('UnitedHealthcare', 'Medical License')).toHaveText('Ready to Submit');
      await expect(applicationDetailPage.getRequirementStatus('UnitedHealthcare', 'Malpractice Insurance')).toHaveText('Incomplete');
      const rationale = await applicationDetailPage.getRequirementRationale('Malpractice Insurance');
      expect(rationale).toContain('Missing');
      logger.info('Requirement-level detail verified for UnitedHealthcare');
    });
  });

  test('QE-5983 TS-003 TC-001 - Assignment-Based Access Denial', async ({ page }) => {
    logger.info('Starting test: QE-5983 TS-003 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as coordinator with assignments', async () => {
      await loginPage.login(testData.users.coordinator2.username, testData.users.coordinator2.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
      const displayedApps = await applicationListPage.getApplicationIds();
      expect(displayedApps).toContain('APP-001');
      expect(displayedApps).toContain('APP-002');
      logger.info('Coordinator2 logged in with assignments to APP-001 and APP-002');
    });

    await test.step('Step 3: Attempt to access unassigned application via URL', async () => {
      await page.goto(testData.baseUrl + '/applications/APP-003');
      await expect(page.locator('text=Access Denied')).toBeVisible();
      logger.info('Access denied message displayed for unassigned application');
    });

    await test.step('Step 4: Verify redirect to assigned application list', async () => {
      await expect(page).toHaveURL(/\/applications$/);
      await expect(applicationListPage.applicationListTable).toBeVisible();
      logger.info('Coordinator redirected to assigned application list');
    });

    await test.step('Step 5: Login as admin and navigate to audit log', async () => {
      await loginPage.logout();
      await loginPage.login(testData.users.admin.username, testData.users.admin.password);
      await adminPage.navigate();
      await adminPage.clickAuditLog();
      await expect(auditLogPage.auditLogTable).toBeVisible();
      logger.info('Admin logged in and navigated to audit log');
    });

    await test.step('Step 6: Verify access denial logged in audit trail', async () => {
      await auditLogPage.filterByAction('ACCESS_DENIED');
      await auditLogPage.filterByEntityId('APP-003');
      const latestEntry = await auditLogPage.getLatestAuditEntry();
      expect(latestEntry.userId).toBe('coordinator2');
      expect(latestEntry.action).toBe('ACCESS_DENIED');
      expect(latestEntry.entityType).toBe('Application');
      expect(latestEntry.entityId).toBe('APP-003');
      expect(latestEntry.timestamp).toBeTruthy();
      logger.info('Access denial correctly logged in audit trail');
    });
  });

  test('QE-5984 TS-001 TC-001 - Daily Expiration Alert Notification', async ({ page }) => {
    logger.info('Starting test: QE-5984 TS-001 TC-001');
    
    await test.step('Step 1: Set up test data with expiring document', async () => {
      await loginPage.navigate();
      await loginPage.login(testData.users.admin.username, testData.users.admin.password);
      await applicationListPage.clickCreateApplication();
      await applicationDetailPage.fillProviderName('Dr. Sarah Johnson');
      await applicationDetailPage.fillProviderNPI('1234567890');
      await applicationDetailPage.selectPayer('Blue Cross Blue Shield');
      await applicationDetailPage.clickSaveApplication();
      
      const expiringDate = new Date();
      expiringDate.setDate(expiringDate.getDate() + 25);
      const expiringDateStr = expiringDate.toISOString().split('T')[0];
      
      await applicationDetailPage.uploadDocument('Medical License', 'test-files/medical_license.pdf', expiringDateStr);
      const appId = await applicationDetailPage.getApplicationId();
      logger.info(`Test application ${appId} created with expiring document`);
    });

    await test.step('Step 2: Trigger daily expiration check job', async () => {
      await adminPage.navigate();
      await adminPage.clickJobScheduler();
      await adminPage.triggerJob('DailyExpirationCheck');
      await expect(page.locator('text=Job executed successfully')).toBeVisible();
      logger.info('Daily expiration check job triggered');
    });

    await test.step('Step 3: Check coordinator email inbox', async () => {
      await adminPage.clickNotificationQueue();
      const notifications = await adminPage.getQueuedNotifications();
      const expirationAlert = notifications.find(n => n.subject.includes('Document Expiring Soon Alert'));
      expect(expirationAlert).toBeTruthy();
      expect(expirationAlert.recipient).toBe('coordinator1@example.com');
      logger.info('Expiration alert notification queued for coordinator');
    });

    await test.step('Step 4: Verify email content', async () => {
      await adminPage.clickNotification(0);
      const emailContent = await adminPage.getNotificationContent();
      expect(emailContent).toContain('Dr. Sarah Johnson');
      expect(emailContent).toContain('Medical License');
      expect(emailContent).toContain('Expiration Date');
      expect(emailContent).toContain('/applications/APP-EXP-001');
      logger.info('Email content verified with all required fields');
    });
  });

  test('QE-5984 TS-002 TC-001 - Weekly Digest Email Summary', async ({ page }) => {
    logger.info('Starting test: QE-5984 TS-002 TC-001');
    
    await test.step('Step 1: Set up test data with varying statuses', async () => {
      await loginPage.navigate();
      await loginPage.login(testData.users.admin.username, testData.users.admin.password);
      logger.info('Test applications with varying statuses already exist in system');
    });

    await test.step('Step 2: Trigger weekly digest job', async () => {
      await adminPage.navigate();
      await adminPage.clickJobScheduler();
      await adminPage.triggerJob('WeeklyDigest');
      await expect(page.locator('text=Job executed successfully')).toBeVisible();
      logger.info('Weekly digest job triggered');
    });

    await test.step('Step 3: Check enrollment manager email inbox', async () => {
      await adminPage.clickNotificationQueue();
      const notifications = await adminPage.getQueuedNotifications();
      const weeklyDigest = notifications.find(n => n.subject.includes('Weekly Enrollment Pipeline Digest'));
      expect(weeklyDigest).toBeTruthy();
      expect(weeklyDigest.recipient).toBe('manager@example.com');
      logger.info('Weekly digest notification queued for enrollment manager');
    });

    await test.step('Step 4: Verify email summary content', async () => {
      await adminPage.clickNotification(0);
      const emailContent = await adminPage.getNotificationContent();
      expect(emailContent).toContain('Ready to Submit: 1');
      expect(emailContent).toContain('Incomplete: 1');
      expect(emailContent).toContain('Expiring Soon: 1');
      expect(emailContent).toContain('Documents expiring in 30 days: 3');
      expect(emailContent).toContain('At-risk applications (start date within 14 days, not Ready): 2');
      logger.info('Weekly digest email content verified with all summary fields');
    });
  });

  test('QE-5984 TS-003 TC-001 - Expired Document Immediate Alert', async ({ page }) => {
    logger.info('Starting test: QE-5984 TS-003 TC-001');
    
    await test.step('Step 1: Set up test data with expired document', async () => {
      await loginPage.navigate();
      await loginPage.login(testData.users.admin.username, testData.users.admin.password);
      await applicationListPage.clickCreateApplication();
      await applicationDetailPage.fillProviderName('Dr. Robert Lee');
      await applicationDetailPage.fillProviderNPI('1234567890');
      await applicationDetailPage.selectPayer('Blue Cross Blue Shield');
      await applicationDetailPage.clickSaveApplication();
      
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 10);
      const expiredDateStr = expiredDate.toISOString().split('T')[0];
      
      await applicationDetailPage.uploadDocument('DEA Certificate', 'test-files/dea_certificate.pdf', expiredDateStr);
      logger.info('Test application created with expired document');
    });

    await test.step('Step 2: Trigger daily expiration check job', async () => {
      await adminPage.navigate();
      await adminPage.clickJobScheduler();
      await adminPage.triggerJob('DailyExpirationCheck');
      await expect(page.locator('text=Job executed successfully')).toBeVisible();
      logger.info('Daily expiration check job triggered');
    });

    await test.step('Step 3: Verify document status marked as Expired', async () => {
      await applicationListPage.navigate();
      await applicationListPage.searchApplication('APP-EXPIRED-001');
      await applicationListPage.clickApplicationRow('APP-EXPIRED-001');
      const docStatus = await applicationDetailPage.getDocumentStatus('DEA Certificate');
      expect(docStatus).toBe('Expired');
      logger.info('Document status correctly marked as Expired');
    });

    await test.step('Step 4: Verify payer status downgraded to Incomplete', async () => {
      await expect(applicationDetailPage.getPayerStatus('Blue Cross Blue Shield')).toHaveText('Incomplete');
      const rationale = await applicationDetailPage.getRequirementRationale('DEA Certificate');
      expect(rationale).toContain('expired');
      logger.info('Payer status downgraded to Incomplete with expired rationale');
    });

    await test.step('Step 5: Check coordinator email for immediate alert', async () => {
      await adminPage.navigate();
      await adminPage.clickNotificationQueue();
      const notifications = await adminPage.getQueuedNotifications();
      const expiredAlert = notifications.find(n => n.subject.includes('Expired Document Alert - Immediate Action Required'));
      expect(expiredAlert).toBeTruthy();
      expect(expiredAlert.recipient).toBe('coordinator1@example.com');
      logger.info('Immediate alert notification queued for expired document');
    });

    await test.step('Step 6: Verify email indicates replacement required', async () => {
      await adminPage.clickNotification(0);
      const emailContent = await adminPage.getNotificationContent();
      expect(emailContent).toContain('Dr. Robert Lee');
      expect(emailContent).toContain('DEA Certificate');
      expect(emailContent).toContain('This document has expired and requires immediate replacement');
      logger.info('Email content verified with replacement requirement message');
    });
  });

  test('QE-5985 TS-001 TC-001 - Coordinator Assigned Access Grant', async ({ page }) => {
    logger.info('Starting test: QE-5985 TS-001 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as coordinator with assignments', async () => {
      await loginPage.login(testData.users.coordinator1.username, testData.users.coordinator1.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
      const displayedApps = await applicationListPage.getApplicationIds();
      expect(displayedApps).toContain('APP-001');
      expect(displayedApps).toContain('APP-002');
      logger.info('Coordinator1 logged in with assignments');
    });

    await test.step('Step 3: Navigate to assigned application', async () => {
      await applicationListPage.clickApplicationRow('APP-001');
      await expect(applicationDetailPage.applicationIdLabel).toBeVisible();
      await expect(applicationDetailPage.editButton).toBeEnabled();
      logger.info('Full view access granted to assigned application');
    });

    await test.step('Step 4: Edit application data', async () => {
      await applicationDetailPage.clickEditButton();
      await applicationDetailPage.fillProviderEmail('updated.email@example.com');
      await applicationDetailPage.clickSaveButton();
      await expect(page.locator('text=Application updated successfully')).toBeVisible();
      logger.info('Application data updated successfully');
    });

    await test.step('Step 5: Upload document', async () => {
      await applicationDetailPage.uploadDocument('Malpractice Insurance', 'test-files/malpractice_insurance.pdf', '2025-12-31');
      await expect(applicationDetailPage.getDocumentRow('Malpractice Insurance')).toBeVisible();
      logger.info('Document uploaded successfully');
    });

    await test.step('Step 6: Login as admin and verify audit log', async () => {
      await loginPage.logout();
      await loginPage.login(testData.users.admin.username, testData.users.admin.password);
      await adminPage.navigate();
      await adminPage.clickAuditLog();
      await auditLogPage.filterByUserId('coordinator1');
      await auditLogPage.filterByEntityId('APP-001');
      
      const auditEntries = await auditLogPage.getAuditEntries();
      const accessEntry = auditEntries.find(e => e.action === 'APPLICATION_ACCESSED');
      const uploadEntry = auditEntries.find(e => e.action === 'DOCUMENT_UPLOAD');
      
      expect(accessEntry).toBeTruthy();
      expect(accessEntry.userId).toBe('coordinator1');
      expect(uploadEntry).toBeTruthy();
      expect(uploadEntry.userId).toBe('coordinator1');
      logger.info('All access attempts logged in immutable audit trail');
    });
  });

  test('QE-5985 TS-002 TC-001 - Coordinator Unassigned Access Denial with Full Logging', async ({ page }) => {
    logger.info('Starting test: QE-5985 TS-002 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as coordinator with limited assignments', async () => {
      await loginPage.login(testData.users.coordinator2.username, testData.users.coordinator2.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
      const displayedApps = await applicationListPage.getApplicationIds();
      expect(displayedApps).toContain('APP-001');
      expect(displayedApps).toContain('APP-002');
      expect(displayedApps).not.toContain('APP-003');
      logger.info('Coordinator2 logged in with assignments to APP-001 and APP-002 only');
    });

    await test.step('Step 3: Attempt direct URL access to unassigned application', async () => {
      await page.goto(testData.baseUrl + '/applications/APP-003');
      await expect(page.locator('text=Access Denied')).toBeVisible();
      logger.info('Access Denied message displayed');
    });

    await test.step('Step 4: Verify no application data displayed', async () => {
      await expect(applicationDetailPage.applicationIdLabel).not.toBeVisible();
      await expect(applicationDetailPage.documentTable).not.toBeVisible();
      await expect(applicationDetailPage.statusSection).not.toBeVisible();
      logger.info('No application details, documents, or status information visible');
    });

    await test.step('Step 5: Attempt search for unassigned application', async () => {
      await applicationListPage.navigate();
      await applicationListPage.searchApplication('APP-003');
      const searchResults = await applicationListPage.getApplicationCount();
      expect(searchResults).toBe(0);
      logger.info('Search results do not include unassigned application');
    });

    await test.step('Step 6: Login as admin and verify audit log', async () => {
      await loginPage.logout();
      await loginPage.login(testData.users.admin.username, testData.users.admin.password);
      await adminPage.navigate();
      await adminPage.clickAuditLog();
      await auditLogPage.filterByAction('ACCESS_DENIED');
      await auditLogPage.filterByUserId('coordinator2');
      await auditLogPage.filterByEntityId('APP-003');
      
      const latestEntry = await auditLogPage.getLatestAuditEntry();
      expect(latestEntry.userId).toBe('coordinator2');
      expect(latestEntry.action).toBe('ACCESS_DENIED');
      expect(latestEntry.entityType).toBe('Application');
      expect(latestEntry.entityId).toBe('APP-003');
      expect(latestEntry.timestamp).toBeTruthy();
      logger.info('Access denial logged with user ID, timestamp, and application ID');
    });
  });

  test('QE-5985 TS-003 TC-001 - Elevated Role Unrestricted Access', async ({ page }) => {
    logger.info('Starting test: QE-5985 TS-003 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as Enrollment Manager', async () => {
      await loginPage.login(testData.users.manager1.username, testData.users.manager1.password);
      await expect(dashboardPage.dashboardContainer).toBeVisible();
      logger.info('Enrollment Manager logged in');
    });

    await test.step('Step 3: Navigate to any application', async () => {
      await applicationListPage.navigate();
      await applicationListPage.clickApplicationRow('APP-001');
      await expect(applicationDetailPage.applicationIdLabel).toBeVisible();
      
      await applicationListPage.navigate();
      await applicationListPage.clickApplicationRow('APP-002');
      await expect(applicationDetailPage.applicationIdLabel).toBeVisible();
      
      await applicationListPage.navigate();
      await applicationListPage.clickApplicationRow('APP-003');
      await expect(applicationDetailPage.applicationIdLabel).toBeVisible();
      logger.info('Enrollment Manager has full access to all applications');
    });

    await test.step('Step 4: Logout and login as System Administrator', async () => {
      await loginPage.logout();
      await loginPage.login(testData.users.admin.username, testData.users.admin.password);
      await expect(adminPage.adminContainer).toBeVisible();
      logger.info('System Administrator logged in');
    });

    await test.step('Step 5: Navigate to any application with admin actions', async () => {
      await applicationListPage.navigate();
      await applicationListPage.clickApplicationRow('APP-001');
      await expect(applicationDetailPage.applicationIdLabel).toBeVisible();
      await expect(applicationDetailPage.adminActionsMenu).toBeVisible();
      logger.info('System Administrator has full administrative access');
    });

    await test.step('Step 6: Verify audit log for elevated role access', async () => {
      await adminPage.navigate();
      await adminPage.clickAuditLog();
      
      const managerEntries = await auditLogPage.getAuditEntriesByUserId('manager1');
      expect(managerEntries.length).toBeGreaterThan(0);
      managerEntries.forEach(entry => {
        expect(entry.action).toBe('APPLICATION_ACCESSED');
      });
      
      const adminEntries = await auditLogPage.getAuditEntriesByUserId('admin');
      expect(adminEntries.length).toBeGreaterThan(0);
      adminEntries.forEach(entry => {
        expect(entry.action).toBe('APPLICATION_ACCESSED');
      });
      
      logger.info('All elevated role access attempts logged without assignment restrictions');
    });
  });

  test('QE-5986 TS-001 TC-001 - New Rule Set Version Creation', async ({ page }) => {
    logger.info('Starting test: QE-5986 TS-001 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as system administrator', async () => {
      await loginPage.login(testData.users.admin.username, testData.users.admin.password);
      await expect(adminPage.adminContainer).toBeVisible();
      logger.info('System Administrator logged in');
    });

    await test.step('Step 3: Navigate to Payer Rule Set Management', async () => {
      await adminPage.navigate();
      await adminPage.clickPayerRuleSets();
      await expect(ruleManagementPage.ruleSetTable).toBeVisible();
      logger.info('Payer Rule Set Management page loaded');
    });

    await test.step('Step 4: Select existing rule set and create new version', async () => {
      await ruleManagementPage.selectRuleSet('Blue Cross Blue Shield', '1.0');
      await ruleManagementPage.clickCreateNewVersion();
      await expect(ruleManagementPage.versionForm).toBeVisible();
      logger.info('New version creation form loaded with pre-populated data');
    });

    await test.step('Step 5: Add new requirement and set effective date', async () => {
      await ruleManagementPage.addRequirement('Background Check Certificate');
      await ruleManagementPage.setDocumentTypes(['Background Check']);
      await ruleManagementPage.setMandatory(true);
      
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateStr = futureDate.toISOString().split('T')[0];
      
      await ruleManagementPage.setEffectiveDate(futureDateStr);
      await ruleManagementPage.setVersion('2.0');
      logger.info('New requirement added with future effective date');
    });

    await test.step('Step 6: Activate and save new rule set version', async () => {
      await ruleManagementPage.setActive(true);
      await ruleManagementPage.clickSave();
      await expect(page.locator('text=Rule set version saved successfully')).toBeVisible();
      
      const savedRuleSet = await ruleManagementPage.getRuleSetDetails('Blue Cross Blue Shield', '2.0');
      expect(savedRuleSet.administratorId).toBe('admin');
      expect(savedRuleSet.creationTimestamp).toBeTruthy();
      expect(savedRuleSet.effectiveDate).toBeTruthy();
      logger.info('New rule set version saved with admin ID and timestamps');
    });

    await test.step('Step 7: Verify version history', async () => {
      await ruleManagementPage.clickVersionHistory('Blue Cross Blue Shield');
      await expect(ruleManagementPage.versionHistoryTable).toBeVisible();
      
      const versions = await ruleManagementPage.getVersions();
      expect(versions).toContain('1.0');
      expect(versions).toContain('2.0');
      
      const v1Details = await ruleManagementPage.getVersionDetails('1.0');
      expect(v1Details.createdBy).toBe('admin');
      
      const v2Details = await ruleManagementPage.getVersionDetails('2.0');
      expect(v2Details.createdBy).toBe('admin');
      logger.info('Version history displays both v1.0 and v2.0');
    });

    await test.step('Step 8: Verify no code deployment required', async () => {
      await applicationListPage.navigate();
      await applicationListPage.clickCreateApplication();
      await applicationDetailPage.selectPayer('Blue Cross Blue Shield');
      
      const availableRuleSets = await applicationDetailPage.getAvailableRuleSets();
      expect(availableRuleSets).toContain('2.0');
      logger.info('New rule set version immediately available without code deployment');
    });
  });

  test('QE-5986 TS-002 TC-001 - Effective Date-Based Rule Application', async ({ page }) => {
    logger.info('Starting test: QE-5986 TS-002 TC-001');
    
    await test.step('Step 1: Set up test data with multiple rule versions', async () => {
      await loginPage.navigate();
      await loginPage.login(testData.users.admin.username, testData.users.admin.password);
      logger.info('Test rule sets with multiple versions already configured');
    });

    await test.step('Step 2: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 3: Login as coordinator', async () => {
      await loginPage.login(testData.users.coordinator1.username, testData.users.coordinator1.password);
      await expect(applicationListPage.applicationListTable).toBeVisible();
    });

    await test.step('Step 4: Navigate to application and trigger evaluation', async () => {
      await applicationListPage.searchApplication('APP-VERSION-001');
      await applicationListPage.clickApplicationRow('APP-VERSION-001');
      await applicationDetailPage.clickEvaluateButton();
      await page.waitForTimeout(1000);
      logger.info('Application evaluation triggered');
    });

    await test.step('Step 5: Verify correct rule set version applied', async () => {
      const appliedVersion = await applicationDetailPage.getRuleSetVersion('UnitedHealthcare');
      expect(appliedVersion).toBe('v2.0');
      logger.info('Rule set v2.0 applied based on effective date');
    });

    await test.step('Step 6: Navigate to audit log', async () => {
      await loginPage.logout();
      await loginPage.login(testData.users.admin.username, testData.users.admin.password);
      await adminPage.navigate();
      await adminPage.clickAuditLog();
      await auditLogPage.filterByAction('APPLICATION_EVALUATED');
      await auditLogPage.filterByEntityId('APP-VERSION-001');
      logger.info('Audit log filtered for evaluation events');
    });

    await test.step('Step 7: Verify audit log records applied rule set version', async () => {
      const latestEntry = await auditLogPage.getLatestAuditEntry();
      expect(latestEntry.action).toBe('APPLICATION_EVALUATED');
      expect(latestEntry.entityType).toBe('Application');
      expect(latestEntry.entityId).toBe('APP-VERSION-001');
      expect(latestEntry.details.ruleSetVersion).toBe('v2.0');
      expect(latestEntry.details.payer).toBe('UnitedHealthcare');
      expect(latestEntry.details.evaluationTimestamp).toBeTruthy();
      logger.info('Audit log correctly records applied rule set version with evaluation timestamp');
    });
  });

  test('QE-5986 TS-003 TC-001 - Effective Date Chronology Validation', async ({ page }) => {
    logger.info('Starting test: QE-5986 TS-003 TC-001');
    
    await test.step('Step 1: Launch application', async () => {
      await loginPage.navigate();
      await expect(page).toHaveTitle(/Provider Enrollment Readiness System/);
    });

    await test.step('Step 2: Login as system administrator', async () => {
      await loginPage.login(testData.users.admin.username, testData.users.admin.password);
      await expect(adminPage.adminContainer).toBeVisible();
    });

    await test.step('Step 3: Navigate to Payer Rule Set Management', async () => {
      await adminPage.navigate();
      await adminPage.clickPayerRuleSets();
      await expect(ruleManagementPage.ruleSetTable).toBeVisible();
    });

    await test.step('Step 4: Select rule set with recent version', async () => {
      await ruleManagementPage.selectRuleSet('Aetna', '2.0');
      const ruleSetDetails = await ruleManagementPage.getRuleSetDetails('Aetna', '2.0');
      expect(ruleSetDetails.effectiveDate).toBe('2024-06-01');
      await ruleManagementPage.clickCreateNewVersion();
      logger.info('Selected Aetna v2.0 with effective date 2024-06-01');
    });

    await test.step('Step 5: Attempt to set earlier effective date', async () => {
      await ruleManagementPage.setEffectiveDate('2024-05-01');
      await ruleManagementPage.setVersion('3.0');
      await ruleManagementPage.clickSave();
      logger.info('Attempted to save new version with earlier effective date');
    });

    await test.step('Step 6: Verify validation error message', async () => {
      await expect(page.locator('text=Effective date must be later than the most recent version')).toBeVisible();
      const errorMessage = await ruleManagementPage.getValidationError();
      expect(errorMessage).toContain('Effective date must be later than the most recent version\'s effective date (2024-06-01)');
      expect(errorMessage).toContain('maintain audit trail integrity');
      logger.info('Validation error message displayed with correct details');
    });

    await test.step('Step 7: Verify save action blocked', async () => {
      const saveButton = await ruleManagementPage.getSaveButton();
      const isDisabled = await saveButton.isDisabled();
      expect(isDisabled).toBe(true);
      logger.info('Save button disabled, version creation blocked');
    });
  });
});