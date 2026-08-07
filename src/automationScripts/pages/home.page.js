const { expect } = require('@playwright/test');

exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.searchBar = page.locator('#search, input[name="search"], [data-testid="search-bar"]');
    this.categoryDropdown = page.locator('#category, select[name="category"]');
    this.searchButton = page.locator('button[type="submit"], button:has-text("Search"), #search-button');
  }

  async navigate() {
    await this.page.goto('https://platform.example.com');
    await expect(this.page).toHaveURL(/platform\.example\.com/);
  }

  async locateSearchBar() {
    await expect(this.searchBar).toBeVisible();
  }

  async enterSearchKeyword(keyword) {
    await expect(this.searchBar).toBeVisible();
    await this.searchBar.fill(keyword);
  }

  async selectCategory(category) {
    await expect(this.categoryDropdown).toBeVisible();
    await this.categoryDropdown.selectOption(category);
  }

  async clickSearchButton() {
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }
};
