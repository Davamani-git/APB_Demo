const { expect } = require('@playwright/test');

exports.DeviceManagementPage = class DeviceManagementPage {
  constructor(page) {
    this.page = page;
    this.deviceListContainer = page.locator('.device-list-container, #device-list, .devices-panel');
    this.deviceList = page.locator('.device-list, #devices, ul.devices, .device-grid');
    this.deviceItem = page.locator('.device-item, .device-card, [data-testid="device"]');
    this.deviceEnergyMetric = page.locator('.energy-metric, .kwh-display, [data-testid="energy-consumption"]');
    this.deviceCostEstimate = page.locator('.cost-estimate, .device-cost, [data-testid="device-cost"]');
    this.noDevicesMessage = page.locator('.no-devices-message, .empty-state, [data-testid="no-devices"]');
    this.deviceErrorIndicator = page.locator('.device-error, .error-icon, [data-status="error"], .device-unavailable');
    this.paginationControls = page.locator('.pagination, .page-controls, [role="navigation"]');
    this.deviceCount = page.locator('.device-count, #total-devices, [data-testid="device-count"]');
  }

  async navigate() {
    await this.page.goto('/devices');
    await expect(this.deviceListContainer).toBeVisible();
  }

  async waitForDeviceListLoad() {
    await expect(this.deviceList).toBeVisible({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  async verifyDevicesConnected(deviceNames) {
    await expect(this.deviceList).toBeVisible();
    for (const deviceName of deviceNames) {
      const device = this.page.locator(`.device-item:has-text("${deviceName}"), [data-device="${deviceName}"]`);
      await expect(device).toBeVisible();
    }
  }

  async verifyDeviceEnergyMetrics(deviceName) {
    const deviceCard = this.page.locator(`.device-item:has-text("${deviceName}"), .device-card:has-text("${deviceName}")`);
    await expect(deviceCard).toBeVisible();
    
    const energyMetric = deviceCard.locator('.energy-metric, .kwh-display, [data-testid="energy-consumption"]');
    await expect(energyMetric).toBeVisible();
    
    const metricText = await energyMetric.textContent();
    expect(metricText).toMatch(/kWh|kwh/i);
  }

  async verifyCostEstimatesDisplayed() {
    const costElements = await this.deviceCostEstimate.all();
    expect(costElements.length).toBeGreaterThan(0);
    
    for (const costElement of costElements) {
      await expect(costElement).toBeVisible();
      const costText = await costElement.textContent();
      expect(costText).toMatch(/\$|USD|cost/i);
    }
  }

  async verifyDeviceCountGreaterThan(count) {
    await expect(this.deviceList).toBeVisible();
    const devices = await this.deviceItem.all();
    expect(devices.length).toBeGreaterThanOrEqual(count);
  }

  async verifyPaginationOrScrolling() {
    // Check if pagination exists or scrolling is available
    const hasPagination = await this.paginationControls.isVisible().catch(() => false);
    
    if (hasPagination) {
      await expect(this.paginationControls).toBeVisible();
    } else {
      // Verify scrolling is available
      const isScrollable = await this.deviceList.evaluate((el) => {
        return el.scrollHeight > el.clientHeight;
      });
      expect(isScrollable).toBeTruthy();
    }
  }

  async verifyAllDevicesHaveMetrics() {
    const devices = await this.deviceItem.all();
    expect(devices.length).toBeGreaterThan(0);
    
    for (const device of devices) {
      const hasMetric = await device.locator('.energy-metric, .kwh-display').isVisible().catch(() => false);
      expect(hasMetric).toBeTruthy();
    }
  }

  async verifyNoPerformanceDegradation() {
    // Verify page remains responsive
    await expect(this.deviceList).toBeVisible();
    const startTime = Date.now();
    await this.deviceItem.first().click();
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(1000);
  }

  async verifyDeviceCount(expectedCount) {
    const devices = await this.deviceItem.all();
    expect(devices.length).toBe(expectedCount);
  }

  async simulateDeviceConnectivityIssue(deviceName) {
    // Simulate device connectivity issue through test configuration
    await this.page.evaluate((device) => {
      const failedDevices = JSON.parse(window.sessionStorage.getItem('failedDevices') || '[]');
      failedDevices.push(device);
      window.sessionStorage.setItem('failedDevices', JSON.stringify(failedDevices));
    }, deviceName);
  }

  async verifyPartialDataDisplayed(activeDeviceNames) {
    for (const deviceName of activeDeviceNames) {
      const device = this.page.locator(`.device-item:has-text("${deviceName}")`);
      await expect(device).toBeVisible();
      const energyMetric = device.locator('.energy-metric, .kwh-display');
      await expect(energyMetric).toBeVisible();
    }
  }

  async verifyDeviceErrorIndicator(deviceName) {
    const deviceCard = this.page.locator(`.device-item:has-text("${deviceName}"), .device-card:has-text("${deviceName}")`);
    await expect(deviceCard).toBeVisible();
    
    const errorIndicator = deviceCard.locator('.device-error, .error-icon, [data-status="error"], .device-unavailable');
    await expect(errorIndicator).toBeVisible();
  }

  getDeviceStatusMessage(deviceName) {
    const deviceCard = this.page.locator(`.device-item:has-text("${deviceName}"), .device-card:has-text("${deviceName}")`);
    return deviceCard.locator('.status-message, .error-message, [data-testid="device-status"]');
  }

  async verifyIndividualErrorIndicators(failedDeviceNames) {
    for (const deviceName of failedDeviceNames) {
      const deviceCard = this.page.locator(`.device-item:has-text("${deviceName}")`);
      await expect(deviceCard).toBeVisible();
      
      const errorIndicator = deviceCard.locator('.device-error, .error-icon, [data-status="error"]');
      await expect(errorIndicator).toBeVisible();
      
      const statusMessage = await this.getDeviceStatusMessage(deviceName).textContent();
      expect(statusMessage).toMatch(/unavailable|error|offline/i);
    }
  }
};