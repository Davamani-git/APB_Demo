const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.helpCenterEntryPoint = page.locator('[data-testid="help-center-link"], a:has-text("Help Center"), .help-center-nav');
    this.navigationLinks = page.locator('[data-testid="nav-link"], nav a, .navigation-link');
    this.interactiveElements = page.locator('button, input, a, [role="button"]');
    this.ctaButtons = page.locator('[data-testid="cta-button"], .cta-btn, .call-to-action');
    this.signupForms = page.locator('[data-testid="signup-form"], form.signup, .registration-form');
    this.imageCarousels = page.locator('[data-testid="carousel"], .carousel, .slider');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-error');
    this.alternativeContact = page.locator('[data-testid="alternative-contact"], .contact-info, .support-contact');
  }

  async navigate() {
    await this.page.goto('https://app.example.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyHelpCenterEntryPointVisible() {
    await expect(this.helpCenterEntryPoint).toBeVisible();
  }

  async clickHelpCenterEntryPoint() {
    await this.helpCenterEntryPoint.click();
  }

  async measureHelpCenterLoadTime() {
    const startTime = Date.now();
    await this.page.waitForURL(/.*help-center.*/, { timeout: 3000 });
    const endTime = Date.now();
    return endTime - startTime;
  }

  async testAllNavigationLinks(expectedLinks) {
    for (const linkText of expectedLinks) {
      const link = this.page.locator(`a:has-text("${linkText}")`);
      await expect(link).toBeVisible();
      
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  }

  async testAllInteractiveElements() {
    const ctaCount = await this.ctaButtons.count();
    if (ctaCount > 0) {
      await expect(this.ctaButtons.first()).toBeVisible();
    }

    const formCount = await this.signupForms.count();
    if (formCount > 0) {
      await expect(this.signupForms.first()).toBeVisible();
    }

    const carouselCount = await this.imageCarousels.count();
    if (carouselCount > 0) {
      await expect(this.imageCarousels.first()).toBeVisible();
    }
  }

  async verifyLayoutConsistency() {
    const bodyElement = this.page.locator('body');
    await expect(bodyElement).toBeVisible();
    
    const hasOverflow = await this.page.evaluate(() => {
      return document.body.scrollWidth > document.body.clientWidth;
    });
    
    // Layout should not have unexpected horizontal overflow
    expect(hasOverflow).toBe(false);
  }

  async verifyHomePageLoadsCorrectly() {
    await expect(this.page).toHaveURL(/.*app.example.com/);
    await expect(this.helpCenterEntryPoint).toBeVisible();
  }

  async simulateHelpCenterServiceUnavailable() {
    await this.page.route('**/help-center**', route => {
      route.fulfill({
        status: 503,
        body: 'Service Unavailable'
      });
    });
  }

  async verifyHelpCenterUnavailableErrorDisplayed() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText('unavailable');
  }

  async verifyAlternativeContactInformationProvided(contactInfo) {
    for (const info of contactInfo) {
      const contactElement = this.page.locator(`text=${info}`);
      await expect(contactElement).toBeVisible();
    }
  }

  async verifyActionableNextStepsProvided() {
    const nextSteps = this.page.locator('[data-testid="next-steps"], .next-steps, text=/try again/i, text=/contact support/i');
    await expect(nextSteps).toBeVisible();
  }
};
