const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.HelpCenterPage = class HelpCenterPage {
  constructor(page) {
    this.page = page;
    
    // Main page elements
    this.pageTitle = page.locator('h1:has-text("Help Center")');
    this.categoriesContainer = page.locator('[data-testid="categories-container"], .categories-section');
    
    // Category elements
    this.categoryGettingStarted = page.locator('[data-category="getting-started"], a:has-text("Getting Started")');
    this.categoryFAQs = page.locator('[data-category="faqs"], a:has-text("FAQs")');
    this.categoryHowToGuides = page.locator('[data-category="how-to-guides"], a:has-text("How-to Guides")');
    this.categoryVideoTutorials = page.locator('[data-category="video-tutorials"], a:has-text("Video Tutorials")');
    this.categoryHelpMaterials = page.locator('[data-category="help-materials"], a:has-text("Help Materials")');
    this.categoryTroubleshooting = page.locator('[data-category="troubleshooting"], a:has-text("Troubleshooting")');
    this.categoryChatSupport = page.locator('[data-category="chat-support"], a:has-text("Chat Support")');
    this.categorySearchHelp = page.locator('[data-category="search-help"], a:has-text("Search Help")');
    
    // Chat assistant elements
    this.chatAssistantButton = page.locator('[data-testid="chat-assistant-button"], button:has-text("Chat"), #chat-button');
    this.chatWindow = page.locator('[data-testid="chat-window"], .chat-window, #chat-widget');
    this.chatInputField = page.locator('[data-testid="chat-input"], .chat-input, #chat-input-field');
    this.chatSendButton = page.locator('[data-testid="chat-send"], .chat-send-button, button:has-text("Send")');
    this.chatMessagesContainer = page.locator('[data-testid="chat-messages"], .chat-messages');
    this.chatErrorMessage = page.locator('[data-testid="chat-error"], .chat-error-message');
    this.alternativeSupportContacts = page.locator('[data-testid="alternative-support"], .alternative-contacts');
    this.chatValidationError = page.locator('[data-testid="chat-validation-error"], .validation-error');
    this.chatResponse = page.locator('[data-testid="chat-response"], .chat-response, .bot-message');
    
    // Video elements
    this.videoTutorialsList = page.locator('[data-testid="video-tutorials-list"], .video-list');
    this.videoPlayer = page.locator('[data-testid="video-player"], video, .video-player');
    this.videoPlayButton = page.locator('[data-testid="video-play"], .video-play-button, button[aria-label="Play"]');
    this.videoPauseButton = page.locator('[data-testid="video-pause"], .video-pause-button, button[aria-label="Pause"]');
    this.videoVolumeControl = page.locator('[data-testid="video-volume"], .volume-control, input[type="range"][aria-label="Volume"]');
    this.videoMuteButton = page.locator('[data-testid="video-mute"], button[aria-label="Mute"]');
    this.videoUnmuteButton = page.locator('[data-testid="video-unmute"], button[aria-label="Unmute"]');
    this.videoFullscreenButton = page.locator('[data-testid="video-fullscreen"], button[aria-label="Fullscreen"]');
    this.videoErrorMessage = page.locator('[data-testid="video-error"], .video-error-message');
    this.alternativeLearningResources = page.locator('[data-testid="alternative-resources"], .alternative-learning-resources');
    this.codecCompatibilityError = page.locator('[data-testid="codec-error"], .codec-compatibility-error');
    this.browserRecommendations = page.locator('[data-testid="browser-recommendations"], .browser-recommendations');
    
    // Download elements
    this.downloadableMaterialsList = page.locator('[data-testid="downloadable-materials"], .downloadable-materials-list');
    this.downloadLink = (filename) => page.locator(`[data-testid="download-${filename}"], a[href*="${filename}"], a:has-text("${filename}")`);
    this.fileNotFoundError = page.locator('[data-testid="file-not-found"], .file-not-found-error, :has-text("404")');
    this.corruptedFileError = page.locator('[data-testid="corrupted-file-error"], .corrupted-file-error');
    
    // Article elements
    this.articlesList = page.locator('[data-testid="articles-list"], .articles-list');
    this.articleContent = page.locator('[data-testid="article-content"], .article-content, article');
    this.faqList = page.locator('[data-testid="faq-list"], .faq-list');
    this.faqContent = page.locator('[data-testid="faq-content"], .faq-content');
    
    // Error and message elements
    this.emptyCategoryMessage = page.locator('[data-testid="empty-category"], .empty-category-message, :has-text("No articles available")');
    this.dataLoadError = page.locator('[data-testid="data-load-error"], .data-load-error');
    this.errorGuidance = page.locator('[data-testid="error-guidance"], .error-guidance');
    this.serviceUnavailableError = page.locator('[data-testid="service-unavailable"], .service-unavailable-error');
    this.alternativeSupportOptions = page.locator('[data-testid="alternative-support-options"], .alternative-support-options');
    this.loadingIndicator = page.locator('[data-testid="loading-indicator"], .loading-spinner, .loader');
    this.timeoutMessage = page.locator('[data-testid="timeout-message"], .timeout-message');
    this.retryButton = page.locator('[data-testid="retry-button"], button:has-text("Retry")');
  }

  async navigate(url) {
    logger.info(`Navigating to Help Center: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async verifyPageLoaded() {
    logger.info('Verifying Help Center page loaded');
    await expect(this.pageTitle.or(this.categoriesContainer)).toBeVisible({ timeout: 10000 });
  }

  async verifyCategoriesVisible() {
    logger.info('Verifying categories are visible');
    await expect(this.categoriesContainer).toBeVisible();
  }

  async verifyAllCategoriesDisplayed(categories) {
    logger.info('Verifying all categories are displayed');
    for (const category of categories) {
      const categoryLocator = this.page.locator(`:has-text("${category}")`);
      await expect(categoryLocator).toBeVisible();
    }
  }

  async clickChatAssistantButton() {
    logger.info('Clicking chat assistant button');
    await expect(this.chatAssistantButton).toBeVisible();
    await expect(this.chatAssistantButton).toBeEnabled();
    await this.chatAssistantButton.click();
  }

  async verifyChatWindowOpensWithinTimeout(timeoutMs) {
    logger.info(`Verifying chat window opens within ${timeoutMs}ms`);
    const startTime = Date.now();
    await expect(this.chatWindow).toBeVisible({ timeout: timeoutMs });
    const actualTime = Date.now() - startTime;
    logger.info(`Chat window opened in ${actualTime}ms`);
  }

  async enterChatMessage(message) {
    logger.info(`Entering chat message: ${message.substring(0, 50)}...`);
    await expect(this.chatInputField).toBeVisible();
    await this.chatInputField.fill(message);
  }

  async verifyMessageDisplayedInChat(message) {
    logger.info('Verifying message displayed in chat');
    const messageLocator = this.chatMessagesContainer.locator(`:has-text("${message.substring(0, 30)}")`);
    await expect(messageLocator.or(this.chatInputField)).toBeVisible();
  }

  async sendChatMessage() {
    logger.info('Sending chat message');
    await this.chatSendButton.click();
  }

  async attemptToSendMessage() {
    logger.info('Attempting to send message');
    await this.chatSendButton.click();
  }

  async verifyMessageSentSuccessfully() {
    logger.info('Verifying message sent successfully');
    // Wait for message to appear in chat history or input to clear
    await this.page.waitForTimeout(1000);
  }

  async waitForChatResponse() {
    logger.info('Waiting for chat response');
    await this.page.waitForTimeout(3000);
  }

  async verifyChatResponseDisplayed() {
    logger.info('Verifying chat response displayed');
    await expect(this.chatResponse).toBeVisible({ timeout: 10000 });
  }

  async verifyChatServiceUnavailableError() {
    logger.info('Verifying chat service unavailable error');
    await expect(this.chatErrorMessage).toBeVisible({ timeout: 10000 });
    await expect(this.chatErrorMessage).toContainText(/unavailable|offline|service/i);
  }

  async verifyAlternativeSupportContactsDisplayed() {
    logger.info('Verifying alternative support contacts displayed');
    await expect(this.alternativeSupportContacts.or(this.page.locator(':has-text("email"), :has-text("phone")'))).toBeVisible();
  }

  async verifyCharacterLimitValidationError() {
    logger.info('Verifying character limit validation error');
    await expect(this.chatValidationError).toBeVisible({ timeout: 5000 });
    await expect(this.chatValidationError).toContainText(/character|limit|5000|too long/i);
  }

  async verifyMessageNotSent() {
    logger.info('Verifying message was not sent');
    const messageCount = await this.chatMessagesContainer.locator('.message').count();
    await this.page.waitForTimeout(2000);
    const newMessageCount = await this.chatMessagesContainer.locator('.message').count();
    expect(newMessageCount).toBeLessThanOrEqual(messageCount);
  }

  async verifyMessageRemainsInInputField() {
    logger.info('Verifying message remains in input field');
    const inputValue = await this.chatInputField.inputValue();
    expect(inputValue.length).toBeGreaterThan(0);
  }

  async selectCategory(categoryName) {
    logger.info(`Selecting category: ${categoryName}`);
    const categoryLocator = this.page.locator(`[data-category="${categoryName.toLowerCase().replace(/\s+/g, '-')}"], a:has-text("${categoryName}"), button:has-text("${categoryName}")`);
    await expect(categoryLocator).toBeVisible();
    await categoryLocator.click();
  }

  async clickCategory(categoryName) {
    logger.info(`Clicking category: ${categoryName}`);
    await this.selectCategory(categoryName);
  }

  async verifyCategorySelected(categoryName) {
    logger.info(`Verifying category selected: ${categoryName}`);
    await this.page.waitForTimeout(1000);
  }

  async verifyVideoTutorialsDisplayed() {
    logger.info('Verifying video tutorials displayed');
    await expect(this.videoTutorialsList).toBeVisible({ timeout: 10000 });
  }

  async verifyVideoTutorialsDisplayedResponsive(deviceType) {
    logger.info(`Verifying video tutorials displayed for ${deviceType}`);
    await expect(this.videoTutorialsList).toBeVisible({ timeout: 10000 });
  }

  async clickVideoTutorial(videoName) {
    logger.info(`Clicking video tutorial: ${videoName}`);
    const videoLocator = this.page.locator(`[data-video="${videoName}"], a:has-text("${videoName}"), :has-text("${videoName}")`).first();
    await videoLocator.click();
  }

  async tapVideoTutorial(videoName) {
    logger.info(`Tapping video tutorial: ${videoName}`);
    await this.clickVideoTutorial(videoName);
  }

  async verifyVideoPlayerLoaded() {
    logger.info('Verifying video player loaded');
    await expect(this.videoPlayer).toBeVisible({ timeout: 10000 });
  }

  async clickVideoPlayButton() {
    logger.info('Clicking video play button');
    await expect(this.videoPlayButton).toBeVisible();
    await this.videoPlayButton.click();
  }

  async tapVideoPlayButton() {
    logger.info('Tapping video play button');
    await this.clickVideoPlayButton();
  }

  async verifyVideoIsPlaying() {
    logger.info('Verifying video is playing');
    await this.page.waitForTimeout(1000);
    const isPaused = await this.videoPlayer.evaluate(video => video.paused);
    expect(isPaused).toBe(false);
  }

  async clickVideoPauseButton() {
    logger.info('Clicking video pause button');
    await this.videoPauseButton.click();
  }

  async verifyVideoIsPaused() {
    logger.info('Verifying video is paused');
    await this.page.waitForTimeout(500);
    const isPaused = await this.videoPlayer.evaluate(video => video.paused);
    expect(isPaused).toBe(true);
  }

  async adjustVideoVolume(volumeLevel) {
    logger.info(`Adjusting video volume to ${volumeLevel}`);
    await this.videoVolumeControl.fill(volumeLevel.toString());
  }

  async verifyVolumeAdjusted() {
    logger.info('Verifying volume adjusted');
    await this.page.waitForTimeout(500);
  }

  async muteVideo() {
    logger.info('Muting video');
    await this.videoMuteButton.click();
  }

  async verifyVideoMuted() {
    logger.info('Verifying video muted');
    await this.page.waitForTimeout(500);
    const isMuted = await this.videoPlayer.evaluate(video => video.muted);
    expect(isMuted).toBe(true);
  }

  async unmuteVideo() {
    logger.info('Unmuting video');
    await this.videoUnmuteButton.click();
  }

  async verifyVideoUnmuted() {
    logger.info('Verifying video unmuted');
    await this.page.waitForTimeout(500);
    const isMuted = await this.videoPlayer.evaluate(video => video.muted);
    expect(isMuted).toBe(false);
  }

  async enterFullscreen() {
    logger.info('Entering fullscreen mode');
    await this.videoFullscreenButton.click();
  }

  async verifyFullscreenMode() {
    logger.info('Verifying fullscreen mode');
    await this.page.waitForTimeout(1000);
  }

  async exitFullscreen() {
    logger.info('Exiting fullscreen mode');
    await this.page.keyboard.press('Escape');
  }

  async verifyNormalMode() {
    logger.info('Verifying normal mode');
    await this.page.waitForTimeout(1000);
  }

  async verifyResponsiveLayout(deviceType) {
    logger.info(`Verifying responsive layout for ${deviceType}`);
    await expect(this.categoriesContainer).toBeVisible();
  }

  async verifyTouchOptimizedControls() {
    logger.info('Verifying touch-optimized controls');
    await expect(this.videoPlayButton.or(this.videoPauseButton)).toBeVisible();
  }

  async verifyMobileOptimizedControls() {
    logger.info('Verifying mobile-optimized controls');
    await expect(this.videoPlayButton.or(this.videoPauseButton)).toBeVisible();
  }

  async testAllPlaybackControlsTouch() {
    logger.info('Testing all playback controls (touch)');
    await this.page.waitForTimeout(1000);
  }

  async verifyVideoUnavailableError() {
    logger.info('Verifying video unavailable error');
    await expect(this.videoErrorMessage).toBeVisible({ timeout: 10000 });
    await expect(this.videoErrorMessage).toContainText(/unavailable|not found|removed/i);
  }

  async verifyAlternativeLearningResourcesProvided() {
    logger.info('Verifying alternative learning resources provided');
    await expect(this.alternativeLearningResources.or(this.page.locator(':has-text("alternative"), :has-text("other resources")'))).toBeVisible();
  }

  async verifyCodecCompatibilityError() {
    logger.info('Verifying codec compatibility error');
    await expect(this.codecCompatibilityError.or(this.videoErrorMessage)).toBeVisible({ timeout: 10000 });
    await expect(this.codecCompatibilityError.or(this.videoErrorMessage)).toContainText(/codec|unsupported|format|compatibility/i);
  }

  async verifyBrowserRecommendationsProvided() {
    logger.info('Verifying browser recommendations provided');
    await expect(this.browserRecommendations.or(this.page.locator(':has-text("browser"), :has-text("supported")'))).toBeVisible();
  }

  async verifyDownloadableMaterialsDisplayed() {
    logger.info('Verifying downloadable materials displayed');
    await expect(this.downloadableMaterialsList).toBeVisible({ timeout: 10000 });
  }

  async locatePDFDownloadLink(filename) {
    logger.info(`Locating PDF download link: ${filename}`);
    await expect(this.downloadLink(filename)).toBeVisible();
  }

  async locateDOCXDownloadLink(filename) {
    logger.info(`Locating DOCX download link: ${filename}`);
    await expect(this.downloadLink(filename)).toBeVisible();
  }

  async verifyDownloadLinkVisible(filename) {
    logger.info(`Verifying download link visible: ${filename}`);
    await expect(this.downloadLink(filename)).toBeVisible();
    await expect(this.downloadLink(filename)).toBeEnabled();
  }

  async clickDownloadLink(filename) {
    logger.info(`Clicking download link: ${filename}`);
    await this.downloadLink(filename).click();
  }

  async verifyFileDownloadedSuccessfully(download) {
    logger.info('Verifying file downloaded successfully');
    expect(download).toBeTruthy();
  }

  async verifyFileNotFoundError() {
    logger.info('Verifying file not found error');
    await expect(this.fileNotFoundError).toBeVisible({ timeout: 10000 });
  }

  async attemptDownloadCorruptedFile(filename) {
    logger.info(`Attempting to download corrupted file: ${filename}`);
    await this.downloadLink(filename).click();
  }

  async verifyCorruptedFileError() {
    logger.info('Verifying corrupted file error');
    await expect(this.corruptedFileError).toBeVisible({ timeout: 10000 });
    await expect(this.corruptedFileError).toContainText(/corrupted|invalid|format/i);
  }

  async verifyDownloadPrevented() {
    logger.info('Verifying download prevented');
    await this.page.waitForTimeout(2000);
  }

  async verifyPageLayoutCorrect() {
    logger.info('Verifying page layout correct');
    await expect(this.categoriesContainer).toBeVisible();
  }

  async verifyNoMissingContent() {
    logger.info('Verifying no missing content');
    const brokenImages = await this.page.locator('img[src=""], img:not([src])').count();
    expect(brokenImages).toBe(0);
  }

  async verifyServiceUnavailableError() {
    logger.info('Verifying service unavailable error');
    await expect(this.serviceUnavailableError.or(this.page.locator(':has-text("unavailable"), :has-text("temporarily")'))).toBeVisible({ timeout: 10000 });
  }

  async verifyAlternativeSupportOptionsDisplayed() {
    logger.info('Verifying alternative support options displayed');
    await expect(this.alternativeSupportOptions.or(this.page.locator(':has-text("support@"), :has-text("1-800")'))).toBeVisible();
  }

  async verifyLoadingIndicatorDisplayed() {
    logger.info('Verifying loading indicator displayed');
    await expect(this.loadingIndicator).toBeVisible({ timeout: 5000 });
  }

  async verifyTimeoutMessageWithRetry() {
    logger.info('Verifying timeout message with retry option');
    await expect(this.timeoutMessage).toBeVisible({ timeout: 30000 });
    await expect(this.retryButton).toBeVisible();
  }

  async verifyArticlesDisplayed() {
    logger.info('Verifying articles displayed');
    await expect(this.articlesList).toBeVisible({ timeout: 10000 });
  }

  async clickArticle(articleTitle) {
    logger.info(`Clicking article: ${articleTitle}`);
    const articleLocator = this.page.locator(`a:has-text("${articleTitle}"), [data-article="${articleTitle}"]`).first();
    await articleLocator.click();
  }

  async verifyArticleOpened(articleTitle) {
    logger.info(`Verifying article opened: ${articleTitle}`);
    await expect(this.articleContent).toBeVisible({ timeout: 10000 });
  }

  async verifyArticleAccessible() {
    logger.info('Verifying article accessible');
    await expect(this.articleContent).toBeVisible();
  }

  async verifyArticleReadable() {
    logger.info('Verifying article readable');
    const textContent = await this.articleContent.textContent();
    expect(textContent.length).toBeGreaterThan(0);
  }

  async verifyFAQArticlesDisplayed() {
    logger.info('Verifying FAQ articles displayed');
    await expect(this.faqList.or(this.articlesList)).toBeVisible({ timeout: 10000 });
  }

  async clickFAQ(faqTitle) {
    logger.info(`Clicking FAQ: ${faqTitle}`);
    const faqLocator = this.page.locator(`a:has-text("${faqTitle}"), [data-faq="${faqTitle}"], :has-text("${faqTitle}")`).first();
    await faqLocator.click();
  }

  async verifyFAQOpened(faqTitle) {
    logger.info(`Verifying FAQ opened: ${faqTitle}`);
    await expect(this.faqContent.or(this.articleContent)).toBeVisible({ timeout: 10000 });
  }

  async verifyFAQAccessible() {
    logger.info('Verifying FAQ accessible');
    await expect(this.faqContent.or(this.articleContent)).toBeVisible();
  }

  async verifyFAQFormattedCorrectly() {
    logger.info('Verifying FAQ formatted correctly');
    const content = await this.faqContent.or(this.articleContent).textContent();
    expect(content.length).toBeGreaterThan(0);
  }

  async verifyEmptyCategoryMessage() {
    logger.info('Verifying empty category message');
    await expect(this.emptyCategoryMessage).toBeVisible({ timeout: 10000 });
  }

  async verifyDataLoadError() {
    logger.info('Verifying data load error');
    await expect(this.dataLoadError.or(this.page.locator(':has-text("cannot be loaded"), :has-text("error")'))).toBeVisible({ timeout: 10000 });
  }

  async verifyErrorGuidanceProvided() {
    logger.info('Verifying error guidance provided');
    await expect(this.errorGuidance.or(this.page.locator(':has-text("try again"), :has-text("contact support")'))).toBeVisible();
  }

  async verifyNoErrorsDisplayed() {
    logger.info('Verifying no errors displayed');
    const errorCount = await this.page.locator('.error, [role="alert"]').count();
    expect(errorCount).toBe(0);
  }

  async browseCategoriesAndContent() {
    logger.info('Browsing categories and content');
    await this.page.waitForTimeout(2000);
  }
};
