const { expect } = require('@playwright/test');

exports.CreditCardDashboardPage = class CreditCardDashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    this.monthlySpendKPI = page.locator('[data-testid="kpi-monthly-spend"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="kpi-total-credit-limit"]');
    this.availableCreditKPI = page.locator('[data-testid="kpi-available-credit"]');
    this.outstandingAmountKPI = page.locator('[data-testid="kpi-outstanding-amount"]');
    this.cardListingComponent = page.locator('[data-testid="card-listing"]');
    this.cardItems = page.locator('[data-testid="card-item"]');
    this.maskedCardNumbers = page.locator('[data-testid="masked-card-number"]');
    this.transactionSummarySection = page.locator('[data-testid="transaction-summary"]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.deactivatedCardIndicator = page.locator('[data-testid="deactivated-card"]');
  }

  async waitForDashboardToLoad() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 10000 });
  }

  async getLinkedCardsCount() {
    await expect(this.cardListingComponent).toBeVisible();
    return await this.cardItems.count();
  }

  async getMonthlySpendValue() {
    await expect(this.monthlySpendKPI).toBeVisible();
    return await this.monthlySpendKPI.textContent();
  }

  async getTotalCreditLimitValue() {
    await expect(this.totalCreditLimitKPI).toBeVisible();
    return await this.totalCreditLimitKPI.textContent();
  }

  async getAvailableCreditValue() {
    await expect(this.availableCreditKPI).toBeVisible();
    return await this.availableCreditKPI.textContent();
  }

  async getOutstandingAmountValue() {
    await expect(this.outstandingAmountKPI).toBeVisible();
    return await this.outstandingAmountKPI.textContent();
  }

  async verifyCardNumbersMasked() {
    const count = await this.maskedCardNumbers.count();
    for (let i = 0; i < count; i++) {
      const cardNumber = await this.maskedCardNumbers.nth(i).textContent();
      expect(cardNumber).toMatch(/XXXX-XXXX-XXXX-\d{4}/);
    }
  }

  async verifyCardNumberMasked(expectedMaskedNumber) {
    const cardNumber = await this.maskedCardNumbers.first().textContent();
    expect(cardNumber).toBe(expectedMaskedNumber);
  }

  async verifyResponsiveLayout(deviceType) {
    await expect(this.dashboardContainer).toBeVisible();
    const boundingBox = await this.dashboardContainer.boundingBox();
    expect(boundingBox).not.toBeNull();
    
    if (deviceType === 'desktop') {
      expect(boundingBox.width).toBeGreaterThan(1200);
    } else if (deviceType === 'tablet') {
      expect(boundingBox.width).toBeGreaterThan(768);
      expect(boundingBox.width).toBeLessThanOrEqual(1024);
    } else if (deviceType === 'mobile') {
      expect(boundingBox.width).toBeLessThanOrEqual(768);
    }
  }

  async verifyAllKPIsVisible() {
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
  }

  async verifyNoKPIsDisplayed() {
    const monthlySpendVisible = await this.monthlySpendKPI.isVisible().catch(() => false);
    const totalCreditVisible = await this.totalCreditLimitKPI.isVisible().catch(() => false);
    const availableCreditVisible = await this.availableCreditKPI.isVisible().catch(() => false);
    const outstandingVisible = await this.outstandingAmountKPI.isVisible().catch(() => false);
    
    expect(monthlySpendVisible || totalCreditVisible || availableCreditVisible || outstandingVisible).toBe(false);
  }

  async selectCardByMaskedNumber(maskedNumber) {
    const cardItem = this.page.locator(`[data-testid="card-item"][data-card-number="${maskedNumber}"]`);
    await expect(cardItem).toBeVisible();
    await cardItem.click();
  }

  async waitForCardDataToUpdate() {
    await this.page.waitForTimeout(500);
    await expect(this.dashboardContainer).toBeVisible();
  }

  async captureCurrentKPIs() {
    return {
      monthlySpend: await this.getMonthlySpendValue(),
      totalCreditLimit: await this.getTotalCreditLimitValue(),
      availableCredit: await this.getAvailableCreditValue(),
      outstandingAmount: await this.getOutstandingAmountValue()
    };
  }

  async getDeactivatedCard(maskedNumber) {
    return this.page.locator(`[data-testid="card-item"][data-card-number="${maskedNumber}"][data-status="deactivated"]`);
  }

  async attemptToSelectDeactivatedCard(maskedNumber) {
    const deactivatedCard = await this.getDeactivatedCard(maskedNumber);
    await deactivatedCard.click();
  }

  async selectNewCardWithZeroTransactions() {
    const newCard = this.page.locator('[data-testid="card-item"][data-transaction-count="0"]').first();
    await expect(newCard).toBeVisible();
    await newCard.click();
  }

  async selectCardWithMultipleTransactions() {
    const cardWithTransactions = this.page.locator('[data-testid="card-item"]').filter({ hasText: '50+' }).first();
    await expect(cardWithTransactions).toBeVisible();
    await cardWithTransactions.click();
  }

  async verifyKPIsConsistentWithFilteredData() {
    await expect(this.monthlySpendKPI).toBeVisible();
    await expect(this.totalCreditLimitKPI).toBeVisible();
    await expect(this.availableCreditKPI).toBeVisible();
    await expect(this.outstandingAmountKPI).toBeVisible();
  }
};