const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    
    // Home page elements
    this.pageTitle = page.locator('h1, [data-testid="page-title"]');
    this.mainContent = page.locator('main, [data-testid="main-content"]');
    
    // Help Center entry point elements
    this.helpCenterEntryPoint = page.locator('[data-testid="help-center-link"], a:has-text("Help Center"), nav a:has-text("Help"), button:has-text("Help Center")');
    this.helpCenterSection = page.locator('[data-testid="help-center-section"], .help-center-section');
  }

  async navigate(url) {
    logger.info(`Navigating to Home Page: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async verifyPageLoaded() {
    logger.info('Verifying Home Page loaded');
    await expect(this.mainContent.or(this.pageTitle)).toBeVisible({ timeout: 10000 });
  }

  async verifyHelpCenterEntryPointVisible() {
    logger.info('Verifying Help Center entry point visible');
    await expect(this.helpCenterEntryPoint).toBeVisible({ timeout: 10000 });
  }

  async clickHelpCenterEntryPoint() {
    logger.info('Clicking Help Center entry point');
    await expect(this.helpCenterEntryPoint).toBeVisible();
    await expect(this.helpCenterEntryPoint).toBeEnabled();
    await this.helpCenterEntryPoint.click();
  }
};
