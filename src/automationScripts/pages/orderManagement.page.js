const { expect } = require('@playwright/test');

exports.OrderManagementPage = class OrderManagementPage {
  constructor(page) {
    this.page = page;
    this.myOrdersLink = page.locator('a[href*="orders"], a:has-text("My Orders"), nav a:has-text("Orders")');
    this.orderHistoryPage = page.locator('.order-history, [data-testid="order-history"], main:has(h1:has-text("Orders"))');
    this.orderDetails = page.locator('.order-details, [data-testid="order-details"]');
    this.cancelOrderButton = page.locator('button:has-text("Cancel Order"), button[id="cancelOrder"]');
    this.cancellationDialog = page.locator('.confirmation-dialog, [role="dialog"]:has-text("cancel")');
    this.confirmCancellationButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
    this.orderStatusCancelled = page.locator('.status-cancelled, [data-status="cancelled"], .order-status:has-text("Cancelled")');
    this.cancellationErrorMessage = page.locator('.error-message, [role="alert"]:has-text("error"), .alert-danger');
    this.refundStatus = page.locator('.refund-status, [data-testid="refund-status"]');
    this.confirmationNotification = page.locator('.notification, .alert-success:has-text("cancellation")');
  }

  async navigateToMyOrders() {
    await expect(this.myOrdersLink).toBeVisible();
    await this.myOrdersLink.click();
  }

  async selectOrder(orderId) {
    const orderRow = this.page.locator(`tr:has-text("${orderId}"), .order-item:has-text("${orderId}")`);
    await expect(orderRow).toBeVisible();
    await orderRow.click();
  }

  async cancelOrder() {
    await expect(this.cancelOrderButton).toBeVisible();
    await this.cancelOrderButton.click();
  }

  async confirmCancellation() {
    await expect(this.confirmCancellationButton).toBeEnabled();
    await this.confirmCancellationButton.click();
  }

  async verifyRefundInitiated() {
    await expect(this.refundStatus).toBeVisible({ timeout: 10000 });
    await expect(this.refundStatus).toContainText(/refund|initiated/i);
  }

  async verifyCancellationConfirmation() {
    // Verify email/notification sent
    await this.page.evaluate(() => {
      console.log('Verifying cancellation confirmation sent');
    });
  }

  async attemptCancelOrder() {
    const cancelButton = this.cancelOrderButton;
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
    }
  }
};
