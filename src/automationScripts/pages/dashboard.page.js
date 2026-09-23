const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    this.pageHeader = page.locator('.page-header h1');
    this.loadingIndicator = page.locator('div:has-text("Loading dashboard...")');
    this.errorAlert = page.locator('.alert-danger');
    
    this.kpiOverview = page.locator('.kpi-overview');
    this.monthlySpendKpi = page.locator('.kpi-tile:has-text("Monthly Spend")');
    this.totalCreditLimitKpi = page.locator('.kpi-tile:has-text("Total Credit Limit")');
    this.availableCreditKpi = page.locator('.kpi-tile:has-text("Available Credit")');
    this.outstandingAmountKpi = page.locator('.kpi-tile:has-text("Outstanding Amount")');
    
    this.cardListSection = page.locator('.card-list');
    this.cardPanels = page.locator('.card-panel');
    
    this.analyticsLink = page.locator('a[href="#/analytics"]');
    this.monthlyTrendSection = page.locator('h3:has-text("Monthly Spend Trends")');
    this.monthlyTrendChart = page.locator('#monthlyTrendCanvas');
    this.categorySpendSection = page.locator('h3:has-text("Category-Wise Spend")');
    this.categoryChart = page.locator('#categoryChartCanvas');
  }

  async navigate() {
    logger.info('Navigating to dashboard page');
    await this.page.goto('/#/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    logger.info('Waiting for dashboard to load');
    await this.page.waitForSelector('.kpi-overview', { state: 'visible', timeout: 10000 });
    const isLoadingVisible = await this.loadingIndicator.isVisible().catch(() => false);
    if (isLoadingVisible) {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
    }
  }

  async getKpiTiles() {
    await expect(this.kpiOverview).toBeVisible();
    return await this.page.locator('.kpi-tile').all();
  }

  async getKpiValue(kpiName) {
    const kpiTile = this.page.locator(`.kpi-tile:has-text("${kpiName}")`);
    await expect(kpiTile).toBeVisible();
    const valueElement = kpiTile.locator('.kpi-value');
    return await valueElement.textContent();
  }

  async getCardPanels() {
    return await this.cardPanels.all();
  }

  getCardPanelByIndex(index) {
    return this.page.locator('.card-panel').nth(index);
  }

  getCardIssuer(index) {
    return this.getCardPanelByIndex(index).locator('.panel-title');
  }

  getCardMaskedNumber(index) {
    return this.getCardPanelByIndex(index).locator('.panel-title');
  }

  getCardCreditLimit(index) {
    return this.getCardPanelByIndex(index).locator('p:has-text("Credit Limit")');
  }

  getCardAvailableCredit(index) {
    return this.getCardPanelByIndex(index).locator('p:has-text("Available Credit")');
  }

  getCardOutstanding(index) {
    return this.getCardPanelByIndex(index).locator('p:has-text("Outstanding")');
  }

  getCardDueDate(index) {
    return this.getCardPanelByIndex(index).locator('p:has-text("Due Date")');
  }

  getCardStatus(index) {
    return this.getCardPanelByIndex(index).locator('p:has-text("Status")');
  }

  getCardViewDetailsButton(index) {
    return this.getCardPanelByIndex(index).locator('a.btn-primary');
  }

  async navigateToAnalytics() {
    logger.info('Navigating to analytics page');
    await this.page.goto('/#/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForAnalyticsLoad() {
    logger.info('Waiting for analytics page to load');
    await this.page.waitForSelector('h1:has-text("Spend Analytics")', { state: 'visible', timeout: 10000 });
    const isLoadingVisible = await this.loadingIndicator.isVisible().catch(() => false);
    if (isLoadingVisible) {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
    }
  }
};