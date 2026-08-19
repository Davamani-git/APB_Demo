const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.activeOrdersLink = page.locator('[data-testid="active-orders-link"]');
    this.activeOrdersList = page.locator('[data-testid="active-orders-list"]');
    this.orderItem = (orderId) => page.locator(`[data-order-id="${orderId}"]`);
  }

  async navigateToActiveOrders() {
    await expect(this.activeOrdersLink).toBeVisible();
    await this.activeOrdersLink.click();
  }

  async verifyActiveOrdersListDisplayed() {
    await expect(this.activeOrdersList).toBeVisible();
  }

  async selectOrderById(orderId) {
    const order = this.orderItem(orderId);
    await expect(order).toBeVisible();
    await order.click();
  }
};
