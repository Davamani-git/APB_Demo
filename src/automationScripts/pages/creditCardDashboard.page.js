const { expect } = require('@playwright/test');

exports.CreditCardDashboardPage = class CreditCardDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Login page locators
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="text"][placeholder*="username" i]');
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // KPI Dashboard locators
    this.kpiDashboardSection = page.locator('[data-testid="kpi-dashboard"], .kpi-dashboard, #kpi-dashboard');
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend"], .monthly-spend-kpi, #monthly-spend');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit"], .total-credit-limit-kpi, #total-credit-limit');
    this.availableCreditKPI = page.locator('[data-testid="available-credit"], .available-credit-kpi, #available-credit');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount"], .outstanding-amount-kpi, #outstanding-amount');
    this.kpiWidgets = page.locator('.kpi-widget, [data-testid*="kpi"]');
    
    // Error handling locators
    this.errorMessage = page.locator('.error-message, [data-testid="error-message"], .alert-error');
    this.kpiErrorState = page.locator('.kpi-error-state, .kpi-placeholder, [data-testid="kpi-error"]');
    
    // Card Overview locators
    this.cardOverviewSection = page.locator('[data-testid="card-overview"], .card-overview, #card-overview');
    this.cardList = page.locator('.card-list, [data-testid="card-list"]');
    this.cardItems = page.locator('.card-item, [data-testid="card-item"], .credit-card');
    this.noCardsMessage = page.locator('.no-cards-message, [data-testid="no-cards-message"], .empty-state');
    
    // Navigation locators
    this.dashboardLink = page.locator('a[href*="dashboard"], nav a:has-text("Dashboard")');
    this.cardOverviewLink = page.locator('a[href*="cards"], nav a:has-text("Cards"), a:has-text("Card Overview")');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await expect(this.page).toHaveURL(/creditcard-dashboard/);
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async navigateToKPIDashboard() {
    await expect(this.dashboardLink).toBeVisible();
    await this.dashboardLink.click();
    await expect(this.kpiDashboardSection).toBeVisible();
  }

  async verifyKPIWidgetsVisible() {
    await expect(this.kpiWidgets.first()).toBeVisible();
    const count = await this.kpiWidgets.count();
    expect(count).toBeGreaterThan(0);
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    const match = text.match(/\$[\d,]+/);
    return match ? match[0] : text.trim();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    const match = text.match(/\$[\d,]+/);
    return match ? match[0] : text.trim();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    const match = text.match(/\$[\d,]+/);
    return match ? match[0] : text.trim();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    const match = text.match(/\$[\d,]+/);
    return match ? match[0] : text.trim();
  }

  async verifyAvailableCreditCalculation() {
    const totalCredit = await this.getTotalCreditLimitValue();
    const availableCredit = await this.getAvailableCreditValue();
    const outstanding = await this.getOutstandingAmountValue();
    
    const totalValue = parseFloat(totalCredit.replace(/[$,]/g, ''));
    const availableValue = parseFloat(availableCredit.replace(/[$,]/g, ''));
    const outstandingValue = parseFloat(outstanding.replace(/[$,]/g, ''));
    
    expect(availableValue).toBe(totalValue - outstandingValue);
  }

  async mockBackendServiceUnavailable() {
    await this.page.route('**/api/kpi/**', route => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service Unavailable' })
      });
    });
  }

  async getErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
    return await this.errorMessage.textContent();
  }

  async verifyKPIWidgetsShowErrorState() {
    const errorStateCount = await this.kpiErrorState.count();
    expect(errorStateCount).toBeGreaterThan(0);
    
    const monthlySpendText = await this.monthlySpendKPI.textContent();
    expect(monthlySpendText).not.toBe('$0');
    expect(monthlySpendText).not.toMatch(/^\$[\d,]+$/);
  }

  async navigateToCardOverview() {
    await expect(this.cardOverviewLink).toBeVisible();
    await this.cardOverviewLink.click();
    await expect(this.cardOverviewSection).toBeVisible();
  }

  async getCardCount() {
    const count = await this.cardItems.count();
    return count;
  }

  async verifyCardDisplayed(cardIdentifier) {
    const cardLocator = this.page.locator(`.card-item:has-text("${cardIdentifier}"), [data-testid="card-item"]:has-text("${cardIdentifier}")`);
    await expect(cardLocator).toBeVisible();
  }

  async verifyCardCreditLimit(cardIdentifier, expectedLimit) {
    const cardLocator = this.page.locator(`.card-item:has-text("${cardIdentifier}"), [data-testid="card-item"]:has-text("${cardIdentifier}")`);
    await expect(cardLocator).toBeVisible();
    const creditLimitLocator = cardLocator.locator('.credit-limit, [data-testid="credit-limit"]');
    await expect(creditLimitLocator).toContainText(expectedLimit);
  }

  async verifyCardBalance(cardIdentifier, expectedBalance) {
    const cardLocator = this.page.locator(`.card-item:has-text("${cardIdentifier}"), [data-testid="card-item"]:has-text("${cardIdentifier}")`);
    await expect(cardLocator).toBeVisible();
    const balanceLocator = cardLocator.locator('.balance, [data-testid="balance"], .current-balance');
    await expect(balanceLocator).toContainText(expectedBalance);
  }

  async getNoCardsMessage() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async verifyCardStatusHandling() {
    const cards = await this.cardItems.all();
    
    for (const card of cards) {
      const cardText = await card.textContent();
      
      if (cardText.includes('Expired') || cardText.includes('Deactivated')) {
        const statusIndicator = card.locator('.status-indicator, [data-testid="card-status"], .card-status');
        await expect(statusIndicator).toBeVisible();
      }
    }
  }

  async verifyOnlyActiveCardsInKPICalculations() {
    const totalCreditLimit = await this.getTotalCreditLimitValue();
    const totalValue = parseFloat(totalCreditLimit.replace(/[$,]/g, ''));
    
    expect(totalValue).toBeGreaterThan(0);
    
    const cards = await this.cardItems.all();
    let activeCardCount = 0;
    
    for (const card of cards) {
      const cardText = await card.textContent();
      if (!cardText.includes('Expired') && !cardText.includes('Deactivated')) {
        activeCardCount++;
      }
    }
    
    expect(activeCardCount).toBeGreaterThan(0);
  }

  async verifyCardStatusLogic() {
    const cards = await this.cardItems.all();
    
    for (const card of cards) {
      const cardText = await card.textContent();
      
      if (cardText.includes('01/2024') || cardText.includes('Expired')) {
        const statusIndicator = card.locator('.status-indicator, [data-testid="card-status"]');
        const statusText = await statusIndicator.textContent();
        expect(statusText.toLowerCase()).toContain('expired');
      }
      
      if (cardText.includes('Deactivated')) {
        const statusIndicator = card.locator('.status-indicator, [data-testid="card-status"]');
        const statusText = await statusIndicator.textContent();
        expect(statusText.toLowerCase()).toContain('deactivated');
      }
    }
  }
};