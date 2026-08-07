const { expect } = require('@playwright/test');

exports.ProductCatalogPage = class ProductCatalogPage {
  constructor(page) {
    this.page = page;
    this.searchResults = page.locator('.search-results, [data-testid="search-results"]');
    this.sortingOptions = page.locator('#sort-by, select[name="sortBy"]');
    this.filterOptions = page.locator('.filter-options, [data-testid="filter-options"]');
    this.noProductsMessage = page.locator('.no-products, [data-testid="no-products-message"]');
    this.categoryFilter = page.locator('#category-filter, select[name="categoryFilter"]');
    this.priceRangeMinInput = page.locator('#price-min, input[name="priceMin"]');
    this.priceRangeMaxInput = page.locator('#price-max, input[name="priceMax"]');
    this.ratingFilter = page.locator('#rating-filter, select[name="ratingFilter"]');
    this.applyFiltersButton = page.locator('button:has-text("Apply"), #apply-filters');
    this.productItems = page.locator('.product-item, [data-testid="product-item"]');
    this.addToCartButton = page.locator('button:has-text("Add to Cart"), .add-to-cart');
    this.cartIcon = page.locator('#cart, a:has-text("Cart"), [data-testid="cart-icon"]');
  }

  async verifySearchResultsDisplayed() {
    await expect(this.searchResults).toBeVisible({ timeout: 2000 });
  }

  async verifySortingOptionsAvailable() {
    await expect(this.sortingOptions).toBeVisible();
  }

  async verifyFilteringOptionsAvailable() {
    await expect(this.filterOptions).toBeVisible();
  }

  async verifyEmptyResultSet() {
    await expect(this.searchResults).toBeVisible();
    await expect(this.productItems).toHaveCount(0);
  }

  async verifyNoSystemErrors() {
    const errorMessage = this.page.locator('.error, .system-error');
    await expect(errorMessage).toHaveCount(0);
  }

  async applyCategoryFilter(category) {
    await expect(this.categoryFilter).toBeVisible();
    await this.categoryFilter.selectOption(category);
  }

  async applyPriceRangeFilter(minPrice, maxPrice) {
    await expect(this.priceRangeMinInput).toBeVisible();
    await this.priceRangeMinInput.fill(minPrice.toString());
    await this.priceRangeMaxInput.fill(maxPrice.toString());
  }

  async applyRatingFilter(rating) {
    await expect(this.ratingFilter).toBeVisible();
    await this.ratingFilter.selectOption(rating.toString());
  }

  async verifyFilteredResultsDisplayed() {
    await expect(this.searchResults).toBeVisible({ timeout: 2000 });
  }

  async verifyAllProductsMatchFilters(category, minPrice, maxPrice, minRating) {
    const products = await this.productItems.all();
    for (const product of products) {
      const productCategory = await product.locator('.category').textContent();
      const productPrice = parseFloat(await product.locator('.price').textContent().replace(/[^0-9.]/g, ''));
      const productRating = parseFloat(await product.locator('.rating').textContent());
      
      expect(productCategory).toContain(category);
      expect(productPrice).toBeGreaterThanOrEqual(minPrice);
      expect(productPrice).toBeLessThanOrEqual(maxPrice);
      expect(productRating).toBeGreaterThanOrEqual(minRating);
    }
  }

  async searchAndAddProductToCart(productName) {
    const product = this.page.locator(`[data-product="${productName}"], .product-item:has-text("${productName}")`);
    await expect(product).toBeVisible();
    const addButton = product.locator('button:has-text("Add to Cart")');
    await expect(addButton).toBeEnabled();
    await addButton.click();
  }

  async navigateToCart() {
    await expect(this.cartIcon).toBeVisible();
    await this.cartIcon.click();
  }

  async navigateToCatalog() {
    await this.page.goto('https://platform.example.com/catalog');
  }

  async verifyProductInventory(productName, expectedQuantity) {
    const product = this.page.locator(`[data-product="${productName}"]`);
    const inventoryDisplay = product.locator('.inventory, .stock-count');
    await expect(inventoryDisplay).toHaveText(expectedQuantity.toString());
  }
};
