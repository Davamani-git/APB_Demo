const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { ContentAuthoringPage } = require('./pages/contentAuthoring.page');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const logger = require('../utils/logger');

test.describe('Content Authoring Interface', () => {

  test('TC-018: Non-technical author can create and publish content', async ({ page }) => {
    logger.info('Starting test: TC-018 - Author creates content');
    const loginPage = new LoginPage(page);
    const authoring = new ContentAuthoringPage(page);
    const helpCenter = new HelpCenterPage(page);
    
    await loginPage.navigate();
    await loginPage.login('author@example.com', 'Author@123');
    await authoring.verifyAuthorDashboardLoaded();
    
    await authoring.navigateToCreateNewContent();
    await authoring.verifyContentCreationInterfaceDisplayed();
    
    await authoring.enterContentTitle('How to Update Profile');
    await authoring.enterContentBody('Step 1: Click Profile. Step 2: Edit details. Step 3: Save.');
    await authoring.addMetadata('How-to Guides', ['profile', 'update']);
    
    await authoring.clickPublish();
    await authoring.verifyContentSubmitted();
    
    await helpCenter.navigate();
    await helpCenter.verifyContentAvailable('How to Update Profile');
    
    logger.info('Test TC-018 completed successfully');
  });

  test('TC-019: Author can apply formatting without technical knowledge', async ({ page }) => {
    logger.info('Starting test: TC-019 - Content formatting');
    const loginPage = new LoginPage(page);
    const authoring = new ContentAuthoringPage(page);
    const helpCenter = new HelpCenterPage(page);
    
    await loginPage.navigate();
    await loginPage.login('author@example.com', 'Author@123');
    await authoring.verifyAuthorDashboardLoaded();
    
    await authoring.openContentEditor();
    await authoring.verifyFormattingToolbarDisplayed();
    await authoring.verifyFormattingOptionsAvailable(['bold', 'italic', 'underline', 'lists', 'links']);
    
    await authoring.enterContentTitle('Formatted Content');
    await authoring.applyFormatting('bold', 'Bold text');
    await authoring.applyFormatting('list', 'Item 1');
    await authoring.applyFormatting('link', 'Click here');
    await authoring.addMetadata('FAQs', ['formatting']);
    
    await authoring.publishContent();
    await authoring.verifyContentPublished();
    
    await helpCenter.navigate();
    await helpCenter.verifyFormattedContentDisplayed('Formatted Content');
    
    logger.info('Test TC-019 completed successfully');
  });

  test('TC-020: Publishing without title shows validation error', async ({ page }) => {
    logger.info('Starting test: TC-020 - Missing title validation');
    const loginPage = new LoginPage(page);
    const authoring = new ContentAuthoringPage(page);
    
    await loginPage.navigate();
    await loginPage.login('author@example.com', 'Author@123');
    await authoring.verifyAuthorDashboardLoaded();
    
    await authoring.openContentEditor();
    await authoring.verifyContentFormDisplayed();
    
    await authoring.leaveTitleEmpty();
    await authoring.fillContentBody('Test content');
    await authoring.selectCategory('FAQs');
    
    await authoring.attemptPublish();
    await authoring.verifyValidationError('Title is required');
    
    logger.info('Test TC-020 completed successfully');
  });

  test('TC-021: All mandatory fields must be filled to publish', async ({ page }) => {
    logger.info('Starting test: TC-021 - All mandatory fields validation');
    const loginPage = new LoginPage(page);
    const authoring = new ContentAuthoringPage(page);
    
    await loginPage.navigate();
    await loginPage.login('author@example.com', 'Author@123');
    await authoring.verifyAuthorDashboardLoaded();
    
    await authoring.openContentEditor();
    await authoring.attemptPublishWithEmptyTitle();
    await authoring.verifyValidationError('Title is required');
    
    await authoring.openContentEditor();
    await authoring.attemptPublishWithEmptyBody();
    await authoring.verifyValidationError('Body is required');
    
    await authoring.openContentEditor();
    await authoring.attemptPublishWithEmptyCategory();
    await authoring.verifyValidationError('Category is required');
    
    await authoring.openContentEditor();
    await authoring.fillAllMandatoryFields('Test Title', 'Test Body', 'FAQs');
    await authoring.publishContent();
    await authoring.verifyContentPublished();
    
    logger.info('Test TC-021 completed successfully');
  });

  test('TC-022: System sanitizes malicious script content', async ({ page }) => {
    logger.info('Starting test: TC-022 - Script sanitization');
    const loginPage = new LoginPage(page);
    const authoring = new ContentAuthoringPage(page);
    const helpCenter = new HelpCenterPage(page);
    
    await loginPage.navigate();
    await loginPage.login('author@example.com', 'Author@123');
    await authoring.verifyAuthorDashboardLoaded();
    
    await authoring.navigateToCreateNewContent();
    await authoring.enterContentTitle('Test');
    await authoring.selectCategory('FAQs');
    await authoring.enterContentBody("<script>alert('XSS')</script>Legitimate content");
    
    await authoring.submitContent();
    await authoring.verifyContentSanitizedOrRejected();
    
    await helpCenter.navigate();
    await helpCenter.verifyNoScriptExecution();
    
    logger.info('Test TC-022 completed successfully');
  });

  test('TC-023: System prevents SQL injection in content body', async ({ page }) => {
    logger.info('Starting test: TC-023 - SQL injection prevention');
    const loginPage = new LoginPage(page);
    const authoring = new ContentAuthoringPage(page);
    
    await loginPage.navigate();
    await loginPage.login('author@example.com', 'Author@123');
    await authoring.verifyAuthorDashboardLoaded();
    
    await authoring.navigateToCreateNewContent();
    await authoring.enterContentTitle('SQL Test');
    await authoring.enterContentBody("'; DROP TABLE users; --");
    await authoring.selectCategory('FAQs');
    
    await authoring.submitContent();
    await authoring.verifyContentSanitizedOrRejected();
    await authoring.verifyDatabaseSecurity();
    
    logger.info('Test TC-023 completed successfully');
  });

});
