const { expect } = require('@playwright/test');

exports.BudgetPage = class BudgetPage {
  constructor(page) {
    this.page = page;
    this.budgetSection = page.locator('[data-testid="budget-section"]');
    this.monthlyBudget = page.locator('[data-testid="monthly-budget"]');
    this.currentSpend = page.locator('[data-testid="current-spend"]');
    this.remainingBudget = page.locator('[data-testid="remaining-budget"]');
  }
  async gotoSection() {
    await expect(this.budgetSection).toBeVisible();
  }
  async assertBudgetFieldsVisible() {
    await expect(this.monthlyBudget).toBeVisible();
    await expect(this.currentSpend).toBeVisible();
    await expect(this.remainingBudget).toBeVisible();
    await expect(this.monthlyBudget).not.toHaveText('');
    await expect(this.currentSpend).not.toHaveText('');
    await expect(this.remainingBudget).not.toHaveText('');
  }
};
