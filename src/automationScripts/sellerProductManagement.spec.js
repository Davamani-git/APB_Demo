const { test, expect } = require('@playwright/test');
const { SellerProductPage } = require('./pages/sellerProduct.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Seller Product Management', () => {
  test('TC-1164: Add new product with single image', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerProductPage = new SellerProductPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsSeller('seller@example.com', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await sellerProductPage.navigateToAddNewProduct();
    await expect(sellerProductPage.productForm).toBeVisible();
    
    await sellerProductPage.enterProductName('Wireless Bluetooth Headphones');
    await sellerProductPage.uploadProductImage('product_image.jpg');
    await expect(sellerProductPage.imagePreview).toBeVisible();
    
    await sellerProductPage.enterProductDescription('High-quality wireless headphones with noise cancellation');
    await sellerProductPage.enterProductPrice('99.99');
    await sellerProductPage.submitProduct();
    
    await expect(sellerProductPage.confirmationMessage).toBeVisible();
    await sellerProductPage.verifyCatalogContainsProduct('Wireless Bluetooth Headphones');
  });

  test('TC-1165: Add new product with multiple images and detailed specifications', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerProductPage = new SellerProductPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsSeller('seller@example.com', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await sellerProductPage.navigateToAddNewProduct();
    await expect(sellerProductPage.productForm).toBeVisible();
    
    await sellerProductPage.enterProductName('Smart LED TV 55 inch');
    await sellerProductPage.uploadMultipleProductImages(['tv_front.jpg', 'tv_side.jpg', 'tv_remote.jpg']);
    await expect(sellerProductPage.imagePreview).toBeVisible();
    
    await sellerProductPage.enterProductDescription('55-inch 4K Ultra HD Smart LED TV with HDR, 120Hz refresh rate, 3 HDMI ports, Wi-Fi enabled');
    await sellerProductPage.enterProductPrice('599.99');
    await sellerProductPage.submitProduct();
    
    await expect(sellerProductPage.confirmationMessage).toBeVisible();
    await sellerProductPage.verifyCatalogContainsProductWithImages('Smart LED TV 55 inch', 3);
  });

  test('TC-1166: Validation error when product name is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerProductPage = new SellerProductPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsSeller('seller@example.com', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await sellerProductPage.navigateToAddNewProduct();
    await expect(sellerProductPage.productForm).toBeVisible();
    
    await sellerProductPage.uploadProductImage('product_image.jpg');
    await sellerProductPage.enterProductDescription('Sample product description');
    await sellerProductPage.submitProduct();
    
    await expect(sellerProductPage.validationError).toBeVisible();
    await expect(sellerProductPage.validationError).toContainText(/product name/i);
  });

  test('TC-1167: Validation error when price is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sellerProductPage = new SellerProductPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsSeller('seller@example.com', 'Pass@123');
    await expect(page).toHaveURL(/.*dashboard/);
    
    await sellerProductPage.navigateToAddNewProduct();
    await expect(sellerProductPage.productForm).toBeVisible();
    
    await sellerProductPage.enterProductName('Sample Product');
    await sellerProductPage.uploadProductImage('product_image.jpg');
    await sellerProductPage.enterProductDescription('Sample product description');
    await sellerProductPage.submitProduct();
    
    await expect(sellerProductPage.validationError).toBeVisible();
    await expect(sellerProductPage.validationError).toContainText(/price/i);
  });
});
