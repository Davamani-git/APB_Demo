const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('[data-testid="dashboard"], .dashboard-container, #dashboard, main.dashboard');
    this.portfolioCompaniesLink = page.locator('a:has-text("Portfolio Companies"), [data-testid="portfolio-link"], nav >> text=Portfolio');
    this.portfolioCompanyItems = page.locator('[data-testid="portfolio-company-item"], .portfolio-company, .company-card');
    this.readOnlyIndicator = page.locator('[data-testid="read-only-indicator"], .read-only-badge, .readonly-label');
    this.adminControlsContainer = page.locator('[data-testid="admin-controls"], .admin-controls, .admin-actions');
    this.editButton = page.locator('button:has-text("Edit"), [data-testid="edit-button"], .edit-btn');
    this.deleteButton = page.locator('button:has-text("Delete"), [data-testid="delete-button"], .delete-btn');
    this.configureButton = page.locator('button:has-text("Configure"), [data-testid="configure-button"], .configure-btn');
    this.companyDataContainer = page.locator('[data-testid="company-data"], .company-data-container, .data-panel');
    this.accessDeniedMessage = page.locator('[data-testid="access-denied"], .access-denied-message, .error-403');
    this.aiUsageMetrics = page.locator('[data-testid="ai-usage-metrics"], .ai-usage, .usage-metrics');
    this.aiSpendMetrics = page.locator('[data-testid="ai-spend-metrics"], .ai-spend, .spend-metrics');
    this.aggregatedSpendData = page.locator('[data-testid="aggregated-spend"], .aggregated-spend, .total-spend');
    this.dataFreshnessIndicator = page.locator('[data-testid="data-freshness"], .data-freshness, .last-sync');
    this.consolidatedDashboard = page.locator('[data-testid="consolidated-dashboard"], .consolidated-view, #consolidated-dashboard');
    this.aiSpendComparisonChart = page.locator('[data-testid="spend-comparison-chart"], .comparison-chart, .spend-chart');
    this.costSavingOpportunities = page.locator('[data-testid="cost-saving-opportunities"], .cost-savings, .opportunities-panel');
    this.exportButton = page.locator('button:has-text("Export"), [data-testid="export-button"], .export-btn');
    this.reportDownloadSuccess = page.locator('[data-testid="download-success"], .download-success, .export-success');
    this.dataUnavailableIndicators = page.locator('[data-testid="data-unavailable"], .data-unavailable, .api-error-indicator');
    this.systemNotificationBanner = page.locator('[data-testid="notification-banner"], .notification-banner, .system-alert');
  }

  portfolioCompanyItem(companyName) {
    return this.page.locator(`[data-testid="portfolio-company-item"]:has-text("${companyName}"), .portfolio-company:has-text("${companyName}"), .company-card:has-text("${companyName}")`);
  }

  async navigateToPortfolioCompaniesDashboard() {
    logger.info('Navigating to portfolio companies dashboard');
    await expect(this.portfolioCompaniesLink).toBeVisible();
    await this.portfolioCompaniesLink.click();
    await expect(this.portfolioCompanyItems.first()).toBeVisible({ timeout: 10000 });
  }

  async navigateToCompanyDashboard(companyName) {
    logger.info(`Navigating to ${companyName} dashboard`);
    const companyItem = this.portfolioCompanyItem(companyName);
    await expect(companyItem).toBeVisible();
    await companyItem.click();
    await expect(this.companyDataContainer).toBeVisible({ timeout: 10000 });
  }

  async navigateToCompanyByURL(url) {
    logger.info(`Attempting to navigate to: ${url}`);
    await this.page.goto(url);
  }

  async isEditFunctionalityDisabled() {
    logger.info('Checking if edit functionality is disabled');
    const editButtonVisible = await this.editButton.isVisible().catch(() => false);
    if (!editButtonVisible) {
      return true;
    }
    const editButtonEnabled = await this.editButton.isEnabled().catch(() => false);
    return !editButtonEnabled;
  }

  async navigateToConsolidatedView() {
    logger.info('Navigating to consolidated dashboard view');
    const consolidatedLink = this.page.locator('a:has-text("Consolidated"), [data-testid="consolidated-link"], nav >> text=Consolidated');
    await expect(consolidatedLink).toBeVisible();
    await consolidatedLink.click();
    await expect(this.consolidatedDashboard).toBeVisible({ timeout: 10000 });
  }

  portfolioCompanySpend(companyName) {
    return this.page.locator(`[data-company="${companyName}"] .spend-amount, .company-spend:has-text("${companyName}"), tr:has-text("${companyName}") .spend-value`);
  }

  underutilizationIndicator(companyName) {
    return this.page.locator(`[data-company="${companyName}"] .underutilization-indicator, .underutilized-badge:near(:text("${companyName}")), [data-testid="underutilization-${companyName}"]`);
  }

  underutilizationPercentage(companyName) {
    return this.page.locator(`[data-company="${companyName}"] .underutilization-percentage, .underutilization-value:near(:text("${companyName}"))`);
  }

  async exportReport(format) {
    logger.info(`Exporting report in ${format} format`);
    await expect(this.exportButton).toBeVisible();
    await this.exportButton.click();
    const formatOption = this.page.locator(`button:has-text("${format}"), [data-format="${format}"]`);
    await expect(formatOption).toBeVisible();
    await formatOption.click();
  }

  dataUnavailableIndicator(companyName) {
    return this.page.locator(`[data-company="${companyName}"] .data-unavailable, .api-error:near(:text("${companyName}")), [data-testid="unavailable-${companyName}"]`);
  }

  lastSyncTimestamp(companyName) {
    return this.page.locator(`[data-company="${companyName}"] .last-sync, .sync-timestamp:near(:text("${companyName}")), [data-testid="sync-${companyName}"]`);
  }

  async navigateToCompanyDetailPage(companyName) {
    logger.info(`Navigating to ${companyName} detail page`);
    await this.navigateToCompanyDashboard(companyName);
  }
};
