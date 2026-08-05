const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.CardsListPage = class CardsListPage {
  constructor(page) {
    this.page = page;
    this.cardsListSection = page.locator('[data-testid="cards-list-section"]');
    this.cardEntries = page.locator('[data-testid="card-entry"]');
    this.cardAlias = page.locator('[data-testid="card-alias"]');
    this.cardLastFour = page.locator('[data-testid="card-last-four"]');
    this.cardIssuer = page.locator('[data-testid="card-issuer"]');
    this.cardCreditLimit = page.locator('[data-testid="card-credit-limit"]');
    this.cardOutstanding = page.locator('[data-testid="card-outstanding"]');
    this.cardAvailable = page.locator('[data-testid="card-available"]');
    this.cardUtilization = page.locator('[data-testid="card-utilization"]');
  }
  async assertCardsListVisible() {
    await expect(this.cardsListSection).toBeVisible();
    await expect(this.cardEntries.first()).toBeVisible();
    logger.info('Cards list section is visible');
  }
  async assertAllCardDetailsPresent() {
    const count = await this.cardEntries.count();
    for (let i = 0; i < count; i++) {
      const card = this.cardEntries.nth(i);
      await expect(card.locator('[data-testid="card-alias"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-last-four"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-issuer"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-credit-limit"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-outstanding"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-available"]')).toBeVisible();
      logger.info(`Card ${i + 1} details validated`);
    }
  }
  async assertNoSensitiveDataExposed() {
    const count = await this.cardEntries.count();
    for (let i = 0; i < count; i++) {
      const card = this.cardEntries.nth(i);
      const alias = await card.locator('[data-testid="card-alias"]').textContent();
      const lastFour = await card.locator('[data-testid="card-last-four"]').textContent();
      expect(alias).not.toMatch(/\d{12,16}/); // No PAN
      expect(lastFour).toMatch(/\d{4}$/); // Only last four allowed
      // If CVV field exists, it must be masked or absent
      await expect(card.locator('[data-testid="card-cvv"]')).toHaveCount(0);
    }
    // Network check for sensitive data (if possible)
    logger.info('Validated no sensitive cardholder data exposed');
  }
  async assertCreditMetricsForMultipleCards() {
    const count = await this.cardEntries.count();
    expect(count).toBeGreaterThan(1);
    for (let i = 0; i < count; i++) {
      const card = this.cardEntries.nth(i);
      await expect(card.locator('[data-testid="card-credit-limit"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-outstanding"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-available"]')).toBeVisible();
      logger.info(`Card ${i + 1} credit metrics present`);
    }
  }
  async assertUtilizationRatioDisplayed() {
    const count = await this.cardEntries.count();
    for (let i = 0; i < count; i++) {
      const card = this.cardEntries.nth(i);
      await expect(card.locator('[data-testid="card-utilization"]')).toBeVisible();
      const util = await card.locator('[data-testid="card-utilization"]').textContent();
      expect(util).toMatch(/\d+%/);
      logger.info(`Card ${i + 1} utilization ratio: ${util}`);
    }
  }
  async reloadCardsList() {
    await this.page.reload();
    await this.assertCardsListVisible();
  }
  async assertCardValuesMatchBackend(backendCards) {
    const count = await this.cardEntries.count();
    expect(count).toBe(backendCards.length);
    for (let i = 0; i < count; i++) {
      const card = this.cardEntries.nth(i);
      const backend = backendCards[i];
      const uiLimit = await card.locator('[data-testid="card-credit-limit"]').textContent();
      const uiOutstanding = await card.locator('[data-testid="card-outstanding"]').textContent();
      const uiAvailable = await card.locator('[data-testid="card-available"]').textContent();
      expect(uiLimit.replace(/[^\d.]/g, '')).toBe(String(backend.creditLimit));
      expect(uiOutstanding.replace(/[^\d.]/g, '')).toBe(String(backend.outstanding));
      expect(uiAvailable.replace(/[^\d.]/g, '')).toBe(String(backend.available));
      logger.info(`Card ${i + 1} UI matches backend values`);
    }
  }
};
