const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    this.netPositionSection = page.locator('[data-testid="net-position"]');
    this.cashFlowSection = page.locator('[data-testid="cash-flow"]');
    this.budgetHealthSection = page.locator('[data-testid="budget-health"]');
    this.recentTransactionsSection = page.locator('[data-testid="recent-transactions"]');
    this.aiInsightsSection = page.locator('[data-testid="ai-insights"]');
    this.goalsProgressSection = page.locator('[data-testid="goals-progress"]');
    this.dashboardLink = page.locator('a[href*="dashboard"]');
  }

  async navigateToDashboard() {
    await this.dashboardLink.click();
    await expect(this.dashboardContainer).toBeVisible();
  }
};
