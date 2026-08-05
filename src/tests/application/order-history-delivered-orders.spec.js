const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const DashboardPage = require('../../pages/dashboard.page');
const OrderHistoryPage = require('../../pages/order-history.page');
const OrderDetailsPage = require('../../pages/order-details.page');
const TD = require('../../data/workday-test-data');

test.describe('@regression QE-3851 TS003 TC-001 - Delivered Orders', () => {
  test('should show delivered order as completed', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const orderHistory = new OrderHistoryPage(page);
    const orderDetails = new OrderDetailsPage(page);

    await login.login(TD.users.delivereduser);
    expect(await dashboard.isLoaded()).toBeTruthy();
    await dashboard.gotoOrderHistory();
    expect(await orderHistory.isLoaded()).toBeTruthy();
    await orderHistory.selectOrder(TD.orders.deliveredOrderId);
    expect(await orderDetails.isLoaded()).toBeTruthy();
    expect(await orderDetails.getStatus()).toBe('completed');
  });
});
