const { expect } = require('@playwright/test');

exports.AddProductPage = class AddProductPage {
  constructor(page) {
    this.page = page;
    this.productNameInput = page.locator('#productName, input[name="productName"], input[placeholder*="Product Name"]');
    this.productDescriptionInput = page.locator('#productDescription, textarea[name="description"], textarea[placeholder*="Description"]');
    this.productPriceInput = page.locator('#productPrice, input[name="price"], input[type="number"][placeholder*="Price"]');
    this.categoryDropdown = page.locator('#category, select[name="category"], [data-testid="category-dropdown"]');
    this.subCategoryDropdown = page.locator('#subCategory, select[name="subCategory"], [data-testid="subcategory-dropdown"]');
    this.imageUploadInput = page.locator('input[type="file"]');
    this.submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Create Listing")');
    this.successMessage = page.locator('.success-message, .alert-success, [data-testid="success-message"]');
    this.productIdDisplay = page.locator('.product-id, [data-testid="product-id"]');
    this.confirmationNotification = page.locator('.notification, .toast, [data-testid="confirmation-notification"]');
    this.validationError = page.locator('.error-message, .alert-danger, .validation-error, [data-testid="validation-error"]');
    this.validationErrorList = page.locator('.error-list, .validation-errors, [data-testid="validation-errors"]');
    this.imageUploadError = page.locator('.image-error, .upload-error, [data-testid="image-upload-error"]');
  }

  async enterProductName(productName) {
    await expect(this.productNameInput).toBeVisible();
    await this.productNameInput.fill(productName);
  }

  async enterProductDescription(description) {
    await expect(this.productDescriptionInput).toBeVisible();
    await this.productDescriptionInput.fill(description);
  }

  async enterProductPrice(price) {
    await expect(this.productPriceInput).toBeVisible();
    await this.productPriceInput.fill(price);
  }

  async selectCategory(category, subCategory) {
    await expect(this.categoryDropdown).toBeVisible();
    await this.categoryDropdown.selectOption({ label: category });
    
    if (subCategory) {
      await expect(this.subCategoryDropdown).toBeVisible();
      await this.subCategoryDropdown.selectOption({ label: subCategory });
    }
  }

  async uploadProductImages(imageFiles) {
    await expect(this.imageUploadInput).toBeAttached();
    
    if (Array.isArray(imageFiles)) {
      const filePaths = imageFiles.map(file => `./testData/images/${file}`);
      await this.imageUploadInput.setInputFiles(filePaths);
    } else {
      await this.imageUploadInput.setInputFiles(`./testData/images/${imageFiles}`);
    }
  }

  async submitProduct() {
    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  getValidationErrorByField(fieldName) {
    return this.page.locator(`[data-field="${fieldName}"] .error, .error-${fieldName}, [data-testid="error-${fieldName}"]`);
  }
};