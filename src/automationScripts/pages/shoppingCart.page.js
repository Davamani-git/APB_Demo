const { expect } = require('@playwright/test');

exports.ShoppingCartPage = class ShoppingCartPage {
  constructor(page) {
    this.page = page;
    this.cartLink = page.locator('a[href*="cart"], a:has-text("Cart"), .cart-icon');
    this.cartItems = page.locator('.cart-items, .cart-list, [data-testid="cart-items"]');
    this.cartItem = page.locator('.cart-item, .cart-product');
    this.quantityInput = page.locator('input[name="quantity"], input[type="number"]');
    this.updateButton = page.locator('button:has-text("Update"), button[id="updateCart"]');
    this.addToCartButton = page.locator('button:has-text("Add to Cart"), button[id="addToCart"]');
    this.proceedToCheckoutButton = page.locator('button:has-text("Proceed to Checkout"), button:has-text("Checkout")');
    this.cartTotal = page.locator('.cart-total, .total-amount, [data-testid="cart-total"]');
    this.validationError = page.locator('.error-message, .validation-error, [role="alert"]:has-text("error")');
    this.productDetailsPage = page.locator('.product-details, [data-testid="product-details"]');
    this.searchInput = page.locator('input[name="search"], input[id="search"]');
    this.searchButton = page.locator('button:has-text("Search")');
    this.searchResults = page.locator('.search-results, .product-list');
  }

  async navigateToCart() {
    await expect(this.cartLink).toBeVisible();
    await this.cartLink.click();
  }

  async addProductToCart(productName, quantity) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await expect(this.searchResults).toBeVisible();
    
    const product = this.page.locator(`.product-item:has-text("${productName}")`).first();
    await product.click();
    
    await expect(this.quantityInput).toBeVisible();
    await this.quantityInput.fill(quantity.toString());
    await this.addToCartButton.click();
  }

  async searchAndAddProduct(productName, quantity) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await expect(this.searchResults).toBeVisible();
    
    const product = this.page.locator(`.product-item:has-text("${productName}")`).first();
    await product.click();
    
    await expect(this.quantityInput).toBeVisible();
    await this.quantityInput.fill(quantity.toString());
    await this.addToCartButton.click();
    await this.page.goBack();
  }

  async proceedToCheckout() {
    await expect(this.proceedToCheckoutButton).toBeEnabled();
    await this.proceedToCheckoutButton.click();
  }

  async verifyCartContainsProduct(productName, quantity) {
    const cartItem = this.page.locator(`.cart-item:has-text("${productName}")`);
    await expect(cartItem).toBeVisible();
    const itemQuantity = cartItem.locator('input[name="quantity"], .quantity');
    await expect(itemQuantity).toHaveValue(quantity.toString());
  }

  async verifyCartTotalIsCorrect() {
    await expect(this.cartTotal).toBeVisible();
    // Additional logic to verify total calculation
  }

  async updateProductQuantity(productName, newQuantity) {
    const cartItem = this.page.locator(`.cart-item:has-text("${productName}")`);
    await expect(cartItem).toBeVisible();
    const quantityInput = cartItem.locator('input[name="quantity"], input[type="number"]');
    await quantityInput.fill(newQuantity.toString());
    
    const updateBtn = cartItem.locator('button:has-text("Update")');
    if (await updateBtn.isVisible()) {
      await updateBtn.click();
    } else {
      await quantityInput.press('Enter');
    }
  }

  async verifyCartItemSubtotal(productName, expectedSubtotal) {
    const cartItem = this.page.locator(`.cart-item:has-text("${productName}")`);
    const subtotal = cartItem.locator('.subtotal, .item-total');
    await expect(subtotal).toContainText(`$${expectedSubtotal}`);
  }

  async selectProduct(productName) {
    const product = this.page.locator(`.product-item:has-text("${productName}")`).first();
    await expect(product).toBeVisible();
    await product.click();
  }

  async setQuantity(quantity) {
    await expect(this.quantityInput).toBeVisible();
    await this.quantityInput.fill(quantity.toString());
  }

  async clickAddToCart() {
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
  }
};
