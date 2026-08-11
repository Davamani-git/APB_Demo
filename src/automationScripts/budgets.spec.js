const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('./pages/dashboard.page');
const { LoginPage } = require('./pages/login.page');
const { BudgetPage } = require('./pages/budget.page');

test.describe('Budget Management', () => {

  test('TC-1383: Create budget for dining category with monthly limit', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const budgetPage = new BudgetPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('budgetuser@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to budget creation section
    await budgetPage.navigateToBudgetCreation();
    await expect(budgetPage.budgetCreationForm).toBeVisible();

    // Step 4: Select dining category
    await budgetPage.selectCategory('Dining');

    // Step 5: Enter monthly limit
    await budgetPage.enterMonthlyLimit('500');

    // Step 6: Save budget
    await budgetPage.clickSaveBudget();
    await expect(budgetPage.budgetConfirmationMessage).toBeVisible();

    // Step 7: Verify budget in dashboard
    await budgetPage.navigateToBudgetDashboard();
    await budgetPage.verifyBudget('Dining', '500', 'Active');
  });

  test('TC-1384: Validate budget creation with invalid limit values', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const budgetPage = new BudgetPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('validationuser@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Navigate to budget creation section
    await budgetPage.navigateToBudgetCreation();
    await expect(budgetPage.budgetCreationForm).toBeVisible();

    // Step 4: Select entertainment category
    await budgetPage.selectCategory('Entertainment');

    // Step 5: Enter zero as monthly limit
    await budgetPage.enterMonthlyLimit('0');

    // Step 6: Attempt to save and verify error
    await budgetPage.clickSaveBudget();
    await expect(budgetPage.validationError).toBeVisible();
    await expect(budgetPage.validationError).toContainText('greater than zero');

    // Step 7: Clear and enter negative value
    await budgetPage.clearMonthlyLimit();
    await budgetPage.enterMonthlyLimit('-100');

    // Step 8: Attempt to save and verify error
    await budgetPage.clickSaveBudget();
    await expect(budgetPage.validationError).toBeVisible();
    await expect(budgetPage.validationError).toContainText('positive value');
  });

  test('TC-1385: Create multiple budgets for different categories', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const budgetPage = new BudgetPage(page);

    // Step 1: Launch application
    await loginPage.navigate();
    await expect(page).toHaveURL(/personalfinancemanager/);

    // Step 2: Login with valid credentials
    await loginPage.login('multibudget@example.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 3: Create first budget for dining
    await budgetPage.navigateToBudgetCreation();
    await budgetPage.createBudget('Dining', '500');
    await expect(budgetPage.budgetConfirmationMessage).toBeVisible();

    // Step 4: Create second budget for groceries
    await budgetPage.navigateToBudgetCreation();
    await budgetPage.createBudget('Groceries', '800');
    await expect(budgetPage.budgetConfirmationMessage).toBeVisible();

    // Step 5: Create third budget for transportation
    await budgetPage.navigateToBudgetCreation();
    await budgetPage.createBudget('Transportation', '300');
    await expect(budgetPage.budgetConfirmationMessage).toBeVisible();

    // Step 6: Navigate to budget dashboard
    await budgetPage.navigateToBudgetDashboard();
    await expect(budgetPage.budgetDashboardContainer).toBeVisible();

    // Step 7: Verify all three budgets
    await budgetPage.verifyBudget('Dining', '500', 'Active');
    await budgetPage.verifyBudget('Groceries', '800', 'Active');
    await budgetPage.verifyBudget('Transportation', '300', 'Active');
  });
});
