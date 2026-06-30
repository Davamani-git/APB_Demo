const { test, expect } = require('../../fixtures');
const SellerLoginPage = require('../../pages/seller-login.page');
const SellerDashboardPage = require('../../pages/seller-dashboard.page');
const InventoryPage = require('../../pages/inventory.page');
const CustomerLoginPage = require('../../pages/customer-login.page');
const CustomerDashboardPage = require('../../pages/customer-dashboard.page');
const SearchPage = require('../../pages/search.page');
const CartPage = require('../../pages/cart.page');
const CheckoutPage = require('../../pages/checkout.page');
const TD = require('../../data/workday-test-data');

// QE-1532 TS-001 TC-001 - Seller Login and Dashboard Feature Availability
// @regression @e2e

/**
 * Traceability: TS-001 > TC-001 | Seller Dashboard Feature Verification
 * Covers: Seller login, dashboard navigation, feature presence
 */
test('[QE-1532 TS-001 TC-001] Seller login and dashboard feature availability', async ({ page }) => {
  const sellerLogin = new SellerLoginPage(page);
  const dashboard = new SellerDashboardPage(page);

  await sellerLogin.goto();
  await expect(page).toHaveURL(TD.urls.loginPage);
  await sellerLogin.login(TD.users.seller01.username, TD.users.seller01.password);
  await dashboard.waitForLoad();
  await expect(page).toHaveURL(TD.urls.sellerDashboard);
  await expect(dashboard.productManagementTab()).toBeVisible();
  await expect(dashboard.inventoryManagementTab()).toBeVisible();
  await expect(dashboard.orderManagementTab()).toBeVisible();
});

// QE-1532 TS-002 TC-001 - Non-seller Access Denied
// @regression

test('[QE-1532 TS-002 TC-001] Non-seller dashboard access denied', async ({ page }) => {
  const login = new CustomerLoginPage(page);
  const dashboard = new SellerDashboardPage(page);

  await login.goto();
  await expect(page).toHaveURL(TD.urls.loginPage);
  await login.login(TD.users.customer01.username, TD.users.customer01.password);
  await expect(page).toHaveURL(TD.urls.customerDashboard);
  await dashboard.goto();
  await expect(dashboard.accessDeniedMessage()).toBeVisible();
  await expect(dashboard.accessDeniedMessage()).toHaveText(TD.errors.sellerAccessDenied);
});

// QE-1532 TS-003 TC-001 - Seller Data Isolation
// @regression

test('[QE-1532 TS-003 TC-001] Seller data isolation', async ({ page }) => {
  const sellerLogin = new SellerLoginPage(page);
  const dashboard = new SellerDashboardPage(page);
  await sellerLogin.goto();
  await sellerLogin.login(TD.users.seller01.username, TD.users.seller01.password);
  await dashboard.waitForLoad();
  await expect(dashboard.onlyOwnSellerDataVisible(TD.users.seller01.username)).toBeTruthy();
});

// QE-1531 TS-001 TC-001 - Inventory Update Success
// @regression

test('[QE-1531 TS-001 TC-001] Seller updates inventory successfully', async ({ page }) => {
  const sellerLogin = new SellerLoginPage(page);
  const inventory = new InventoryPage(page);
  await sellerLogin.goto();
  await sellerLogin.login(TD.users.seller01.username, TD.users.seller01.password);
  await inventory.goto();
  await expect(page).toHaveURL(TD.urls.inventoryManagement);
  await inventory.selectProduct(TD.products.widgetA.name);
  await inventory.updateQuantity(TD.products.widgetA.name, 30);
  await expect(inventory.updateForm()).toBeVisible();
  await inventory.saveChanges();
  await expect(inventory.successMessage()).toBeVisible();
  await expect(inventory.getProductQuantity(TD.products.widgetA.name)).toHaveText('30');
});

// QE-1531 TS-002 TC-001 - Inventory Negative and Non-Numeric Quantity Validation
// @regression

test('[QE-1531 TS-002 TC-001] Inventory negative and non-numeric quantity validation', async ({ page }) => {
  const sellerLogin = new SellerLoginPage(page);
  const inventory = new InventoryPage(page);
  await sellerLogin.goto();
  await sellerLogin.login(TD.users.seller01.username, TD.users.seller01.password);
  await inventory.goto();
  await inventory.selectProduct(TD.products.widgetA.name);
  // Negative quantity
  await inventory.updateQuantity(TD.products.widgetA.name, -5);
  await expect(inventory.errorMessage()).toBeVisible();
  await expect(inventory.errorMessage()).toHaveText(TD.errors.negativeInventory);
  // Non-numeric quantity
  await inventory.updateQuantity(TD.products.widgetA.name, 'abc');
  await expect(inventory.errorMessage()).toBeVisible();
  await expect(inventory.errorMessage()).toHaveText(TD.errors.nonNumericInventory);
});

// QE-1531 TS-003 TC-001 - Zero Inventory Purchase Block
// @regression

test('[QE-1531 TS-003 TC-001] Zero inventory purchase is blocked', async ({ page }) => {
  const sellerLogin = new SellerLoginPage(page);
  const inventory = new InventoryPage(page);
  const customerLogin = new CustomerLoginPage(page);
  const customerDashboard = new CustomerDashboardPage(page);
  const cart = new CartPage(page);
  await sellerLogin.goto();
  await sellerLogin.login(TD.users.seller01.username, TD.users.seller01.password);
  await inventory.goto();
  await inventory.selectProduct(TD.products.widgetA.name);
  await inventory.updateQuantity(TD.products.widgetA.name, 0);
  await inventory.saveChanges();
  await expect(inventory.successMessage()).toBeVisible();
  await customerLogin.goto();
  await customerLogin.login(TD.users.customer01.username, TD.users.customer01.password);
  await expect(page).toHaveURL(TD.urls.customerDashboard);
  await cart.addProduct(TD.products.widgetA.name);
  await expect(cart.purchaseBlockedMessage()).toBeVisible();
  await expect(cart.purchaseBlockedMessage()).toHaveText(TD.errors.zeroInventoryPurchase);
});

// QE-1530 TS-001 TC-001 - Customer Search and Filter
// @regression

test('[QE-1530 TS-001 TC-001] Customer search and filter', async ({ page }) => {
  const customerLogin = new CustomerLoginPage(page);
  const dashboard = new CustomerDashboardPage(page);
  const search = new SearchPage(page);
  await customerLogin.goto();
  await customerLogin.login(TD.users.customer01.username, TD.users.customer01.password);
  await expect(page).toHaveURL(TD.urls.customerDashboard);
  await search.searchWithFilter('Laptop', { price: '<1000' });
  await expect(search.results()).toBeVisible();
  await expect(search.results()).toContainText('Laptop');
});

// QE-1530 TS-002 TC-001 - Customer Invalid Search
// @regression

test('[QE-1530 TS-002 TC-001] Customer invalid search', async ({ page }) => {
  const customerLogin = new CustomerLoginPage(page);
  const dashboard = new CustomerDashboardPage(page);
  const search = new SearchPage(page);
  await customerLogin.goto();
  await customerLogin.login(TD.users.customer01.username, TD.users.customer01.password);
  await expect(page).toHaveURL(TD.urls.customerDashboard);
  await search.search('asdfghjkl');
  await expect(search.noResultsMessage()).toBeVisible();
  await expect(search.noResultsMessage()).toHaveText(TD.errors.noSearchResults);
});

// QE-1529 TS-001 TC-001 - Customer Checkout Success
// @regression

test('[QE-1529 TS-001 TC-001] Customer checkout success', async ({ page }) => {
  const customerLogin = new CustomerLoginPage(page);
  const dashboard = new CustomerDashboardPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  await customerLogin.goto();
  await customerLogin.login(TD.users.customer01.username, TD.users.customer01.password);
  await dashboard.waitForLoad();
  await cart.addProduct(TD.products.widgetA.name);
  await cart.gotoCheckout();
  await checkout.enterPaymentDetails(TD.payment.validCard);
  await expect(checkout.paymentAcceptedMessage()).toBeVisible();
  await checkout.confirmOrder();
  await expect(checkout.orderConfirmationMessage()).toBeVisible();
});

// QE-1529 TS-002 TC-001 - Customer Invalid Payment
// @regression

test('[QE-1529 TS-002 TC-001] Customer invalid payment', async ({ page }) => {
  const customerLogin = new CustomerLoginPage(page);
  const dashboard = new CustomerDashboardPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  await customerLogin.goto();
  await customerLogin.login(TD.users.customer01.username, TD.users.customer01.password);
  await dashboard.waitForLoad();
  await cart.addProduct(TD.products.widgetA.name);
  await cart.gotoCheckout();
  await checkout.enterPaymentDetails(TD.payment.invalidCard);
  await expect(checkout.paymentErrorMessage()).toBeVisible();
  await expect(checkout.paymentErrorMessage()).toHaveText(TD.errors.invalidPayment);
});
