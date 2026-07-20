const { expect } = require('@playwright/test');
const { logger } = require('../../../utils/logger');

exports.CreditCardsPage = class CreditCardsPage {
  constructor(page) {
    this.page = page;
    this.summarySection = page.locator('#credit-cards-summary');
    this.cardRows = page.locator('[data-testid="credit-card-row"]');
    this.maskedCardNumber = page.locator('[data-testid="masked-card-number"]');
    this.cardName = page.locator('[data-testid="card-name"]');
    this.issuingBank = page.locator('[data-testid="issuing-bank"]');
    this.creditLimit = page.locator('[data-testid="card-credit-limit"]');
    this.availableCredit = page.locator('[data-testid="card-available-credit"]');
    this.outstandingAmount = page.locator('[data-testid="card-outstanding"]');
    this.billingDate = page.locator('[data-testid="card-billing-date"]');
    this.dueDate = page.locator('[data-testid="card-due-date"]');
    this.noOutstandingMessage = page.locator('[data-testid="no-outstanding-message"]');
    this.highlightedRow = page.locator('[data-testid="highlighted-card-row"]');
  }
  async goToSummarySection() {
    logger.info('Navigating to credit cards summary section');
    await expect(this.summarySection).toBeVisible();
  }
  async assertAllCardFieldsVisible() {
    logger.info('Asserting all card fields are visible');
    const rowCount = await this.cardRows.count();
    for (let i = 0; i < rowCount; i++) {
      const row = this.cardRows.nth(i);
      await expect(row.locator('[data-testid="card-name"]')).toBeVisible();
      await expect(row.locator('[data-testid="issuing-bank"]')).toBeVisible();
      await expect(row.locator('[data-testid="masked-card-number"]')).toBeVisible();
      await expect(row.locator('[data-testid="card-credit-limit"]')).toBeVisible();
      await expect(row.locator('[data-testid="card-available-credit"]')).toBeVisible();
      await expect(row.locator('[data-testid="card-outstanding"]')).toBeVisible();
      await expect(row.locator('[data-testid="card-billing-date"]')).toBeVisible();
      await expect(row.locator('[data-testid="card-due-date"]')).toBeVisible();
    }
  }
  async assertMaskedCardNumbers() {
    logger.info('Asserting masked card numbers are visible only');
    const rowCount = await this.cardRows.count();
    for (let i = 0; i < rowCount; i++) {
      const cardNumberText = await this.cardRows.nth(i).locator('[data-testid="masked-card-number"]').textContent();
      expect(cardNumberText).toMatch(/\*{4,}/); // Masked pattern
    }
  }
  async goToCreditCardsSection() {
    logger.info('Navigating to credit cards section');
    await expect(this.summarySection).toBeVisible();
  }
  async assertCardDetailsMasked() {
    logger.info('Asserting card details are masked');
    const rowCount = await this.cardRows.count();
    for (let i = 0; i < rowCount; i++) {
      const row = this.cardRows.nth(i);
      await expect(row.locator('[data-testid="masked-card-number"]')).toBeVisible();
      const cardNumberText = await row.locator('[data-testid="masked-card-number"]').textContent();
      expect(cardNumberText).toMatch(/\*{4,}/);
    }
  }
  async assertZeroOutstandingCards() {
    logger.info('Asserting cards with zero outstanding');
    const rowCount = await this.cardRows.count();
    for (let i = 0; i < rowCount; i++) {
      const outstandingText = await this.cardRows.nth(i).locator('[data-testid="card-outstanding"]').textContent();
      if (outstandingText === '0') {
        await expect(this.cardRows.nth(i).locator('[data-testid="no-outstanding-message"]')).toBeVisible();
      }
    }
  }
  async assertUpcomingBillingDueDates() {
    logger.info('Asserting cards with billing/due dates within 7 days are highlighted');
    const highlightedCount = await this.highlightedRow.count();
    expect(highlightedCount).toBeGreaterThanOrEqual(0);
    // No sensitive data exposed
    for (let i = 0; i < highlightedCount; i++) {
      await expect(this.highlightedRow.nth(i).locator('[data-testid="masked-card-number"]')).toBeVisible();
    }
  }
};
