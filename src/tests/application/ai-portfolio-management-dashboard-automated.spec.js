const { test, expect } = require('../../fixtures');
const DashboardPage = require('../../pages/dashboard.page');
const UserManagementPage = require('../../pages/user-management.page');
const AuditLogPage = require('../../pages/audit-log.page');
const CloudIntegrationPage = require('../../pages/cloud-integration.page');
const BudgetPage = require('../../pages/budget.page');
const PortfolioPage = require('../../pages/portfolio.page');
const MetricsPage = require('../../pages/metrics.page');
const AnalyticsPage = require('../../pages/analytics.page');
const TD = require('../../data/workday-test-data');

// QE-3526: Admin Role Assignment and Authorization
// QE-3525: SSO Login
// QE-3524: Audit Log Verification
// QE-3523: AI Usage & Recommendations
// QE-3522: Cloud Integration
// QE-3521: Budget Threshold & Alert
// QE-3520: Data Freshness Warning
// QE-3519: Credential Vault Security
// QE-3518: Real-Time Metrics
// QE-3517: Company Analytics Navigation

test.describe('[UI] AI Portfolio Management Dashboard', () => {
  // QE-3526: Admin Role Assignment and Authorization
  test('[QE-3526] Admin can assign/revoke roles, unauthorized assignment denied', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const userMgmt = new UserManagementPage(page);
    await dashboard.goto(TD.urls.dashboard);
    await dashboard.login(TD.users.admin_user.username, TD.users.admin_user.password);
    expect(await dashboard.isLoaded()).toBeTruthy();
    await dashboard.navigateToUserManagement();
    expect(await userMgmt.isLoaded()).toBeTruthy();
    await userMgmt.assignRole('test_user', 'Portfolio Viewer');
    expect(await userMgmt.isRoleAssigned('test_user', 'Portfolio Viewer')).toBeTruthy();
    await userMgmt.revokeRole('test_user', 'Portfolio Viewer');
    expect(await userMgmt.isRoleAssigned('test_user', 'Portfolio Viewer')).toBeFalsy();
    // Non-admin attempt
    await dashboard.logout();
    await dashboard.login(TD.users.regular_user.username, TD.users.regular_user.password);
    await dashboard.navigateToUserManagement();
    await expect(userMgmt.tryAssignRoleUnauthorized('test_user', 'Portfolio Viewer')).rejects.toThrow();
    expect(await userMgmt.isUnauthorizedAttemptLogged('regular_user')).toBeTruthy();
  });

  // QE-3525: SSO Login
  test('[QE-3525] SSO login redirects and authenticates', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto(TD.urls.dashboard);
    await dashboard.loginWithSSO('Okta', TD.users.sso_user.username, TD.users.sso_user.password);
    expect(await dashboard.isLoaded()).toBeTruthy();
  });

  // QE-3524: Audit Log Verification
  test('[QE-3524] Actions are audit-logged', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const audit = new AuditLogPage(page);
    await dashboard.goto(TD.urls.dashboard);
    await dashboard.login(TD.users.audit_user.username, TD.users.audit_user.password);
    expect(await dashboard.isLoaded()).toBeTruthy();
    await dashboard.exportData();
    await dashboard.changeRole('audit_user', 'Portfolio Viewer');
    await dashboard.navigateToAuditLogs();
    expect(await audit.hasEntry('audit_user', 'Login')).toBeTruthy();
    expect(await audit.hasEntry('audit_user', 'Export')).toBeTruthy();
    expect(await audit.hasEntry('audit_user', 'Role Change')).toBeTruthy();
  });

  // QE-3523: AI Usage & Recommendations
  test('[QE-3523] AI usage data and recommendations', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto(TD.urls.dashboard);
    await dashboard.login(TD.users.ai_user.username, TD.users.ai_user.password);
    expect(await dashboard.isLoaded()).toBeTruthy();
    expect(await dashboard.isUsageDataVisible()).toBeTruthy();
    await dashboard.runRecommendationEngine();
    expect(await dashboard.hasCostOptimizationSuggestions()).toBeTruthy();
  });

  // QE-3522: Cloud Integration
  test('[QE-3522] Add/update cloud connection and validate', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const cloud = new CloudIntegrationPage(page);
    await dashboard.goto(TD.urls.dashboard);
    await dashboard.login(TD.users.cloud_admin.username, TD.users.cloud_admin.password);
    expect(await dashboard.isLoaded()).toBeTruthy();
    await dashboard.navigateToCloudIntegration();
    await cloud.addOrUpdateConnection('AWS', TD.cloudCredentials.AWS);
    expect(await cloud.isValidationPromptVisible()).toBeTruthy();
    await cloud.submitCredentials();
    expect(await cloud.isIntegrationSuccess()).toBeTruthy();
  });

  // QE-3521: Budget Threshold & Alert
  test('[QE-3521] Set budget threshold, alert on exceed', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const budget = new BudgetPage(page);
    await dashboard.goto(TD.urls.dashboard);
    await dashboard.login(TD.users.budget_admin.username, TD.users.budget_admin.password);
    expect(await dashboard.isLoaded()).toBeTruthy();
    await dashboard.navigateToBudget();
    await budget.setThreshold(10000);
    expect(await budget.isThresholdSet(10000)).toBeTruthy();
    await budget.simulateAISpend(10500);
    expect(await budget.isAlertSent()).toBeTruthy();
  });

  // QE-3520: Data Freshness Warning
  test('[QE-3520] Data freshness warning for stale data', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const portfolio = new PortfolioPage(page);
    await dashboard.goto(TD.urls.dashboard);
    await dashboard.login(TD.users.data_user.username, TD.users.data_user.password);
    expect(await dashboard.isLoaded()).toBeTruthy();
    await dashboard.viewPortfolioCompany('OldDataCo');
    expect(await portfolio.isStaleDataWarningVisible('OldDataCo')).toBeTruthy();
    expect(await portfolio.isStaleDataTooltipVisible('OldDataCo')).toBeTruthy();
  });

  // QE-3519: Credential Vault Security
  test('[QE-3519] Credentials encrypted, access denied to non-admin', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto(TD.urls.dashboard);
    await dashboard.login(TD.users.vault_admin.username, TD.users.vault_admin.password);
    expect(await dashboard.isLoaded()).toBeTruthy();
    await dashboard.enterAndSaveCredentials('APIKey123');
    expect(await dashboard.isCredentialsEncrypted()).toBeTruthy();
    await dashboard.logout();
    await dashboard.login(TD.users.non_admin.username, TD.users.non_admin.password);
    await expect(dashboard.tryAccessCredentialsUnauthorized()).rejects.toThrow();
    expect(await dashboard.isUnauthorizedAttemptLogged('non_admin')).toBeTruthy();
  });

  // QE-3518: Real-Time Metrics
  test('[QE-3518] Metrics update in real-time', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const metrics = new MetricsPage(page);
    await dashboard.goto(TD.urls.dashboard);
    await dashboard.login(TD.users.metrics_user.username, TD.users.metrics_user.password);
    expect(await dashboard.isLoaded()).toBeTruthy();
    expect(await metrics.areMetricsVisible()).toBeTruthy();
    expect(await metrics.areMetricsUpdatedWithin(3)).toBeTruthy();
    await metrics.simulateRealTimeUpdate('AI Spend');
    expect(await metrics.isDashboardRefreshed()).toBeTruthy();
  });

  // QE-3517: Company Analytics Navigation
  test('[QE-3517] Company analytics and navigation', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const analytics = new AnalyticsPage(page);
    await dashboard.goto(TD.urls.dashboard);
    await dashboard.login(TD.users.analytics_user.username, TD.users.analytics_user.password);
    expect(await dashboard.isLoaded()).toBeTruthy();
    await dashboard.selectCompany('AnalyticsCo');
    expect(await analytics.isDetailViewLoaded('AnalyticsCo')).toBeTruthy();
    await analytics.navigateBackToDashboard();
    expect(await dashboard.isLoaded()).toBeTruthy();
  });
});
