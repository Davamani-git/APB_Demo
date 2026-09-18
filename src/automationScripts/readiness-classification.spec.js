const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { ApplicationListPage } = require('./pages/application-list.page');
const { ApplicationDetailPage } = require('./pages/application-detail.page');
const { DocumentUploadPage } = require('./pages/document-upload.page');
const logger = require('../utils/logger');

test.describe('QE-5936: Deterministic Readiness Classification', () => {
  let loginPage, applicationListPage, applicationDetailPage, documentUploadPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    applicationListPage = new ApplicationListPage(page);
    applicationDetailPage = new ApplicationDetailPage(page);
    documentUploadPage = new DocumentUploadPage(page);
    await loginPage.navigate();
    await loginPage.login('coordinator1', 'Pass@123');
    logger.info('User logged in successfully as coordinator1');
  });

  test('TS-001 TC-001: Verify Ready to Submit status when all requirements valid', async ({ page }) => {
    logger.info('Starting test: Verify Ready to Submit status');
    
    await applicationListPage.clickCreateApplication();
    await applicationDetailPage.fillProviderDetails('Dr. John Smith', '1234567890', 'Initial Enrollment');
    await applicationDetailPage.selectTargetPayers(['BCBS', 'Aetna', 'UHC']);
    const applicationId = await applicationDetailPage.getApplicationId();
    logger.info(`Application created with ID: ${applicationId}`);
    
    await documentUploadPage.uploadDocument('DEA Certificate', 'data/documents/dea_cert.pdf', '12/31/2026');
    await documentUploadPage.uploadDocument('Medical License', 'data/documents/med_license.pdf', '06/30/2027');
    await documentUploadPage.uploadDocument('Malpractice Insurance', 'data/documents/malpractice.pdf', '03/15/2026');
    logger.info('All required documents uploaded');
    
    await applicationDetailPage.triggerReadinessEvaluation();
    await page.waitForTimeout(5000);
    
    const applicationStatus = await applicationDetailPage.getApplicationStatus();
    expect(applicationStatus).toBe('Ready to Submit');
    logger.info('Application status verified as Ready to Submit');
    
    const payerStatuses = await applicationDetailPage.getPayerStatuses();
    expect(payerStatuses['BCBS']).toBe('Ready to Submit');
    expect(payerStatuses['Aetna']).toBe('Ready to Submit');
    expect(payerStatuses['UHC']).toBe('Ready to Submit');
    logger.info('All payer statuses verified as Ready to Submit');
    
    const requirementStatuses = await applicationDetailPage.getAllRequirementStatuses();
    for (const status of requirementStatuses) {
      expect(status).toBe('Present & Valid');
    }
    logger.info('All requirement statuses verified as Present & Valid');
  });

  test('TS-002 TC-001: Verify Incomplete status when documents missing', async ({ page }) => {
    logger.info('Starting test: Verify Incomplete status with missing documents');
    
    await applicationListPage.clickCreateApplication();
    await applicationDetailPage.fillProviderDetails('Dr. Jane Doe', '9876543210', 'Re-credentialing');
    await applicationDetailPage.selectTargetPayers(['BCBS', 'Cigna']);
    const applicationId = await applicationDetailPage.getApplicationId();
    logger.info(`Application created with ID: ${applicationId}`);
    
    await documentUploadPage.uploadDocument('DEA Certificate', 'data/documents/dea_cert.pdf', '08/31/2026');
    await documentUploadPage.uploadDocument('Medical License', 'data/documents/med_license.pdf', '12/31/2027');
    logger.info('Partial documents uploaded - Malpractice Insurance omitted');
    
    await applicationDetailPage.triggerReadinessEvaluation();
    await page.waitForTimeout(5000);
    
    const applicationStatus = await applicationDetailPage.getApplicationStatus();
    expect(applicationStatus).toBe('Incomplete');
    logger.info('Application status verified as Incomplete');
    
    const bcbsStatus = await applicationDetailPage.getPayerStatus('BCBS');
    expect(bcbsStatus).toBe('Incomplete');
    const missingDocs = await applicationDetailPage.getMissingDocuments('BCBS');
    expect(missingDocs).toContain('Malpractice Insurance');
    logger.info('BCBS payer status verified with missing Malpractice Insurance');
    
    const cignaStatus = await applicationDetailPage.getPayerStatus('Cigna');
    expect(cignaStatus).toBe('Incomplete');
    const cignaMissingDocs = await applicationDetailPage.getMissingDocuments('Cigna');
    expect(cignaMissingDocs.length).toBeGreaterThan(0);
    logger.info('Cigna payer status verified as Incomplete with missing documents');
  });

  test('TS-003 TC-001: Verify Expiring Soon status within threshold', async ({ page }) => {
    logger.info('Starting test: Verify Expiring Soon status');
    
    await applicationListPage.navigateToSettings();
    const threshold = await applicationListPage.getExpirationThreshold();
    expect(threshold).toBe('90');
    logger.info('Expiration threshold verified as 90 days');
    
    await applicationListPage.clickCreateApplication();
    await applicationDetailPage.fillProviderDetails('Dr. Michael Brown', '5551234567', 'Initial Enrollment');
    await applicationDetailPage.selectTargetPayers(['Humana']);
    
    const expiringDate = new Date();
    expiringDate.setDate(expiringDate.getDate() + 45);
    const formattedDate = expiringDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    
    await documentUploadPage.uploadDocument('DEA Certificate', 'data/documents/dea_cert.pdf', formattedDate);
    await documentUploadPage.uploadDocument('Medical License', 'data/documents/med_license.pdf', '12/31/2027');
    await documentUploadPage.uploadDocument('Malpractice Insurance', 'data/documents/malpractice.pdf', '06/30/2026');
    logger.info('Documents uploaded with one expiring within threshold');
    
    await applicationDetailPage.triggerReadinessEvaluation();
    await page.waitForTimeout(5000);
    
    const applicationStatus = await applicationDetailPage.getApplicationStatus();
    expect(applicationStatus).toBe('Expiring Soon');
    expect(applicationStatus).not.toBe('Ready to Submit');
    logger.info('Application status verified as Expiring Soon');
    
    const humanaStatus = await applicationDetailPage.getPayerStatus('Humana');
    expect(humanaStatus).toBe('Expiring Soon');
    
    const deaCertStatus = await applicationDetailPage.getRequirementStatus('DEA Certificate');
    expect(deaCertStatus.status).toBe('Expiring Soon');
    expect(deaCertStatus.expirationDate).toBe(formattedDate);
    logger.info('DEA Certificate verified as Expiring Soon with correct date');
  });
});
