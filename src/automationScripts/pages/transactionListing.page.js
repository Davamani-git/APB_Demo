const { expect } = require('@playwright/test');

exports.TransactionListingPage = class TransactionListingPage {
  constructor(page) {
    this.page = page;
    this.transactionListContainer = page.locator('[data-testid="transaction-list-container"]');
    this.transactionItems = page.locator('[data-testid="transaction-item"]');
    this.transactionDate = page.locator('[data-testid="transaction-date"]');
    this.transactionAmount = page.locator('[data-testid="transaction-amount"]');
    this.transactionCategory = page.locator('[data-testid="transaction-category"]');
    this.maskedCardNumber = page.locator('[data-testid="masked-card-number"]');
    this.paginationControls = page.locator('[data-testid="pagination-controls"]');
    this.nextPageButton = page.locator('[data-testid="pagination-next"]');
    this.previousPageButton = page.locator('[data-testid="pagination-previous"]');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.dateRangeStartInput = page.locator('[data-testid="date-range-start"]');
    this.dateRangeEndInput = page.locator('[data-testid="date-range-end"]');
    this.categoryFilterDropdown = page.locator('[data-testid="category-filter"]');
    this.applyFiltersButton = page.locator('[data-testid="apply-filters"]');
    this.transactionListingLink = page.locator('[data-testid="transaction-listing-link"]');
  }

  async openTransactionListing() {
    await expect(this.transactionListingLink).toBeVisible();
    await this.transactionListingLink.click();
    await expect(this.transactionListContainer).toBeVisible();
  }

  async navigateToTransactionListing() {
    await this.page.goto('/transactions');
    await expect(this.transactionListContainer).toBeVisible();
  }

  async verifyTransactionDetailsDisplayed() {
    const count = await this.transactionItems.count();
    expect(count).toBeGreaterThan(0);
    
    await expect(this.transactionDate.first()).toBeVisible();
    await expect(this.transactionAmount.first()).toBeVisible();
    await expect(this.transactionCategory.first()).toBeVisible();
  }

  async verifyCardNumbersMasked(expectedMaskedNumber) {
    const cardNumber = await this.maskedCardNumber.first().textContent();
    expect(cardNumber).toBe(expectedMaskedNumber);
  }

  async verifyCardNumbersMaskedOnAllPages() {
    const count = await this.maskedCardNumber.count();
    for (let i = 0; i < count; i++) {
      const cardNumber = await this.maskedCardNumber.nth(i).textContent();
      expect(cardNumber).toMatch(/XXXX-XXXX-XXXX-\d{4}/);
    }
  }

  async verifyCVVNotDisplayed() {
    const cvvElement = this.page.locator('[data-testid="cvv"]');
    const isVisible = await cvvElement.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  }

  async clickNextPage() {
    await expect(this.nextPageButton).toBeEnabled();
    await this.nextPageButton.click();
  }

  async clickPreviousPage() {
    await expect(this.previousPageButton).toBeEnabled();
    await this.previousPageButton.click();
  }

  async waitForPageToLoad() {
    await this.page.waitForTimeout(500);
    await expect(this.transactionListContainer).toBeVisible();
  }

  async applyDateRangeFilter(startDate, endDate) {
    await expect(this.dateRangeStartInput).toBeVisible();
    await this.dateRangeStartInput.fill(startDate);
    await expect(this.dateRangeEndInput).toBeVisible();
    await this.dateRangeEndInput.fill(endDate);
  }

  async applyCategoryFilter(category) {
    await expect(this.categoryFilterDropdown).toBeVisible();
    await this.categoryFilterDropdown.selectOption(category);
  }

  async waitForFilterToApply() {
    await expect(this.applyFiltersButton).toBeEnabled();
    await this.applyFiltersButton.click();
    await this.page.waitForTimeout(500);
    await expect(this.transactionListContainer).toBeVisible();
  }

  async verifyOnlyMatchingTransactionsDisplayed(startDate, endDate, category) {
    const count = await this.transactionItems.count();
    
    for (let i = 0; i < count; i++) {
      const transactionDateText = await this.transactionDate.nth(i).textContent();
      const transactionCategoryText = await this.transactionCategory.nth(i).textContent();
      
      expect(transactionCategoryText).toContain(category);
    }
  }

  async getTransactionCount() {
    await expect(this.transactionListContainer).toBeVisible();
    return await this.transactionItems.count();
  }
};