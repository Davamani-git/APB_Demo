const { expect } = require('@playwright/test');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="text"]').first();
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    this.cardsLink = page.locator('a[href*="cards"], a:has-text("Cards")');
    this.cardListItems = page.locator('.card-item, .card-item-detailed, [data-testid="card-item"]');
    this.portfolioTotalCards = page.locator('.summary-item:has-text("Total Cards") .summary-value, [data-testid="portfolio-total-cards"]');
    this.portfolioTotalLimit = page.locator('.summary-item:has-text("Total Credit Limit") .summary-value, [data-testid="portfolio-total-limit"]');
    this.portfolioTotalAvailable = page.locator('.summary-item:has-text("Total Available") .summary-value, [data-testid="portfolio-total-available"]');
    this.portfolioTotalOutstanding = page.locator('.summary-item:has-text("Total Outstanding") .summary-value, [data-testid="portfolio-total-outstanding"]');
    this.portfolioUtilizationRate = page.locator('.summary-item:has-text("Utilization Rate") .summary-value, [data-testid="portfolio-utilization"]');
    this.errorMessage = page.locator('.error, [role="alert"], text=/Failed to load cards|Service is unavailable/i');
    this.navigationMenu = page.locator('.nav-menu, nav, [role="navigation"]');
    this.cardDetailMonthlySpend = page.locator('.kpi-card:has-text("Monthly Spend") .kpi-value, [data-testid="card-monthly-spend"]');
    this.cardDetailCreditLimit = page.locator('.kpi-card:has-text("Credit Limit") .kpi-value, [data-testid="card-credit-limit"]');
    this.cardDetailAvailableCredit = page.locator('.kpi-card:has-text("Available Credit") .kpi-value, [data-testid="card-available-credit"]');
    this.cardDetailOutstandingAmount = page.locator('.kpi-card:has-text("Outstanding Amount") .kpi-value, [data-testid="card-outstanding"]');
    this.cardNotFoundError = page.locator('text=/Card not found|card has been deactivated/i');
    this.backToCardsButton = page.locator('a:has-text("Back to Cards"), button:has-text("Back")');
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

  async navigateToCardsSection() {
    await this.cardsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  getCardByName(cardName) {
    return this.page.locator(`.card-item:has-text("${cardName}"), .card-item-detailed:has-text("${cardName}")`);
  }

  getCardType(cardId) {
    return this.page.locator(`[data-card-id="${cardId}"] .card-type, .card-item:has-text("${cardId}") .card-type`);
  }

  getCardLimit(cardId) {
    return this.page.locator(`[data-card-id="${cardId}"] p:has-text("Credit Limit"), .card-item:has-text("${cardId}") p:has-text("Credit Limit")`);
  }

  getCardAvailable(cardId) {
    return this.page.locator(`[data-card-id="${cardId}"] p:has-text("Available"), .card-item:has-text("${cardId}") p:has-text("Available")`);
  }

  getCardOutstanding(cardId) {
    return this.page.locator(`[data-card-id="${cardId}"] p:has-text("Outstanding"), .card-item:has-text("${cardId}") p:has-text("Outstanding")`);
  }

  async selectCard(cardId) {
    const cardLink = this.page.locator(`a[href*="${cardId}"], a:has-text("View Card Details")`, { has: this.page.locator(`:text("${cardId}")`) }).first();
    await cardLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async backToCardsList() {
    await this.backToCardsButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};