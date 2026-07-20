const { expect } = require('@playwright/test');

exports.TransactionsSearchPage = class TransactionsSearchPage {
  constructor(page) {
    this.page = page;
    this.transactionsPageHeader = page.locator('h1:has-text("Transactions")');
    this.searchField = page.locator('[data-testid="transactions-search"]');
    this.tableRows = page.locator('[data-testid="transaction-row"]');
    this.merchantCell = (row) => row.locator('[data-testid="transaction-merchant"]');
  }
  async goto() {
    await this.page.goto('/transactions');
    await expect(this.transactionsPageHeader).toBeVisible();
  }
  async searchByMerchant(merchant) {
    await expect(this.searchField).toBeVisible();
    await this.searchField.fill(merchant);
  }
  async assertOnlyMerchantDisplayed(merchant) {
    const count = await this.tableRows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const row = this.tableRows.nth(i);
      await expect(this.merchantCell(row)).toHaveText(merchant);
    }
  }
};
