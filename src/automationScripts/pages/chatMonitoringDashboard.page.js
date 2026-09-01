const { expect } = require('@playwright/test');

exports.ChatMonitoringDashboardPage = class ChatMonitoringDashboardPage {
  constructor(page) {
    this.page = page;
    
    // Login Page Locators
    this.loginPageContainer = page.locator('[data-testid="login-page"], .login-container, form[name="login"]');
    this.usernameInput = page.locator('[data-testid="username-input"], input[name="username"], #username');
    this.passwordInput = page.locator('[data-testid="password-input"], input[name="password"], #password');
    this.loginButton = page.locator('[data-testid="login-button"], button[type="submit"], .login-btn');
    this.authenticationErrorMessage = page.locator('[data-testid="auth-error"], .authentication-error, .login-error');
    
    // Dashboard Locators
    this.dashboardContainer = page.locator('[data-testid="dashboard"], .monitoring-dashboard, .dashboard-container');
    this.chatInteractionLogs = page.locator('[data-testid="chat-logs"], .interaction-logs, .chat-log-table');
    this.chatLogEntry = page.locator('[data-testid="log-entry"], .log-row, .chat-interaction-item');
    
    // Filter Locators
    this.dateRangePicker = page.locator('[data-testid="date-range-picker"], .date-filter, input[type="date"]');
    this.startDateInput = page.locator('[data-testid="start-date"], input[name="startDate"], #start-date');
    this.endDateInput = page.locator('[data-testid="end-date"], input[name="endDate"], #end-date');
    this.queryTypeDropdown = page.locator('[data-testid="query-type-dropdown"], select[name="queryType"], .query-filter');
    this.applyFiltersButton = page.locator('[data-testid="apply-filters"], button:has-text("Apply"), .filter-submit-btn');
    this.filteredResults = page.locator('[data-testid="filtered-results"], .filtered-logs, .search-results');
    
    // Access Control Locators
    this.accessDeniedMessage = page.locator('[data-testid="access-denied"], .access-denied-message, .unauthorized');
  }

  async navigate() {
    await this.page.goto('/chat-monitoring-dashboard');
  }

  async navigateDirectlyToDashboard() {
    await this.page.goto('/chat-monitoring-dashboard/dashboard');
  }

  async verifyLoginPageLoaded() {
    await expect(this.loginPageContainer).toBeVisible({ timeout: 2000 });
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async enterUsername(username) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }

  async verifyCredentialsAccepted() {
    await expect(this.usernameInput).not.toBeEmpty();
    await expect(this.passwordInput).not.toBeEmpty();
  }

  async clickLoginButton() {
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async verifyAuthenticationSuccess() {
    await this.page.waitForURL(/.*dashboard.*/, { timeout: 5000 });
  }

  async verifyRedirectedToDashboard() {
    await expect(this.dashboardContainer).toBeVisible({ timeout: 5000 });
    expect(this.page.url()).toContain('dashboard');
  }

  async viewChatInteractionLogs() {
    await expect(this.chatInteractionLogs).toBeVisible();
  }

  async verifyChatLogsDisplayed() {
    await expect(this.chatInteractionLogs).toBeVisible();
    const logCount = await this.chatLogEntry.count();
    expect(logCount).toBeGreaterThan(0);
    
    // Verify logs contain expected information
    await expect(this.chatInteractionLogs).toContainText(/query|response|pattern|gap/i);
  }

  async verifyAuthenticationError() {
    await expect(this.authenticationErrorMessage).toBeVisible();
    await expect(this.authenticationErrorMessage).toContainText(/denied|invalid|unauthorized|incorrect/i);
  }

  async verifyAccessDenied() {
    const accessDenied = await this.accessDeniedMessage.isVisible().catch(() => false);
    const onLoginPage = await this.loginPageContainer.isVisible().catch(() => false);
    expect(accessDenied || onLoginPage).toBeTruthy();
  }

  async verifyRedirectedToLogin() {
    await expect(this.loginPageContainer).toBeVisible({ timeout: 5000 });
    expect(this.page.url()).toContain('login');
  }

  async loginWithValidCredentials(username, password) {
    await this.navigate();
    await this.verifyLoginPageLoaded();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.verifyAuthenticationSuccess();
  }

  async verifyDashboardLoadedWithData() {
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.chatInteractionLogs).toBeVisible();
  }

  async selectDateRangeFilter(startDate, endDate) {
    await expect(this.startDateInput).toBeVisible();
    await this.startDateInput.fill(startDate);
    
    await expect(this.endDateInput).toBeVisible();
    await this.endDateInput.fill(endDate);
  }

  async verifyDateRangePickerAccepted() {
    await expect(this.startDateInput).not.toBeEmpty();
    await expect(this.endDateInput).not.toBeEmpty();
  }

  async selectQueryTypeFilter(queryType) {
    await expect(this.queryTypeDropdown).toBeVisible();
    await this.queryTypeDropdown.selectOption({ label: queryType });
  }

  async verifyQueryTypeDropdownAccepted() {
    const selectedValue = await this.queryTypeDropdown.inputValue();
    expect(selectedValue).not.toBe('');
  }

  async applyFilters() {
    await expect(this.applyFiltersButton).toBeEnabled();
    await this.applyFiltersButton.click();
  }

  async verifyFilteredResultsDisplayed() {
    await expect(this.filteredResults).toBeVisible();
    await expect(this.filteredResults).toContainText(/trend|pattern/i);
  }
};
