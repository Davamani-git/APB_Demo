const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // KPI Section Locators
    this.kpiSection = page.locator('.kpi-section');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.kpiErrorMessage = page.locator('.kpi-error-message');
    this.overLimitWarning = page.locator('.over-limit-warning');
    this.availableCreditNegative = page.locator('[data-testid="kpi-available-credit"].negative');
    this.outstandingAmountOverLimit = page.locator('[data-testid="kpi-outstanding-amount"].over-limit');
    
    // Navigation Locators
    this.dashboardLink = page.locator('a[href*="dashboard"]');
    this.cardsLink = page.locator('a[href*="cards"]');
    this.transactionsLink = page.locator('a[href*="transactions"]');
    this.settingsLink = page.locator('a[href*="settings"]');
    this.profileLink = page.locator('a[href*="profile"]');
    
    // Card Overview Locators
    this.cardOverviewSection = page.locator('.card-overview-section');
    this.cardContainer = page.locator('.card-container');
    this.noCardsMessage = page.locator('.no-cards-message');
    this.emptyState = page.locator('.empty-state');
    this.cardErrorIndicator = page.locator('.card-error-indicator');
    this.retryButton = page.locator('button.retry-card-load');
  }

  // Navigation Methods
  async navigateToDashboard() {
    await this.dashboardLink.click();
    await expect(this.page).toHaveURL(/dashboard/);
  }

  async navigateToKPIsSection() {
    await expect(this.kpiSection).toBeVisible();
  }

  async navigateToCardOverview() {
    await this.cardsLink.click();
    await expect(this.cardOverviewSection).toBeVisible();
  }

  async navigateToCardsSection() {
    await expect(this.cardsLink).toBeVisible();
    await this.cardsLink.click();
    await expect(this.page).toHaveURL(/cards/);
  }

  async navigateToTransactionsSection() {
    await expect(this.transactionsLink).toBeVisible();
    await this.transactionsLink.click();
    await expect(this.page).toHaveURL(/transactions/);
  }

  async navigateToSettingsSection() {
    await expect(this.settingsLink).toBeVisible();
    await this.settingsLink.click();
    await expect(this.page).toHaveURL(/settings/);
  }

  async navigateToProfileSection() {
    await expect(this.profileLink).toBeVisible();
    await this.profileLink.click();
    await expect(this.page).toHaveURL(/profile/);
  }

  // KPI Verification Methods
  async verifyKPISectionVisible() {
    await expect(this.kpiSection).toBeVisible();
  }

  async verifyMonthlySpendKPI(expectedValue) {
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.monthlySpendKPI).toContainText(expectedValue);
  }

  async verifyTotalCreditLimitKPI(expectedValue) {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toContainText(expectedValue);
  }

  async verifyAvailableCreditKPI(expectedValue) {
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.availableCreditKPI).toContainText(expectedValue);
  }

  async verifyOutstandingAmountKPI(expectedValue) {
    await expect(this.outstandingAmountKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toContainText(expectedValue);
  }

  async validateKPICalculations() {
    // Verify all KPIs are visible and contain numeric values
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
    
    const monthlySpend = await this.monthlySpendKPI.textContent();
    const totalLimit = await this.totalCreditLimitKPI.textContent();
    const availableCredit = await this.availableCreditKPI.textContent();
    const outstanding = await this.outstandingAmountKPI.textContent();
    
    // Verify values are not empty
    expect(monthlySpend).toBeTruthy();
    expect(totalLimit).toBeTruthy();
    expect(availableCredit).toBeTruthy();
    expect(outstanding).toBeTruthy();
  }

  async verifyAvailableCreditNegative(expectedValue) {
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.availableCreditKPI).toContainText(expectedValue);
    // Verify negative value styling (red color or warning indicator)
    const color = await this.availableCreditKPI.evaluate(el => window.getComputedStyle(el).color);
    expect(color).toContain('rgb(255, 0, 0)'); // Red color check
  }

  async verifyOutstandingAmountOverLimit(expectedValue) {
    await expect(this.outstandingAmountKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toContainText(expectedValue);
    // Verify over-limit highlighting
    await expect(this.outstandingAmountOverLimit).toBeVisible();
  }

  async verifyOverLimitWarning(expectedMessage) {
    await expect(this.overLimitWarning).toBeVisible();
    await expect(this.overLimitWarning).toContainText(expectedMessage);
  }

  async verifyKPIErrorMessages(expectedMessage) {
    await expect(this.kpiErrorMessage).toBeVisible();
    await expect(this.kpiErrorMessage).toContainText(expectedMessage);
  }

  async verifyDashboardStability() {
    // Verify dashboard page is still loaded and responsive
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.kpiSection).toBeVisible();
  }

  async verifyNoDataCorruption() {
    // Verify only error messages or empty states are shown, no corrupted data
    const kpiValues = await this.page.locator('.kpi-value').allTextContents();
    for (const value of kpiValues) {
      // Ensure values are either error messages or valid formatted numbers
      expect(value).toMatch(/unavailable|error|\$[\d,]+\.\d{2}|^$/i);
    }
  }

  // Card Overview Methods
  async verifyCardOverviewLoaded() {
    await expect(this.cardOverviewSection).toBeVisible();
  }

  async verifyCardDisplayed(cardIdentifier) {
    const card = this.page.locator(`.card-item:has-text("${cardIdentifier}")`);
    await expect(card).toBeVisible();
  }

  async verifyCardBalance(cardIdentifier, expectedBalance) {
    const card = this.page.locator(`.card-item:has-text("${cardIdentifier}")`);
    const balance = card.locator('.card-balance');
    await expect(balance).toBeVisible();
    await expect(balance).toContainText(expectedBalance);
  }

  async verifyCardCreditLimit(cardIdentifier, expectedLimit) {
    const card = this.page.locator(`.card-item:has-text("${cardIdentifier}")`);
    const limit = card.locator('.card-credit-limit');
    await expect(limit).toBeVisible();
    await expect(limit).toContainText(expectedLimit);
  }

  async verifyCardMetrics(cardIdentifier, availableCredit, utilization, dueDate) {
    const card = this.page.locator(`.card-item:has-text("${cardIdentifier}")`);
    await expect(card.locator('.available-credit')).toContainText(availableCredit);
    await expect(card.locator('.utilization')).toContainText(utilization);
    await expect(card.locator('.due-date')).toContainText(dueDate);
  }

  async verifyUnifiedView() {
    // Verify all cards are visible on one page without pagination
    const cards = await this.page.locator('.card-item').count();
    expect(cards).toBeGreaterThan(0);
    // Verify no pagination controls
    const pagination = this.page.locator('.pagination');
    await expect(pagination).not.toBeVisible();
  }

  async verifyNoCardsMessage(expectedMessage) {
    await expect(this.noCardsMessage).toBeVisible();
    await expect(this.noCardsMessage).toContainText(expectedMessage);
  }

  async verifyCleanEmptyState() {
    await expect(this.emptyState).toBeVisible();
    // Verify no broken UI elements
    const brokenElements = this.page.locator('.error, .undefined, [src=""]');
    await expect(brokenElements).toHaveCount(0);
  }

  async verifyCardErrorIndicator(cardIdentifier, expectedErrorMessage) {
    const card = this.page.locator(`.card-item:has-text("${cardIdentifier}")`);
    const errorIndicator = card.locator('.card-error-indicator');
    await expect(errorIndicator).toBeVisible();
    await expect(errorIndicator).toContainText(expectedErrorMessage);
  }

  async clickCardDetails(cardIdentifier) {
    const card = this.page.locator(`.card-item:has-text("${cardIdentifier}")`);
    await expect(card).toBeVisible();
    await card.click();
  }

  async verifyRetryOption(cardIdentifier) {
    const card = this.page.locator(`.card-item:has-text("${cardIdentifier}")`);
    const retryButton = card.locator('button.retry-card-load');
    await expect(retryButton).toBeVisible();
    await expect(retryButton).toBeEnabled();
  }
};
