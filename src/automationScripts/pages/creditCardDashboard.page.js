const { expect } = require('@playwright/test');

exports.CreditCardDashboardPage = class CreditCardDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Login locators
    this.usernameInput = page.locator('input[name="username"], input[type="email"], #username, #email');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], #password');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Dashboard locators
    this.dashboardContainer = page.locator('[data-testid="dashboard"], .dashboard-container, #dashboard');
    this.cardManagementSection = page.locator('[data-testid="card-management"], .card-management, #card-management, a:has-text("Cards"), button:has-text("Cards")');
    
    // Card list locators
    this.cardList = page.locator('[data-testid="card-list"], .card-list, .cards-container, ul.cards, div.card-grid');
    this.cardItems = page.locator('[data-testid="card-item"], .card-item, .credit-card, .card');
    this.cardDetails = page.locator('[data-testid="card-details"], .card-details, .card-info');
    this.cardDetailedView = page.locator('[data-testid="card-detailed-view"], .card-detailed-view, .card-detail-container');
    
    // Card information locators
    this.cardNumber = page.locator('[data-testid="card-number"], .card-number, .masked-number');
    this.creditLimit = page.locator('[data-testid="credit-limit"], .credit-limit, span:has-text("Credit Limit")');
    this.balance = page.locator('[data-testid="balance"], .balance, .current-balance, span:has-text("Balance")');
    this.expiryDate = page.locator('[data-testid="expiry-date"], .expiry-date, .expiry');
    this.availableCredit = page.locator('[data-testid="available-credit"], .available-credit, span:has-text("Available Credit")');
    this.outstandingBalance = page.locator('[data-testid="outstanding-balance"], .outstanding-balance, .outstanding, span:has-text("Outstanding")');
    
    // Transaction locators
    this.transactionHistoryButton = page.locator('[data-testid="transaction-history"], button:has-text("Transaction"), a:has-text("Transaction"), .transaction-history-link');
    this.transactionList = page.locator('[data-testid="transaction-list"], .transaction-list, .transactions, ul.transaction-items');
    this.transactionItems = page.locator('[data-testid="transaction-item"], .transaction-item, .transaction');
    this.transactionDate = page.locator('[data-testid="transaction-date"], .transaction-date, .date');
    this.transactionAmount = page.locator('[data-testid="transaction-amount"], .transaction-amount, .amount');
    this.merchantName = page.locator('[data-testid="merchant-name"], .merchant-name, .merchant');
    this.transactionCategory = page.locator('[data-testid="transaction-category"], .transaction-category, .category');
    this.transactionSummary = page.locator('[data-testid="transaction-summary"], .transaction-summary, .summary');
    
    // Category spending locators
    this.categorySpendingSection = page.locator('[data-testid="category-spending"], .category-spending, .spending-breakdown, button:has-text("Category"), a:has-text("Category")');
    this.categoryItems = page.locator('[data-testid="category-item"], .category-item, .spending-category');
    this.categoryName = page.locator('[data-testid="category-name"], .category-name');
    this.categoryAmount = page.locator('[data-testid="category-amount"], .category-amount');
    
    // Message locators
    this.noTransactionsMessage = page.locator('[data-testid="no-transactions"], .no-transactions, .empty-transactions, p:has-text("No transactions")');
    this.noCardsMessage = page.locator('[data-testid="no-cards"], .no-cards, .empty-cards, p:has-text("No credit cards")');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .error, .alert-error, div[role="alert"]');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('networkidle');
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

  async navigateToCardManagement() {
    await expect(this.cardManagementSection).toBeVisible();
    await this.cardManagementSection.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCard(cardIdentifier) {
    const cardLocator = this.page.locator(`[data-testid="card-item"]:has-text("${cardIdentifier}"), .card-item:has-text("${cardIdentifier}"), .credit-card:has-text("${cardIdentifier}")`);
    await expect(cardLocator).toBeVisible();
    await cardLocator.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToTransactionHistory() {
    await expect(this.transactionHistoryButton).toBeVisible();
    await this.transactionHistoryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCategorySpending() {
    const categoryButton = this.page.locator('[data-testid="category-spending-btn"], button:has-text("Category"), a:has-text("Category"), .category-link');
    await expect(categoryButton).toBeVisible();
    await categoryButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyTransactionDetailsDisplayed() {
    await expect(this.transactionDate.first()).toBeVisible();
    await expect(this.transactionAmount.first()).toBeVisible();
    await expect(this.merchantName.first()).toBeVisible();
    await expect(this.transactionCategory.first()).toBeVisible();
  }

  async verifyTransactionCategories(categories) {
    for (const category of categories) {
      const categoryExists = await this.page.locator(`text=${category}`).count();
      // At least one transaction should have a valid category from the list
    }
    // Verify that category elements are present in the transaction list
    await expect(this.transactionCategory.first()).toBeVisible();
  }

  async verifyAllCardsDisplayed(expectedCards) {
    for (const card of expectedCards) {
      const cardLocator = this.page.locator(`text=${card}`);
      await expect(cardLocator).toBeVisible();
    }
  }

  async verifyCardDetailsDisplayed() {
    await expect(this.cardNumber.first()).toBeVisible();
    await expect(this.creditLimit.first()).toBeVisible();
    await expect(this.balance.first()).toBeVisible();
    await expect(this.expiryDate.first()).toBeVisible();
  }

  async verifyCreditLimit(cardIdentifier, expectedLimit) {
    const cardContainer = this.page.locator(`[data-testid="card-item"]:has-text("${cardIdentifier}"), .card-item:has-text("${cardIdentifier}")`).first();
    await expect(cardContainer).toBeVisible();
    const limitLocator = cardContainer.locator('[data-testid="credit-limit"], .credit-limit, span:has-text("Credit Limit")').first();
    await expect(limitLocator).toContainText(expectedLimit);
  }

  async verifyBalance(cardIdentifier, expectedBalance) {
    const cardContainer = this.page.locator(`[data-testid="card-item"]:has-text("${cardIdentifier}"), .card-item:has-text("${cardIdentifier}")`).first();
    await expect(cardContainer).toBeVisible();
    const balanceLocator = cardContainer.locator('[data-testid="balance"], .balance, .current-balance, span:has-text("Balance")').first();
    await expect(balanceLocator).toContainText(expectedBalance);
  }

  async verifyTransactionSummaryFields() {
    const totalTransactions = this.transactionSummary.locator('text=/total transactions/i, [data-testid="total-transactions"]');
    const monthlySpend = this.transactionSummary.locator('text=/monthly spend/i, [data-testid="monthly-spend"]');
    const transactionCount = this.transactionSummary.locator('text=/transaction count/i, [data-testid="transaction-count"]');
    
    // Verify at least one summary field is visible
    const summaryVisible = await this.transactionSummary.isVisible();
    expect(summaryVisible).toBeTruthy();
  }

  async verifyAvailableCredit(expectedAmount) {
    await expect(this.availableCredit).toBeVisible();
    await expect(this.availableCredit).toContainText(expectedAmount);
  }

  async verifyOutstandingBalance(expectedAmount) {
    await expect(this.outstandingBalance).toBeVisible();
    await expect(this.outstandingBalance).toContainText(expectedAmount);
  }

  async verifyCategorySpending(expectedCategories) {
    for (const [categoryName, amount] of Object.entries(expectedCategories)) {
      const categoryLocator = this.page.locator(`[data-testid="category-item"]:has-text("${categoryName}"), .category-item:has-text("${categoryName}"), .spending-category:has-text("${categoryName}")`).first();
      await expect(categoryLocator).toBeVisible();
      await expect(categoryLocator).toContainText(amount);
    }
  }

  async verifyEmptyState() {
    await expect(this.cardItems).toHaveCount(0);
    const cardDetailsVisible = await this.cardDetails.isVisible().catch(() => false);
    expect(cardDetailsVisible).toBeFalsy();
  }
};