const { test, expect } = require('@playwright/test');
const { ProductSearchPage } = require('./pages/productSearch.page');

test.describe('Product Search and Filter Tests', () => {

  test('TC-001: Search with keyword and category filter', async ({ page }) => {
    const searchPage = new ProductSearchPage(page);
    
    // Step 1: Launch the online shopping platform
    await searchPage.navigate('https://shoppingplatform.example.com');
    await expect(searchPage.searchBar).toBeVisible();
    await expect(searchPage.categoryFilter).toBeVisible();
    
    // Step 2: Enter a valid keyword in the search bar
    await searchPage.enterSearchKeyword('laptop');
    
    // Step 3: Select a category filter
    await searchPage.selectCategory('Electronics');
    
    // Step 4: Click the search button
    await searchPage.clickSearchButton();
    await searchPage.waitForSearchResults();
    
    // Step 5: Verify sorting options are available
    await searchPage.verifySortingOptionsDisplayed();
  });

  test('TC-002: Sort products by price low to high', async ({ page }) => {
    const searchPage = new ProductSearchPage(page);
    
    // Step 1: Launch the online shopping platform and navigate to homepage
    await searchPage.navigate('https://shoppingplatform.example.com');
    await expect(searchPage.searchBar).toBeVisible();
    
    // Step 2: Enter a valid keyword and select category filter
    await searchPage.enterSearchKeyword('smartphone');
    await searchPage.selectCategory('Electronics');
    
    // Step 3: Click search button to display results
    await searchPage.clickSearchButton();
    await searchPage.waitForSearchResults();
    
    // Step 4: Select 'Price: Low to High' from the sorting dropdown
    await searchPage.selectSortOption('Price: Low to High');
    await page.waitForLoadState('networkidle');
    
    // Step 5: Verify the first three products are in correct price order
    await searchPage.verifyProductsSortedByPriceAscending();
  });

  test('TC-003: Search with multiple category filters', async ({ page }) => {
    const searchPage = new ProductSearchPage(page);
    
    // Step 1: Launch the online shopping platform
    await searchPage.navigate('https://shoppingplatform.example.com');
    await expect(searchPage.searchBar).toBeVisible();
    
    // Step 2: Enter a valid keyword in the search bar
    await searchPage.enterSearchKeyword('shoes');
    
    // Step 3: Apply multiple category filters
    await searchPage.selectMultipleCategories(['Men\'s Fashion', 'Sports & Outdoors']);
    
    // Step 4: Click search button
    await searchPage.clickSearchButton();
    await searchPage.waitForSearchResults();
    
    // Step 5: Verify all displayed products belong to the selected categories
    await searchPage.verifyProductsMatchCategories(['Men\'s Fashion', 'Sports & Outdoors']);
  });

  test('TC-004: Search with non-existent keyword', async ({ page }) => {
    const searchPage = new ProductSearchPage(page);
    
    // Step 1: Launch the online shopping platform
    await searchPage.navigate('https://shoppingplatform.example.com');
    await expect(searchPage.searchBar).toBeVisible();
    
    // Step 2: Enter a keyword that does not match any products
    await searchPage.enterSearchKeyword('xyzabc123nonexistent');
    
    // Step 3: Click the search button
    await searchPage.clickSearchButton();
    await page.waitForLoadState('networkidle');
    
    // Step 4: Verify the 'no products found' message is displayed
    await searchPage.verifyNoProductsFoundMessageDisplayed();
    
    // Step 5: Verify no product listings are shown
    await searchPage.verifyNoProductsDisplayed();
  });

  test('TC-005: Search with valid keyword and mismatched category', async ({ page }) => {
    const searchPage = new ProductSearchPage(page);
    
    // Step 1: Launch the online shopping platform
    await searchPage.navigate('https://shoppingplatform.example.com');
    await expect(searchPage.searchBar).toBeVisible();
    
    // Step 2: Enter a valid keyword that exists in the catalog
    await searchPage.enterSearchKeyword('laptop');
    
    // Step 3: Select a category filter that does not contain products matching the keyword
    await searchPage.selectCategory('Clothing & Apparel');
    
    // Step 4: Click search button
    await searchPage.clickSearchButton();
    await page.waitForLoadState('networkidle');
    
    // Step 5: Verify appropriate 'no products found' message is displayed
    await searchPage.verifyNoProductsFoundMessageDisplayed();
  });

});

test.describe('Search Input Validation and Security Tests', () => {

  test('TC-006: Search with special characters', async ({ page }) => {
    const searchPage = new ProductSearchPage(page);
    
    // Step 1: Launch the online shopping platform
    await searchPage.navigate('https://shoppingplatform.example.com');
    await expect(searchPage.searchBar).toBeVisible();
    
    // Step 2: Enter a search query containing special characters
    await searchPage.enterSearchKeyword('laptop<>@#$%');
    
    // Step 3: Click the search button
    await searchPage.clickSearchButton();
    await page.waitForLoadState('networkidle');
    
    // Step 4: Verify search results are returned without errors
    await searchPage.verifySearchCompletedWithoutErrors();
    
    // Step 5: Verify no special characters are executed or interpreted as code
    await searchPage.verifyNoCodeInjection();
  });

  test('TC-007: Search with SQL injection payload', async ({ page }) => {
    const searchPage = new ProductSearchPage(page);
    
    // Step 1: Launch the online shopping platform
    await searchPage.navigate('https://shoppingplatform.example.com');
    await expect(searchPage.searchBar).toBeVisible();
    
    // Step 2: Enter a search query containing SQL injection payload
    await searchPage.enterSearchKeyword("' OR '1'='1' --");
    
    // Step 3: Click the search button
    await searchPage.clickSearchButton();
    await page.waitForLoadState('networkidle');
    
    // Step 4: Verify system response to malicious input
    await searchPage.verifySystemHandlesMaliciousInput();
    
    // Step 5: Verify no unauthorized database access or data exposure occurs
    await searchPage.verifyNoDatabaseExposure();
  });

  test('TC-008: Search with XSS script tags', async ({ page }) => {
    const searchPage = new ProductSearchPage(page);
    
    // Step 1: Launch the online shopping platform
    await searchPage.navigate('https://shoppingplatform.example.com');
    await expect(searchPage.searchBar).toBeVisible();
    
    // Step 2: Enter a search query containing script tags
    await searchPage.enterSearchKeyword("<script>alert('XSS')</script>");
    
    // Step 3: Click the search button
    await searchPage.clickSearchButton();
    await page.waitForLoadState('networkidle');
    
    // Step 4: Verify search results page loads without executing the script
    await searchPage.verifyNoScriptExecution();
    
    // Step 5: Inspect the page source to verify script tags are neutralized
    await searchPage.verifyScriptTagsNeutralized();
  });

});