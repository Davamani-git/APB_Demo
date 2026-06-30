// QE-1554 Seller Product Listing Scenarios
const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/workday-login.page');
const SellerDashboardPage = require('../../pages/workday-seller-dashboard.page');
const ProductListingPage = require('../../pages/workday-product-listing.page');
const DashboardPage = require('../../pages/workday-dashboard.page');
const ProductSearchPage = require('../../pages/workday-product-search.page');
const TD = require('../../data/workday-test-data');

// [TS001] Seller creates and validates product listing
// [QE-1554 TS001 TC-001]
test.describe('[UI] QE-1554: Seller Product Listing', { tag: ['@regression', '@e2e'] }, () => {
  test('[QE-1554 TS001 TC-001] Seller creates product, consumer searches', async ({ page }) => {
    const login = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const productListing = new ProductListingPage(page);
    const dashboard = new DashboardPage(page);
    const search = new ProductSearchPage(page);
    await login.login(TD.users.seller1.username, TD.users.seller1.password);
    await expect(sellerDashboard.dashboardHeader()).toBeVisible();
    await sellerDashboard.gotoCreateProductListing();
    await expect(productListing.formHeader()).toBeVisible();
    await productListing.createProduct({ name: 'New Product', description: 'Sample', price: 100, category: 'Electronics', image: TD.images.product });
    await expect(productListing.confirmation()).toBeVisible();
    await sellerDashboard.logout();
    await login.login(TD.users.consumer1.username, TD.users.consumer1.password);
    await expect(dashboard.dashboardHeader()).toBeVisible();
    await dashboard.gotoProductSearch();
    await search.enterSearchCriteria({ keyword: 'New Product' });
    await search.submitSearch();
    await expect(search.resultsContainProduct('New Product')).resolves.toBeTruthy();
  });
});

// [TS002] Seller edits product listing
// [QE-1554 TS002 TC-001]
test.describe('[UI] QE-1554: Seller Edits Product Listing', { tag: ['@regression', '@e2e'] }, () => {
  test('[QE-1554 TS002 TC-001] Seller edits product', async ({ page }) => {
    const login = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const productListing = new ProductListingPage(page);
    await login.login(TD.users.seller1.username, TD.users.seller1.password);
    await expect(sellerDashboard.dashboardHeader()).toBeVisible();
    await sellerDashboard.gotoMyListings();
    await productListing.editProduct('Existing Product');
    await expect(productListing.editForm()).toBeVisible();
    await productListing.modifyProduct({ price: 120, description: 'Updated' });
    await productListing.saveChanges();
    await expect(productListing.changesConfirmation()).toBeVisible();
    await expect(productListing.changesVisibleToConsumers('Existing Product', { price: 120, description: 'Updated' })).resolves.toBeTruthy();
  });
});

// [TS003] Unauthorized user attempts edit
// [QE-1554 TS003 TC-001]
test.describe('[UI] QE-1554: Unauthorized Edit Attempt', { tag: ['@security', '@regression', '@e2e'] }, () => {
  test('[QE-1554 TS003 TC-001] Unauthorized user cannot edit product', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const productListing = new ProductListingPage(page);
    await login.login(TD.users.consumer1.username, TD.users.consumer1.password);
    await expect(dashboard.dashboardHeader()).toBeVisible();
    await productListing.attemptEditAsUnauthorized('Seller Product');
    await expect(productListing.accessDeniedError()).toBeVisible();
    await expect(productListing.productUnchanged('Seller Product')).resolves.toBeTruthy();
  });
});
