const { test, expect } = require('@playwright/test');
const { OrderManagementPage } = require('./pages/orderManagement.page');
const { LoginPage } = require('./pages/login.page');

test.describe('Order Cancellation', () => {
  test('TC-1174: Cancel paid order within cancellation timeframe', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const orderManagementPage = new OrderManagementPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsConsumer('user@example.com', 'User@123');
    await expect(page).toHaveURL(/.*home/);
    
    await orderManagementPage.navigateToMyOrders();
    await expect(orderManagementPage.orderHistoryPage).toBeVisible();
    
    await orderManagementPage.selectOrder('ORD12345');
    await expect(orderManagementPage.orderDetails).toBeVisible();
    
    await orderManagementPage.cancelOrder();
    await expect(orderManagementPage.cancellationDialog).toBeVisible();
    
    await orderManagementPage.confirmCancellation();
    await expect(orderManagementPage.orderStatusCancelled).toBeVisible();
    
    await orderManagementPage.verifyRefundInitiated();
    await orderManagementPage.verifyCancellationConfirmation();
  });

  test('TC-1175: Cannot cancel order that has been shipped', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const orderManagementPage = new OrderManagementPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsConsumer('user@example.com', 'User@123');
    await expect(page).toHaveURL(/.*home/);
    
    await orderManagementPage.navigateToMyOrders();
    await expect(orderManagementPage.orderHistoryPage).toBeVisible();
    
    await orderManagementPage.selectOrder('ORD67890');
    await expect(orderManagementPage.orderDetails).toBeVisible();
    
    await orderManagementPage.cancelOrder();
    await expect(orderManagementPage.cancellationErrorMessage).toBeVisible();
    await expect(orderManagementPage.cancellationErrorMessage).toContainText(/cannot be cancelled|already shipped/i);
  });

  test('TC-1176: Cannot cancel already cancelled order', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const orderManagementPage = new OrderManagementPage(page);
    
    await loginPage.navigate();
    await loginPage.loginAsConsumer('user@example.com', 'User@123');
    await expect(page).toHaveURL(/.*home/);
    
    await orderManagementPage.navigateToMyOrders();
    await expect(orderManagementPage.orderHistoryPage).toBeVisible();
    
    await orderManagementPage.selectOrder('ORD11111');
    await expect(orderManagementPage.orderDetails).toBeVisible();
    
    await orderManagementPage.attemptCancelOrder();
    await expect(orderManagementPage.cancellationErrorMessage).toBeVisible();
    await expect(orderManagementPage.cancellationErrorMessage).toContainText(/already cancelled/i);
  });
});
