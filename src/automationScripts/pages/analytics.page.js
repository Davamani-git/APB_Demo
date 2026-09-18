const { expect } = require('@playwright/test');

exports.AnalyticsPage = class AnalyticsPage {

  constructor(page) {
    this.page = page;
    this.analyticsSection = page.locator('[data-testid="analytics-section"]');
    this.monthlySpendTrendsLink = page.locator('[data-testid="monthly-spend-trends-link"]');
    this.monthlySpendTrendsChart = page.locator('[data-testid="monthly-spend-trends-chart"]');
    this.categoryInsightsLink = page.locator('[data-testid="category-insights-link"]');
    this.categoryInsightsDashboard = page.locator('[data-testid="category-insights-dashboard"]');
    this.categoryItem = page.locator('[data-testid="category-item"]');
    this.timePeriodSelector = page.locator('[data-testid="time-period-selector"]');
    this.cardFilterSelector = page.locator('[data-testid="card-filter-selector"]');
    this.insufficientDataMessage = page.locator('[data-testid="insufficient-data-message"]');
    this.miscellaneousCategory = page.locator('[data-testid="category-item"]', { hasText: 'Miscellaneous' });
    this.totalSpendDisplay = page.locator('[data-testid="total-spend-display"]');
  }

  async navigate() {
    await this.page.goto('/analytics');
  }

  async navigateAsUserWithLimitedData() {
    await this.page.goto('/analytics?user=limited-data');
  }

  async navigateAsUserWithUncategorizedTransactions() {
    await this.page.goto('/analytics?user=uncategorized-transactions');
  }

  async verifyAnalyticsSectionLoaded() {
    await expect(this.analyticsSection).toBeVisible();
  }

  async accessMonthlySpendTrends() {
    await this.monthlySpendTrendsLink.click();
  }

  async attemptAccessMonthlySpendTrends() {
    await this.monthlySpendTrendsLink.click();
  }

  async verifyMonthlySpendTrendsChartDisplayed() {
    await expect(this.monthlySpendTrendsChart).toBeVisible();
  }

  async verifyChartDisplaysAggregatedData(expectedMonths) {
    for (const month of expectedMonths) {
      const monthLabel = this.monthlySpendTrendsChart.locator(`text=${month}`);
      await expect(monthLabel).toBeVisible();
    }
  }

  async verifyIndividualTransactionDetailsNotRevealed() {
    const chartContent = await this.monthlySpendTrendsChart.textContent();
    expect(chartContent).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(chartContent).not.toMatch(/merchant/i);
  }

  async selectTimePeriod(period) {
    await this.timePeriodSelector.selectOption({ label: period });
  }

  async verifyChartUpdatedForPeriod(expectedMonths) {
    await this.page.waitForTimeout(500);
    for (const month of expectedMonths) {
      const monthLabel = this.monthlySpendTrendsChart.locator(`text=${month}`);
      await expect(monthLabel).toBeVisible();
    }
  }

  async selectCardFilter(cardName) {
    await this.cardFilterSelector.selectOption({ label: cardName });
  }

  async verifyChartUpdatedForCard(cardName) {
    await this.page.waitForTimeout(500);
    const chartTitle = this.monthlySpendTrendsChart.locator('[data-testid="chart-title"]');
    await expect(chartTitle).toContainText(cardName);
  }

  async verifyInsufficientDataMessage(expectedMessage) {
    await expect(this.insufficientDataMessage).toBeVisible();
    await expect(this.insufficientDataMessage).toContainText(expectedMessage);
  }

  async verifyNoIncompleteChartDisplayed() {
    await expect(this.monthlySpendTrendsChart).not.toBeVisible();
  }

  async accessCategoryInsights() {
    await this.categoryInsightsLink.click();
  }

  async verifyCategoryInsightsDashboardDisplayed() {
    await expect(this.categoryInsightsDashboard).toBeVisible();
  }

  async verifyAllCategoriesDisplayed(categoryNames) {
    for (const categoryName of categoryNames) {
      const category = this.page.locator('[data-testid="category-item"]', { hasText: categoryName });
      await expect(category).toBeVisible();
    }
  }

  async verifySensitiveTransactionInfoNotExposed() {
    const dashboardContent = await this.categoryInsightsDashboard.textContent();
    expect(dashboardContent).not.toMatch(/\b\d{16}\b/);
    expect(dashboardContent).not.toMatch(/\bcvv\b.*\d{3,4}/i);
  }

  async verifyCategorySpendAmount(categoryName, expectedAmount) {
    const category = this.page.locator('[data-testid="category-item"]', { hasText: categoryName });
    const spendAmount = category.locator('[data-testid="category-spend-amount"]');
    await expect(spendAmount).toContainText(expectedAmount);
  }

  async verifyTotalSpendMatchesSum(expectedTotal) {
    await expect(this.totalSpendDisplay).toBeVisible();
    await expect(this.totalSpendDisplay).toContainText(expectedTotal);
  }

  async verifyMiscellaneousCategoryDisplayed() {
    await expect(this.miscellaneousCategory).toBeVisible();
  }

  async verifyUncategorizedTransactionsInMiscellaneous(expectedAmount) {
    const miscSpendAmount = this.miscellaneousCategory.locator('[data-testid="category-spend-amount"]');
    await expect(miscSpendAmount).toContainText(expectedAmount);
  }

  async verifySensitiveInfoNotExposedForUncategorized() {
    const miscContent = await this.miscellaneousCategory.textContent();
    expect(miscContent).not.toMatch(/\d{4}-\d{2}-\d{2}/);
    expect(miscContent).not.toMatch(/\b\d{16}\b/);
  }

};