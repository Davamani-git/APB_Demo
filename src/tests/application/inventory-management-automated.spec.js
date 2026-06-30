const { test, expect } = require('../../fixtures');
const InventoryPage = require('../../pages/inventory.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] QE-1585: Inventory Management', { tag: ['@regression', '@e2e'] }, () => {
  let inventory;

  test.beforeEach(async ({ page }) => {
    inventory = new InventoryPage(page);
    await inventory.login(TD.seller.username, TD.seller.password);
  });

  test('[QE-1585 TS001 TC-001] Inventory deduction on order', async ({ page }) => {
    const initialCount = await inventory.getInventoryCount(TD.products.productX);
    expect(initialCount).toBe(TD.products.productXInitialStock);
    await inventory.placeOrder(TD.products.productX, 3);
    await expect(inventory.orderConfirmation).toBeVisible();
    const updatedCount = await inventory.getInventoryCount(TD.products.productX);
    expect(updatedCount).toBe(initialCount - 3);
  });

  test('[QE-1585 TS002 TC-001] Restock notification on low inventory', async ({ page }) => {
    await inventory.setInventory(TD.products.productY, TD.products.productYThreshold);
    await inventory.placeOrder(TD.products.productY, 1);
    const count = await inventory.getInventoryCount(TD.products.productY);
    expect(count).toBeLessThan(TD.products.productYThreshold);
    await expect(inventory.restockNotification(TD.products.productY)).toBeVisible();
  });

  test('[QE-1585 TS003 TC-001] Update and verify inventory in catalog', async ({ page }) => {
    await inventory.updateInventory(TD.products.productZ, 20);
    await expect(inventory.successMessage).toHaveText(TD.inventory.updateSuccess);
    await inventory.gotoCatalog();
    await expect(inventory.catalogPage).toBeVisible();
    await expect(inventory.getCatalogInventoryCount(TD.products.productZ)).toHaveText('20');
  });
});
