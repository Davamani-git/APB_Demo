const { expect } = require('@playwright/test');

exports.CreditCardsPage = class CreditCardsPage {
  constructor(page) {
    this.page = page;
    this.summarySection = page.locator('[data-testid="creditcards-summary-section"]');
    this.cardRows = page.locator('[data-testid="creditcard-row"]');
    this.cardName = (row) => row.locator('[data-testid="card-name"]');
    this.issuingBank = (row) => row.locator('[data-testid="issuing-bank"]');
    this.maskedNumber = (row) => row.locator('[data-testid="masked-card-number"]');
    this.totalCreditLimit = (row) => row.locator('[data-testid="card-credit-limit"]');
    this.availableCredit = (row) => row.locator('[data-testid="card-available-credit"]');
    this.outstandingAmount = (row) => row.locator('[data-testid="card-outstanding-amount"]');
    this.billingDate = (row) => row.locator('[data-testid="card-billing-date"]');
    this.dueDate = (row) => row.locator('[data-testid="card-due-date"]');
  }
  async gotoSummary() {
    await expect(this.summarySection).toBeVisible();
  }
  async assertAllCardFieldsVisible() {
    const count = await this.cardRows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const row = this.cardRows.nth(i);
      await expect(this.cardName(row)).toBeVisible();
      await expect(this.issuingBank(row)).toBeVisible();
      await expect(this.maskedNumber(row)).toBeVisible();
      await expect(this.totalCreditLimit(row)).toBeVisible();
      await expect(this.availableCredit(row)).toBeVisible();
      await expect(this.outstandingAmount(row)).toBeVisible();
      await expect(this.billingDate(row)).toBeVisible();
      await expect(this.dueDate(row)).toBeVisible();
    }
  }
  async assertCardNumbersMasked() {
    const count = await this.cardRows.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const row = this.cardRows.nth(i);
      await expect(this.maskedNumber(row)).toBeVisible();
      const number = await this.maskedNumber(row).textContent();
      // Example: **** **** **** 1234
      expect(number).toMatch(/\*{4}/);
      expect(number.replace(/\D/g, '').length).toBeGreaterThanOrEqual(4); // At least last 4 digits
    }
  }
};
