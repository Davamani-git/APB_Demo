const { expect } = require('@playwright/test');

exports.OrderDetailsPage = class OrderDetailsPage {
  constructor(page) {
    this.page = page;
    this.detailsSection = page.locator('#order-details-section');
    this.statusLabel = page.locator('.order-status');
    this.trackingInfo = page.locator('.order-tracking');
    this.completedStatus = page.locator('.status-completed');
    this.refundButton = page.locator('#initiate-refund');
    this.refundInitiatedBanner = page.locator('.refund-initiated');
    this.refundApprovedNotification = page.locator('.refund-approved');
    this.refundStatusUpdated = page.locator('.refund-status-updated');
    this.refundDeniedBanner = page.locator('.refund-denied');
  }
  async verifyStatusAndTracking() {
    await expect(this.statusLabel).toBeVisible();
    await expect(this.trackingInfo).toBeVisible();
  }
  async expectCompletedStatus() {
    await expect(this.completedStatus).toBeVisible();
  }
  async initiateRefund() {
    await expect(this.refundButton).toBeVisible();
    await this.refundButton.click();
  }
};
