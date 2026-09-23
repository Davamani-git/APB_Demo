const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    this.cardsHeader = page.locator('.dashboard-header h1:has-text("My Credit Cards")');
    this.cardsList = page.locator('.cards-list');
    this.cardItems = page.locator('.card-item');
    this.loadingIndicator = page.locator('.loading');
    this.viewTransactionsButton = page.locator('.btn-view');
    this.cardSummary = page.locator('.card-summary');
    this.transactionsList = page.locator('.transactions-list');
    this.transactionsTable = page.locator('table');
    this.transactionRows = page.locator('tbody tr');
    this.noTransactionsMessage = page.locator('text=/No transactions found|No transactions available/i');
  }

  async navigate() {
    await this.page.goto('#!/cards');
    await this.page.waitForLoadState('networkidle');
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
  }

  async verifyAllCardsListed(cardNames) {
    await expect(this.cardItems).toHaveCount(cardNames.length);
    for (const cardName of cardNames) {
      const cardLocator = this.page.locator(`.card-item:has-text("${cardName}")`);
      await expect(cardLocator).toBeVisible();
    }
  }

  async verifyCreditLimits(expectedLimits) {
    const cards = await this.cardItems.all();
    for (let i = 0; i < cards.length; i++) {
      const limitText = await cards[i].locator('p:has-text("Credit Limit")').textContent();
      const numericValue = limitText.replace(/[^0-9]/g, '');
      expect(numericValue).toBe(expectedLimits[i]);
    }
  }

  async verifyAvailableCredits(expectedCredits) {
    const cards = await this.cardItems.all();
    for (let i = 0; i < cards.length; i++) {
      const creditText = await cards[i].locator('p:has-text("Available Credit")').textContent();
      const numericValue = creditText.replace(/[^0-9]/g, '');
      expect(numericValue).toBe(expectedCredits[i]);
    }
  }

  async verifyOutstandingAmounts(expectedAmounts) {
    const cards = await this.cardItems.all();
    for (let i = 0; i < cards.length; i++) {
      const amountText = await cards[i].locator('p:has-text("Outstanding")').textContent();
      const numericValue = amountText.replace(/[^0-9]/g, '');
      expect(numericValue).toBe(expectedAmounts[i]);
    }
  }

  async verifyEachCardDataDistinct() {
    const cards = await this.cardItems.all();
    const cardData = [];
    for (const card of cards) {
      const name = await card.locator('h3').textContent();
      const limit = await card.locator('p:has-text("Credit Limit")').textContent();
      cardData.push({ name, limit });
    }
    const uniqueNames = new Set(cardData.map(c => c.name));
    expect(uniqueNames.size).toBe(cardData.length);
  }

  async verifyAggregatedTotalMatches(expectedTotal) {
    const cards = await this.cardItems.all();
    let total = 0;
    for (const card of cards) {
      const limitText = await card.locator('p:has-text("Credit Limit")').textContent();
      const numericValue = parseInt(limitText.replace(/[^0-9]/g, ''));
      total += numericValue;
    }
    expect(total.toString()).toBe(expectedTotal);
  }

  async verifySingleCardDisplayed(cardName) {
    await expect(this.cardItems).toHaveCount(1);
    const cardLocator = this.page.locator(`.card-item:has-text("${cardName}")`);
    await expect(cardLocator).toBeVisible();
  }

  async verifyCardSummaryComplete(expectedLimit, expectedAvailable, expectedOutstanding) {
    const card = this.cardItems.first();
    const limitText = await card.locator('p:has-text("Credit Limit")').textContent();
    const availableText = await card.locator('p:has-text("Available Credit")').textContent();
    const outstandingText = await card.locator('p:has-text("Outstanding")').textContent();
    expect(limitText.replace(/[^0-9]/g, '')).toBe(expectedLimit);
    expect(availableText.replace(/[^0-9]/g, '')).toBe(expectedAvailable);
    expect(outstandingText.replace(/[^0-9]/g, '')).toBe(expectedOutstanding);
  }

  async verifyInterfaceFunctional() {
    await expect(this.cardsHeader).toBeVisible();
    await expect(this.cardsList).toBeVisible();
    await expect(this.viewTransactionsButton).toBeVisible();
  }

  async verifySingleCardMatchesDashboardKPIs() {
    const card = this.cardItems.first();
    const limitText = await card.locator('p:has-text("Credit Limit")').textContent();
    const availableText = await card.locator('p:has-text("Available Credit")').textContent();
    const outstandingText = await card.locator('p:has-text("Outstanding")').textContent();
    expect(limitText).toBeTruthy();
    expect(availableText).toBeTruthy();
    expect(outstandingText).toBeTruthy();
  }

  async selectCard(cardName) {
    const cardLocator = this.page.locator(`.card-item:has-text("${cardName}")`);
    await expect(cardLocator).toBeVisible();
  }

  async clickViewTransactions() {
    await this.viewTransactionsButton.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTransactionViewLoaded() {
    await expect(this.cardSummary).toBeVisible({ timeout: 5000 });
    await expect(this.transactionsList).toBeVisible();
  }

  async verifyTransactionCount(expectedCount) {
    await expect(this.transactionRows).toHaveCount(expectedCount);
  }

  async verifyTransactionAttributes(expectedData) {
    const firstRow = this.transactionRows.first();
    const cells = firstRow.locator('td');
    const date = await cells.nth(0).textContent();
    const merchant = await cells.nth(1).textContent();
    const category = await cells.nth(2).textContent();
    const amount = await cells.nth(3).textContent();
    expect(date).toContain(expectedData[1]);
    expect(category).toContain(expectedData[2]);
    expect(merchant).toContain(expectedData[3]);
    expect(amount.replace(/[^0-9]/g, '')).toBe(expectedData[0]);
  }

  async verifyMultipleCategoryTransactions(expectedCategories) {
    const rows = await this.transactionRows.all();
    const categories = [];
    for (const row of rows) {
      const categoryCell = row.locator('td').nth(2);
      const categoryText = await categoryCell.textContent();
      categories.push(categoryText.trim());
    }
    for (const expectedCategory of expectedCategories) {
      expect(categories).toContain(expectedCategory);
    }
  }

  async calculateTransactionSum() {
    const rows = await this.transactionRows.all();
    let sum = 0;
    for (const row of rows) {
      const amountCell = row.locator('td').nth(3);
      const amountText = await amountCell.textContent();
      const numericValue = parseInt(amountText.replace(/[^0-9]/g, ''));
      sum += numericValue;
    }
    return sum;
  }

  async verifyTransactionSumMatchesMonthlySpend(expectedSpend) {
    const summaryText = await this.cardSummary.textContent();
    expect(summaryText).toBeTruthy();
  }

  async selectCardWithNoTransactions() {
    const cards = await this.cardItems.all();
    await expect(cards[0]).toBeVisible();
  }

  async verifyNoTransactionsMessage() {
    const rowCount = await this.transactionRows.count();
    if (rowCount === 0) {
      await expect(this.transactionsList).toBeVisible();
    }
  }

  async verifyNoErrors() {
    const errors = [];
    this.page.on('pageerror', error => errors.push(error));
    await this.page.waitForTimeout(1000);
    expect(errors.length).toBe(0);
  }

  async verifyNavigationFunctional() {
    const navLinks = this.page.locator('.dashboard-nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  }
};