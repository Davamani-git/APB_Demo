const { expect } = require('@playwright/test');

exports.SearchPage = class SearchPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('input#search');
    this.searchButton = page.locator('button#search-btn');
    this.productList = page.locator('div.product-list');
    this.priceFilter = page.locator('select#filter-price');
    this.brandFilter = page.locator('select#filter-brand');
    this.filteredProductList = page.locator('div.product-list.filtered');
  }
  async searchProduct(product) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(product);
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }
  async applyFilters(filter) {
    await expect(this.priceFilter).toBeVisible();
    await this.priceFilter.selectOption(filter.price);
    await expect(this.brandFilter).toBeVisible();
    await this.brandFilter.selectOption(filter.brand);
  }
};