const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('#dashboard-root');
    this.cardSummaryList = page.locator('.card-summary');
    this.noCardsMessage = page.locator('text=No credit cards found');
    this.categoryChart = (category) => page.locator(`.category-chart [data-category="${category}"]`);
  }

  async waitForDashboardLoad() {
    await expect(this.dashboardContainer).toBeVisible();
  }

  async getAllCardSummaries() {
    await expect(this.cardSummaryList.first()).toBeVisible();
    const cardCount = await this.cardSummaryList.count();
    const cards = [];
    for (let i = 0; i < cardCount; i++) {
      const card = this.cardSummaryList.nth(i);
      const creditLimit = await card.locator('.credit-limit').innerText();
      const outstanding = await card.locator('.outstanding-amount').innerText();
      const availableCredit = await card.locator('.available-credit').count() > 0 ? await card.locator('.available-credit').innerText() : undefined;
      const monthlySpend = await card.locator('.monthly-spend').count() > 0 ? await card.locator('.monthly-spend').innerText() : undefined;
      cards.push({ creditLimit, outstanding, availableCredit, monthlySpend });
    }
    return cards;
  }

  async expectCategoryVisualizationVisible(category) {
    await expect(this.categoryChart(category)).toBeVisible();
  }

  async selectCategory(category) {
    await this.categoryChart(category).click();
  }

  async hoverCategory(category) {
    await this.categoryChart(category).hover();
  }

  async expectCategoryDrilldownOrTooltip(category) {
    // Assume a tooltip or drilldown appears with category details
    const tooltip = this.page.locator('.category-tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(category);
  }

  async expectNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
  }
};
