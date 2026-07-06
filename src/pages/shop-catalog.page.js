const loc = require('./locators/shop-catalog.locators');

class CatalogPage {
  constructor(page) { this.page = page; }
  async isCatalogLoaded() { return (await loc.catalogTitle(this.page)).isVisible(); }
  async searchProduct(term) {
    await (await loc.searchInput(this.page)).fill(term);
    await (await loc.searchBtn(this.page)).click();
  }
  async applyCategoryFilter(category) {
    await (await loc.categoryFilter(this.page, category)).click();
  }
  async applyPriceFilter(range) {
    await (await loc.priceFilter(this.page, range)).click();
  }
  async areProductsFiltered(term, category, priceRange) {
    // Implementation should check visible products match criteria
    return (await loc.filteredProducts(this.page, term, category, priceRange)).count() > 0;
  }
  async clearAllFilters() {
    await (await loc.clearFiltersBtn(this.page)).click();
  }
  async isFullProductListVisible() {
    return (await loc.allProducts(this.page)).count() > 0;
  }
  async isNoResultsMessageVisible() {
    return (await loc.noResultsMsg(this.page)).isVisible();
  }
  async selectProduct(productName) {
    await (await loc.productCard(this.page, productName)).click();
  }
}
module.exports = CatalogPage;
