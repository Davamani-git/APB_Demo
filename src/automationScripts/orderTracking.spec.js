const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { OrderTrackingPage } = require('./pages/orderTracking.page');

test.describe('Food Delivery Order Tracking Tests', () => {

  test('TC-1615: Verify delivery partner information is displayed for picked up order', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const orderTrackingPage = new OrderTrackingPage(page);

    await loginPage.navigate();
    await loginPage.login('testcustomer@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    await dashboardPage.navigateToActiveOrders();
    await dashboardPage.verifyActiveOrdersListDisplayed();
    
    await dashboardPage.selectOrderById('ORD-12345');
    await orderTrackingPage.verifyTrackingScreenOpened();
    
    await orderTrackingPage.verifyDeliveryPartnerName('John Doe');
    await orderTrackingPage.verifyDeliveryPartnerPhoto('partner_photo.jpg');
  });

  test('TC-1616: Verify pending partner assignment message for confirmed order', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const orderTrackingPage = new OrderTrackingPage(page);

    await loginPage.navigate();
    await loginPage.login('testcustomer@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    await dashboardPage.navigateToActiveOrders();
    await dashboardPage.verifyActiveOrdersListDisplayed();
    
    await dashboardPage.selectOrderById('ORD-12346');
    await orderTrackingPage.verifyTrackingScreenOpened();
    
    await orderTrackingPage.verifyPartnerAssignmentPendingMessage();
    await orderTrackingPage.verifyNoDeliveryPartnerInfoDisplayed();
  });

  test('TC-1617: Verify delivery partner info with incomplete profile - name unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const orderTrackingPage = new OrderTrackingPage(page);

    await loginPage.navigate();
    await loginPage.login('testcustomer@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    await dashboardPage.navigateToActiveOrders();
    await dashboardPage.verifyActiveOrdersListDisplayed();
    
    await dashboardPage.selectOrderById('ORD-12347');
    await orderTrackingPage.verifyTrackingScreenOpened();
    
    await orderTrackingPage.verifyDeliveryPartnerPhotoDisplayed();
    await orderTrackingPage.verifyDefaultPartnerNamePlaceholder();
  });

  test('TC-1618: Verify delivery partner info with incomplete profile - photo unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const orderTrackingPage = new OrderTrackingPage(page);

    await loginPage.navigate();
    await loginPage.login('testcustomer@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    await dashboardPage.navigateToActiveOrders();
    await dashboardPage.verifyActiveOrdersListDisplayed();
    
    await dashboardPage.selectOrderById('ORD-12348');
    await orderTrackingPage.verifyTrackingScreenOpened();
    
    await orderTrackingPage.verifyDeliveryPartnerName('Jane Smith');
    await orderTrackingPage.verifyDefaultPartnerPhotoPlaceholder();
  });

  test('TC-1619: Verify delivery partner info with no profile information available', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const orderTrackingPage = new OrderTrackingPage(page);

    await loginPage.navigate();
    await loginPage.login('testcustomer@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    await dashboardPage.navigateToActiveOrders();
    await dashboardPage.verifyActiveOrdersListDisplayed();
    
    await dashboardPage.selectOrderById('ORD-12349');
    await orderTrackingPage.verifyTrackingScreenOpened();
    
    await orderTrackingPage.verifyDefaultPartnerPhotoPlaceholder();
    await orderTrackingPage.verifyDefaultPartnerNamePlaceholder();
  });

  test('TC-1620: Verify live map display with real-time progress for picked up order', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const orderTrackingPage = new OrderTrackingPage(page);

    await loginPage.navigate();
    await loginPage.login('testcustomer@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    await dashboardPage.navigateToActiveOrders();
    await dashboardPage.verifyActiveOrdersListDisplayed();
    
    await dashboardPage.selectOrderById('ORD-12350');
    await orderTrackingPage.verifyTrackingScreenOpened();
    
    await orderTrackingPage.verifyLiveMapDisplayed();
    await orderTrackingPage.verifyDeliveryPartnerLocationMarker('37.7749', '-122.4194');
    await orderTrackingPage.verifyRouteToDestination('123 Main St, San Francisco, CA');
  });

  test('TC-1621: Verify tracking screen when location data is unavailable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const orderTrackingPage = new OrderTrackingPage(page);

    await loginPage.navigate();
    await loginPage.login('testcustomer@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    await dashboardPage.navigateToActiveOrders();
    await dashboardPage.verifyActiveOrdersListDisplayed();
    
    await dashboardPage.selectOrderById('ORD-12351');
    await orderTrackingPage.verifyTrackingScreenOpened();
    
    await orderTrackingPage.verifyNoMapDisplayed();
    await orderTrackingPage.verifyNoFalseLocationMarker();
    await orderTrackingPage.verifyLastKnownStatus();
    await orderTrackingPage.verifyLocationUnavailableMessage();
  });

  test('TC-1622: Verify tracking screen for order in Preparing status', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const orderTrackingPage = new OrderTrackingPage(page);

    await loginPage.navigate();
    await loginPage.login('testcustomer@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    await dashboardPage.navigateToActiveOrders();
    await dashboardPage.verifyActiveOrdersListDisplayed();
    
    await dashboardPage.selectOrderById('ORD-12352');
    await orderTrackingPage.verifyTrackingScreenOpened();
    
    await orderTrackingPage.verifyOrderStatusTimeline('Preparing');
    await orderTrackingPage.verifyLiveMapNotDisplayed();
    await orderTrackingPage.verifyNoDeliveryPartnerLocationInfo();
  });

  test('TC-1623: Verify tracking screen for order in Ready for pickup status', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const orderTrackingPage = new OrderTrackingPage(page);

    await loginPage.navigate();
    await loginPage.login('testcustomer@example.com', 'Test@123');
    await expect(page).toHaveURL(/dashboard/);
    
    await dashboardPage.navigateToActiveOrders();
    await dashboardPage.verifyActiveOrdersListDisplayed();
    
    await dashboardPage.selectOrderById('ORD-12353');
    await orderTrackingPage.verifyTrackingScreenOpened();
    
    await orderTrackingPage.verifyOrderStatusTimeline('Ready for pickup');
    await orderTrackingPage.verifyLiveMapNotDisplayed();
    await orderTrackingPage.verifyNoDeliveryPartnerLocationInfo();
  });

});
