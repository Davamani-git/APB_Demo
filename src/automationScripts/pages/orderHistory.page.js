const { expect } = require('@playwright/test');

exports.OrderHistoryPage = class OrderHistoryPage {
  constructor(page) {
    this.page = page;
    this.historySection = page.locator('#order-history-section');
    this.orderRows = page.locator('.order-row');
  }
  async selectOrder(type) {
    // type: 'active' | 'delivered'
    let row;
    if (type === 'active') {
      row = this.orderRows.filter({ hasText: 'Active' }).first();
    } else if (type === 'delivered') {
      row = this.orderRows.filter({ hasText: 'Delivered' }).first();
    } else {
      row = this.orderRows.first();
    }
    await expect(row).toBeVisible();
    await row.click();
  }
};
