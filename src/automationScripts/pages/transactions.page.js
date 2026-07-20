const { expect } = require('@playwright/test');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    this.transactionsTable = page.locator('[data-testid="transactions-table"]');
    this.tableRows = page.locator('[data-testid="transaction-row"]');
    this.dateCell = (row) => row.locator('[data-testid="transaction-date"]');
    this.merchantCell = (row) => row.locator('[data-testid="transaction-merchant"]');
    this.categoryCell = (row) => row.locator('[data-testid="transaction-category"]');
    this.cardCell = (row) => row.locator('[data-testid="transaction-card"]');
    this.amountCell = (row) => row.locator('[data-testid="transaction-amount"]');
    this.statusCell = (row) => row.locator('[data-testid="transaction-status"]');
    this.remarkCell = (row) => row.locator('[data-testid="transaction-remark"]');
  }
  async gotoTable() {
    await expect(this.transactionsTable).toBeVisible();
  }
  async assertTransactionColumnsPopulated() {
    const count = await this.tableRows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const row = this.tableRows.nth(i);
      await expect(this.dateCell(row)).toBeVisible();
      await expect(this.merchantCell(row)).toBeVisible();
      await expect(this.categoryCell(row)).toBeVisible();
      await expect(this.cardCell(row)).toBeVisible();
      await expect(this.amountCell(row)).toBeVisible();
      await expect(this.statusCell(row)).toBeVisible();
      await expect(this.remarkCell(row)).toBeVisible();
      await expect(this.dateCell(row)).not.toHaveText('');
      await expect(this.merchantCell(row)).not.toHaveText('');
      await expect(this.categoryCell(row)).not.toHaveText('');
      await expect(this.cardCell(row)).not.toHaveText('');
      await expect(this.amountCell(row)).not.toHaveText('');
      await expect(this.statusCell(row)).not.toHaveText('');
      // remark can be empty (optional)
    }
  }
  async assertTableVisible() {
    await expect(this.transactionsTable).toBeVisible();
  }
};
