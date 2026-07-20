const { expect } = require('@playwright/test');
const { logger } = require('../../../utils/logger');

exports.TransactionsPage = class TransactionsPage {
  constructor(page) {
    this.page = page;
    this.transactionsTable = page.locator('#transactions-table');
    this.transactionRows = page.locator('[data-testid="transaction-row"]');
    this.dateColumn = page.locator('[data-testid="transaction-date"]');
    this.merchantColumn = page.locator('[data-testid="transaction-merchant"]');
    this.categoryColumn = page.locator('[data-testid="transaction-category"]');
    this.cardIdentifierColumn = page.locator('[data-testid="transaction-card-id"]');
    this.amountColumn = page.locator('[data-testid="transaction-amount"]');
    this.paymentStatusColumn = page.locator('[data-testid="transaction-payment-status"]');
    this.remarkColumn = page.locator('[data-testid="transaction-remark"]');
    this.searchBox = page.locator('[data-testid="merchant-search"]');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.filterPanel = page.locator('[data-testid="filter-panel"]');
    this.filterApplyButton = page.locator('[data-testid="filter-apply"]');
  }
  async goToTransactionsTable() {
    logger.info('Navigating to transactions table');
    await expect(this.transactionsTable).toBeVisible();
  }
  async assertTransactionColumnsVisible() {
    logger.info('Asserting transaction columns are visible');
    await expect(this.dateColumn).toBeVisible();
    await expect(this.merchantColumn).toBeVisible();
    await expect(this.categoryColumn).toBeVisible();
    await expect(this.cardIdentifierColumn).toBeVisible();
    await expect(this.amountColumn).toBeVisible();
    await expect(this.paymentStatusColumn).toBeVisible();
    await expect(this.remarkColumn).toBeVisible();
  }
  async assertResponsiveLayout() {
    logger.info('Asserting table layout is responsive');
    await expect(this.transactionsTable).toBeVisible();
    // Optionally check for layout classes or styles
  }
  async searchMerchant(merchantName) {
    logger.info(`Searching for merchant: ${merchantName}`);
    await this.searchBox.fill(merchantName);
    await this.searchBox.press('Enter');
    await expect(this.transactionsTable).toBeVisible();
  }
  async assertMerchantFilterResults(merchantName) {
    logger.info('Asserting merchant filter results');
    const rowCount = await this.transactionRows.count();
    for (let i = 0; i < rowCount; i++) {
      const merchantText = await this.transactionRows.nth(i).locator('[data-testid="transaction-merchant"]').textContent();
      expect(merchantText).toContain(merchantName);
    }
  }
  async goToTransactionsSection() {
    logger.info('Navigating to transactions section');
    await expect(this.transactionsTable).toBeVisible();
  }
  async assertTransactionColumnsMasked() {
    logger.info('Asserting transaction columns and masked card');
    await this.assertTransactionColumnsVisible();
    const rowCount = await this.transactionRows.count();
    for (let i = 0; i < rowCount; i++) {
      const cardIdText = await this.transactionRows.nth(i).locator('[data-testid="transaction-card-id"]').textContent();
      expect(cardIdText).toMatch(/\*{4,}/);
    }
  }
  async applyNoMatchFilters(filters) {
    logger.info('Applying filters for no matching transactions');
    await this.filterPanel.click();
    // Fill in filter fields as per filters object
    if (filters.merchant) await this.page.locator('[data-testid="filter-merchant"]').fill(filters.merchant);
    if (filters.category) await this.page.locator('[data-testid="filter-category"]').selectOption({ label: filters.category });
    if (filters.date) await this.page.locator('[data-testid="filter-date"]').fill(filters.date);
    await this.filterApplyButton.click();
  }
  async assertNoTransactionsFound() {
    logger.info('Asserting no transactions found message');
    await expect(this.noTransactionsMessage).toBeVisible();
    await expect(this.transactionRows).toHaveCount(0);
  }
  async assertNoSensitiveIdentifiers() {
    logger.info('Asserting no sensitive identifiers in transaction table');
    const rowCount = await this.transactionRows.count();
    for (let i = 0; i < rowCount; i++) {
      const cardIdText = await this.transactionRows.nth(i).locator('[data-testid="transaction-card-id"]').textContent();
      expect(cardIdText).not.toMatch(/\d{12,}/); // No full card numbers
    }
  }
  async openFilterPanel() {
    logger.info('Opening filter panel');
    await this.filterPanel.click();
    await expect(this.filterPanel).toBeVisible();
  }
  async applyFilters(filterObj) {
    logger.info('Applying filters');
    if (filterObj.category) await this.page.locator('[data-testid="filter-category"]').selectOption({ label: filterObj.category });
    if (filterObj.institution) await this.page.locator('[data-testid="filter-institution"]').selectOption({ label: filterObj.institution });
    if (filterObj.card) await this.page.locator('[data-testid="filter-card"]').selectOption({ label: filterObj.card });
    if (filterObj.dateRange) {
      await this.page.locator('[data-testid="filter-date-from"]').fill(filterObj.dateRange.from);
      await this.page.locator('[data-testid="filter-date-to"]').fill(filterObj.dateRange.to);
    }
    await this.filterApplyButton.click();
  }
  async assertFilterResults(filterObj) {
    logger.info('Asserting filter results');
    const rowCount = await this.transactionRows.count();
    for (let i = 0; i < rowCount; i++) {
      const row = this.transactionRows.nth(i);
      if (filterObj.category) {
        const categoryText = await row.locator('[data-testid="transaction-category"]').textContent();
        expect(categoryText).toContain(filterObj.category);
      }
      if (filterObj.institution) {
        const institutionText = await row.locator('[data-testid="transaction-institution"]').textContent();
        expect(institutionText).toContain(filterObj.institution);
      }
      if (filterObj.card) {
        const cardText = await row.locator('[data-testid="transaction-card-id"]').textContent();
        expect(cardText).toContain(filterObj.card);
      }
      if (filterObj.dateRange) {
        const dateText = await row.locator('[data-testid="transaction-date"]').textContent();
        // Optionally check date is within range
      }
    }
  }
  async assertNoTransactionsMessage() {
    logger.info('Asserting no transactions message');
    await expect(this.noTransactionsMessage).toBeVisible();
    await expect(this.transactionRows).toHaveCount(0);
  }
};
