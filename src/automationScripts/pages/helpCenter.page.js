const { expect } = require('@playwright/test');

exports.HelpCenterPage = class HelpCenterPage {
  constructor(page) {
    this.page = page;
    
    // Landing page elements
    this.landingPageContainer = page.locator('[data-testid="help-center-landing"], .help-center-landing, #help-center-landing, .help-center-page');
    this.categorizedContent = page.locator('[data-testid="categorized-content"], .categories, .help-categories');
    
    // Chat assistant elements
    this.chatAssistantButton = page.locator('[data-testid="chat-assistant-btn"], button:has-text("Chat"), .chat-button, #chat-assistant');
    this.chatWindow = page.locator('[data-testid="chat-window"], .chat-window, #chat-window, .chat-container');
    this.chatInput = page.locator('[data-testid="chat-input"], input[type="text"].chat-input, textarea.chat-input, #chat-input');
    this.chatSubmitButton = page.locator('[data-testid="chat-submit"], button[type="submit"].chat-submit, .chat-send-button');
    this.chatResponse = page.locator('[data-testid="chat-response"], .chat-response, .chat-message.bot, .assistant-response').last();
    this.chatArticleLinks = page.locator('[data-testid="chat-article-link"], .chat-response a, .article-link');
    this.noArticlesMessage = page.locator('[data-testid="no-articles-message"], .no-articles, :has-text("no specific articles")');
    this.generalSupportOptions = page.locator('[data-testid="general-support"], .general-support, .alternative-support');
    this.clarificationRequest = page.locator('[data-testid="clarification-request"], :has-text("clarification"), :has-text("more specific")');
    
    // Search elements
    this.searchInput = page.locator('[data-testid="help-search-input"], input[type="search"], input[placeholder*="Search"], #help-search');
    this.searchButton = page.locator('[data-testid="search-submit"], button[type="submit"].search-button, .search-btn');
    this.searchResults = page.locator('[data-testid="search-results"], .search-results, #search-results');
    this.searchResultItems = page.locator('[data-testid="search-result-item"], .search-result-item, .search-result');
    this.noResultsMessage = page.locator('[data-testid="no-results"], .no-results, :has-text("no results found")');
    this.alternativeSearchSuggestions = page.locator('[data-testid="search-suggestions"], .search-suggestions, .alternative-terms');
    this.validationMessage = page.locator('[data-testid="validation-message"], .validation-message, .error-message');
    
    // Download elements
    this.downloadableSection = page.locator('[data-testid="downloadable-section"], .downloadable-materials, #downloads, .downloads-section');
    this.downloadLink = page.locator('[data-testid="download-link"], a[download], .download-link');
    this.fileUnavailableError = page.locator('[data-testid="file-unavailable"], .file-error, :has-text("not available")');
    this.serverErrorMessage = page.locator('[data-testid="server-error"], .server-error, :has-text("server issues")');
    this.retryInstructions = page.locator('[data-testid="retry-instructions"], .retry-info, :has-text("retry")');
    
    // Category elements
    this.categoryLink = page.locator('[data-testid="category-link"], .category-link, .help-category');
    this.categoryContent = page.locator('[data-testid="category-content"], .category-content, .category-articles');
    this.categoryArticles = page.locator('[data-testid="category-article"], .category-article, .help-article');
    this.noCategoryContentMessage = page.locator('[data-testid="no-category-content"], .no-content, :has-text("no content is available")');
    
    // Error elements
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .error');
    this.alternativeSupportOptions = page.locator('[data-testid="alternative-support"], .alternative-support, .support-options');
    this.serviceUnavailableError = page.locator('[data-testid="service-unavailable"], .service-error, :has-text("unavailable")');
    this.backendErrorMessage = page.locator('[data-testid="backend-error"], .backend-error, :has-text("error")');
    this.alternativeActions = page.locator('[data-testid="alternative-actions"], .alternative-actions, .suggested-actions');
  }

  async openChatAssistant() {
    await expect(this.chatAssistantButton).toBeVisible();
    await this.chatAssistantButton.click();
  }

  async typeChatMessage(message) {
    await expect(this.chatInput).toBeVisible();
    await this.chatInput.clear();
    await this.chatInput.fill(message);
  }

  async submitChatMessage() {
    await expect(this.chatSubmitButton).toBeVisible();
    await this.chatSubmitButton.click();
  }

  async getRateLimitFeedback() {
    const rateLimitIndicator = this.page.locator('[data-testid="rate-limit"], :has-text("rate limit"), :has-text("too many"), :has-text("slow down")');
    const isVisible = await rateLimitIndicator.isVisible().catch(() => false);
    return isVisible;
  }

  async enterSearchKeyword(keyword) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.clear();
    await this.searchInput.fill(keyword);
  }

  async submitSearch() {
    await expect(this.searchButton).toBeVisible();
    await this.searchButton.click();
  }

  async navigateToDownloadableSection() {
    await expect(this.downloadableSection).toBeVisible();
    await this.downloadableSection.scrollIntoViewIfNeeded();
  }

  async clickDownloadLink(fileName) {
    const specificDownloadLink = this.page.locator(`[data-testid="download-link"][href*="${fileName}"], a[download*="${fileName}"], a[href*="${fileName}"]`);
    await expect(specificDownloadLink).toBeVisible();
    await specificDownloadLink.click();
  }

  async selectCategory(categoryName) {
    const specificCategory = this.page.locator(`[data-testid="category-link"]:has-text("${categoryName}"), .category-link:has-text("${categoryName}"), a:has-text("${categoryName}")`);
    await expect(specificCategory).toBeVisible();
    await specificCategory.click();
  }
};
