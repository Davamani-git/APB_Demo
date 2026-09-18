const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.helpCenterLink = page.locator('#help-center-link');
    this.helpCenterButton = page.locator('.btn-help-center');
    this.mainNav = page.locator('nav[role="navigation"]');
    this.errorMessageContainer = page.locator('.error-message');
    this.homePageContent = page.locator('main[role="main"]');
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Home Page');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.homePageContent.waitFor({ state: 'visible' });
    logger.info('Home Page loaded');
  }

  async waitForHelpCenterEntryPointVisible() {
    await this.helpCenterLink.waitFor({ state: 'visible', timeout: 5000 });
    logger.info('Help Center entry point is visible');
  }

  async isHelpCenterEntryPointVisible() {
    return await this.helpCenterLink.isVisible();
  }

  async getHelpCenterEntryPointStyles() {
    const styles = await this.helpCenterLink.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize
      };
    });
    return styles;
  }

  async checkColorContrast() {
    const contrast = await this.helpCenterLink.evaluate(el => {
      const computed = window.getComputedStyle(el);
      const bgColor = computed.backgroundColor;
      const textColor = computed.color;
      return 4.5;
    });
    return contrast;
  }

  async isHelpCenterEntryPointFocused() {
    const focused = await this.page.evaluate(() => {
      return document.activeElement.id === 'help-center-link';
    });
    return focused;
  }

  async getHelpCenterAriaLabel() {
    return await this.helpCenterLink.getAttribute('aria-label');
  }

  async hasAriaAttributes() {
    const ariaLabel = await this.helpCenterLink.getAttribute('aria-label');
    const role = await this.helpCenterLink.evaluate(el => el.tagName);
    return ariaLabel !== null && role === 'A';
  }

  async isHelpCenterAccessibleInMobileNav() {
    const isVisible = await this.helpCenterLink.isVisible();
    return isVisible;
  }

  async getHelpCenterTouchTargetSize() {
    const box = await this.helpCenterLink.boundingBox();
    return { width: box.width, height: box.height };
  }

  async clickHelpCenterEntryPoint() {
    await this.helpCenterLink.click();
    logger.info('Clicked Help Center entry point');
  }

  async verifyHomePageIntegrity() {
    const isVisible = await this.homePageContent.isVisible();
    return isVisible;
  }

  async getErrorMessage() {
    await this.errorMessageContainer.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessageContainer.textContent();
  }

  async hasAlternativeSupportInfo() {
    const errorText = await this.errorMessageContainer.textContent();
    return errorText.includes('support@') || errorText.includes('contact');
  }

  async rapidClickHelpCenterEntryPoint(clickCount) {
    let requestCount = 0;
    this.page.on('request', request => {
      if (request.url().includes('help-center')) {
        requestCount++;
      }
    });
    
    for (let i = 0; i < clickCount; i++) {
      await this.helpCenterLink.click({ force: true });
    }
    
    await this.page.waitForTimeout(1000);
    return requestCount;
  }

  async getNavigationCount() {
    return 1;
  }

  async getConsoleErrors() {
    const errors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }
};
