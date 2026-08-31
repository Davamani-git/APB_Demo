const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ContentManagementPage = class ContentManagementPage {
  constructor(page) {
    this.page = page;
    this.dashboard = page.locator('[data-testid="admin-dashboard"], .admin-dashboard');
    this.contentManagementLink = page.locator('[data-testid="content-management"], text="Content Management"');
    this.contentManagementInterface = page.locator('[data-testid="content-mgmt-interface"], .content-management');
    this.contentEditor = page.locator('[data-testid="content-editor"], .content-editor');
    this.contentTitleInput = page.locator('[data-testid="content-title"], input[name="title"]');
    this.contentBodyInput = page.locator('[data-testid="content-body"], textarea[name="body"]');
    this.categoryDropdown = page.locator('[data-testid="category-dropdown"], select[name="category"]');
    this.publishButton = page.locator('[data-testid="publish-button"], button[type="submit"]');
    this.successMessage = page.locator('[data-testid="success-message"], .success-notification');
    this.validationError = page.locator('[data-testid="validation-error"], .error-message');
    this.newContentButton = page.locator('[data-testid="new-content"], button:has-text("New Content")');
  }

  async verifyDashboardLoaded() {
    logger.info('Verifying administrator dashboard loaded');
    await expect(this.dashboard).toBeVisible();
  }

  async navigateToContentManagement() {
    logger.info('Navigating to content management section');
    await this.contentManagementLink.click();
  }

  async verifyContentManagementDisplayed() {
    logger.info('Verifying content management interface displayed');
    await expect(this.contentManagementInterface).toBeVisible();
  }

  async createOrSelectContent(contentTitle) {
    logger.info(`Creating or selecting content: ${contentTitle}`);
    await this.newContentButton.click();
    await expect(this.contentEditor).toBeVisible();
    await this.contentTitleInput.fill(contentTitle);
    await this.contentBodyInput.fill('Content body for ' + contentTitle);
  }

  async assignCategory(categoryName) {
    logger.info(`Assigning category: ${categoryName}`);
    await this.categoryDropdown.selectOption({ label: categoryName });
  }

  async saveAndPublishContent() {
    logger.info('Saving and publishing content');
    await this.publishButton.click();
  }

  async verifyContentPublished() {
    logger.info('Verifying content published successfully');
    await expect(this.successMessage).toBeVisible();
  }

  async openContentEditor() {
    logger.info('Opening content editor');
    await this.newContentButton.click();
    await expect(this.contentEditor).toBeVisible();
  }

  async verifyCategoryDropdownDisplayed() {
    logger.info('Verifying category dropdown displayed');
    await expect(this.categoryDropdown).toBeVisible();
  }

  async clickCategoryDropdown() {
    logger.info('Clicking category dropdown');
    await this.categoryDropdown.click();
  }

  async verifyCategoryOptionsDisplayed(expectedCategories) {
    logger.info('Verifying category options displayed');
    for (const category of expectedCategories) {
      const option = this.page.locator(`option:has-text("${category}")`);
      await expect(option).toBeVisible();
    }
  }

  async createAndPublishContent(title, category) {
    logger.info(`Creating and publishing content: ${title} in ${category}`);
    await this.newContentButton.click();
    await this.contentTitleInput.fill(title);
    await this.contentBodyInput.fill('Body for ' + title);
    await this.categoryDropdown.selectOption({ label: category });
    await this.publishButton.click();
  }

  async createNewContent() {
    logger.info('Creating new content');
    await this.newContentButton.click();
    await expect(this.contentEditor).toBeVisible();
  }

  async fillContentTitle(title) {
    logger.info(`Filling content title: ${title}`);
    await this.contentTitleInput.fill(title);
  }

  async fillContentBody(body) {
    logger.info('Filling content body');
    await this.contentBodyInput.fill(body);
  }

  async leaveCategoryUnselected() {
    logger.info('Leaving category unselected');
    // Category remains blank - no action needed
  }

  async attemptPublish() {
    logger.info('Attempting to publish');
    await this.publishButton.click();
  }

  async verifyValidationError(expectedMessage) {
    logger.info(`Verifying validation error: ${expectedMessage}`);
    await expect(this.validationError).toBeVisible();
    await expect(this.validationError).toContainText(expectedMessage);
  }
};
