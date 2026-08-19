const { expect } = require('@playwright/test');

exports.OrderTrackingPage = class OrderTrackingPage {
  constructor(page) {
    this.page = page;
    this.trackingScreen = page.locator('[data-testid="order-tracking-screen"]');
    this.deliveryPartnerSection = page.locator('[data-testid="delivery-partner-section"]');
    this.partnerName = page.locator('[data-testid="partner-name"]');
    this.partnerPhoto = page.locator('[data-testid="partner-photo"]');
    this.partnerAssignmentPendingMessage = page.locator('[data-testid="partner-assignment-pending"]');
    this.defaultPartnerNamePlaceholder = page.locator('[data-testid="default-partner-name"]');
    this.defaultPartnerPhotoPlaceholder = page.locator('[data-testid="default-partner-photo"]');
    this.liveMap = page.locator('[data-testid="live-map"]');
    this.locationMarker = page.locator('[data-testid="location-marker"]');
    this.routeDisplay = page.locator('[data-testid="route-display"]');
    this.destinationAddress = page.locator('[data-testid="destination-address"]');
    this.locationUnavailableMessage = page.locator('[data-testid="location-unavailable-message"]');
    this.lastKnownStatus = page.locator('[data-testid="last-known-status"]');
    this.orderStatusTimeline = page.locator('[data-testid="order-status-timeline"]');
    this.statusStage = (status) => page.locator(`[data-testid="status-stage-${status.toLowerCase().replace(/\s+/g, '-')}"]`);
  }

  async verifyTrackingScreenOpened() {
    await expect(this.trackingScreen).toBeVisible();
  }

  async verifyDeliveryPartnerName(expectedName) {
    await expect(this.partnerName).toBeVisible();
    await expect(this.partnerName).toHaveText(expectedName);
  }

  async verifyDeliveryPartnerPhoto(expectedPhotoSrc) {
    await expect(this.partnerPhoto).toBeVisible();
    const photoSrc = await this.partnerPhoto.getAttribute('src');
    expect(photoSrc).toContain(expectedPhotoSrc);
  }

  async verifyPartnerAssignmentPendingMessage() {
    await expect(this.partnerAssignmentPendingMessage).toBeVisible();
    const messageText = await this.partnerAssignmentPendingMessage.textContent();
    expect(messageText.toLowerCase()).toMatch(/delivery partner will be assigned soon|partner assignment is pending/);
  }

  async verifyNoDeliveryPartnerInfoDisplayed() {
    await expect(this.partnerName).not.toBeVisible();
    await expect(this.partnerPhoto).not.toBeVisible();
  }

  async verifyDeliveryPartnerPhotoDisplayed() {
    await expect(this.partnerPhoto).toBeVisible();
  }

  async verifyDefaultPartnerNamePlaceholder() {
    await expect(this.defaultPartnerNamePlaceholder).toBeVisible();
    const placeholderText = await this.defaultPartnerNamePlaceholder.textContent();
    expect(placeholderText.toLowerCase()).toMatch(/delivery partner/);
  }

  async verifyDefaultPartnerPhotoPlaceholder() {
    await expect(this.defaultPartnerPhotoPlaceholder).toBeVisible();
  }

  async verifyLiveMapDisplayed() {
    await expect(this.liveMap).toBeVisible();
  }

  async verifyDeliveryPartnerLocationMarker(latitude, longitude) {
    await expect(this.locationMarker).toBeVisible();
    const markerData = await this.locationMarker.getAttribute('data-coordinates');
    expect(markerData).toContain(latitude);
    expect(markerData).toContain(longitude);
  }

  async verifyRouteToDestination(destinationAddress) {
    await expect(this.routeDisplay).toBeVisible();
    await expect(this.destinationAddress).toBeVisible();
    await expect(this.destinationAddress).toHaveText(destinationAddress);
  }

  async verifyNoMapDisplayed() {
    await expect(this.liveMap).not.toBeVisible();
  }

  async verifyNoFalseLocationMarker() {
    const markerCount = await this.locationMarker.count();
    expect(markerCount).toBe(0);
  }

  async verifyLastKnownStatus() {
    await expect(this.lastKnownStatus).toBeVisible();
  }

  async verifyLocationUnavailableMessage() {
    await expect(this.locationUnavailableMessage).toBeVisible();
    const messageText = await this.locationUnavailableMessage.textContent();
    expect(messageText.toLowerCase()).toMatch(/location tracking temporarily unavailable|location unavailable/);
  }

  async verifyOrderStatusTimeline(expectedStatus) {
    await expect(this.orderStatusTimeline).toBeVisible();
    const statusElement = this.statusStage(expectedStatus);
    await expect(statusElement).toBeVisible();
    await expect(statusElement).toHaveClass(/active|current/);
  }

  async verifyLiveMapNotDisplayed() {
    await expect(this.liveMap).not.toBeVisible();
  }

  async verifyNoDeliveryPartnerLocationInfo() {
    const partnerLocationSection = this.page.locator('[data-testid="partner-location-section"]');
    await expect(partnerLocationSection).not.toBeVisible();
  }
};
