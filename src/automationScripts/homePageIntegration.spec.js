const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/home.page');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const logger = require('../utils/logger');

test.describe('Home Page Help Center Integration', () => {

  test('TC-024: Help Center link navigates to Help Center landing page', async ({ page }) => {
    logger.info('Starting test: TC-024 - Help Center navigation');
    const homePage = new HomePage(page);
    const helpCenter = new HelpCenterPage(page);
    
    await homePage.navigate();
    await homePage.verifyHomePageLoaded();
    
    await homePage.locateHelpCenterLink();
    await homePage.verifyHelpCenterLinkVisible();
    
    await homePage.clickHelpCenterLink();
    await helpCenter.verifyHelpCenterLandingPageLoaded();
    await helpCenter.verifyAllExpectedContentDisplayed();
    
    logger.info('Test TC-024 completed successfully');
  });

  test('TC-025: Help Center link opens according to configured behavior', async ({ page }) => {
    logger.info('Starting test: TC-025 - Help Center link behavior');
    const homePage = new HomePage(page);
    const helpCenter = new HelpCenterPage(page);
    
    await homePage.navigate();
    await homePage.verifyHomePageDisplayed();
    
    await homePage.verifyHelpCenterLinkBehavior();
    await homePage.clickHelpCenterLink();
    
    await helpCenter.verifyHelpCenterContentLoaded();
    
    logger.info('Test TC-025 completed successfully');
  });

  test('TC-026: Home Page load time remains within acceptable thresholds', async ({ page }) => {
    logger.info('Starting test: TC-026 - Home Page performance');
    const homePage = new HomePage(page);
    
    await homePage.navigateAndMeasureLoadTime();
    await homePage.verifyLoadTimeWithinThreshold(3000);
    
    await homePage.clearCacheAndReload();
    await homePage.verifyConsistentLoadTime(3000);
    
    logger.info('Test TC-026 completed successfully');
  });

  test('TC-027: Help Center unavailability shows meaningful error', async ({ page }) => {
    logger.info('Starting test: TC-027 - Help Center service unavailable');
    const homePage = new HomePage(page);
    
    await homePage.navigate();
    await homePage.verifyHomePageLoaded();
    
    await homePage.simulateHelpCenterUnavailability();
    await homePage.clickHelpCenterLink();
    
    await homePage.verifyErrorMessageDisplayed('Help Center is temporarily unavailable');
    await homePage.verifyCanNavigateBackToHome();
    
    logger.info('Test TC-027 completed successfully');
  });

});
