const { expect } = require('@playwright/test');

exports.ExtractionPage = class ExtractionPage {
  constructor(page) {
    this.page = page;
    this.scheduleLabel = page.locator('#jobSchedule');
    this.sourcesStatus = page.locator('.source-status');
    this.jobStatus = page.locator('.job-status');
    this.logMetrics = page.locator('.extraction-log');
    this.deltaLog = page.locator('.delta-log');
    this.adminAlert = page.locator('.admin-alert');
  }
  async ensureJobScheduled(time) {
    await expect(this.scheduleLabel).toContainText(time);
  }
  async assertSourcesOnline() {
    await expect(this.sourcesStatus).toContainText('Online');
  }
  async waitForJobStart() {
    await expect(this.jobStatus).toContainText('Started', { timeout: 120000 });
  }
  async assertJobStarted() {
    await expect(this.jobStatus).toContainText('Started');
  }
  async verifyExtractionOfModifiedRecords() {
    await expect(this.logMetrics).toContainText('Records extracted');
    await expect(this.logMetrics).toContainText('Modified');
  }
  async verifyExtractionLogMetrics() {
    await expect(this.logMetrics).toContainText('Source');
    await expect(this.logMetrics).toContainText('Duration');
  }
  async completeInitialExtraction() {
    await expect(this.jobStatus).toContainText('Completed');
  }
  async assertInitialExtractionSuccess() {
    await expect(this.logMetrics).toContainText('Initial extraction completed');
  }
  async modifySourceRecords() {
    // Simulate modification (stub for actual DB interaction)
    await expect(this.sourcesStatus).toContainText('Modified');
  }
  async assertRecordsModified() {
    await expect(this.sourcesStatus).toContainText('Modified');
  }
  async triggerNextExtraction() {
    await expect(this.jobStatus).toContainText('Started');
  }
  async assertOnlyNewOrModifiedRecordsExtracted() {
    await expect(this.deltaLog).toContainText('New/Modified');
  }
  async verifyDeltaLogAuditTrail() {
    await expect(this.deltaLog).toBeVisible();
  }
  async simulateSourceTimeout() {
    await expect(this.jobStatus).toContainText('Timeout');
  }
  async assertTimeoutDetected() {
    await expect(this.jobStatus).toContainText('Timeout');
  }
  async monitorRetryBehavior() {
    await expect(this.jobStatus).toContainText('Retry');
  }
  async assertRetryLogic(retries) {
    await expect(this.jobStatus).toContainText(`Retry ${retries}`);
  }
  async assertAdminAlertSent() {
    await expect(this.adminAlert).toBeVisible();
    await expect(this.adminAlert).toContainText('Alert sent');
  }
  async assertJobStatusFailedWithRetryExhausted() {
    await expect(this.jobStatus).toContainText('Failed with Retry Exhausted');
  }
};