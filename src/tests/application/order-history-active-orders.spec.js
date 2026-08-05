const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const DashboardPage = require('../../pages/dashboard.page');
const OrderHistoryPage = require('../../pages/order-history.page');
const OrderDetailsPage = require('../../pages/order-details.page');
const TD = require('../../data/workday-test-data');

test.describe('@regression QE-3851 TS001 TC-001 - Active Orders', () => {
  test('should display active order details and tracking', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const orderHistory = new OrderHistoryPage(page);
    const orderDetails = new OrderDetailsPage(page);

    await login.login(TD.users.activeuser);
    expect(await dashboard.isLoaded()).toBeTruthy();

    await dashboard.gotoOrderHistory();
    expect(await orderHistory.isLoaded()).toBeTruthy();
    await orderHistory.selectOrder(TD.orders.activeOrderId);
    expect(await orderDetails.isLoaded()).toBeTruthy();
    expect(await orderDetails.getStatus()).toBe(TD.orders.activeOrderStatus);
    expect(await orderDetails.getTrackingInfo()).not.toBeNull();
  });
});
