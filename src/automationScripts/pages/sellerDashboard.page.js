const { expect } = require('@playwright/test');

exports.SellerDashboardPage = class SellerDashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeader = page.locator('h1:has-text("Seller Dashboard"), h1:has-text("Dashboard"), [data-testid="seller-dashboard"]');
    this.addNewProductLink = page.locator('a:has-text("Add New Product"), button:has-text("Add New Product"), [data-testid="add-product-link"]');
  }

  async navigateToAddNewProduct() {
    await expect(this.dashboardHeader).toBeVisible();
    await expect(this.addNewProductLink).toBeVisible();
    await this.addNewProductLink.click();
  }
};