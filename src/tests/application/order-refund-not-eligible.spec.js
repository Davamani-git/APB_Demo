const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const DashboardPage = require('../../pages/dashboard.page');
const OrderHistoryPage = require('../../pages/order-history.page');
const OrderDetailsPage = require('../../pages/order-details.page');
const TD = require('../../data/workday-test-data');

test.describe('@regression QE-3850 TS003 TC-001 - Refund Not Eligible', () => {
  test('should deny refund request for non-eligible order', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const orderHistory = new OrderHistoryPage(page);
    const orderDetails = new OrderDetailsPage(page);

    await login.login(TD.users.refundnoteligible);
    expect(await dashboard.isLoaded()).toBeTruthy();
    await dashboard.gotoOrderHistory();
    expect(await orderHistory.isLoaded()).toBeTruthy();
    await orderHistory.selectOrder(TD.orders.notEligibleRefundOrderId);
    expect(await orderDetails.isLoaded()).toBeTruthy();
    const denied = await orderDetails.attemptRefund();
    expect(denied).toBeFalsy();
    expect(await orderDetails.getRefundDenialReason()).not.toBeNull();
  });
});
