const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { SearchPage } = require('./pages/search.page');
const { logger } = require('../../data/logger');

const testData = {
  username: 'testuser',
  password: 'Pass@123',
  product: 'Laptop',
  filter: { price: '500-1000', brand: 'BrandX' },
};

test('TS-003 TC-1112: Search and filter products', async ({ page }) => {
  logger.info('Step 1: Login to the platform');
  const loginPage = new LoginPage(page);
  await loginPage.login(testData.username, testData.password);
  await expect(loginPage.dashboardContainer).toBeVisible();

  logger.info('Step 2: Enter product name in search bar and search');
  const searchPage = new SearchPage(page);
  await searchPage.searchProduct(testData.product);
  await expect(searchPage.productList).toBeVisible();

  logger.info('Step 3: Apply filters');
  await searchPage.applyFilters(testData.filter);
  await expect(searchPage.filteredProductList).toBeVisible();
});