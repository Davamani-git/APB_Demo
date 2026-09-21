const { expect } = require('@playwright/test');

exports.CardDetailPage = class CardDetailPage {
  constructor(page) {
    this.page = page;
    this.cardDetailContainer = page.locator('.card-detail-container');
    this.cardKPIs = page.locator('.card-kpis');
    this.creditLimitKPI = page.locator('kpi-card').filter({ hasText: 'Credit Limit' });
    this.availableCreditKPI = page.locator('kpi-card').filter({ hasText: 'Available Credit' });
    this.outstandingBalanceKPI = page.locator('kpi-card').filter({ hasText: 'Outstanding Balance' });
    this.errorMessage = page.locator('.error-message, .alert-error');
    this.loadingIndicator = page.locator('.loading');
    this.kpiCards = page.locator('.kpi-card');
  }

  async verifyCardDetailPageLoaded() {
    await expect(this.cardDetailContainer).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 }).catch(() => {});
  }

  async verifyCreditLimitKPI(expectedValue) {
    await expect(this.creditLimitKPI).toBeVisible();
    const kpiValue = this.creditLimitKPI.locator('.kpi-value');
    await expect(kpiValue).toContainText(expectedValue);
  }

  async verifyAvailableCreditKPI(expectedValue) {
    await expect(this.availableCreditKPI).toBeVisible();
    const kpiValue = this.availableCreditKPI.locator('.kpi-value');
    await expect(kpiValue).toContainText(expectedValue);
  }

  async verifyOutstandingBalanceKPI(expectedValue) {
    await expect(this.outstandingBalanceKPI).toBeVisible();
    const kpiValue = this.outstandingBalanceKPI.locator('.kpi-value');
    await expect(kpiValue).toContainText(expectedValue);
  }

  async verifyAllKPIsReadable() {
    const cards = await this.kpiCards.all();
    for (const card of cards) {
      await expect(card).toBeVisible();
      const cardText = await card.textContent();
      expect(cardText.length).toBeGreaterThan(0);
      const kpiValue = card.locator('.kpi-value');
      await expect(kpiValue).toBeVisible();
    }
  }

  async navigateToDeactivatedCard() {
    await this.page.goto('https://app.creditcard.com/cards/999999');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(/no longer accessible|card data is unavailable|not found/i);
  }

  async verifyRedirectToValidPage() {
    await this.page.waitForURL(/.*\/(dashboard|cards)/, { timeout: 5000 });
    const currentURL = this.page.url();
    expect(currentURL).toMatch(/\/(dashboard|cards)/);
  }
};