const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Section Locators
    this.kpiSection = page.locator('[data-testid="kpi-section"], .kpi-section, #kpi-section, .dashboard-kpis');
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"], .monthly-spend, #monthly-spend, [data-kpi="monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"], .total-credit-limit, #total-credit-limit, [data-kpi="total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"], .available-credit, #available-credit, [data-kpi="available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount-kpi"], .outstanding-amount, #outstanding-amount, [data-kpi="outstanding-amount"]');
    
    // Credit Cards Overview Section Locators
    this.creditCardsOverviewSection = page.locator('[data-testid="credit-cards-overview"], .credit-cards-section, #credit-cards-overview, .cards-overview');
    this.creditCardTiles = page.locator('[data-testid="credit-card-tile"], .credit-card, .card-tile, [data-card]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"], .no-cards-message, .empty-state, p:has-text("No credit cards")');
    
    // Individual Card Detail Locators
    this.cardNumbers = page.locator('[data-testid="card-number"], .card-number, .masked-card-number');
    this.cardBalances = page.locator('[data-testid="card-balance"], .card-balance, .current-balance');
    this.cardLimits = page.locator('[data-testid="card-limit"], .card-limit, .credit-limit');
    this.cardUtilizations = page.locator('[data-testid="card-utilization"], .card-utilization, .utilization-percentage');
  }

  async waitForDashboardToLoad() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.kpiSection).toBeVisible({ timeout: 10000 });
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const text = await this.monthlySpendKPI.textContent();
    return this.extractCurrencyValue(text);
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const text = await this.totalCreditLimitKPI.textContent();
    return this.extractCurrencyValue(text);
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const text = await this.availableCreditKPI.textContent();
    return this.extractCurrencyValue(text);
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const text = await this.outstandingAmountKPI.textContent();
    return this.extractCurrencyValue(text);
  }

  extractCurrencyValue(text) {
    const match = text.match(/\$[\d,]+\.\d{2}/);
    return match ? match[0] : text.trim();
  }

  async calculateAvailableCredit(totalCredit, outstanding) {
    const total = parseFloat(totalCredit.replace(/[$,]/g, ''));
    const outstand = parseFloat(outstanding.replace(/[$,]/g, ''));
    const available = total - outstand;
    return this.formatCurrency(available);
  }

  formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async getIndividualCardLimits() {
    await expect(this.creditCardTiles.first()).toBeVisible();
    const limits = await this.cardLimits.allTextContents();
    return limits.map(limit => this.extractCurrencyValue(limit));
  }

  async getIndividualCardOutstandings() {
    await expect(this.creditCardTiles.first()).toBeVisible();
    const outstandings = await this.cardBalances.allTextContents();
    return outstandings.map(balance => this.extractCurrencyValue(balance));
  }

  async navigateToCreditCardsOverview() {
    await expect(this.creditCardsOverviewSection).toBeVisible({ timeout: 10000 });
  }

  async getCreditCardCount() {
    const count = await this.creditCardTiles.count();
    return count;
  }

  async getMaskedCardNumbers() {
    await expect(this.creditCardTiles.first()).toBeVisible();
    const numbers = await this.cardNumbers.allTextContents();
    return numbers.map(num => num.trim());
  }

  async getCardBalances() {
    await expect(this.creditCardTiles.first()).toBeVisible();
    const balances = await this.cardBalances.allTextContents();
    return balances.map(balance => this.extractCurrencyValue(balance));
  }

  async getCardLimits() {
    await expect(this.creditCardTiles.first()).toBeVisible();
    const limits = await this.cardLimits.allTextContents();
    return limits.map(limit => this.extractCurrencyValue(limit));
  }

  async verifyNoOverlappingContent() {
    const cards = await this.creditCardTiles.all();
    for (const card of cards) {
      await expect(card).toBeVisible();
    }
  }

  async getNoCardsMessageText() {
    await expect(this.noCardsMessage).toBeVisible();
    return await this.noCardsMessage.textContent();
  }

  async getCreditUtilizationForCard(cardIndex) {
    await expect(this.creditCardTiles.nth(cardIndex)).toBeVisible();
    const utilization = await this.cardUtilizations.nth(cardIndex).textContent();
    return utilization.trim();
  }

  async calculateCreditUtilization(balance, limit) {
    const bal = parseFloat(balance.replace(/[$,]/g, ''));
    const lim = parseFloat(limit.replace(/[$,]/g, ''));
    const utilization = (bal / lim) * 100;
    
    // Round to 2 decimal places and remove trailing zeros
    let formatted = utilization.toFixed(2);
    formatted = parseFloat(formatted).toString();
    return formatted + '%';
  }
};