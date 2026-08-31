const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.helpCenterLink = page.locator('[data-testid="help-center-link"], a:has-text("Help Center")');
    this.homePageContent = page.locator('[data-testid="home-page"], .home-page-container');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-notification');
    this.backToHomeButton = page.locator('[data-testid="back-home"], a:has-text("Home")');
  }

  async navigate() {
    logger.info('Navigating to Home Page');
    await this.page.goto('https://app.example.com');
  }

  async verifyHomePageLoaded() {
    logger.info('Verifying Home Page loaded');
    await expect(this.homePageContent).toBeVisible();
  }

  async verifyHomePageDisplayed() {
    logger.info('Verifying Home Page displayed');
    await expect(this.homePageContent).toBeVisible();
  }

  async locateHelpCenterLink() {
    logger.info('Locating Help Center link');
    await expect(this.helpCenterLink).toBeVisible();
  }

  async verifyHelpCenterLinkVisible() {
    logger.info('Verifying Help Center link is visible');
    await expect(this.helpCenterLink).toBeVisible();
  }

  async clickHelpCenterLink() {
    logger.info('Clicking Help Center link');
    await this.helpCenterLink.click();
  }

  async verifyHelpCenterLinkBehavior() {
    logger.info('Verifying Help Center link behavior');
    const target = await this.helpCenterLink.getAttribute('target');
    logger.info(`Link target attribute: ${target}`);
  }

  async navigateAndMeasureLoadTime() {
    logger.info('Navigating and measuring load time');
    const startTime = Date.now();
    await this.page.goto('https://app.example.com');
    await this.page.waitForLoadState('load');
    const loadTime = Date.now() - startTime;
    logger.info(`Page load time: ${loadTime}ms`);
    return loadTime;
  }

  async verifyLoadTimeWithinThreshold(thresholdMs) {
    logger.info(`Verifying load time within ${thresholdMs}ms`);
    const loadTime = await this.navigateAndMeasureLoadTime();
    expect(loadTime).toBeLessThan(thresholdMs);
  }

  async clearCacheAndReload() {
    logger.info('Clearing cache and reloading');
    await this.page.context().clearCookies();
    await this.page.reload();
  }

  async verifyConsistentLoadTime(thresholdMs) {
    logger.info('Verifying consistent load time');
    for (let i = 0; i < 3; i++) {
      const loadTime = await this.navigateAndMeasureLoadTime();
      expect(loadTime).toBeLessThan(thresholdMs);
    }
  }

  async simulateHelpCenterUnavailability() {
    logger.info('Simulating Help Center unavailability');
    await this.page.route('**/helpcenter**', route => route.abort());
  }

  async verifyErrorMessageDisplayed(expectedMessage) {
    logger.info(`Verifying error message displayed: ${expectedMessage}`);
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async verifyCanNavigateBackToHome() {
    logger.info('Verifying can navigate back to Home');
    await expect(this.backToHomeButton).toBeVisible();
    await this.backToHomeButton.click();
    await expect(this.homePageContent).toBeVisible();
  }
};
