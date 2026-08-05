const { expect } = require('@playwright/test');

exports.NotificationPage = class NotificationPage {
  constructor(page) {
    this.page = page;
    this.notificationIcon = page.locator('#notification-icon');
    this.orderConfirmation = page.locator('.notification-order-confirmation');
  }
  async open() {
    await this.notificationIcon.click();
  }
  orderConfirmationNotification() {
    return this.orderConfirmation;
  }
};
