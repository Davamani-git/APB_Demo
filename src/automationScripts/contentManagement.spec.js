const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { ContentManagementPage } = require('./pages/contentManagement.page');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const logger = require('../utils/logger');

test.describe('Content Management and Categorization', () => {

  test('TC-013: Administrator can assign content to category and retrieve it', async ({ page }) => {
    logger.info('Starting test: TC-013 - Content assignment and retrieval');
    const loginPage = new LoginPage(page);
    const contentMgmt = new ContentManagementPage(page);
    const helpCenter = new HelpCenterPage(page);
    
    await loginPage.navigate();
    await loginPage.login('admin@example.com', 'Admin@123');
    await contentMgmt.verifyDashboardLoaded();
    
    await contentMgmt.navigateToContentManagement();
    await contentMgmt.verifyContentManagementDisplayed();
    
    await contentMgmt.createOrSelectContent('How to reset password');
    await contentMgmt.assignCategory('FAQs');
    await contentMgmt.saveAndPublishContent();
    await contentMgmt.verifyContentPublished();
    
    await helpCenter.navigate();
    await helpCenter.browseCategoryByName('FAQs');
    await helpCenter.verifyContentVisibleInCategory('How to reset password');
    
    logger.info('Test TC-013 completed successfully');
  });

  test('TC-014: All valid categories are available in dropdown', async ({ page }) => {
    logger.info('Starting test: TC-014 - Valid categories in dropdown');
    const loginPage = new LoginPage(page);
    const contentMgmt = new ContentManagementPage(page);
    
    await loginPage.navigate();
    await loginPage.login('admin@example.com', 'Admin@123');
    await contentMgmt.verifyDashboardLoaded();
    
    await contentMgmt.openContentEditor();
    await contentMgmt.verifyCategoryDropdownDisplayed();
    
    await contentMgmt.clickCategoryDropdown();
    await contentMgmt.verifyCategoryOptionsDisplayed([
      'Getting Started',
      'FAQs',
      'How-to Guides',
      'Video Tutorials',
      'Help Materials',
      'Troubleshooting'
    ]);
    
    logger.info('Test TC-014 completed successfully');
  });

  test('TC-015: Content appears only in assigned category', async ({ page }) => {
    logger.info('Starting test: TC-015 - Content category isolation');
    const loginPage = new LoginPage(page);
    const contentMgmt = new ContentManagementPage(page);
    const helpCenter = new HelpCenterPage(page);
    
    await loginPage.navigate();
    await loginPage.login('admin@example.com', 'Admin@123');
    await contentMgmt.verifyDashboardLoaded();
    
    await contentMgmt.createAndPublishContent('Welcome Guide', 'Getting Started');
    await contentMgmt.verifyContentPublished();
    
    await contentMgmt.createAndPublishContent('Common Questions', 'FAQs');
    await contentMgmt.verifyContentPublished();
    
    await contentMgmt.createAndPublishContent('Error Resolution Guide', 'Troubleshooting');
    await contentMgmt.verifyContentPublished();
    
    await helpCenter.navigate();
    await helpCenter.browseCategoryByName('Getting Started');
    await helpCenter.verifyContentVisibleInCategory('Welcome Guide');
    
    await helpCenter.browseCategoryByName('FAQs');
    await helpCenter.verifyContentVisibleInCategory('Common Questions');
    
    await helpCenter.browseCategoryByName('Troubleshooting');
    await helpCenter.verifyContentVisibleInCategory('Error Resolution Guide');
    
    logger.info('Test TC-015 completed successfully');
  });

  test('TC-016: Category displays correct content count', async ({ page }) => {
    logger.info('Starting test: TC-016 - Category content count');
    const loginPage = new LoginPage(page);
    const contentMgmt = new ContentManagementPage(page);
    const helpCenter = new HelpCenterPage(page);
    
    await loginPage.navigate();
    await loginPage.login('admin@example.com', 'Admin@123');
    await contentMgmt.verifyDashboardLoaded();
    
    await contentMgmt.createAndPublishContent('FAQ1', 'FAQs');
    await contentMgmt.createAndPublishContent('FAQ2', 'FAQs');
    await contentMgmt.createAndPublishContent('FAQ3', 'FAQs');
    
    await helpCenter.navigate();
    await helpCenter.browseCategoryByName('FAQs');
    await helpCenter.verifyCategoryItemCount(3);
    await helpCenter.verifyAllContentItemsVisible(['FAQ1', 'FAQ2', 'FAQ3']);
    
    logger.info('Test TC-016 completed successfully');
  });

  test('TC-017: Publishing content without category shows validation error', async ({ page }) => {
    logger.info('Starting test: TC-017 - Category validation');
    const loginPage = new LoginPage(page);
    const contentMgmt = new ContentManagementPage(page);
    
    await loginPage.navigate();
    await loginPage.login('admin@example.com', 'Admin@123');
    await contentMgmt.verifyDashboardLoaded();
    
    await contentMgmt.navigateToContentManagement();
    await contentMgmt.createNewContent();
    
    await contentMgmt.fillContentTitle('Test Content');
    await contentMgmt.fillContentBody('Test description');
    await contentMgmt.leaveCategoryUnselected();
    
    await contentMgmt.attemptPublish();
    await contentMgmt.verifyValidationError('Category is required');
    
    logger.info('Test TC-017 completed successfully');
  });

});
