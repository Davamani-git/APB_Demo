const { expect } = require('@playwright/test');

exports.CreditCardDashboardPage = class CreditCardDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Login page locators
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="text"][placeholder*="username" i]');
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // KPI locators
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"], .kpi-monthly-spend, div:has-text("Monthly Spend"):visible').first();
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"], .kpi-total-credit-limit, div:has-text("Total Credit Limit"):visible').first();
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"], .kpi-available-credit, div:has-text("Available Credit"):visible').first();
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount-kpi"], .kpi-outstanding-amount, div:has-text("Outstanding Amount"):visible').first();
    
    // KPI value locators
    this.monthlySpendValue = page.locator('[data-testid="monthly-spend-value"], .monthly-spend-value, .kpi-monthly-spend .value');
    this.totalCreditLimitValue = page.locator('[data-testid="total-credit-limit-value"], .total-credit-limit-value, .kpi-total-credit-limit .value');
    this.availableCreditValue = page.locator('[data-testid="available-credit-value"], .available-credit-value, .kpi-available-credit .value');
    this.outstandingAmountValue = page.locator('[data-testid="outstanding-amount-value"], .outstanding-amount-value, .kpi-outstanding-amount .value');
    
    // Navigation locators
    this.dashboardLink = page.locator('a[href*="dashboard"], nav a:has-text("Dashboard")');
    this.transactionsLink = page.locator('a[href*="transactions"], nav a:has-text("Transactions")');
    this.cardsLink = page.locator('a[href*="cards"], nav a:has-text("Cards")');
    
    // Empty state locators
    this.emptyStateMessage = page.locator('[data-testid="empty-state-message"], .empty-state-message, div:has-text("No credit card"):visible, div:has-text("No cards registered"):visible');
    this.addCreditCardButton = page.locator('[data-testid="add-credit-card-btn"], button:has-text("Add Credit Card"), button:has-text("Add Card"), a:has-text("Add Credit Card")');
    
    // Visualization locators
    this.categorySpendingChart = page.locator('[data-testid="category-spending-chart"], .category-spending-chart, div:has-text("Category-wise Spending"):visible');
    this.monthlyTrendsChart = page.locator('[data-testid="monthly-trends-chart"], .monthly-trends-chart, div:has-text("Monthly Spend Trends"):visible');
    this.emptyChartMessage = page.locator('.empty-chart-message, div:has-text("No data available"):visible, div:has-text("No spending data"):visible');
    
    // Incomplete data locators
    this.incompleteDataIndicator = page.locator('[data-testid="incomplete-data-indicator"], .incomplete-data-indicator, span:has-text("*"), .info-icon, i[class*="info"]');
    this.incompleteDataTooltip = page.locator('[data-testid="incomplete-data-tooltip"], .tooltip, [role="tooltip"]');
    this.incompleteDataMessage = page.locator('[data-testid="incomplete-data-message"], .incomplete-data-message, div:has-text("incomplete data"):visible, div:has-text("unavailable"):visible');
    this.incompleteDataWarning = page.locator('[data-testid="incomplete-data-warning"], .warning-message, .alert:has-text("incomplete"), .alert:has-text("unavailable")');
    this.manageCardsButton = page.locator('[data-testid="manage-cards-btn"], button:has-text("Manage Cards"), a:has-text("Manage Cards"), button:has-text("Update Card Info")');
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

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    const valueLocator = this.monthlySpendKPI.locator('.value, .amount, [data-testid*="value"]').first();
    if (await valueLocator.count() > 0) {
      return await valueLocator.textContent();
    }
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    const valueLocator = this.totalCreditLimitKPI.locator('.value, .amount, [data-testid*="value"]').first();
    if (await valueLocator.count() > 0) {
      return await valueLocator.textContent();
    }
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    const valueLocator = this.availableCreditKPI.locator('.value, .amount, [data-testid*="value"]').first();
    if (await valueLocator.count() > 0) {
      return await valueLocator.textContent();
    }
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    const valueLocator = this.outstandingAmountKPI.locator('.value, .amount, [data-testid*="value"]').first();
    if (await valueLocator.count() > 0) {
      return await valueLocator.textContent();
    }
    return await this.outstandingAmountKPI.textContent();
  }

  async verifyKPICalculations(expectedTotalLimit, expectedOutstanding, expectedMonthlySpend, expectedAvailable) {
    const totalLimit = await this.getTotalCreditLimitValue();
    const outstanding = await this.getOutstandingAmountValue();
    const monthlySpend = await this.getMonthlySpendValue();
    const available = await this.getAvailableCreditValue();
    
    expect(totalLimit).toContain(expectedTotalLimit.toString());
    expect(outstanding).toContain(expectedOutstanding.toString());
    expect(monthlySpend).toContain(expectedMonthlySpend.toString());
    expect(available).toContain(expectedAvailable.toString());
  }

  async verifyKPIFormatting() {
    const monthlySpend = await this.getMonthlySpendValue();
    const totalLimit = await this.getTotalCreditLimitValue();
    const available = await this.getAvailableCreditValue();
    const outstanding = await this.getOutstandingAmountValue();
    
    const currencyPattern = /[$₹€£¥]/;
    const numberPattern = /[0-9,]+/;
    
    expect(monthlySpend).toMatch(currencyPattern);
    expect(monthlySpend).toMatch(numberPattern);
    expect(totalLimit).toMatch(currencyPattern);
    expect(available).toMatch(currencyPattern);
    expect(outstanding).toMatch(currencyPattern);
  }

  async navigateToTransactions() {
    await expect(this.transactionsLink).toBeVisible();
    await this.transactionsLink.click();
  }

  async navigateToDashboard() {
    await expect(this.dashboardLink).toBeVisible();
    await this.dashboardLink.click();
  }

  async verifyKPIEmptyState(kpiLocator) {
    await expect(kpiLocator).toBeVisible();
    const kpiText = await kpiLocator.textContent();
    const hasZero = kpiText.includes('0') || kpiText.includes('$0') || kpiText.includes('₹0');
    const hasEmptyState = kpiText.toLowerCase().includes('n/a') || kpiText.toLowerCase().includes('empty');
    expect(hasZero || hasEmptyState).toBeTruthy();
  }

  async verifyCategorySpendingEmptyState() {
    const chartCount = await this.categorySpendingChart.count();
    if (chartCount === 0) {
      return true;
    }
    const emptyMessageCount = await this.emptyChartMessage.count();
    if (emptyMessageCount > 0) {
      const messageText = await this.emptyChartMessage.first().textContent();
      return messageText.toLowerCase().includes('no data') || messageText.toLowerCase().includes('no spending');
    }
    return false;
  }

  async verifyMonthlyTrendsEmptyState() {
    const chartCount = await this.monthlyTrendsChart.count();
    if (chartCount === 0) {
      return true;
    }
    const emptyMessageCount = await this.emptyChartMessage.count();
    if (emptyMessageCount > 0) {
      const messageText = await this.emptyChartMessage.first().textContent();
      return messageText.toLowerCase().includes('no data') || messageText.toLowerCase().includes('no transaction');
    }
    return false;
  }

  async verifyIncompleteDataIndicator(kpiLocator) {
    await expect(kpiLocator).toBeVisible();
    const indicatorInKPI = kpiLocator.locator('span:has-text("*"), .info-icon, i[class*="info"], [data-testid*="indicator"]');
    const indicatorCount = await indicatorInKPI.count();
    expect(indicatorCount).toBeGreaterThan(0);
  }

  async verifyIncompleteDataTooltip() {
    const indicatorCount = await this.incompleteDataIndicator.count();
    expect(indicatorCount).toBeGreaterThan(0);
  }

  async verifyIncompleteDataWarning() {
    const warningCount = await this.incompleteDataWarning.count();
    if (warningCount > 0) {
      await expect(this.incompleteDataWarning.first()).toBeVisible();
    } else {
      const messageCount = await this.incompleteDataMessage.count();
      expect(messageCount).toBeGreaterThan(0);
    }
  }

  async verifyComprehensiveIncompleteDataMessage() {
    await expect(this.incompleteDataMessage).toBeVisible();
    const messageText = await this.incompleteDataMessage.textContent();
    expect(messageText.toLowerCase()).toMatch(/incomplete|missing|unavailable/);
  }

  async verifyAllKPIsIncomplete() {
    const kpis = [this.monthlySpendKPI, this.totalCreditLimitKPI, this.availableCreditKPI, this.outstandingAmountKPI];
    
    for (const kpi of kpis) {
      await expect(kpi).toBeVisible();
      const kpiText = await kpi.textContent();
      const hasIndicator = kpiText.includes('*') || kpiText.toLowerCase().includes('n/a') || kpiText.includes('0');
      expect(hasIndicator).toBeTruthy();
    }
  }

  async hoverOverIncompleteDataIndicator(kpiLocator) {
    await expect(kpiLocator).toBeVisible();
    const indicator = kpiLocator.locator('span:has-text("*"), .info-icon, i[class*="info"]').first();
    await expect(indicator).toBeVisible();
    await indicator.hover();
  }

  async verifyTooltipContent(expectedPattern) {
    await expect(this.incompleteDataTooltip).toBeVisible();
    const tooltipText = await this.incompleteDataTooltip.textContent();
    expect(tooltipText.toLowerCase()).toMatch(expectedPattern);
  }

  async verifyTooltipActionableGuidance() {
    await expect(this.incompleteDataTooltip).toBeVisible();
    const tooltipText = await this.incompleteDataTooltip.textContent();
    const hasGuidance = tooltipText.toLowerCase().includes('update') || 
                        tooltipText.toLowerCase().includes('manage') || 
                        tooltipText.toLowerCase().includes('contact');
    expect(hasGuidance).toBeTruthy();
  }
};
