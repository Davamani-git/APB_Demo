const { test, expect } = require('@playwright/test');
const { ProductSearchPage } = require('./pages/productSearch.page');

test.describe('Product Search and Filtering', () => {
  test('TC-1177: Search products by keyword and category', async ({ page }) => {
    const productSearchPage = new ProductSearchPage(page);
    
    await productSearchPage.navigate();
    await expect(page).toHaveURL(/.*shop.example.com/);
    
    await productSearchPage.enterSearchKeyword('laptop');
    await productSearchPage.selectCategory('Electronics');
    await productSearchPage.clickSearch();
    
    await expect(productSearchPage.searchResults).toBeVisible({ timeout: 2000 });
    await productSearchPage.verifySearchResultsMatchCriteria('laptop', 'Electronics');
  });

  test('TC-1178: Search with multiple filters (category, price range, rating)', async ({ page }) => {
    const productSearchPage = new ProductSearchPage(page);
    
    await productSearchPage.navigate();
    await expect(page).toHaveURL(/.*shop.example.com/);
    
    await productSearchPage.enterSearchKeyword('smartphone');
    await productSearchPage.selectCategory('Electronics');
    await productSearchPage.selectPriceRange('200', '500');
    await productSearchPage.selectRating('4');
    await productSearchPage.applyFilters();
    
    await expect(productSearchPage.searchResults).toBeVisible();
    await productSearchPage.verifyAllResultsMatchFilters('smartphone', 'Electronics', 200, 500, 4);
  });

  test('TC-1179: Search with non-existent product keyword', async ({ page }) => {
    const productSearchPage = new ProductSearchPage(page);
    
    await productSearchPage.navigate();
    await expect(page).toHaveURL(/.*shop.example.com/);
    
    await productSearchPage.enterSearchKeyword('xyzabc123nonexistent');
    await productSearchPage.clickSearch();
    
    await expect(productSearchPage.noResultsMessage).toBeVisible();
    await expect(productSearchPage.noResultsMessage).toContainText(/no products found/i);
  });
});
