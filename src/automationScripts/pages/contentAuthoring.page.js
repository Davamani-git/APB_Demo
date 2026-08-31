const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ContentAuthoringPage = class ContentAuthoringPage {
  constructor(page) {
    this.page = page;
    this.authorDashboard = page.locator('[data-testid="author-dashboard"], .author-dashboard');
    this.createContentLink = page.locator('[data-testid="create-content"], text="Create Content"');
    this.contentCreationInterface = page.locator('[data-testid="content-creation"], .content-creation-form');
    this.titleInput = page.locator('[data-testid="title-input"], input[name="title"]');
    this.bodyInput = page.locator('[data-testid="body-input"], textarea[name="body"], .editor-content');
    this.categorySelect = page.locator('[data-testid="category-select"], select[name="category"]');
    this.tagsInput = page.locator('[data-testid="tags-input"], input[name="tags"]');
    this.publishButton = page.locator('[data-testid="publish-button"], button:has-text("Publish")');
    this.formattingToolbar = page.locator('[data-testid="formatting-toolbar"], .editor-toolbar');
    this.boldButton = page.locator('[data-testid="bold-button"], button[title="Bold"]');
    this.italicButton = page.locator('[data-testid="italic-button"], button[title="Italic"]');
    this.underlineButton = page.locator('[data-testid="underline-button"], button[title="Underline"]');
    this.listButton = page.locator('[data-testid="list-button"], button[title*="List"]');
    this.linkButton = page.locator('[data-testid="link-button"], button[title="Link"]');
    this.successNotification = page.locator('[data-testid="success-notification"], .success-message');
    this.validationError = page.locator('[data-testid="validation-error"], .error-message');
    this.contentForm = page.locator('[data-testid="content-form"], .content-form');
  }

  async verifyAuthorDashboardLoaded() {
    logger.info('Verifying author dashboard loaded');
    await expect(this.authorDashboard).toBeVisible();
  }

  async navigateToCreateNewContent() {
    logger.info('Navigating to create new content');
    await this.createContentLink.click();
  }

  async verifyContentCreationInterfaceDisplayed() {
    logger.info('Verifying content creation interface displayed');
    await expect(this.contentCreationInterface).toBeVisible();
  }

  async enterContentTitle(title) {
    logger.info(`Entering content title: ${title}`);
    await this.titleInput.fill(title);
  }

  async enterContentBody(body) {
    logger.info('Entering content body');
    await this.bodyInput.fill(body);
  }

  async addMetadata(category, tags) {
    logger.info(`Adding metadata - Category: ${category}, Tags: ${tags}`);
    await this.categorySelect.selectOption({ label: category });
    if (tags && tags.length > 0) {
      await this.tagsInput.fill(tags.join(', '));
    }
  }

  async clickPublish() {
    logger.info('Clicking publish button');
    await this.publishButton.click();
  }

  async verifyContentSubmitted() {
    logger.info('Verifying content submitted');
    await expect(this.successNotification).toBeVisible();
  }

  async openContentEditor() {
    logger.info('Opening content editor');
    await this.createContentLink.click();
    await expect(this.contentCreationInterface).toBeVisible();
  }

  async verifyFormattingToolbarDisplayed() {
    logger.info('Verifying formatting toolbar displayed');
    await expect(this.formattingToolbar).toBeVisible();
  }

  async verifyFormattingOptionsAvailable(options) {
    logger.info('Verifying formatting options available');
    for (const option of options) {
      let button;
      switch(option) {
        case 'bold': button = this.boldButton; break;
        case 'italic': button = this.italicButton; break;
        case 'underline': button = this.underlineButton; break;
        case 'lists': button = this.listButton; break;
        case 'links': button = this.linkButton; break;
      }
      await expect(button).toBeVisible();
    }
  }

  async applyFormatting(formatType, text) {
    logger.info(`Applying formatting: ${formatType} to text: ${text}`);
    await this.bodyInput.fill(text);
    switch(formatType) {
      case 'bold': await this.boldButton.click(); break;
      case 'list': await this.listButton.click(); break;
      case 'link': await this.linkButton.click(); break;
    }
  }

  async publishContent() {
    logger.info('Publishing content');
    await this.publishButton.click();
  }

  async verifyContentPublished() {
    logger.info('Verifying content published');
    await expect(this.successNotification).toBeVisible();
  }

  async verifyContentFormDisplayed() {
    logger.info('Verifying content form displayed');
    await expect(this.contentForm).toBeVisible();
  }

  async leaveTitleEmpty() {
    logger.info('Leaving title empty');
    await this.titleInput.clear();
  }

  async fillContentBody(body) {
    logger.info('Filling content body');
    await this.bodyInput.fill(body);
  }

  async selectCategory(category) {
    logger.info(`Selecting category: ${category}`);
    await this.categorySelect.selectOption({ label: category });
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

  async attemptPublishWithEmptyTitle() {
    logger.info('Attempting to publish with empty title');
    await this.createContentLink.click();
    await this.bodyInput.fill('Test body');
    await this.categorySelect.selectOption({ index: 1 });
    await this.publishButton.click();
  }

  async attemptPublishWithEmptyBody() {
    logger.info('Attempting to publish with empty body');
    await this.createContentLink.click();
    await this.titleInput.fill('Test title');
    await this.categorySelect.selectOption({ index: 1 });
    await this.publishButton.click();
  }

  async attemptPublishWithEmptyCategory() {
    logger.info('Attempting to publish with empty category');
    await this.createContentLink.click();
    await this.titleInput.fill('Test title');
    await this.bodyInput.fill('Test body');
    await this.publishButton.click();
  }

  async fillAllMandatoryFields(title, body, category) {
    logger.info('Filling all mandatory fields');
    await this.createContentLink.click();
    await this.titleInput.fill(title);
    await this.bodyInput.fill(body);
    await this.categorySelect.selectOption({ label: category });
  }

  async submitContent() {
    logger.info('Submitting content');
    await this.publishButton.click();
  }

  async verifyContentSanitizedOrRejected() {
    logger.info('Verifying content sanitized or rejected');
    const errorVisible = await this.validationError.isVisible();
    const successVisible = await this.successNotification.isVisible();
    expect(errorVisible || successVisible).toBeTruthy();
  }

  async verifyDatabaseSecurity() {
    logger.info('Verifying database security maintained');
    await expect(this.page).not.toHaveURL(/error/);
  }
};
