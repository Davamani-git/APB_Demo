const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { UserManagementPage } = require('./pages/userManagement.page');
const { DashboardPage } = require('./pages/dashboard.page');
const logger = require('../utils/logger');

test.describe('User Management and Role-Based Access Control', () => {

  test('TC-001: Assign user to portfolio companies with read-only permissions', async ({ page }) => {
    logger.info('Starting TC-001: Assign user to portfolio companies with read-only permissions');
    const loginPage = new LoginPage(page);
    const userManagementPage = new UserManagementPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch and login as Enterprise Admin
    await loginPage.navigate();
    await loginPage.login('admin@enterprise.com', 'Admin@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Enterprise Admin dashboard loaded successfully');

    // Step 2: Navigate to User Management section
    await userManagementPage.navigateToUserManagement();
    await expect(userManagementPage.userListContainer).toBeVisible();
    logger.info('User Management page displayed with list of users');

    // Step 3: Select a user from the user list
    await userManagementPage.selectUser('testuser@company.com');
    await expect(userManagementPage.userDetailsPanel).toBeVisible();
    logger.info('User details and permissions panel opened');

    // Step 4: Assign user to specific portfolio companies
    await userManagementPage.assignPortfolioCompanies(['Portfolio Company A', 'Portfolio Company B']);
    await expect(userManagementPage.assignedCompaniesContainer).toContainText('Portfolio Company A');
    await expect(userManagementPage.assignedCompaniesContainer).toContainText('Portfolio Company B');
    logger.info('Portfolio companies successfully added to user access list');

    // Step 5: Set role permissions to read-only
    await userManagementPage.setRolePermission('Read-Only');
    await expect(userManagementPage.rolePermissionIndicator).toContainText('Read-Only');
    logger.info('Read-only permission applied and saved');

    // Step 6: Save the configuration
    await userManagementPage.saveConfiguration();
    await expect(userManagementPage.successMessage).toBeVisible();
    await expect(userManagementPage.successMessage).toContainText('role assignment');
    logger.info('Success message displayed confirming role assignment');

    // Step 7: Log out and log in as the assigned user
    await loginPage.logout();
    await loginPage.login('testuser@company.com', 'Test@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Assigned user successfully logged in');

    // Step 8: Navigate to portfolio companies dashboard
    await dashboardPage.navigateToPortfolioCompaniesDashboard();
    await expect(dashboardPage.portfolioCompanyItem('Portfolio Company A')).toBeVisible();
    await expect(dashboardPage.portfolioCompanyItem('Portfolio Company B')).toBeVisible();
    await expect(dashboardPage.readOnlyIndicator).toBeVisible();
    logger.info('User can only view data for assigned companies with read-only access');
  });

  test('TC-002: Configure multiple users with different roles and verify audit logs', async ({ page }) => {
    logger.info('Starting TC-002: Configure multiple users with different roles');
    const loginPage = new LoginPage(page);
    const userManagementPage = new UserManagementPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Login as Enterprise Admin
    await loginPage.navigate();
    await loginPage.login('admin@enterprise.com', 'Admin@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Enterprise Admin dashboard loaded successfully');

    // Step 2: Navigate to User Management section
    await userManagementPage.navigateToUserManagement();
    await expect(userManagementPage.userManagementPage).toBeVisible();
    logger.info('User Management page displays');

    // Step 3: Configure first user with Editor role for Company A
    await userManagementPage.selectUser('user1@company.com');
    await userManagementPage.assignPortfolioCompanies(['Portfolio Company A']);
    await userManagementPage.setRolePermission('Editor');
    await userManagementPage.saveConfiguration();
    await expect(userManagementPage.successMessage).toBeVisible();
    logger.info('First user assigned Editor role for Company A successfully');

    // Step 4: Configure second user with Read-Only role for Company B
    await userManagementPage.selectUser('user2@company.com');
    await userManagementPage.assignPortfolioCompanies(['Portfolio Company B']);
    await userManagementPage.setRolePermission('Read-Only');
    await userManagementPage.saveConfiguration();
    await expect(userManagementPage.successMessage).toBeVisible();
    logger.info('Second user assigned Read-Only role for Company B successfully');

    // Step 5: Configure third user with Admin role for Company C
    await userManagementPage.selectUser('user3@company.com');
    await userManagementPage.assignPortfolioCompanies(['Portfolio Company C']);
    await userManagementPage.setRolePermission('Admin');
    await userManagementPage.saveConfiguration();
    await expect(userManagementPage.successMessage).toBeVisible();
    logger.info('Third user assigned Admin role for Company C successfully');

    // Step 6: Save all configurations
    await expect(userManagementPage.successMessage).toContainText('successfully');
    logger.info('All permission configurations saved successfully');

    // Step 7: Verify access control by logging in as User1
    await loginPage.logout();
    await loginPage.login('user1@company.com', 'User1@123');
    await dashboardPage.navigateToCompanyDashboard('Portfolio Company A');
    await expect(dashboardPage.editButton).toBeVisible();
    logger.info('User1 can edit data for Company A only');

    // Step 8: Check audit logs
    await loginPage.logout();
    await loginPage.login('admin@enterprise.com', 'Admin@123');
    await userManagementPage.navigateToAuditLogs();
    await expect(userManagementPage.auditLogEntry).toBeVisible();
    await expect(userManagementPage.auditLogTimestamp).toBeVisible();
    await expect(userManagementPage.auditLogUserDetails).toBeVisible();
    await expect(userManagementPage.auditLogActions).toBeVisible();
    logger.info('Audit logs show all access attempts with timestamps, user details, and actions');
  });

  test('TC-003: Verify read-only and admin access enforcement', async ({ page }) => {
    logger.info('Starting TC-003: Verify read-only and admin access enforcement');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const userManagementPage = new UserManagementPage(page);

    // Step 1: Log in as User2 with Read-Only access
    await loginPage.navigate();
    await loginPage.login('user2@company.com', 'User2@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User2 successfully logged in');

    // Step 2: Navigate to Company B dashboard
    await dashboardPage.navigateToCompanyDashboard('Company B');
    await expect(dashboardPage.companyDataContainer).toBeVisible();
    await expect(dashboardPage.readOnlyIndicator).toBeVisible();
    logger.info('Company B data is displayed in read-only mode');

    // Step 3: Attempt to edit any data field
    const editDisabled = await dashboardPage.isEditFunctionalityDisabled();
    expect(editDisabled).toBe(true);
    logger.info('Edit functionality is disabled or not visible');

    // Step 4: Log out and log in as User3 with Admin access
    await loginPage.logout();
    await loginPage.login('user3@company.com', 'User3@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User3 successfully logged in');

    // Step 5: Navigate to Company C dashboard
    await dashboardPage.navigateToCompanyDashboard('Company C');
    await expect(dashboardPage.companyDataContainer).toBeVisible();
    await expect(dashboardPage.adminControlsContainer).toBeVisible();
    logger.info('Company C data is displayed with full admin controls');

    // Step 6: Verify all admin functions are accessible
    await expect(dashboardPage.editButton).toBeVisible();
    await expect(dashboardPage.deleteButton).toBeVisible();
    await expect(dashboardPage.configureButton).toBeVisible();
    logger.info('All admin functions are available and functional');

    // Step 7: Check audit logs as Enterprise Admin
    await loginPage.logout();
    await loginPage.login('admin@enterprise.com', 'Admin@123');
    await userManagementPage.navigateToAuditLogs();
    await userManagementPage.filterAuditLogs('user2@company.com');
    await expect(userManagementPage.auditLogEntry).toBeVisible();
    await userManagementPage.filterAuditLogs('user3@company.com');
    await expect(userManagementPage.auditLogEntry).toBeVisible();
    logger.info('All access attempts by User2 and User3 are logged with correct permissions');
  });

  test('TC-004: Verify unauthorized access prevention and audit logging', async ({ page }) => {
    logger.info('Starting TC-004: Verify unauthorized access prevention');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const userManagementPage = new UserManagementPage(page);

    // Step 1: Log in as restricted user
    await loginPage.navigate();
    await loginPage.login('restricteduser@company.com', 'Restricted@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('User successfully logged in');

    // Step 2: Navigate to portfolio companies list
    await dashboardPage.navigateToPortfolioCompaniesDashboard();
    await expect(dashboardPage.portfolioCompanyItem('Company A')).toBeVisible();
    const companyBVisible = await dashboardPage.portfolioCompanyItem('Company B').isVisible().catch(() => false);
    expect(companyBVisible).toBe(false);
    logger.info('Only Company A is visible in the user portfolio list');

    // Step 3: Attempt to access Company B by direct URL
    await dashboardPage.navigateToCompanyByURL('/dashboard/company-b');
    await expect(dashboardPage.accessDeniedMessage).toBeVisible();
    logger.info('Access is denied with appropriate error message displayed');

    // Step 4: Verify error message content
    await expect(dashboardPage.accessDeniedMessage).toContainText('Access Denied: You do not have permission to view this company\'s data');
    logger.info('Error message states access denied with proper text');

    // Step 5: Log out and log in as Enterprise Admin
    await loginPage.logout();
    await loginPage.login('admin@enterprise.com', 'Admin@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Enterprise Admin successfully logged in');

    // Step 6: Navigate to audit logs and search for unauthorized access attempt
    await userManagementPage.navigateToAuditLogs();
    await userManagementPage.filterAuditLogsByUser('restricteduser@company.com');
    await userManagementPage.filterAuditLogsByEventType('Unauthorized Access');
    await expect(userManagementPage.auditLogEntry).toBeVisible();
    await expect(userManagementPage.auditLogTimestamp).toBeVisible();
    await expect(userManagementPage.auditLogUserDetails).toContainText('restricteduser@company.com');
    await expect(userManagementPage.auditLogTargetResource).toContainText('Company B');
    logger.info('Audit log entry shows unauthorized access attempt with all required details');
  });
});
