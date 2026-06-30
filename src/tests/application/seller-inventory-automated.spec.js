const { test, expect } = require('../../fixtures');
const testData = require('../../data/workday-test-data');
const Logging = require('../../integrations/logging-reporter');
const LoginPage = require('../../pages/workday-login.page');
const SellerDashboardPage = require('../../pages/workday-seller-dashboard.page');
const CatalogPage = require('../../pages/workday-catalog.page');

test.describe('Seller Inventory Management', () => {
  test('QE-1568 TS-001 TC-001 - Seller updates inventory and is reflected in catalog', async ({ page }) => {
    const login = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const catalog = new CatalogPage(page);
    Logging.info('Logging in as seller');
    await login.goto(testData.login.url);
    await login.login(testData.login.seller1);
    Logging.info('Updating product quantity in seller dashboard');
    await sellerDashboard.goto();
    await sellerDashboard.updateProductQuantity(testData.inventory.product, testData.inventory.quantity);
    Logging.info('Checking catalog page as consumer');
    await catalog.goto(testData.catalog.url);
    Logging.info('Validating updated stock is reflected');
    await expect(catalog.stockCount(testData.inventory.product)).toHaveText(`${testData.inventory.quantity}`);
  });
});