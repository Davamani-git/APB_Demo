const { test, expect } = require('@playwright/test');
const { ShoppingCartPage } = require('./pages/shoppingCart.page');
const { ProductSearchPage } = require('./pages/productSearch.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Shopping Cart Management', () => {
  test('TC-1180: Add multiple products to cart with specified quantities', async ({ page }) => {
    const productSearchPage = new ProductSearchPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    
    await productSearchPage.navigate();
    await expect(page).toHaveURL(/.*shop.example.com/);
    
    await shoppingCartPage.searchAndAddProduct('Wireless Mouse', 2);
    await shoppingCartPage.searchAndAddProduct('USB Cable', 5);
    
    await shoppingCartPage.navigateToCart();
    await expect(shoppingCartPage.cartItems).toBeVisible();
    
    await shoppingCartPage.verifyCartContainsProduct('Wireless Mouse', 2);
    await shoppingCartPage.verifyCartContainsProduct('USB Cable', 5);
    await shoppingCartPage.verifyCartTotalIsCorrect();
  });

  test('TC-1181: Update quantity of existing cart item', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsConsumer('user@example.com', 'User@123');
    await expect(page).toHaveURL(/.*home/);
    
    await shoppingCartPage.addProductToCart('Keyboard', 1);
    await shoppingCartPage.navigateToCart();
    await expect(shoppingCartPage.cartItems).toBeVisible();
    
    await shoppingCartPage.updateProductQuantity('Keyboard', 3);
    await shoppingCartPage.verifyCartItemSubtotal('Keyboard', 150);
    await shoppingCartPage.verifyCartTotalIsCorrect();
  });

  test('TC-1182: Cannot add product with zero quantity', async ({ page }) => {
    const productSearchPage = new ProductSearchPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    
    await productSearchPage.navigate();
    await expect(page).toHaveURL(/.*shop.example.com/);
    
    await productSearchPage.enterSearchKeyword('Laptop Bag');
    await productSearchPage.clickSearch();
    await expect(productSearchPage.searchResults).toBeVisible();
    
    await shoppingCartPage.selectProduct('Laptop Bag');
    await expect(shoppingCartPage.productDetailsPage).toBeVisible();
    
    await shoppingCartPage.setQuantity(0);
    await shoppingCartPage.clickAddToCart();
    
    await expect(shoppingCartPage.validationError).toBeVisible();
  });

  test('TC-1183: Cannot add product with negative quantity', async ({ page }) => {
    const productSearchPage = new ProductSearchPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    
    await productSearchPage.navigate();
    await expect(page).toHaveURL(/.*shop.example.com/);
    
    await productSearchPage.enterSearchKeyword('Phone Case');
    await productSearchPage.clickSearch();
    await expect(productSearchPage.searchResults).toBeVisible();
    
    await shoppingCartPage.selectProduct('Phone Case');
    await expect(shoppingCartPage.productDetailsPage).toBeVisible();
    
    await shoppingCartPage.setQuantity(-3);
    await shoppingCartPage.clickAddToCart();
    
    await expect(shoppingCartPage.validationError).toBeVisible();
  });
});
