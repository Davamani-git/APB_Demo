const { test, expect } = require('../../fixtures');
const AppPage = require('../../pages/app.page');
const AdminPage = require('../../pages/admin.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] Accessibility & Performance Monitoring', () => {
  test('[QE-1874 TS-001 TC-001] App loads quickly, accessibility violation detected', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto(TD.urls.app);
    await expect(await app.isLoadedWithin(2000)).toBeTruthy();
    await app.introduceAccessibilityViolation(TD.images.noAltText);
    await expect(await app.isAccessibilityIssueLogged()).toBeTruthy();
  });

  test('[QE-1874 TS-002 TC-001] High traffic degrades performance, admin notified', async ({ page }) => {
    const app = new AppPage(page);
    const admin = new AdminPage(page);
    await app.simulateHighTraffic(TD.traffic.highConcurrentUsers);
    await expect(await app.isLoadTimeExceeded(2000)).toBeTruthy();
    await admin.login(TD.adminCredentials);
    await admin.gotoNotifications();
    await expect(await admin.isPerformanceAlertVisible()).toBeTruthy();
    await expect(await admin.isPerformanceIssueLogged()).toBeTruthy();
  });
});
