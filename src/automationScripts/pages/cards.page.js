const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    this.cardsSection = page.locator('.cards-section, .cards-container');
    this.cardsList = page.locator('.cards-list, .cards-grid');
    this.cardItems = page.locator('.card-detail, .card-item');
    this.transactionsSection = page.locator('.transactions-section');
    this.transactionsTable = page.locator('.transactions-table, table');
    this.transactionRows = page.locator('.transactions-table tbody tr, table tbody tr');
    this.validationErrorMessage = page.locator('.validation-error, .error-message, :has-text("incomplete")');
    this.dataSourceErrorMessage = page.locator('.data-source-error, :has-text("unavailable")');
    this.navigationMenu = page.locator('.nav-menu, nav');
  }

  async navigate() {
    await this.page.goto('https://app.creditcarddashboard.com/#!/cards');
    await this.waitForCardsLoad();
  }

  async waitForCardsLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.cardsSection.or(this.validationErrorMessage).or(this.dataSourceErrorMessage)).toBeVisible({ timeout: 10000 });
  }

  getCardByName(cardName) {
    return this.page.locator(`.card-detail:has-text("${cardName}"), .card-item:has-text("${cardName}")`);
  }

  async selectCard(cardName) {
    const card = this.getCardByName(cardName);
    await expect(card).toBeVisible();
    await card.click();
    await expect(this.transactionsSection).toBeVisible({ timeout: 5000 });
  }

  async verifyCardIssuer(cardName, issuer) {
    const card = this.getCardByName(cardName);
    await expect(card).toContainText(issuer);
  }

  async verifyCardLimit(cardName, limit) {
    const card = this.getCardByName(cardName);
    const cardText = await card.textContent();
    expect(cardText).toMatch(new RegExp(limit.replace(/,/g, ',')));
  }

  async verifyCardBalance(cardName, balance) {
    const card = this.getCardByName(cardName);
    const cardText = await card.textContent();
    expect(cardText).toMatch(new RegExp(balance.replace(/,/g, ',')));
  }

  async verifyConsistentCardLayout() {
    const cards = await this.cardItems.all();
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      await expect(card).toBeVisible();
    }
  }

  async getIncompleteCardIndicator() {
    const errorBadge = this.page.locator('.error-badge, .error-icon, [data-error="true"]');
    return await errorBadge.count() > 0;
  }

  async getTransactionCount() {
    await this.page.waitForTimeout(1000);
    return await this.transactionRows.count();
  }

  async calculateDisplayedMonthlyTotal() {
    const rows = await this.transactionRows.all();
    let total = 0;
    for (const row of rows) {
      const rowText = await row.textContent();
      const amountMatch = rowText.match(/\$([\d,]+\.\d{2})/);
      if (amountMatch) {
        total += parseFloat(amountMatch[1].replace(/,/g, ''));
      }
    }
    return total.toFixed(2);
  }

  async getTransactionsList() {
    const rows = await this.transactionRows.all();
    const transactions = [];
    for (const row of rows) {
      const text = await row.textContent();
      transactions.push(text);
    }
    return transactions;
  }
};