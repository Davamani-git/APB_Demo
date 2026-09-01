const { expect } = require('@playwright/test');

exports.HelpCenterPage = class HelpCenterPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.url = 'https://app.example.com/help-center';
    
    // Chat Assistant Locators
    this.chatAssistantIcon = page.locator('[data-testid="chat-assistant-icon"], #chat-icon, .chat-assistant-button');
    this.chatWindow = page.locator('[data-testid="chat-window"], #chat-window, .chat-window');
    this.chatInputField = page.locator('[data-testid="chat-input"], #chat-input, .chat-input-field');
    this.chatSendButton = page.locator('[data-testid="chat-send"], #chat-send, .chat-send-button');
    this.chatResponse = page.locator('[data-testid="chat-response"], .chat-response, .chat-message-bot');
    this.chatErrorMessage = page.locator('[data-testid="chat-error"], .chat-error-message');
    this.alternativeSupportOptions = page.locator('[data-testid="alternative-support"], .alternative-support-options');
    this.chatTimeoutMessage = page.locator('[data-testid="chat-timeout"], .chat-timeout-message');
    this.chatEngagementPrompt = page.locator('[data-testid="chat-engagement"], .chat-engagement-prompt');
    this.chatResponseWithLinks = page.locator('[data-testid="chat-response-links"], .chat-response.has-links');
    this.chatArticleLinks = page.locator('[data-testid="chat-article-link"], .chat-response a, .chat-article-link');
    this.chatNoMatchResponse = page.locator('[data-testid="chat-no-match"], .chat-no-match-response');
    this.chatTruncationMessage = page.locator('[data-testid="chat-truncation"], .chat-truncation-message');
    this.chatRephraseMessage = page.locator('[data-testid="chat-rephrase"], .chat-rephrase-message');
    
    // Search Locators
    this.searchBar = page.locator('[data-testid="search-bar"], #search-bar, .search-input');
    this.searchButton = page.locator('[data-testid="search-submit"], #search-submit, .search-button');
    this.searchResults = page.locator('[data-testid="search-results"], .search-results');
    this.searchResultArticles = page.locator('[data-testid="search-result-article"], .search-result.article');
    this.searchResultVideos = page.locator('[data-testid="search-result-video"], .search-result.video');
    this.searchResultDownloads = page.locator('[data-testid="search-result-download"], .search-result.download');
    this.noResultsMessage = page.locator('[data-testid="no-results"], .no-results-message');
    this.searchSuggestions = page.locator('[data-testid="search-suggestions"], .search-suggestions');
    this.invalidQueryMessage = page.locator('[data-testid="invalid-query"], .invalid-query-message');
    
    // Video Locators
    this.videoTutorial = page.locator('[data-testid="video-tutorial"], .video-tutorial');
    this.videoPlayer = page.locator('[data-testid="video-player"], video, .video-player');
    this.videoPlayButton = page.locator('[data-testid="video-play"], .video-play-button, video ~ .controls .play');
    this.videoPauseButton = page.locator('[data-testid="video-pause"], .video-pause-button, video ~ .controls .pause');
    this.videoVolumeControl = page.locator('[data-testid="video-volume"], .video-volume-control, video ~ .controls .volume');
    this.videoFullscreenButton = page.locator('[data-testid="video-fullscreen"], .video-fullscreen-button, video ~ .controls .fullscreen');
    this.videoErrorMessage = page.locator('[data-testid="video-error"], .video-error-message');
    this.alternativeVideoSuggestions = page.locator('[data-testid="alternative-videos"], .alternative-video-suggestions');
    this.videoQualityNotification = page.locator('[data-testid="video-quality-notification"], .video-quality-notification');
    
    // Category Locators
    this.categories = page.locator('[data-testid="categories"], .categories');
    this.categoryGettingStarted = page.locator('[data-testid="category-getting-started"], .category-getting-started, [data-category="Getting Started"]');
    this.categoryFAQs = page.locator('[data-testid="category-faqs"], .category-faqs, [data-category="FAQs"]');
    this.categoryTroubleshooting = page.locator('[data-testid="category-troubleshooting"], .category-troubleshooting, [data-category="Troubleshooting"]');
    this.categoryContent = page.locator('[data-testid="category-content"], .category-content');
    this.noCategoryContentMessage = page.locator('[data-testid="no-category-content"], .no-category-content-message');
    this.categoryErrorMessage = page.locator('[data-testid="category-error"], .category-error-message');
    this.retryOptions = page.locator('[data-testid="retry-options"], .retry-options');
  }

  async navigate() {
    await this.page.goto(this.url);
    await expect(this.page).toHaveURL(/.*help-center/);
  }

  async openChatAssistant() {
    await expect(this.chatAssistantIcon).toBeVisible();
    await this.chatAssistantIcon.click();
    await expect(this.chatWindow).toBeVisible();
  }

  async clickChatAssistantIcon() {
    await expect(this.chatAssistantIcon).toBeVisible();
    await this.chatAssistantIcon.click();
  }

  async typeChatMessage(message) {
    await expect(this.chatInputField).toBeVisible();
    await this.chatInputField.fill(message);
  }

  async sendChatMessage() {
    await expect(this.chatSendButton).toBeVisible();
    await this.chatSendButton.click();
  }

  async searchFor(keyword) {
    await expect(this.searchBar).toBeVisible();
    await this.searchBar.fill(keyword);
  }

  async submitSearch() {
    await expect(this.searchButton).toBeVisible();
    await this.searchButton.click();
  }

  async openVideoTutorial() {
    await expect(this.videoTutorial).toBeVisible();
    await this.videoTutorial.click();
  }

  async accessVideoById(videoId) {
    await this.page.goto(`${this.url}/video/${videoId}`);
  }

  async clickPlayButton() {
    await expect(this.videoPlayButton).toBeVisible();
    await this.videoPlayButton.click();
  }

  async clickPauseButton() {
    await expect(this.videoPauseButton).toBeVisible();
    await this.videoPauseButton.click();
  }

  async adjustVolume() {
    await expect(this.videoVolumeControl).toBeVisible();
    await this.videoVolumeControl.click();
  }

  async toggleFullscreen() {
    await expect(this.videoFullscreenButton).toBeVisible();
    await this.videoFullscreenButton.click();
  }

  async selectCategory(categoryName) {
    const categoryLocator = this.page.locator(`[data-testid="category-${categoryName.toLowerCase()}"], [data-category="${categoryName}"], .category-${categoryName.toLowerCase().replace('_', '-')}`);
    await expect(categoryLocator).toBeVisible();
    await categoryLocator.click();
  }
};
