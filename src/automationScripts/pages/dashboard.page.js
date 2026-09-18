const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.kpiSection = page.locator('.kpi-section, .dashboard-kpis');
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend"), [data-testid="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit"), [data-testid="total-credit-limit"]');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit"), [data-testid="available-credit"]');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding Amount"), [data-testid="outstanding-amount"]');
    this.cardGrid = page.locator('.cards-grid, .cards-overview, .card-list');
    this.cardItems = page.locator('.card-item, .card-detail');
    this.noCardsMessage = page.locator('.no-cards-message, .empty-state, :has-text("No credit cards")');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
    this.loadingSpinner = page.locator('.loading, .spinner, [data-testid="loading"]');
    this.kpiWarningMessage = page.locator('.kpi-warning, .warning-message');
    this.transactionWarningMessage = page.locator('.transaction-warning, :has-text("could not be mapped")');
    this.duplicateWarningMessage = page.locator('.duplicate-warning, :has-text("Duplicate")');
    this.navigationMenu = page.locator('.nav-menu, nav');
  }

  async navigate() {
    await this.page.goto('https://app.creditcarddashboard.com');
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.kpiSection.or(this.errorMessage).or(this.noCardsMessage)).toBeVisible({ timeout: 10000 });
  }

  async getCardCount() {
    await this.page.waitForTimeout(1000);
    return await this.cardItems.count();
  }

  async verifyCardAttributes(cardName, issuer, limit, balance, available) {
    const cardLocator = this.page.locator(`.card-item:has-text("${cardName}"), .card-detail:has-text("${cardName}")`);
    await expect(cardLocator).toBeVisible();
    await expect(cardLocator).toContainText(issuer);
    const cardText = await cardLocator.textContent();
    expect(cardText).toMatch(new RegExp(limit.replace(/,/g, ',')));
  }

  async verifyKPIValue(kpiName, expectedValue) {
    let kpiLocator;
    switch(kpiName) {
      case 'monthlySpend':
        kpiLocator = this.monthlySpendKPI;
        break;
      case 'totalCreditLimit':
        kpiLocator = this.totalCreditLimitKPI;
        break;
      case 'availableCredit':
        kpiLocator = this.availableCreditKPI;
        break;
      case 'outstandingAmount':
        kpiLocator = this.outstandingAmountKPI;
        break;
    }
    await expect(kpiLocator).toBeVisible();
    const kpiText = await kpiLocator.textContent();
    const cleanExpectedValue = expectedValue.replace(/,/g, '');
    expect(kpiText).toMatch(new RegExp(cleanExpectedValue));
  }

  async getKPIValue(kpiName) {
    let kpiLocator;
    switch(kpiName) {
      case 'monthlySpend':
        kpiLocator = this.monthlySpendKPI;
        break;
      case 'totalCreditLimit':
        kpiLocator = this.totalCreditLimitKPI;
        break;
      case 'availableCredit':
        kpiLocator = this.availableCreditKPI;
        break;
      case 'outstandingAmount':
        kpiLocator = this.outstandingAmountKPI;
        break;
    }
    await expect(kpiLocator).toBeVisible();
    const kpiText = await kpiLocator.textContent();
    const match = kpiText.match(/[\d,]+\.\d{2}/);
    return match ? match[0].replace(/,/g, '') : '0';
  }

  async verifyKPICurrencyFormat() {
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    for (const kpi of kpis) {
      const kpiText = await kpi.textContent();
      expect(kpiText).toMatch(/\$[\d,]+\.\d{2}/);
    }
  }
};