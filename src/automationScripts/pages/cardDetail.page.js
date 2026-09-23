const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.CardDetailPage = class CardDetailPage {
  constructor(page) {
    this.page = page;
    
    this.pageHeader = page.locator('.page-header h1');
    this.backToCardsButton = page.locator('a.btn-default:has-text("Back to Cards")');
    this.loadingIndicator = page.locator('div:has-text("Loading card details...")');
    this.errorAlert = page.locator('.alert-danger');
    
    this.cardInfoPanel = page.locator('.panel-primary');
    this.cardIssuer = page.locator('.panel-title');
    this.cardMaskedNumber = page.locator('.panel-title');
    this.cardCreditLimit = page.locator('p:has-text("Credit Limit")');
    this.cardAvailableCredit = page.locator('p:has-text("Available Credit")');
    this.cardOutstanding = page.locator('p:has-text("Outstanding Amount")');
    this.cardDueDate = page.locator('p:has-text("Due Date")');
    
    this.transactionsSection = page.locator('h3:has-text("Transactions")');
    this.categoryFilter = page.locator('select[ng-model="vm.filterCategory"]');
    this.transactionsTable = page.locator('.table-responsive table');
    this.transactionRows = page.locator('.table-responsive table tbody tr');
    
    this.dateColumnHeader = page.locator('th:has-text("Date")');
    this.merchantColumnHeader = page.locator('th:has-text("Merchant")');
    this.categoryColumnHeader = page.locator('th:has-text("Category")');
    this.amountColumnHeader = page.locator('th:has-text("Amount")');
  }

  async waitForCardDetailLoad() {
    logger.info('Waiting for card detail page to load');
    await this.page.waitForSelector('.page-header h1', { state: 'visible', timeout: 10000 });
    const isLoadingVisible = await this.loadingIndicator.isVisible().catch(() => false);
    if (isLoadingVisible) {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
    }
  }

  async getTransactionRows() {
    return await this.transactionRows.all();
  }

  getTransactionRowByIndex(index) {
    return this.transactionRows.nth(index);
  }

  getTransactionDateByIndex(index) {
    return this.getTransactionRowByIndex(index).locator('td').nth(0);
  }

  getTransactionMerchantByIndex(index) {
    return this.getTransactionRowByIndex(index).locator('td').nth(1);
  }

  getTransactionCategoryByIndex(index) {
    return this.getTransactionRowByIndex(index).locator('td').nth(2);
  }

  getTransactionAmountByIndex(index) {
    return this.getTransactionRowByIndex(index).locator('td').nth(3);
  }

  async selectCategoryFilter(category) {
    logger.info(`Selecting category filter: ${category}`);
    await expect(this.categoryFilter).toBeVisible();
    await this.categoryFilter.selectOption(category);
    await this.page.waitForTimeout(300);
  }

  async clickDateColumnHeader() {
    logger.info('Clicking date column header to sort');
    await expect(this.dateColumnHeader).toBeVisible();
    await this.dateColumnHeader.click();
    await this.page.waitForTimeout(300);
  }

  async clickMerchantColumnHeader() {
    logger.info('Clicking merchant column header to sort');
    await expect(this.merchantColumnHeader).toBeVisible();
    await this.merchantColumnHeader.click();
    await this.page.waitForTimeout(300);
  }

  async clickCategoryColumnHeader() {
    logger.info('Clicking category column header to sort');
    await expect(this.categoryColumnHeader).toBeVisible();
    await this.categoryColumnHeader.click();
    await this.page.waitForTimeout(300);
  }

  async clickAmountColumnHeader() {
    logger.info('Clicking amount column header to sort');
    await expect(this.amountColumnHeader).toBeVisible();
    await this.amountColumnHeader.click();
    await this.page.waitForTimeout(300);
  }
};