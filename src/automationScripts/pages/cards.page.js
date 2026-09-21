const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    this.cardsContainer = page.locator('.cards-container');
    this.cardList = page.locator('.card-list');
    this.cardItems = page.locator('.card-item');
    this.noCardsMessage = page.locator('.no-cards-message, .empty-state-message');
    this.loadingIndicator = page.locator('.loading');
    this.myCardsNavLink = page.locator('a[href*="cards"]');
  }

  async navigateToCardsSection() {
    await expect(this.myCardsNavLink).toBeVisible();
    await this.myCardsNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyCardListLoaded() {
    await expect(this.cardsContainer).toBeVisible();
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 }).catch(() => {});
  }

  async verifyCardCount(expectedCount) {
    if (expectedCount === 0) {
      const count = await this.cardItems.count();
      expect(count).toBe(0);
    } else {
      await expect(this.cardItems).toHaveCount(expectedCount);
    }
  }

  async verifyCardName(index, expectedName) {
    const cardItem = this.cardItems.nth(index);
    await expect(cardItem).toBeVisible();
    const cardHeader = cardItem.locator('.card-header h3');
    await expect(cardHeader).toContainText(expectedName);
  }

  async verifyCardNumber(index, expectedLast4) {
    const cardItem = this.cardItems.nth(index);
    await expect(cardItem).toBeVisible();
    const cardNumber = cardItem.locator('.card-number');
    await expect(cardNumber).toContainText(expectedLast4);
  }

  async verifyNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    await expect(this.noCardsMessage).toContainText(/no credit cards|not linked any credit cards/i);
  }

  async selectCard(index) {
    const cardItem = this.cardItems.nth(index);
    await expect(cardItem).toBeVisible();
    const viewDetailsButton = cardItem.locator('.btn-view-details, a[href*="cards/"]');
    await expect(viewDetailsButton).toBeVisible();
    await viewDetailsButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCardByName(cardName) {
    const cardItem = this.cardItems.filter({ hasText: cardName });
    await expect(cardItem).toBeVisible();
    const viewDetailsButton = cardItem.locator('.btn-view-details, a[href*="cards/"]');
    await expect(viewDetailsButton).toBeVisible();
    await viewDetailsButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};