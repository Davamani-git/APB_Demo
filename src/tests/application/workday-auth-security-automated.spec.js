// QE-1553 Authentication & Security Scenarios
const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/workday-login.page');
const RegisterPage = require('../../pages/workday-register.page');
const AdminDashboardPage = require('../../pages/workday-admin-dashboard.page');
const AuditLogPage = require('../../pages/workday-audit-log.page');
const TD = require('../../data/workday-test-data');

// [TS001] Registration/Login - HTTPS & Storage
// [QE-1553 TS001 TC-001]
test.describe('[UI] QE-1553: Registration/Login Security', { tag: ['@security', '@regression', '@e2e'] }, () => {
  test('[QE-1553 TS001 TC-001] Registration uses HTTPS, secure storage', async ({ page }) => {
    const register = new RegisterPage(page);
    await page.goto(TD.urls.register, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(page).toHaveURL(/https:\/\//);
    await register.register(TD.users.newuser.username, TD.users.newuser.password);
    // Custom utility to inspect network traffic for HTTPS (not Playwright-native, pseudo-code)
    await expect(register.credentialsSentSecurely()).resolves.toBeTruthy();
    await expect(register.credentialsStoredEncrypted()).resolves.toBeTruthy();
  });
});

// [TS002] Audit Log - Authentication Event
// [QE-1553 TS002 TC-001]
test.describe('[UI] QE-1553: Audit Log', { tag: ['@security', '@regression', '@e2e'] }, () => {
  test('[QE-1553 TS002 TC-001] Audit log records login', async ({ page }) => {
    const login = new LoginPage(page);
    const admin = new AdminDashboardPage(page);
    const audit = new AuditLogPage(page);
    await login.login(TD.users.user2.username, TD.users.user2.password);
    await admin.gotoAuditLog();
    await expect(audit.logContainsAuthEvent(TD.users.user2.username)).resolves.toBeTruthy();
  });
});

// [TS003] Malicious Login Attempt
// [QE-1553 TS003 TC-001]
test.describe('[UI] QE-1553: Malicious Login Attempt', { tag: ['@security', '@regression', '@e2e'] }, () => {
  test('[QE-1553 TS003 TC-001] SQL injection in login', async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto(TD.urls.login, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(page).toHaveURL(TD.urlPatterns.login);
    await login.login(`' OR '1'='1`, 'any');
    await expect(login.accessDeniedError()).toBeVisible();
    await expect(login.noSensitiveInfoInError()).resolves.toBeTruthy();
  });
});
