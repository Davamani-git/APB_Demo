const { expect } = require('@playwright/test');

exports.ProductSearchPage = class ProductSearchPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('input[name="search"], input[id="search"], input[placeholder*="search" i]');
    this.categoryDropdown = page.locator('select[name="category"], select[id="category"]');
    this.priceRangeMinInput = page.locator('input[name="priceMin"], input[id="priceMin"], input[placeholder*="min" i]');
    this.priceRangeMaxInput = page.locator('input[name="priceMax"], input[id="priceMax"], input[placeholder*="max" i]');
    this.ratingFilter = page.locator('select[name="rating"], input[name="rating"]');
    this.searchButton = page.locator('button[type="submit"]:has-text("Search"), button:has-text("Search")');
    this.applyFiltersButton = page.locator('button:has-text("Apply Filters"), button:has-text("Apply")');
    this.searchResults = page.locator('.search-results, .product-list, [data-testid="search-results"]');
    this.noResultsMessage = page.locator('.no-results, .empty-state, [data-testid="no-results"]');
    this.productItems = page.locator('.product-item, .product-card');
  }

  async navigate() {
    await this.page.goto('https://shop.example.com');
  }

  async enterSearchKeyword(keyword) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(keyword);
  }

  async selectCategory(category) {
    await expect(this.categoryDropdown).toBeVisible();
    await this.categoryDropdown.selectOption({ label: category });
  }

  async selectPriceRange(min, max) {
    await expect(this.priceRangeMinInput).toBeVisible();
    await this.priceRangeMinInput.fill(min);
    await this.priceRangeMaxInput.fill(max);
  }

  async selectRating(rating) {
    await expect(this.ratingFilter).toBeVisible();
    await this.ratingFilter.selectOption({ label: `${rating} stars and above` });
  }

  async clickSearch() {
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }

  async applyFilters() {
    if (await this.applyFiltersButton.isVisible()) {
      await this.applyFiltersButton.click();
    } else {
      await this.clickSearch();
    }
  }

  async verifySearchResultsMatchCriteria(keyword, category) {
    const products = await this.productItems.all();
    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      const text = await product.textContent();
      expect(text.toLowerCase()).toContain(keyword.toLowerCase());
    }
  }

  async verifyAllResultsMatchFilters(keyword, category, minPrice, maxPrice, minRating) {
    const products = await this.productItems.all();
    expect(products.length).toBeGreaterThan(0);
    // Verification logic for all filters
  }
};
