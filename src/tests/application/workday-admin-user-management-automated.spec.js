// QE-1552 Admin User Management Scenarios
const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/workday-login.page');
const AdminDashboardPage = require('../../pages/workday-admin-dashboard.page');
const UserManagementPage = require('../../pages/workday-user-management.page');
const DashboardPage = require('../../pages/workday-dashboard.page');
const TD = require('../../data/workday-test-data');

// [TS001] Admin assigns new role and verifies permissions
// [QE-1552 TS001 TC-001]
test.describe('[UI] QE-1552: Admin User Management', { tag: ['@regression', '@e2e'] }, () => {
  test('[QE-1552 TS001 TC-001] Assign new role to user and verify access', async ({ page }) => {
    const login = new LoginPage(page);
    const admin = new AdminDashboardPage(page);
    const userMgmt = new UserManagementPage(page);
    const dashboard = new DashboardPage(page);
    await login.login(TD.users.admin1.username, TD.users.admin1.password);
    await expect(admin.dashboardHeader()).toBeVisible();
    await admin.gotoUserManagement();
    await expect(userMgmt.pageHeader()).toBeVisible();
    await userMgmt.assignRole('user3', 'Editor');
    await expect(userMgmt.roleAssignmentConfirmation()).toBeVisible();
    await login.login(TD.users.user3.username, TD.users.user3.password);
    await expect(dashboard.hasRoleAccess('Editor')).resolves.toBeTruthy();
    await expect(dashboard.noAccessToUnauthorizedFeatures('Editor')).resolves.toBeTruthy();
  });
});
