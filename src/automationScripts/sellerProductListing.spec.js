const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { SellerDashboardPage } = require('./pages/sellerDashboard.page');
const { AddProductPage } = require('./pages/addProduct.page');
const { ProductCatalogPage } = require('./pages/productCatalog.page');

test.describe('Seller Product Listing - Valid Scenarios', () => {
  test('TC-001: Create product listing with valid data - Samsung Galaxy S23 Ultra', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const addProductPage = new AddProductPage(page);
    const catalogPage = new ProductCatalogPage(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'Test@123');
    await expect(sellerDashboard.dashboardHeader).toBeVisible();

    await sellerDashboard.navigateToAddNewProduct();
    await expect(addProductPage.productNameInput).toBeVisible();

    await addProductPage.enterProductName('Samsung Galaxy S23 Ultra');
    await addProductPage.enterProductDescription('Latest flagship smartphone with 200MP camera and S Pen');
    await addProductPage.enterProductPrice('1199.99');
    await addProductPage.selectCategory('Electronics', 'Mobile Phones');
    await addProductPage.uploadProductImages(['product_image1.jpg', 'product_image2.jpg']);
    await addProductPage.submitProduct();

    await expect(addProductPage.successMessage).toBeVisible();
    await expect(addProductPage.productIdDisplay).toBeVisible();

    await catalogPage.navigate();
    await catalogPage.searchProduct('Samsung Galaxy S23 Ultra');
    await expect(catalogPage.getSearchResult('Samsung Galaxy S23 Ultra')).toBeVisible({ timeout: 60000 });
  });

  test('TC-002: Create product listing with minimum price - Wireless Mouse', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const addProductPage = new AddProductPage(page);
    const catalogPage = new ProductCatalogPage(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'Test@123');
    await expect(sellerDashboard.dashboardHeader).toBeVisible();

    await sellerDashboard.navigateToAddNewProduct();
    await expect(addProductPage.productNameInput).toBeVisible();

    await addProductPage.enterProductName('Wireless Mouse');
    await addProductPage.enterProductDescription('Ergonomic wireless mouse with USB receiver');
    await addProductPage.enterProductPrice('0.01');
    await addProductPage.selectCategory('Electronics', 'Computer Accessories');
    await addProductPage.uploadProductImages(['mouse_image.png']);
    await addProductPage.submitProduct();

    await expect(addProductPage.successMessage).toBeVisible();
    await expect(addProductPage.productIdDisplay).toBeVisible();

    await catalogPage.navigate();
    await catalogPage.searchProduct('Wireless Mouse');
    await expect(catalogPage.getSearchResult('Wireless Mouse')).toBeVisible({ timeout: 60000 });
  });

  test('TC-003: Create product listing with multiple images - Apple AirPods Pro', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const addProductPage = new AddProductPage(page);
    const catalogPage = new ProductCatalogPage(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'Test@123');
    await expect(sellerDashboard.dashboardHeader).toBeVisible();

    await sellerDashboard.navigateToAddNewProduct();
    await expect(addProductPage.productNameInput).toBeVisible();

    await addProductPage.enterProductName('Apple AirPods Pro');
    await addProductPage.enterProductDescription('Wireless earbuds with active noise cancellation');
    await addProductPage.enterProductPrice('249.99');
    await addProductPage.selectCategory('Electronics', 'Audio');
    await addProductPage.uploadProductImages(['airpods1.jpg', 'airpods2.png', 'airpods3.jpeg']);
    await addProductPage.submitProduct();

    await expect(addProductPage.successMessage).toBeVisible();
    await expect(addProductPage.productIdDisplay).toBeVisible();
    await expect(addProductPage.confirmationNotification).toBeVisible();

    await catalogPage.navigate();
    await catalogPage.searchProduct('Apple AirPods Pro');
    await expect(catalogPage.getSearchResult('Apple AirPods Pro')).toBeVisible({ timeout: 60000 });
  });
});

test.describe('Seller Product Listing - Validation Scenarios', () => {
  test('TC-004: Attempt to create product without product name', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const addProductPage = new AddProductPage(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'Test@123');
    await expect(sellerDashboard.dashboardHeader).toBeVisible();

    await sellerDashboard.navigateToAddNewProduct();
    await expect(addProductPage.productNameInput).toBeVisible();

    await addProductPage.enterProductDescription('High-quality wireless headphones');
    await addProductPage.enterProductPrice('99.99');
    await addProductPage.selectCategory('Electronics', 'Audio');
    await addProductPage.uploadProductImages(['headphones.jpg']);
    await addProductPage.submitProduct();

    await expect(addProductPage.validationError).toBeVisible();
    await expect(addProductPage.validationError).toContainText(/product name is required/i);
  });

  test('TC-005: Attempt to create product without product price', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const addProductPage = new AddProductPage(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'Test@123');
    await expect(sellerDashboard.dashboardHeader).toBeVisible();

    await sellerDashboard.navigateToAddNewProduct();
    await expect(addProductPage.productNameInput).toBeVisible();

    await addProductPage.enterProductName('Bluetooth Speaker');
    await addProductPage.enterProductDescription('Portable waterproof Bluetooth speaker');
    await addProductPage.selectCategory('Electronics', 'Audio');
    await addProductPage.uploadProductImages(['speaker.jpg']);
    await addProductPage.submitProduct();

    await expect(addProductPage.validationError).toBeVisible();
    await expect(addProductPage.validationError).toContainText(/product price is required/i);
  });

  test('TC-006: Attempt to create product with multiple missing required fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const addProductPage = new AddProductPage(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'Test@123');
    await expect(sellerDashboard.dashboardHeader).toBeVisible();

    await sellerDashboard.navigateToAddNewProduct();
    await expect(addProductPage.productNameInput).toBeVisible();

    await addProductPage.enterProductDescription('Smart fitness tracker');
    await addProductPage.uploadProductImages(['tracker.jpg']);
    await addProductPage.submitProduct();

    await expect(addProductPage.validationErrorList).toBeVisible();
    await expect(addProductPage.getValidationErrorByField('name')).toBeVisible();
    await expect(addProductPage.getValidationErrorByField('price')).toBeVisible();
    await expect(addProductPage.getValidationErrorByField('category')).toBeVisible();
  });
});

test.describe('Seller Product Listing - Image Upload Validation', () => {
  test('TC-007: Attempt to upload image exceeding size limit', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const addProductPage = new AddProductPage(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'Test@123');
    await expect(sellerDashboard.dashboardHeader).toBeVisible();

    await sellerDashboard.navigateToAddNewProduct();
    await expect(addProductPage.productNameInput).toBeVisible();

    await addProductPage.enterProductName('Gaming Laptop');
    await addProductPage.enterProductDescription('High-performance gaming laptop with RTX graphics');
    await addProductPage.enterProductPrice('1499.99');
    await addProductPage.selectCategory('Electronics', 'Computers');
    await addProductPage.uploadProductImages(['laptop_image.jpg']);

    await expect(addProductPage.imageUploadError).toBeVisible();
    await expect(addProductPage.imageUploadError).toContainText(/file size exceeds maximum limit of 5MB/i);
  });

  test('TC-008: Attempt to upload image with unsupported format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const addProductPage = new AddProductPage(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'Test@123');
    await expect(sellerDashboard.dashboardHeader).toBeVisible();

    await sellerDashboard.navigateToAddNewProduct();
    await expect(addProductPage.productNameInput).toBeVisible();

    await addProductPage.enterProductName('Office Chair');
    await addProductPage.enterProductDescription('Ergonomic office chair with lumbar support');
    await addProductPage.enterProductPrice('299.99');
    await addProductPage.selectCategory('Furniture', 'Office Furniture');
    await addProductPage.uploadProductImages(['chair_image.bmp']);

    await expect(addProductPage.imageUploadError).toBeVisible();
    await expect(addProductPage.imageUploadError).toContainText(/unsupported format.*JPG, PNG, or JPEG/i);
  });

  test('TC-009: Attempt to upload image with both size and format violations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerDashboard = new SellerDashboardPage(page);
    const addProductPage = new AddProductPage(page);

    await loginPage.navigate();
    await loginPage.login('seller@example.com', 'Test@123');
    await expect(sellerDashboard.dashboardHeader).toBeVisible();

    await sellerDashboard.navigateToAddNewProduct();
    await expect(addProductPage.productNameInput).toBeVisible();

    await addProductPage.enterProductName('Smart Watch');
    await addProductPage.enterProductDescription('Fitness tracking smartwatch');
    await addProductPage.enterProductPrice('199.99');
    await addProductPage.selectCategory('Electronics', 'Wearables');
    await addProductPage.uploadProductImages(['watch_image.tiff']);

    await expect(addProductPage.imageUploadError).toBeVisible();
    await expect(addProductPage.imageUploadError).toContainText(/file size exceeds.*5MB/i);
    await expect(addProductPage.imageUploadError).toContainText(/format.*not supported/i);
    await expect(addProductPage.imageUploadError).toContainText(/JPG, PNG, or JPEG/i);
  });
});