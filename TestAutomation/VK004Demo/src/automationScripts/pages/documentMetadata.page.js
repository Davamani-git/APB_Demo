const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DocumentMetadataPage = class DocumentMetadataPage {
  constructor(page) {
    this.page = page;
    this.documentMetadataTab = page.locator('.nav-tab[data-view="document-metadata"]');
    this.addDocumentButton = page.locator('#add-document-btn');
    this.documentFormModal = page.locator('#document-form-modal');
    this.documentTable = page.locator('#documents-table table');
    this.applicationIdInput = page.locator('#applicationId');
    this.documentTypeSelect = page.locator('#documentType');
    this.issueDateInput = page.locator('#issueDate');
    this.expirationDateInput = page.locator('#expirationDate');
    this.documentNumberInput = page.locator('#documentNumber');
    this.issuingAuthorityInput = page.locator('#issuingAuthority');
    this.notesTextarea = page.locator('#notes');
    this.saveDocumentButton = page.locator('#document-form button[type="submit"]');
    this.cancelButton = page.locator('#cancel-btn');
    this.closeModalButton = page.locator('#close-modal');
  }

  async navigateToDocumentMetadata() {
    logger.info('Navigating to Document Metadata tab');
    await this.documentMetadataTab.click();
    await expect(this.page.locator('h2:has-text("Document Metadata Management")')).toBeVisible();
    await expect(this.addDocumentButton).toBeVisible();
    logger.info('Document Metadata page loaded successfully');
  }

  async clickAddDocument() {
    logger.info('Clicking Add New Document button');
    await this.addDocumentButton.click();
    await expect(this.documentFormModal).toHaveClass(/active/);
    logger.info('Document form modal opened');
  }

  async fillDocumentForm(applicationId, documentType, issueDate, expirationDate, documentNumber, issuingAuthority, notes) {
    logger.info(`Filling document form for application: ${applicationId}, type: ${documentType}`);
    await this.applicationIdInput.fill(applicationId);
    await this.documentTypeSelect.selectOption(documentType);
    await this.issueDateInput.fill(issueDate);
    await this.expirationDateInput.fill(expirationDate);
    await this.documentNumberInput.fill(documentNumber);
    await this.issuingAuthorityInput.fill(issuingAuthority);
    if (notes) {
      await this.notesTextarea.fill(notes);
    }
    logger.info('Document form filled successfully');
  }

  async saveDocument() {
    logger.info('Saving document');
    await this.saveDocumentButton.click();
    await expect(this.documentFormModal).not.toHaveClass(/active/, { timeout: 5000 });
    logger.info('Document saved successfully');
  }

  async cancelDocumentForm() {
    logger.info('Canceling document form');
    await this.cancelButton.click();
    await expect(this.documentFormModal).not.toHaveClass(/active/);
    logger.info('Document form canceled');
  }

  async editDocument(documentId) {
    logger.info(`Editing document: ${documentId}`);
    const editButton = this.documentTable.locator(`tr:has-text("${documentId}") button:has-text("Edit")`);
    await editButton.click();
    await expect(this.documentFormModal).toHaveClass(/active/);
    logger.info('Document edit form opened');
  }
};
