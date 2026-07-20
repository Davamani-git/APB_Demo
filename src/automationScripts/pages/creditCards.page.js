const { expect } = require('@playwright/test');

exports.CreditCardsPage = class CreditCardsPage {
  constructor(page) {
    this.page = page;
    this.summarySection = page.locator('#credit-cards-summary');
    this.cards = page.locator('[data-testid="credit-card-row"]');
  }

  async gotoCreditCardsSummary() {
    await expect(this.summarySection).toBeVisible();
  }

  async assertAllFieldsVisibleForEachCard() {
    const cardCount = await this.cards.count();
    for (let i = 0; i < cardCount; i++) {
      const card = this.cards.nth(i);
      await expect(card.locator('[data-testid="card-name"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-bank"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-number"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-credit-limit"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-available-credit"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-outstanding"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-billing-date"]')).toBeVisible();
      await expect(card.locator('[data-testid="card-due-date"]')).toBeVisible();
    }
  }

  async assertMaskedCardNumbers() {
    const cardCount = await this.cards.count();
    for (let i = 0; i < cardCount; i++) {
      const cardNumber = await this.cards.nth(i).locator('[data-testid="card-number"]').textContent();
      expect(cardNumber).toMatch(/\*{4,}/); // Masked portion
      expect(cardNumber).not.toMatch(/[0-9]{12,}/); // No full card number
    }
  }
};