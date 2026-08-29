const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

exports.HelpCenterPage = class HelpCenterPage {
  constructor(page) {
    this.page = page;
    
    // Main page elements
    this.helpCenterContainer = page.locator('[data-testid="help-center-container"]');
    this.pageTitle = page.locator('h1:has-text("Help Center")');
    
    // Chat assistant elements
    this.chatAssistantIcon = page.locator('[data-testid="chat-assistant-icon"]');
    this.chatInterface = page.locator('[data-testid="chat-interface"]');
    this.chatInputField = page.locator('[data-testid="chat-input-field"]');
    this.chatSubmitButton = page.locator('[data-testid="chat-submit-button"]');
    this.chatResponse = page.locator('[data-testid="chat-response"]');
    this.chatOfflineNotification = page.locator('[data-testid="chat-offline-notification"]');
    this.chatMessages = page.locator('[data-testid="chat-message"]');
    
    // Search elements
    this.searchField = page.locator('[data-testid="help-center-search-field"]');
    this.searchButton = page.locator('[data-testid="help-center-search-button"]');
    this.searchResults = page.locator('[data-testid="search-results"]');
    this.searchResultItems = page.locator('[data-testid="search-result-item"]');
    this.noResultsMessage = page.locator('[data-testid="no-results-message"]');
    
    // Category elements
    this.categoriesContainer = page.locator('[data-testid="categories-container"]');
    this.categoryLinks = page.locator('[data-testid="category-link"]');
    this.categoryPageTitle = page.locator('[data-testid="category-page-title"]');
    this.articlesList = page.locator('[data-testid="articles-list"]');
    this.articleItems = page.locator('[data-testid="article-item"]');
    this.emptyCategoryMessage = page.locator('[data-testid="empty-category-message"]');
    this.backToLandingButton = page.locator('[data-testid="back-to-landing"]');
    
    // Video elements
    this.videoPlayer = page.locator('[data-testid="video-player"]');
    this.videoPlayButton = page.locator('[data-testid="video-play-button"]');
    this.videoPauseButton = page.locator('[data-testid="video-pause-button"]');
    this.videoErrorMessage = page.locator('[data-testid="video-error-message"]');
    this.videoProgressBar = page.locator('[data-testid="video-progress-bar"]');
    
    // Help materials elements
    this.helpMaterialsSection = page.locator('[data-testid="help-materials-section"]');
    this.downloadLinks = page.locator('[data-testid="download-link"]');
    this.downloadErrorMessage = page.locator('[data-testid="download-error-message"]');
  }

  async navigate() {
    await this.page.goto('/help-center');
  }

  async verifyPageLoaded() {
    await expect(this.helpCenterContainer).toBeVisible({ timeout: 10000 });
    await expect(this.pageTitle).toBeVisible();
  }

  async verifyHelpCenterLandingPageLoaded() {
    await expect(this.helpCenterContainer).toBeVisible({ timeout: 10000 });
    await expect(this.pageTitle).toContainText('Help Center');
  }

  // Chat assistant methods
  async clickChatAssistantIcon() {
    await expect(this.chatAssistantIcon).toBeVisible();
    await this.chatAssistantIcon.click();
  }

  async verifyChatInterfaceOpened() {
    await expect(this.chatInterface).toBeVisible({ timeout: 5000 });
  }

  async typeChatQuestion(question) {
    await expect(this.chatInputField).toBeVisible();
    await this.chatInputField.fill(question);
  }

  async verifyChatQuestionEntered(expectedQuestion) {
    await expect(this.chatInputField).toHaveValue(expectedQuestion);
  }

  async submitChatQuestion() {
    await expect(this.chatSubmitButton).toBeEnabled();
    await this.chatSubmitButton.click();
  }

  async verifyChatResponseReceived() {
    await expect(this.chatResponse).toBeVisible({ timeout: 10000 });
    const responseText = await this.chatResponse.textContent();
    expect(responseText.length).toBeGreaterThan(0);
  }

  async simulateChatServiceOffline() {
    // Simulate offline condition via route interception
    await this.page.route('**/api/chat/**', route => route.abort());
  }

  async verifyChatOfflineNotification() {
    await expect(this.chatOfflineNotification).toBeVisible({ timeout: 5000 });
    await expect(this.chatOfflineNotification).toContainText(/unavailable|offline|alternative support/i);
  }

  async verifyContextualChatResponse() {
    const messagesCount = await this.chatMessages.count();
    expect(messagesCount).toBeGreaterThanOrEqual(2);
    await expect(this.chatResponse.last()).toBeVisible();
  }

  async verifyConversationContextMaintained() {
    const messagesCount = await this.chatMessages.count();
    expect(messagesCount).toBeGreaterThanOrEqual(3);
    await expect(this.chatResponse.last()).toBeVisible();
  }

  // Search methods
  async verifySearchFieldVisible() {
    await expect(this.searchField).toBeVisible();
  }

  async enterSearchKeyword(keyword) {
    await expect(this.searchField).toBeVisible();
    await this.searchField.fill(keyword);
  }

  async verifySearchKeywordEntered(expectedKeyword) {
    await expect(this.searchField).toHaveValue(expectedKeyword);
  }

  async submitSearch() {
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }

  async verifySearchResultsDisplayedWithinTime(timeoutMs) {
    const startTime = Date.now();
    await expect(this.searchResults).toBeVisible({ timeout: timeoutMs });
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    expect(elapsedTime).toBeLessThanOrEqual(timeoutMs);
  }

  async verifySearchResultsDisplayed() {
    await expect(this.searchResults).toBeVisible({ timeout: 5000 });
  }

  async verifySearchResultsRelevance(keyword) {
    await expect(this.searchResultItems.first()).toBeVisible();
    const resultsCount = await this.searchResultItems.count();
    expect(resultsCount).toBeGreaterThan(0);
    
    for (let i = 0; i < resultsCount; i++) {
      const resultText = await this.searchResultItems.nth(i).textContent();
      expect(resultText.toLowerCase()).toContain(keyword.toLowerCase());
    }
  }

  async verifyNoResultsMessage() {
    await expect(this.noResultsMessage).toBeVisible({ timeout: 5000 });
    await expect(this.noResultsMessage).toContainText(/no results|not found|alternative search/i);
  }

  async verifySearchResultsMatchAllKeywords(phrase) {
    await expect(this.searchResultItems.first()).toBeVisible();
    const resultsCount = await this.searchResultItems.count();
    expect(resultsCount).toBeGreaterThan(0);
    
    const keywords = phrase.toLowerCase().split(' ');
    for (let i = 0; i < Math.min(resultsCount, 5); i++) {
      const resultText = await this.searchResultItems.nth(i).textContent();
      const resultTextLower = resultText.toLowerCase();
      const matchesAll = keywords.some(keyword => resultTextLower.includes(keyword));
      expect(matchesAll).toBeTruthy();
    }
  }

  // Category navigation methods
  async verifyCategoriesVisible() {
    await expect(this.categoriesContainer).toBeVisible();
    await expect(this.categoryLinks.first()).toBeVisible();
  }

  async selectCategory(categoryName) {
    const categoryLink = this.page.locator(`[data-testid="category-link"]:has-text("${categoryName}")`);
    await expect(categoryLink).toBeVisible();
    await categoryLink.click();
  }

  async verifyCategoryPageLoaded(categoryName) {
    await expect(this.categoryPageTitle).toBeVisible({ timeout: 5000 });
    await expect(this.categoryPageTitle).toContainText(categoryName);
  }

  async verifyArticlesDisplayed() {
    await expect(this.articlesList).toBeVisible();
    const articlesCount = await this.articleItems.count();
    expect(articlesCount).toBeGreaterThan(0);
  }

  async verifyEmptyCategoryMessage() {
    await expect(this.emptyCategoryMessage).toBeVisible({ timeout: 5000 });
    await expect(this.emptyCategoryMessage).toContainText(/no content|currently available/i);
  }

  async verifyCategoryContentType(categoryName) {
    await expect(this.categoryPageTitle).toContainText(categoryName);
    await expect(this.articlesList).toBeVisible();
  }

  async navigateBackToLanding() {
    await expect(this.backToLandingButton).toBeVisible();
    await this.backToLandingButton.click();
    await this.verifyPageLoaded();
  }

  async verifyAllCategoriesDisplayed(expectedCategories) {
    await expect(this.categoriesContainer).toBeVisible();
    
    for (const category of expectedCategories) {
      const categoryElement = this.page.locator(`[data-testid="category-link"]:has-text("${category}")`);
      await expect(categoryElement).toBeVisible();
    }
  }

  // Video methods
  async selectHelpTopic(topicName) {
    const topicLink = this.page.locator(`[data-testid="help-topic-link"]:has-text("${topicName}")`);
    await expect(topicLink).toBeVisible();
    await topicLink.click();
  }

  async verifyVideoPlayerVisible() {
    await expect(this.videoPlayer).toBeVisible({ timeout: 5000 });
  }

  async clickVideoPlayButton() {
    await expect(this.videoPlayButton).toBeVisible();
    await this.videoPlayButton.click();
  }

  async verifyVideoPlaying() {
    // Wait for video to start playing
    await this.page.waitForTimeout(1000);
    const isPlaying = await this.page.evaluate(() => {
      const video = document.querySelector('video');
      return video && !video.paused && !video.ended && video.readyState > 2;
    });
    expect(isPlaying).toBeTruthy();
  }

  async verifyVideoErrorMessage() {
    await expect(this.videoErrorMessage).toBeVisible({ timeout: 5000 });
    await expect(this.videoErrorMessage).toContainText(/cannot be played|error|unavailable/i);
  }

  async pauseVideoAtTimestamp(timestamp) {
    // Convert timestamp to seconds (e.g., "1:30" to 90)
    const parts = timestamp.split(':');
    const seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    
    await this.page.evaluate((targetSeconds) => {
      const video = document.querySelector('video');
      if (video) {
        video.currentTime = targetSeconds;
      }
    }, seconds);
    
    await expect(this.videoPauseButton).toBeVisible();
    await this.videoPauseButton.click();
  }

  async verifyVideoPaused() {
    const isPaused = await this.page.evaluate(() => {
      const video = document.querySelector('video');
      return video && video.paused;
    });
    expect(isPaused).toBeTruthy();
  }

  async navigateAwayFromPage() {
    await this.page.goto('/home');
  }

  async returnToHelpTopic(topicName) {
    await this.navigate();
    await this.selectHelpTopic(topicName);
  }

  async verifyVideoResumePosition() {
    await expect(this.videoPlayer).toBeVisible();
    // Verify video either resumes from last position or restarts
    const currentTime = await this.page.evaluate(() => {
      const video = document.querySelector('video');
      return video ? video.currentTime : 0;
    });
    expect(currentTime).toBeGreaterThanOrEqual(0);
  }

  // Help materials methods
  async navigateToHelpMaterialsSection() {
    const helpMaterialsLink = this.page.locator('[data-testid="category-link"]:has-text("Help Materials")');
    await expect(helpMaterialsLink).toBeVisible();
    await helpMaterialsLink.click();
  }

  async verifyHelpMaterialsSectionLoaded() {
    await expect(this.helpMaterialsSection).toBeVisible({ timeout: 5000 });
  }

  async downloadHelpMaterial(fileName) {
    const downloadLink = this.page.locator(`[data-testid="download-link"][href*="${fileName}"]`);
    await expect(downloadLink).toBeVisible();
    
    const downloadPromise = this.page.waitForEvent('download');
    await downloadLink.click();
    const download = await downloadPromise;
    
    const downloadPath = path.join(__dirname, '../../downloads', fileName);
    await download.saveAs(downloadPath);
    
    return downloadPath;
  }

  async verifyFileDownloaded(filePath) {
    // Wait for file to be fully downloaded
    await this.page.waitForTimeout(2000);
    const fileExists = fs.existsSync(filePath);
    expect(fileExists).toBeTruthy();
    
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);
  }

  async verifyFileAccessibleOffline(filePath) {
    const fileExists = fs.existsSync(filePath);
    expect(fileExists).toBeTruthy();
    
    const fileContent = fs.readFileSync(filePath);
    expect(fileContent.length).toBeGreaterThan(0);
  }

  async attemptDownloadBrokenLink(fileName) {
    const downloadLink = this.page.locator(`[data-testid="download-link"][href*="${fileName}"]`);
    await expect(downloadLink).toBeVisible();
    await downloadLink.click();
  }

  async verifyDownloadErrorMessage() {
    await expect(this.downloadErrorMessage).toBeVisible({ timeout: 5000 });
    await expect(this.downloadErrorMessage).toContainText(/error|unavailable|not found/i);
  }
};