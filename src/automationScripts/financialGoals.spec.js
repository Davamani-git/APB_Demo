const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const { FinancialGoalsPage } = require('./pages/financialGoals.page');

test.describe('Financial Goals Management', () => {

  test('TC-1386: Create savings goal with target amount and timeline', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const goalsPage = new FinancialGoalsPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('goaluser@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to financial goals section
    await goalsPage.navigateToGoalsSection();
    await expect(goalsPage.goalsContainer).toBeVisible();

    // Step 4: Click Create New Goal
    await goalsPage.clickCreateNewGoal();
    await expect(goalsPage.goalCreationForm).toBeVisible();

    // Step 5: Enter target amount
    await goalsPage.enterTargetAmount('5000');

    // Step 6: Enter timeline
    await goalsPage.enterTimeline('10');

    // Step 7: Enter monthly contribution
    await goalsPage.enterMonthlyContribution('500');

    // Step 8: Save goal
    await goalsPage.clickSaveGoal();
    await expect(goalsPage.goalConfirmationMessage).toBeVisible();

    // Step 9: Verify projected completion date
    await goalsPage.verifyProjectedCompletion('10');
  });

  test('TC-1387: Validate insufficient monthly contribution warning', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const goalsPage = new FinancialGoalsPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('insufficientgoal@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to goals and create new goal
    await goalsPage.navigateToGoalsSection();
    await goalsPage.clickCreateNewGoal();
    await expect(goalsPage.goalCreationForm).toBeVisible();

    // Step 4: Enter target amount
    await goalsPage.enterTargetAmount('5000');

    // Step 5: Enter timeline
    await goalsPage.enterTimeline('10');

    // Step 6: Enter insufficient monthly contribution
    await goalsPage.enterMonthlyContribution('200');

    // Step 7: Attempt to save goal
    await goalsPage.clickSaveGoal();

    // Step 8: Verify warning message
    await expect(goalsPage.warningMessage).toBeVisible();
    await expect(goalsPage.warningMessage).toContainText('Goal cannot be achieved');
    await expect(goalsPage.warningMessage).toContainText('$500/month');
  });

  test('TC-1388: Update existing goal and verify recalculated completion date', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const goalsPage = new FinancialGoalsPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with user who has existing goal
    await loginPage.login('existinggoal@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to financial goals section
    await goalsPage.navigateToGoalsSection();
    await expect(goalsPage.existingGoalsList).toBeVisible();

    // Step 4: Select and edit existing goal
    await goalsPage.selectGoalForEdit('5000', '10', '500');
    await expect(goalsPage.goalEditForm).toBeVisible();

    // Step 5: Update monthly contribution
    await goalsPage.updateMonthlyContribution('1000');

    // Step 6: Save updated goal
    await goalsPage.clickUpdateGoal();
    await expect(goalsPage.goalUpdateConfirmation).toBeVisible();

    // Step 7: Verify recalculated completion date
    await goalsPage.verifyUpdatedProjectedCompletion('5');
  });
});
