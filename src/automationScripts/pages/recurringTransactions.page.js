const { expect } = require('@playwright/test');

exports.RecurringTransactionsPage = class RecurringTransactionsPage {
  constructor(page) {
    this.page = page;
    this.recurringTransactionsLink = page.locator('a[href*="recurring"]');
    this.recurringTransactionsContainer = page.locator('[data-testid="recurring-transactions-container"]');
    this.triggerDetectionButton = page.locator('button[data-testid="trigger-recurring-detection"]');
    this.detectionCompleteIndicator = page.locator('[data-testid="detection-complete"]');
    this.recurringTransactionsList = page.locator('[data-testid="recurring-transactions-list"]');
  }

  async navigateToRecurringSection() {
    await this.recurringTransactionsLink.click();
    await expect(this.recurringTransactionsContainer).toBeVisible();
  }

  async triggerRecurringDetection(period) {
    await this.triggerDetectionButton.click();
  }

  async verifyRecurringTransaction(merchant, amount, frequency) {
    const recurringRow = this.page.locator(`[data-testid="recurring-transaction-row"]`, {
      hasText: merchant
    });
    await expect(recurringRow).toBeVisible();
    await expect(recurringRow).toContainText(amount);
    await expect(recurringRow).toContainText(frequency);
  }

  async verifyTransactionNotRecurring(merchant) {
    const recurringRow = this.page.locator(`[data-testid="recurring-transaction-row"]`, {
      hasText: merchant
    });
    await expect(recurringRow).not.toBeVisible();
  }
};
