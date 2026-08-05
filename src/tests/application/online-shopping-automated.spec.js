const { test, expect } = require('../../fixtures');
const HomePage = require('../../pages/home.page');
const LoginPage = require('../../pages/login.page');
const RegisterPage = require('../../pages/register.page');
const ProductPage = require('../../pages/product.page');
const CartPage = require('../../pages/cart.page');
const CheckoutPage = require('../../pages/checkout.page');
const OrdersPage = require('../../pages/orders.page');
const SellerDashboardPage = require('../../pages/seller-dashboard.page');
const TD = require('../../data/workday-test-data');

// QE-3852 TS001 TC-001
// End-to-end user purchase flow
// @regression @e2e

test.describe('[UI] QE-3852: User purchase flow', { tag: ['@regression', '@e2e'] }, () => {
  let home, login, product, cart, checkout;
  test('[QE-3852 TS001 TC-001] User can purchase product with valid payment', async ({ page }) => {
    home = new HomePage(page);
    login = new LoginPage(page);
    product = new ProductPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);

    await home.goto(TD.urls.appExample); // Step 1
    expect(await home.isDisplayed()).toBeTruthy();

    await home.gotoLogin(); // Step 2
    await login.login(TD.users.testuser.username, TD.users.testuser.password);
    expect(await home.isDashboardDisplayed()).toBeTruthy();

    await product.addAnyAvailableProductToCart(); // Step 3
    await product.proceedToCheckout();
    expect(await checkout.isDisplayedWithItems()).toBeTruthy();

    await checkout.enterPaymentDetails(TD.cards.validCard.number, TD.cards.validCard.exp, TD.cards.validCard.cvv); // Step 4
    expect(await checkout.isPaymentAccepted()).toBeTruthy();

    await checkout.confirmAndSubmit(); // Step 5
    expect(await checkout.isOrderConfirmationDisplayed()).toBeTruthy();
  });
});

// Ramya-T1 TS-001 TC-001
// Registration flow
// @smoke

test.describe('[UI] Ramya-T1: Registration flow', { tag: ['@smoke'] }, () => {
  let home, register;
  test('[Ramya-T1 TS-001 TC-001] User can register successfully', async ({ page }) => {
    home = new HomePage(page);
    register = new RegisterPage(page);
    await home.goto(TD.urls.onlineShopExample);
    expect(await login.isDisplayed()).toBeTruthy();
    await login.clickRegister();
    expect(await register.isDisplayed()).toBeTruthy();
    await register.registerNewUser(TD.users.testuser);
    expect(await home.isDashboardDisplayed()).toBeTruthy();
  });
});

// Ramya-T1 TS-002 TC-001
// Login flow
// @smoke

test.describe('[UI] Ramya-T1: Login flow', { tag: ['@smoke'] }, () => {
  let home, login;
  test('[Ramya-T1 TS-002 TC-001] User can login successfully', async ({ page }) => {
    home = new HomePage(page);
    login = new LoginPage(page);
    await home.goto(TD.urls.onlineShopExample);
    expect(await login.isDisplayed()).toBeTruthy();
    await login.login(TD.users.testuser.username, TD.users.testuser.password);
    expect(await home.isDashboardDisplayed()).toBeTruthy();
  });
});

// Ramya-T1 TS-003 TC-001
// Product search and filter
// @regression

test.describe('[UI] Ramya-T1: Product search and filter', { tag: ['@regression'] }, () => {
  let home, login, product;
  test('[Ramya-T1 TS-003 TC-001] User can search and filter products', async ({ page }) => {
    home = new HomePage(page);
    login = new LoginPage(page);
    product = new ProductPage(page);
    await login.loginIfNeeded(TD.users.testuser.username, TD.users.testuser.password);
    expect(await home.isDashboardDisplayed()).toBeTruthy();
    await product.search('Laptop');
    expect(await product.isSearchResultsDisplayed('Laptop')).toBeTruthy();
    await product.applyFilters({ price: [500, 1000], brand: 'BrandX' });
    expect(await product.isFilteredResultsDisplayed({ price: [500, 1000], brand: 'BrandX' })).toBeTruthy();
  });
});

// Ramya-T1 TS-004 TC-001
// Add to cart
// @smoke

test.describe('[UI] Ramya-T1: Add to cart', { tag: ['@smoke'] }, () => {
  let home, login, product, cart;
  test('[Ramya-T1 TS-004 TC-001] User can add product to cart', async ({ page }) => {
    home = new HomePage(page);
    login = new LoginPage(page);
    product = new ProductPage(page);
    cart = new CartPage(page);
    await login.loginIfNeeded(TD.users.testuser.username, TD.users.testuser.password);
    await product.search('Laptop');
    expect(await product.isSearchResultsDisplayed('Laptop')).toBeTruthy();
    await product.addToCart('Laptop', 1);
    await cart.open();
    expect(await cart.isProductInCart('Laptop')).toBeTruthy();
  });
});

// Ramya-T1 TS-005 TC-001
// Checkout flow
// @regression

test.describe('[UI] Ramya-T1: Checkout flow', { tag: ['@regression'] }, () => {
  let home, login, product, cart, checkout;
  test('[Ramya-T1 TS-005 TC-001] User can checkout successfully', async ({ page }) => {
    home = new HomePage(page);
    login = new LoginPage(page);
    product = new ProductPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);
    await login.loginIfNeeded(TD.users.testuser.username, TD.users.testuser.password);
    await product.addToCart('Laptop', 1);
    await cart.open();
    await cart.proceedToCheckout();
    expect(await checkout.isDisplayed()).toBeTruthy();
    await checkout.enterShippingDetails(TD.shipping.validAddress);
    await checkout.enterPaymentDetails(TD.cards.validCard.number, TD.cards.validCard.exp, TD.cards.validCard.cvv);
    expect(await checkout.isPaymentAccepted()).toBeTruthy();
    await checkout.submitOrder();
    expect(await checkout.isOrderConfirmationDisplayed()).toBeTruthy();
  });
});

// Ramya-T1 TS-006 TC-001
// Orders view
// @smoke

test.describe('[UI] Ramya-T1: Orders view', { tag: ['@smoke'] }, () => {
  let home, login, orders;
  test('[Ramya-T1 TS-006 TC-001] User can view order details', async ({ page }) => {
    home = new HomePage(page);
    login = new LoginPage(page);
    orders = new OrdersPage(page);
    await login.loginIfNeeded(TD.users.testuser.username, TD.users.testuser.password);
    await home.gotoOrders();
    expect(await orders.isDisplayed()).toBeTruthy();
    await orders.openOrder('12345');
    expect(await orders.isOrderDetailsDisplayed('12345')).toBeTruthy();
  });
});

// Ramya-T1 TS-007 TC-001
// Seller product management
// @regression

test.describe('[UI] Ramya-T1: Seller product management', { tag: ['@regression'] }, () => {
  let login, sellerDashboard;
  test('[Ramya-T1 TS-007 TC-001] Seller can manage products', async ({ page }) => {
    login = new LoginPage(page);
    sellerDashboard = new SellerDashboardPage(page);
    await login.loginAsSeller(TD.users.seller.username, TD.users.seller.password);
    expect(await sellerDashboard.isDisplayed()).toBeTruthy();
    await sellerDashboard.addProduct(TD.products.smartphone);
    expect(await sellerDashboard.isProductPresent('Smartphone')).toBeTruthy();
    await sellerDashboard.editProduct('Smartphone', { price: 899 });
    expect(await sellerDashboard.isProductPrice('Smartphone', 899)).toBeTruthy();
    await sellerDashboard.removeProduct('Smartphone');
    expect(await sellerDashboard.isProductPresent('Smartphone')).toBeFalsy();
  });
});

// Ramya-T1 TS-008 TC-001
// Payment failure and retry
// @regression

test.describe('[UI] Ramya-T1: Payment failure and retry', { tag: ['@regression'] }, () => {
  let login, product, cart, checkout;
  test('[Ramya-T1 TS-008 TC-001] User can retry payment after failure', async ({ page }) => {
    login = new LoginPage(page);
    product = new ProductPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);
    await login.loginIfNeeded(TD.users.testuser.username, TD.users.testuser.password);
    await product.addToCart('Laptop', 1);
    await cart.open();
    await cart.proceedToCheckout();
    expect(await checkout.isDisplayed()).toBeTruthy();
    await checkout.enterPaymentDetails(TD.cards.invalidCard.number, TD.cards.invalidCard.exp, TD.cards.invalidCard.cvv);
    expect(await checkout.isPaymentDeclined()).toBeTruthy();
    await checkout.retryPayment(TD.cards.validCard);
    expect(await checkout.isPaymentAccepted()).toBeTruthy();
  });
});

// Ramya-T1 TS-009 TC-001
// Refund flow
// @regression

test.describe('[UI] Ramya-T1: Refund flow', { tag: ['@regression'] }, () => {
  let login, orders;
  test('[Ramya-T1 TS-009 TC-001] User can request refund', async ({ page }) => {
    login = new LoginPage(page);
    orders = new OrdersPage(page);
    await login.loginIfNeeded(TD.users.testuser.username, TD.users.testuser.password);
    await orders.open();
    await orders.openOrder('12345');
    await orders.requestRefund('12345');
    expect(await orders.isRefundRequested('12345')).toBeTruthy();
    expect(await orders.isRefundStatusUpdated('12345')).toBeTruthy();
  });
});

// Ramya-T1 TS-010 TC-001
// Accessibility checks
// @smoke

test.describe('[UI] Ramya-T1: Accessibility', { tag: ['@smoke'] }, () => {
  let home;
  test('[Ramya-T1 TS-010 TC-001] Platform meets accessibility standards', async ({ page }) => {
    home = new HomePage(page);
    await home.goto(TD.urls.onlineShopExample);
    expect(await home.isAccessibleWithScreenReaderAndKeyboard()).toBeTruthy();
    expect(await home.hasValidColorContrastAndAltText()).toBeTruthy();
  });
});
