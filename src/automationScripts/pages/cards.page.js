const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    this.navigationMenu = page.locator('.nav');
    this.myCardsNavLink = page.locator('.nav a[href="#!/cards"]');
    this.cardListContainer = page.locator('.card-list');
    this.cardItems = page.locator('.card-item');
    this.selectedCardItem = page.locator('.card-item.selected');
    this.transactionHistorySection = page.locator('.transactions-section');
    this.transactionHistoryHeader = page.locator('.transactions-section h3');
    this.transactionItems = page.locator('.transaction-item');
  }

  async navigate() {
    await this.page.goto('index.html');
    await expect(this.page).toHaveURL(/index.html/);
  }

  async clickMyCardsNav() {
    await expect(this.myCardsNavLink).toBeVisible();
    await this.myCardsNavLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getAllCardItems() {
    const count = await this.cardItems.count();
    if (count === 0) return [];
    return await this.cardItems.all();
  }

  getCardByName(cardName) {
    return this.page.locator(`.card-item:has-text("${cardName}")`);
  }

  getCardByLastFour(lastFour) {
    return this.page.locator(`.card-item:has-text("${lastFour}")`);
  }

  async getCardDetails(cardName) {
    const card = this.getCardByName(cardName);
    await expect(card).toBeVisible();
    return await card.textContent();
  }

  async selectCard(cardName) {
    const card = this.getCardByName(cardName);
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForTimeout(500);
  }

  getSelectedCard() {
    return this.selectedCardItem;
  }

  async getAllTransactions() {
    const count = await this.transactionItems.count();
    if (count === 0) return [];
    return await this.transactionItems.all();
  }

  async getTransactionDetails(index) {
    const transaction = this.transactionItems.nth(index);
    await expect(transaction).toBeVisible();
    return await transaction.textContent();
  }

  async verifyTransactionHistoryVisible() {
    await expect(this.transactionHistorySection).toBeVisible();
    await expect(this.transactionHistoryHeader).toBeVisible();
  }

  async verifyCardSelected(cardName) {
    const selectedCard = await this.getSelectedCard();
    const selectedText = await selectedCard.textContent();
    expect(selectedText).toContain(cardName);
  }
};