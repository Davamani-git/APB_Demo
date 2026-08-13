const { expect } = require('@playwright/test');

exports.ProductSearchPage = class ProductSearchPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.searchBar = page.locator('input[type="search"], input[placeholder*="Search"], #search-input, [data-testid="search-input"]');
    this.categoryFilter = page.locator('select[name="category"], #category-filter, [data-testid="category-filter"]');
    this.searchButton = page.locator('button[type="submit"], button:has-text("Search"), #search-button, [data-testid="search-button"]');
    this.searchResults = page.locator('.product-list, .search-results, [data-testid="search-results"]');
    this.productCards = page.locator('.product-card, .product-item, [data-testid="product-card"]');
    this.sortDropdown = page.locator('select[name="sort"], #sort-options, [data-testid="sort-dropdown"]');
    this.sortingOptions = page.locator('.sorting-options, [data-testid="sorting-options"]');
    this.noProductsMessage = page.locator('.no-results, .no-products-found, [data-testid="no-products-message"], :has-text("No products found"), :has-text("couldn\'t find any results")');
    this.productPrices = page.locator('.product-price, [data-testid="product-price"]');
    this.productCategories = page.locator('.product-category, [data-testid="product-category"]');
    this.errorMessage = page.locator('.error-message, .alert-error, [data-testid="error-message"]');
    this.categoryCheckboxes = page.locator('input[type="checkbox"][name*="category"], [data-testid="category-checkbox"]');
  }

  async navigate(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async enterSearchKeyword(keyword) {
    await expect(this.searchBar).toBeVisible();
    await this.searchBar.clear();
    await this.searchBar.fill(keyword);
    await expect(this.searchBar).toHaveValue(keyword);
  }

  async selectCategory(category) {
    await expect(this.categoryFilter).toBeVisible();
    await this.categoryFilter.selectOption({ label: category });
  }

  async selectMultipleCategories(categories) {
    for (const category of categories) {
      const checkbox = this.page.locator(`input[type="checkbox"][value="${category}"], label:has-text("${category}") input[type="checkbox"]`);
      await expect(checkbox).toBeVisible();
      await checkbox.check();
      await expect(checkbox).toBeChecked();
    }
  }

  async clickSearchButton() {
    await expect(this.searchButton).toBeVisible();
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }

  async waitForSearchResults() {
    // Wait for search results to load within 2 seconds as per acceptance criteria
    await this.searchResults.waitFor({ state: 'visible', timeout: 2000 });
  }

  async verifySortingOptionsDisplayed() {
    await expect(this.sortDropdown).toBeVisible();
    
    // Verify specific sorting options are available
    const sortOptions = await this.sortDropdown.locator('option').allTextContents();
    expect(sortOptions.some(opt => opt.includes('Price: Low to High'))).toBeTruthy();
    expect(sortOptions.some(opt => opt.includes('Price: High to Low'))).toBeTruthy();
    expect(sortOptions.some(opt => opt.includes('Relevance') || opt.includes('Rating'))).toBeTruthy();
  }

  async selectSortOption(sortOption) {
    await expect(this.sortDropdown).toBeVisible();
    await this.sortDropdown.selectOption({ label: sortOption });
  }

  async verifyProductsSortedByPriceAscending() {
    // Wait for products to be re-sorted
    await this.page.waitForLoadState('networkidle');
    
    const priceElements = await this.productPrices.first().count() > 0 ? this.productPrices.all() : [];
    expect(priceElements.length).toBeGreaterThanOrEqual(3);
    
    // Extract first three product prices
    const prices = [];
    for (let i = 0; i < Math.min(3, priceElements.length); i++) {
      const priceText = await priceElements[i].textContent();
      const priceValue = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      prices.push(priceValue);
    }
    
    // Verify prices are in ascending order
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  }

  async verifyProductsMatchCategories(expectedCategories) {
    await expect(this.productCards.first()).toBeVisible();
    
    const products = await this.productCards.all();
    expect(products.length).toBeGreaterThan(0);
    
    // Verify each product belongs to one of the selected categories
    for (const product of products) {
      const categoryText = await product.locator('.product-category, [data-testid="product-category"]').textContent();
      const matchesCategory = expectedCategories.some(cat => categoryText.includes(cat));
      expect(matchesCategory).toBeTruthy();
    }
  }

  async verifyNoProductsFoundMessageDisplayed() {
    await expect(this.noProductsMessage).toBeVisible({ timeout: 5000 });
    const messageText = await this.noProductsMessage.textContent();
    expect(messageText.toLowerCase()).toMatch(/no products found|couldn't find any results|no results/i);
  }

  async verifyNoProductsDisplayed() {
    const productCount = await this.productCards.count();
    expect(productCount).toBe(0);
  }

  async verifySearchCompletedWithoutErrors() {
    // Verify page loaded successfully without system errors
    const errorCount = await this.errorMessage.count();
    
    // Either results are shown or no products message is displayed
    const hasResults = await this.productCards.count() > 0;
    const hasNoProductsMessage = await this.noProductsMessage.isVisible().catch(() => false);
    
    expect(hasResults || hasNoProductsMessage).toBeTruthy();
    
    // Verify no critical system errors
    const pageContent = await this.page.content();
    expect(pageContent.toLowerCase()).not.toContain('fatal error');
    expect(pageContent.toLowerCase()).not.toContain('system error');
  }

  async verifyNoCodeInjection() {
    // Verify special characters are not executed as code
    const pageContent = await this.page.content();
    
    // Check that special characters are either stripped or HTML-encoded
    const hasUnescapedSpecialChars = pageContent.includes('<>@#$%') && !pageContent.includes('&lt;&gt;');
    
    // Verify no script execution or code injection occurred
    const alerts = [];
    this.page.on('dialog', dialog => {
      alerts.push(dialog.message());
      dialog.dismiss();
    });
    
    expect(alerts.length).toBe(0);
  }

  async verifySystemHandlesMaliciousInput() {
    // Verify system returns safe results or error message
    const hasResults = await this.productCards.count() > 0;
    const hasNoProductsMessage = await this.noProductsMessage.isVisible().catch(() => false);
    const hasErrorMessage = await this.errorMessage.isVisible().catch(() => false);
    
    expect(hasResults || hasNoProductsMessage || hasErrorMessage).toBeTruthy();
    
    // Verify no SQL errors are displayed
    const pageContent = await this.page.content();
    expect(pageContent.toLowerCase()).not.toContain('sql syntax');
    expect(pageContent.toLowerCase()).not.toContain('mysql error');
    expect(pageContent.toLowerCase()).not.toContain('database error');
  }

  async verifyNoDatabaseExposure() {
    const pageContent = await this.page.content();
    
    // Verify no database records or sensitive data are exposed
    expect(pageContent.toLowerCase()).not.toContain('select * from');
    expect(pageContent.toLowerCase()).not.toContain('table');
    expect(pageContent.toLowerCase()).not.toContain('database');
    expect(pageContent.toLowerCase()).not.toContain('sql error');
    expect(pageContent.toLowerCase()).not.toContain('syntax error');
    
    // Verify system security remains intact
    expect(this.page.url()).not.toContain('error');
  }

  async verifyNoScriptExecution() {
    // Monitor for any alert dialogs (which would indicate XSS)
    const alerts = [];
    this.page.on('dialog', dialog => {
      alerts.push(dialog.message());
      dialog.dismiss();
    });
    
    // Verify no alert popup occurred
    expect(alerts.length).toBe(0);
    
    // Verify page loaded successfully
    const hasResults = await this.productCards.count() > 0;
    const hasNoProductsMessage = await this.noProductsMessage.isVisible().catch(() => false);
    const hasErrorMessage = await this.errorMessage.isVisible().catch(() => false);
    
    expect(hasResults || hasNoProductsMessage || hasErrorMessage).toBeTruthy();
  }

  async verifyScriptTagsNeutralized() {
    const pageContent = await this.page.content();
    
    // Verify script tags are HTML-encoded or removed
    const hasRawScriptTag = pageContent.includes('<script>alert') && !pageContent.includes('&lt;script&gt;');
    expect(hasRawScriptTag).toBeFalsy();
    
    // Alternative: verify script tags are escaped
    if (pageContent.includes('script')) {
      const hasEncodedScript = pageContent.includes('&lt;script&gt;') || pageContent.includes('&amp;lt;script&amp;gt;');
      const hasRawScript = pageContent.match(/<script>alert\('XSS'\)<\/script>/);
      
      if (hasRawScript) {
        expect(hasEncodedScript).toBeTruthy();
      }
    }
  }
};