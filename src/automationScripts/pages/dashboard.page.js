const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    this.overviewSection = page.locator('[data-testid="dashboard-overview"]');
    this.totalCreditLimit = page.locator('[data-testid="overview-total-credit-limit"]');
    this.totalOutstanding = page.locator('[data-testid="overview-total-outstanding"]');
    this.totalAvailable = page.locator('[data-testid="overview-total-available"]');
    this.monthlySpend = page.locator('[data-testid="overview-monthly-spend"]');
    this.cardsListNav = page.locator('[data-testid="nav-cards-list"]');
  }
  async assertDashboardLoaded() {
    await expect(this.dashboardContainer).toBeVisible();
    logger.info('Dashboard loaded');
  }
  async assertOverviewSection() {
    await expect(this.overviewSection).toBeVisible();
    await expect(this.totalCreditLimit).toBeVisible();
    await expect(this.totalOutstanding).toBeVisible();
    await expect(this.totalAvailable).toBeVisible();
    await expect(this.monthlySpend).toBeVisible();
    logger.info('Dashboard overview section validated');
  }
  async gotoCardsList() {
    await this.cardsListNav.click();
    logger.info('Navigated to cards list section');
  }
};
