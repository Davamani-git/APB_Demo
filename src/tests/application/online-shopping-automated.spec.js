// QE-1638 TS-001 TC-001
const { test, expect } = require('../../fixtures');
const { getHomePage } = require('../../pages/online-shopping.page');
const { getTestData } = require('../../data/workday-test-data');
const logger = require('../../integrations/logging-reporter');

test.describe('Online Shopping - Search and Filter', () => {
  test('QE-1638 TS-001 TC-001: Search and filter products as valid user', async ({ page }) => {
    const testData = getTestData('QE-1638 TS-001 TC-001');
    const homePage = getHomePage(page);
    logger.info('Launching application');
    await homePage.goto(testData.url);
    await expect(page).toHaveURL(/shop\.example\.com/);
    logger.info('Logging in as valid user');
    await homePage.login(testData.username, testData.password);
    await expect(homePage.dashboardHeader()).toBeVisible();
    logger.info('Searching for product keyword');
    await homePage.searchProduct(testData.keyword);
    await expect(homePage.searchResults()).toBeVisible({ timeout: 2000 });
    logger.info('Applying filters');
    await homePage.applyFilters(testData.filters);
    await expect(homePage.filteredResults()).toBeVisible({ timeout: 2000 });
    await expect(homePage.filteredResults()).toContainText(testData.filters.brand);
  });
});

// QE-1638 TS-002 TC-001

test.describe('Online Shopping - Restricted User Search', () => {
  test('QE-1638 TS-002 TC-001: Restricted user category access', async ({ page }) => {
    const testData = getTestData('QE-1638 TS-002 TC-001');
    const homePage = getHomePage(page);
    logger.info('Launching application and logging in as restricted user');
    await homePage.goto();
    await homePage.login(testData.username, testData.password);
    await expect(homePage.dashboardHeader()).toBeVisible();
    logger.info('Searching for unauthorized products');
    await homePage.searchProduct(testData.keyword);
    await expect(homePage.noUnauthorizedResults()).toBeVisible();
    logger.info('Applying restricted filters');
    await homePage.applyFilters(testData.filters);
    await expect(homePage.authorizedResults()).toBeVisible();
  });
});

// QE-1638 TS-003 TC-001

test.describe('Online Shopping - Limited User Access', () => {
  test('QE-1638 TS-003 TC-001: Limited user cannot access unauthorized products', async ({ page }) => {
    const testData = getTestData('QE-1638 TS-003 TC-001');
    const homePage = getHomePage(page);
    logger.info('Login as limited user');
    await homePage.goto();
    await homePage.login(testData.username, testData.password);
    await expect(homePage.dashboardHeader()).toBeVisible();
    logger.info('Manually altering search query for unauthorized products');
    await homePage.manualSearchQuery(testData.query);
    await expect(homePage.restrictedResults()).not.toBeVisible();
  });
});

// QE-1637 TS-001 TC-001

test.describe('Online Shopping - Consumer Purchase Flow', () => {
  test('QE-1637 TS-001 TC-001: End-to-end purchase as consumer', async ({ page }) => {
    const testData = getTestData('QE-1637 TS-001 TC-001');
    const homePage = getHomePage(page);
    logger.info('Login as consumer');
    await homePage.goto();
    await homePage.login(testData.username, testData.password);
    await expect(homePage.dashboardHeader()).toBeVisible();
    logger.info('Searching and selecting product');
    await homePage.searchAndSelectProduct(testData.product);
    await expect(homePage.productDetailsHeader()).toBeVisible();
    logger.info('Adding product to cart');
    await homePage.addToCart();
    await expect(homePage.cartBadge()).toBeVisible();
    logger.info('Proceeding to checkout');
    await homePage.proceedToCheckout();
    await expect(homePage.checkoutHeader()).toBeVisible();
    logger.info('Completing purchase');
    await homePage.completePurchase(testData.payment);
    await expect(homePage.orderSuccessHeader()).toBeVisible();
  });
});

// QE-1637 TS-002 TC-001

test.describe('Online Shopping - Payment Security', () => {
  test('QE-1637 TS-002 TC-001: Payment encryption and PCI DSS compliance', async ({ page }) => {
    const testData = getTestData('QE-1637 TS-002 TC-001');
    const homePage = getHomePage(page);
    logger.info('Add product and proceed to checkout');
    await homePage.goto();
    await homePage.addProductToCart(testData.product);
    await homePage.proceedToCheckout();
    await expect(homePage.checkoutHeader()).toBeVisible();
    logger.info('Entering payment details');
    await homePage.enterPaymentDetails(testData.payment);
    await expect(homePage.paymentConfirmation()).toBeVisible();
    logger.info('Verifying network encryption');
    await homePage.verifyPaymentOverHttps();
    logger.info('Checking PCI DSS logs');
    await homePage.verifyPciDssCompliance();
  });
});

// QE-1637 TS-003 TC-001

test.describe('Online Shopping - Payment Validation', () => {
  test('QE-1637 TS-003 TC-001: Invalid and incomplete payment rejection', async ({ page }) => {
    const testData = getTestData('QE-1637 TS-003 TC-001');
    const homePage = getHomePage(page);
    logger.info('Add product and proceed to checkout');
    await homePage.goto();
    await homePage.addProductToCart(testData.product);
    await homePage.proceedToCheckout();
    await expect(homePage.checkoutHeader()).toBeVisible();
    logger.info('Entering incomplete payment information');
    await homePage.enterPaymentDetails(testData.incompletePayment);
    await expect(homePage.paymentError()).toBeVisible();
    logger.info('Entering invalid payment information');
    await homePage.enterPaymentDetails(testData.invalidPayment);
    await expect(homePage.paymentError()).toBeVisible();
  });
});

// QE-1636 TS-001 TC-001

test.describe('Online Shopping - Admin User Management', () => {
  test('QE-1636 TS-001 TC-001: Admin role assignment and revocation', async ({ page }) => {
    const testData = getTestData('QE-1636 TS-001 TC-001');
    const adminPage = require('../../pages/online-shopping-admin.page').getAdminPage(page);
    logger.info('Login as administrator');
    await adminPage.goto();
    await adminPage.login(testData.username, testData.password);
    await expect(adminPage.dashboardHeader()).toBeVisible();
    logger.info('Navigating to user management');
    await adminPage.gotoUserManagement();
    await expect(adminPage.userManagementHeader()).toBeVisible();
    logger.info('Assigning new role to user');
    await adminPage.assignRole(testData.assignUser, testData.assignRole);
    await expect(adminPage.roleAssignmentSuccess()).toBeVisible();
    logger.info('Revoking role from user');
    await adminPage.revokeRole(testData.revokeUser, testData.revokeRole);
    await expect(adminPage.roleRevocationSuccess()).toBeVisible();
  });
});

// QE-1636 TS-002 TC-001

test.describe('Online Shopping - Admin Audit Logs', () => {
  test('QE-1636 TS-002 TC-001: Audit log for role assignment/revocation', async ({ page }) => {
    const testData = getTestData('QE-1636 TS-002 TC-001');
    const adminPage = require('../../pages/online-shopping-admin.page').getAdminPage(page);
    logger.info('Assign or revoke role as admin');
    await adminPage.goto();
    await adminPage.assignOrRevokeRole(testData.user, testData.role);
    logger.info('Accessing audit logs');
    await adminPage.gotoAuditLogs();
    await expect(adminPage.auditLogEntry(testData.user, testData.role)).toBeVisible();
  });
});

// QE-1636 TS-003 TC-001

test.describe('Online Shopping - Non-Admin Role Protection', () => {
  test('QE-1636 TS-003 TC-001: Non-admin cannot assign/revoke roles', async ({ page }) => {
    const testData = getTestData('QE-1636 TS-003 TC-001');
    const homePage = getHomePage(page);
    logger.info('Login as non-admin user');
    await homePage.goto();
    await homePage.login(testData.username, testData.password);
    await expect(homePage.dashboardHeader()).toBeVisible();
    logger.info('Attempting to assign or revoke roles');
    await homePage.attemptRoleChange(testData.targetUser, testData.role);
    await expect(homePage.permissionDeniedError()).toBeVisible();
  });
});

// QE-1635 TS-001 TC-001

test.describe('Online Shopping - Account Status Management', () => {
  test('QE-1635 TS-001 TC-001: Update account status', async ({ page }) => {
    const testData = getTestData('QE-1635 TS-001 TC-001');
    const homePage = getHomePage(page);
    logger.info('Login as valid user');
    await homePage.goto();
    await homePage.login(testData.username, testData.password);
    await expect(homePage.dashboardHeader()).toBeVisible();
    logger.info('Navigating to account status page');
    await homePage.gotoAccountStatus();
    await expect(homePage.accountStatusHeader()).toBeVisible();
    logger.info('Updating account status');
    await homePage.updateAccountStatus(testData.status);
    await expect(homePage.accountStatusSuccess()).toBeVisible();
  });
});
