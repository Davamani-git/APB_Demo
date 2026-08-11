const { expect } = require('@playwright/test');

exports.FinancialGoalsPage = class FinancialGoalsPage {
  constructor(page) {
    this.page = page;
    this.goalsLink = page.locator('a[href*="goals"]');
    this.goalsContainer = page.locator('[data-testid="goals-container"]');
    this.createNewGoalButton = page.locator('button[data-testid="create-new-goal"]');
    this.goalCreationForm = page.locator('[data-testid="goal-creation-form"]');
    this.targetAmountInput = page.locator('input[name="target-amount"]');
    this.timelineInput = page.locator('input[name="timeline"]');
    this.monthlyContributionInput = page.locator('input[name="monthly-contribution"]');
    this.saveGoalButton = page.locator('button[data-testid="save-goal"]');
    this.goalConfirmationMessage = page.locator('[data-testid="goal-confirmation"]');
    this.projectedCompletionDisplay = page.locator('[data-testid="projected-completion"]');
    this.warningMessage = page.locator('[data-testid="warning-message"]');
    this.existingGoalsList = page.locator('[data-testid="existing-goals-list"]');
    this.goalEditForm = page.locator('[data-testid="goal-edit-form"]');
    this.updateGoalButton = page.locator('button[data-testid="update-goal"]');
    this.goalUpdateConfirmation = page.locator('[data-testid="goal-update-confirmation"]');
  }

  async navigateToGoalsSection() {
    await this.goalsLink.click();
    await expect(this.goalsContainer).toBeVisible();
  }

  async clickCreateNewGoal() {
    await this.createNewGoalButton.click();
  }

  async enterTargetAmount(amount) {
    await this.targetAmountInput.fill(amount);
  }

  async enterTimeline(months) {
    await this.timelineInput.fill(months);
  }

  async enterMonthlyContribution(amount) {
    await this.monthlyContributionInput.fill(amount);
  }

  async clickSaveGoal() {
    await this.saveGoalButton.click();
  }

  async verifyProjectedCompletion(months) {
    await expect(this.projectedCompletionDisplay).toBeVisible();
    await expect(this.projectedCompletionDisplay).toContainText(months);
  }

  async selectGoalForEdit(targetAmount, timeline, contribution) {
    const goalRow = this.page.locator(`[data-testid="goal-row"]`, {
      hasText: targetAmount
    });
    const editButton = goalRow.locator('button[data-testid="edit-goal"]');
    await editButton.click();
  }

  async updateMonthlyContribution(amount) {
    await this.monthlyContributionInput.clear();
    await this.monthlyContributionInput.fill(amount);
  }

  async clickUpdateGoal() {
    await this.updateGoalButton.click();
  }

  async verifyUpdatedProjectedCompletion(months) {
    await expect(this.projectedCompletionDisplay).toBeVisible();
    await expect(this.projectedCompletionDisplay).toContainText(months);
  }
};
