const { test, expect } = require('@playwright/test');
const { ApplicationListPage } = require('./pages/applicationList.page');
const { ApplicationDetailPage } = require('./pages/applicationDetail.page');
const { RuleSetManagementPage } = require('./pages/ruleSetManagement.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');

// Test Case: QE-6026 TS-001 TC-001
test('Verify authorized user can view applications list with correct readiness statuses', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationListPage = new ApplicationListPage(page);

  // Step 1: Launch the provider enrollment work management application
  await loginPage.navigate('http://localhost:4200');
  await expect(page).toHaveURL(/localhost:4200/);

  // Step 2: Enter valid user credentials with access to applications list view
  await loginPage.enterUsername('coordinator@system.com');
  await loginPage.enterPassword('ValidPass123!');

  // Step 3: Click Login button
  await loginPage.clickLoginButton();
  await expect(page).toHaveURL(/dashboard/);

  // Step 4: Navigate to Applications menu and click on Applications List View
  await applicationListPage.navigateToApplicationsList();
  await expect(page).toHaveURL(/\/applications/);

  // Step 5: Verify all active provider enrollment applications are displayed
  await expect(applicationListPage.applicationCards).toBeVisible();
  await applicationListPage.verifyApplicationExists('APP-001');
  await applicationListPage.verifyApplicationExists('APP-002');
  await applicationListPage.verifyApplicationExists('APP-003');

  // Step 6: Verify each application displays its readiness status bucket
  await applicationListPage.verifyApplicationStatus('APP-001', 'Expiring Soon');
  await applicationListPage.verifyApplicationStatus('APP-002', 'Incomplete');
  await applicationListPage.verifyApplicationStatus('APP-003', 'Ready to Submit');

  // Step 7: Verify each application displays its overall application status
  await applicationListPage.verifyOverallStatus('APP-001', 'Expiring Soon');
  await applicationListPage.verifyOverallStatus('APP-002', 'Incomplete');
  await applicationListPage.verifyOverallStatus('APP-003', 'Ready to Submit');
});

// Test Case: QE-6026 TS-002 TC-001
test('Verify unauthorized user cannot access applications list view', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Step 1: Launch the provider enrollment work management application
  await loginPage.navigate('http://localhost:4200');
  await expect(page).toHaveURL(/localhost:4200/);

  // Step 2: Enter invalid or no authorization credentials
  await loginPage.enterUsername('unauthorized@test.com');
  await loginPage.enterPassword('InvalidPass');

  // Step 3: Click Login button
  await loginPage.clickLoginButton();

  // Step 4: Verify user cannot access applications list view
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(page).toHaveURL(/login/);

  // Step 5: Attempt to directly navigate to applications list URL without authentication
  await page.goto('http://localhost:4200/applications');
  await expect(page).toHaveURL(/login/);
});

// Test Case: QE-6026 TS-003 TC-001
test('Verify applications list displays multiple applications with different readiness statuses accurately', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationListPage = new ApplicationListPage(page);

  // Step 1: Launch the provider enrollment work management application and login with valid credentials
  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('coordinator@system.com', 'ValidPass123!');
  await expect(page).toHaveURL(/dashboard/);

  // Step 2: Navigate to Applications List View
  await applicationListPage.navigateToApplicationsList();
  await expect(page).toHaveURL(/\/applications/);

  // Step 3: Verify application APP-001 with status 'Expiring Soon' is displayed
  await applicationListPage.verifyApplicationWithProvider('APP-001', 'Dr. Sarah Johnson');
  await applicationListPage.verifyApplicationStatus('APP-001', 'Expiring Soon');
  await applicationListPage.verifyPayerStatus('APP-001', 'Blue Cross Blue Shield', 'Expiring Soon');
  await applicationListPage.verifyPayerStatus('APP-001', 'Aetna', 'Ready to Submit');

  // Step 4: Verify application APP-002 with status 'Incomplete' is displayed
  await applicationListPage.verifyApplicationWithProvider('APP-002', 'Dr. Michael Rodriguez');
  await applicationListPage.verifyApplicationStatus('APP-002', 'Incomplete');
  await applicationListPage.verifyPayerStatus('APP-002', 'UnitedHealthcare', 'Incomplete');

  // Step 5: Verify application APP-003 with status 'Ready to Submit' is displayed
  await applicationListPage.verifyApplicationWithProvider('APP-003', 'Dr. Lisa Thompson');
  await applicationListPage.verifyApplicationStatus('APP-003', 'Ready to Submit');
  await applicationListPage.verifyPayerStatus('APP-003', 'Blue Cross Blue Shield', 'Ready to Submit');
  await applicationListPage.verifyPayerStatus('APP-003', 'Cigna', 'Ready to Submit');

  // Step 6: Verify overall application status reflects worst-case payer status for each application
  await applicationListPage.verifyOverallStatus('APP-001', 'Expiring Soon');
  await applicationListPage.verifyOverallStatus('APP-002', 'Incomplete');
  await applicationListPage.verifyOverallStatus('APP-003', 'Ready to Submit');
});

// Test Case: QE-6027 TS-001 TC-001
test('Verify applications list can be sorted by priority score in descending order', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationListPage = new ApplicationListPage(page);

  // Step 1: Launch the provider enrollment work management application and login with valid credentials
  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('manager@system.com', 'ValidPass123!');
  await expect(page).toHaveURL(/dashboard/);

  // Step 2: Navigate to Applications List View
  await applicationListPage.navigateToApplicationsList();
  await expect(page).toHaveURL(/\/applications/);

  // Step 3: Locate the sort dropdown or control and select 'Sort by Priority Score'
  await applicationListPage.selectSortOption('priority');

  // Step 4: Verify the applications list is reordered with highest priority score at the top
  const sortedOrder = await applicationListPage.getApplicationOrder();
  expect(sortedOrder[0]).toBe('APP-002');
  expect(sortedOrder[1]).toBe('APP-001');
  expect(sortedOrder[2]).toBe('APP-003');

  // Step 5: Verify priority scores are displayed correctly for each application
  await applicationListPage.verifyPriorityScore('APP-002', '92');
  await applicationListPage.verifyPriorityScore('APP-001', '85');
  await applicationListPage.verifyPriorityScore('APP-003', '45');
});

// Test Case: QE-6027 TS-002 TC-001
test('Verify applications list can be sorted by risk score in descending order', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationListPage = new ApplicationListPage(page);

  // Step 1: Launch the provider enrollment work management application and login with valid credentials
  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('manager@system.com', 'ValidPass123!');
  await expect(page).toHaveURL(/dashboard/);

  // Step 2: Navigate to Applications List View
  await applicationListPage.navigateToApplicationsList();
  await expect(page).toHaveURL(/\/applications/);

  // Step 3: Locate the sort dropdown or control and select 'Sort by Risk Score'
  await applicationListPage.selectSortOption('risk');

  // Step 4: Verify the applications list is reordered with highest risk score at the top
  const sortedOrder = await applicationListPage.getApplicationOrder();
  expect(sortedOrder[0]).toBe('APP-002');
  expect(sortedOrder[1]).toBe('APP-001');
  expect(sortedOrder[2]).toBe('APP-003');

  // Step 5: Verify risk scores are displayed correctly for each application
  await applicationListPage.verifyRiskScore('APP-002', '88');
  await applicationListPage.verifyRiskScore('APP-001', '78');
  await applicationListPage.verifyRiskScore('APP-003', '35');
});

// Test Case: QE-6027 TS-003 TC-001
test('Verify sorting behavior when no applications exist in the system', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationListPage = new ApplicationListPage(page);

  // Step 1: Launch the provider enrollment work management application and login with valid credentials
  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('manager@system.com', 'ValidPass123!');
  await expect(page).toHaveURL(/dashboard/);

  // Step 2: Navigate to Applications List View when no applications exist in the system
  await applicationListPage.navigateToApplicationsList();
  await expect(page).toHaveURL(/\/applications/);

  // Step 3: Attempt to select 'Sort by Priority Score' from the sort dropdown
  await applicationListPage.selectSortOption('priority');

  // Step 4: Verify the system returns an empty list without errors
  await expect(applicationListPage.applicationCards).not.toBeVisible();

  // Step 5: Verify an appropriate no-data message is displayed
  await expect(applicationListPage.noDataMessage).toBeVisible();
  await expect(applicationListPage.noDataMessage).toContainText('No applications found');
});

// Test Case: QE-6028 TS-001 TC-001
test('Verify authorized admin can create a new payer rule set successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const ruleSetPage = new RuleSetManagementPage(page);

  // Step 1: Launch the provider enrollment work management application and login with admin credentials
  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('admin@system.com', 'AdminPass123!');
  await expect(page).toHaveURL(/dashboard/);

  // Step 2: Navigate to Rule Sets menu and access the Rule Set Management interface
  await ruleSetPage.navigateToRuleSets();
  await expect(page).toHaveURL(/\/rule-sets/);

  // Step 3: Click on 'Create New Rule Set' button
  await ruleSetPage.clickCreateNewRuleSet();

  // Step 4: Enter payer information: Payer ID and Payer Name
  await ruleSetPage.enterPayerId('PAY-005');
  await ruleSetPage.enterPayerName('Humana');

  // Step 5: Add required document types: Medical License, DEA Certificate
  await ruleSetPage.addRequiredDocument('Medical License', true, true);
  await ruleSetPage.addRequiredDocument('DEA Certificate', true, true);

  // Step 6: Add required data fields: NPI Number, Tax ID
  await ruleSetPage.addRequiredDataField('NPI Number', 'string', true, '10-digit numeric');
  await ruleSetPage.addRequiredDataField('Tax ID', 'string', true, '9-digit numeric');

  // Step 7: Set effective date and version
  await ruleSetPage.setEffectiveDate('2024-03-01');
  await ruleSetPage.setVersion('1.0');

  // Step 8: Click Save button to create the rule set
  await ruleSetPage.clickSaveButton();
  await expect(ruleSetPage.successMessage).toBeVisible();

  // Step 9: Verify the new rule set appears in the central library
  await ruleSetPage.verifyRuleSetExists('PAY-005', 'Humana', '1.0');

  // Step 10: Verify the rule set is available for the readiness engine to use
  await ruleSetPage.verifyRuleSetStatus('PAY-005', 'Active');
});

// Test Case: QE-6028 TS-002 TC-001
test('Verify unauthorized user cannot create or update payer rule sets', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const ruleSetPage = new RuleSetManagementPage(page);

  // Step 1: Launch the provider enrollment work management application and login with non-admin credentials
  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('coordinator@system.com', 'ValidPass123!');

  // Step 2: Attempt to navigate to Rule Set Management interface
  await page.goto('http://localhost:4200/rule-sets');

  // Step 3: If accessible, attempt to click 'Create New Rule Set' button
  const createButton = page.locator('button:has-text("Create New Rule Set")');
  if (await createButton.isVisible()) {
    await createButton.click();
    await expect(ruleSetPage.authorizationError).toBeVisible();
  }

  // Step 4: Attempt to directly access rule set creation API endpoint without admin credentials
  const response = await page.request.post('http://localhost:5000/api/rulesets', {
    data: {
      payerId: 'PAY-TEST',
      payerName: 'Test Payer'
    }
  });
  expect(response.status()).toBeGreaterThanOrEqual(401);

  // Step 5: Verify no changes are made to the rule library
  await ruleSetPage.navigateToRuleSets();
  await ruleSetPage.verifyRuleSetNotExists('PAY-TEST');
});

// Test Case: QE-6028 TS-003 TC-001
test('Verify authorized admin can update existing payer rule set with versioning', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const ruleSetPage = new RuleSetManagementPage(page);

  // Step 1: Launch the provider enrollment work management application and login with admin credentials
  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('admin@system.com', 'AdminPass123!');
  await expect(page).toHaveURL(/dashboard/);

  // Step 2: Navigate to Rule Sets and select an existing rule set to update
  await ruleSetPage.navigateToRuleSets();
  await ruleSetPage.selectRuleSet('PAY-001', '1.2');

  // Step 3: Click Edit button to modify the rule set
  await ruleSetPage.clickEditButton();

  // Step 4: Add new required document: Board Certification
  await ruleSetPage.addRequiredDocument('Board Certification', true, true);

  // Step 5: Add new required data field: Specialty
  await ruleSetPage.addRequiredDataField('Specialty', 'string', true, '');

  // Step 6: Set new version number and effective date for the updated rule set
  await ruleSetPage.setVersion('1.3');
  await ruleSetPage.setEffectiveDate('2024-04-01');

  // Step 7: Click Save button to update the rule set
  await ruleSetPage.clickSaveButton();
  await expect(ruleSetPage.successMessage).toBeVisible();

  // Step 8: Verify the new version v1.3 appears in the rule sets list
  await ruleSetPage.verifyRuleSetExists('PAY-001', 'Blue Cross Blue Shield', '1.3');
  await ruleSetPage.verifyRuleSetEffectiveDate('PAY-001', '1.3', '2024-04-01');

  // Step 9: Verify the historical version v1.2 is preserved for auditing
  await ruleSetPage.verifyRuleSetExists('PAY-001', 'Blue Cross Blue Shield', '1.2');
  await ruleSetPage.verifyRuleSetEndDate('PAY-001', '1.2', '2024-03-31');
});

// Test Case: QE-6029 TS-001 TC-001
test('Verify readiness engine selects correct rule set version based on submission date', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationDetailPage = new ApplicationDetailPage(page);

  // Step 1: Prepare test data: Create payer PAY-001 with multiple rule set versions
  // Assumption: Test data is pre-configured with PAY-001 v1.0 (2023-01-01) and v1.2 (2024-01-01)

  // Step 2: Create a provider enrollment application with submission date January 15, 2024
  // Assumption: APP-TEST-001 is pre-created with submission date 2024-01-15

  // Step 3: Trigger readiness evaluation for the application
  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('coordinator@system.com', 'ValidPass123!');
  
  const response = await page.request.post('http://localhost:5000/api/readiness/evaluate', {
    data: { applicationId: 'APP-TEST-001' }
  });
  expect(response.ok()).toBeTruthy();

  // Step 4: Verify the readiness engine queries for effective rule set version covering January 15, 2024
  // Step 5: Verify the engine selects and applies rule set version 1.2
  const evaluationData = await response.json();
  
  // Step 6: Verify evaluation results display the correct rule set version used
  await applicationDetailPage.navigateToApplication('APP-TEST-001');
  await applicationDetailPage.verifyRuleSetVersion('PAY-001', '1.2');
});

// Test Case: QE-6029 TS-002 TC-001
test('Verify system returns error when no active rule set version covers submission date', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Step 1: Prepare test data: Create payer PAY-006 with rule set version effective only from 2024-06-01 onwards
  // Assumption: PAY-006 v1.0 effective 2024-06-01 is pre-configured

  // Step 2: Create a provider enrollment application with submission date March 15, 2024
  // Assumption: APP-TEST-002 is pre-created with submission date 2024-03-15 and payer PAY-006

  // Step 3: Trigger readiness evaluation for the application
  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('coordinator@system.com', 'ValidPass123!');
  
  const response = await page.request.post('http://localhost:5000/api/readiness/evaluate', {
    data: { applicationId: 'APP-TEST-002' }
  });

  // Step 4: Verify the readiness engine queries for effective rule set version covering March 15, 2024
  // Step 5: Verify the system returns a validation error
  expect(response.status()).toBe(404);
  const errorData = await response.json();
  expect(errorData.message).toContain('No applicable rule set');
  expect(errorData.message).toContain('PAY-006');

  // Step 6: Verify no readiness status is assigned to the application
  expect(errorData.overallStatus).toBeUndefined();
});

// Test Case: QE-6029 TS-003 TC-001
test('Verify different rule set versions are applied to applications with different submission dates', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationDetailPage = new ApplicationDetailPage(page);

  // Step 1: Prepare test data: Create payer PAY-002 with version 1.0 and version 2.0
  // Assumption: PAY-002 v1.0 (2023-01-01 to 2023-12-31) and v2.0 (2024-01-01) are pre-configured

  // Step 2: Create first application with submission date in 2023
  // Assumption: APP-2023-001 with submission date 2023-06-15 is pre-created

  // Step 3: Create second application with submission date in 2024
  // Assumption: APP-2024-001 with submission date 2024-02-20 is pre-created

  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('coordinator@system.com', 'ValidPass123!');

  // Step 4: Trigger readiness evaluation for the 2023 application
  const response2023 = await page.request.post('http://localhost:5000/api/readiness/evaluate', {
    data: { applicationId: 'APP-2023-001' }
  });
  expect(response2023.ok()).toBeTruthy();

  // Step 5: Verify the engine applies rule set version 1.0 to the 2023 application
  await applicationDetailPage.navigateToApplication('APP-2023-001');
  await applicationDetailPage.verifyRuleSetVersion('PAY-002', '1.0');

  // Step 6: Trigger readiness evaluation for the 2024 application
  const response2024 = await page.request.post('http://localhost:5000/api/readiness/evaluate', {
    data: { applicationId: 'APP-2024-001' }
  });
  expect(response2024.ok()).toBeTruthy();

  // Step 7: Verify the engine applies rule set version 2.0 to the 2024 application
  await applicationDetailPage.navigateToApplication('APP-2024-001');
  await applicationDetailPage.verifyRuleSetVersion('PAY-002', '2.0');

  // Step 8: Compare evaluation results to confirm different versions were applied
  const eval2023 = await response2023.json();
  const eval2024 = await response2024.json();
  expect(eval2023.payerEvaluations[0].ruleSetVersion).toBe('1.0');
  expect(eval2024.payerEvaluations[0].ruleSetVersion).toBe('2.0');
});

// Test Case: QE-6030 TS-001 TC-001
test('Verify readiness engine evaluates application with three payers and assigns correct statuses', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationDetailPage = new ApplicationDetailPage(page);

  // Step 1: Create a provider enrollment application with three associated payers
  // Assumption: APP-MULTI-001 with three payers is pre-created

  // Step 2: Set up test data
  // Assumption: PAY-001 all valid, PAY-002 missing Hospital Privileges, PAY-003 Medical License expiring in 30 days

  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('coordinator@system.com', 'ValidPass123!');

  // Step 3: Submit the application to the readiness engine for evaluation
  const response = await page.request.post('http://localhost:5000/api/readiness/evaluate', {
    data: { applicationId: 'APP-MULTI-001' }
  });
  expect(response.ok()).toBeTruthy();
  const evaluationData = await response.json();

  // Step 4: Verify the engine evaluates the application against PAY-001 rule set
  const payer1Eval = evaluationData.payerEvaluations.find(p => p.payerId === 'PAY-001');
  expect(payer1Eval.status).toBe('Ready to Submit');

  // Step 5: Verify the engine evaluates the application against PAY-002 rule set
  const payer2Eval = evaluationData.payerEvaluations.find(p => p.payerId === 'PAY-002');
  expect(payer2Eval.status).toBe('Incomplete');

  // Step 6: Verify the engine evaluates the application against PAY-003 rule set
  const payer3Eval = evaluationData.payerEvaluations.find(p => p.payerId === 'PAY-003');
  expect(payer3Eval.status).toBe('Expiring Soon');

  // Step 7: Verify the engine calculates the overall application status based on worst-case payer status
  expect(evaluationData.overallStatus).toBe('Expiring Soon');

  // Step 8: Verify evaluation results include all three payer evaluations with correct statuses
  expect(evaluationData.payerEvaluations).toHaveLength(3);
  await applicationDetailPage.navigateToApplication('APP-MULTI-001');
  await applicationDetailPage.verifyPayerStatus('PAY-001', 'Ready to Submit');
  await applicationDetailPage.verifyPayerStatus('PAY-002', 'Incomplete');
  await applicationDetailPage.verifyPayerStatus('PAY-003', 'Expiring Soon');
});

// Test Case: QE-6030 TS-002 TC-001
test('Verify readiness engine returns error for application with invalid payer ID', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Step 1: Create a provider enrollment application with an invalid or non-existent payer ID
  // Assumption: APP-INVALID-001 with payer PAY-999 is pre-created

  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('coordinator@system.com', 'ValidPass123!');

  // Step 2: Submit the application to the readiness engine for evaluation
  const response = await page.request.post('http://localhost:5000/api/readiness/evaluate', {
    data: { applicationId: 'APP-INVALID-001' }
  });

  // Step 3: Verify the engine attempts to retrieve rule set for payer PAY-999
  // Step 4: Verify the readiness engine returns a validation error
  expect(response.status()).toBeGreaterThanOrEqual(404);
  const errorData = await response.json();
  expect(errorData.message).toContain('Payer rule set cannot be found');
  expect(errorData.message).toContain('PAY-999');

  // Step 5: Verify no readiness status is assigned to the application
  expect(errorData.overallStatus).toBeUndefined();

  // Step 6: Verify the error response includes details about the missing payer rule set
  expect(errorData.payerId).toBe('PAY-999');
});

// Test Case: QE-6030 TS-003 TC-001
test('Verify readiness engine correctly assigns statuses to application with two payers having different requirement states', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationDetailPage = new ApplicationDetailPage(page);

  // Step 1: Create a provider enrollment application with two associated payers
  // Assumption: APP-TWO-PAYER-001 with PAY-001 and PAY-003 is pre-created

  // Step 2: Set up test data
  // Assumption: PAY-001 all valid, PAY-003 missing Hospital Privileges and CV

  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('coordinator@system.com', 'ValidPass123!');

  // Step 3: Submit the application to the readiness engine for evaluation
  const response = await page.request.post('http://localhost:5000/api/readiness/evaluate', {
    data: { applicationId: 'APP-TWO-PAYER-001' }
  });
  expect(response.ok()).toBeTruthy();
  const evaluationData = await response.json();

  // Step 4: Verify the engine evaluates PAY-001 and assigns 'Ready to Submit' status
  const payer1Eval = evaluationData.payerEvaluations.find(p => p.payerId === 'PAY-001');
  expect(payer1Eval.status).toBe('Ready to Submit');

  // Step 5: Verify the engine evaluates PAY-003 and assigns 'Incomplete' status
  const payer3Eval = evaluationData.payerEvaluations.find(p => p.payerId === 'PAY-003');
  expect(payer3Eval.status).toBe('Incomplete');
  const missingItems = payer3Eval.requirementResults.filter(r => r.status === 'Missing');
  expect(missingItems.some(r => r.requirementName === 'Hospital Privileges')).toBeTruthy();
  expect(missingItems.some(r => r.requirementName === 'CV/Resume')).toBeTruthy();

  // Step 6: Verify the engine calculates the overall application status based on worst-case logic
  expect(evaluationData.overallStatus).toBe('Incomplete');

  // Step 7: Verify evaluation results display correct statuses for both payers
  await applicationDetailPage.navigateToApplication('APP-TWO-PAYER-001');
  await applicationDetailPage.verifyPayerStatus('PAY-001', 'Ready to Submit');
  await applicationDetailPage.verifyPayerStatus('PAY-003', 'Incomplete');
  await applicationDetailPage.verifyOverallStatus('Incomplete');
});

// Test Case: QE-6031 TS-001 TC-001
test('Verify readiness engine generates deficiency details and priority score for application with missing and expiring requirements', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationDetailPage = new ApplicationDetailPage(page);

  // Step 1: Create a provider enrollment application with requirements in various states
  // Assumption: APP-DEFICIENCY-001 with Medical License expiring in 45 days, DEA missing, Malpractice valid

  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('coordinator@system.com', 'ValidPass123!');

  // Step 2: Verify the configured alert threshold is set to 90 days
  // Assumption: System configuration has ExpirationThresholdDays = 90

  // Step 3: Submit the application to the readiness engine for evaluation
  const response = await page.request.post('http://localhost:5000/api/readiness/evaluate', {
    data: { applicationId: 'APP-DEFICIENCY-001' }
  });
  expect(response.ok()).toBeTruthy();
  const evaluationData = await response.json();

  await applicationDetailPage.navigateToApplication('APP-DEFICIENCY-001');

  // Step 4: Verify the engine generates requirement-level status 'Expiring Soon' for Medical License
  await applicationDetailPage.verifyRequirementStatus('Medical License', 'Expiring Soon');
  await applicationDetailPage.verifyRequirementHasExpirationDate('Medical License');

  // Step 5: Verify the engine generates requirement-level status 'Missing' for DEA Certificate
  await applicationDetailPage.verifyRequirementStatus('DEA Certificate', 'Missing');

  // Step 6: Verify the engine generates requirement-level status 'Present and Valid' for Malpractice Insurance
  await applicationDetailPage.verifyRequirementStatus('Malpractice Insurance', 'Present and Valid');

  // Step 7: Verify specific actionable recommendations are generated for each deficiency
  await applicationDetailPage.verifyRecommendation('Medical License', 'expires in 45 days');
  await applicationDetailPage.verifyRecommendation('DEA Certificate', 'Please provide');

  // Step 8: Verify the engine calculates a priority score reflecting urgency
  expect(evaluationData.priorityScore).toBeGreaterThanOrEqual(70);
  expect(evaluationData.priorityScore).toBeLessThanOrEqual(90);

  // Step 9: Verify evaluation results include all requirement-level details and recommendations
  const payerEval = evaluationData.payerEvaluations[0];
  expect(payerEval.requirementResults).toBeDefined();
  expect(payerEval.requirementResults.length).toBeGreaterThan(0);
});

// Test Case: QE-6031 TS-002 TC-001
test('Verify readiness engine assigns low priority score when all requirements are valid', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationDetailPage = new ApplicationDetailPage(page);

  // Step 1: Create a provider enrollment application with all requirements present and valid
  // Assumption: APP-COMPLETE-001 with all requirements valid and expiring > 90 days

  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('coordinator@system.com', 'ValidPass123!');

  // Step 2: Verify no requirements are expiring within the 90-day threshold
  // Assumption: All expiration dates are 300+ days in the future

  // Step 3: Submit the application to the readiness engine for evaluation
  const response = await page.request.post('http://localhost:5000/api/readiness/evaluate', {
    data: { applicationId: 'APP-COMPLETE-001' }
  });
  expect(response.ok()).toBeTruthy();
  const evaluationData = await response.json();

  await applicationDetailPage.navigateToApplication('APP-COMPLETE-001');

  // Step 4: Verify the engine assigns 'Present and Valid' status to all requirements
  await applicationDetailPage.verifyRequirementStatus('Medical License', 'Present and Valid');
  await applicationDetailPage.verifyRequirementStatus('DEA Certificate', 'Present and Valid');
  await applicationDetailPage.verifyRequirementStatus('Malpractice Insurance', 'Present and Valid');

  // Step 5: Verify no deficiency recommendations are generated
  await applicationDetailPage.verifyNoRecommendations();

  // Step 6: Verify the engine calculates a low priority score
  expect(evaluationData.priorityScore).toBeLessThanOrEqual(50);

  // Step 7: Verify overall application status is 'Ready to Submit'
  expect(evaluationData.overallStatus).toBe('Ready to Submit');
  await applicationDetailPage.verifyOverallStatus('Ready to Submit');
});

// Test Case: QE-6031 TS-003 TC-001
test('Verify readiness engine generates distinct deficiency details per payer and calculates high priority score', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applicationDetailPage = new ApplicationDetailPage(page);

  // Step 1: Create a provider enrollment application with two payers having different deficiencies
  // Assumption: APP-MULTI-DEFICIENCY-001 with PAY-001 (expired Medical License) and PAY-002 (Board Cert expiring in 30 days)

  await loginPage.navigate('http://localhost:4200');
  await loginPage.login('coordinator@system.com', 'ValidPass123!');

  // Step 2: Set up test data for Payer 1: Medical License expired 10 days ago
  // Step 3: Set up test data for Payer 2: Board Certification expiring in 30 days
  // Assumption: Test data is pre-configured

  // Step 4: Submit the application to the readiness engine for evaluation
  const response = await page.request.post('http://localhost:5000/api/readiness/evaluate', {
    data: { applicationId: 'APP-MULTI-DEFICIENCY-001' }
  });
  expect(response.ok()).toBeTruthy();
  const evaluationData = await response.json();

  await applicationDetailPage.navigateToApplication('APP-MULTI-DEFICIENCY-001');

  // Step 5: Verify the engine generates deficiency details for Payer 1 with status 'Expired'
  await applicationDetailPage.verifyPayerRequirementStatus('PAY-001', 'Medical License', 'Expired');
  await applicationDetailPage.verifyPayerRecommendation('PAY-001', 'Medical License', 'has expired');

  // Step 6: Verify the engine generates deficiency details for Payer 2 with status 'Expiring Soon'
  await applicationDetailPage.verifyPayerRequirementStatus('PAY-002', 'Board Certification', 'Expiring Soon');
  await applicationDetailPage.verifyPayerRecommendation('PAY-002', 'Board Certification', 'expires in 30 days');

  // Step 7: Verify distinct deficiency details are generated per payer
  expect(evaluationData.payerEvaluations).toHaveLength(2);
  const payer1Eval = evaluationData.payerEvaluations.find(p => p.payerId === 'PAY-001');
  const payer2Eval = evaluationData.payerEvaluations.find(p => p.payerId === 'PAY-002');
  expect(payer1Eval.requirementResults).toBeDefined();
  expect(payer2Eval.requirementResults).toBeDefined();

  // Step 8: Verify the engine assigns a high priority score due to expired and expiring items
  expect(evaluationData.priorityScore).toBeGreaterThanOrEqual(80);
  expect(evaluationData.priorityScore).toBeLessThanOrEqual(100);

  // Step 9: Verify specific outreach recommendations are provided for each deficiency
  const payer1Recommendations = payer1Eval.requirementResults.filter(r => r.recommendation);
  const payer2Recommendations = payer2Eval.requirementResults.filter(r => r.recommendation);
  expect(payer1Recommendations.length).toBeGreaterThan(0);
  expect(payer2Recommendations.length).toBeGreaterThan(0);
});
