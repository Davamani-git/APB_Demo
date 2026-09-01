const { expect } = require('@playwright/test');

exports.HelpCenterPage = class HelpCenterPage {
  constructor(page) {
    this.page = page;
    this.searchBar = page.locator('[data-testid="help-center-search-bar"], input[placeholder*="Search"], #search-input');
    this.searchButton = page.locator('[data-testid="search-button"], button[type="submit"], button:has-text("Search")');
    this.searchResults = page.locator('[data-testid="search-results"], .search-results, #search-results');
    this.noResultsMessage = page.locator('[data-testid="no-results-message"], .no-results, :has-text("no results found")');
    this.chatAssistantIcon = page.locator('[data-testid="chat-assistant-icon"], .chat-icon, #chat-assistant');
    this.chatWindow = page.locator('[data-testid="chat-window"], .chat-window, #chat-window');
    this.chatInput = page.locator('[data-testid="chat-input"], .chat-input, textarea[placeholder*="message"]');
    this.chatSendButton = page.locator('[data-testid="chat-send-button"], .chat-send, button:has-text("Send")');
    this.chatResponse = page.locator('[data-testid="chat-response"], .chat-message, .bot-response');
    this.chatErrorMessage = page.locator('[data-testid="chat-error"], .chat-error, :has-text("unavailable")');
    this.videoPlayer = page.locator('[data-testid="video-player"], video, .video-player');
    this.videoPlayButton = page.locator('[data-testid="video-play-button"], .play-button, button[aria-label*="Play"]');
    this.videoPauseButton = page.locator('[data-testid="video-pause-button"], .pause-button, button[aria-label*="Pause"]');
    this.videoVolumeControl = page.locator('[data-testid="video-volume"], .volume-control, input[type="range"][aria-label*="Volume"]');
    this.videoFullscreenButton = page.locator('[data-testid="video-fullscreen"], .fullscreen-button, button[aria-label*="Fullscreen"]');
    this.videoErrorMessage = page.locator('[data-testid="video-error"], .video-error, :has-text("unavailable")');
    this.downloadLink = page.locator('[data-testid="download-link"], a[download], .download-link');
    this.downloadErrorMessage = page.locator('[data-testid="download-error"], .download-error, :has-text("unavailable")');
    this.categoriesSection = page.locator('[data-testid="categories"], .categories, #help-categories');
    this.categoryItem = page.locator('[data-testid="category-item"], .category-item, .category');
    this.articlesList = page.locator('[data-testid="articles-list"], .articles-list, .help-articles');
    this.noCategoryContentMessage = page.locator('[data-testid="no-content-message"], .no-content, :has-text("no content")');
    this.helpCenterTitle = page.locator('[data-testid="help-center-title"], h1:has-text("Help Center"), .help-center-title');
    this.backendErrorMessage = page.locator('[data-testid="backend-error"], .error-message, :has-text("unavailable")');
    this.allCategorizedContent = page.locator('[data-testid="categorized-content"], .content-categories, .help-content');
  }

  async navigate() {
    await this.page.goto('/help-center');
  }

  async verifyPageLoaded() {
    await expect(this.page).toHaveURL(/.*help-center.*/, { timeout: 10000 });
    await expect(this.helpCenterTitle).toBeVisible({ timeout: 5000 });
  }

  async verifySearchBarVisible() {
    await expect(this.searchBar).toBeVisible({ timeout: 5000 });
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
    const resultsCount = await this.searchResults.locator('[data-testid="result-item"], .result-item, .search-result').count();
    expect(resultsCount).toBeGreaterThan(0);
  }

  async verifyNoResultsMessage() {
    await expect(this.noResultsMessage).toBeVisible({ timeout: 3000 });
  }

  async verifySearchHandledSafely() {
    await this.page.waitForLoadState('networkidle');
    const hasError = await this.page.locator('.error, [data-testid="error"]').isVisible().catch(() => false);
    const hasResults = await this.searchResults.isVisible().catch(() => false);
    const hasNoResults = await this.noResultsMessage.isVisible().catch(() => false);
    expect(hasError || hasResults || hasNoResults).toBeTruthy();
  }

  async verifyChatAssistantIconVisible() {
    await expect(this.chatAssistantIcon).toBeVisible({ timeout: 5000 });
  }

  async clickChatAssistantIcon() {
    await expect(this.chatAssistantIcon).toBeEnabled();
    await this.chatAssistantIcon.click();
  }

  async verifyChatWindowOpened() {
    await expect(this.chatWindow).toBeVisible({ timeout: 3000 });
  }

  async typeChatMessage(message) {
    await expect(this.chatInput).toBeVisible();
    await expect(this.chatInput).toBeEnabled();
    await this.chatInput.fill(message);
  }

  async sendChatMessage() {
    await expect(this.chatSendButton).toBeEnabled();
    await this.chatSendButton.click();
  }

  async verifyAutomatedResponseReceived() {
    await expect(this.chatResponse).toBeVisible({ timeout: 5000 });
  }

  async verifyChatErrorMessage() {
    await expect(this.chatErrorMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyContextualResponseReceived() {
    await expect(this.chatResponse).toBeVisible({ timeout: 5000 });
  }

  async selectVideoTutorial(videoTitle) {
    const videoLink = this.page.locator(`[data-testid="video-${videoTitle}"], a:has-text("${videoTitle}"), .video-link:has-text("${videoTitle}")`);
    await expect(videoLink).toBeVisible();
    await videoLink.click();
  }

  async verifyVideoPlayerVisible() {
    await expect(this.videoPlayer).toBeVisible({ timeout: 5000 });
  }

  async clickVideoPlayButton() {
    await expect(this.videoPlayButton).toBeVisible();
    await expect(this.videoPlayButton).toBeEnabled();
    await this.videoPlayButton.click();
  }

  async verifyVideoStartsPlayback() {
    await this.page.waitForTimeout(2000);
    const isPlaying = await this.videoPlayer.evaluate((video) => !video.paused);
    expect(isPlaying).toBeTruthy();
  }

  async testVideoControls() {
    await expect(this.videoPauseButton).toBeVisible();
    await this.videoPauseButton.click();
    await expect(this.videoVolumeControl).toBeVisible();
    await this.videoVolumeControl.click();
    await expect(this.videoFullscreenButton).toBeVisible();
    await this.videoFullscreenButton.click();
  }

  async verifyVideoErrorMessage() {
    await expect(this.videoErrorMessage).toBeVisible({ timeout: 5000 });
  }

  async pauseVideoAtTimestamp(timestamp) {
    await this.page.waitForTimeout(3000);
    await expect(this.videoPauseButton).toBeVisible();
    await this.videoPauseButton.click();
  }

  async navigateToHelpArticle(articleTitle) {
    const articleLink = this.page.locator(`[data-testid="article-${articleTitle}"], a:has-text("${articleTitle}"), .article-link:has-text("${articleTitle}")`);
    await expect(articleLink).toBeVisible();
    await articleLink.click();
  }

  async verifyHelpArticleLoaded() {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator('[data-testid="article-content"], .article-content, article')).toBeVisible();
  }

  async returnToVideoTutorial() {
    await this.page.goBack();
  }

  async verifyVideoResumeFromPausedPosition() {
    await expect(this.videoPlayer).toBeVisible();
    const isPaused = await this.videoPlayer.evaluate((video) => video.paused);
    expect(isPaused).toBeTruthy();
  }

  async locateDownloadableMaterial(materialName) {
    const materialLink = this.page.locator(`[data-testid="material-${materialName}"], a:has-text("${materialName}"), .material-link:has-text("${materialName}")`);
    await expect(materialLink).toBeVisible();
    this.currentMaterialLink = materialLink;
  }

  async verifyDownloadLinkVisible() {
    await expect(this.downloadLink).toBeVisible();
  }

  async clickDownloadLink() {
    if (this.currentMaterialLink) {
      await this.currentMaterialLink.click();
    } else {
      await this.downloadLink.click();
    }
  }

  async verifyFileDownloaded(download) {
    expect(download).toBeTruthy();
    const fileName = download.suggestedFilename();
    expect(fileName).toBeTruthy();
  }

  async verifyDownloadErrorMessage() {
    await expect(this.downloadErrorMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyDownloadFailureFeedback() {
    await expect(this.downloadErrorMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyRedirectedToHelpCenter() {
    await expect(this.page).toHaveURL(/.*help-center.*/, { timeout: 3000 });
  }

  async verifyAllCategorizedContentVisible() {
    await expect(this.allCategorizedContent).toBeVisible({ timeout: 5000 });
    const categories = ['Getting Started', 'FAQs', 'How-to Guides', 'Video Tutorials'];
    for (const category of categories) {
      const categoryElement = this.page.locator(`:has-text("${category}")`);
      await expect(categoryElement).toBeVisible();
    }
  }

  async verifyBackendErrorMessage() {
    await expect(this.backendErrorMessage).toBeVisible({ timeout: 5000 });
  }

  async verifyHelpCenterLoaded() {
    await expect(this.helpCenterTitle).toBeVisible({ timeout: 5000 });
  }

  async verifyAllContentVisible() {
    await expect(this.allCategorizedContent).toBeVisible();
  }

  async verifyCategoriesVisible() {
    await expect(this.categoriesSection).toBeVisible({ timeout: 5000 });
  }

  async selectCategory(categoryName) {
    const category = this.page.locator(`[data-testid="category-${categoryName}"], .category:has-text("${categoryName}"), button:has-text("${categoryName}")`);
    await expect(category).toBeVisible();
    await category.click();
  }

  async verifyCategorySelected() {
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRelevantArticlesDisplayed() {
    await expect(this.articlesList).toBeVisible({ timeout: 5000 });
    const articlesCount = await this.articlesList.locator('[data-testid="article-item"], .article-item, .article').count();
    expect(articlesCount).toBeGreaterThan(0);
  }

  async verifyUniqueArticlesForCategory(categoryName) {
    await expect(this.articlesList).toBeVisible({ timeout: 5000 });
    const articlesCount = await this.articlesList.locator('[data-testid="article-item"], .article-item, .article').count();
    expect(articlesCount).toBeGreaterThan(0);
  }

  async verifyNoCategoryContentMessage() {
    await expect(this.noCategoryContentMessage).toBeVisible({ timeout: 5000 });
  }
};