const { expect } = require('@playwright/test');

exports.SellerDashboardPage = class SellerDashboardPage {
  constructor(page) {
    this.page = page;
    this.addNewProductLink = page.locator('a:has-text("Add New Product"), #add-product, [data-testid="add-product"]');
    this.productListingForm = page.locator('form#product-form, [data-testid="product-listing-form"]');
    this.productNameInput = page.locator('#product-name, input[name="productName"]');
    this.productDescriptionInput = page.locator('#product-description, textarea[name="description"]');
    this.productPriceInput = page.locator('#product-price, input[name="price"]');
    this.productImageUpload = page.locator('#product-image, input[type="file"][name="image"]');
    this.categoryDropdown = page.locator('#category, select[name="category"]');
    this.inventoryInput = page.locator('#inventory, input[name="inventory"]');
    this.submitButton = page.locator('button[type="submit"], button:has-text("Submit"), #submit-product');
    this.confirmationMessage = page.locator('.success-message, .alert-success, [data-testid="confirmation"]');
    this.validationError = page.locator('.error-message, .alert-danger, [data-testid="validation-error"]');
    this.fieldValidationError = page.locator('.field-error, .invalid-feedback');
    this.inventoryManagementLink = page.locator('a:has-text("Inventory"), #inventory-management');
    this.inventoryDashboard = page.locator('#inventory-dashboard, [data-testid="inventory-dashboard"]');
    this.productSelector = page.locator('#product-select, select[name="product"]');
    this.inventoryQuantityInput = page.locator('#inventory-quantity, input[name="quantity"]');
    this.saveInventoryButton = page.locator('button:has-text("Save"), #save-inventory');
    this.lowInventoryAlert = page.locator('.low-inventory-alert, [data-testid="low-inventory-alert"]');
    this.accountLockedMessage = page.locator('.account-locked, [data-testid="account-locked"]');
    this.accountStatusIndicator = page.locator('.account-status, [data-testid="account-status"]');
    this.logoutButton = page.locator('a:has-text("Logout"), #logout, button:has-text("Logout")'); 
  }

  async navigateToAddNewProduct() {
    await expect(this.addNewProductLink).toBeVisible();
    await this.addNewProductLink.click();
  }

  async enterProductName(name) {
    await expect(this.productNameInput).toBeVisible();
    await this.productNameInput.fill(name);
  }

  async enterProductDescription(description) {
    await expect(this.productDescriptionInput).toBeVisible();
    await this.productDescriptionInput.fill(description);
  }

  async enterProductPrice(price) {
    await expect(this.productPriceInput).toBeVisible();
    await this.productPriceInput.fill(price);
  }

  async uploadProductImage(imagePath) {
    await expect(this.productImageUpload).toBeVisible();
    await this.productImageUpload.setInputFiles(imagePath);
  }

  async selectCategory(category) {
    await expect(this.categoryDropdown).toBeVisible();
    await this.categoryDropdown.selectOption(category);
  }

  async enterInventory(quantity) {
    await expect(this.inventoryInput).toBeVisible();
    await this.inventoryInput.fill(quantity);
  }

  async submitProductListing() {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  async verifyProductInCatalog(productName) {
    const productInCatalog = this.page.locator(`[data-product="${productName}"], td:has-text("${productName}")`);
    await expect(productInCatalog).toBeVisible({ timeout: 60000 });
  }

  async verifyProductNotCreated() {
    await expect(this.productListingForm).toBeVisible();
  }

  async navigateToInventoryManagement() {
    await expect(this.inventoryManagementLink).toBeVisible();
    await this.inventoryManagementLink.click();
  }

  async selectProduct(productName) {
    await expect(this.productSelector).toBeVisible();
    await this.productSelector.selectOption({ label: productName });
  }

  async reduceInventoryBelowThreshold(newQuantity) {
    await this.enterInventoryQuantity(newQuantity.toString());
    await this.saveInventoryUpdate();
  }

  async enterInventoryQuantity(quantity) {
    await expect(this.inventoryQuantityInput).toBeVisible();
    await this.inventoryQuantityInput.fill(quantity);
  }

  async saveInventoryUpdate() {
    await expect(this.saveInventoryButton).toBeEnabled();
    await this.saveInventoryButton.click();
  }

  async verifyLowInventoryAlert() {
    await expect(this.lowInventoryAlert).toBeVisible();
  }

  async verifyReplenishmentNotification(productName) {
    const notification = this.page.locator(`.notification:has-text("${productName}"), [data-notification-product="${productName}"]`);
    await expect(notification).toBeVisible();
  }

  async verifyInventoryNotUpdated(productName, expectedQuantity) {
    const inventoryDisplay = this.page.locator(`[data-product="${productName}"] .inventory-count`);
    await expect(inventoryDisplay).toHaveText(expectedQuantity.toString());
  }

  async verifyInventoryUpdatedInDashboard(productName, expectedQuantity) {
    const inventoryDisplay = this.page.locator(`[data-product="${productName}"] .inventory-count`);
    await expect(inventoryDisplay).toHaveText(expectedQuantity.toString());
  }

  async simulateRapidHighValueTransactions(transactions) {
    for (const transaction of transactions) {
      await this.page.evaluate((amount) => {
        window.dispatchEvent(new CustomEvent('transaction', { detail: { amount } }));
      }, transaction.amount);
    }
  }

  async performNormalTransactions(transactions) {
    for (const transaction of transactions) {
      await this.page.evaluate((amount) => {
        window.dispatchEvent(new CustomEvent('transaction', { detail: { amount, type: 'normal' } }));
      }, transaction.amount);
      await this.page.waitForTimeout(2400000);
    }
  }

  async verifyAccountLocked() {
    await expect(this.accountLockedMessage).toBeVisible();
  }

  async verifyAccountNotFlagged() {
    const flaggedIndicator = this.page.locator('.account-flagged, [data-testid="account-flagged"]');
    await expect(flaggedIndicator).toHaveCount(0);
  }

  async verifyAccountActive() {
    await expect(this.accountStatusIndicator).toContainText(/active/i);
  }

  async logout() {
    await expect(this.logoutButton).toBeVisible();
    await this.logoutButton.click();
  }
};
