const { test, expect } = require('../../fixtures');
const OrderPage = require('../../pages/order.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] QE-1583: Order Placement', { tag: ['@regression', '@e2e'] }, () => {
  let order;

  test.beforeEach(async ({ page }) => {
    order = new OrderPage(page);
    await order.login(TD.consumer.username, TD.consumer.password);
  });

  test('[QE-1583 TS001 TC-001] Place order and verify status', async ({ page }) => {
    await order.placeOrder(TD.products.productC, 1);
    await expect(order.orderSuccessMessage).toHaveText(TD.order.placementSuccess);
    await order.gotoOrdersPage();
    await expect(order.ordersPage).toBeVisible();
    await expect(order.getOrderStatus(TD.products.productC)).toHaveText(TD.order.statusPlaced);
    await expect(order.getOrderDeliveryDate(TD.products.productC)).toHaveText(TD.order.estimatedDeliveryDate);
  });
});
