const { test, expect } = require('@playwright/test');
const { ApplicationPage } = require('./pages/application.page');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Deterministic Readiness Classification - QE-5996', () => {
  let loginPage;
  let applicationPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    applicationPage = new ApplicationPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('coordinator@example.com', 'Pass@123');
  });

  test('QE-5996 TS-001 TC-001: Verify deterministic readiness classification when all requirements are met for all target payers', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    await applicationPage.createNewApplication('Dr. John Smith', '1234567890', 'New Enrollment', ['BCBS', 'Medicare']);
    await applicationPage.uploadDocument('Medical License', 'Medical_License.pdf', '2026-12-31');
    await applicationPage.uploadDocument('DEA Certificate', 'DEA_Certificate.pdf', '2025-06-30');
    await applicationPage.populateDataField('NPI Number', '1234567890');
    await applicationPage.populateDataField('PECOS Enrollment', 'Completed');
    await applicationPage.navigateToApplicationDetail();
    await expect(applicationPage.getPayerStatus('BCBS')).toContainText('Ready to Submit');
    await expect(applicationPage.getPayerStatus('Medicare')).toContainText('Ready to Submit');
    await applicationPage.navigateToApplicationList();
    await expect(applicationPage.getOverallApplicationStatus()).toContainText('Ready to Submit');
  });

  test('QE-5996 TS-002 TC-001: Verify deterministic readiness classification when required documents are missing for at least one payer', async ({ page }) => {
    await dashboardPage.waitForDashboardLoad();
    await applicationPage.createNewApplication('Dr. Jane Doe', '0987654321', 'New Enrollment', ['BCBS', 'Aetna']);
    await applicationPage.uploadDocument('Medical License', 'Medical_License.pdf', '2026-12-31');
    await applicationPage.navigateToApplicationDetail();
    await expect(applicationPage.getPayerStatus('BCBS')).toContainText('Incomplete');
    const missingRequirements = await applicationPage.getMissingRequirements('BCBS');
    await expect(missingRequirements).toContain('DEA Certificate');
    await applicationPage.uploadDocumentForPayer('Aetna', 'Medical License', 'Medical_License_Aetna.pdf', '2026-12-31');
    await applicationPage.uploadDocumentForPayer('Aetna', 'Malpractice Insurance', 'Malpractice_Insurance.pdf', '2025-12-31');
    await applicationPage.uploadDocumentForPayer('Aetna', 'DEA Certificate', 'DEA_Certificate.pdf', '2025-06-30');
    await expect(applicationPage.getPayerStatus('Aetna')).toContainText('Ready to Submit');
    await applicationPage.navigateToApplicationList();
    await expect(applicationPage.getOverallApplicationStatus()).toContainText('Incomplete');
  });

  test('QE-5996 TS-003 TC-001: Verify deterministic readiness classification when a document expiration date falls within the configured threshold', async ({ page }) => {
    await loginPage.logout();
    await loginPage.login('admin@example.com', 'Admin@123');
    await dashboardPage.navigateToAdminSettings();
    await applicationPage.setExpirationThreshold(90);
    await loginPage.logout();
    await loginPage.login('coordinator@example.com', 'Pass@123');
    await applicationPage.createNewApplication('Dr. Emily Rodriguez', '1122334455', 'New Enrollment', ['Aetna']);
    const expiringDate = applicationPage.calculateDateFromToday(60);
    await applicationPage.uploadDocument('Medical License', 'Medical_License.pdf', '2026-12-31');
    await applicationPage.uploadDocument('Malpractice Insurance', 'Malpractice_Insurance.pdf', expiringDate);
    await applicationPage.uploadDocument('DEA Certificate', 'DEA_Certificate.pdf', '2025-06-30');
    await applicationPage.navigateToApplicationDetail();
    await expect(applicationPage.getPayerStatus('Aetna')).toContainText('Expiring Soon');
    const expiringDocs = await applicationPage.getExpiringDocuments('Aetna');
    await expect(expiringDocs).toContain('Malpractice Insurance');
    await applicationPage.navigateToApplicationList();
    await expect(applicationPage.getOverallApplicationStatus()).toContainText('Expiring Soon');
  });
});

test.describe('Real-Time Status Recalculation - QE-5997', () => {
  let loginPage;
  let applicationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    applicationPage = new ApplicationPage(page);
    await loginPage.navigate();
    await loginPage.login('coordinator@example.com', 'Pass@123');
  });

  test('QE-5997 TS-001 TC-001: Verify real-time status recalculation when a missing required document is uploaded and all other requirements are met', async ({ page }) => {
    await applicationPage.openApplication('APP001');
    await expect(applicationPage.getPayerStatus('BCBS')).toContainText('Incomplete');
    await expect(applicationPage.getRequirementStatus('DEA Certificate')).toContainText('Missing');
    const startTime = Date.now();
    await applicationPage.uploadDocument('DEA Certificate', 'DEA_Certificate.pdf', '2025-12-31');
    await applicationPage.waitForStatusRecalculation();
    const endTime = Date.now();
    const recalculationTime = (endTime - startTime) / 1000;
    expect(recalculationTime).toBeLessThanOrEqual(5);
    await expect(applicationPage.getPayerStatus('BCBS')).toContainText('Ready to Submit');
    await expect(applicationPage.getOverallApplicationStatus()).toContainText('Ready to Submit');
  });

  test('QE-5997 TS-002 TC-001: Verify status remains Incomplete when only one of multiple missing requirements is fulfilled', async ({ page }) => {
    await applicationPage.openApplication('APP002');
    await expect(applicationPage.getPayerStatus('Aetna')).toContainText('Incomplete');
    await expect(applicationPage.getRequirementStatus('DEA Certificate')).toContainText('Missing');
    await expect(applicationPage.getRequirementStatus('Malpractice Insurance')).toContainText('Missing');
    await applicationPage.uploadDocument('DEA Certificate', 'DEA_Certificate.pdf', '2025-12-31');
    await applicationPage.waitForStatusRecalculation();
    await expect(applicationPage.getPayerStatus('Aetna')).toContainText('Incomplete');
    await expect(applicationPage.getRequirementStatus('Malpractice Insurance')).toContainText('Missing');
    await expect(applicationPage.getOverallApplicationStatus()).toContainText('Incomplete');
  });

  test('QE-5997 TS-003 TC-001: Verify system rejects upload of an expired document and displays appropriate error message', async ({ page }) => {
    await applicationPage.openApplication('APP003');
    await expect(applicationPage.getPayerStatus('BCBS')).toContainText('Incomplete');
    await applicationPage.uploadDocument('DEA Certificate', 'DEA_Certificate_Expired.pdf', '2023-12-31');
    await expect(applicationPage.getErrorMessage()).toContainText('This document expired on 2023-12-31 and cannot satisfy this requirement. Please upload a current version.');
    await expect(applicationPage.getPayerStatus('BCBS')).toContainText('Incomplete');
    await expect(applicationPage.getRequirementStatus('DEA Certificate')).toContainText('Missing');
  });
});

test.describe('Application List and Detail Views - QE-5998', () => {
  let loginPage;
  let applicationPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    applicationPage = new ApplicationPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login('coordinator@example.com', 'Pass@123');
  });

  test('QE-5998 TS-001 TC-001: Verify application list view displays provider name, application type, target payers, and overall worst-case status for all active applications', async ({ page }) => {
    const startTime = Date.now();
    await applicationPage.navigateToApplicationList();
    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;
    expect(loadTime).toBeLessThanOrEqual(3);
    await expect(applicationPage.getApplicationListHeaders()).toContainText(['Provider Name', 'NPI', 'Application Type', 'Target Payers', 'Status', 'Start Date', 'Coordinator']);
    const applications = await applicationPage.getAllApplications();
    expect(applications.length).toBeGreaterThan(0);
    for (const app of applications) {
      await expect(app.providerName).toBeTruthy();
      await expect(app.applicationType).toBeTruthy();
      await expect(app.targetPayers).toBeTruthy();
      await expect(app.overallStatus).toMatch(/Ready to Submit|Incomplete|Expiring Soon/);
    }
  });

  test('QE-5998 TS-002 TC-001: Verify application detail view displays per-payer status summary with requirement-level indicators', async ({ page }) => {
    await applicationPage.navigateToApplicationList();
    await applicationPage.openApplication('APP001');
    await expect(applicationPage.getApplicationDetailHeader()).toContainText('Dr.');
    const payerSections = await applicationPage.getPayerSections();
    expect(payerSections.length).toBeGreaterThan(0);
    for (const payer of payerSections) {
      await expect(payer.payerName).toBeTruthy();
      await expect(payer.status).toMatch(/Ready to Submit|Incomplete|Expiring Soon/);
      const requirements = await applicationPage.getRequirementsForPayer(payer.payerName);
      for (const req of requirements) {
        await expect(req.status).toMatch(/Present & Valid|Missing|Expired|Expiring Soon/);
      }
    }
    const documents = await applicationPage.getUploadedDocuments();
    for (const doc of documents) {
      await expect(doc.name).toBeTruthy();
      await expect(doc.type).toBeTruthy();
      await expect(doc.uploadDate).toBeTruthy();
      await expect(doc.uploadedBy).toBeTruthy();
    }
  });

  test('QE-5998 TS-003 TC-001: Verify overall application status displays worst-case status when multiple payers have mixed statuses', async ({ page }) => {
    await applicationPage.createNewApplication('Dr. Test Provider', '1234567890', 'New Enrollment', ['BCBS', 'Medicare']);
    await applicationPage.uploadDocumentForPayer('Medicare', 'Medical License', 'Medical_License.pdf', '2026-12-31');
    await applicationPage.uploadDocumentForPayer('Medicare', 'PECOS Enrollment', 'PECOS.pdf', '2025-12-31');
    await applicationPage.populateDataFieldForPayer('Medicare', 'NPI Number', '1234567890');
    await expect(applicationPage.getPayerStatus('Medicare')).toContainText('Ready to Submit');
    await expect(applicationPage.getPayerStatus('BCBS')).toContainText('Incomplete');
    await applicationPage.navigateToApplicationList();
    await expect(applicationPage.getOverallApplicationStatus()).toContainText('Incomplete');
  });
});

test.describe('Manager Dashboard and Exports - QE-5999', () => {
  let loginPage;
  let dashboardPage;
  let applicationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    applicationPage = new ApplicationPage(page);
    await loginPage.navigate();
    await loginPage.login('manager@example.com', 'Manager@123');
  });

  test('QE-5999 TS-001 TC-001: Verify manager dashboard displays aggregate counts by status with drill-down filters for pipeline monitoring', async ({ page }) => {
    const startTime = Date.now();
    await dashboardPage.navigateToDashboard();
    const endTime = Date.now();
    const loadTime = (endTime - startTime) / 1000;
    expect(loadTime).toBeLessThanOrEqual(5);
    await expect(dashboardPage.getTotalApplicationsCount()).toBeGreaterThan(0);
    await expect(dashboardPage.getReadyToSubmitCount()).toBeGreaterThanOrEqual(0);
    await expect(dashboardPage.getIncompleteCount()).toBeGreaterThanOrEqual(0);
    await expect(dashboardPage.getExpiringSoonCount()).toBeGreaterThanOrEqual(0);
    await dashboardPage.applyStatusFilter('Incomplete');
    await dashboardPage.waitForFilterResults();
    const filteredApps = await dashboardPage.getFilteredApplications();
    for (const app of filteredApps) {
      await expect(app.status).toContain('Incomplete');
    }
    await dashboardPage.applyPayerFilter('BCBS');
    await dashboardPage.waitForFilterResults();
    const payerFilteredApps = await dashboardPage.getFilteredApplications();
    for (const app of payerFilteredApps) {
      await expect(app.targetPayers).toContain('BCBS');
    }
  });

  test('QE-5999 TS-002 TC-001: Verify filtered report export completes within 30 seconds and contains only filtered applications with required details', async ({ page }) => {
    await dashboardPage.navigateToDashboard();
    await dashboardPage.applyStatusFilter('Incomplete');
    await dashboardPage.applyPayerFilter('BCBS');
    await dashboardPage.waitForFilterResults();
    const startTime = Date.now();
    const csvPath = await dashboardPage.exportToCSV();
    const endTime = Date.now();
    const exportTime = (endTime - startTime) / 1000;
    expect(exportTime).toBeLessThanOrEqual(30);
    const csvData = await dashboardPage.readCSVFile(csvPath);
    expect(csvData.length).toBeGreaterThan(0);
    for (const row of csvData) {
      expect(row.status).toContain('Incomplete');
      expect(row.targetPayers).toContain('BCBS');
      expect(row.providerName).toBeTruthy();
      expect(row.npi).toBeTruthy();
      expect(row.applicationType).toBeTruthy();
    }
  });

  test('QE-5999 TS-002 TC-002: Verify filtered PDF report export completes within 30 seconds and contains only filtered applications with required details', async ({ page }) => {
    await dashboardPage.navigateToDashboard();
    await dashboardPage.applyStatusFilter('Expiring Soon');
    await dashboardPage.waitForFilterResults();
    const startTime = Date.now();
    const pdfPath = await dashboardPage.exportToPDF();
    const endTime = Date.now();
    const exportTime = (endTime - startTime) / 1000;
    expect(exportTime).toBeLessThanOrEqual(30);
    expect(pdfPath).toBeTruthy();
  });

  test('QE-5999 TS-003 TC-001: Verify system limits export to 1,000 records or displays validation error when export exceeds limit', async ({ page }) => {
    await dashboardPage.navigateToDashboard();
    const totalApps = await dashboardPage.getTotalApplicationsCount();
    if (totalApps > 1000) {
      const csvPath = await dashboardPage.exportToCSV();
      const csvData = await dashboardPage.readCSVFile(csvPath);
      expect(csvData.length).toBeLessThanOrEqual(1000);
      await expect(dashboardPage.getExportNotification()).toContainText('limited to 1,000 records');
    } else {
      await dashboardPage.selectAllApplications();
      const csvPath = await dashboardPage.exportToCSV();
      const csvData = await dashboardPage.readCSVFile(csvPath);
      expect(csvData.length).toBeLessThanOrEqual(1000);
    }
  });
});

test.describe('Payer Rule Set Administration - QE-6000', () => {
  let loginPage;
  let adminPage;
  let auditPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    adminPage = new AdminPage(page);
    auditPage = new AuditPage(page);
    await loginPage.navigate();
    await loginPage.login('admin@example.com', 'Admin@123');
  });

  test('QE-6000 TS-001 TC-001: Verify administrator can create a new payer rule set with versioning and metadata, and it becomes available for applications', async ({ page }) => {
    await adminPage.navigateToRuleSetManagement();
    await adminPage.clickCreateNewRuleSet();
    await adminPage.enterPayerID('Humana');
    await adminPage.enterPayerName('Humana Insurance');
    await adminPage.enterEffectiveDate('2024-04-01');
    await adminPage.addRequiredDocument('Medical License');
    await adminPage.addRequiredDocument('DEA Certificate');
    await adminPage.addRequiredDataField('NPI Number');
    await adminPage.saveRuleSet();
    await expect(adminPage.getSuccessMessage()).toContainText('created successfully');
    const ruleSetList = await adminPage.getRuleSetList();
    const humanaRuleSet = ruleSetList.find(rs => rs.payerName === 'Humana Insurance');
    expect(humanaRuleSet).toBeTruthy();
    expect(humanaRuleSet.version).toBe('1.0');
    expect(humanaRuleSet.effectiveDate).toBe('2024-04-01');
    await loginPage.logout();
    await loginPage.login('coordinator@example.com', 'Pass@123');
    const applicationPage = new ApplicationPage(page);
    await applicationPage.navigateToCreateApplication();
    const availablePayers = await applicationPage.getAvailablePayers();
    expect(availablePayers).toContain('Humana');
    await loginPage.logout();
    await loginPage.login('admin@example.com', 'Admin@123');
    await auditPage.navigateToAuditLog();
    await auditPage.filterByEventType('Rule Set Created');
    const auditEntries = await auditPage.getAuditEntries();
    const createEntry = auditEntries.find(e => e.details.includes('Humana'));
    expect(createEntry).toBeTruthy();
  });

  test('QE-6000 TS-002 TC-001: Verify administrator can update an existing payer rule set with version increment and audit trail', async ({ page }) => {
    await adminPage.navigateToRuleSetManagement();
    const ruleSetList = await adminPage.getRuleSetList();
    const bcbsRuleSet = ruleSetList.find(rs => rs.payerName === 'BCBS');
    expect(bcbsRuleSet.version).toBe('1.0');
    await adminPage.editRuleSet('BCBS');
    await adminPage.addRequiredDocument('Board Certification');
    await adminPage.enterEffectiveDate('2024-05-01');
    await adminPage.saveRuleSet();
    await expect(adminPage.getSuccessMessage()).toContainText('updated successfully');
    const updatedRuleSetList = await adminPage.getRuleSetList();
    const updatedBCBS = updatedRuleSetList.find(rs => rs.payerName === 'BCBS');
    expect(updatedBCBS.version).toBe('1.1');
    expect(updatedBCBS.effectiveDate).toBe('2024-05-01');
    await auditPage.navigateToAuditLog();
    await auditPage.filterByEventType('Rule Set Updated');
    const auditEntries = await auditPage.getAuditEntries();
    const updateEntry = auditEntries.find(e => e.details.includes('BCBS') && e.details.includes('1.1'));
    expect(updateEntry).toBeTruthy();
  });

  test('QE-6000 TS-003 TC-001: Verify system displays validation error when mandatory fields are missing during rule set creation', async ({ page }) => {
    await adminPage.navigateToRuleSetManagement();
    await adminPage.clickCreateNewRuleSet();
    await adminPage.enterPayerName('Test Payer');
    await adminPage.saveRuleSet();
    await expect(adminPage.getErrorMessage()).toContainText('Payer ID and Name are required');
    const ruleSetList = await adminPage.getRuleSetList();
    const testPayer = ruleSetList.find(rs => rs.payerName === 'Test Payer');
    expect(testPayer).toBeFalsy();
    await adminPage.enterPayerID('TestPayer');
    await adminPage.saveRuleSet();
    await expect(adminPage.getSuccessMessage()).toContainText('created successfully');
  });
});

test.describe('Role-Based Access and Audit Logging - QE-6001', () => {
  let loginPage;
  let applicationPage;
  let dashboardPage;
  let adminPage;
  let auditPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    applicationPage = new ApplicationPage(page);
    dashboardPage = new DashboardPage(page);
    adminPage = new AdminPage(page);
    auditPage = new AuditPage(page);
  });

  test('QE-6001 TS-001 TC-001: Verify role-based access control restricts views and actions according to user role and logs all permitted actions', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('coordinator@example.com', 'Pass@123');
    await expect(dashboardPage.getNavigationMenu()).toContainText('Applications');
    await expect(dashboardPage.getNavigationMenu()).not.toContainText('Admin');
    await applicationPage.navigateToApplicationList();
    await applicationPage.openApplication('APP001');
    await applicationPage.uploadDocument('Medical License', 'Medical_License.pdf', '2026-12-31');
    await loginPage.logout();
    await loginPage.login('manager@example.com', 'Manager@123');
    await expect(dashboardPage.getNavigationMenu()).toContainText(['Applications', 'Dashboard']);
    await expect(dashboardPage.getNavigationMenu()).not.toContainText('Admin');
    await dashboardPage.navigateToDashboard();
    await dashboardPage.applyStatusFilter('Incomplete');
    await dashboardPage.exportToCSV();
    await loginPage.logout();
    await loginPage.login('admin@example.com', 'Admin@123');
    await expect(dashboardPage.getNavigationMenu()).toContainText(['Applications', 'Dashboard', 'Admin', 'Audit']);
    await adminPage.navigateToRuleSetManagement();
    await adminPage.clickCreateNewRuleSet();
    await auditPage.navigateToAuditLog();
    const auditEntries = await auditPage.getAuditEntries();
    const coordinatorEntry = auditEntries.find(e => e.eventType === 'Document Uploaded' && e.userId === 'coordinator@example.com');
    expect(coordinatorEntry).toBeTruthy();
    expect(coordinatorEntry.timestamp).toBeTruthy();
    expect(coordinatorEntry.applicationId).toBe('APP001');
    const managerEntry = auditEntries.find(e => e.eventType === 'Report Exported' && e.userId === 'manager@example.com');
    expect(managerEntry).toBeTruthy();
  });

  test('QE-6001 TS-001 TC-002: Verify audit log captures all user actions with complete metadata for compliance', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('coordinator@example.com', 'Pass@123');
    await applicationPage.openApplication('APP001');
    await applicationPage.uploadDocument('Medical License', 'Medical_License.pdf', '2026-12-31');
    await applicationPage.deleteDocument('Medical License');
    await loginPage.logout();
    await loginPage.login('admin@example.com', 'Admin@123');
    await auditPage.navigateToAuditLog();
    await auditPage.filterByUserId('coordinator@example.com');
    const auditEntries = await auditPage.getAuditEntries();
    const viewEntry = auditEntries.find(e => e.eventType === 'Application Viewed');
    expect(viewEntry).toBeTruthy();
    expect(viewEntry.userId).toBe('coordinator@example.com');
    expect(viewEntry.timestamp).toBeTruthy();
    expect(viewEntry.applicationId).toBe('APP001');
    const uploadEntry = auditEntries.find(e => e.eventType === 'Document Uploaded');
    expect(uploadEntry).toBeTruthy();
    expect(uploadEntry.details).toContain('Medical License');
    const deleteEntry = auditEntries.find(e => e.eventType === 'Document Deleted');
    expect(deleteEntry).toBeTruthy();
    const canEditAudit = await auditPage.checkIfAuditEntriesEditable();
    expect(canEditAudit).toBe(false);
  });

  test('QE-6001 TS-002 TC-001: Verify system denies access and logs unauthorized access attempts when a coordinator tries to access admin functions', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('coordinator@example.com', 'Pass@123');
    await expect(dashboardPage.getNavigationMenu()).not.toContainText('Admin');
    await expect(dashboardPage.getNavigationMenu()).not.toContainText('Audit');
    await page.goto('/admin');
    await expect(page.locator('.error-message, .alert-error')).toContainText('Access denied');
    await loginPage.logout();
    await loginPage.login('admin@example.com', 'Admin@123');
    await auditPage.navigateToAuditLog();
    await auditPage.filterByEventType('Unauthorized Access Attempt');
    const auditEntries = await auditPage.getAuditEntries();
    const unauthorizedEntry = auditEntries.find(e => e.userId === 'coordinator@example.com' && e.details.includes('/admin'));
    expect(unauthorizedEntry).toBeTruthy();
    expect(unauthorizedEntry.timestamp).toBeTruthy();
  });

  test('QE-6001 TS-003 TC-001: Verify system prevents modification or deletion of audit log entries and returns an error', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.login('admin@example.com', 'Admin@123');
    await auditPage.navigateToAuditLog();
    const auditEntries = await auditPage.getAuditEntries();
    expect(auditEntries.length).toBeGreaterThan(0);
    const hasEditButtons = await auditPage.checkForEditButtons();
    expect(hasEditButtons).toBe(false);
    const hasDeleteButtons = await auditPage.checkForDeleteButtons();
    expect(hasDeleteButtons).toBe(false);
    const firstEntry = auditEntries[0];
    const modifyResult = await auditPage.attemptToModifyAuditEntry(firstEntry.id);
    expect(modifyResult.success).toBe(false);
    expect(modifyResult.error).toContain('immutable');
    const deleteResult = await auditPage.attemptToDeleteAuditEntry(firstEntry.id);
    expect(deleteResult.success).toBe(false);
    expect(deleteResult.error).toContain('immutable');
    const verifyEntry = await auditPage.getAuditEntryById(firstEntry.id);
    expect(verifyEntry.timestamp).toBe(firstEntry.timestamp);
    expect(verifyEntry.userId).toBe(firstEntry.userId);
    expect(verifyEntry.eventType).toBe(firstEntry.eventType);
  });
});