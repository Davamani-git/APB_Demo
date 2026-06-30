// QE-1555 Product Search E2E Scenarios
const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/workday-login.page');
const DashboardPage = require('../../pages/workday-dashboard.page');
const ProductSearchPage = require('../../pages/workday-product-search.page');
const SellerDashboardPage = require('../../pages/workday-seller-dashboard.page');
const ProductListingPage = require('../../pages/workday-product-listing.page');
const TD = require('../../data/workday-test-data');

// [TS001] Product Search - Valid Criteria
// [QE-1555 TS001 TC-001]
test.describe('[UI] QE-1555: Product Search - Valid Criteria', { tag: ['@regression', '@e2e'] }, () => {
  test('[QE-1555 TS001 TC-001] Search for products with valid filters', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const search = new ProductSearchPage(page);
    await page.goto(TD.urls.appHome, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(page).toHaveURL(TD.urlPatterns.home);
    await login.login(TD.users.user1.username, TD.users.user1.password);
    await expect(dashboard.dashboardHeader()).toBeVisible();
    await dashboard.gotoProductSearch();
    await expect(search.pageHeader()).toBeVisible();
    await search.enterSearchCriteria({ keyword: 'laptop', priceMin: 500, priceMax: 1000, brand: 'BrandX' });
    await search.submitSearch();
    await expect(search.resultsList()).toBeVisible();
    await expect(search.resultsMatchCriteria({ keyword: 'laptop', priceMin: 500, priceMax: 1000, brand: 'BrandX' })).resolves.toBeTruthy();
  });
});

// [TS002] Product Search - General + Filters
// [QE-1555 TS002 TC-001]
test.describe('[UI] QE-1555: Product Search - General + Filters', { tag: ['@regression', '@e2e'] }, () => {
  test('[QE-1555 TS002 TC-001] Search for phones and filter', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const search = new ProductSearchPage(page);
    await login.login(TD.users.user1.username, TD.users.user1.password);
    await dashboard.gotoProductSearch();
    await expect(search.pageHeader()).toBeVisible();
    await search.enterSearchCriteria({ keyword: 'phone' });
    await search.applyFilters({ category: 'Smartphones', color: 'Black', priceMin: 300, priceMax: 600 });
    await expect(search.resultsList()).toBeVisible();
    await expect(search.resultsMatchFilters({ category: 'Smartphones', color: 'Black', priceMin: 300, priceMax: 600 })).resolves.toBeTruthy();
    await expect(search.noSensitiveInfoInResults()).resolves.toBeTruthy();
  });
});

// [TS003] Product Search - Invalid/Malicious Input
// [QE-1555 TS003 TC-001]
test.describe('[UI] QE-1555: Product Search - Invalid/Malicious Input', { tag: ['@security', '@regression', '@e2e'] }, () => {
  test('[QE-1555 TS003 TC-001] Malicious search and filter input', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const search = new ProductSearchPage(page);
    await login.login(TD.users.user1.username, TD.users.user1.password);
    await dashboard.gotoProductSearch();
    await expect(search.pageHeader()).toBeVisible();
    await search.enterSearchCriteria({ keyword: '<script>alert(1)</script>' });
    await expect(search.validationError()).toBeVisible();
    await search.applyFilters({ priceMin: -100, category: 'InvalidCategory' });
    await expect(search.gracefulHandlingOfInvalidFilters()).resolves.toBeTruthy();
    await expect(search.noSensitiveInfoInResults()).resolves.toBeTruthy();
  });
});
