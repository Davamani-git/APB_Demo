const { test, expect } = require('../../fixtures');
const testData = require('../../data/workday-test-data');
const Logging = require('../../integrations/logging-reporter');
const CatalogPage = require('../../pages/workday-catalog.page');

test.describe('Catalog Search and Filter', () => {
  test('QE-1569 TS-001 TC-001 - Valid search and filter displays products quickly', async ({ page }) => {
    const catalog = new CatalogPage(page);
    Logging.info('Launching catalog page');
    await catalog.goto(testData.catalog.url);
    await expect(page).toHaveURL(testData.catalog.url);
    Logging.info('Applying valid search and filter');
    await catalog.searchProduct(testData.catalog.validKeyword);
    await catalog.applyFilter(testData.catalog.validFilter);
    Logging.info('Validating products are displayed within 2 seconds');
    await expect(catalog.productsList()).toBeVisible({ timeout: 2000 });
  });

  test('QE-1569 TS-002 TC-001 - No results for unmatched search/filter', async ({ page }) => {
    const catalog = new CatalogPage(page);
    Logging.info('Applying unmatched search and filter');
    await catalog.goto(testData.catalog.url);
    await catalog.searchProduct(testData.catalog.noResultKeyword);
    await catalog.applyFilter(testData.catalog.noResultFilter);
    Logging.info('Validating no results message');
    await expect(catalog.noResultsMessage()).toBeVisible();
  });

  test('QE-1569 TS-003 TC-001 - Malformed filter handled gracefully', async ({ page }) => {
    const catalog = new CatalogPage(page);
    Logging.info('Submitting malformed filter');
    await catalog.goto(testData.catalog.url);
    await catalog.applyFilter(testData.catalog.invalidFilter);
    Logging.info('Validating no incorrect products are shown');
    await expect(catalog.productsList()).toBeHidden();
    await expect(catalog.noResultsMessage()).toBeVisible();
  });
});