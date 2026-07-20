const { expect } = require('@playwright/test');

exports.BudgetPage = class BudgetPage {
  constructor(page) {
    this.page = page;
    this.section = page.locator('#budget-tracking-section');
    this.monthlyBudget = page.locator('[data-testid="monthly-budget"]');
    this.currentSpend = page.locator('[data-testid="current-spend"]');
    this.remainingBudget = page.locator('[data-testid="remaining-budget"]');
  }

  async gotoBudgetTrackingSection() {
    await expect(this.section).toBeVisible();
  }

  async assertBudgetFieldsVisibleAndCorrect() {
    await expect(this.monthlyBudget).toBeVisible();
    await expect(this.currentSpend).toBeVisible();
    await expect(this.remainingBudget).toBeVisible();
    // Optionally: check values are numbers
    const budget = await this.monthlyBudget.textContent();
    const spend = await this.currentSpend.textContent();
    const remaining = await this.remainingBudget.textContent();
    expect(parseFloat(budget.replace(/[^0-9.]/g, ''))).not.toBeNaN();
    expect(parseFloat(spend.replace(/[^0-9.]/g, ''))).not.toBeNaN();
    expect(parseFloat(remaining.replace(/[^0-9.]/g, ''))).not.toBeNaN();
  }
};