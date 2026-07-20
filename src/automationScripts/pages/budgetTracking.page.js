const { expect } = require('@playwright/test');
const { logger } = require('../../../utils/logger');

exports.BudgetTrackingPage = class BudgetTrackingPage {
  constructor(page) {
    this.page = page;
    this.budgetTrackingSection = page.locator('#budget-tracking-section');
    this.monthlyBudget = page.locator('[data-testid="monthly-budget"]');
    this.currentSpend = page.locator('[data-testid="current-spend"]');
    this.remainingBudget = page.locator('[data-testid="remaining-budget"]');
  }
  async goToBudgetTrackingSection() {
    logger.info('Navigating to budget tracking section');
    await expect(this.budgetTrackingSection).toBeVisible();
  }
  async assertBudgetValues(budgetConfig) {
    logger.info('Asserting budget values are visible and correct');
    await expect(this.monthlyBudget).toBeVisible();
    await expect(this.currentSpend).toBeVisible();
    await expect(this.remainingBudget).toBeVisible();
    await expect(this.monthlyBudget).toHaveText(budgetConfig.monthlyBudget);
    await expect(this.currentSpend).toHaveText(budgetConfig.currentSpend);
    await expect(this.remainingBudget).toHaveText(budgetConfig.remainingBudget);
  }
};
