const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { ApplicationDetailPage } = require('./pages/application-detail.page');
const { DocumentUploadPage } = require('./pages/document-upload.page');
const { AuditLogPage } = require('./pages/audit-log.page');
const logger = require('../utils/logger');

test.describe('QE-5941: OCR-Assisted Expiration Extraction', () => {
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

  test('TS-001 TC-001: OCR extracts date successfully with confirmation and audit', async ({ page }) => {
    logger.info('Starting test: Successful OCR extraction with confirmation');
    
    await applicationDetailPage.navigateToApplication('APP-4004');
    const requirementStatus = await applicationDetailPage.getRequirementStatus('DEA Certificate');
    expect(requirementStatus.status).toBe('Missing');
    
    await documentUploadPage.clickUploadButton('DEA Certificate');
    await expect(documentUploadPage.uploadWidget).toBeVisible();
    
    await documentUploadPage.selectFile('data/documents/DEA_Certificate_Clear.pdf');
    await documentUploadPage.selectDocumentType('DEA Certificate');
    logger.info('Selected clear PDF document for OCR processing');
    
    await documentUploadPage.waitForOCRProcessing();
    
    await expect(documentUploadPage.ocrConfirmationDialog).toBeVisible();
    const extractedDate = await documentUploadPage.getOCRExtractedDate();
    expect(extractedDate).toBe('12/31/2026');
    logger.info(`OCR extracted date: ${extractedDate}`);
    
    await expect(documentUploadPage.documentPreview).toBeVisible();
    logger.info('Document preview displayed alongside extracted date');
    
    await documentUploadPage.clickConfirmOCRDate();
    
    const expirationField = await documentUploadPage.getExpirationDateValue();
    expect(expirationField).toBe('12/31/2026');
    logger.info('Expiration date field populated with confirmed value');
    
    await documentUploadPage.clickUploadDocument();
    await documentUploadPage.waitForUploadComplete();
    logger.info('Document uploaded successfully');
    
    await loginPage.logout();
    await loginPage.login('admin1', 'Admin@123');
    
    await auditLogPage.navigate();
    await auditLogPage.filterByEventType('DocumentUploaded');
    await auditLogPage.filterByApplicationId('APP-4004');
    
    const auditEntry = await auditLogPage.getLatestEntry();
    expect(auditEntry.eventType).toBe('DocumentUploaded');
    expect(auditEntry.ocrExtractedDate).toBe('12/31/2026');
    expect(auditEntry.coordinatorConfirmedDate).toBe('12/31/2026');
    expect(auditEntry.userId).toBe('coordinator1');
    expect(auditEntry.applicationId).toBe('APP-4004');
    logger.info('Audit log contains both OCR extracted and confirmed dates');
  });

  test('TS-002 TC-001: Coordinator overrides OCR date with audit of both values', async ({ page }) => {
    logger.info('Starting test: OCR override with audit logging');
    
    await applicationDetailPage.navigateToApplication('APP-5005');
    const requirementStatus = await applicationDetailPage.getRequirementStatus('Board Certification');
    expect(requirementStatus.status).toBe('Missing');
    
    await documentUploadPage.clickUploadButton('Board Certification');
    await expect(documentUploadPage.uploadWidget).toBeVisible();
    
    await documentUploadPage.selectFile('data/documents/Board_Cert_Ambiguous.pdf');
    await documentUploadPage.selectDocumentType('Board Certification');
    logger.info('Selected PDF with ambiguous date for OCR');
    
    await documentUploadPage.waitForOCRProcessing();
    
    await expect(documentUploadPage.ocrConfirmationDialog).toBeVisible();
    const extractedDate = await documentUploadPage.getOCRExtractedDate();
    expect(extractedDate).toBe('06/15/2025');
    logger.info(`OCR incorrectly extracted date: ${extractedDate}`);
    
    await expect(documentUploadPage.documentPreview).toBeVisible();
    logger.info('Coordinator visually verifies document shows 06/15/2027');
    
    await documentUploadPage.clickOverrideOCRDate();
    
    const expirationField = await documentUploadPage.getExpirationDateValue();
    expect(expirationField).toBe('');
    logger.info('Expiration field cleared for manual entry');
    
    await documentUploadPage.enterExpirationDate('06/15/2027');
    logger.info('Manually entered correct date: 06/15/2027');
    
    await documentUploadPage.clickUploadDocument();
    await documentUploadPage.waitForUploadComplete();
    
    const metadata = await documentUploadPage.getDocumentMetadata('Board Certification');
    expect(metadata.expirationDate).toBe('06/15/2027');
    logger.info('System saved manually entered date as official expiration');
    
    const updatedStatus = await applicationDetailPage.getRequirementStatus('Board Certification');
    expect(updatedStatus.status).toBe('Present & Valid');
    logger.info('Requirement status updated based on corrected date');
    
    await loginPage.logout();
    await loginPage.login('admin1', 'Admin@123');
    
    await auditLogPage.navigate();
    await auditLogPage.filterByEventType('DocumentUploaded');
    await auditLogPage.filterByApplicationId('APP-5005');
    
    const auditEntry = await auditLogPage.getLatestEntry();
    expect(auditEntry.eventType).toBe('DocumentUploaded');
    expect(auditEntry.ocrExtractedDate).toBe('06/15/2025');
    expect(auditEntry.coordinatorOverriddenDate).toBe('06/15/2027');
    expect(auditEntry.userId).toBe('coordinator1');
    expect(auditEntry.applicationId).toBe('APP-5005');
    logger.info('Audit log contains both OCR extracted and overridden dates');
  });

  test('TS-003 TC-001: OCR failure handled gracefully with manual entry and logging', async ({ page }) => {
    logger.info('Starting test: OCR failure handling');
    
    await applicationDetailPage.navigateToApplication('APP-6006');
    const requirementStatus = await applicationDetailPage.getRequirementStatus('Work History');
    expect(requirementStatus.status).toBe('Missing');
    
    await documentUploadPage.clickUploadButton('Work History');
    await expect(documentUploadPage.uploadWidget).toBeVisible();
    
    await documentUploadPage.selectFile('data/documents/Work_History_PoorQuality.pdf');
    await documentUploadPage.selectDocumentType('Work History');
    logger.info('Selected poor-quality scanned PDF');
    
    await documentUploadPage.waitForOCRProcessing();
    
    await expect(documentUploadPage.ocrFailureNotification).toBeVisible();
    const notification = await documentUploadPage.getOCRFailureMessage();
    expect(notification).toContain('Automatic expiration date extraction failed');
    expect(notification).toContain('Please enter the expiration date manually');
    logger.info('OCR failure notification displayed');
    
    const expirationField = await documentUploadPage.getExpirationDateValue();
    expect(expirationField).toBe('');
    const isEditable = await documentUploadPage.isExpirationFieldEditable();
    expect(isEditable).toBe(true);
    logger.info('Expiration field empty and editable for manual entry');
    
    await documentUploadPage.enterExpirationDate('03/31/2026');
    logger.info('Manually entered expiration date: 03/31/2026');
    
    await documentUploadPage.clickUploadDocument();
    await documentUploadPage.waitForUploadComplete();
    logger.info('Document uploaded successfully with manual date');
    
    await loginPage.logout();
    await loginPage.login('admin1', 'Admin@123');
    
    await auditLogPage.navigate();
    await auditLogPage.filterByEventType('OCRExtractionFailed');
    await auditLogPage.filterByApplicationId('APP-6006');
    
    const auditEntry = await auditLogPage.getLatestEntry();
    expect(auditEntry.eventType).toBe('OCRExtractionFailed');
    expect(auditEntry.documentFileName).toBe('Work_History_PoorQuality.pdf');
    expect(auditEntry.failureReason).toContain('Low confidence score');
    expect(auditEntry.userId).toBe('coordinator1');
    expect(auditEntry.applicationId).toBe('APP-6006');
    logger.info('OCR failure event logged in audit trail');
    
    const updatedStatus = await applicationDetailPage.getRequirementStatus('Work History');
    expect(updatedStatus.status).toBe('Present & Valid');
    expect(updatedStatus.expirationDate).toBe('03/31/2026');
    logger.info('Upload completed successfully with manual metadata entry');
  });
});
