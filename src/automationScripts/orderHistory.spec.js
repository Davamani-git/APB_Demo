const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { OrderHistoryPage } = require('./pages/orderHistory.page');
const { OrderDetailsPage } = require('./pages/orderDetails.page');
const logger = require('../utils/logger');

test.describe('Order History and Status', () => {
  test('Test Case - QE-3851 TS001 TC-001: View active order details and tracking', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const orderHistoryPage = new OrderHistoryPage(page);
    const orderDetailsPage = new OrderDetailsPage(page);
    logger.info('Logging in as activeuser');
    await loginPage.login('activeuser', 'password');
    await expect(dashboardPage.dashboardLoaded).toBeVisible();
    logger.info('Navigating to order history');
    await dashboardPage.gotoOrderHistory();
    await expect(orderHistoryPage.historySection).toBeVisible();
    logger.info('Selecting active order');
    await orderHistoryPage.selectOrder('active');
    await expect(orderDetailsPage.detailsSection).toBeVisible();
    logger.info('Verifying order status and tracking');
    await orderDetailsPage.verifyStatusAndTracking();
  });

  test('Test Case - QE-3851 TS003 TC-001: Delivered order is marked as completed', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const orderHistoryPage = new OrderHistoryPage(page);
    const orderDetailsPage = new OrderDetailsPage(page);
    logger.info('Logging in as delivereduser');
    await loginPage.login('delivereduser', 'password');
    await expect(dashboardPage.dashboardLoaded).toBeVisible();
    logger.info('Navigating to order history');
    await dashboardPage.gotoOrderHistory();
    await expect(orderHistoryPage.historySection).toBeVisible();
    logger.info('Selecting delivered order');
    await orderHistoryPage.selectOrder('delivered');
    await expect(orderDetailsPage.detailsSection).toBeVisible();
    logger.info('Verifying delivered order status');
    await orderDetailsPage.expectCompletedStatus();
  });
});
