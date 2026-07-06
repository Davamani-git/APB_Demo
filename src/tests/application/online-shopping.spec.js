const { test, expect } = require('../../fixtures');
const HomePage = require('../../pages/home.page');
const CatalogPage = require('../../pages/catalog.page');
const CartPage = require('../../pages/cart.page');
const LoginPage = require('../../pages/login.page');
const RegistrationPage = require('../../pages/registration.page');
const DashboardPage = require('../../pages/dashboard.page');
const OrderPage = require('../../pages/order.page');
const ReviewPage = require('../../pages/review.page');
const RefundPage = require('../../pages/refund.page');
const AuditPage = require('../../pages/audit.page');
const TD = require('../../data/workday-test-data');
const logger = require('../../integrations/logging-reporter');

// QE-1657 TS-001 TC-001: Search & Filter
// @e2e @smoke
 test('QE-1657 TS-001 TC-001 - Product search and filter', async ({ page }) => {
  logger.info('Launching online shopping platform');
  const home = new HomePage(page);
  await home.goto(TD.urls.shop);
  await expect(home.homeTitle()).toHaveText(TD.pageTitles.home);
  logger.info('Navigating to catalog/search');
  const catalog = new CatalogPage(page);
  await catalog.goto();
  await expect(catalog.catalogTitle()).toHaveText(TD.pageTitles.catalog);
  logger.info('Applying search and filter');
  await catalog.searchProduct('laptop');
  await catalog.applyCategoryFilter('Electronics');
  await expect(catalog.filteredProducts()).toContainText('laptop');
  await expect(catalog.filteredProducts()).toBeVisible();
 });

// QE-1657 TS-002 TC-001: Filter & Clear
// @regression
 test('QE-1657 TS-002 TC-001 - Filter products and clear filter', async ({ page }) => {
  logger.info('Launching online shopping platform');
  const home = new HomePage(page);
  await home.goto(TD.urls.shop);
  await expect(home.homeTitle()).toHaveText(TD.pageTitles.home);
  const catalog = new CatalogPage(page);
  await catalog.goto();
  await catalog.applyCategoryFilter('Electronics');
  await catalog.applyPriceFilter(100, 500);
  await expect(catalog.filteredProducts()).toBeVisible();
  logger.info('Clearing filters');
  await catalog.clearAllFilters();
  await expect(catalog.allProducts()).toBeVisible();
 });

// QE-1657 TS-003 TC-001: Invalid Search/Filter
// @regression
 test('QE-1657 TS-003 TC-001 - Invalid search/filter', async ({ page }) => {
  logger.info('Launching online shopping platform');
  const home = new HomePage(page);
  await home.goto(TD.urls.shop);
  const catalog = new CatalogPage(page);
  await catalog.goto();
  await catalog.searchProduct('@@@@');
  await catalog.applyCategoryFilter('Unicorns');
  await expect(catalog.emptyState()).toBeVisible();
  await expect(catalog.emptyState()).toHaveText(TD.errors.noResults);
 });

// QE-1656 TS-001 TC-001: Add to Cart
// @e2e
 test('QE-1656 TS-001 TC-001 - Add product to cart', async ({ page }) => {
  logger.info('Launching online shopping platform');
  const home = new HomePage(page);
  await home.goto(TD.urls.shop);
  const login = new LoginPage(page);
  await login.login('testuser', 'Pass@123');
  const dashboard = new DashboardPage(page);
  await expect(dashboard.dashboardTitle()).toHaveText(TD.pageTitles.dashboard);
  const catalog = new CatalogPage(page);
  await catalog.goto();
  await catalog.selectProduct('Wireless Mouse');
  const cart = new CartPage(page);
  await cart.addToCart();
  await expect(cart.cartCount()).toBe(TD.cartCounts.one);
 });

// QE-1656 TS-002 TC-001: Multiple Cart Items & Checkout
// @e2e @regression
 test('QE-1656 TS-002 TC-001 - Add multiple products and checkout', async ({ page }) => {
  logger.info('Launching online shopping platform');
  const home = new HomePage(page);
  await home.goto(TD.urls.shop);
  const login = new LoginPage(page);
  await login.login('testuser', 'Pass@123');
  const catalog = new CatalogPage(page);
  await catalog.goto();
  await catalog.selectProduct('Wireless Mouse');
  await catalog.selectProduct('Bluetooth Keyboard');
  const cart = new CartPage(page);
  await expect(cart.cartCount()).toBe(TD.cartCounts.two);
  await cart.proceedToCheckout();
  const order = new OrderPage(page);
  await expect(order.orderSummary()).toContainText('Wireless Mouse');
  await expect(order.orderSummary()).toContainText('Bluetooth Keyboard');
 });

// QE-1656 TS-003 TC-001: Add Unavailable Product
// @regression
 test('QE-1656 TS-003 TC-001 - Add unavailable product', async ({ page }) => {
  logger.info('Launching online shopping platform');
  const home = new HomePage(page);
  await home.goto(TD.urls.shop);
  const login = new LoginPage(page);
  await login.login('testuser', 'Pass@123');
  const catalog = new CatalogPage(page);
  await catalog.goto();
  await catalog.selectProduct('Quantum Laptop');
  const cart = new CartPage(page);
  await cart.addToCart();
  await expect(cart.errorMessage()).toBeVisible();
  await expect(cart.cartCount()).toBe(TD.cartCounts.zero);
 });

// QE-1695 TS-001 TC-001: Registration Success
// @e2e
 test('QE-1695 TS-001 TC-001 - Registration with strong password', async ({ page }) => {
  logger.info('Launching registration page');
  const home = new HomePage(page);
  await home.goto(TD.urls.app);
  const registration = new RegistrationPage(page);
  await registration.goto();
  await registration.enterDetails('Test User', 'testuser@example.com', 'Pass@1234');
  await registration.submit();
  const dashboard = new DashboardPage(page);
  await expect(dashboard.dashboardTitle()).toHaveText(TD.pageTitles.dashboard);
 });

// QE-1695 TS-002 TC-001: Registration Weak Password
// @regression
 test('QE-1695 TS-002 TC-001 - Registration with weak password', async ({ page }) => {
  logger.info('Launching registration page');
  const home = new HomePage(page);
  await home.goto(TD.urls.app);
  const registration = new RegistrationPage(page);
  await registration.goto();
  await registration.enterDetails('Test User', 'testuser2@example.com', 'test');
  await registration.submit();
  await expect(registration.passwordError()).toBeVisible();
  await expect(registration.passwordError()).toHaveText(TD.errors.weakPassword);
 });

// QE-1695 TS-003 TC-001: Registration Compliance
// @compliance
 test('QE-1695 TS-003 TC-001 - Registration data compliance', async ({ page }) => {
  logger.info('Completing registration');
  const registration = new RegistrationPage(page);
  await registration.enterDetails('Compliance User', 'compliance@example.com', 'Comply@123');
  await registration.submit();
  logger.info('Verifying secure storage in admin/database');
  // Assume admin/database verification via API or DB utility
  await expect(registration.isPasswordHashed()).toBe(true);
 });

// QE-1694 TS-001 TC-001: Submit Review for Completed Order
// @e2e
 test('QE-1694 TS-001 TC-001 - Submit review for completed order', async ({ page }) => {
  logger.info('Logging in as customer');
  const login = new LoginPage(page);
  await login.login('customer1', 'Customer@123');
  const dashboard = new DashboardPage(page);
  await dashboard.gotoOrder('1001');
  const order = new OrderPage(page);
  await expect(order.orderDetails()).toBeVisible();
  const review = new ReviewPage(page);
  await review.submitReview('Great product!', 5);
  await expect(review.confirmation()).toBeVisible();
 });

// QE-1694 TS-002 TC-001: Review Undelivered Order
// @regression
 test('QE-1694 TS-002 TC-001 - Attempt review for undelivered order', async ({ page }) => {
  logger.info('Logging in as customer');
  const login = new LoginPage(page);
  await login.login('customer2', 'Customer@456');
  const dashboard = new DashboardPage(page);
  await dashboard.gotoOrder('1002');
  const order = new OrderPage(page);
  await expect(order.orderDetails()).toBeVisible();
  const review = new ReviewPage(page);
  await review.submitReview('Cannot review yet', 1);
  await expect(review.errorMessage()).toBeVisible();
  await expect(review.errorMessage()).toHaveText(TD.errors.reviewNotAllowed);
 });

// QE-1694 TS-003 TC-001: Review Visibility & Secure Storage
// @compliance
 test('QE-1694 TS-003 TC-001 - Review visibility and secure storage', async ({ page }) => {
  logger.info('Submitting review as customer');
  const review = new ReviewPage(page);
  await review.submitReview('Excellent!', 5);
  logger.info('Verifying review as seller');
  const loginSeller = new LoginPage(page);
  await loginSeller.login(TD.credentials.seller.username, TD.credentials.seller.password);
  const orderSeller = new OrderPage(page);
  await orderSeller.gotoOrder('1003');
  await expect(orderSeller.reviewDetails()).toContainText('Excellent!');
  logger.info('Verifying review as admin');
  const loginAdmin = new LoginPage(page);
  await loginAdmin.login(TD.credentials.admin.username, TD.credentials.admin.password);
  const orderAdmin = new OrderPage(page);
  await orderAdmin.gotoOrder('1003');
  await expect(orderAdmin.reviewDetails()).toContainText('Excellent!');
  logger.info('Verifying secure storage in database');
  await expect(review.isStoredSecurely()).toBe(true);
 });

// QE-1693 TS-001 TC-001: RBAC Feature Access
// @security
 test('QE-1693 TS-001 TC-001 - RBAC feature access', async ({ page }) => {
  logger.info('Testing RBAC for buyer');
  const loginBuyer = new LoginPage(page);
  await loginBuyer.login(TD.credentials.buyer.username, TD.credentials.buyer.password);
  const audit = new AuditPage(page);
  await expect(audit.accessDenied()).toBeVisible();
  logger.info('Testing RBAC for seller');
  const loginSeller = new LoginPage(page);
  await loginSeller.login(TD.credentials.seller.username, TD.credentials.seller.password);
  await expect(audit.accessDenied()).toBeVisible();
  logger.info('Testing RBAC for admin');
  const loginAdmin = new LoginPage(page);
  await loginAdmin.login(TD.credentials.admin.username, TD.credentials.admin.password);
  await expect(audit.accessGranted()).toBeVisible();
 });

// QE-1693 TS-002 TC-001: RBAC Audit Logging
// @security
 test('QE-1693 TS-002 TC-001 - RBAC audit logging', async ({ page }) => {
  logger.info('Testing audit logging for denied access');
  const loginBuyer = new LoginPage(page);
  await loginBuyer.login(TD.credentials.buyer.username, TD.credentials.buyer.password);
  const audit = new AuditPage(page);
  await audit.attemptAdminAccess();
  await expect(audit.accessDenied()).toBeVisible();
  await expect(audit.auditLog()).toContainText(TD.auditLogs.denied);
 });

// QE-1693 TS-003 TC-001: Audit Trail Review
// @security
 test('QE-1693 TS-003 TC-001 - Audit trail review', async ({ page }) => {
  logger.info('Testing audit trail for all access attempts');
  const loginBuyer = new LoginPage(page);
  await loginBuyer.login(TD.credentials.buyer.username, TD.credentials.buyer.password);
  const loginSeller = new LoginPage(page);
  await loginSeller.login(TD.credentials.seller.username, TD.credentials.seller.password);
  const loginAdmin = new LoginPage(page);
  await loginAdmin.login(TD.credentials.admin.username, TD.credentials.admin.password);
  const audit = new AuditPage(page);
  await audit.reviewAuditLogs();
  await expect(audit.auditLog()).toContainText(TD.auditLogs.allAttempts);
 });

// QE-1692 TS-001 TC-001: Refund Request
// @e2e
 test('QE-1692 TS-001 TC-001 - Refund request and admin review', async ({ page }) => {
  logger.info('Logging in as customer');
  const login = new LoginPage(page);
  await login.login('customer3', 'Customer@789');
  const dashboard = new DashboardPage(page);
  await dashboard.gotoOrder('2001');
  const refund = new RefundPage(page);
  await refund.initiateRefund('2001');
  await expect(refund.refundStatus()).toBe(TD.refundStatuses.submitted);
  logger.info('Logging in as admin');
  const loginAdmin = new LoginPage(page);
  await loginAdmin.login(TD.credentials.admin.username, TD.credentials.admin.password);
  await refund.reviewRefund('2001');
  await expect(refund.refundStatus()).toBe(TD.refundStatuses.reviewed);
 });
