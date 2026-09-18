const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { ApplicationDetailPage } = require('./pages/application-detail.page');
const { DocumentUploadPage } = require('./pages/document-upload.page');
const { AuditLogPage } = require('./pages/audit-log.page');
const logger = require('../utils/logger');

test.describe('QE-5940: Secure Document Upload And Metadata', () => {
  let loginPage, applicationDetailPage, documentUploadPage, auditLogPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    applicationDetailPage = new ApplicationDetailPage(page);
    documentUploadPage = new DocumentUploadPage(page);
    auditLogPage = new AuditLogPage(page);
    await loginPage.navigate();
    await loginPage.login('coordinator1', 'Pass@123');
    logger.info('Logged in as coordinator1');
  });

  test('TS-001 TC-001: Upload valid document with metadata and status update within 5 seconds', async ({ page }) => {
    logger.info('Starting test: Valid document upload with performance check');
    
    await applicationDetailPage.navigateToApplication('APP-1001');
    await expect(applicationDetailPage.pageTitle).toBeVisible();
    
    const requirementStatus = await applicationDetailPage.getRequirementStatus('DEA Certificate');
    expect(requirementStatus.status).toBe('Missing');
    logger.info('DEA Certificate requirement status: Missing');
    
    await documentUploadPage.clickUploadButton('DEA Certificate');
    await expect(documentUploadPage.uploadWidget).toBeVisible();
    logger.info('Document upload widget displayed');
    
    await documentUploadPage.selectFile('data/documents/DEA_Certificate_DrSmith.pdf');
    const fileName = await documentUploadPage.getSelectedFileName();
    expect(fileName).toBe('DEA_Certificate_DrSmith.pdf');
    logger.info('File selected: DEA_Certificate_DrSmith.pdf');
    
    await documentUploadPage.selectDocumentType('DEA Certificate');
    await documentUploadPage.enterExpirationDate('12/31/2026');
    logger.info('Metadata entered: Type=DEA Certificate, Expiration=12/31/2026');
    
    const startTime = Date.now();
    await documentUploadPage.clickUploadDocument();
    await documentUploadPage.waitForUploadComplete();
    
    const updatedStatus = await applicationDetailPage.getRequirementStatus('DEA Certificate');
    const endTime = Date.now();
    const updateTime = (endTime - startTime) / 1000;
    
    expect(updatedStatus.status).toBe('Present & Valid');
    expect(updateTime).toBeLessThanOrEqual(5);
    logger.info(`Requirement status updated to Present & Valid in ${updateTime} seconds`);
    
    const storageVerification = await documentUploadPage.verifyDocumentEncryption('DEA_Certificate_DrSmith.pdf');
    expect(storageVerification.encrypted).toBe(true);
    expect(storageVerification.encryption).toBe('AES-256');
    logger.info('Document stored with AES-256 encryption verified');
    
    const metadata = await documentUploadPage.getDocumentMetadata('DEA Certificate');
    expect(metadata.documentType).toBe('DEA Certificate');
    expect(metadata.expirationDate).toBe('12/31/2026');
    expect(metadata.uploaderId).toBe('coordinator1');
    expect(metadata.timestamp).toBeDefined();
    logger.info('Document metadata persisted correctly');
  });

  test('TS-002 TC-001: Block expired document upload with error message', async ({ page }) => {
    logger.info('Starting test: Expired document validation');
    
    await applicationDetailPage.navigateToApplication('APP-2002');
    const requirementStatus = await applicationDetailPage.getRequirementStatus('Medical License');
    expect(requirementStatus.status).toBe('Missing');
    logger.info('Medical License requirement status: Missing');
    
    await documentUploadPage.clickUploadButton('Medical License');
    await expect(documentUploadPage.uploadWidget).toBeVisible();
    
    await documentUploadPage.selectFile('data/documents/Medical_License_Expired.pdf');
    await documentUploadPage.selectDocumentType('Medical License');
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const expiredDate = yesterday.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    await documentUploadPage.enterExpirationDate(expiredDate);
    logger.info(`Entered expired date: ${expiredDate}`);
    
    await documentUploadPage.clickUploadDocument();
    
    await expect(documentUploadPage.errorMessage).toBeVisible();
    const errorText = await documentUploadPage.getErrorMessage();
    expect(errorText).toContain(`This document expired on ${expiredDate}`);
    expect(errorText).toContain('cannot satisfy this requirement');
    expect(errorText).toContain('Please upload a current version');
    logger.info('Error message displayed correctly');
    
    const documentList = await documentUploadPage.getDocumentList('Medical License');
    expect(documentList.length).toBe(0);
    logger.info('Document not stored in system');
    
    const updatedStatus = await applicationDetailPage.getRequirementStatus('Medical License');
    expect(updatedStatus.status).toBe('Missing');
    logger.info('Requirement status remains Missing');
  });

  test('TS-003 TC-001: Reject oversized document with error and audit logging', async ({ page }) => {
    logger.info('Starting test: Oversized document validation');
    
    await applicationDetailPage.navigateToApplication('APP-3003');
    const requirementStatus = await applicationDetailPage.getRequirementStatus('Malpractice Insurance');
    expect(requirementStatus.status).toBe('Missing');
    
    await documentUploadPage.clickUploadButton('Malpractice Insurance');
    await expect(documentUploadPage.uploadWidget).toBeVisible();
    
    await documentUploadPage.selectFile('data/documents/Malpractice_Insurance_Large.pdf');
    const fileSize = await documentUploadPage.getFileSize();
    expect(fileSize).toBe(60);
    logger.info('Selected oversized file: 60 MB');
    
    await documentUploadPage.selectDocumentType('Malpractice Insurance');
    await documentUploadPage.enterExpirationDate('09/30/2026');
    
    await documentUploadPage.clickUploadDocument();
    
    await expect(documentUploadPage.errorMessage).toBeVisible();
    const errorText = await documentUploadPage.getErrorMessage();
    expect(errorText).toContain('File size exceeds the maximum allowed limit of 50 MB');
    expect(errorText).toContain('Please upload a smaller file');
    logger.info('File size error message displayed');
    
    const documentList = await documentUploadPage.getDocumentList('Malpractice Insurance');
    expect(documentList.length).toBe(0);
    logger.info('Document not stored');
    
    const updatedStatus = await applicationDetailPage.getRequirementStatus('Malpractice Insurance');
    expect(updatedStatus.status).toBe('Missing');
    logger.info('Requirement status unchanged');
    
    await loginPage.logout();
    await loginPage.login('admin1', 'Admin@123');
    
    await auditLogPage.navigate();
    await auditLogPage.filterByEventType('DocumentUploadFailed');
    await auditLogPage.filterByUser('coordinator1');
    
    const auditEntry = await auditLogPage.getLatestEntry();
    expect(auditEntry.eventType).toBe('DocumentUploadFailed');
    expect(auditEntry.userId).toBe('coordinator1');
    expect(auditEntry.applicationId).toBe('APP-3003');
    expect(auditEntry.fileName).toBe('Malpractice_Insurance_Large.pdf');
    expect(auditEntry.fileSize).toBe('60 MB');
    expect(auditEntry.failureReason).toContain('File size exceeds limit');
    logger.info('Failed upload attempt logged in audit trail');
  });
});
