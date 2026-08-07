const { expect } = require('@playwright/test');

exports.AdminDashboardPage = class AdminDashboardPage {
  constructor(page) {
    this.page = page;
    this.analyticsSection = page.locator('#analytics, [data-testid="analytics-section"], a:has-text("Analytics")');
    this.performanceMetrics = page.locator('#performance-metrics, [data-testid="performance-metrics"]');
    this.userActivityStats = page.locator('#user-activity, [data-testid="user-activity-stats"]');
    this.transactionVolumes = page.locator('#transaction-volumes, [data-testid="transaction-volumes"]');
    this.authErrorMessage = page.locator('.error-message, .alert-danger, [data-testid="auth-error"]');
    this.dateRangePicker = page.locator('#date-range, [data-testid="date-range-picker"]');
    this.startDateInput = page.locator('#start-date, input[name="startDate"]');
    this.endDateInput = page.locator('#end-date, input[name="endDate"]');
    this.applyDateFilterButton = page.locator('button:has-text("Apply"), #apply-date-filter');
    this.userSegmentDropdown = page.locator('#user-segment, select[name="userSegment"]');
    this.applySegmentFilterButton = page.locator('button:has-text("Apply Filter"), #apply-segment-filter');
    this.filteredData = page.locator('.analytics-data, [data-testid="filtered-analytics"]');
    this.flaggedAccountsList = page.locator('#flagged-accounts, [data-testid="flagged-accounts-list"]');
    this.accountDetailsPanel = page.locator('.account-details, [data-testid="account-details"]');
    this.disableAccountButton = page.locator('button:has-text("Disable Account"), #disable-account');
    this.confirmDisableButton = page.locator('button:has-text("Confirm"), #confirm-disable');
    this.fraudNotification = page.locator('.fraud-alert, [data-testid="fraud-notification"]');
    this.noAlertIndicator = page.locator('.no-alerts, [data-testid="no-alerts"]');
  }

  async navigateToAnalytics() {
    await expect(this.analyticsSection).toBeVisible();
    await this.analyticsSection.click();
  }

  async verifyPerformanceMetrics() {
    await expect(this.performanceMetrics).toBeVisible();
    const metricsText = await this.performanceMetrics.textContent();
    expect(metricsText).toMatch(/page load|response time/i);
  }

  async verifyUserActivityStatistics() {
    await expect(this.userActivityStats).toBeVisible();
    const statsText = await this.userActivityStats.textContent();
    expect(statsText).toMatch(/active users|sessions/i);
  }

  async verifyTransactionVolumes() {
    await expect(this.transactionVolumes).toBeVisible();
    const volumesText = await this.transactionVolumes.textContent();
    expect(volumesText).toMatch(/transactions|revenue/i);
  }

  async attemptDirectAccessToDashboard() {
    await this.page.goto('https://platform.example.com/admin/dashboard');
  }

  async verifyAuthorizationErrorMessage() {
    await expect(this.authErrorMessage).toBeVisible();
  }

  async selectDateRange(startDate, endDate) {
    await expect(this.dateRangePicker).toBeVisible();
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
  }

  async applyDateRangeFilter() {
    await expect(this.applyDateFilterButton).toBeEnabled();
    await this.applyDateFilterButton.click();
  }

  async selectUserSegment(segment) {
    await expect(this.userSegmentDropdown).toBeVisible();
    await this.userSegmentDropdown.selectOption(segment);
  }

  async applyUserSegmentFilter() {
    await expect(this.applySegmentFilterButton).toBeEnabled();
    await this.applySegmentFilterButton.click();
  }

  async verifyFilteredAnalyticsData() {
    await expect(this.filteredData).toBeVisible();
  }

  async navigateToFlaggedAccounts() {
    const flaggedAccountsLink = this.page.locator('a:has-text("Flagged Accounts"), #flagged-accounts-link');
    await expect(flaggedAccountsLink).toBeVisible();
    await flaggedAccountsLink.click();
  }

  async selectFlaggedAccount(accountEmail) {
    const accountRow = this.page.locator(`tr:has-text("${accountEmail}"), [data-account="${accountEmail}"]`);
    await expect(accountRow).toBeVisible();
    await accountRow.click();
  }

  async reviewSuspiciousActivity() {
    await expect(this.accountDetailsPanel).toBeVisible();
  }

  async confirmFraudAndDisableAccount() {
    await expect(this.disableAccountButton).toBeEnabled();
    await this.disableAccountButton.click();
  }

  async confirmPermanentDisable() {
    await expect(this.confirmDisableButton).toBeVisible();
    await this.confirmDisableButton.click();
  }

  async verifyProductListingsRemoved(accountEmail) {
    const productListings = this.page.locator(`[data-seller="${accountEmail}"]`);
    await expect(productListings).toHaveCount(0);
  }

  async verifyBuyersProtectedAndNotified() {
    const notificationIndicator = this.page.locator('.buyer-notification, [data-testid="buyer-protected"]');
    await expect(notificationIndicator).toBeVisible();
  }

  async verifyAdminReceivedFraudNotification(accountEmail) {
    await expect(this.fraudNotification).toBeVisible();
    const notificationText = await this.fraudNotification.textContent();
    expect(notificationText).toContain(accountEmail);
  }

  async verifyNoFalsePositiveAlert(accountEmail) {
    const alertForAccount = this.page.locator(`.fraud-alert:has-text("${accountEmail}")`);
    await expect(alertForAccount).toHaveCount(0);
  }
};
