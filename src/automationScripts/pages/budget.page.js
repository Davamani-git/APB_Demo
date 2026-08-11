const { expect } = require('@playwright/test');

exports.BudgetPage = class BudgetPage {
  constructor(page) {
    this.page = page;
    this.budgetLink = page.locator('a[href*="budget"]');
    this.budgetCreationForm = page.locator('[data-testid="budget-creation-form"]');
    this.categorySelect = page.locator('select[name="category"]');
    this.monthlyLimitInput = page.locator('input[name="monthly-limit"]');
    this.saveBudgetButton = page.locator('button[data-testid="save-budget"]');
    this.budgetConfirmationMessage = page.locator('[data-testid="budget-confirmation"]');
    this.budgetDashboardLink = page.locator('a[href*="budget/dashboard"]');
    this.budgetDashboardContainer = page.locator('[data-testid="budget-dashboard"]');
    this.validationError = page.locator('[data-testid="validation-error"]');
    this.createBudgetButton = page.locator('button[data-testid="create-budget"]');
  }

  async navigateToBudgetCreation() {
    await this.budgetLink.click();
    await this.createBudgetButton.click();
    await expect(this.budgetCreationForm).toBeVisible();
  }

  async selectCategory(category) {
    await this.categorySelect.selectOption(category);
  }

  async enterMonthlyLimit(limit) {
    await this.monthlyLimitInput.fill(limit);
  }

  async clearMonthlyLimit() {
    await this.monthlyLimitInput.clear();
  }

  async clickSaveBudget() {
    await this.saveBudgetButton.click();
  }

  async navigateToBudgetDashboard() {
    await this.budgetDashboardLink.click();
    await expect(this.budgetDashboardContainer).toBeVisible();
  }

  async verifyBudget(category, limit, status) {
    const budgetRow = this.page.locator(`[data-testid="budget-row"]`, {
      hasText: category
    });
    await expect(budgetRow).toBeVisible();
    await expect(budgetRow).toContainText(limit);
    await expect(budgetRow).toContainText(status);
  }

  async createBudget(category, limit) {
    await this.selectCategory(category);
    await this.enterMonthlyLimit(limit);
    await this.clickSaveBudget();
  }
};
