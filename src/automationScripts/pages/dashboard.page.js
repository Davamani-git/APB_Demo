const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    this.dashboardLink = page.locator('a[href*="dashboard"], a:has-text("Dashboard")').first();
    this.monthlySpendKPI = page.locator('.kpi-card:has-text("Monthly Spend") .kpi-value, [data-testid="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('.kpi-card:has-text("Total Credit Limit") .kpi-value, [data-testid="total-credit-limit"]');
    this.availableCreditKPI = page.locator('.kpi-card:has-text("Available Credit") .kpi-value, [data-testid="available-credit"]');
    this.outstandingAmountKPI = page.locator('.kpi-card:has-text("Outstanding Amount") .kpi-value, [data-testid="outstanding-amount"]');
    this.totalCardsCount = page.locator('.summary-info:has-text("Total Cards"), [data-testid="total-cards"]');
    this.utilizationRate = page.locator('.summary-info:has-text("Credit Utilization"), [data-testid="utilization-rate"]');
    this.noCardsMessage = page.locator('text=/No credit cards linked|No cards available/i');
    this.errorMessage = page.locator('.error, [role="alert"], text=/Failed to load|Service temporarily unavailable/i');
    this.navigationMenu = page.locator('.nav-menu, nav, [role="navigation"]');
    this.kpiGrid = page.locator('.kpi-grid, .kpi-section');
    this.cardViewDetailsButton = page.locator('a:has-text("View Details"), button:has-text("View Details")');
    this.minScreenSizeMessage = page.locator('text=/minimum supported screen size|screen too small/i');
  }

  async navigate(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToDashboard() {
    const isDashboardPage = await this.page.url().then(url => url.includes('dashboard'));
    if (!isDashboardPage) {
      await this.dashboardLink.click();
      await this.page.waitForLoadState('networkidle');
    }
    await expect(this.kpiGrid).toBeVisible();
  }
};