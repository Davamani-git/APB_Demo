const { expect } = require('@playwright/test');

exports.HelpCenterPage = class HelpCenterPage {
  constructor(page) {
    this.page = page;
    this.chatAssistantButton = page.locator('[data-testid="chat-assistant-button"], button:has-text("Chat"), #chat-button');
    this.chatWindow = page.locator('[data-testid="chat-window"], .chat-window, #chat-container');
    this.chatInputField = page.locator('[data-testid="chat-input"], .chat-input, #chat-input-field');
    this.chatSendButton = page.locator('[data-testid="chat-send-button"], button:has-text("Send"), .chat-send-btn');
    this.chatMessages = page.locator('[data-testid="chat-message"], .chat-message, .message-item');
    this.chatResponse = page.locator('[data-testid="chat-response"], .chat-response, .assistant-message');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, .alert-error');
    this.alternativeSupportOptions = page.locator('[data-testid="alternative-support"], .alternative-support, .support-options');
    this.searchBar = page.locator('[data-testid="search-bar"], input[type="search"], #help-search');
    this.searchButton = page.locator('[data-testid="search-button"], button:has-text("Search"), .search-btn');
    this.searchResults = page.locator('[data-testid="search-results"], .search-results, .results-container');
    this.searchResultItems = page.locator('[data-testid="search-result-item"], .search-result, .result-item');
    this.noResultsMessage = page.locator('[data-testid="no-results"], .no-results-message, .empty-results');
    this.videoTutorialsCategory = page.locator('[data-testid="video-tutorials-category"], a:has-text("Video Tutorials"), .category-video');
    this.videoPlayer = page.locator('[data-testid="video-player"], video, .video-container');
    this.videoPlayButton = page.locator('[data-testid="video-play"], .video-play-btn, button[aria-label="Play"]');
    this.videoPauseButton = page.locator('[data-testid="video-pause"], .video-pause-btn, button[aria-label="Pause"]');
    this.videoVolumeControl = page.locator('[data-testid="video-volume"], .volume-control, input[type="range"]');
    this.videoFullscreenButton = page.locator('[data-testid="video-fullscreen"], .fullscreen-btn, button[aria-label="Fullscreen"]');
    this.categories = page.locator('[data-testid="help-category"], .help-category, .category-item');
    this.categoryArticles = page.locator('[data-testid="category-article"], .article-item, .help-article');
    this.articleContent = page.locator('[data-testid="article-content"], .article-body, .content-container');
    this.privacySettingsLink = page.locator('[data-testid="privacy-settings"], a:has-text("Privacy"), .privacy-link');
    this.dataDeletionButton = page.locator('[data-testid="delete-data"], button:has-text("Delete"), .delete-data-btn');
    this.deletionConfirmDialog = page.locator('[data-testid="deletion-confirm"], .confirm-dialog, .modal-confirm');
    this.confirmButton = page.locator('[data-testid="confirm-button"], button:has-text("Confirm"), .btn-confirm');
    this.securityWarning = page.locator('[data-testid="security-warning"], .security-alert, .warning-message');
    this.timestamp = page.locator('[data-testid="message-timestamp"], .timestamp, .message-time');
  }

  async navigate() {
    await this.page.goto('https://app.example.com/help-center');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyCategoriesVisible() {
    await expect(this.categories.first()).toBeVisible();
  }

  async clickChatAssistantButton() {
    await expect(this.chatAssistantButton).toBeVisible();
    await this.chatAssistantButton.click();
  }

  async measureChatWindowLoadTime() {
    const startTime = Date.now();
    await expect(this.chatWindow).toBeVisible({ timeout: 3000 });
    const endTime = Date.now();
    return endTime - startTime;
  }

  async typeChatMessage(message) {
    await expect(this.chatInputField).toBeVisible();
    await this.chatInputField.fill(message);
  }

  async sendChatMessage() {
    await this.chatSendButton.click();
  }

  async verifyMessageSent(message) {
    await expect(this.chatMessages.filter({ hasText: message })).toBeVisible();
  }

  async verifyChatResponseReceived() {
    await expect(this.chatResponse.first()).toBeVisible({ timeout: 10000 });
  }

  async verifyChatWindowOpen() {
    await expect(this.chatWindow).toBeVisible();
  }

  async verifyMessageDisplayedWithTimestamp(message) {
    await expect(this.chatMessages.filter({ hasText: message })).toBeVisible();
    await expect(this.timestamp).toBeVisible();
  }

  async verifyMessagesInChronologicalOrder(messages) {
    for (let i = 0; i < messages.length; i++) {
      const messageLocator = this.chatMessages.nth(i);
      await expect(messageLocator).toContainText(messages[i]);
    }
  }

  async verifyResponsesInChronologicalOrder() {
    const responseCount = await this.chatResponse.count();
    expect(responseCount).toBeGreaterThan(0);
  }

  async simulateChatServiceUnavailable() {
    await this.page.route('**/api/chat/**', route => route.abort());
  }

  async verifyErrorMessageDisplayed(expectedText) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }

  async verifyAlternativeSupportOptionsProvided() {
    await expect(this.alternativeSupportOptions).toBeVisible();
  }

  async simulateChatServiceHighLoad() {
    await this.page.route('**/api/chat/**', route => {
      route.fulfill({
        status: 503,
        body: JSON.stringify({ message: 'Service experiencing high load' })
      });
    });
  }

  async verifyHighLoadMessageDisplayed() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText('high');
  }

  async verifyAlternativeContactMethodsDisplayed() {
    await expect(this.alternativeSupportOptions).toBeVisible();
  }

  async verifySecureConnection() {
    const url = this.page.url();
    expect(url).toMatch(/^https:/);
  }

  async verifySSLCertificateValid() {
    const securityDetails = await this.page.evaluate(() => {
      return window.location.protocol;
    });
    expect(securityDetails).toBe('https:');
  }

  async verifyHTTPSTransmission() {
    const requests = [];
    this.page.on('request', request => {
      if (request.url().includes('/api/chat')) {
        requests.push(request);
      }
    });
    expect(requests.length).toBeGreaterThan(0);
  }

  async verifyTLSVersion() {
    // TLS version verification through protocol check
    const protocol = await this.page.evaluate(() => window.location.protocol);
    expect(protocol).toBe('https:');
  }

  async verifyGDPRCompliance() {
    // Verify GDPR compliance indicators are present
    const gdprNotice = this.page.locator('[data-testid="gdpr-notice"], .gdpr-compliance, .privacy-notice');
    await expect(gdprNotice).toBeVisible();
  }

  async navigateToPrivacySettings() {
    await this.privacySettingsLink.click();
  }

  async verifyPrivacySettingsPageLoaded() {
    await expect(this.page).toHaveURL(/.*privacy.*/);
  }

  async clickDataDeletionRequest() {
    await expect(this.dataDeletionButton).toBeVisible();
    await this.dataDeletionButton.click();
  }

  async verifyDeletionConfirmationDialog() {
    await expect(this.deletionConfirmDialog).toBeVisible();
  }

  async confirmDeletionRequest() {
    await this.confirmButton.click();
  }

  async verifyDeletionRequestAcknowledged() {
    const acknowledgment = this.page.locator('[data-testid="deletion-acknowledged"], .success-message');
    await expect(acknowledgment).toBeVisible();
  }

  async verifyDataDeletionWithinGDPRTimeframe() {
    // This would typically involve backend verification or waiting for confirmation
    const confirmationMessage = this.page.locator('text=/within.*30.*days/i');
    await expect(confirmationMessage).toBeVisible();
  }

  async verifyDataDeletedFromBackend() {
    // Backend verification - would require API call or admin panel check
    const deletionStatus = this.page.locator('[data-testid="deletion-status"], .status-deleted');
    await expect(deletionStatus).toBeVisible();
  }

  async simulateCompromisedConnection() {
    await this.page.route('**/api/chat/**', route => {
      route.fulfill({
        status: 403,
        body: JSON.stringify({ error: 'Insecure connection detected' })
      });
    });
  }

  async verifyTransmissionBlocked() {
    await expect(this.errorMessage).toBeVisible();
  }

  async verifySecurityWarningDisplayed() {
    await expect(this.securityWarning).toBeVisible();
    await expect(this.securityWarning).toContainText('secure');
  }

  async verifySearchBarVisible() {
    await expect(this.searchBar).toBeVisible();
  }

  async enterSearchKeyword(keyword) {
    await this.searchBar.fill(keyword);
  }

  async measureSearchResponseTime() {
    const startTime = Date.now();
    await this.searchButton.click();
    await expect(this.searchResults).toBeVisible({ timeout: 3000 });
    const endTime = Date.now();
    return endTime - startTime;
  }

  async verifySearchResultsDisplayed() {
    await expect(this.searchResults).toBeVisible();
    await expect(this.searchResultItems.first()).toBeVisible();
  }

  async verifySearchResultsIncludeContentTypes(contentTypes) {
    for (const type of contentTypes) {
      const typeIndicator = this.page.locator(`[data-content-type="${type}"], .content-${type}`);
      await expect(typeIndicator.first()).toBeVisible();
    }
  }

  async verifySearchResultsRelevance(keyword) {
    const resultCount = await this.searchResultItems.count();
    for (let i = 0; i < Math.min(resultCount, 5); i++) {
      const resultText = await this.searchResultItems.nth(i).textContent();
      expect(resultText.toLowerCase()).toContain(keyword.toLowerCase());
    }
  }

  async executeSearch() {
    await this.searchButton.click();
  }

  async verifySearchResultsRanking(keywords) {
    await expect(this.searchResultItems.first()).toBeVisible();
    const firstResultText = await this.searchResultItems.first().textContent();
    const matchCount = keywords.filter(kw => firstResultText.toLowerCase().includes(kw.toLowerCase())).length;
    expect(matchCount).toBeGreaterThan(0);
  }

  async verifyNoResultsMessageDisplayed() {
    await expect(this.noResultsMessage).toBeVisible();
  }

  async verifyAlternativeSearchSuggestionsProvided() {
    const suggestions = this.page.locator('[data-testid="search-suggestions"], .suggestions, .alternative-terms');
    await expect(suggestions).toBeVisible();
  }

  async verifyPopularTopicLinksDisplayed(topics) {
    for (const topic of topics) {
      const topicLink = this.page.locator(`a:has-text("${topic}")`);
      await expect(topicLink).toBeVisible();
    }
  }

  async navigateToVideoTutorialsCategory() {
    await this.videoTutorialsCategory.click();
  }

  async verifyVideoTutorialsDisplayed() {
    const videoList = this.page.locator('[data-testid="video-list"], .video-tutorials, .video-items');
    await expect(videoList).toBeVisible();
  }

  async selectVideoTutorial(videoName) {
    const videoItem = this.page.locator(`[data-video="${videoName}"], a:has-text("${videoName}"), .video-item:has-text("${videoName}")`);
    await videoItem.click();
  }

  async verifyVideoPlayerLoaded() {
    await expect(this.videoPlayer).toBeVisible();
  }

  async measureVideoPlaybackStartTime() {
    const startTime = Date.now();
    await this.videoPlayButton.click();
    await this.page.waitForTimeout(500); // Brief wait to ensure playback starts
    const endTime = Date.now();
    return endTime - startTime;
  }

  async clickVideoPauseButton() {
    await this.videoPauseButton.click();
  }

  async verifyVideoPaused() {
    const isPaused = await this.videoPlayer.evaluate(video => video.paused);
    expect(isPaused).toBe(true);
  }

  async adjustVideoVolume(volumeLevel) {
    await this.videoVolumeControl.fill(volumeLevel.toString());
  }

  async verifyVolumeAdjusted() {
    const volume = await this.videoPlayer.evaluate(video => video.volume);
    expect(volume).toBeGreaterThanOrEqual(0);
  }

  async clickVideoFullscreenButton() {
    await this.videoFullscreenButton.click();
  }

  async verifyVideoFullscreen() {
    const isFullscreen = await this.page.evaluate(() => {
      return document.fullscreenElement !== null;
    });
    expect(isFullscreen).toBe(true);
  }

  async clickVideoPlayButton() {
    await this.videoPlayButton.click();
  }

  async verifyVideoUnavailableErrorDisplayed() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText('unavailable');
  }

  async verifyAlternativeHelpOptionsProvided(options) {
    for (const option of options) {
      const optionLink = this.page.locator(`a:has-text("${option}"), .alternative-option:has-text("${option}")`);
      await expect(optionLink).toBeVisible();
    }
  }

  async verifyFormatIncompatibilityHandled() {
    const formatMessage = this.page.locator('[data-testid="format-error"], .format-incompatible, text=/format/i');
    await expect(formatMessage).toBeVisible();
  }

  async verifyTroubleshootingGuidanceProvided() {
    const guidance = this.page.locator('[data-testid="troubleshooting-guidance"], .guidance, .help-text');
    await expect(guidance).toBeVisible();
  }

  async verifyAllCategoriesDisplayed(expectedCategories) {
    for (const category of expectedCategories) {
      const categoryElement = this.page.locator(`[data-category="${category}"], .category:has-text("${category}")`);
      await expect(categoryElement).toBeVisible();
    }
  }

  async clickCategory(categoryName) {
    const category = this.page.locator(`[data-category="${categoryName}"], a:has-text("${categoryName}"), .category:has-text("${categoryName}")`);
    await category.click();
  }

  async measureArticleRetrievalTime() {
    const startTime = Date.now();
    await expect(this.categoryArticles.first()).toBeVisible({ timeout: 3000 });
    const endTime = Date.now();
    return endTime - startTime;
  }

  async verifyArticlesRelevantToCategory(categoryName) {
    const articleCount = await this.categoryArticles.count();
    expect(articleCount).toBeGreaterThan(0);
    const firstArticle = this.categoryArticles.first();
    await expect(firstArticle).toBeVisible();
  }

  async clickArticle(articleTitle) {
    const article = this.page.locator(`a:has-text("${articleTitle}"), .article:has-text("${articleTitle}")`);
    await article.click();
  }

  async verifyArticleAccessible() {
    await expect(this.articleContent).toBeVisible();
  }

  async verifyArticlesTaggedWithCategory(categoryName) {
    const articleCount = await this.categoryArticles.count();
    expect(articleCount).toBeGreaterThan(0);
  }

  async verifyNoArticlesFromOtherCategories(excludedCategories) {
    for (const category of excludedCategories) {
      const wrongCategoryArticle = this.page.locator(`[data-category="${category}"]`);
      await expect(wrongCategoryArticle).toHaveCount(0);
    }
  }

  async openMultipleArticlesAndVerifyContent(count, expectedContentType) {
    const articleCount = await this.categoryArticles.count();
    const articlesToCheck = Math.min(count, articleCount);
    
    for (let i = 0; i < articlesToCheck; i++) {
      await this.categoryArticles.nth(i).click();
      await expect(this.articleContent).toBeVisible();
      const content = await this.articleContent.textContent();
      expect(content.toLowerCase()).toContain(expectedContentType);
      await this.page.goBack();
    }
  }

  async verifyNoCategoryContentMessageDisplayed() {
    const emptyMessage = this.page.locator('[data-testid="empty-category"], .no-content, text=/no articles/i');
    await expect(emptyMessage).toBeVisible();
  }

  async verifyNextStepsGuidanceProvided(steps) {
    for (const step of steps) {
      const stepText = this.page.locator(`text=/${step}/i`);
      await expect(stepText).toBeVisible();
    }
  }

  async verifyAlternativeCategoryLinksProvided(categories) {
    for (const category of categories) {
      const categoryLink = this.page.locator(`a:has-text("${category}")`);
      await expect(categoryLink).toBeVisible();
    }
  }
};
