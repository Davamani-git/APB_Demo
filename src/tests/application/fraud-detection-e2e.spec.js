const { test, expect } = require('../../fixtures');
const ConsumerPage = require('../../pages/consumer.page');
const AdminPage = require('../../pages/admin.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] Fraud Detection & Alerts', () => {
  test('[QE-1875 TS-001 TC-001] Suspicious transaction is flagged and alert is visible to admin', async ({ page }) => {
    const consumer = new ConsumerPage(page);
    const admin = new AdminPage(page);
    // Step 1: Consumer transaction with suspicious attributes
    await consumer.login(TD.users.testuser1);
    await consumer.performTransaction({ amount: TD.amounts.high, shipping: TD.shipping.mismatched });
    await expect(await consumer.isTransactionFlagged()).toBeTruthy();
    // Step 2: Admin login
    await admin.login(TD.adminCredentials);
    await expect(await admin.isDashboardLoaded()).toBeTruthy();
    // Step 3: Check fraud alerts
    await admin.gotoFraudDetectionAlerts();
    await expect(await admin.isSuspiciousTransactionAlertVisible(TD.users.testuser1)).toBeTruthy();
  });

  test('[QE-1875 TS-002 TC-001] Suspicious transaction is logged with all details', async ({ page }) => {
    const consumer = new ConsumerPage(page);
    const admin = new AdminPage(page);
    await consumer.login(TD.users.testuser2);
    await consumer.performTransaction({ amount: TD.amounts.suspicious, location: TD.locations.unusual });
    await expect(await consumer.isTransactionFlagged()).toBeTruthy();
    await admin.login(TD.adminCredentials);
    await admin.gotoSuspiciousTransactionLogs();
    const log = await admin.getTransactionLog(TD.users.testuser2);
    expect(log).toMatchObject({ user: TD.users.testuser2, amount: TD.amounts.suspicious, location: TD.locations.unusual, timestamp: expect.any(String) });
  });

  test('[QE-1875 TS-003 TC-001] Legitimate transaction flagged, admin reviews and dismisses alert', async ({ page }) => {
    const consumer = new ConsumerPage(page);
    const admin = new AdminPage(page);
    await consumer.login(TD.users.trustedbuyer);
    await consumer.performTransaction({ amount: TD.amounts.legitimateHigh });
    await expect(await consumer.isAlertGenerated()).toBeTruthy();
    await admin.login(TD.adminCredentials);
    await admin.gotoFraudDetectionAlerts();
    await expect(await admin.canReviewAlert(TD.users.trustedbuyer)).toBeTruthy();
    await admin.dismissAlertAsFalsePositive(TD.users.trustedbuyer);
    await expect(await admin.isAlertRemoved(TD.users.trustedbuyer)).toBeTruthy();
    await expect(await admin.isDismissalLogged(TD.users.trustedbuyer)).toBeTruthy();
  });
});
