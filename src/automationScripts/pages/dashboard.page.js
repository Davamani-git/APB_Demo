const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeader = page.locator('.dashboard-header h1');
    this.dashboardNav = page.locator('.dashboard-nav');
    this.kpiSection = page.locator('.kpi-section');
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend") .kpi-value');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit") .kpi-value');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit") .kpi-value');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding Amount") .kpi-value');
    this.loadingIndicator = page.locator('.loading');
    this.noCardsMessage = page.locator('text=/No credit cards found|Add a card to get started/i');
    this.allKPICards = page.locator('.kpi-card');
  }

  async navigate() {
    await this.page.goto('#!/dashboard');
    await this.page.waitForLoadState('networkidle');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
  }

  async verifyMultipleCardsExist(cardNames) {
    for (const cardName of cardNames) {
      const cardLocator = this.page.locator(`text=${cardName}`);
      await expect(cardLocator).toBeVisible({ timeout: 5000 });
    }
  }

  async verifySingleCardExists(cardName) {
    const cardLocator = this.page.locator(`text=${cardName}`);
    await expect(cardLocator).toBeVisible({ timeout: 5000 });
  }

  async verifyMonthlySpendKPI(expectedValue) {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    const numericValue = text.replace(/[^0-9]/g, '');
    expect(numericValue).toBe(expectedValue);
  }

  async verifyTotalCreditLimitKPI(expectedValue) {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    const numericValue = text.replace(/[^0-9]/g, '');
    expect(numericValue).toBe(expectedValue);
  }

  async verifyAvailableCreditKPI(expectedValue) {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    const numericValue = text.replace(/[^0-9]/g, '');
    expect(numericValue).toBe(expectedValue);
  }

  async verifyOutstandingAmountKPI(expectedValue) {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    const numericValue = text.replace(/[^0-9]/g, '');
    expect(numericValue).toBe(expectedValue);
  }

  async verifyNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyNavigationFunctional() {
    await expect(this.dashboardNav).toBeVisible();
    const navLinks = this.dashboardNav.locator('a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(navLinks.nth(i)).toBeVisible();
    }
  }

  async verifyAllKPICardsVisible() {
    await expect(this.allKPICards).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(this.allKPICards.nth(i)).toBeVisible();
    }
  }

  async verifyKPITextReadability() {
    const kpiCards = await this.allKPICards.all();
    for (const card of kpiCards) {
      const heading = card.locator('h3');
      const value = card.locator('.kpi-value');
      await expect(heading).toBeVisible();
      await expect(value).toBeVisible();
      const headingBox = await heading.boundingBox();
      const valueBox = await value.boundingBox();
      expect(headingBox).not.toBeNull();
      expect(valueBox).not.toBeNull();
    }
  }

  async verifyResponsiveLayout() {
    await expect(this.kpiSection).toBeVisible();
    const kpiSectionBox = await this.kpiSection.boundingBox();
    expect(kpiSectionBox.width).toBeLessThanOrEqual(this.page.viewportSize().width);
  }

  async verifyAllKPIsVisibleWithoutHorizontalScroll() {
    const viewportWidth = this.page.viewportSize().width;
    const bodyScrollWidth = await this.page.evaluate(() => document.body.scrollWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 20);
    await expect(this.allKPICards).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(this.allKPICards.nth(i)).toBeVisible();
    }
  }

  async verifyKPIValuesNotTruncated(expectedValues) {
    const kpiValues = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (let i = 0; i < kpiValues.length; i++) {
      await expect(kpiValues[i]).toBeVisible();
      const text = await kpiValues[i].textContent();
      const numericValue = text.replace(/[^0-9]/g, '');
      expect(numericValue).toBe(expectedValues[i]);
    }
  }

  async verifyTouchTargetsUsable() {
    const navLinks = this.dashboardNav.locator('a');
    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      const box = await navLinks.nth(i).boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  }

  async verifyMinimumViableView() {
    await expect(this.dashboardHeader).toBeVisible();
    await expect(this.kpiSection).toBeVisible();
  }

  async verifyKPIValuesPresent(expectedValues) {
    const kpiValues = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (let i = 0; i < kpiValues.length; i++) {
      await expect(kpiValues[i]).toBeVisible();
      const text = await kpiValues[i].textContent();
      expect(text).toBeTruthy();
    }
  }

  async verifyNoJavaScriptErrors() {
    const errors = [];
    this.page.on('pageerror', error => errors.push(error));
    await this.page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  }
};