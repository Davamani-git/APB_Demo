const { expect } = require('@playwright/test');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    this.tableSection = page.locator('#transactions-table');
    this.searchInput = page.locator('[data-testid="merchant-search-input"]');
    this.rows = page.locator('[data-testid="transaction-row"]');
  }

  async gotoTransactionsTable() {
    await expect(this.tableSection).toBeVisible();
  }

  async searchByMerchant(merchantName) {
    await this.searchInput.fill(merchantName);
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async assertSearchResultsByMerchant(merchantName) {
    const rowCount = await this.rows.count();
    for (let i = 0; i < rowCount; i++) {
      const merchant = await this.rows.nth(i).locator('[data-testid="transaction-merchant"]').textContent();
      expect(merchant).toContain(merchantName);
    }
  }
};