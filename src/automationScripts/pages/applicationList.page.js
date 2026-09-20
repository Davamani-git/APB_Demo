const { expect } = require('@playwright/test');

exports.ApplicationListPage = class ApplicationListPage {
  constructor(page) {
    this.page = page;
    this.applicationsMenuLink = page.locator('a[href*="/applications"], nav a:has-text("Applications")');
    this.applicationCards = page.locator('.application-card, [data-testid="application-card"]');
    this.sortDropdown = page.locator('select[name="sortBy"], select:has-text("Sort")');
    this.noDataMessage = page.locator('.no-data, .empty-state, :has-text("No applications found")');
  }

  async navigateToApplicationsList() {
    await expect(this.applicationsMenuLink).toBeVisible();
    await this.applicationsMenuLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyApplicationExists(applicationId) {
    const appCard = this.page.locator(`.application-card:has-text("${applicationId}")`);
    await expect(appCard).toBeVisible();
  }

  async verifyApplicationStatus(applicationId, expectedStatus) {
    const appCard = this.page.locator(`.application-card:has-text("${applicationId}")`);
    await expect(appCard).toBeVisible();
    const statusBadge = appCard.locator('.status-badge, [data-testid="status-badge"]');
    await expect(statusBadge).toContainText(expectedStatus);
  }

  async verifyOverallStatus(applicationId, expectedStatus) {
    const appCard = this.page.locator(`.application-card:has-text("${applicationId}")`);
    await expect(appCard).toBeVisible();
    const overallStatus = appCard.locator('.overall-status, [data-testid="overall-status"]');
    await expect(overallStatus).toContainText(expectedStatus);
  }

  async verifyApplicationWithProvider(applicationId, providerName) {
    const appCard = this.page.locator(`.application-card:has-text("${applicationId}")`);
    await expect(appCard).toBeVisible();
    await expect(appCard).toContainText(providerName);
  }

  async verifyPayerStatus(applicationId, payerName, expectedStatus) {
    const appCard = this.page.locator(`.application-card:has-text("${applicationId}")`);
    await expect(appCard).toBeVisible();
    const payerSection = appCard.locator(`.payer-badge:has-text("${payerName}"), [data-testid="payer-status"]:has-text("${payerName}")`);
    await expect(payerSection).toContainText(expectedStatus);
  }

  async selectSortOption(sortOption) {
    await expect(this.sortDropdown).toBeVisible();
    await this.sortDropdown.selectOption(sortOption);
    await this.page.waitForLoadState('networkidle');
  }

  async getApplicationOrder() {
    await this.page.waitForSelector('.application-card');
    const cards = await this.applicationCards.all();
    const order = [];
    for (const card of cards) {
      const text = await card.textContent();
      const match = text.match(/APP-\d+/);
      if (match) {
        order.push(match[0]);
      }
    }
    return order;
  }

  async verifyPriorityScore(applicationId, expectedScore) {
    const appCard = this.page.locator(`.application-card:has-text("${applicationId}")`);
    await expect(appCard).toBeVisible();
    const priorityScore = appCard.locator('.priority-score, [data-testid="priority-score"]');
    await expect(priorityScore).toContainText(expectedScore);
  }

  async verifyRiskScore(applicationId, expectedScore) {
    const appCard = this.page.locator(`.application-card:has-text("${applicationId}")`);
    await expect(appCard).toBeVisible();
    const riskScore = appCard.locator('.risk-score, [data-testid="risk-score"]');
    await expect(riskScore).toContainText(expectedScore);
  }
};
