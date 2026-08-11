const { expect } = require('@playwright/test');

exports.AIInsightsPage = class AIInsightsPage {
  constructor(page) {
    this.page = page;
    this.aiInsightsLink = page.locator('a[href*="insights"]');
    this.aiInsightsContainer = page.locator('[data-testid="ai-insights-container"]');
    this.unusualSpendingAlert = page.locator('[data-testid="unusual-spending-alert"]');
    this.aiInsightNotification = page.locator('[data-testid="ai-insight-notification"]');
    this.insightDetailView = page.locator('[data-testid="insight-detail-view"]');
    this.historicalAverageDisplay = page.locator('[data-testid="historical-average"]');
    this.currentSpendingDisplay = page.locator('[data-testid="current-spending"]');
    this.percentageIncreaseDisplay = page.locator('[data-testid="percentage-increase"]');
    this.transactionList = page.locator('[data-testid="insight-transactions-list"]');
    this.triggerAnalysisButton = page.locator('button[data-testid="trigger-ai-analysis"]');
    this.analysisCompleteIndicator = page.locator('[data-testid="analysis-complete"]');
    this.viewTransactionDetailsButton = page.locator('button[data-testid="view-transaction-details"]');
  }

  async navigateToAIInsightsSection() {
    await this.aiInsightsLink.click();
    await expect(this.aiInsightsContainer).toBeVisible();
  }

  async triggerAIAnalysis(period) {
    await this.triggerAnalysisButton.click();
  }

  async verifyAlertDetails(alertType, category, increase) {
    await expect(this.unusualSpendingAlert).toContainText(alertType);
    await expect(this.unusualSpendingAlert).toContainText(category);
    await expect(this.unusualSpendingAlert).toContainText(increase);
  }

  async verifyNoAlertForCategory(category) {
    const categoryAlert = this.page.locator(`[data-testid="unusual-spending-alert"]`, {
      hasText: category
    });
    await expect(categoryAlert).not.toBeVisible();
  }

  async clickInsightNotification(insightId, category) {
    const notification = this.page.locator(`[data-testid="insight-notification-${insightId}"]`);
    await notification.click();
  }

  async verifyHistoricalAverage(average) {
    await expect(this.historicalAverageDisplay).toBeVisible();
    await expect(this.historicalAverageDisplay).toContainText(average);
  }

  async verifyCurrentSpendingComparison(currentSpending, comparison) {
    await expect(this.currentSpendingDisplay).toBeVisible();
    await expect(this.currentSpendingDisplay).toContainText(currentSpending);
    await expect(this.currentSpendingDisplay).toContainText(comparison);
  }

  async verifyPercentageIncrease(percentage) {
    await expect(this.percentageIncreaseDisplay).toBeVisible();
    await expect(this.percentageIncreaseDisplay).toContainText(percentage);
  }

  async viewTransactionDetails() {
    await this.viewTransactionDetailsButton.click();
  }
};
