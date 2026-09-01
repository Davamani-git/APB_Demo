const { expect } = require('@playwright/test');

exports.HelpCenterPage = class HelpCenterPage {

  constructor(page) {
    this.page = page;
    
    // Chat Assistant Locators
    this.chatAssistantButton = page.locator('[data-testid="chat-assistant-button"], button:has-text("Chat"), .chat-button');
    this.chatWindow = page.locator('[data-testid="chat-window"], .chat-window, #chat-container');
    this.chatInputField = page.locator('[data-testid="chat-input"], .chat-input, input[placeholder*="message" i]');
    this.chatSendButton = page.locator('[data-testid="chat-send"], .chat-send-button, button:has-text("Send")');
    this.chatResponse = page.locator('[data-testid="chat-response"], .chat-message.bot, .assistant-message');
    this.chatErrorMessage = page.locator('[data-testid="chat-error"], .chat-error, .error-message');
    this.serviceUnavailableError = page.locator('text=/service.*unavailable/i, text=/temporarily.*unavailable/i');
    this.alternativeSupportOptions = page.locator('[data-testid="alternative-support"], .alternative-support, text=/FAQ|email|phone/i');
    this.characterLimitError = page.locator('text=/character.*limit/i, text=/shorten.*message/i, .validation-error');
    
    // Article Links Locators
    this.articleLinks = page.locator('[data-testid="article-link"], .article-link, a[href*="article"]');
    this.noMatchingArticlesMessage = page.locator('text=/no.*articles.*found/i, text=/no.*matching/i');
    this.escalationOptions = page.locator('text=/escalate/i, text=/rephrase/i, [data-testid="escalation-options"]');
    this.articleContent = page.locator('[data-testid="article-content"], .article-content, article');
    
    // Video Tutorial Locators
    this.videoTutorialLink = page.locator('[data-testid="video-tutorial"], .video-tutorial');
    this.videoPlayer = page.locator('video, [data-testid="video-player"], .video-player');
    this.videoPlayButton = page.locator('button[aria-label*="play" i], .video-play-button, video ~ button');
    this.videoPauseIndicator = page.locator('[data-testid="video-paused"], video[paused]');
    this.volumeControl = page.locator('input[type="range"][aria-label*="volume" i], .volume-slider');
    this.fullscreenButton = page.locator('button[aria-label*="fullscreen" i], .fullscreen-button');
    this.videoErrorMessage = page.locator('[data-testid="video-error"], .video-error, text=/video.*failed/i');
    this.retryButton = page.locator('button:has-text("Retry"), [data-testid="retry-button"]');
    this.unsupportedBrowserMessage = page.locator('text=/unsupported.*browser/i, text=/disabled.*permissions/i');
    this.alternativeSuggestions = page.locator('text=/different.*browser/i, text=/enable.*permissions/i');
    
    // Help Materials Locators
    this.helpMaterialsSection = page.locator('[data-testid="help-materials"], .help-materials-section, section:has-text("Help Materials")');
    this.helpMaterialsList = page.locator('[data-testid="materials-list"], .materials-list, .help-material-item');
    this.downloadLink = page.locator('[data-testid="download-link"], a[download], a:has-text("Download")');
    this.materialUnavailableError = page.locator('text=/temporarily.*unavailable/i, text=/material.*unavailable/i');
    this.alternativeResources = page.locator('[data-testid="alternative-resources"], text=/alternative.*resources/i, text=/similar.*materials/i');
    this.accessDeniedMessage = page.locator('text=/insufficient.*permissions/i, text=/access.*denied/i, .permission-error');
    
    // Search Locators
    this.searchBar = page.locator('[data-testid="search-bar"], input[type="search"], input[placeholder*="search" i]');
    this.searchButton = page.locator('[data-testid="search-button"], button[type="submit"], button:has-text("Search")');
    this.searchResults = page.locator('[data-testid="search-results"], .search-results, .search-result-item');
    this.noResultsMessage = page.locator('text=/no.*results.*found/i, [data-testid="no-results"]');
    this.searchSuggestions = page.locator('text=/check.*spelling/i, text=/different.*keywords/i, text=/browse.*categories/i');
    this.searchValidationError = page.locator('text=/enter.*search.*term/i, .search-validation-error');
    
    // General Locators
    this.categorizedContent = page.locator('[data-testid="help-categories"], .help-category, section[class*="category"]');
  }

  async navigate() {
    await this.page.goto('/help-center');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Chat Assistant Methods
  async verifyChatAssistantButtonVisible() {
    await expect(this.chatAssistantButton).toBeVisible({ timeout: 5000 });
    await expect(this.chatAssistantButton).toBeEnabled();
  }

  async clickChatAssistantButton() {
    await this.chatAssistantButton.click();
  }

  async verifyChatWindowOpened() {
    await expect(this.chatWindow).toBeVisible({ timeout: 2000 });
  }

  async typeMessageInChat(message) {
    await expect(this.chatInputField).toBeVisible();
    await this.chatInputField.fill(message);
  }

  async sendChatMessage() {
    await this.chatSendButton.click();
  }

  async verifyChatResponseReceived() {
    await expect(this.chatResponse).toBeVisible({ timeout: 5000 });
  }

  async verifyServiceUnavailableErrorDisplayed() {
    await expect(this.serviceUnavailableError).toBeVisible({ timeout: 5000 });
  }

  async verifyAlternativeSupportOptionsDisplayed() {
    await expect(this.alternativeSupportOptions).toBeVisible();
  }

  async verifyCharacterLimitErrorDisplayed() {
    await expect(this.characterLimitError).toBeVisible({ timeout: 3000 });
  }

  // Article Links Methods
  async verifyArticleLinksDisplayed() {
    await expect(this.articleLinks.first()).toBeVisible({ timeout: 5000 });
  }

  async verifyArticleLinksRelevantToQuery(query) {
    const articleCount = await this.articleLinks.count();
    expect(articleCount).toBeGreaterThan(0);
    const firstArticleText = await this.articleLinks.first().textContent();
    expect(firstArticleText.toLowerCase()).toContain(query.toLowerCase().split(' ')[0]);
  }

  async verifyNoMatchingArticlesMessage() {
    await expect(this.noMatchingArticlesMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyEscalationOptionsDisplayed() {
    await expect(this.escalationOptions).toBeVisible();
  }

  async clickFirstArticleLink() {
    await this.articleLinks.first().click();
  }

  async verifyArticleOpened() {
    await expect(this.articleContent).toBeVisible({ timeout: 5000 });
  }

  async verifyChatSessionActive() {
    await expect(this.chatWindow).toBeVisible();
  }

  // Video Tutorial Methods
  async selectVideoTutorial(tutorialName) {
    const videoLink = this.page.locator(`text="${tutorialName}", [data-video="${tutorialName}"]`).first();
    await videoLink.click();
  }

  async verifyVideoPlayerLoaded() {
    await expect(this.videoPlayer).toBeVisible({ timeout: 5000 });
  }

  async clickVideoPlayButton() {
    await this.videoPlayButton.click();
  }

  async verifyVideoPlaying() {
    await this.page.waitForTimeout(500);
    const isPaused = await this.videoPlayer.evaluate(video => video.paused);
    expect(isPaused).toBe(false);
  }

  async verifyVideoPaused() {
    await this.page.waitForTimeout(500);
    const isPaused = await this.videoPlayer.evaluate(video => video.paused);
    expect(isPaused).toBe(true);
  }

  async adjustVideoVolume() {
    await this.volumeControl.fill('0.5');
  }

  async verifyVolumeAdjusted() {
    const volume = await this.videoPlayer.evaluate(video => video.volume);
    expect(volume).toBeGreaterThan(0);
  }

  async toggleFullscreen() {
    await this.fullscreenButton.click();
  }

  async verifyFullscreenMode() {
    await this.page.waitForTimeout(500);
    const isFullscreen = await this.page.evaluate(() => !!document.fullscreenElement);
    expect(isFullscreen).toBe(true);
  }

  async verifyExitedFullscreen() {
    await this.page.waitForTimeout(500);
    const isFullscreen = await this.page.evaluate(() => !!document.fullscreenElement);
    expect(isFullscreen).toBe(false);
  }

  async verifyVideoLoadErrorDisplayed() {
    await expect(this.videoErrorMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyRetryOptionAvailable() {
    await expect(this.retryButton).toBeVisible();
  }

  async verifyUnsupportedBrowserMessage() {
    await expect(this.unsupportedBrowserMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyAlternativeSuggestionsDisplayed() {
    await expect(this.alternativeSuggestions).toBeVisible();
  }

  // Help Materials Methods
  async navigateToHelpMaterialsSection() {
    await this.helpMaterialsSection.scrollIntoViewIfNeeded();
    await this.helpMaterialsSection.click();
  }

  async verifyHelpMaterialsDisplayed() {
    await expect(this.helpMaterialsList.first()).toBeVisible({ timeout: 5000 });
  }

  async selectHelpMaterial(materialName) {
    const material = this.page.locator(`text="${materialName}", [data-material="${materialName}"]`).first();
    await material.click();
  }

  async verifyDownloadLinkVisible() {
    await expect(this.downloadLink).toBeVisible();
    await expect(this.downloadLink).toBeEnabled();
  }

  async clickDownloadLink() {
    await this.downloadLink.click();
  }

  async verifyMaterialUnavailableError() {
    await expect(this.materialUnavailableError).toBeVisible({ timeout: 5000 });
  }

  async verifyAlternativeResourcesSuggested() {
    await expect(this.alternativeResources).toBeVisible();
  }

  async verifyAccessDeniedMessage() {
    await expect(this.accessDeniedMessage).toBeVisible({ timeout: 5000 });
  }

  // Search Methods
  async verifySearchBarVisible() {
    await expect(this.searchBar).toBeVisible();
  }

  async enterSearchKeyword(keyword) {
    await this.searchBar.fill(keyword);
  }

  async submitSearch() {
    await this.searchButton.click();
  }

  async verifySearchResultsDisplayed() {
    await expect(this.searchResults.first()).toBeVisible({ timeout: 5000 });
  }

  async verifySearchResultsRelevant(keyword) {
    const resultsCount = await this.searchResults.count();
    expect(resultsCount).toBeGreaterThan(0);
  }

  async verifyNoResultsMessage() {
    await expect(this.noResultsMessage).toBeVisible({ timeout: 5000 });
  }

  async verifySearchSuggestionsDisplayed() {
    await expect(this.searchSuggestions).toBeVisible();
  }

  async verifySearchValidationError() {
    await expect(this.searchValidationError).toBeVisible({ timeout: 3000 });
  }

  // General Methods
  async verifyCategorizedContentDisplayed() {
    await expect(this.categorizedContent.first()).toBeVisible({ timeout: 5000 });
    const categoryCount = await this.categorizedContent.count();
    expect(categoryCount).toBeGreaterThan(0);
  }

};
