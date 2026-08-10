const { expect } = require('@playwright/test');

exports.ProductCatalogPage = class ProductCatalogPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('#search, input[name="search"], input[placeholder*="Search"]');
    this.searchButton = page.locator('button[type="submit"]:near(input[name="search"]), button:has-text("Search")');
    this.searchResults = page.locator('.search-results, .product-list, [data-testid="search-results"]');
  }

  async navigate() {
    await this.page.goto('/catalog');
    await expect(this.searchInput).toBeVisible();
  }

  async searchProduct(searchTerm) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(searchTerm);
    await expect(this.searchButton).toBeVisible();
    await this.searchButton.click();
  }

  getSearchResult(productName) {
    return this.page.locator(`.product-item:has-text("${productName}"), [data-product-name="${productName}"]`);
  }
};