const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('#dashboard-main');
    this.cardsSection = page.locator('#cards-list');
    this.kpiSection = page.locator('#dashboard-kpis');
    this.categorySpendingChart = page.locator('#category-spending-chart');
    this.spendTrendsChart = page.locator('#monthly-spend-trends');
    this.cardWiseAnalysisSection = page.locator('#card-wise-analysis');
  }

  async navigate() {
    logger.info('Navigating to Credit Card Dashboard');
    await this.page.goto(require('../../data/env').dashboardUrl);
    await expect(this.dashboardContainer).toBeVisible();
  }

  async assertDashboardVisible() {
    logger.info('Asserting dashboard main container is visible');
    await expect(this.dashboardContainer).toBeVisible();
  }

  async assertMultipleCardsVisible() {
    logger.info('Asserting multiple credit cards are visible');
    await expect(this.cardsSection).toBeVisible();
    const cardCount = await this.cardsSection.locator('.card-item').count();
    expect(cardCount).toBeGreaterThan(1);
  }

  async assertKPIVisible(kpiName) {
    logger.info(`Asserting KPI '${kpiName}' is visible`);
    const kpiLocator = this.kpiSection.locator(`.kpi-label:has-text("${kpiName}")`);
    await expect(kpiLocator).toBeVisible();
  }

  async assertCategorySpendingVisible(categories) {
    logger.info('Asserting category-wise spending chart and all categories are visible');
    await expect(this.categorySpendingChart).toBeVisible();
    for (const category of categories) {
      const categoryLocator = this.categorySpendingChart.locator(`.category-label:has-text("${category}")`);
      await expect(categoryLocator).toBeVisible();
    }
  }

  async assertSpendTrendsVisible() {
    logger.info('Asserting monthly spend trends chart is visible');
    await expect(this.spendTrendsChart).toBeVisible();
  }

  async assertCardWiseAnalysisVisible() {
    logger.info('Asserting card-wise spend analysis section is visible');
    await expect(this.cardWiseAnalysisSection).toBeVisible();
  }
};