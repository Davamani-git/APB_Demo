const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/login.page');
const { DashboardPage } = require('./pages/dashboard.page');
const { OptimizationPage } = require('./pages/optimization.page');
const logger = require('../utils/logger');

test.describe('Cost Optimization Recommendations', () => {

  test('TC-011: Generate and verify actionable cost-saving recommendations', async ({ page }) => {
    logger.info('Starting TC-011: Generate actionable cost-saving recommendations');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const optimizationPage = new OptimizationPage(page);

    // Step 1: Log in as Operating Partner
    await loginPage.navigate();
    await loginPage.login('partner@company.com', 'Partner@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Operating Partner dashboard loads successfully');

    // Step 2: Navigate to specific portfolio company detail page
    await dashboardPage.navigateToCompanyDetailPage('Portfolio Company F');
    await expect(optimizationPage.companyDetailPage).toBeVisible();
    logger.info('Company detail page loads with AI usage analytics');

    // Step 3: Trigger AI usage pattern analysis
    await optimizationPage.triggerUsagePatternAnalysis('Last 30 days');
    await expect(optimizationPage.analysisInProgress).toBeVisible();
    logger.info('System analyzes AI usage patterns across the portfolio');

    // Step 4: Wait for recommendation generation (up to 2 minutes)
    await optimizationPage.waitForRecommendationGeneration();
    await expect(optimizationPage.recommendationsContainer).toBeVisible();
    logger.info('System completes analysis and generates recommendations');

    // Step 5: Verify at least one actionable recommendation is displayed
    const recommendationCount = await optimizationPage.recommendationItems.count();
    expect(recommendationCount).toBeGreaterThanOrEqual(1);
    await expect(optimizationPage.recommendationItems.first()).toContainText('Optimize');
    logger.info('At least one recommendation is visible on the dashboard detail page');

    // Step 6: Review recommendation details
    await optimizationPage.expandRecommendationDetails(0);
    await expect(optimizationPage.recommendationDetailsContainer).toBeVisible();
    await expect(optimizationPage.recommendationDetailsContainer).toContainText('Schedule GPU instances');
    await expect(optimizationPage.recommendationDetailsContainer).toContainText('estimated savings');
    await expect(optimizationPage.recommendationDetailsContainer).toContainText('$2,500');
    logger.info('Recommendation includes specific implementation strategies and steps');

    // Step 7: Verify recommendation is actionable with clear next steps
    await expect(optimizationPage.nextStepsSection).toBeVisible();
    await expect(optimizationPage.implementationGuideLink).toBeVisible();
    logger.info('Recommendation provides actionable next steps or links to implementation guides');
  });

  test('TC-012: Verify portfolio-wide optimization recommendations prioritized by savings', async ({ page }) => {
    logger.info('Starting TC-012: Verify portfolio-wide optimization recommendations');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const optimizationPage = new OptimizationPage(page);

    // Step 1: Log in as Operating Partner
    await loginPage.navigate();
    await loginPage.login('partner@company.com', 'Partner@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Operating Partner dashboard loads successfully');

    // Step 2: Navigate to portfolio-wide optimization recommendations page
    await optimizationPage.navigateToOptimizationRecommendations();
    await expect(optimizationPage.optimizationRecommendationsPage).toBeVisible();
    logger.info('Optimization recommendations page loads');

    // Step 3: Trigger comprehensive optimization analysis
    await optimizationPage.triggerComprehensiveAnalysis('All portfolio companies');
    await expect(optimizationPage.analysisInProgress).toBeVisible();
    logger.info('System analyzes all portfolio companies for optimization opportunities');

    // Step 4: Verify multiple optimization opportunities are identified
    await optimizationPage.waitForAnalysisCompletion();
    const opportunityTypes = await optimizationPage.getOptimizationOpportunityTypes();
    expect(opportunityTypes.length).toBeGreaterThanOrEqual(2);
    expect(opportunityTypes).toContain('Underutilized resources');
    expect(opportunityTypes).toContain('Redundant services');
    logger.info('System identifies at least 2 different types of optimization opportunities');

    // Step 5: Check recommendations are prioritized by potential cost savings
    const firstRecommendation = await optimizationPage.recommendationItems.first().textContent();
    const secondRecommendation = await optimizationPage.recommendationItems.nth(1).textContent();
    expect(firstRecommendation).toContain('$5,000');
    expect(secondRecommendation).toContain('$3,500');
    logger.info('Recommendations are sorted with highest potential savings at the top');

    // Step 6: Verify each recommendation shows cost reduction percentage
    await expect(optimizationPage.recommendationItems.first()).toContainText('15%');
    await expect(optimizationPage.recommendationItems.first()).toContainText('$5,000');
    logger.info('Each recommendation displays estimated cost reduction in the range of 10-20%');

    // Step 7: Review detailed breakdown for top priority recommendation
    await optimizationPage.expandRecommendationDetails(0);
    await expect(optimizationPage.currentSpendField).toBeVisible();
    await expect(optimizationPage.projectedSpendField).toBeVisible();
    await expect(optimizationPage.implementationTimelineField).toBeVisible();
    logger.info('Detailed breakdown includes current spend, projected spend, and timeline');
  });

  test('TC-013: Filter and verify optimization recommendations by category', async ({ page }) => {
    logger.info('Starting TC-013: Filter optimization recommendations by category');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const optimizationPage = new OptimizationPage(page);

    // Step 1: Log in as Operating Partner
    await loginPage.navigate();
    await loginPage.login('partner@company.com', 'Partner@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Operating Partner successfully logs in');

    // Step 2: Navigate to cost optimization dashboard
    await optimizationPage.navigateToOptimizationRecommendations();
    await expect(optimizationPage.optimizationDashboard).toBeVisible();
    logger.info('Cost optimization dashboard displays');

    // Step 3: Filter by Underutilized Resources
    await optimizationPage.filterByCategory('Underutilized Resources');
    await expect(optimizationPage.recommendationItems.first()).toBeVisible();
    const underutilizedCount = await optimizationPage.recommendationItems.count();
    expect(underutilizedCount).toBeGreaterThan(0);
    logger.info('System displays all underutilized resource recommendations');

    // Step 4: Verify underutilized resource details
    await expect(optimizationPage.recommendationItems.first()).toContainText('30% utilized');
    await expect(optimizationPage.recommendationItems.first()).toContainText('potential savings');
    await expect(optimizationPage.recommendationItems.first()).toContainText('$2,000');
    logger.info('Each item shows current utilization and potential savings amount');

    // Step 5: Filter by Redundant Services
    await optimizationPage.filterByCategory('Redundant Services');
    await expect(optimizationPage.recommendationItems.first()).toBeVisible();
    const redundantCount = await optimizationPage.recommendationItems.count();
    expect(redundantCount).toBeGreaterThan(0);
    logger.info('System displays all redundant service recommendations');

    // Step 6: Verify redundant service details
    await expect(optimizationPage.recommendationItems.first()).toContainText('consolidate');
    await expect(optimizationPage.recommendationItems.first()).toContainText('$3,000');
    logger.info('Each item identifies redundant services and suggests consolidation with cost impact');

    // Step 7: Verify total potential savings meets 10-20% reduction target
    await optimizationPage.clearFilters();
    await expect(optimizationPage.totalPotentialSavings).toBeVisible();
    const totalSavingsText = await optimizationPage.totalPotentialSavings.textContent();
    const savingsAmount = parseInt(totalSavingsText.replace(/[^0-9]/g, ''));
    expect(savingsAmount).toBeGreaterThanOrEqual(5000);
    expect(savingsAmount).toBeLessThanOrEqual(10000);
    logger.info('Total potential savings displayed shows 10-20% reduction in AI-related expenses');
  });

  test('TC-014: Verify insufficient data message for newly onboarded companies', async ({ page }) => {
    logger.info('Starting TC-014: Verify insufficient data handling for new companies');
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const optimizationPage = new OptimizationPage(page);

    // Step 1: Log in as Operating Partner
    await loginPage.navigate();
    await loginPage.login('partner@company.com', 'Partner@123');
    await expect(dashboardPage.dashboardContainer).toBeVisible();
    logger.info('Operating Partner dashboard loads successfully');

    // Step 2: Navigate to newly onboarded company with limited data
    await dashboardPage.navigateToCompanyDetailPage('New Portfolio Company G');
    await expect(optimizationPage.companyDetailPage).toBeVisible();
    logger.info('Company detail page loads');

    // Step 3: Verify company has less than 7 days of historical data
    await expect(optimizationPage.dataHistoryIndicator).toBeVisible();
    await expect(optimizationPage.dataHistoryIndicator).toContainText('5 days');
    logger.info('Data history shows only 5 days of records');

    // Step 4: Attempt to generate cost optimization recommendations
    await optimizationPage.triggerOptimizationRecommendations();
    logger.info('System processes the request');

    // Step 5: Verify insufficient data message
    await expect(optimizationPage.insufficientDataMessage).toBeVisible();
    await expect(optimizationPage.insufficientDataMessage).toContainText('Insufficient data for analysis');
    await expect(optimizationPage.insufficientDataMessage).toContainText('At least 7 days of historical AI usage data is required');
    logger.info('System displays message indicating insufficient data for analysis');

    // Step 6: Check message includes when recommendations will be available
    await expect(optimizationPage.insufficientDataMessage).toContainText('Recommendations will be available after');
    await expect(optimizationPage.insufficientDataMessage).toContainText('when 7 days of data has been collected');
    logger.info('Message indicates when sufficient data will be available');

    // Step 7: Verify no partial or inaccurate recommendations are displayed
    const recommendationsVisible = await optimizationPage.recommendationItems.count();
    expect(recommendationsVisible).toBe(0);
    logger.info('No recommendations are shown, only the insufficient data message');
  });
});
