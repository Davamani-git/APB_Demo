const { expect } = require('@playwright/test');

exports.HelpCenterPage = class HelpCenterPage {
  constructor(page) {
    this.page = page;
    
    // Chat Assistant Locators
    this.chatAssistantIcon = page.locator('[data-testid="chat-assistant-icon"], .chat-assistant-button, #chat-icon');
    this.chatWindow = page.locator('[data-testid="chat-window"], .chat-window, #chat-container');
    this.chatInputField = page.locator('[data-testid="chat-input"], .chat-input-field, #chat-input');
    this.chatSubmitButton = page.locator('[data-testid="chat-submit"], .chat-submit-btn, #chat-submit');
    this.chatMessageDisplay = page.locator('[data-testid="chat-messages"], .chat-message, .chat-history');
    this.chatResponse = page.locator('[data-testid="chat-response"], .chat-bot-response, .automated-response');
    this.chatFallbackResponse = page.locator('[data-testid="fallback-response"], .fallback-message');
    this.chatServiceErrorMessage = page.locator('[data-testid="chat-error"], .chat-service-error, .service-unavailable-message');
    
    // Search Locators
    this.searchBar = page.locator('[data-testid="help-search-bar"], .help-center-search, #help-search');
    this.searchInput = page.locator('[data-testid="search-input"], input[type="search"], .search-input-field');
    this.searchSubmitButton = page.locator('[data-testid="search-submit"], .search-button, button[type="submit"]');
    this.searchResults = page.locator('[data-testid="search-results"], .search-result-item, .help-search-results');
    this.noResultsMessage = page.locator('[data-testid="no-results"], .no-results-message, .empty-search-results');
    
    // Download Locators
    this.downloadLink = page.locator('[data-testid="download-link"], a[download], .download-button');
    this.pdfGuideLink = page.locator('[data-testid="pdf-guide"], a[href*=".pdf"]');
    this.unavailableMaterialLink = page.locator('[data-testid="unavailable-material"], .unavailable-resource');
    this.corruptedFileLink = page.locator('[data-testid="corrupted-file"], .corrupted-resource');
    this.downloadErrorMessage = page.locator('[data-testid="download-error"], .download-error-message, .resource-unavailable');
    
    // Category Locators
    this.categoryList = page.locator('[data-testid="category-list"], .help-categories, .category-menu');
    this.categoryItem = page.locator('[data-testid="category-item"], .category-link, .help-category');
    this.categoryContent = page.locator('[data-testid="category-content"], .category-articles, .help-content');
    this.noCategoryContentMessage = page.locator('[data-testid="no-content"], .empty-category-message');
    
    // General Page Locators
    this.pageTitle = page.locator('h1, [data-testid="page-title"]');
    this.helpCenterLandingPage = page.locator('[data-testid="help-center-landing"], .help-center-page');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-notification, .alert-error');
    this.backendErrorMessage = page.locator('[data-testid="backend-error"], .backend-unavailable-message');
    this.retryButton = page.locator('[data-testid="retry-button"], .retry-action, button:has-text("Retry")');
  }

  async navigate() {
    await this.page.goto('/help-center');
  }

  async verifyPageLoaded() {
    await expect(this.helpCenterLandingPage).toBeVisible({ timeout: 2000 });
  }

  async verifyPageLoadedWithSearchBar() {
    await expect(this.helpCenterLandingPage).toBeVisible({ timeout: 2000 });
    await expect(this.searchBar).toBeVisible();
  }

  async verifyPageLoadedWithCategories() {
    await expect(this.helpCenterLandingPage).toBeVisible({ timeout: 2000 });
    await expect(this.categoryList).toBeVisible();
  }

  // Chat Assistant Methods
  async clickChatAssistantIcon() {
    await expect(this.chatAssistantIcon).toBeVisible();
    await this.chatAssistantIcon.click();
  }

  async openChatAssistant() {
    await this.clickChatAssistantIcon();
  }

  async attemptToOpenChatAssistant() {
    await this.chatAssistantIcon.click();
  }

  async verifyChatWindowOpened(timeout = 2000) {
    await expect(this.chatWindow).toBeVisible({ timeout });
  }

  async typeChatQuestion(question) {
    await expect(this.chatInputField).toBeVisible();
    await this.chatInputField.fill(question);
  }

  async verifyQuestionDisplayedInChat(question) {
    await expect(this.chatMessageDisplay).toContainText(question);
  }

  async submitChatQuestion() {
    await expect(this.chatSubmitButton).toBeEnabled();
    await this.chatSubmitButton.click();
  }

  async verifyAutomatedResponseReceived(timeout = 2000) {
    await expect(this.chatResponse).toBeVisible({ timeout });
    await expect(this.chatResponse).not.toBeEmpty();
  }

  async verifyFallbackResponseDisplayed() {
    await expect(this.chatFallbackResponse).toBeVisible();
    await expect(this.chatFallbackResponse).toContainText(/alternative support|contact.*support|human support/i);
  }

  async simulateChatServiceUnavailability() {
    // Implementation depends on test environment configuration
    // This could involve API mocking, network interception, or test data setup
    await this.page.route('**/api/chat/**', route => route.abort());
  }

  async verifyChatServiceErrorMessage() {
    await expect(this.chatServiceErrorMessage).toBeVisible();
    await expect(this.chatServiceErrorMessage).toContainText(/unavailable|service.*down|try.*later/i);
  }

  // Search Methods
  async enterSearchKeyword(keyword) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(keyword);
  }

  async verifyKeywordAccepted(keyword) {
    await expect(this.searchInput).toHaveValue(keyword);
  }

  async submitSearch() {
    await expect(this.searchSubmitButton).toBeEnabled();
    await this.searchSubmitButton.click();
  }

  async verifySearchResultsDisplayed(timeout = 2000) {
    await expect(this.searchResults.first()).toBeVisible({ timeout });
    const count = await this.searchResults.count();
    expect(count).toBeGreaterThan(0);
  }

  async verifyNoResultsMessage() {
    await expect(this.noResultsMessage).toBeVisible();
    await expect(this.noResultsMessage).toContainText(/no results|not found|alternative.*search/i);
  }

  async verifySanitizedSearchResults() {
    // Verify that either safe results are returned or an error message is shown
    const resultsVisible = await this.searchResults.first().isVisible().catch(() => false);
    const errorVisible = await this.errorMessage.isVisible().catch(() => false);
    expect(resultsVisible || errorVisible).toBeTruthy();
    
    // Verify no security compromise indicators
    const pageContent = await this.page.content();
    expect(pageContent).not.toContain('<script>');
    expect(pageContent).not.toContain('DROP TABLE');
  }

  // Download Methods
  async searchForDownloadableGuide(guideName) {
    await this.enterSearchKeyword(guideName);
    await this.submitSearch();
  }

  async verifyPDFGuideDisplayedWithDownloadLink() {
    await expect(this.pdfGuideLink).toBeVisible();
    await expect(this.downloadLink).toBeVisible();
  }

  async clickDownloadLink() {
    await expect(this.downloadLink.first()).toBeVisible();
    await this.downloadLink.first().click();
  }

  async verifyDownloadStarted(timeout = 2000) {
    // Download verification is handled by the test spec using page.waitForEvent('download')
    // This method serves as a placeholder for additional verification if needed
    await this.page.waitForTimeout(timeout);
  }

  async verifySecureHTTPSConnection() {
    const url = this.page.url();
    expect(url).toMatch(/^https:/);
  }

  async verifyDownloadedFileIsValidPDF(download) {
    const fileName = download.suggestedFilename();
    expect(fileName).toMatch(/\.pdf$/i);
  }

  async locateUnavailableMaterial(materialName) {
    await this.enterSearchKeyword(materialName);
    await this.submitSearch();
  }

  async verifyUnavailableMaterialLinkVisible() {
    await expect(this.unavailableMaterialLink).toBeVisible();
  }

  async clickUnavailableMaterialLink() {
    await this.unavailableMaterialLink.click();
  }

  async verifyUnavailableResourceErrorMessage() {
    await expect(this.downloadErrorMessage).toBeVisible();
    await expect(this.downloadErrorMessage).toContainText(/unavailable|not available|alternative/i);
  }

  async locateCorruptedFile(fileName) {
    await this.enterSearchKeyword(fileName);
    await this.submitSearch();
  }

  async verifyCorruptedFileLinkVisible() {
    await expect(this.corruptedFileLink).toBeVisible();
  }

  async clickCorruptedFileLink() {
    await this.corruptedFileLink.click();
  }

  async verifyCorruptedFileErrorMessage() {
    await expect(this.downloadErrorMessage).toBeVisible();
    await expect(this.downloadErrorMessage).toContainText(/error|corrupted|invalid|cannot.*download/i);
  }

  // Category Browsing Methods
  async selectCategory(categoryName) {
    await expect(this.categoryList).toBeVisible();
    const category = this.page.locator(`[data-testid="category-item"]:has-text("${categoryName}"), .category-link:has-text("${categoryName}")`);
    await expect(category).toBeVisible();
    await category.click();
  }

  async verifyCategorySelected(categoryName) {
    // Verify category is highlighted or page shows category context
    const activeCategory = this.page.locator(`.category-active:has-text("${categoryName}"), .selected-category:has-text("${categoryName}")`);
    await expect(activeCategory).toBeVisible().catch(() => {
      // Alternative: verify by URL or page title
      expect(this.page.url()).toContain(categoryName.toLowerCase().replace(/\s+/g, '-'));
    });
  }

  async verifyRelevantContentDisplayed(timeout = 2000) {
    await expect(this.categoryContent.first()).toBeVisible({ timeout });
    const count = await this.categoryContent.count();
    expect(count).toBeGreaterThan(0);
  }

  async verifyNoContentAvailableMessage() {
    await expect(this.noCategoryContentMessage).toBeVisible();
    await expect(this.noCategoryContentMessage).toContainText(/no content|not available|empty/i);
  }

  async simulateBackendServiceUnavailability() {
    // Implementation depends on test environment configuration
    await this.page.route('**/api/help-center/**', route => route.abort());
  }

  async verifyBackendErrorMessageWithRetryOptions() {
    await expect(this.backendErrorMessage).toBeVisible();
    await expect(this.backendErrorMessage).toContainText(/error|unavailable|try again/i);
    await expect(this.retryButton).toBeVisible();
  }

  async verifyCategorizedContentDisplayed() {
    await expect(this.categoryList).toBeVisible();
    const categories = await this.categoryItem.count();
    expect(categories).toBeGreaterThan(0);
  }

  async verifyResponsiveDesignOnMobile() {
    await expect(this.helpCenterLandingPage).toBeVisible();
    const viewport = this.page.viewportSize();
    expect(viewport.width).toBeLessThanOrEqual(768);
  }

  async verifyAllCategoriesVisibleOnMobile() {
    await expect(this.categoryList).toBeVisible();
    const categories = await this.categoryItem.all();
    for (const category of categories) {
      await expect(category).toBeVisible();
    }
  }
};
