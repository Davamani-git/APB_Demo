const { test, expect } = require('../../fixtures');
const SellerPage = require('../../pages/seller.page');
const ConsumerPage = require('../../pages/consumer.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] Order Status & Notifications', () => {
  test('[QE-1870 TS-001 TC-001] Seller updates order status, consumer receives notification', async ({ page }) => {
    const seller = new SellerPage(page);
    const consumer = new ConsumerPage(page);
    await seller.login(TD.sellerCredentials);
    await seller.changeOrderStatus(TD.orders.orderId54321, TD.orderStatuses.shipped);
    await expect(await seller.isOrderStatusUpdated(TD.orders.orderId54321, TD.orderStatuses.shipped)).toBeTruthy();
    await consumer.login(TD.users.consumer);
    await consumer.gotoNotifications();
    await expect(await consumer.hasReceivedOrderStatusNotification(TD.orders.orderId54321, TD.orderStatuses.shipped)).toBeTruthy();
  });

  test('[QE-1870 TS-002 TC-001] Consumer sees updated order status in order history', async ({ page }) => {
    const consumer = new ConsumerPage(page);
    await consumer.login(TD.users.consumer2);
    await consumer.gotoOrderHistory();
    await expect(await consumer.isOrderStatusVisible(TD.orders.orderId54321, TD.orderStatuses.shipped)).toBeTruthy();
  });
});
