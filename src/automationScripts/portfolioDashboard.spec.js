const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');

test.describe('Portfolio Dashboard Tests', () => {

  test('TC-1121: Operating Partner can view aggregated AI usage and spend data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate('https://dashboard.example.com');
    await expect(page).toHaveURL(/dashboard\.example\.com/);

    // Step 2 & 3: Enter valid Operating Partner credentials and login
    await loginPage.login('operating_partner@example.com', 'SecurePass@123');

    // Step 4: Verify main dashboard page loads
    await expect(dashboardPage.dashboardContainer).toBeVisible();

    // Step 5: Observe aggregated AI usage and spend data within 3 seconds
    const startTime = Date.now();
    await expect(dashboardPage.aiUsageDataSection).toBeVisible({ timeout: 3000 });
    await expect(dashboardPage.spendDataSection).toBeVisible({ timeout: 3000 });
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(3000);
  });

  test('TC-1122: Unauthorized user cannot access consolidated portfolio dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate('https://dashboard.example.com');
    await expect(page).toHaveURL(/dashboard\.example\.com/);

    // Step 2 & 3: Enter unauthorized user credentials and attempt login
    await loginPage.loginWithError('unauthorized_user@example.com', 'Pass@123');

    // Step 3: Verify authentication or authorization error is displayed
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.errorMessage.textContent();
    expect(errorText.toLowerCase()).toMatch(/(authentication|authorization|access denied|invalid|error)/);

    // Step 4: Attempt to access portfolio dashboard directly via URL
    await page.goto('https://dashboard.example.com/portfolio');

    // Verify system denies access and displays error
    const currentUrl = page.url();
    const isOnLoginPage = currentUrl.includes('login') || currentUrl.includes('auth');
    const hasErrorMessage = await loginPage.errorMessage.isVisible().catch(() => false);
    const hasAccessDeniedMessage = await dashboardPage.accessDeniedMessage.isVisible().catch(() => false);

    expect(isOnLoginPage || hasErrorMessage || hasAccessDeniedMessage).toBeTruthy();
  });

});
