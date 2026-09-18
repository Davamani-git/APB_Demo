const { test, expect } = require('@playwright/test');
const AlertsPage = require('../pages/Alerts.page');

test.describe('QE-5856 - Automated Overspend Alerts', () => {
  let alertsPage;

  test.beforeEach(async ({ page }) => {
    alertsPage = new AlertsPage(page);
  });

  test('QE-5856 TS-001 TC-001 - Verify alert generation when spend exceeds threshold', async ({ page }) => {
    await alertsPage.configureThreshold('Acme Corp', '50000');
    await alertsPage.simulateSpendData('55000');
    await alertsPage.waitForAlert(300000);
    await expect(alertsPage.alertNotification).toBeVisible();
    await alertsPage.navigateToDashboard();
    await expect(alertsPage.recommendation).toBeVisible();
  });

  test('QE-5856 TS-002 TC-001 - Verify no alert when spend below threshold', async ({ page }) => {
    await alertsPage.configureThreshold('Acme Corp', '50000');
    await alertsPage.simulateSpendData('49500');
    await alertsPage.waitForProcessing();
    await expect(alertsPage.alertNotification).not.toBeVisible();
  });

  test('QE-5856 TS-003 TC-001 - Verify system logs failure and retries on alert service delay', async ({ page }) => {
    await alertsPage.configureThreshold('Acme Corp', '50000');
    await alertsPage.simulateServiceFailure();
    await alertsPage.simulateSpendData('55000');
    await alertsPage.verifyFailureLogged();
    await alertsPage.verifyRetryInitiated();
  });
});