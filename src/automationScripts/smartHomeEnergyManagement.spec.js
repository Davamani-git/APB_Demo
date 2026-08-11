const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { DeviceManagementPage } = require('./pages/deviceManagement.page');

test.describe('Smart Home Energy Management System - Real-time Energy Monitoring', () => {
  test('TC-001: QE-4239 TS-001 TC-001 - Dashboard loads with real-time energy consumption data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.navigate();
    await expect(page).toHaveURL(/.*shems.example.com.*/);

    // Step 2: Login with valid credentials
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Step 3: Navigate to dashboard and select daily view
    await dashboardPage.selectView('Daily');
    await expect(dashboardPage.viewSelector).toHaveText(/Daily/);

    // Step 4: Verify dashboard loads within 2 seconds with real-time data
    const startTime = Date.now();
    await dashboardPage.waitForDashboardLoad();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    await expect(dashboardPage.energyChart).toBeVisible();
    await dashboardPage.verifyRealTimeDataDisplayed();
  });

  test('TC-002: QE-4239 TS-002 TC-001 - Energy consumption data across multiple timeframes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Step 2: Select daily view
    await dashboardPage.selectView('Daily');
    await expect(dashboardPage.viewSelector).toHaveText(/Daily/);
    await dashboardPage.verifyEnergyDataDisplayed();
    await dashboardPage.verifyCostCalculationsDisplayed();

    // Step 3: Switch to weekly view
    await dashboardPage.selectView('Weekly');
    await expect(dashboardPage.viewSelector).toHaveText(/Weekly/);
    await dashboardPage.verifyEnergyDataDisplayed();
    await dashboardPage.verifyCostCalculationsDisplayed();

    // Step 4: Switch to monthly view
    await dashboardPage.selectView('Monthly');
    await expect(dashboardPage.viewSelector).toHaveText(/Monthly/);
    await dashboardPage.verifyEnergyDataDisplayed();
    await dashboardPage.verifyCostCalculationsDisplayed();

    // Step 5: Verify data accuracy across all timeframes
    await dashboardPage.verifyDataConsistencyAcrossTimeframes();
  });

  test('TC-003: QE-4239 TS-002 TC-002 - Cost calculations accuracy across timeframes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Step 2: Navigate to daily view and note total cost
    await dashboardPage.selectView('Daily');
    const dailyCost = await dashboardPage.getTotalCost();
    await expect(dashboardPage.costDisplay).toBeVisible();

    // Step 3: Switch to weekly view and verify cost aggregation
    await dashboardPage.selectView('Weekly');
    const weeklyCost = await dashboardPage.getTotalCost();
    await expect(dashboardPage.costDisplay).toBeVisible();
    await dashboardPage.verifyCostAggregation('Weekly');

    // Step 4: Switch to monthly view and verify cost aggregation
    await dashboardPage.selectView('Monthly');
    const monthlyCost = await dashboardPage.getTotalCost();
    await expect(dashboardPage.costDisplay).toBeVisible();
    await dashboardPage.verifyCostAggregation('Monthly');
  });

  test('TC-004: QE-4239 TS-003 TC-001 - Smart meter offline error handling', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Step 2: Simulate smart meter connection failure
    await dashboardPage.simulateSmartMeterStatus('Offline');

    // Step 3: Navigate to dashboard
    await dashboardPage.navigate();
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText(/temporarily unavailable/);

    // Step 4: Verify last known data timestamp is displayed
    await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
    await dashboardPage.verifyTimestampFormat();
  });

  test('TC-005: QE-4239 TS-003 TC-002 - Intermittent data transmission failures', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Step 2: Simulate intermittent transmission failures
    await dashboardPage.simulateSmartMeterStatus('Connected with transmission errors');

    // Step 3: Attempt to access dashboard
    await dashboardPage.navigate();
    await expect(dashboardPage.errorMessage).toBeVisible();
    await expect(dashboardPage.errorMessage).toContainText(/temporarily unavailable/);
    await expect(dashboardPage.errorMessage).toContainText(/transmission/);

    // Step 4: Verify last known data and timestamp
    await expect(dashboardPage.lastUpdatedTimestamp).toBeVisible();
    await dashboardPage.verifyLastKnownDataDisplayed();
  });
});

test.describe('Smart Home Energy Management System - Device-Level Consumption Tracking', () => {
  test('TC-006: QE-4238 TS-001 TC-001 - View device-level energy consumption with multiple devices', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const deviceManagementPage = new DeviceManagementPage(page);

    // Step 1: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Step 2: Ensure multiple devices are connected
    await deviceManagementPage.verifyDevicesConnected(['Smart Thermostat', 'Smart Refrigerator', 'Smart Washer']);

    // Step 3: Navigate to device management interface
    await deviceManagementPage.navigate();
    await expect(deviceManagementPage.deviceListContainer).toBeVisible();

    // Step 4: View complete list of connected devices
    await deviceManagementPage.waitForDeviceListLoad();
    await expect(deviceManagementPage.deviceList).toBeVisible();

    // Step 5: Verify individual energy consumption metrics
    await deviceManagementPage.verifyDeviceEnergyMetrics('Smart Thermostat');
    await deviceManagementPage.verifyDeviceEnergyMetrics('Smart Refrigerator');
    await deviceManagementPage.verifyDeviceEnergyMetrics('Smart Washer');
    await deviceManagementPage.verifyCostEstimatesDisplayed();
  });

  test('TC-007: QE-4238 TS-001 TC-002 - View device-level consumption with 100+ devices', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const deviceManagementPage = new DeviceManagementPage(page);

    // Step 1: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Step 2: Ensure 100+ devices are connected
    await deviceManagementPage.verifyDeviceCountGreaterThan(100);

    // Step 3: Navigate to device management interface
    const startTime = Date.now();
    await deviceManagementPage.navigate();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    await expect(deviceManagementPage.deviceListContainer).toBeVisible();

    // Step 4: View complete list of all devices
    await deviceManagementPage.waitForDeviceListLoad();
    await expect(deviceManagementPage.deviceList).toBeVisible();
    await deviceManagementPage.verifyPaginationOrScrolling();

    // Step 5: Verify metrics for all devices
    await deviceManagementPage.verifyAllDevicesHaveMetrics();
    await deviceManagementPage.verifyNoPerformanceDegradation();
  });

  test('TC-008: QE-4238 TS-002 TC-001 - No devices connected scenario', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const deviceManagementPage = new DeviceManagementPage(page);

    // Step 1: Launch and login with new user
    await loginPage.navigate();
    await loginPage.login('newuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Step 2: Ensure no devices are connected
    await deviceManagementPage.verifyDeviceCount(0);

    // Step 3: Navigate to device management interface
    await deviceManagementPage.navigate();
    await expect(deviceManagementPage.deviceListContainer).toBeVisible();

    // Step 4: Verify appropriate message is displayed
    await expect(deviceManagementPage.noDevicesMessage).toBeVisible();
    await expect(deviceManagementPage.noDevicesMessage).toContainText(/No devices connected/);
    await expect(deviceManagementPage.noDevicesMessage).toContainText(/Please add devices to start tracking energy consumption/);
  });

  test('TC-009: QE-4238 TS-003 TC-001 - Partial device connectivity with single device failure', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const deviceManagementPage = new DeviceManagementPage(page);

    // Step 1: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Step 2: Ensure devices with connectivity issues
    await deviceManagementPage.simulateDeviceConnectivityIssue('Smart Washer');
    await deviceManagementPage.verifyDevicesConnected(['Smart Thermostat', 'Smart Refrigerator']);

    // Step 3: Navigate to device management interface
    await deviceManagementPage.navigate();
    await expect(deviceManagementPage.deviceListContainer).toBeVisible();

    // Step 4: View device list and consumption data
    await deviceManagementPage.waitForDeviceListLoad();
    await deviceManagementPage.verifyPartialDataDisplayed(['Smart Thermostat', 'Smart Refrigerator']);

    // Step 5: Verify error indicators for failed devices
    await deviceManagementPage.verifyDeviceErrorIndicator('Smart Washer');
    await expect(deviceManagementPage.getDeviceStatusMessage('Smart Washer')).toContainText(/Device unavailable|Connection error/);
  });

  test('TC-010: QE-4238 TS-003 TC-002 - Multiple simultaneous device connectivity failures', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const deviceManagementPage = new DeviceManagementPage(page);

    // Step 1: Launch and login
    await loginPage.navigate();
    await loginPage.login('testuser@example.com', 'Test@123');
    await expect(page).toHaveURL(/.*dashboard.*/);

    // Step 2: Simulate multiple device failures
    await deviceManagementPage.simulateDeviceConnectivityIssue('Smart Refrigerator');
    await deviceManagementPage.simulateDeviceConnectivityIssue('Smart Washer');
    await deviceManagementPage.simulateDeviceConnectivityIssue('Smart Dryer');
    await deviceManagementPage.verifyDevicesConnected(['Smart Thermostat']);

    // Step 3: Navigate to device management interface
    await deviceManagementPage.navigate();
    await expect(deviceManagementPage.deviceListContainer).toBeVisible();

    // Step 4: View device list and verify partial data
    await deviceManagementPage.waitForDeviceListLoad();
    await deviceManagementPage.verifyPartialDataDisplayed(['Smart Thermostat']);

    // Step 5: Verify each failed device has error indicator
    await deviceManagementPage.verifyDeviceErrorIndicator('Smart Refrigerator');
    await deviceManagementPage.verifyDeviceErrorIndicator('Smart Washer');
    await deviceManagementPage.verifyDeviceErrorIndicator('Smart Dryer');
    await deviceManagementPage.verifyIndividualErrorIndicators(['Smart Refrigerator', 'Smart Washer', 'Smart Dryer']);
  });
});