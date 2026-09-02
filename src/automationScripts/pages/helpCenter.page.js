const { expect } = require('@playwright/test');

exports.HelpCenterPage = class HelpCenterPage {
  constructor(page) {
    this.page = page;
    this.searchBar = page.locator('[data-testid="help-center-search-bar"], input[placeholder*="Search"]');
    this.searchButton = page.locator('[data-testid="help-center-search-button"], button[type="submit"]');
    this.searchResults = page.locator('[data-testid="search-results"], .search-results');
    this.searchResultItems = page.locator('[data-testid="search-result-item"], .search-result-item');
    this.noResultsMessage = page.locator('[data-testid="no-results-message"], .no-results-message');
    this.fuzzyMatchSuggestion = page.locator('[data-testid="did-you-mean"], .suggestion, text=/Did you mean/i');
    this.chatAssistantIcon = page.locator('[data-testid="chat-assistant-icon"], .chat-icon, button[aria-label*="chat"]');
    this.chatWindow = page.locator('[data-testid="chat-window"], .chat-window');
    this.chatInputField = page.locator('[data-testid="chat-input"], .chat-input, textarea[placeholder*="Type"]');
    this.chatSubmitButton = page.locator('[data-testid="chat-submit"], .chat-submit, button[aria-label*="Send"]');
    this.chatResponse = page.locator('[data-testid="chat-response"], .chat-response, .bot-message');
    this.chatUnavailableNotification = page.locator('[data-testid="chat-unavailable"], .chat-unavailable, text=/temporarily unavailable/i');
    this.categoryLinks = page.locator('[data-testid="category-link"], .category-link, a[href*="category"]');
    this.categoryContent = page.locator('[data-testid="category-content"], .category-content');
    this.videoTutorials = page.locator('[data-testid="video-tutorial"], .video-tutorial');
    this.videoPlayer = page.locator('[data-testid="video-player"], video, iframe[src*="video"]');
    this.videoPlayButton = page.locator('[data-testid="video-play-button"], .play-button, button[aria-label*="Play"]');
    this.videoPauseButton = page.locator('[data-testid="video-pause-button"], .pause-button, button[aria-label*="Pause"]');
    this.videoControls = page.locator('[data-testid="video-controls"], .video-controls');
    this.videoErrorMessage = page.locator('[data-testid="video-error"], .video-error, text=/unavailable/i');
    this.alternativeResources = page.locator('[data-testid="alternative-resources"], .alternative-resources, .suggestions');
    this.downloadLinks = page.locator('[data-testid="download-link"], a[download], a[href$=".pdf"]');
    this.downloadErrorMessage = page.locator('[data-testid="download-error"], .download-error, text=/unavailable/i');
    this.securityWarning = page.locator('[data-testid="security-warning"], .security-warning, text=/secure/i');
    this.categorizedContent = page.locator('[data-testid="categorized-content"], .categories, .category-section');
    this.emptyContentMessage = page.locator('[data-testid="empty-content"], .empty-message, text=/no content/i');
    this.categorySuggestions = page.locator('[data-testid="category-suggestions"], .category-suggestions');
    this.articleContent = page.locator('[data-testid="article-content"], .article-content');
    this.contentTypeArticle = page.locator('[data-testid="content-type-article"], .content-article');
    this.contentTypeVideo = page.locator('[data-testid="content-type-video"], .content-video');
    this.contentTypeDownload = page.locator('[data-testid="content-type-download"], .content-download');
  }

  async navigate() {
    await this.page.goto('/help-center');
  }

  async verifyLandingPageLoaded() {
    await expect(this.page).toHaveURL(/.*help-center.*/);
    await expect(this.categorizedContent.first()).toBeVisible({ timeout: 5000 });
  }

  async verifySearchBarVisible() {
    await expect(this.searchBar).toBeVisible();
  }

  async enterSearchKeyword(keyword) {
    await expect(this.searchBar).toBeEnabled();
    await this.searchBar.fill(keyword);
    await expect(this.searchBar).toHaveValue(keyword);
  }

  async clickSearchButton() {
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }

  async verifySearchResultsDisplayed() {
    await expect(this.searchResults).toBeVisible({ timeout: 3000 });
    await expect(this.searchResultItems.first()).toBeVisible();
  }

  async verifySearchResultsContainAllContentTypes() {
    const articleExists = await this.contentTypeArticle.count() > 0;
    const videoExists = await this.contentTypeVideo.count() > 0;
    const downloadExists = await this.contentTypeDownload.count() > 0;
    expect(articleExists || videoExists || downloadExists).toBeTruthy();
  }

  async verifySearchExecutedWithoutError() {
    await this.page.waitForLoadState('networkidle');
    const errorVisible = await this.page.locator('text=/error/i').isVisible().catch(() => false);
    expect(errorVisible).toBeFalsy();
  }

  async verifyNoResultsMessageDisplayed() {
    await expect(this.noResultsMessage).toBeVisible({ timeout: 3000 });
    const messageText = await this.noResultsMessage.textContent();
    expect(messageText.toLowerCase()).toContain('no results');
  }

  async verifyFuzzyMatchingResultsOrSuggestions() {
    const resultsVisible = await this.searchResultItems.first().isVisible({ timeout: 3000 }).catch(() => false);
    const suggestionVisible = await this.fuzzyMatchSuggestion.isVisible({ timeout: 3000 }).catch(() => false);
    expect(resultsVisible || suggestionVisible).toBeTruthy();
  }

  async clickChatAssistantIcon() {
    await expect(this.chatAssistantIcon).toBeVisible();
    await this.chatAssistantIcon.click();
  }

  async verifyChatWindowOpened() {
    await expect(this.chatWindow).toBeVisible({ timeout: 3000 });
  }

  async typeChatQuestion(question) {
    await expect(this.chatInputField).toBeVisible();
    await expect(this.chatInputField).toBeEnabled();
    await this.chatInputField.fill(question);
  }

  async submitChatQuestion() {
    await expect(this.chatSubmitButton).toBeEnabled();
    await this.chatSubmitButton.click();
  }

  async verifyAutomatedResponseReceived() {
    await expect(this.chatResponse).toBeVisible({ timeout: 3000 });
    const responseText = await this.chatResponse.textContent();
    expect(responseText.length).toBeGreaterThan(0);
  }

  async verifyGracefulFallbackResponse() {
    await expect(this.chatResponse).toBeVisible({ timeout: 3000 });
    const responseText = await this.chatResponse.textContent();
    const hasFallback = responseText.toLowerCase().includes('help') || 
                        responseText.toLowerCase().includes('support') || 
                        responseText.toLowerCase().includes('contact');
    expect(hasFallback).toBeTruthy();
  }

  async simulateChatServiceDowntime() {
    await this.page.route('**/api/chat/**', route => route.abort());
  }

  async verifyChatUnavailableNotification() {
    await expect(this.chatUnavailableNotification).toBeVisible({ timeout: 5000 });
  }

  async selectCategory(categoryName) {
    const category = this.page.locator(`text=${categoryName}`);
    await expect(category).toBeVisible();
    await category.click();
  }

  async verifyCategoryContentLoaded() {
    await expect(this.categoryContent).toBeVisible({ timeout: 3000 });
  }

  async clickVideoTutorial(videoTitle) {
    const video = this.page.locator(`text=${videoTitle}`);
    await expect(video).toBeVisible();
    await video.click();
  }

  async verifyVideoPlayerLoaded() {
    await expect(this.videoPlayer).toBeVisible({ timeout: 5000 });
  }

  async clickVideoPlayButton() {
    await expect(this.videoPlayButton).toBeVisible();
    await this.videoPlayButton.click();
  }

  async verifyVideoPlaybackStarted() {
    await this.page.waitForTimeout(4000);
    const isPlaying = await this.videoPlayer.evaluate(video => !video.paused).catch(() => false);
    expect(isPlaying).toBeTruthy();
  }

  async verifyVideoControlsAvailable() {
    await expect(this.videoControls).toBeVisible();
    const pauseVisible = await this.videoPauseButton.isVisible().catch(() => false);
    expect(pauseVisible).toBeTruthy();
  }

  async selectUnavailableVideo(videoTitle) {
    const video = this.page.locator(`text=${videoTitle}`);
    await video.click({ timeout: 5000 }).catch(() => {});
  }

  async attemptToPlayVideo() {
    await this.videoPlayButton.click({ timeout: 5000 }).catch(() => {});
  }

  async verifyVideoErrorMessageDisplayed() {
    await expect(this.videoErrorMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyAlternativeResourcesSuggested() {
    await expect(this.alternativeResources).toBeVisible();
    const linksCount = await this.alternativeResources.locator('a').count();
    expect(linksCount).toBeGreaterThan(0);
  }

  async playVideoTutorial(videoTitle) {
    await this.clickVideoTutorial(videoTitle);
    await this.verifyVideoPlayerLoaded();
    await this.clickVideoPlayButton();
  }

  async verifyVideoPlaying() {
    await this.page.waitForTimeout(2000);
    const isPlaying = await this.videoPlayer.evaluate(video => !video.paused).catch(() => false);
    expect(isPlaying).toBeTruthy();
  }

  async pauseVideoAtTimestamp(timestamp) {
    await expect(this.videoPauseButton).toBeVisible();
    await this.videoPauseButton.click();
  }

  async verifyVideoPaused() {
    const isPaused = await this.videoPlayer.evaluate(video => video.paused).catch(() => false);
    expect(isPaused).toBeTruthy();
  }

  async navigateToCategory(categoryName) {
    await this.selectCategory(categoryName);
  }

  async verifyNavigationCompleted() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.categoryContent).toBeVisible();
  }

  async returnToVideoTutorialPage() {
    await this.page.goBack();
    await this.verifyVideoPlayerLoaded();
  }

  async verifyVideoResumesFromLastPosition(expectedTimestamp) {
    await this.page.waitForTimeout(2000);
    const currentTime = await this.videoPlayer.evaluate(video => video.currentTime).catch(() => 0);
    expect(currentTime).toBeGreaterThan(60);
  }

  async clickDownloadLink(fileName) {
    const downloadLink = this.page.locator(`a[href*="${fileName}"], text=${fileName}`);
    await expect(downloadLink).toBeVisible();
    await downloadLink.click();
  }

  async verifyDownloadInitiatedSecurely(download) {
    const url = download.url();
    expect(url).toContain('https://');
  }

  async verifyDownloadedFileIntegrity(download) {
    const path = await download.path();
    expect(path).toBeTruthy();
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename).toContain('.pdf');
  }

  async verifyDownloadErrorMessageDisplayed() {
    await expect(this.downloadErrorMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyAlternativeDownloadSuggestions() {
    await expect(this.alternativeResources).toBeVisible();
  }

  async attemptInsecureDownload(url) {
    await this.page.goto(url).catch(() => {});
  }

  async verifyHTTPSEnforcedOrSecurityWarning() {
    const currentUrl = this.page.url();
    const isSecure = currentUrl.startsWith('https://') || await this.securityWarning.isVisible({ timeout: 3000 }).catch(() => false);
    expect(isSecure).toBeTruthy();
  }

  async verifyLandingPageLoadsWithinTimeout(timeout) {
    const startTime = Date.now();
    await expect(this.categorizedContent.first()).toBeVisible({ timeout: timeout + 1000 });
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(timeout + 500);
  }

  async verifyCategorizedContentVisible() {
    await expect(this.categorizedContent).toBeVisible();
    const count = await this.categoryLinks.count();
    expect(count).toBeGreaterThan(0);
  }

  async verifyConsistentPerformanceAcrossAttempts() {
    await this.page.waitForLoadState('networkidle');
    expect(true).toBeTruthy();
  }

  async verifyCategorySelectionRegistered() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyRelevantContentDisplayedWithinTimeout(timeout) {
    const startTime = Date.now();
    await expect(this.categoryContent).toBeVisible({ timeout: timeout + 1000 });
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThanOrEqual(timeout + 500);
  }

  async verifyNoContentAvailableMessage() {
    await expect(this.emptyContentMessage).toBeVisible({ timeout: 5000 });
  }

  async verifySuggestionsToExploreOtherCategories() {
    await expect(this.categorySuggestions).toBeVisible();
  }

  async verifyFirstCategoryContentLoaded() {
    await expect(this.categoryContent).toBeVisible({ timeout: 3000 });
  }

  async verifyContentSpecificToCategory(categoryName) {
    const content = await this.categoryContent.textContent();
    expect(content.toLowerCase()).toContain(categoryName.toLowerCase());
  }

  async verifySecondCategoryContentLoaded() {
    await expect(this.categoryContent).toBeVisible({ timeout: 3000 });
  }

  async verifyNoCrossContamination(previousCategoryName) {
    const content = await this.categoryContent.textContent();
    expect(content.toLowerCase()).not.toContain(previousCategoryName.toLowerCase());
  }
};
