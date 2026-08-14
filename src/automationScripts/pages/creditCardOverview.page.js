const { expect } = require('@playwright/test');

exports.CreditCardOverviewPage = class CreditCardOverviewPage {
  constructor(page) {
    this.page = page;
    this.overviewContainer = page.locator('.credit-card-overview, #credit-card-overview, [data-testid="credit-card-overview"]');
    this.cardItems = page.locator('.card-item, .credit-card, [data-testid="card-item"]');
    this.noCardsMessage = page.locator('.no-cards-message, .empty-state, [data-testid="no-cards-message"]');
    this.overviewLink = page.locator('a:has-text("Credit Cards"), a:has-text("Overview"), nav >> text=Cards');
  }

  async navigateToCreditCardOverview() {
    const linkVisible = await this.overviewLink.isVisible().catch(() => false);
    if (linkVisible) {
      await this.overviewLink.click();
    }
  }

  async waitForOverviewPageLoad() {
    await expect(this.overviewContainer.or(this.cardItems.first()).or(this.noCardsMessage)).toBeVisible({ timeout: 10000 });
  }

  async verifyCardCount(expectedCount) {
    if (expectedCount === 0) {
      await expect(this.cardItems).toHaveCount(0);
    } else {
      await expect(this.cardItems).toHaveCount(expectedCount);
    }
  }

  async verifyCardNumber(cardIndex, expectedMaskedNumber) {
    const cardNumberLocator = this.cardItems.nth(cardIndex).locator('.card-number, [data-testid="card-number"]');
    await expect(cardNumberLocator).toBeVisible();
    await expect(cardNumberLocator).toContainText(expectedMaskedNumber);
  }

  async verifyCreditLimit(cardIndex, expectedLimit) {
    const creditLimitLocator = this.cardItems.nth(cardIndex).locator('.credit-limit, [data-testid="credit-limit"]');
    await expect(creditLimitLocator).toBeVisible();
    await expect(creditLimitLocator).toContainText(expectedLimit);
  }

  async verifyAvailableBalance(cardIndex, expectedBalance) {
    const availableBalanceLocator = this.cardItems.nth(cardIndex).locator('.available-balance, [data-testid="available-balance"]');
    await expect(availableBalanceLocator).toBeVisible();
    await expect(availableBalanceLocator).toContainText(expectedBalance);
  }

  async verifyOutstandingAmount(cardIndex, expectedAmount) {
    const outstandingAmountLocator = this.cardItems.nth(cardIndex).locator('.outstanding-amount, [data-testid="outstanding-amount"]');
    await expect(outstandingAmountLocator).toBeVisible();
    await expect(outstandingAmountLocator).toContainText(expectedAmount);
  }

  async verifyNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    const messageText = await this.noCardsMessage.textContent();
    const hasExpectedMessage = messageText.includes('No credit cards') || 
                               messageText.includes('no cards') || 
                               messageText.includes('Please add a card');
    expect(hasExpectedMessage).toBeTruthy();
  }
};