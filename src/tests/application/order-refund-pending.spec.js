const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const DashboardPage = require('../../pages/dashboard.page');
const OrderHistoryPage = require('../../pages/order-history.page');
const OrderDetailsPage = require('../../pages/order-details.page');
const NotificationPage = require('../../pages/notification.page');
const TD = require('../../data/workday-test-data');

test.describe('@regression QE-3850 TS002 TC-001 - Refund Pending', () => {
  test('should show refund approval notification and status', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const orderHistory = new OrderHistoryPage(page);
    const orderDetails = new OrderDetailsPage(page);
    const notification = new NotificationPage(page);

    await login.login(TD.users.refundpending);
    expect(await dashboard.isLoaded()).toBeTruthy();
    await dashboard.gotoOrderHistory();
    expect(await orderHistory.isLoaded()).toBeTruthy();
    await orderHistory.selectOrder(TD.orders.pendingRefundOrderId);
    expect(await orderDetails.isLoaded()).toBeTruthy();
    expect(await orderDetails.isRefundApproved()).toBeTruthy();
    await notification.goto();
    expect(await notification.hasRefundApprovalNotification()).toBeTruthy();
  });
});
