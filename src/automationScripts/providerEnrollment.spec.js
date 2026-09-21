const { test, expect } = require('@playwright/test');
const { ProviderEnrollmentPage } = require('./pages/providerEnrollment.page');
const { LoginPage } = require('./pages/login.page');
const { WorkQueuePage } = require('./pages/workQueue.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('Provider Enrollment - QE-6067', () => {

  test('TC-3498: Create new enrollment application with all required documents', async ({ page }) => {
    logger.info('Starting test TC-3498: Create new enrollment application');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);

    // Step 1: Login as Credentialing Coordinator
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Step 1: Logged in successfully as Credentialing Coordinator');

    // Step 2: Navigate to create new enrollment application
    await enrollmentPage.navigateToNewEnrollment();
    await expect(enrollmentPage.applicationForm).toBeVisible();
    logger.info('Step 2: New application form displayed');

    // Step 3: Enter all required provider data fields
    await enrollmentPage.fillProviderData(
      'Dr. John Smith',
      '1234567890',
      'MD123456',
      'Cardiology',
      'jsmith@example.com'
    );
    await expect(enrollmentPage.validationErrorMessage).not.toBeVisible();
    logger.info('Step 3: Provider data entered successfully');

    // Step 4: Upload all required documents
    await enrollmentPage.uploadDocument('Medical_License.pdf', '12/31/2026');
    await enrollmentPage.uploadDocument('Malpractice_Insurance.pdf', '06/30/2026');
    await enrollmentPage.uploadDocument('DEA_Certificate.pdf', '03/15/2027');
    await enrollmentPage.uploadDocument('Board_Cert.pdf', '12/31/2025');
    await expect(enrollmentPage.documentUploadSuccess).toBeVisible();
    logger.info('Step 4: All documents uploaded successfully');

    // Step 5: Select target payers
    await enrollmentPage.selectPayers(['Medicare', 'Blue Cross Blue Shield', 'Aetna']);
    await expect(enrollmentPage.payerSelectionConfirmation).toBeVisible();
    logger.info('Step 5: Payers selected successfully');

    // Step 6: Save the application
    await enrollmentPage.saveApplication();
    await expect(enrollmentPage.saveConfirmationMessage).toBeVisible();
    logger.info('Step 6: Application saved successfully');

    // Step 7: Verify application readiness status
    const readyStatus = await enrollmentPage.getPayerReadinessStatus();
    expect(readyStatus).toContain('Ready to Submit');
    logger.info('Step 7: Application shows Ready to Submit status');

    // Step 8: Verify document-payer associations
    await enrollmentPage.viewApplicationDetails();
    const associations = await enrollmentPage.getDocumentPayerAssociations();
    expect(associations.length).toBeGreaterThan(0);
    logger.info('Step 8: Document-payer associations verified');
  });

  test('TC-3499: Update incomplete application and verify status recalculation', async ({ page }) => {
    logger.info('Starting test TC-3499: Update incomplete application');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);

    // Step 1: Login as Credentialing Coordinator
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: Logged in successfully');

    // Step 2: Navigate to existing incomplete application
    await enrollmentPage.navigateToApplication('APP-12345');
    await expect(enrollmentPage.applicationStatus).toHaveText(/Incomplete/);
    await expect(enrollmentPage.missingDocumentIndicator).toContainText('DEA Certificate');
    logger.info('Step 2: Incomplete application loaded with missing document identified');

    // Step 3: Upload the missing document
    await enrollmentPage.uploadDocument('DEA_Certificate.pdf', '08/20/2027');
    await expect(enrollmentPage.documentUploadSuccess).toBeVisible();
    logger.info('Step 3: Missing document uploaded successfully');

    // Step 4: Save the updated application
    await enrollmentPage.saveApplication();
    await expect(enrollmentPage.saveConfirmationMessage).toBeVisible();
    logger.info('Step 4: Application updated and saved');

    // Step 5: Verify status recalculation
    const updatedStatus = await enrollmentPage.getPayerStatus('Medicare');
    expect(updatedStatus).toBe('Ready to Submit');
    logger.info('Step 5: Status recalculated to Ready to Submit for Medicare');

    // Step 6: Check requirement detail view
    await enrollmentPage.viewRequirementDetails('Medicare');
    const docStatus = await enrollmentPage.getDocumentStatus('DEA Certificate');
    expect(docStatus).toBe('Present & Valid');
    logger.info('Step 6: Document shows Present & Valid with no deficiencies');
  });

  test('TC-3500: Upload document with expiration within 90-day threshold', async ({ page }) => {
    logger.info('Starting test TC-3500: Document expiring soon');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: Logged in successfully');

    // Step 2: Navigate to incomplete application
    await enrollmentPage.navigateToApplication('APP-12346');
    await expect(enrollmentPage.applicationStatus).toHaveText(/Incomplete/);
    logger.info('Step 2: Application loaded with Incomplete status');

    // Step 3: Upload document with near expiration (60 days from today)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 60);
    const formattedDate = expirationDate.toLocaleDateString('en-US');
    await enrollmentPage.uploadDocument('Malpractice_Insurance.pdf', formattedDate);
    logger.info('Step 3: Document with 60-day expiration uploaded');

    // Step 4: Save application
    await enrollmentPage.saveApplication();
    await expect(enrollmentPage.saveConfirmationMessage).toBeVisible();
    logger.info('Step 4: Application saved');

    // Step 5: Verify status recalculation to Expiring Soon
    const status = await enrollmentPage.getApplicationStatus();
    expect(status).toBe('Expiring Soon');
    logger.info('Step 5: Status updated to Expiring Soon');

    // Step 6: Check requirement detail view
    await enrollmentPage.viewRequirementDetails();
    const docStatus = await enrollmentPage.getDocumentStatusWithExpiration('Malpractice Insurance');
    expect(docStatus.status).toBe('Expiring Soon');
    expect(docStatus.expirationDate).toBeTruthy();
    logger.info('Step 6: Document shows Expiring Soon with expiration date');
  });

  test('TC-3501: Validation error when required fields are empty', async ({ page }) => {
    logger.info('Starting test TC-3501: Required field validation');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: Logged in successfully');

    // Step 2: Navigate to new enrollment
    await enrollmentPage.navigateToNewEnrollment();
    await expect(enrollmentPage.applicationForm).toBeVisible();
    logger.info('Step 2: Application form displayed');

    // Step 3: Enter partial data, leave required fields empty
    await enrollmentPage.fillProviderDataPartial('Dr. Jane Doe', '', '', 'Pediatrics');
    logger.info('Step 3: Partial data entered with empty required fields');

    // Step 4: Attempt to save
    await enrollmentPage.saveApplication();
    logger.info('Step 4: Save attempted');

    // Step 5: Verify validation errors
    await expect(enrollmentPage.validationErrorMessage).toBeVisible();
    const errors = await enrollmentPage.getValidationErrors();
    expect(errors).toContain('NPI is required');
    expect(errors).toContain('License Number is required');
    logger.info('Step 5: Validation errors displayed correctly');

    // Step 6: Verify data is retained
    const providerName = await enrollmentPage.getProviderNameValue();
    expect(providerName).toBe('Dr. Jane Doe');
    const specialty = await enrollmentPage.getSpecialtyValue();
    expect(specialty).toBe('Pediatrics');
    logger.info('Step 6: Previously entered data retained in form');
  });
});

test.describe('Deficiency Guidance - QE-6066', () => {

  test('TC-3502: Generate deficiency guidance with complete information', async ({ page }) => {
    logger.info('Starting test TC-3502: Deficiency guidance generation');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: Logged in successfully');

    // Step 2: Navigate to application with deficiencies
    await enrollmentPage.navigateToApplication('APP-12347');
    await expect(enrollmentPage.deficiencyIndicator).toBeVisible();
    logger.info('Step 2: Application with deficiencies loaded');

    // Step 3: Access deficiency guidance
    await enrollmentPage.generateDeficiencyGuidance();
    await expect(enrollmentPage.deficiencyGuidanceSection).toBeVisible();
    logger.info('Step 3: Deficiency guidance generated');

    // Step 4: Verify document names
    const deficiencies = await enrollmentPage.getDeficiencyList();
    expect(deficiencies).toContain('DEA Certificate');
    expect(deficiencies).toContain('Medical License');
    logger.info('Step 4: Document names included in guidance');

    // Step 5: Verify deadline information
    const deadlines = await enrollmentPage.getDeficiencyDeadlines();
    expect(deadlines.length).toBeGreaterThan(0);
    logger.info('Step 5: Deadline information present');

    // Step 6: Verify urgency levels
    const urgencyLevels = await enrollmentPage.getDeficiencyUrgencyLevels();
    expect(urgencyLevels).toContain('High');
    logger.info('Step 6: Urgency levels assigned');

    // Step 7: Verify actionable guidance text
    const guidanceText = await enrollmentPage.getDeficiencyGuidanceText();
    expect(guidanceText).toMatch(/Please submit.*by/i);
    logger.info('Step 7: Guidance text is actionable and professional');
  });

  test('TC-3503: Payer-specific deficiency guidance for multi-payer application', async ({ page }) => {
    logger.info('Starting test TC-3503: Multi-payer deficiency guidance');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: Logged in successfully');

    // Step 2: Navigate to multi-payer application
    await enrollmentPage.navigateToApplication('APP-12348');
    const payers = await enrollmentPage.getApplicationPayers();
    expect(payers).toContain('Medicare');
    expect(payers).toContain('Aetna');
    expect(payers).toContain('BCBS');
    logger.info('Step 2: Multi-payer application loaded');

    // Step 3: Access deficiency guidance
    await enrollmentPage.generateDeficiencyGuidance();
    await expect(enrollmentPage.deficiencyGuidanceSection).toBeVisible();
    logger.info('Step 3: Deficiency guidance with payer sections generated');

    // Step 4: Verify Medicare-specific deficiencies
    const medicareDeficiencies = await enrollmentPage.getPayerDeficiencies('Medicare');
    expect(medicareDeficiencies).toContain('DEA Certificate');
    logger.info('Step 4: Medicare deficiencies reflect Medicare requirements');

    // Step 5: Verify Aetna-specific deficiencies
    const aetnaDeficiencies = await enrollmentPage.getPayerDeficiencies('Aetna');
    expect(aetnaDeficiencies).toContain('DEA Certificate');
    expect(aetnaDeficiencies).toContain('Board Certification');
    logger.info('Step 5: Aetna deficiencies reflect Aetna requirements');

    // Step 6: Verify BCBS-specific deficiencies
    const bcbsDeficiencies = await enrollmentPage.getPayerDeficiencies('BCBS');
    expect(bcbsDeficiencies).toContain('Malpractice Insurance');
    const bcbsStatus = await enrollmentPage.getPayerDeficiencyStatus('BCBS', 'Malpractice Insurance');
    expect(bcbsStatus).toContain('Expiring');
    logger.info('Step 6: BCBS deficiencies reflect BCBS requirements');

    // Step 7: Verify clear separation
    const payerSections = await enrollmentPage.getDeficiencyPayerSections();
    expect(payerSections.length).toBe(3);
    logger.info('Step 7: Payer deficiencies clearly separated and labeled');
  });

  test('TC-3504: No false deficiencies for ready-to-submit application', async ({ page }) => {
    logger.info('Starting test TC-3504: Empty deficiency guidance');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: Logged in successfully');

    // Step 2: Navigate to ready application
    await enrollmentPage.navigateToApplication('APP-12349');
    await expect(enrollmentPage.applicationStatus).toHaveText(/Ready to Submit/);
    logger.info('Step 2: Ready to Submit application loaded');

    // Step 3: Generate deficiency guidance
    await enrollmentPage.generateDeficiencyGuidance();
    logger.info('Step 3: Deficiency guidance request processed');

    // Step 4: Verify empty deficiency list
    const deficiencies = await enrollmentPage.getDeficiencyList();
    expect(deficiencies.length).toBe(0);
    logger.info('Step 4: Deficiency list is empty');

    // Step 5: Verify no false deficiencies
    await expect(enrollmentPage.deficiencyItem).not.toBeVisible();
    logger.info('Step 5: No false deficiency items generated');

    // Step 6: Verify appropriate message
    await expect(enrollmentPage.noDeficienciesMessage).toBeVisible();
    const message = await enrollmentPage.noDeficienciesMessage.textContent();
    expect(message).toMatch(/No deficiencies|All requirements met/i);
    logger.info('Step 6: Appropriate no-deficiencies message displayed');
  });
});

test.describe('Work Queue Management - QE-6065', () => {

  test('TC-3505: Work queue sorted by priority score', async ({ page }) => {
    logger.info('Starting test TC-3505: Work queue priority sorting');
    const loginPage = new LoginPage(page);
    const workQueuePage = new WorkQueuePage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: Logged in successfully');

    // Step 2: Navigate to work queue
    await workQueuePage.navigate();
    await expect(workQueuePage.workQueueTable).toBeVisible();
    logger.info('Step 2: Work queue page displayed');

    // Step 3: Verify applications are displayed
    const applications = await workQueuePage.getApplicationList();
    expect(applications.length).toBeGreaterThan(0);
    logger.info('Step 3: Multiple applications visible in queue');

    // Step 4: Verify default sort by priority
    const sortedScores = await workQueuePage.getPriorityScores();
    const isDescending = sortedScores.every((score, index) => {
      return index === 0 || sortedScores[index - 1] >= score;
    });
    expect(isDescending).toBe(true);
    logger.info('Step 4: Applications sorted by priority score descending');

    // Step 5: Verify priority scores are visible
    const firstAppScore = await workQueuePage.getApplicationPriorityScore(0);
    expect(firstAppScore).toBeGreaterThan(0);
    logger.info('Step 5: Priority scores visible for each application');

    // Step 6: Verify most urgent at top
    const topPriorityScore = sortedScores[0];
    expect(topPriorityScore).toBeGreaterThanOrEqual(80);
    logger.info('Step 6: Most urgent applications at top of queue');
  });

  test('TC-3506: Multi-criteria filtering in work queue', async ({ page }) => {
    logger.info('Starting test TC-3506: Work queue multi-criteria filtering');
    const loginPage = new LoginPage(page);
    const workQueuePage = new WorkQueuePage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: Logged in successfully');

    // Step 2: Navigate to work queue
    await workQueuePage.navigate();
    const initialCount = await workQueuePage.getApplicationCount();
    expect(initialCount).toBe(50);
    logger.info('Step 2: Work queue loaded with 50 applications');

    // Step 3: Apply status filter
    await workQueuePage.filterByStatus('Incomplete');
    await workQueuePage.waitForFilterUpdate();
    logger.info('Step 3: Status filter applied');

    // Step 4: Apply payer filter
    await workQueuePage.filterByPayer('Medicare');
    await workQueuePage.waitForFilterUpdate();
    logger.info('Step 4: Payer filter applied');

    // Step 5: Apply priority filter
    await workQueuePage.filterByPriority('High');
    await workQueuePage.waitForFilterUpdate();
    logger.info('Step 5: Priority filter applied');

    // Step 6: Verify filtered results
    const filteredCount = await workQueuePage.getApplicationCount();
    expect(filteredCount).toBe(5);
    logger.info('Step 6: Queue displays only applications matching all criteria');

    // Step 7: Verify each application meets all criteria
    const applications = await workQueuePage.getApplicationList();
    for (const app of applications) {
      expect(app.status).toBe('Incomplete');
      expect(app.payers).toContain('Medicare');
      expect(app.priority).toBe('High');
    }
    logger.info('Step 7: All displayed applications meet filter criteria');
  });

  test('TC-3507: Empty work queue displays appropriate message', async ({ page }) => {
    logger.info('Starting test TC-3507: Empty work queue handling');
    const loginPage = new LoginPage(page);
    const workQueuePage = new WorkQueuePage(page);

    // Step 1: Login as coordinator with no assignments
    await loginPage.navigate();
    await loginPage.loginWithNoAssignments('Credentialing Coordinator');
    logger.info('Step 1: Logged in as coordinator with no assignments');

    // Step 2: Navigate to work queue
    await workQueuePage.navigate();
    logger.info('Step 2: Work queue page loaded');

    // Step 3: Verify empty queue
    const count = await workQueuePage.getApplicationCount();
    expect(count).toBe(0);
    logger.info('Step 3: Work queue is empty');

    // Step 4: Verify empty state message
    await expect(workQueuePage.emptyStateMessage).toBeVisible();
    const message = await workQueuePage.emptyStateMessage.textContent();
    expect(message).toMatch(/No applications|work queue is empty/i);
    logger.info('Step 4: Appropriate empty state message displayed');

    // Step 5: Verify no errors
    await expect(workQueuePage.errorMessage).not.toBeVisible();
    logger.info('Step 5: No system errors displayed');

    // Step 6: Verify navigation remains functional
    await workQueuePage.navigateToDashboard();
    await expect(page).toHaveURL(/dashboard/);
    logger.info('Step 6: Navigation remains functional');
  });
});

test.describe('Dashboard - QE-6064', () => {

  test('TC-3508: Dashboard displays aggregated metrics with drill-down', async ({ page }) => {
    logger.info('Starting test TC-3508: Dashboard aggregated metrics');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login as Enrollment Manager
    await loginPage.navigate();
    await loginPage.login('Enrollment Manager');
    logger.info('Step 1: Logged in as Enrollment Manager');

    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Step 2: Dashboard page displayed');

    // Step 3: Verify Ready to Submit count
    const readyCount = await dashboardPage.getStatusCount('Ready to Submit');
    expect(readyCount).toBe(15);
    logger.info('Step 3: Ready to Submit count displayed correctly');

    // Step 4: Verify Incomplete count
    const incompleteCount = await dashboardPage.getStatusCount('Incomplete');
    expect(incompleteCount).toBe(28);
    logger.info('Step 4: Incomplete count displayed correctly');

    // Step 5: Verify Expiring Soon count
    const expiringCount = await dashboardPage.getStatusCount('Expiring Soon');
    expect(expiringCount).toBe(12);
    logger.info('Step 5: Expiring Soon count displayed correctly');

    // Step 6: Verify coordinator drill-down
    await dashboardPage.drillDownByCoordinator('John Doe');
    const johnApps = await dashboardPage.getFilteredApplicationCount();
    expect(johnApps).toBe(10);
    await dashboardPage.clearFilters();
    logger.info('Step 6: Coordinator drill-down available');

    // Step 7: Verify payer drill-down
    await dashboardPage.drillDownByPayer('Medicare');
    const medicareApps = await dashboardPage.getFilteredApplicationCount();
    expect(medicareApps).toBe(20);
    await dashboardPage.clearFilters();
    logger.info('Step 7: Payer drill-down available');

    // Step 8: Click status category to drill down
    await dashboardPage.clickStatusCategory('Incomplete');
    await expect(page).toHaveURL(/.*applications.*status=Incomplete/);
    logger.info('Step 8: Status category drill-down navigates to detail view');
  });

  test('TC-3509: Dashboard drill-down shows per-payer status and expiration dates', async ({ page }) => {
    logger.info('Starting test TC-3509: Dashboard per-payer detail drill-down');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('Enrollment Manager');
    logger.info('Step 1: Logged in successfully');

    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    logger.info('Step 2: Dashboard displayed');

    // Step 3: Click Expiring Soon category
    await dashboardPage.clickStatusCategory('Expiring Soon');
    await expect(dashboardPage.detailViewContainer).toBeVisible();
    logger.info('Step 3: Drill-down detail view displayed');

    // Step 4: Verify list of applications
    const applications = await dashboardPage.getDetailViewApplications();
    expect(applications.length).toBe(12);
    logger.info('Step 4: All 12 Expiring Soon applications listed');

    // Step 5: Select individual application
    await dashboardPage.selectApplication('APP-12350');
    await expect(enrollmentPage.applicationDetailView).toBeVisible();
    logger.info('Step 5: Application detail page opened');

    // Step 6: Verify per-payer status breakdown
    const medicareStatus = await enrollmentPage.getPayerStatus('Medicare');
    expect(medicareStatus).toBe('Expiring Soon');
    const aetnaStatus = await enrollmentPage.getPayerStatus('Aetna');
    expect(aetnaStatus).toBe('Ready to Submit');
    const bcbsStatus = await enrollmentPage.getPayerStatus('BCBS');
    expect(bcbsStatus).toBe('Incomplete');
    logger.info('Step 6: Per-payer status breakdown displayed');

    // Step 7: Verify requirement-level expiration dates
    const medicareReqs = await enrollmentPage.getPayerRequirements('Medicare');
    expect(medicareReqs).toContainEqual({
      document: 'Medical License',
      expirationDate: '03/15/2025'
    });
    expect(medicareReqs).toContainEqual({
      document: 'DEA Certificate',
      expirationDate: '06/20/2025'
    });
    logger.info('Step 7: Requirement-level expiration dates displayed');

    // Step 8: Verify expiring documents identified
    const expiringDocs = await enrollmentPage.getExpiringDocuments();
    expect(expiringDocs.length).toBeGreaterThan(0);
    logger.info('Step 8: Expiring documents clearly identified');
  });

  test('TC-3510: Dashboard handles zero-count status categories gracefully', async ({ page }) => {
    logger.info('Starting test TC-3510: Dashboard zero-count handling');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('Enrollment Manager');
    logger.info('Step 1: Logged in successfully');

    // Step 2: Navigate to dashboard
    await dashboardPage.navigate();
    logger.info('Step 2: Dashboard displayed');

    // Step 3: Verify zero count displayed
    const readyCount = await dashboardPage.getStatusCount('Ready to Submit');
    expect(readyCount).toBe(0);
    logger.info('Step 3: Category shows count of 0');

    // Step 4: Verify no errors
    await expect(dashboardPage.errorMessage).not.toBeVisible();
    logger.info('Step 4: No system errors displayed');

    // Step 5: Verify complete rendering
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    const allCategories = await dashboardPage.getAllStatusCategories();
    expect(allCategories.length).toBeGreaterThan(0);
    logger.info('Step 5: Dashboard renders completely with all categories');

    // Step 6: Drill down into empty category
    await dashboardPage.clickStatusCategory('Ready to Submit');
    await expect(dashboardPage.emptyStateMessage).toBeVisible();
    const message = await dashboardPage.emptyStateMessage.textContent();
    expect(message).toMatch(/No applications in this category/i);
    logger.info('Step 6: Empty category drill-down shows appropriate message');
  });
});

test.describe('Evaluation Engine - QE-6063', () => {

  test('TC-3511: Evaluate complete application as Ready to Submit', async ({ page }) => {
    logger.info('Starting test TC-3511: Complete application evaluation');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);

    // Step 1: Login and access evaluation engine
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: System ready to evaluate applications');

    // Step 2: Select application with complete documentation
    await enrollmentPage.navigateToApplication('APP-12351');
    const docs = await enrollmentPage.getUploadedDocuments();
    expect(docs).toContain('Medical License');
    expect(docs).toContain('DEA Certificate');
    expect(docs).toContain('Malpractice Insurance');
    expect(docs).toContain('Board Certification');
    logger.info('Step 2: Application has complete documentation');

    // Step 3: Verify all data fields populated
    const providerData = await enrollmentPage.getProviderData();
    expect(providerData.name).toBe('Dr. Sarah Johnson');
    expect(providerData.npi).toBe('9876543210');
    expect(providerData.license).toBe('MD987654');
    expect(providerData.specialty).toBe('Internal Medicine');
    logger.info('Step 3: All mandatory fields contain valid data');

    // Step 4: Trigger evaluation
    await enrollmentPage.triggerEvaluation('Medicare');
    await expect(enrollmentPage.evaluationCompleteIndicator).toBeVisible();
    logger.info('Step 4: Evaluation executed successfully');

    // Step 5: Verify Ready to Submit status
    const status = await enrollmentPage.getPayerStatus('Medicare');
    expect(status).toBe('Ready to Submit');
    logger.info('Step 5: Application status set to Ready to Submit');

    // Step 6: Verify all requirements Present & Valid
    await enrollmentPage.viewRequirementDetails('Medicare');
    const reqStatuses = await enrollmentPage.getAllRequirementStatuses();
    const allValid = reqStatuses.every(status => status === 'Present & Valid');
    expect(allValid).toBe(true);
    logger.info('Step 6: All requirements show Present & Valid');

    // Step 7: Verify no expiration warnings
    const warnings = await enrollmentPage.getExpirationWarnings();
    expect(warnings.length).toBe(0);
    logger.info('Step 7: No expiration warnings present');
  });

  test('TC-3512: Evaluate incomplete application with missing documents', async ({ page }) => {
    logger.info('Starting test TC-3512: Incomplete application evaluation');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: System ready to evaluate');

    // Step 2: Select incomplete application
    await enrollmentPage.navigateToApplication('APP-12352');
    const docs = await enrollmentPage.getUploadedDocuments();
    expect(docs).toContain('Medical License');
    expect(docs).toContain('Malpractice Insurance');
    expect(docs).not.toContain('DEA Certificate');
    expect(docs).not.toContain('Board Certification');
    logger.info('Step 2: Application is incomplete');

    // Step 3: Verify data fields populated
    const providerData = await enrollmentPage.getProviderData();
    expect(providerData.name).toBe('Dr. Michael Chen');
    expect(providerData.npi).toBe('5555555555');
    logger.info('Step 3: Data fields contain valid data');

    // Step 4: Trigger evaluation
    await enrollmentPage.triggerEvaluation('Aetna');
    await expect(enrollmentPage.evaluationCompleteIndicator).toBeVisible();
    logger.info('Step 4: Evaluation executed successfully');

    // Step 5: Verify Incomplete status
    const status = await enrollmentPage.getPayerStatus('Aetna');
    expect(status).toBe('Incomplete');
    logger.info('Step 5: Application status set to Incomplete');

    // Step 6: Verify missing documents identified
    const missingDocs = await enrollmentPage.getMissingDocuments('Aetna');
    expect(missingDocs).toContain('DEA Certificate');
    expect(missingDocs).toContain('Board Certification');
    logger.info('Step 6: Missing documents identified in evaluation results');

    // Step 7: Verify present documents show valid status
    const licenseStatus = await enrollmentPage.getDocumentStatus('Medical License');
    expect(licenseStatus).toBe('Present & Valid');
    const malpracticeStatus = await enrollmentPage.getDocumentStatus('Malpractice Insurance');
    expect(malpracticeStatus).toBe('Present & Valid');
    logger.info('Step 7: Present documents show Present & Valid status');
  });

  test('TC-3513: Evaluate application using historical rule set version', async ({ page }) => {
    logger.info('Starting test TC-3513: Historical rule set evaluation');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);

    // Step 1: Access rule set management
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    await enrollmentPage.navigateToRuleSetManagement();
    logger.info('Step 1: Rule set management system accessed');

    // Step 2: Verify multiple versions exist
    const versions = await enrollmentPage.getRuleSetVersions('Blue Cross Blue Shield');
    expect(versions).toContainEqual({
      version: '1.5',
      effectiveUntil: '12/31/2025'
    });
    expect(versions).toContainEqual({
      version: '2.0',
      effectiveFrom: '01/01/2026'
    });
    logger.info('Step 2: Multiple versions with effective dates verified');

    // Step 3: Select historical application
    await enrollmentPage.navigateToApplication('APP-12353');
    const submissionDate = await enrollmentPage.getSubmissionDate();
    expect(submissionDate).toBe('11/15/2025');
    logger.info('Step 3: Historical application selected');

    // Step 4: Trigger evaluation
    await enrollmentPage.triggerEvaluation('Blue Cross Blue Shield');
    logger.info('Step 4: Evaluation triggered');

    // Step 5: Verify correct version selected
    const usedVersion = await enrollmentPage.getEvaluationRuleSetVersion();
    expect(usedVersion).toBe('1.5');
    logger.info('Step 5: System used Version 1.5 effective on submission date');

    // Step 6: Verify evaluation based on historical rules
    const requirements = await enrollmentPage.getEvaluationRequirements();
    expect(requirements).toContain('License');
    expect(requirements).toContain('Malpractice');
    expect(requirements).toContain('DEA');
    expect(requirements).not.toContain('Board Certification');
    logger.info('Step 6: Evaluation based on Version 1.5 requirements');

    // Step 7: Verify version recorded in results
    const metadata = await enrollmentPage.getEvaluationMetadata();
    expect(metadata).toContain('Version 1.5');
    logger.info('Step 7: Rule set version recorded in evaluation metadata');
  });
});

test.describe('Priority Scoring - QE-6062', () => {

  test('TC-3514: Priority score calculation based on expiration and payer volume', async ({ page }) => {
    logger.info('Starting test TC-3514: Priority score calculation');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);
    const workQueuePage = new WorkQueuePage(page);

    // Step 1: Access priority scoring engine
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: System ready to calculate priority scores');

    // Step 2: Select high-priority application
    await enrollmentPage.navigateToApplication('APP-12354');
    const payer = await enrollmentPage.getApplicationPayer();
    expect(payer).toBe('Medicare');
    const expiration = await enrollmentPage.getDocumentExpirationDays('Medical License');
    expect(expiration).toBe(10);
    logger.info('Step 2: High-priority application selected');

    // Step 3: Trigger priority calculation
    await enrollmentPage.calculatePriorityScore();
    logger.info('Step 3: Priority score calculated');

    // Step 4: Verify high priority score
    const highScore = await enrollmentPage.getPriorityScore();
    expect(highScore).toBe(95);
    logger.info('Step 4: High priority score assigned (95)');

    // Step 5: Select lower-priority application
    await enrollmentPage.navigateToApplication('APP-12355');
    const lowVolumePayer = await enrollmentPage.getApplicationPayer();
    expect(lowVolumePayer).toBe('Regional HMO');
    const longerExpiration = await enrollmentPage.getDocumentExpirationDays('DEA Certificate');
    expect(longerExpiration).toBe(60);
    logger.info('Step 5: Lower-priority application selected');

    // Step 6: Trigger priority calculation
    await enrollmentPage.calculatePriorityScore();
    logger.info('Step 6: Priority score calculated');

    // Step 7: Verify lower priority score
    const lowScore = await enrollmentPage.getPriorityScore();
    expect(lowScore).toBe(45);
    logger.info('Step 7: Lower priority score assigned (45)');

    // Step 8: Verify work queue sorting
    await workQueuePage.navigate();
    const queueOrder = await workQueuePage.getApplicationOrder();
    const highIndex = queueOrder.indexOf('APP-12354');
    const lowIndex = queueOrder.indexOf('APP-12355');
    expect(highIndex).toBeLessThan(lowIndex);
    logger.info('Step 8: Work queue sorted by priority score');
  });

  test('TC-3515: Composite priority score for multi-payer application with dynamic recalculation', async ({ page }) => {
    logger.info('Starting test TC-3515: Composite priority score');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);
    const workQueuePage = new WorkQueuePage(page);

    // Step 1: Access scoring engine
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: System ready to calculate scores');

    // Step 2: Select multi-payer application
    await enrollmentPage.navigateToApplication('APP-12356');
    const payers = await enrollmentPage.getApplicationPayers();
    expect(payers).toContain('Medicare');
    expect(payers).toContain('Aetna');
    expect(payers).toContain('BCBS');
    const medicareExpiration = await enrollmentPage.getPayerExpirationDays('Medicare');
    expect(medicareExpiration).toBe(8);
    logger.info('Step 2: Multi-payer application with varying risk levels');

    // Step 3: Trigger composite score calculation
    await enrollmentPage.calculatePriorityScore();
    logger.info('Step 3: Composite score calculated');

    // Step 4: Verify composite score reflects highest risk
    const initialScore = await enrollmentPage.getPriorityScore();
    expect(initialScore).toBe(98);
    logger.info('Step 4: Composite score based on highest-risk payer (98)');

    // Step 5: Update high-risk payer document
    await enrollmentPage.uploadDocumentForPayer('Medicare', 'Medical_License.pdf', '2 years');
    await expect(enrollmentPage.documentUploadSuccess).toBeVisible();
    logger.info('Step 5: New document uploaded for Medicare');

    // Step 6: Trigger recalculation
    await enrollmentPage.calculatePriorityScore();
    logger.info('Step 6: Priority score recalculated');

    // Step 7: Verify updated composite score
    const updatedScore = await enrollmentPage.getPriorityScore();
    expect(updatedScore).toBe(55);
    logger.info('Step 7: Composite score updated to reflect new highest risk (55)');

    // Step 8: Verify work queue position updated
    await workQueuePage.navigate();
    const position = await workQueuePage.getApplicationPosition('APP-12356');
    expect(position).toBeGreaterThan(5);
    logger.info('Step 8: Work queue position adjusted for lower urgency');
  });

  test('TC-3516: Priority score with incomplete payer rule set data', async ({ page }) => {
    logger.info('Starting test TC-3516: Priority score with incomplete rule set');
    const loginPage = new LoginPage(page);
    const enrollmentPage = new ProviderEnrollmentPage(page);
    const workQueuePage = new WorkQueuePage(page);

    // Step 1: Access scoring engine
    await loginPage.navigate();
    await loginPage.login('Credentialing Coordinator');
    logger.info('Step 1: System ready to calculate scores');

    // Step 2: Select application with incomplete payer data
    await enrollmentPage.navigateToApplication('APP-12357');
    const payer = await enrollmentPage.getApplicationPayer();
    expect(payer).toBe('New Regional Payer');
    logger.info('Step 2: Application with incomplete payer configuration');

    // Step 3: Trigger priority calculation
    await enrollmentPage.calculatePriorityScore();
    logger.info('Step 3: Priority calculation executed');

    // Step 4: Verify no errors
    await expect(enrollmentPage.errorMessage).not.toBeVisible();
    logger.info('Step 4: No system errors during calculation');

    // Step 5: Verify default score assigned
    const score = await enrollmentPage.getPriorityScore();
    expect(score).toBe(50);
    logger.info('Step 5: Default priority score assigned (50)');

    // Step 6: Verify application in work queue
    await workQueuePage.navigate();
    const applications = await workQueuePage.getApplicationList();
    const app = applications.find(a => a.id === 'APP-12357');
    expect(app).toBeDefined();
    expect(app.priorityScore).toBe(50);
    logger.info('Step 6: Application visible in work queue with default score');

    // Step 7: Verify notification logged
    await enrollmentPage.navigateToSystemLogs();
    const logs = await enrollmentPage.getRecentLogs();
    const incompleteRuleSetLog = logs.find(log => 
      log.includes('New Regional Payer') && log.includes('incomplete')
    );
    expect(incompleteRuleSetLog).toBeDefined();
    logger.info('Step 7: System logged incomplete rule set notification');
  });
});