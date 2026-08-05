const { test, expect } = require('../../fixtures');
const ProductPage = require('../../pages/product.page');
const OrderDetailsPage = require('../../pages/order-details.page');
const NotificationUtils = require('../../helpers/notification.utils');
const TD = require('../../data/workday-test-data');

test.describe('@regression QE-3851 TS002 TC-001 - Order Status Notification', () => {
  test('should notify user on order status change', async ({ page }) => {
    const product = new ProductPage(page);
    const orderDetails = new OrderDetailsPage(page);

    await product.placeOrder(TD.products.anyPurchasable);
    expect(await orderDetails.isLoaded()).toBeTruthy();
    await orderDetails.simulateStatusChange(TD.orders.activeOrderId, TD.orders.newStatus);
    expect(await orderDetails.getStatus()).toBe(TD.orders.newStatus);
    const notified = await NotificationUtils.isStatusChangeNotified(TD.users.activeuser, TD.orders.newStatus, TD.notificationChannel);
    expect(notified).toBeTruthy();
  });
});
