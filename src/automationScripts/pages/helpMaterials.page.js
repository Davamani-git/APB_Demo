const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.HelpMaterialsPage = class HelpMaterialsPage {
  constructor(page) {
    this.page = page;
    this.helpMaterialsSection = page.locator('[data-testid="help-materials"], .help-materials-section');
    this.materialsList = page.locator('[data-testid="materials-list"], .materials-list');
    this.downloadButton = page.locator('[data-testid="download-button"], button:has-text("Download")');
    this.downloadLink = page.locator('[data-testid="download-link"], a[download]');
    this.errorMessage = page.locator('[data-testid="download-error"], .download-error-message');
    this.accessDeniedMessage = page.locator('[data-testid="access-denied"], .access-denied-message');
    this.authorizationError = page.locator('[data-testid="auth-error"], .authorization-error');
  }

  async navigateToHelpMaterials() {
    logger.info('Navigating to Help Materials section');
    const materialsLink = this.page.locator('[data-testid="materials-link"], text="Help Materials"');
    await materialsLink.click();
  }

  async navigateToHelpMaterialsSection() {
    logger.info('Navigating to Help Materials section');
    await this.page.goto('https://helpcenter.example.com/materials');
  }

  async verifyHelpMaterialsDisplayed() {
    logger.info('Verifying Help Materials displayed');
    await expect(this.helpMaterialsSection).toBeVisible();
    await expect(this.materialsList).toBeVisible();
  }

  async verifyMaterialsAvailable() {
    logger.info('Verifying materials available');
    await expect(this.materialsList).toBeVisible();
  }

  async verifyMaterialsListed() {
    logger.info('Verifying materials listed');
    await expect(this.materialsList).toBeVisible();
  }

  async selectMaterial(materialName) {
    logger.info(`Selecting material: ${materialName}`);
    const material = this.page.locator(`[data-testid="material-${materialName}"], text="${materialName}"`);
    await material.click();
  }

  async verifyDownloadOptionAvailable() {
    logger.info('Verifying download option available');
    await expect(this.downloadButton).toBeVisible();
  }

  async clickDownload() {
    logger.info('Clicking download button');
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadButton.click()
    ]);
    this.currentDownload = download;
  }

  async verifyDownloadInitiated() {
    logger.info('Verifying download initiated');
    expect(this.currentDownload).toBeDefined();
  }

  async verifyFileDownloadedWithExtension(extension) {
    logger.info(`Verifying file downloaded with extension: ${extension}`);
    const fileName = this.currentDownload.suggestedFilename();
    expect(fileName).toContain(extension);
  }

  async verifyFileOpensSuccessfully() {
    logger.info('Verifying file opens successfully');
    const path = await this.currentDownload.path();
    expect(path).toBeTruthy();
  }

  async verifyFileIntegrity() {
    logger.info('Verifying file integrity');
    const failure = await this.currentDownload.failure();
    expect(failure).toBeNull();
  }

  async downloadMaterial(materialName) {
    logger.info(`Downloading material: ${materialName}`);
    await this.selectMaterial(materialName);
    await this.clickDownload();
  }

  async verifyPDFDownloadedAndComplete() {
    logger.info('Verifying PDF downloaded and complete');
    await this.verifyFileDownloadedWithExtension('.pdf');
    await this.verifyFileIntegrity();
  }

  async verifyDOCXDownloadedAndComplete() {
    logger.info('Verifying DOCX downloaded and complete');
    await this.verifyFileDownloadedWithExtension('.docx');
    await this.verifyFileIntegrity();
  }

  async selectCorruptedOrUnavailableFile(fileName) {
    logger.info(`Selecting corrupted/unavailable file: ${fileName}`);
    const file = this.page.locator(`text="${fileName}"`);
    await file.click();
  }

  async attemptDownload() {
    logger.info('Attempting download');
    await this.downloadButton.click();
  }

  async verifyDownloadErrorDisplayed(expectedMessage) {
    logger.info(`Verifying download error displayed: ${expectedMessage}`);
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async attemptDownloadRestrictedMaterial(materialName) {
    logger.info(`Attempting to download restricted material: ${materialName}`);
    const material = this.page.locator(`text="${materialName}"`);
    await material.click();
    await this.downloadButton.click();
  }

  async verifyAccessDenied() {
    logger.info('Verifying access denied');
    await expect(this.accessDeniedMessage).toBeVisible();
  }

  async verifyAuthorizationErrorMessage(expectedMessage) {
    logger.info(`Verifying authorization error message: ${expectedMessage}`);
    await expect(this.authorizationError).toBeVisible();
    await expect(this.authorizationError).toContainText(expectedMessage);
  }

  async verifyDownloadSuccessful() {
    logger.info('Verifying download successful');
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadButton.click()
    ]);
    const failure = await download.failure();
    expect(failure).toBeNull();
  }
};
