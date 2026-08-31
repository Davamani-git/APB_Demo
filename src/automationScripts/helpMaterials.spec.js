const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const { HelpMaterialsPage } = require('./pages/helpMaterials.page');
const { LoginPage } = require('./pages/login.page');
const logger = require('../utils/logger');

test.describe('Help Materials Download Functionality', () => {

  test('TC-028: User can download help material in correct format', async ({ page }) => {
    logger.info('Starting test: TC-028 - Download help material');
    const helpCenter = new HelpCenterPage(page);
    const materials = new HelpMaterialsPage(page);
    
    await helpCenter.navigate();
    await helpCenter.verifyPageLoaded();
    
    await materials.navigateToHelpMaterials();
    await materials.verifyHelpMaterialsDisplayed();
    
    await materials.selectMaterial('User Guide PDF');
    await materials.verifyDownloadOptionAvailable();
    
    await materials.clickDownload();
    await materials.verifyDownloadInitiated();
    await materials.verifyFileDownloadedWithExtension('.pdf');
    await materials.verifyFileOpensSuccessfully();
    await materials.verifyFileIntegrity();
    
    logger.info('Test TC-028 completed successfully');
  });

  test('TC-029: Multiple file formats download correctly', async ({ page }) => {
    logger.info('Starting test: TC-029 - Multiple file formats');
    const helpCenter = new HelpCenterPage(page);
    const materials = new HelpMaterialsPage(page);
    
    await materials.navigateToHelpMaterialsSection();
    await materials.verifyMaterialsAvailable();
    
    await materials.downloadMaterial('Quick Reference Guide.pdf');
    await materials.verifyPDFDownloadedAndComplete();
    
    await materials.downloadMaterial('Training Document.docx');
    await materials.verifyDOCXDownloadedAndComplete();
    
    logger.info('Test TC-029 completed successfully');
  });

  test('TC-030: Corrupted or unavailable file shows error message', async ({ page }) => {
    logger.info('Starting test: TC-030 - Corrupted file error');
    const materials = new HelpMaterialsPage(page);
    
    await materials.navigateToHelpMaterialsSection();
    await materials.verifyMaterialsListed();
    
    await materials.selectCorruptedOrUnavailableFile('corrupted_guide.pdf');
    await materials.attemptDownload();
    
    await materials.verifyDownloadErrorDisplayed('Download failed. The file is currently unavailable');
    
    logger.info('Test TC-030 completed successfully');
  });

  test('TC-031: Unauthenticated user cannot download restricted materials', async ({ page }) => {
    logger.info('Starting test: TC-031 - Unauthenticated download restriction');
    const helpCenter = new HelpCenterPage(page);
    const materials = new HelpMaterialsPage(page);
    
    await helpCenter.navigateWithoutLogin();
    await helpCenter.verifyUnauthenticatedState();
    
    await materials.navigateToHelpMaterials();
    await materials.verifyHelpMaterialsDisplayed();
    
    await materials.attemptDownloadRestrictedMaterial('Premium Training Guide.pdf');
    await materials.verifyAccessDenied();
    await materials.verifyAuthorizationErrorMessage('You must be logged in to download this material');
    
    logger.info('Test TC-031 completed successfully');
  });

  test('TC-032: User permissions control access to premium materials', async ({ page }) => {
    logger.info('Starting test: TC-032 - Permission-based access');
    const loginPage = new LoginPage(page);
    const materials = new HelpMaterialsPage(page);
    
    await loginPage.navigate();
    await loginPage.login('basicuser@example.com', 'User@123');
    await loginPage.verifyAuthenticationSuccess();
    
    await materials.navigateToHelpMaterials();
    await materials.verifyHelpMaterialsDisplayed();
    
    await materials.attemptDownloadRestrictedMaterial('Advanced Admin Guide.pdf');
    await materials.verifyAccessDenied();
    await materials.verifyAuthorizationErrorMessage('You do not have permission to download this material');
    
    await loginPage.logout();
    await loginPage.login('premiumuser@example.com', 'Premium@123');
    await loginPage.verifyAuthenticationSuccess();
    
    await materials.navigateToHelpMaterials();
    await materials.attemptDownloadRestrictedMaterial('Advanced Admin Guide.pdf');
    await materials.verifyDownloadSuccessful();
    
    logger.info('Test TC-032 completed successfully');
  });

});
