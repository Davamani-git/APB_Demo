const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ManagerDashboardPage = class ManagerDashboardPage {
  constructor(page) {
    this.page = page;
    this.managerDashboardTab = page.locator('.nav-tab[data-view="manager-dashboard"]');
    this.dashboardHeading = page.locator('h2:has-text("Manager Pipeline Dashboard")');
    this.totalApplicationsCard = page.locator('.dashboard-card:has-text("Total Applications")');
    this.readyToSubmitCard = page.locator('.dashboard-card:has-text("Ready to Submit")');
    this.incompleteCard = page.locator('.dashboard-card:has-text("Incomplete")');
    this.expiringSoonCard = page.locator('.dashboard-card:has-text("Expiring Soon")');
    this.atRiskTable = page.locator('.card:has-text("At-Risk Applications") table');
    this.kpiSummarySection = page.locator('.card:has-text("KPI Summary")');
    this.avgDaysToReadyCard = page.locator('.dashboard-card:has-text("Average Days to Ready")');
    this.completionRateCard = page.locator('.dashboard-card:has-text("Completion Rate")');
    this.rejectionRateCard = page.locator('.dashboard-card:has-text("Rejection Rate")');
    this.activeCoordinatorsCard = page.locator('.dashboard-card:has-text("Active Coordinators")');
    this.payerBreakdownTable = page.locator('.card:has-text("Pipeline by Payer") table');
    this.exportReportButton = page.locator('button:has-text("Export Weekly Report")');
    this.refreshDashboardButton = page.locator('button:has-text("Refresh Dashboard")');
  }

  async navigateToManagerDashboard() {
    logger.info('Navigating to Manager Dashboard tab');
    await this.managerDashboardTab.click();
    await expect(this.dashboardHeading).toBeVisible();
    logger.info('Manager Dashboard page loaded successfully');
  }

  async refreshDashboard() {
    logger.info('Refreshing dashboard');
    await this.refreshDashboardButton.click();
    await expect(this.dashboardHeading).toBeVisible();
    logger.info('Dashboard refreshed successfully');
  }

  async exportReport() {
    logger.info('Exporting weekly report');
    await this.exportReportButton.click();
    logger.info('Export report action triggered');
  }
};
