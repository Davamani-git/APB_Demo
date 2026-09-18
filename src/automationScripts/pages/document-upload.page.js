const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');
const path = require('path');

exports.DocumentUploadPage = class DocumentUploadPage {
  constructor(page) {
    this.page = page;
    this.uploadWidget = page.locator('.document-upload-widget');
    this.fileInput = page.locator('input[type="file"]');
    this.documentTypeSelect = page.locator('select#documentType');
    this.expirationDateInput = page.locator('input#expirationDate');
    this.uploadButton = page.locator('button:has-text("Upload Document")');
    this.errorMessage = page.locator('.alert-danger');
    this.successMessage = page.locator('.alert-success');
    this.ocrConfirmationDialog = page.locator('.ocr-confirmation-dialog');
    this.ocrExtractedDateLabel = page.locator('.ocr-extracted-date');
    this.confirmOCRButton = page.locator('button:has-text("Confirm")');
    this.overrideOCRButton = page.locator('button:has-text("Override")');
    this.documentPreview = page.locator('.document-preview');
    this.ocrFailureNotification = page.locator('.ocr-failure-notification');
    this.selectedFileNameLabel = page.locator('.selected-file-name');
  }

  async uploadDocument(documentType, filePath, expirationDate) {
    await this.clickUploadButton(documentType);
    await this.selectFile(filePath);
    await this.selectDocumentType(documentType);
    await this.enterExpirationDate(expirationDate);
    await this.clickUploadDocument();
    await this.waitForUploadComplete();
    logger.info(`Document uploaded: ${documentType}, Expiration: ${expirationDate}`);
  }

  async clickUploadButton(requirementName) {
    const uploadBtn = this.page.locator(`.requirement-row:has-text("${requirementName}") button:has-text("Upload")`);
    await expect(uploadBtn).toBeVisible();
    await uploadBtn.click();
    await expect(this.uploadWidget).toBeVisible();
    logger.info(`Upload button clicked for: ${requirementName}`);
  }

  async selectFile(filePath) {
    const absolutePath = path.resolve(filePath);
    await this.fileInput.setInputFiles(absolutePath);
    logger.info(`File selected: ${filePath}`);
  }

  async selectDocumentType(documentType) {
    await expect(this.documentTypeSelect).toBeVisible();
    await this.documentTypeSelect.selectOption(documentType);
    logger.info(`Document type selected: ${documentType}`);
  }

  async enterExpirationDate(date) {
    await expect(this.expirationDateInput).toBeVisible();
    await this.expirationDateInput.fill(date);
    logger.info(`Expiration date entered: ${date}`);
  }

  async clickUploadDocument() {
    await expect(this.uploadButton).toBeVisible();
    await this.uploadButton.click();
    logger.info('Upload document button clicked');
  }

  async waitForUploadComplete() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    logger.info('Upload completed');
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async getSelectedFileName() {
    await expect(this.selectedFileNameLabel).toBeVisible();
    return await this.selectedFileNameLabel.textContent();
  }

  async verifyDocumentEncryption(fileName) {
    const response = await this.page.request.get(`${process.env.BASE_URL}/api/documents/verify-encryption?fileName=${fileName}`);
    const data = await response.json();
    return data;
  }

  async getDocumentMetadata(requirementName) {
    const response = await this.page.request.get(`${process.env.BASE_URL}/api/documents/metadata?requirement=${requirementName}`);
    const data = await response.json();
    return data;
  }

  async getDocumentList(requirementName) {
    const documentList = this.page.locator(`.requirement-row:has-text("${requirementName}") .document-list`);
    if (await documentList.isVisible()) {
      const items = await documentList.locator('li').all();
      return items;
    }
    return [];
  }

  async getFileSize() {
    const fileSizeLabel = this.page.locator('.file-size');
    if (await fileSizeLabel.isVisible()) {
      const text = await fileSizeLabel.textContent();
      const match = text.match(/(\d+)\s*MB/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }

  async waitForOCRProcessing() {
    await this.page.waitForTimeout(2000);
    logger.info('Waiting for OCR processing');
  }

  async getOCRExtractedDate() {
    await expect(this.ocrExtractedDateLabel).toBeVisible();
    return await this.ocrExtractedDateLabel.textContent();
  }

  async clickConfirmOCRDate() {
    await expect(this.confirmOCRButton).toBeVisible();
    await this.confirmOCRButton.click();
    logger.info('OCR extracted date confirmed');
  }

  async clickOverrideOCRDate() {
    await expect(this.overrideOCRButton).toBeVisible();
    await this.overrideOCRButton.click();
    logger.info('OCR extracted date overridden');
  }

  async getExpirationDateValue() {
    return await this.expirationDateInput.inputValue();
  }

  async getOCRFailureMessage() {
    await expect(this.ocrFailureNotification).toBeVisible();
    return await this.ocrFailureNotification.textContent();
  }

  async isExpirationFieldEditable() {
    return await this.expirationDateInput.isEditable();
  }
};
