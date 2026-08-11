const { expect } = require('@playwright/test');

exports.TransactionPage = class TransactionPage {
  constructor(page) {
    this.page = page;
    this.transactionHistoryLink = page.locator('a[href*="transactions"]');
    this.transactionsList = page.locator('[data-testid="transactions-list"]');
    this.transactionSyncButton = page.locator('button[data-testid="sync-transactions"]');
    this.transactionSyncConfirmation = page.locator('[data-testid="sync-confirmation"]');
    this.syncInProgressIndicator = page.locator('[data-testid="sync-in-progress"]');
    this.addTransactionButton = page.locator('button[data-testid="add-transaction"]');
    this.merchantInput = page.locator('input[name="merchant"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.dateInput = page.locator('input[name="date"]');
    this.categorySelect = page.locator('select[name="category"]');
    this.saveTransactionButton = page.locator('button[data-testid="save-transaction"]');
    this.categoryEditInterface = page.locator('[data-testid="category-edit-interface"]');
    this.categoryCorrectionConfirmation = page.locator('[data-testid="category-correction-confirmation"]');
    this.manualCategorizationPrompt = page.locator('[data-testid="manual-categorization-prompt"]');
    this.historicalSpendingSection = page.locator('[data-testid="historical-spending"]');
    this.averageSpendingDisplay = page.locator('[data-testid="average-spending"]');
  }

  async navigateToTransactionHistory() {
    await this.transactionHistoryLink.click();
    await expect(this.transactionsList).toBeVisible();
  }

  async navigateToTransactionsList() {
    await this.navigateToTransactionHistory();
  }

  async verifyHistoricalDiningSpending(month1, month2, month3) {
    await expect(this.historicalSpendingSection).toBeVisible();
    const spendingText = await this.historicalSpendingSection.textContent();
    expect(spendingText).toContain(month1);
    expect(spendingText).toContain(month2);
    expect(spendingText).toContain(month3);
  }

  async verifyAverageSpending(average) {
    await expect(this.averageSpendingDisplay).toBeVisible();
    await expect(this.averageSpendingDisplay).toContainText(average);
  }

  async addDiningTransaction(amount) {
    await this.addTransactionButton.click();
    await this.amountInput.fill(amount);
    await this.categorySelect.selectOption('Dining');
    await this.saveTransactionButton.click();
  }

  async synchronizeTransactions(merchant, amount, dates) {
    for (const date of dates) {
      await this.addTransactionButton.click();
      await this.merchantInput.fill(merchant);
      await this.amountInput.fill(amount);
      await this.dateInput.fill(date);
      await this.saveTransactionButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async synchronizeWeeklyTransactions(merchant, amount, weekCount) {
    for (let i = 0; i < weekCount; i++) {
      await this.addTransactionButton.click();
      await this.merchantInput.fill(merchant);
      await this.amountInput.fill(amount);
      await this.saveTransactionButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async triggerTransactionSync() {
    await this.transactionSyncButton.click();
  }

  async verifyTransactionExists(merchant, amount, date) {
    const transactionRow = this.page.locator(`[data-testid="transaction-row"]`, {
      hasText: merchant
    });
    await expect(transactionRow).toBeVisible();
    await expect(transactionRow).toContainText(amount);
  }

  async verifyTransactionCategory(merchant, category) {
    const transactionRow = this.page.locator(`[data-testid="transaction-row"]`, {
      hasText: merchant
    });
    await expect(transactionRow).toContainText(category);
  }

  async verifyCategorizationConfidence(merchant, minConfidence) {
    const transactionRow = this.page.locator(`[data-testid="transaction-row"]`, {
      hasText: merchant
    });
    const confidenceElement = transactionRow.locator('[data-testid="confidence-level"]');
    await expect(confidenceElement).toBeVisible();
    const confidenceText = await confidenceElement.textContent();
    const confidenceValue = parseInt(confidenceText.replace(/\D/g, ''));
    expect(confidenceValue).toBeGreaterThanOrEqual(parseInt(minConfidence));
  }

  async verifyLowConfidenceOrUncategorized(merchant) {
    const transactionRow = this.page.locator(`[data-testid="transaction-row"]`, {
      hasText: merchant
    });
    const categoryElement = transactionRow.locator('[data-testid="category"]');
    const categoryText = await categoryElement.textContent();
    expect(categoryText).toMatch(/Uncategorized|Review Required/i);
  }

  async locateTransaction(merchant, amount, category) {
    const transactionRow = this.page.locator(`[data-testid="transaction-row"]`, {
      hasText: merchant
    });
    await expect(transactionRow).toBeVisible();
    await expect(transactionRow).toContainText(amount);
    await expect(transactionRow).toContainText(category);
  }

  async clickEditCategory(merchant) {
    const transactionRow = this.page.locator(`[data-testid="transaction-row"]`, {
      hasText: merchant
    });
    const editButton = transactionRow.locator('button[data-testid="edit-category"]');
    await editButton.click();
  }

  async selectCategory(category) {
    await this.categorySelect.selectOption(category);
  }

  async saveCategoryCorrection() {
    await this.saveTransactionButton.click();
  }
};
