const { expect } = require('@playwright/test');

exports.SellerProductPage = class SellerProductPage {
  constructor(page) {
    this.page = page;
    this.addNewProductLink = page.locator('a[href*="add-product"], button:has-text("Add New Product")');
    this.productForm = page.locator('form[id*="product"], form.product-form');
    this.productNameInput = page.locator('input[name="productName"], input[id="productName"], input[placeholder*="product name" i]');
    this.productImageInput = page.locator('input[type="file"][name*="image"], input[type="file"][id*="product"]');
    this.imagePreview = page.locator('.image-preview, img[alt*="preview"], .uploaded-image');
    this.productDescriptionInput = page.locator('textarea[name="description"], textarea[id="description"], textarea[placeholder*="description" i]');
    this.productPriceInput = page.locator('input[name="price"], input[id="price"], input[placeholder*="price" i]');
    this.submitButton = page.locator('button[type="submit"]:has-text("Submit"), button:has-text("Create Product"), button:has-text("Add Product")');
    this.confirmationMessage = page.locator('.success-message, .confirmation, [role="alert"]:has-text("success" i), .alert-success');
    this.validationError = page.locator('.error-message, .validation-error, [role="alert"]:has-text("error" i), .alert-danger, .field-error');
    this.catalogLink = page.locator('a[href*="catalog"], a:has-text("Catalog"), a:has-text("Products")');
    this.catalogProductList = page.locator('.product-list, .catalog-items, [data-testid="product-list"]');
  }

  async navigateToAddNewProduct() {
    await expect(this.addNewProductLink).toBeVisible();
    await this.addNewProductLink.click();
  }

  async enterProductName(name) {
    await expect(this.productNameInput).toBeVisible();
    await this.productNameInput.fill(name);
  }

  async uploadProductImage(imagePath) {
    await expect(this.productImageInput).toBeAttached();
    await this.productImageInput.setInputFiles(imagePath);
  }

  async uploadMultipleProductImages(imagePaths) {
    await expect(this.productImageInput).toBeAttached();
    await this.productImageInput.setInputFiles(imagePaths);
  }

  async enterProductDescription(description) {
    await expect(this.productDescriptionInput).toBeVisible();
    await this.productDescriptionInput.fill(description);
  }

  async enterProductPrice(price) {
    await expect(this.productPriceInput).toBeVisible();
    await this.productPriceInput.fill(price);
  }

  async submitProduct() {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  async verifyCatalogContainsProduct(productName) {
    await this.page.waitForTimeout(1000);
    const productLocator = this.page.locator(`.product-item:has-text("${productName}"), .catalog-item:has-text("${productName}")`);
    await expect(productLocator).toBeVisible({ timeout: 60000 });
  }

  async verifyCatalogContainsProductWithImages(productName, imageCount) {
    await this.page.waitForTimeout(1000);
    const productLocator = this.page.locator(`.product-item:has-text("${productName}"), .catalog-item:has-text("${productName}")`);
    await expect(productLocator).toBeVisible({ timeout: 60000 });
    const images = productLocator.locator('img');
    await expect(images).toHaveCount(imageCount, { timeout: 5000 });
  }
};
