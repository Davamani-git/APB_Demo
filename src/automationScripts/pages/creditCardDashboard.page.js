const { expect } = require('@playwright/test');

exports.CreditCardDashboardPage = class CreditCardDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Login page locators
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Dashboard navigation locators
    this.dashboardLink = page.locator('a[href*="dashboard"], a:has-text("Dashboard")');
    
    // KPI section locators
    this.kpiSection = page.locator('[data-testid="kpi-section"], .kpi-section, [class*="kpi"]');
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"], [class*="monthly-spend"], .kpi:has-text("Monthly Spend")');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"], [class*="total-credit-limit"], .kpi:has-text("Total Credit Limit")');
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"], [class*="available-credit"], .kpi:has-text("Available Credit")');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount-kpi"], [class*="outstanding-amount"], .kpi:has-text("Outstanding Amount")');
    
    // Data completeness indicators
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"], .no-transactions-message, [class*="no-data"]:has-text("No transactions")');
    this.warningIcon = page.locator('[data-testid="warning-icon"], .warning-icon, [class*="warning"]');
    this.warningTooltip = page.locator('[data-testid="warning-tooltip"], .tooltip, [role="tooltip"]');
    
    // KPI error handling locators
    this.kpiErrorMessage = page.locator('[data-testid="kpi-error-message"], .kpi-error-message, [class*="error"]:has-text("KPIs cannot be loaded")');
    
    // Credit cards section locators
    this.creditCardsSection = page.locator('[data-testid="credit-cards-section"], .credit-cards-section, [class*="credit-cards"]');
    this.creditCardItem = page.locator('[data-testid="credit-card-item"], .credit-card-item, [class*="card-item"]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], .no-cards-message, [class*="no-cards"]:has-text("No credit cards")');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToDashboard() {
    const currentUrl = this.page.url();
    if (!currentUrl.includes('dashboard')) {
      await this.dashboardLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  getCreditCardByIdentifier(cardIdentifier) {
    return this.page.locator(`[data-testid="credit-card"]:has-text("${cardIdentifier}"), .credit-card:has-text("${cardIdentifier}"), [class*="card"]:has-text("${cardIdentifier}")`);
  }

  getCardBalance(cardIdentifier) {
    return this.page.locator(`[data-testid="credit-card"]:has-text("${cardIdentifier}") [data-testid="card-balance"], .credit-card:has-text("${cardIdentifier}") .card-balance, [class*="card"]:has-text("${cardIdentifier}") [class*="balance"]`);
  }

  getCardLimit(cardIdentifier) {
    return this.page.locator(`[data-testid="credit-card"]:has-text("${cardIdentifier}") [data-testid="card-limit"], .credit-card:has-text("${cardIdentifier}") .card-limit, [class*="card"]:has-text("${cardIdentifier}") [class*="limit"]`);
  }

  getCardErrorIcon(cardIdentifier) {
    return this.page.locator(`[data-testid="credit-card"]:has-text("${cardIdentifier}") [data-testid="error-icon"], .credit-card:has-text("${cardIdentifier}") .error-icon, [class*="card"]:has-text("${cardIdentifier}") [class*="error-icon"]`);
  }

  getAllCreditCards() {
    return this.creditCardItem;
  }
};