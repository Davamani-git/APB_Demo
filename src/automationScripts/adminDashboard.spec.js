const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { AdminDashboardPage } = require('./pages/adminDashboard.page');

test.describe('Admin Dashboard Analytics Tests', () => {
  test('TC-1184: Verify admin can view analytics dashboard with performance metrics, user activity, and transaction volumes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminDashboard = new AdminDashboardPage(page);

    await loginPage.navigate();
    await expect(page).toHaveURL(/platform\.example\.com/);
    
    await loginPage.enterUsername('admin@platform.com');
    await loginPage.enterPassword('AdminPass@123');
    await loginPage.clickLoginButton();
    
    await expect(page).toHaveURL(/admin/);
    
    await adminDashboard.navigateToAnalytics();
    await expect(adminDashboard.analyticsSection).toBeVisible();
    
    await adminDashboard.verifyPerformanceMetrics();
    await adminDashboard.verifyUserActivityStatistics();
    await adminDashboard.verifyTransactionVolumes();
  });

  test('TC-1185: Verify unauthorized access to admin dashboard redirects to login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminDashboard = new AdminDashboardPage(page);

    await loginPage.navigate();
    await expect(page).toHaveURL(/platform\.example\.com/);
    
    await adminDashboard.attemptDirectAccessToDashboard();
    await expect(page).toHaveURL(/login/);
    
    await adminDashboard.verifyAuthorizationErrorMessage();
    await expect(adminDashboard.authErrorMessage).toContainText(/Unauthorized access|Please login/);
  });

  test('TC-1186: Verify non-admin user cannot access admin dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminDashboard = new AdminDashboardPage(page);

    await loginPage.navigate();
    await expect(page).toHaveURL(/platform\.example\.com/);
    
    await loginPage.enterUsername('consumer@example.com');
    await loginPage.enterPassword('ConsumerPass@123');
    await loginPage.clickLoginButton();
    
    await expect(page).toHaveURL(/dashboard/);
    
    await adminDashboard.attemptDirectAccessToDashboard();
    
    await adminDashboard.verifyAuthorizationErrorMessage();
    await expect(adminDashboard.authErrorMessage).toContainText(/Insufficient permissions|access denied/i);
  });

  test('TC-1187: Verify admin can filter analytics by date range and user segment', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminDashboard = new AdminDashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('admin@platform.com', 'AdminPass@123');
    
    await expect(page).toHaveURL(/admin/);
    
    await adminDashboard.navigateToAnalytics();
    await expect(adminDashboard.analyticsSection).toBeVisible();
    
    await adminDashboard.selectDateRange('2024-01-01', '2024-01-31');
    await adminDashboard.applyDateRangeFilter();
    
    await adminDashboard.selectUserSegment('Consumers');
    await adminDashboard.applyUserSegmentFilter();
    
    await adminDashboard.verifyFilteredAnalyticsData();
  });
});

test.describe('Fraud Detection Tests', () => {
  test('TC-1188: Verify fraud detection system flags and locks account for rapid high-value transactions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = require('./pages/sellerDashboard.page').SellerDashboardPage;
    const adminDashboard = new AdminDashboardPage(page);
    const seller = new sellerDashboard(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'SellerPass@123');
    
    await expect(page).toHaveURL(/seller|dashboard/);
    
    await seller.simulateRapidHighValueTransactions([
      { amount: 5000 },
      { amount: 4500 },
      { amount: 6000 }
    ]);
    
    await seller.verifyAccountLocked();
    
    await loginPage.navigate();
    await loginPage.login('admin@platform.com', 'AdminPass@123');
    await adminDashboard.verifyAdminReceivedFraudNotification('seller@example.com');
  });

  test('TC-1189: Verify fraud detection system flags account for unusual login location', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = require('./pages/sellerDashboard.page').SellerDashboardPage;
    const adminDashboard = new AdminDashboardPage(page);
    const seller = new sellerDashboard(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'SellerPass@123');
    await seller.logout();
    
    await loginPage.simulateLoginFromUnusualLocation('seller@example.com', 'SellerPass@123', 'Moscow, Russia');
    
    await seller.verifyAccountLocked();
    
    await loginPage.navigate();
    await loginPage.login('admin@platform.com', 'AdminPass@123');
    await adminDashboard.verifyAdminReceivedFraudNotification('seller@example.com');
  });

  test('TC-1190: Verify legitimate seller transactions do not trigger false positive fraud alerts', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = require('./pages/sellerDashboard.page').SellerDashboardPage;
    const adminDashboard = new AdminDashboardPage(page);
    const seller = new sellerDashboard(page);

    await loginPage.navigate();
    await loginPage.login('legitseller@example.com', 'LegitPass@123');
    
    await seller.performNormalTransactions([
      { amount: 500 },
      { amount: 450 },
      { amount: 600 }
    ]);
    
    await seller.verifyAccountNotFlagged();
    await seller.verifyAccountActive();
    
    await loginPage.navigate();
    await loginPage.login('admin@platform.com', 'AdminPass@123');
    await adminDashboard.verifyNoFalsePositiveAlert('legitseller@example.com');
  });

  test('TC-1191: Verify admin can review and permanently disable fraudulent seller account', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminDashboard = new AdminDashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('admin@platform.com', 'AdminPass@123');
    
    await adminDashboard.navigateToFlaggedAccounts();
    await expect(adminDashboard.flaggedAccountsList).toBeVisible();
    
    await adminDashboard.selectFlaggedAccount('fraudseller@example.com');
    await adminDashboard.reviewSuspiciousActivity();
    
    await adminDashboard.confirmFraudAndDisableAccount();
    await adminDashboard.confirmPermanentDisable();
    
    await adminDashboard.verifyProductListingsRemoved('fraudseller@example.com');
    await adminDashboard.verifyBuyersProtectedAndNotified();
  });
});

test.describe('Product Listing Tests', () => {
  test('TC-1192: Verify seller can create product listing with valid data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = require('./pages/sellerDashboard.page').SellerDashboardPage;
    const seller = new sellerDashboard(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'SellerPass@123');
    
    await seller.navigateToAddNewProduct();
    await expect(seller.productListingForm).toBeVisible();
    
    await seller.enterProductName('Wireless Bluetooth Headphones');
    await seller.enterProductDescription('High-quality wireless headphones with noise cancellation and 20-hour battery life');
    await seller.enterProductPrice('79.99');
    await seller.uploadProductImage('headphones.jpg');
    await seller.selectCategory('Electronics');
    await seller.enterInventory('50');
    
    await seller.submitProductListing();
    
    await seller.verifyProductInCatalog('Wireless Bluetooth Headphones');
    await expect(seller.confirmationMessage).toContainText(/Product listed successfully/);
  });

  test('TC-1193: Verify product listing fails with unsupported image format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = require('./pages/sellerDashboard.page').SellerDashboardPage;
    const seller = new sellerDashboard(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'SellerPass@123');
    
    await seller.navigateToAddNewProduct();
    
    await seller.enterProductName('Smart Watch');
    await seller.enterProductDescription('Fitness tracking smartwatch');
    await seller.enterProductPrice('199.99');
    await seller.selectCategory('Electronics');
    await seller.uploadProductImage('smartwatch.bmp');
    
    await expect(seller.validationError).toContainText(/Unsupported image format|JPG|PNG|GIF/i);
    await seller.verifyProductNotCreated();
  });

  test('TC-1194: Verify product listing fails with image exceeding size limit', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = require('./pages/sellerDashboard.page').SellerDashboardPage;
    const seller = new sellerDashboard(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'SellerPass@123');
    
    await seller.navigateToAddNewProduct();
    
    await seller.enterProductName('Laptop Computer');
    await seller.enterProductDescription('High-performance laptop');
    await seller.enterProductPrice('1299.99');
    await seller.selectCategory('Electronics');
    await seller.uploadProductImage('laptop.jpg');
    
    await expect(seller.validationError).toContainText(/Image size exceeds|10MB/i);
    await seller.verifyProductNotCreated();
  });

  test('TC-1195: Verify product listing fails with missing mandatory fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = require('./pages/sellerDashboard.page').SellerDashboardPage;
    const seller = new sellerDashboard(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'SellerPass@123');
    
    await seller.navigateToAddNewProduct();
    await expect(seller.productListingForm).toBeVisible();
    
    await seller.enterProductDescription('Quality product');
    await seller.submitProductListing();
    
    await expect(seller.fieldValidationError).toContainText(/Product name is required|Price is required/i);
    await seller.verifyProductNotCreated();
  });
});

test.describe('Inventory Management Tests', () => {
  test('TC-1196: Verify low inventory notification is triggered when stock falls below threshold', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = require('./pages/sellerDashboard.page').SellerDashboardPage;
    const seller = new sellerDashboard(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'SellerPass@123');
    
    await seller.navigateToInventoryManagement();
    await expect(seller.inventoryDashboard).toBeVisible();
    
    await seller.selectProduct('Wireless Mouse');
    await seller.reduceInventoryBelowThreshold(8);
    
    await seller.verifyLowInventoryAlert();
    await seller.verifyReplenishmentNotification('Wireless Mouse');
  });

  test('TC-1197: Verify inventory update fails with negative quantity', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = require('./pages/sellerDashboard.page').SellerDashboardPage;
    const seller = new sellerDashboard(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'SellerPass@123');
    
    await seller.navigateToInventoryManagement();
    await seller.selectProduct('USB Cable');
    await seller.enterInventoryQuantity('-10');
    await seller.saveInventoryUpdate();
    
    await expect(seller.validationError).toContainText(/Inventory quantity cannot be negative/);
    await seller.verifyInventoryNotUpdated('USB Cable', 25);
  });

  test('TC-1198: Verify inventory update fails with non-numeric value', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = require('./pages/sellerDashboard.page').SellerDashboardPage;
    const seller = new sellerDashboard(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'SellerPass@123');
    
    await seller.navigateToInventoryManagement();
    await seller.selectProduct('Phone Case');
    await seller.enterInventoryQuantity('ABC');
    await seller.saveInventoryUpdate();
    
    await expect(seller.validationError).toContainText(/Inventory quantity must be a valid number/);
    await seller.verifyInventoryNotUpdated('Phone Case', 30);
  });

  test('TC-1199: Verify inventory update reflects in real-time across seller and consumer views', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = require('./pages/sellerDashboard.page').SellerDashboardPage;
    const seller = new sellerDashboard(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'SellerPass@123');
    
    await seller.navigateToInventoryManagement();
    await seller.selectProduct('Laptop Bag');
    await seller.enterInventoryQuantity('25');
    await seller.saveInventoryUpdate();
    
    await expect(seller.confirmationMessage).toBeVisible();
    await seller.verifyInventoryUpdatedInDashboard('Laptop Bag', 25);
    
    const consumerPage = await context.newPage();
    const consumerLogin = new LoginPage(consumerPage);
    await consumerLogin.navigate();
    
    const productCatalog = require('./pages/productCatalog.page').ProductCatalogPage;
    const catalog = new productCatalog(consumerPage);
    await catalog.navigateToCatalog();
    await catalog.verifyProductInventory('Laptop Bag', 25);
  });
});

test.describe('Product Search Tests', () => {
  test('TC-1200: Verify product search with keyword and category filter returns relevant results', async ({ page }) => {
    const homePage = require('./pages/home.page').HomePage;
    const productCatalog = require('./pages/productCatalog.page').ProductCatalogPage;
    const home = new homePage(page);
    const catalog = new productCatalog(page);

    await home.navigate();
    await expect(page).toHaveURL(/platform\.example\.com/);
    
    await home.locateSearchBar();
    await home.enterSearchKeyword('laptop');
    await home.selectCategory('Electronics');
    await home.clickSearchButton();
    
    await catalog.verifySearchResultsDisplayed();
    await catalog.verifySortingOptionsAvailable();
    await catalog.verifyFilteringOptionsAvailable();
  });

  test('TC-1201: Verify search with non-existent keyword displays appropriate message', async ({ page }) => {
    const homePage = require('./pages/home.page').HomePage;
    const productCatalog = require('./pages/productCatalog.page').ProductCatalogPage;
    const home = new homePage(page);
    const catalog = new productCatalog(page);

    await home.navigate();
    await home.locateSearchBar();
    await home.enterSearchKeyword('xyznonexistentproduct123');
    await home.clickSearchButton();
    
    await catalog.verifyEmptyResultSet();
    await expect(catalog.noProductsMessage).toContainText(/No products found|Try different keywords/i);
    await catalog.verifyNoSystemErrors();
  });

  test('TC-1202: Verify multiple filters can be applied simultaneously', async ({ page }) => {
    const homePage = require('./pages/home.page').HomePage;
    const productCatalog = require('./pages/productCatalog.page').ProductCatalogPage;
    const home = new homePage(page);
    const catalog = new productCatalog(page);

    await home.navigate();
    await home.enterSearchKeyword('smartphone');
    await home.clickSearchButton();
    
    await catalog.applyCategoryFilter('Electronics');
    await catalog.applyPriceRangeFilter(200, 500);
    await catalog.applyRatingFilter(4);
    
    await catalog.verifyFilteredResultsDisplayed();
    await catalog.verifyAllProductsMatchFilters('Electronics', 200, 500, 4);
  });
});

test.describe('Checkout and Payment Tests', () => {
  test('TC-1203: Verify successful checkout with valid payment details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = require('./pages/home.page').HomePage;
    const productCatalog = require('./pages/productCatalog.page').ProductCatalogPage;
    const checkoutPage = require('./pages/checkout.page').CheckoutPage;
    const home = new homePage(page);
    const catalog = new productCatalog(page);
    const checkout = new checkoutPage(page);

    await home.navigate();
    await loginPage.login('consumer@example.com', 'ConsumerPass@123');
    
    await catalog.searchAndAddProductToCart('Wireless Keyboard');
    await catalog.searchAndAddProductToCart('USB Mouse');
    await catalog.navigateToCart();
    
    await checkout.clickProceedToCheckout();
    await expect(checkout.checkoutForm).toBeVisible();
    
    await checkout.enterCreditCardNumber('4111111111111111');
    await checkout.enterExpiryDate('12/2026');
    await checkout.enterCVV('123');
    await checkout.enterBillingAddress('123 Main St', 'New York', '10001');
    await checkout.clickCompletePurchase();
    
    await expect(checkout.orderConfirmation).toBeVisible({ timeout: 5000 });
    await checkout.verifyOrderConfirmationEmail('consumer@example.com');
  });

  test('TC-1204: Verify payment fails with expired credit card', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productCatalog = require('./pages/productCatalog.page').ProductCatalogPage;
    const checkoutPage = require('./pages/checkout.page').CheckoutPage;
    const catalog = new productCatalog(page);
    const checkout = new checkoutPage(page);

    await loginPage.navigate();
    await loginPage.login('consumer@example.com', 'ConsumerPass@123');
    
    await catalog.searchAndAddProductToCart('Bluetooth Speaker');
    await catalog.navigateToCart();
    await checkout.clickProceedToCheckout();
    
    await checkout.enterCreditCardNumber('4111111111111111');
    await checkout.enterExpiryDate('12/2020');
    await checkout.enterCVV('123');
    await checkout.enterBillingAddress('123 Main St', 'Boston', '02101');
    await checkout.clickCompletePurchase();
    
    await expect(checkout.paymentError).toContainText(/Payment failed|Credit card has expired/i);
    await expect(checkout.updatePaymentPrompt).toBeVisible();
    await checkout.verifyNoOrderCreated();
  });

  test('TC-1205: Verify payment fails with incorrect CVV', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productCatalog = require('./pages/productCatalog.page').ProductCatalogPage;
    const checkoutPage = require('./pages/checkout.page').CheckoutPage;
    const catalog = new productCatalog(page);
    const checkout = new checkoutPage(page);

    await loginPage.navigate();
    await loginPage.login('consumer@example.com', 'ConsumerPass@123');
    
    await catalog.searchAndAddProductToCart('Gaming Console');
    await catalog.navigateToCart();
    await checkout.clickProceedToCheckout();
    
    await checkout.enterCreditCardNumber('4111111111111111');
    await checkout.enterExpiryDate('12/2026');
    await checkout.enterCVV('999');
    await checkout.enterBillingAddress('456 Oak Ave', 'Chicago', '60601');
    await checkout.clickCompletePurchase();
    
    await expect(checkout.paymentError).toContainText(/Payment failed|Invalid CVV/i);
    await checkout.verifyNoOrderCreated();
  });

  test('TC-1206: Verify payment fails with invalid card number', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productCatalog = require('./pages/productCatalog.page').ProductCatalogPage;
    const checkoutPage = require('./pages/checkout.page').CheckoutPage;
    const catalog = new productCatalog(page);
    const checkout = new checkoutPage(page);

    await loginPage.navigate();
    await loginPage.login('consumer@example.com', 'ConsumerPass@123');
    
    await catalog.searchAndAddProductToCart('Digital Camera');
    await catalog.navigateToCart();
    await checkout.clickProceedToCheckout();
    
    await checkout.enterCreditCardNumber('1234567890123456');
    await checkout.enterExpiryDate('12/2026');
    await checkout.enterCVV('123');
    await checkout.enterBillingAddress('789 Pine Rd', 'Seattle', '98101');
    await checkout.clickCompletePurchase();
    
    await expect(checkout.paymentError).toContainText(/Payment failed|Invalid card number/i);
    await checkout.verifyNoOrderCreated();
  });
});
