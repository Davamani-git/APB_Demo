const { test, expect } = require('../../fixtures');
const HomePage = require('../../pages/shop-home.page');
const CatalogPage = require('../../pages/shop-catalog.page');
const TD = require('../../data/workday-test-data');
const logger = require('../../integrations/logging-reporter');

test.describe('[UI] QE-1657: Product Search & Filter', { tag: ['@smoke', '@regression', '@e2e'] }, () => {
  let home, catalog;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    catalog = new CatalogPage(page);
  });

  test('[QE-1657 TS-001 TC-001] Search with filter returns correct products', async ({ page }) => {
    logger.info('Launching shopping platform');
    await home.goto(TD.URL);
    await expect(page).toHaveURL(TD.URL);
    await expect(home.homePageLoaded()).toBeTruthy();

    logger.info('Navigating to catalog/search page');
    await home.goToCatalog();
    await expect(catalog.isCatalogLoaded()).toBeTruthy();

    logger.info('Searching for products and applying filter');
    await catalog.searchProduct(TD.SEARCH_TERM_LAPTOP);
    await catalog.applyCategoryFilter(TD.FILTER_ELECTRONICS);
    await expect(catalog.areProductsFiltered('laptop', 'Electronics')).toBeTruthy();
  });

  test('[QE-1657 TS-002 TC-001] Clear filters restores product list', async ({ page }) => {
    logger.info('Launching shopping platform');
    await home.goto(TD.URL);
    await expect(page).toHaveURL(TD.URL);
    await expect(home.homePageLoaded()).toBeTruthy();

    logger.info('Navigating to catalog');
    await home.goToCatalog();
    await expect(catalog.isCatalogLoaded()).toBeTruthy();

    logger.info('Applying filters');
    await catalog.applyCategoryFilter(TD.FILTER_ELECTRONICS);
    await catalog.applyPriceFilter(TD.PRICE_100_500);
    await expect(catalog.areProductsFiltered(null, 'Electronics', TD.PRICE_100_500)).toBeTruthy();

    logger.info('Clearing filters');
    await catalog.clearAllFilters();
    await expect(catalog.isFullProductListVisible()).toBeTruthy();
  });

  test('[QE-1657 TS-003 TC-001] Invalid search/filter returns no results', async ({ page }) => {
    logger.info('Launching shopping platform');
    await home.goto(TD.URL);
    await expect(page).toHaveURL(TD.URL);
    await expect(home.homePageLoaded()).toBeTruthy();

    logger.info('Navigating to catalog/search');
    await home.goToCatalog();
    await expect(catalog.isCatalogLoaded()).toBeTruthy();

    logger.info('Searching with invalid term and filter');
    await catalog.searchProduct(TD.SEARCH_TERM_INVALID);
    await catalog.applyCategoryFilter(TD.FILTER_UNICORNS);
    await expect(catalog.isNoResultsMessageVisible()).toBeTruthy();
  });
});
