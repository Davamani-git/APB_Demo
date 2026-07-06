const locators = {
  catalogTitle: (page) => page.locator('[data-testid="catalog-title"]'),
  searchInput: (page) => page.locator('[data-testid="search-input"]'),
  searchBtn: (page) => page.locator('[data-testid="search-btn"]'),
  categoryFilter: (page, category) => page.locator(`[data-testid="category-filter-${category}"]`),
  priceFilter: (page, range) => page.locator(`[data-testid="price-filter-${range}"]`),
  filteredProducts: (page, term, category, priceRange) => page.locator('[data-testid="product-card"]'),
  clearFiltersBtn: (page) => page.locator('[data-testid="clear-filters-btn"]'),
  allProducts: (page) => page.locator('[data-testid="product-card"]'),
  noResultsMsg: (page) => page.locator('[data-testid="no-results-msg"]'),
  productCard: (page, name) => page.locator(`[data-testid="product-card-${name}"]`),
};
module.exports = locators;
