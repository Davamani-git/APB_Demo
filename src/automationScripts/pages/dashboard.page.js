const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('.dashboard-container');
    this.kpiGrid = page.locator('.kpi-grid');
    this.monthlySpendKPI = page.locator('kpi-card').filter({ hasText: 'Monthly Spend' });
    this.totalCreditLimitKPI = page.locator('kpi-card').filter({ hasText: 'Total Credit Limit' });
    this.availableCreditKPI = page.locator('kpi-card').filter({ hasText: 'Available Credit' });
    this.outstandingAmountKPI = page.locator('kpi-card').filter({ hasText: 'Outstanding Amount' });
    this.noCardMessage = page.locator('.no-card-message, .empty-state-message');
    this.loadingIndicator = page.locator('.loading');
    this.kpiCards = page.locator('.kpi-card');
  }

  async waitForDashboardToLoad() {
    await expect(this.dashboardContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 }).catch(() => {});
  }

  async verifyMonthlySpendKPI(expectedValue) {
    await expect(this.monthlySpendKPI).toBeVisible();
    const kpiValue = this.monthlySpendKPI.locator('.kpi-value');
    await expect(kpiValue).toContainText(expectedValue);
  }

  async verifyTotalCreditLimitKPI(expectedValue) {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const kpiValue = this.totalCreditLimitKPI.locator('.kpi-value');
    await expect(kpiValue).toContainText(expectedValue);
  }

  async verifyAvailableCreditKPI(expectedValue) {
    await expect(this.availableCreditKPI).toBeVisible();
    const kpiValue = this.availableCreditKPI.locator('.kpi-value');
    await expect(kpiValue).toContainText(expectedValue);
  }

  async verifyOutstandingAmountKPI(expectedValue) {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const kpiValue = this.outstandingAmountKPI.locator('.kpi-value');
    await expect(kpiValue).toContainText(expectedValue);
  }

  async verifyNoCardMessage() {
    await expect(this.noCardMessage).toBeVisible();
    await expect(this.noCardMessage).toContainText(/no credit cards|not linked any credit cards/i);
  }

  async verifyMultiColumnGridLayout() {
    await expect(this.kpiGrid).toBeVisible();
    const gridStyle = await this.kpiGrid.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('grid-template-columns');
    });
    expect(gridStyle).not.toBe('none');
    const kpiCount = await this.kpiCards.count();
    expect(kpiCount).toBeGreaterThan(0);
  }

  async verifyAllKPICardsReadable() {
    const cards = await this.kpiCards.all();
    for (const card of cards) {
      await expect(card).toBeVisible();
      const cardText = await card.textContent();
      expect(cardText.length).toBeGreaterThan(0);
    }
  }

  async verifyKPICardsSpacing() {
    const firstCard = this.kpiCards.first();
    await expect(firstCard).toBeVisible();
    const boundingBox = await firstCard.boundingBox();
    expect(boundingBox.width).toBeGreaterThan(0);
    expect(boundingBox.height).toBeGreaterThan(0);
  }

  async verifySingleColumnStackedLayout() {
    await expect(this.kpiGrid).toBeVisible();
    const gridStyle = await this.kpiGrid.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('grid-template-columns');
    });
    expect(gridStyle).toContain('1fr');
  }

  async verifyNoHorizontalScrolling() {
    const bodyWidth = await this.page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await this.page.viewportSize().width;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
  }

  async verifyTouchTargetSizes() {
    const buttons = this.page.locator('button, a');
    const buttonCount = await buttons.count();
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const boundingBox = await firstButton.boundingBox();
      expect(boundingBox.width).toBeGreaterThanOrEqual(40);
      expect(boundingBox.height).toBeGreaterThanOrEqual(40);
    }
  }

  async verifyWarningMessageOrGracefulDegradation() {
    const warningMessage = this.page.locator('.warning-message, .resolution-warning');
    const isWarningVisible = await warningMessage.isVisible().catch(() => false);
    if (isWarningVisible) {
      await expect(warningMessage).toContainText(/screen resolution|not optimal|larger screen/i);
    }
    await expect(this.dashboardContainer).toBeVisible();
  }

  async verifyNoLayoutBreakage() {
    const overlappingElements = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('.kpi-card');
      const rects = Array.from(elements).map(el => el.getBoundingClientRect());
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const overlap = !(
            rects[i].right < rects[j].left ||
            rects[i].left > rects[j].right ||
            rects[i].bottom < rects[j].top ||
            rects[i].top > rects[j].bottom
          );
          if (overlap) return true;
        }
      }
      return false;
    });
    expect(overlappingElements).toBe(false);
  }
};