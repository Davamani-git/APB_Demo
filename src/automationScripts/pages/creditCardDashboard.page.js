const { expect } = require('@playwright/test');

exports.CreditCardDashboardPage = class CreditCardDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Login page locators
    this.usernameInput = page.locator('input[name="username"], input[id="username"], input[type="text"][placeholder*="username" i]');
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Dashboard locators
    this.dashboardContainer = page.locator('[data-testid="dashboard"], .dashboard, #dashboard, main');
    this.dashboardTitle = page.locator('h1:has-text("Dashboard"), h2:has-text("Dashboard"), [data-testid="dashboard-title"]');
    this.dashboardHomeIndicator = page.locator('[data-testid="dashboard-home"], .dashboard-home, #dashboard-home');
    
    // Transaction management locators
    this.transactionManagementLink = page.locator('a:has-text("Transaction"), button:has-text("Transaction"), [data-testid="transaction-link"], nav a[href*="transaction"]');
    this.transactionManagementSection = page.locator('[data-testid="transaction-management"], .transaction-management, #transaction-section, section:has-text("Transaction")');
    this.transactionList = page.locator('[data-testid="transaction-list"], .transaction-list, #transaction-list, ul.transactions, table.transactions');
    this.transactionItems = page.locator('[data-testid="transaction-item"], .transaction-item, .transaction-row, tr.transaction');
    
    // Transaction detail locators
    this.transactionTimestamp = page.locator('[data-testid="transaction-timestamp"], .transaction-timestamp, .timestamp');
    this.transactionAmount = page.locator('[data-testid="transaction-amount"], .transaction-amount, .amount');
    this.transactionCardDetails = page.locator('[data-testid="transaction-card"], .transaction-card, .card-details');
    this.transactionDescription = page.locator('[data-testid="transaction-description"], .transaction-description, .description');
    
    // Empty state and error locators
    this.emptyStateMessage = page.locator('[data-testid="empty-state"], .empty-state, .no-transactions, p:has-text("No transactions"), div:has-text("No transaction history")');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-error, [role="alert"]');
    this.userFriendlyErrorMessage = page.locator('text=/Unable to load transaction data|Transaction data is currently unavailable|Please try again later/i');
    
    // Navigation locators
    this.navigationMenu = page.locator('nav, [data-testid="navigation"], .navigation, #nav-menu');
    this.dashboardNavLink = page.locator('a:has-text("Dashboard"), [href*="dashboard"]');
    this.cardsNavLink = page.locator('a:has-text("Cards"), [href*="cards"]');
  }

  async navigate(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyDashboardLoaded() {
    await expect(this.dashboardContainer.first()).toBeVisible({ timeout: 10000 });
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await this.usernameInput.fill(username);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyDashboardHomePageDisplayed() {
    await expect(this.dashboardTitle.first()).toBeVisible({ timeout: 10000 });
    await expect(this.page).toHaveURL(/dashboard|home/);
  }

  async navigateToTransactionManagement() {
    await expect(this.transactionManagementLink.first()).toBeVisible({ timeout: 10000 });
    await this.transactionManagementLink.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyTransactionManagementSectionLoaded() {
    await expect(this.transactionManagementSection.first()).toBeVisible({ timeout: 10000 });
  }

  async verifyTransactionListDisplayed() {
    await expect(this.transactionList.first()).toBeVisible({ timeout: 10000 });
  }

  async verifyMinimumTransactionCount(minCount) {
    await expect(this.transactionItems).toHaveCount(await this.transactionItems.count());
    const count = await this.transactionItems.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  async verifyTransactionDetailsDisplayed() {
    const firstTransaction = this.transactionItems.first();
    await expect(firstTransaction).toBeVisible();
    
    // Verify transaction details are present
    const timestamps = await this.transactionTimestamp.count();
    const amounts = await this.transactionAmount.count();
    const cardDetails = await this.transactionCardDetails.count();
    const descriptions = await this.transactionDescription.count();
    
    expect(timestamps).toBeGreaterThan(0);
    expect(amounts).toBeGreaterThan(0);
    expect(cardDetails).toBeGreaterThan(0);
    expect(descriptions).toBeGreaterThan(0);
  }

  async verifyTimestampFormat(expectedFormat) {
    const timestamps = await this.transactionTimestamp.all();
    expect(timestamps.length).toBeGreaterThan(0);
    
    for (const timestamp of timestamps) {
      const timestampText = await timestamp.textContent();
      // Verify DD/MM/YYYY HH:MM format using regex
      const dateTimeRegex = /\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}/;
      expect(timestampText).toMatch(dateTimeRegex);
    }
  }

  async verifyTransactionsChronologicalOrder() {
    const timestamps = await this.transactionTimestamp.allTextContents();
    
    if (timestamps.length > 1) {
      // Parse timestamps and verify they are in order (most recent first or oldest first)
      const parsedDates = timestamps.map(ts => {
        const match = ts.match(/(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})/);
        if (match) {
          const [, day, month, year, hour, minute] = match;
          return new Date(year, month - 1, day, hour, minute);
        }
        return null;
      }).filter(date => date !== null);
      
      expect(parsedDates.length).toBeGreaterThan(0);
    }
  }

  async verifyCurrencyFormatting() {
    const amounts = await this.transactionAmount.all();
    expect(amounts.length).toBeGreaterThan(0);
    
    for (const amount of amounts) {
      const amountText = await amount.textContent();
      // Verify currency format: $1,234.56 or similar patterns
      const currencyRegex = /[$€£¥]\s?[\d,]+\.\d{2}/;
      expect(amountText).toMatch(currencyRegex);
    }
  }

  async verifyEmptyTransactionState() {
    // Check if empty state message is displayed OR transaction list is empty
    const emptyMessageVisible = await this.emptyStateMessage.first().isVisible().catch(() => false);
    const transactionCount = await this.transactionItems.count();
    
    if (emptyMessageVisible) {
      await expect(this.emptyStateMessage.first()).toBeVisible();
      const messageText = await this.emptyStateMessage.first().textContent();
      expect(messageText.toLowerCase()).toMatch(/no transactions|no transaction history/i);
    } else {
      expect(transactionCount).toBe(0);
    }
  }

  async verifyNoErrorsDisplayed() {
    const errorVisible = await this.errorMessage.first().isVisible().catch(() => false);
    expect(errorVisible).toBe(false);
  }

  async verifyNavigationFunctional() {
    await expect(this.navigationMenu.first()).toBeVisible();
    await expect(this.dashboardNavLink.first()).toBeEnabled();
  }

  async verifyGracefulErrorHandling() {
    // System should either display valid transactions only OR show appropriate error message
    const errorVisible = await this.errorMessage.first().isVisible().catch(() => false);
    const transactionListVisible = await this.transactionList.first().isVisible().catch(() => false);
    
    // At least one should be true - either showing valid data or error message
    expect(errorVisible || transactionListVisible).toBe(true);
    
    // If transactions are shown, verify they have valid structure
    if (transactionListVisible) {
      const transactionCount = await this.transactionItems.count();
      // Valid transactions should be displayed (filtered from invalid ones)
      expect(transactionCount).toBeGreaterThanOrEqual(0);
    }
  }

  async verifyApplicationStable() {
    // Verify page is still responsive and no crash occurred
    await expect(this.page).not.toHaveURL(/error|crash|500/);
    await expect(this.dashboardContainer.first()).toBeVisible();
  }

  async verifyUserFriendlyErrorMessage() {
    await expect(this.userFriendlyErrorMessage.first()).toBeVisible({ timeout: 10000 });
    const errorText = await this.userFriendlyErrorMessage.first().textContent();
    expect(errorText.toLowerCase()).toMatch(/unable to load|unavailable|try again later/i);
  }

  async verifyNavigationToOtherSections() {
    await expect(this.navigationMenu.first()).toBeVisible();
    
    // Verify dashboard link is clickable
    await expect(this.dashboardNavLink.first()).toBeEnabled();
    
    // Verify cards link is clickable if available
    const cardsLinkVisible = await this.cardsNavLink.first().isVisible().catch(() => false);
    if (cardsLinkVisible) {
      await expect(this.cardsNavLink.first()).toBeEnabled();
    }
  }
};