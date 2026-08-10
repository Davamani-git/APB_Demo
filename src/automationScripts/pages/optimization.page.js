const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.OptimizationPage = class OptimizationPage {
  constructor(page) {
    this.page = page;
    this.companyDetailPage = page.locator('[data-testid="company-detail"], .company-detail-page, #company-detail');
    this.optimizationRecommendationsLink = page.locator('a:has-text("Optimization"), [data-testid="optimization-link"], nav >> text=Optimization');
    this.optimizationRecommendationsPage = page.locator('[data-testid="optimization-page"], .optimization-recommendations, #optimization');
    this.optimizationDashboard = page.locator('[data-testid="optimization-dashboard"], .optimization-dashboard, #cost-optimization');
    this.analysisButton = page.locator('button:has-text("Analyze"), [data-testid="analyze-button"], .analyze-btn');
    this.analysisPeriodSelector = page.locator('select[name="analysisPeriod"], [data-testid="analysis-period"]');
    this.analysisInProgress = page.locator('[data-testid="analysis-progress"], .analysis-loading, .analyzing-indicator');
    this.recommendationsContainer = page.locator('[data-testid="recommendations"], .recommendations-container, #recommendations');
    this.recommendationItems = page.locator('[data-testid="recommendation-item"], .recommendation-card, .recommendation-row');
    this.recommendationDetailsContainer = page.locator('[data-testid="recommendation-details"], .recommendation-details, .details-panel');
    this.nextStepsSection = page.locator('[data-testid="next-steps"], .next-steps, .action-steps');
    this.implementationGuideLink = page.locator('a:has-text("Implementation Guide"), [data-testid="implementation-guide"]');
    this.currentSpendField = page.locator('[data-testid="current-spend"], .current-spend, .spend-current');
    this.projectedSpendField = page.locator('[data-testid="projected-spend"], .projected-spend, .spend-projected');
    this.implementationTimelineField = page.locator('[data-testid="implementation-timeline"], .timeline, .implementation-time');
    this.categoryFilter = page.locator('select[name="category"], [data-testid="category-filter"], #category-filter');
    this.totalPotentialSavings = page.locator('[data-testid="total-savings"], .total-potential-savings, #total-savings');
    this.dataHistoryIndicator = page.locator('[data-testid="data-history"], .data-history, .historical-data-indicator');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data"], .insufficient-data-message, .no-data-warning');
    this.generateRecommendationsButton = page.locator('button:has-text("Generate Recommendations"), [data-testid="generate-recommendations"]');
  }

  async triggerUsagePatternAnalysis(period) {
    logger.info(`Triggering usage pattern analysis for: ${period}`);
    await expect(this.analysisPeriodSelector).toBeVisible();
    await this.analysisPeriodSelector.selectOption({ label: period });
    await expect(this.analysisButton).toBeVisible();
    await this.analysisButton.click();
  }

  async waitForRecommendationGeneration() {
    logger.info('Waiting for recommendation generation (up to 2 minutes)');
    await expect(this.analysisInProgress).toBeVisible();
    await expect(this.recommendationsContainer).toBeVisible({ timeout: 120000 });
  }

  async expandRecommendationDetails(index) {
    logger.info(`Expanding recommendation details at index: ${index}`);
    const recommendation = this.recommendationItems.nth(index);
    await expect(recommendation).toBeVisible();
    await recommendation.click();
    await expect(this.recommendationDetailsContainer).toBeVisible();
  }

  async navigateToOptimizationRecommendations() {
    logger.info('Navigating to optimization recommendations page');
    await expect(this.optimizationRecommendationsLink).toBeVisible();
    await this.optimizationRecommendationsLink.click();
    await expect(this.optimizationRecommendationsPage).toBeVisible({ timeout: 10000 });
  }

  async triggerComprehensiveAnalysis(scope) {
    logger.info(`Triggering comprehensive analysis: ${scope}`);
    const scopeSelector = this.page.locator('select[name="analysisScope"], [data-testid="analysis-scope"]');
    await expect(scopeSelector).toBeVisible();
    await scopeSelector.selectOption({ label: scope });
    await expect(this.analysisButton).toBeVisible();
    await this.analysisButton.click();
  }

  async waitForAnalysisCompletion() {
    logger.info('Waiting for analysis completion');
    await expect(this.analysisInProgress).toBeVisible();
    await expect(this.recommendationsContainer).toBeVisible({ timeout: 120000 });
  }

  async getOptimizationOpportunityTypes() {
    logger.info('Getting optimization opportunity types');
    const types = [];
    const count = await this.recommendationItems.count();
    for (let i = 0; i < count; i++) {
      const text = await this.recommendationItems.nth(i).textContent();
      if (text.toLowerCase().includes('underutilized')) {
        types.push('Underutilized resources');
      }
      if (text.toLowerCase().includes('redundant')) {
        types.push('Redundant services');
      }
    }
    return [...new Set(types)];
  }

  async filterByCategory(category) {
    logger.info(`Filtering recommendations by category: ${category}`);
    await expect(this.categoryFilter).toBeVisible();
    await this.categoryFilter.selectOption({ label: category });
    await expect(this.recommendationItems.first()).toBeVisible({ timeout: 10000 });
  }

  async clearFilters() {
    logger.info('Clearing all filters');
    const clearButton = this.page.locator('button:has-text("Clear Filters"), [data-testid="clear-filters"]');
    if (await clearButton.isVisible().catch(() => false)) {
      await clearButton.click();
    } else {
      await this.categoryFilter.selectOption({ label: 'All' });
    }
  }

  async triggerOptimizationRecommendations() {
    logger.info('Triggering optimization recommendations generation');
    await expect(this.generateRecommendationsButton).toBeVisible();
    await this.generateRecommendationsButton.click();
  }
};
