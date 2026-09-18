const { expect } = require('@playwright/test');

exports.DashboardPage = class DashboardPage {

  constructor(page) {
    this.page = page;
    this.dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    this.cardList = page.locator('[data-testid="card-list"]');
    this.cardItem = page.locator('[data-testid="card-item"]');
    this.cardSelectionControl = page.locator('[data-testid="card-selection-control"]');
    this.monthlySpendKPI = page.locator('[data-testid="monthly-spend-kpi"]');
    this.totalCreditLimitKPI = page.locator('[data-testid="total-credit-limit-kpi"]');
    this.availableCreditKPI = page.locator('[data-testid="available-credit-kpi"]');
    this.outstandingAmountKPI = page.locator('[data-testid="outstanding-amount-kpi"]');
    this.cardNumber = page.locator('[data-testid="card-number"]');
    this.cvvField = page.locator('[data-testid="cvv"]');
    this.noCardsMessage = page.locator('[data-testid="no-cards-message"]');
    this.transactionList = page.locator('[data-testid="transaction-list"]');
    this.transactionItem = page.locator('[data-testid="transaction-item"]');
    this.outstandingAmountDisplay = page.locator('[data-testid="outstanding-amount-display"]');
    this.availableCreditDisplay = page.locator('[data-testid="available-credit-display"]');
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions-message"]');
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.deactivatedCardError = page.locator('[data-testid="deactivated-card-error"]');
  }

  async navigate() {
    await this.page.goto('/dashboard');
  }

  async navigateAsUserWithNoCards() {
    await this.page.goto('/dashboard?user=no-cards');
  }

  async verifyDashboardLoaded() {
    await expect(this.dashboardContainer).toBeVisible();
  }

  async verifyAllCardsDisplayed(cardNames) {
    for (const cardName of cardNames) {
      const card = this.page.locator(`[data-testid="card-item"]`, { hasText: cardName });
      await expect(card).toBeVisible();
    }
  }

  async verifyMonthlySpendKPI(cardName, expectedAmount) {
    const cardContainer = this.page.locator(`[data-testid="card-item"]`, { hasText: cardName });
    const monthlySpend = cardContainer.locator('[data-testid="monthly-spend-kpi"]');
    await expect(monthlySpend).toContainText(expectedAmount);
  }

  async verifyTotalCreditLimitKPI(cardName, expectedLimit) {
    const cardContainer = this.page.locator(`[data-testid="card-item"]`, { hasText: cardName });
    const creditLimit = cardContainer.locator('[data-testid="total-credit-limit-kpi"]');
    await expect(creditLimit).toContainText(expectedLimit);
  }

  async verifyAvailableCreditKPI(cardName, expectedCredit) {
    const cardContainer = this.page.locator(`[data-testid="card-item"]`, { hasText: cardName });
    const availableCredit = cardContainer.locator('[data-testid="available-credit-kpi"]');
    await expect(availableCredit).toContainText(expectedCredit);
  }

  async verifyOutstandingAmountKPI(cardName, expectedAmount) {
    const cardContainer = this.page.locator(`[data-testid="card-item"]`, { hasText: cardName });
    const outstandingAmount = cardContainer.locator('[data-testid="outstanding-amount-kpi"]');
    await expect(outstandingAmount).toContainText(expectedAmount);
  }

  async verifyCardNumberMasked(cardName) {
    const cardContainer = this.page.locator(`[data-testid="card-item"]`, { hasText: cardName });
    const cardNumber = cardContainer.locator('[data-testid="card-number"]');
    const cardNumberText = await cardNumber.textContent();
    expect(cardNumberText).toMatch(/\*{4}\s\*{4}\s\*{4}\s\d{4}|ending in \d{4}/i);
  }

  async verifyCVVNotDisplayed() {
    await expect(this.cvvField).not.toBeVisible();
  }

  async verifySensitiveDetailsProtected() {
    const pageContent = await this.page.content();
    expect(pageContent).not.toMatch(/\b\d{3,4}\b.*cvv/i);
    expect(pageContent).not.toMatch(/\b\d{16}\b/);
  }

  async verifyNoCardsMessage(expectedMessage) {
    await expect(this.noCardsMessage).toBeVisible();
    await expect(this.noCardsMessage).toContainText(expectedMessage);
  }

  async verifyNoEmptyDashboardElements() {
    await expect(this.monthlySpendKPI).not.toBeVisible();
    await expect(this.totalCreditLimitKPI).not.toBeVisible();
  }

  async verifyAllKPIsDisplayed(kpiNames) {
    for (const kpiName of kpiNames) {
      const kpi = this.page.locator(`[data-testid*="kpi"]`, { hasText: kpiName });
      await expect(kpi).toBeVisible();
    }
  }

  async verifyCardListingClear(cardNames) {
    await expect(this.cardList).toBeVisible();
    for (const cardName of cardNames) {
      const card = this.page.locator(`[data-testid="card-item"]`, { hasText: cardName });
      await expect(card).toBeVisible();
    }
  }

  async verifyCardSelectionControlsAccessible() {
    await expect(this.cardSelectionControl).toBeVisible();
    await expect(this.cardSelectionControl).toBeEnabled();
  }

  async verifyDesktopLayoutAdaptation() {
    const dashboardWidth = await this.dashboardContainer.boundingBox();
    expect(dashboardWidth.width).toBeGreaterThan(1200);
  }

  async verifyNoHorizontalScrolling() {
    const scrollWidth = await this.page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await this.page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  }

  async verifyMobileLayoutAdaptation() {
    const dashboardWidth = await this.dashboardContainer.boundingBox();
    expect(dashboardWidth.width).toBeLessThanOrEqual(400);
  }

  async verifyAllKPIsDisplayedOnMobile() {
    await expect(this.monthlySpendKPI.first()).toBeVisible();
    await expect(this.totalCreditLimitKPI.first()).toBeVisible();
    await expect(this.availableCreditKPI.first()).toBeVisible();
    await expect(this.outstandingAmountKPI.first()).toBeVisible();
  }

  async verifyCardListingAccessibleOnMobile() {
    await expect(this.cardList).toBeVisible();
    const cardCount = await this.cardItem.count();
    expect(cardCount).toBeGreaterThan(0);
  }

  async verifyTouchFriendlyControls() {
    const controlBox = await this.cardSelectionControl.first().boundingBox();
    expect(controlBox.width).toBeGreaterThanOrEqual(44);
    expect(controlBox.height).toBeGreaterThanOrEqual(44);
  }

  async verifyNoHorizontalScrollingOnMobile() {
    const scrollWidth = await this.page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await this.page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  }

  async verifyLoadingIndicatorDisplayed() {
    await expect(this.loadingIndicator).toBeVisible({ timeout: 5000 });
  }

  async verifyDataIntegrity() {
    await expect(this.monthlySpendKPI.first()).toBeVisible();
    const monthlySpendText = await this.monthlySpendKPI.first().textContent();
    expect(monthlySpendText).toMatch(/\$[\d,]+/);
  }

  async verifyNoTimeoutErrors() {
    await expect(this.errorMessage.filter({ hasText: /timeout/i })).not.toBeVisible();
  }

  async verifyCardSelectionControlDisplaysCards(cardNames) {
    await expect(this.cardSelectionControl).toBeVisible();
    for (const cardName of cardNames) {
      const option = this.cardSelectionControl.locator('option', { hasText: cardName });
      await expect(option).toBeAttached();
    }
  }

  async selectCard(cardName) {
    await this.cardSelectionControl.selectOption({ label: cardName });
  }

  async verifyCardSelected(cardName) {
    const selectedValue = await this.cardSelectionControl.inputValue();
    expect(selectedValue).toContain(cardName);
  }

  async verifyTransactionListDisplayed(expectedCount) {
    await expect(this.transactionList).toBeVisible();
    const transactionCount = await this.transactionItem.count();
    expect(transactionCount).toBe(expectedCount);
  }

  async verifyOutstandingAmountDisplayed(expectedAmount) {
    await expect(this.outstandingAmountDisplay).toBeVisible();
    await expect(this.outstandingAmountDisplay).toContainText(expectedAmount);
  }

  async verifyAvailableCreditDisplayed(expectedCredit) {
    await expect(this.availableCreditDisplay).toBeVisible();
    await expect(this.availableCreditDisplay).toContainText(expectedCredit);
  }

  async verifyCardNumberMaskedInTransactions(expectedFormat) {
    const transactionCardNumber = this.transactionList.locator('[data-testid="transaction-card-number"]').first();
    await expect(transactionCardNumber).toContainText(expectedFormat);
  }

  async verifyCVVNotDisplayedInTransactions() {
    const cvvInTransactions = this.transactionList.locator('[data-testid="cvv"]');
    await expect(cvvInTransactions).not.toBeVisible();
  }

  async verifyNoSensitivePaymentDataExposed() {
    const transactionContent = await this.transactionList.textContent();
    expect(transactionContent).not.toMatch(/\b\d{16}\b/);
    expect(transactionContent).not.toMatch(/\bcvv\b.*\d{3,4}/i);
  }

  async verifyTransactionDetailsAppropriate(date, merchant, amount, type) {
    const transaction = this.transactionItem.filter({ hasText: merchant });
    await expect(transaction).toContainText(date);
    await expect(transaction).toContainText(amount);
    await expect(transaction).toContainText(type);
  }

  async verifyNoTransactionsMessage(expectedMessage) {
    await expect(this.noTransactionsMessage).toBeVisible();
    await expect(this.noTransactionsMessage).toContainText(expectedMessage);
  }

  async verifyCardDataDisplayed(cardName) {
    const cardContainer = this.page.locator(`[data-testid="selected-card-container"]`, { hasText: cardName });
    await expect(cardContainer).toBeVisible();
  }

  async verifyCardSpecificData(cardName, outstandingAmount, availableCredit) {
    await this.verifyCardDataDisplayed(cardName);
    await this.verifyOutstandingAmountDisplayed(outstandingAmount);
    await this.verifyAvailableCreditDisplayed(availableCredit);
  }

  async verifyDataIntegrityAcrossSelections() {
    const outstandingText = await this.outstandingAmountDisplay.textContent();
    const availableText = await this.availableCreditDisplay.textContent();
    expect(outstandingText).toMatch(/\$[\d,]+/);
    expect(availableText).toMatch(/\$[\d,]+/);
  }

  async attemptSelectDeactivatedCard(cardName) {
    try {
      await this.cardSelectionControl.selectOption({ label: cardName });
    } catch (error) {
      // Expected to fail or show error
    }
  }

  async verifyDeactivatedCardErrorMessage(expectedMessage) {
    await expect(this.deactivatedCardError).toBeVisible();
    await expect(this.deactivatedCardError).toContainText(expectedMessage);
  }

  async verifyDashboardRemainsOnActiveCard(cardName) {
    const selectedCard = await this.cardSelectionControl.inputValue();
    expect(selectedCard).toContain(cardName);
  }

};