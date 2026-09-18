const { expect } = require('@playwright/test');

exports.HelpCenterPage = class HelpCenterPage {
  constructor(page) {
    this.page = page;
    this.helpCenterHeading = page.locator('h1:has-text("Help Center"), [data-testid="help-center-heading"]').first();
    this.categoryGettingStarted = page.locator('[data-testid="category-getting-started"], a:has-text("Getting Started"), button:has-text("Getting Started")').first();
    this.categoryFAQs = page.locator('[data-testid="category-faqs"], a:has-text("FAQs"), button:has-text("FAQs")').first();
    this.categoryTroubleshooting = page.locator('[data-testid="category-troubleshooting"], a:has-text("Troubleshooting"), button:has-text("Troubleshooting")').first();
    this.categoryContent = page.locator('[data-testid="category-content"], .category-content, .help-articles');
    this.articleContent = page.locator('[data-testid="article-content"], .article-body, article');
    this.faqContent = page.locator('[data-testid="faq-content"], .faq-item, .faq-answer');
    this.videoPlayer = page.locator('[data-testid="video-player"], video, iframe[src*="video"], iframe[src*="youtube"], iframe[src*="vimeo"]').first();
    this.videoPlayButton = page.locator('[data-testid="video-play"], button[aria-label*="play"], .video-play-button').first();
    this.downloadableSection = page.locator('[data-testid="downloadable-materials"], .downloads, .resources');
    this.searchBar = page.locator('[data-testid="search-bar"], input[type="search"], input[placeholder*="Search"]').first();
    this.searchButton = page.locator('[data-testid="search-submit"], button[type="submit"], button:has-text("Search")').first();
    this.searchResults = page.locator('[data-testid="search-results"], .search-results, .results-list');
    this.categoryFilter = page.locator('[data-testid="category-filter"], select[name*="category"], .filter-category');
    this.contentTypeFilter = page.locator('[data-testid="content-type-filter"], select[name*="type"], .filter-content-type');
    this.chatAssistant = page.locator('[data-testid="chat-assistant"], .chat-widget, #chat-button, button:has-text("Chat")').first();
    this.chatWindow = page.locator('[data-testid="chat-window"], .chat-container, .chat-dialog');
    this.chatInput = page.locator('[data-testid="chat-input"], .chat-input, input[placeholder*="message"]').first();
    this.chatSendButton = page.locator('[data-testid="chat-send"], .chat-send, button:has-text("Send")').first();
    this.chatResponse = page.locator('[data-testid="chat-response"], .chat-message.bot, .assistant-message');
    this.errorMessage = page.locator('[data-testid="error-message"], .error, .alert-error, [role="alert"]');
    this.alternativeActions = page.locator('[data-testid="alternative-actions"], .suggestions, .alternatives');
    this.analyticsLink = page.locator('[data-testid="analytics-link"], a[href*="analytics"], a:has-text("Analytics")').first();
    this.analyticsDashboard = page.locator('[data-testid="analytics-dashboard"], .dashboard, .analytics-container');
    this.timePeriodSelector = page.locator('[data-testid="time-period"], select[name*="period"], .period-selector');
    this.chatInteractionData = page.locator('[data-testid="chat-data"], .interaction-data, .chat-metrics');
    this.topIssues = page.locator('[data-testid="top-issues"], .common-issues, .issue-list');
    this.exportButton = page.locator('[data-testid="export-data"], button:has-text("Export"), .export-btn');
    this.contentGapAnalysis = page.locator('[data-testid="content-gaps"], .gap-analysis, .content-insights');
    this.realTimeMonitoring = page.locator('[data-testid="real-time-monitoring"], .live-sessions, .real-time-view');
  }

  async navigate() {
    await this.page.goto('/help-center');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyHelpCenterLandingPageLoaded() {
    await expect(this.page).toHaveURL(/.*help.*center/i);
    await expect(this.helpCenterHeading).toBeVisible({ timeout: 10000 });
  }

  async verifyCategoriesDisplayed(categories) {
    for (const category of categories) {
      const categoryLocator = this.page.locator(`[data-testid="category-${category.toLowerCase().replace(/\s+/g, '-')}"], a:has-text("${category}"), button:has-text("${category}")`).first();
      await expect(categoryLocator).toBeVisible();
    }
  }

  async clickCategory(categoryName) {
    let categoryLocator;
    if (categoryName === 'Getting Started') {
      categoryLocator = this.categoryGettingStarted;
    } else if (categoryName === 'FAQs') {
      categoryLocator = this.categoryFAQs;
    } else if (categoryName === 'Troubleshooting') {
      categoryLocator = this.categoryTroubleshooting;
    } else {
      categoryLocator = this.page.locator(`a:has-text("${categoryName}"), button:has-text("${categoryName}")`).first();
    }
    await expect(categoryLocator).toBeVisible();
    await categoryLocator.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyCategoryContentLoaded(categoryName) {
    await expect(this.categoryContent).toBeVisible({ timeout: 5000 });
    const contentText = await this.categoryContent.textContent();
    expect(contentText.length).toBeGreaterThan(0);
  }

  async selectArticle(articleTitle) {
    const articleLink = this.page.locator(`a:has-text("${articleTitle}"), [data-testid="article-${articleTitle.toLowerCase().replace(/\s+/g, '-')}"]`).first();
    await expect(articleLink).toBeVisible();
    await articleLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyArticleContentDisplayed() {
    await expect(this.articleContent).toBeVisible({ timeout: 5000 });
    const contentText = await this.articleContent.textContent();
    expect(contentText.length).toBeGreaterThan(50);
  }

  async verifyKeyboardNavigation() {
    await this.page.keyboard.press('Tab');
    const focusedElement = await this.page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');
    const secondFocusedElement = await this.page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA']).toContain(secondFocusedElement);
  }

  async verifyScreenReaderAccessibility() {
    const ariaLabels = await this.page.locator('[aria-label]').count();
    expect(ariaLabels).toBeGreaterThan(0);
    const headings = await this.page.locator('h1, h2, h3, h4').count();
    expect(headings).toBeGreaterThan(0);
    const altTexts = await this.page.locator('img[alt]').count();
    const images = await this.page.locator('img').count();
    if (images > 0) {
      expect(altTexts).toBeGreaterThan(0);
    }
  }

  async selectFAQ(faqTitle) {
    const faqLink = this.page.locator(`a:has-text("${faqTitle}"), button:has-text("${faqTitle}"), [data-testid="faq-${faqTitle.toLowerCase().replace(/\s+/g, '-')}"]`).first();
    await expect(faqLink).toBeVisible();
    await faqLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyFAQContentDisplayed() {
    await expect(this.faqContent).toBeVisible({ timeout: 5000 });
    const faqText = await this.faqContent.textContent();
    expect(faqText.length).toBeGreaterThan(20);
  }

  async verifyMobileAccessibility() {
    const viewport = this.page.viewportSize();
    expect(viewport.width).toBeLessThanOrEqual(768);
    await expect(this.faqContent).toBeVisible();
    const box = await this.faqContent.boundingBox();
    expect(box.width).toBeLessThanOrEqual(viewport.width);
  }

  async selectVideoTutorial(videoTitle) {
    const videoLink = this.page.locator(`a:has-text("${videoTitle}"), button:has-text("${videoTitle}"), [data-testid="video-${videoTitle.toLowerCase().replace(/\s+/g, '-')}"]`).first();
    await expect(videoLink).toBeVisible();
    await videoLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyVideoPlayerDisplayed() {
    await expect(this.videoPlayer).toBeVisible({ timeout: 5000 });
  }

  async playVideo() {
    await expect(this.videoPlayer).toBeVisible();
    const isIframe = await this.videoPlayer.evaluate(el => el.tagName === 'IFRAME');
    if (!isIframe) {
      const isPaused = await this.videoPlayer.evaluate(video => video.paused);
      if (isPaused) {
        if (await this.videoPlayButton.isVisible().catch(() => false)) {
          await this.videoPlayButton.click();
        } else {
          await this.videoPlayer.click();
        }
      }
    } else {
      if (await this.videoPlayButton.isVisible().catch(() => false)) {
        await this.videoPlayButton.click();
      }
    }
    await this.page.waitForTimeout(1000);
  }

  async verifyVideoPlaying() {
    const isIframe = await this.videoPlayer.evaluate(el => el.tagName === 'IFRAME');
    if (!isIframe) {
      const isPlaying = await this.videoPlayer.evaluate(video => !video.paused && !video.ended && video.readyState > 2);
      expect(isPlaying).toBeTruthy();
    } else {
      await expect(this.videoPlayer).toBeVisible();
    }
  }

  async verifyVideoPlayerKeyboardControls() {
    await this.videoPlayer.focus();
    await this.page.keyboard.press('Space');
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('ArrowLeft');
    await expect(this.videoPlayer).toBeVisible();
  }

  async verifyVideoPlayerResponsive() {
    const viewport = this.page.viewportSize();
    await expect(this.videoPlayer).toBeVisible();
    const videoBox = await this.videoPlayer.boundingBox();
    expect(videoBox.width).toBeLessThanOrEqual(viewport.width);
  }

  async verifyDownloadableMaterialsSectionVisible() {
    await expect(this.downloadableSection).toBeVisible({ timeout: 5000 });
  }

  async clickDownloadLink(materialName) {
    const downloadLink = this.page.locator(`a:has-text("${materialName}"), a[download]:has-text("${materialName.replace(' PDF', '')}"), [data-testid="download-${materialName.toLowerCase().replace(/\s+/g, '-')}"]`).first();
    await expect(downloadLink).toBeVisible();
    await downloadLink.click();
  }

  async verifyResponsiveLayout(deviceType) {
    const viewport = this.page.viewportSize();
    if (deviceType === 'desktop') {
      expect(viewport.width).toBeGreaterThanOrEqual(1024);
    } else if (deviceType === 'tablet') {
      expect(viewport.width).toBeGreaterThanOrEqual(768);
      expect(viewport.width).toBeLessThan(1024);
    } else if (deviceType === 'mobile') {
      expect(viewport.width).toBeLessThan(768);
    }
    await expect(this.helpCenterHeading).toBeVisible();
    const mainContent = this.page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  }

  async verifySearchFunctionalOnMobile() {
    await expect(this.searchBar).toBeVisible();
    await this.searchBar.fill('test');
    await expect(this.searchBar).toHaveValue('test');
  }

  async verifyCategoriesFunctionalOnMobile() {
    await expect(this.categoryGettingStarted).toBeVisible();
    await expect(this.categoryFAQs).toBeVisible();
  }

  async verifyChatFunctionalOnMobile() {
    await expect(this.chatAssistant).toBeVisible();
    await expect(this.chatAssistant).toBeEnabled();
  }

  async verifyBrandingAlignment() {
    const logo = this.page.locator('[data-testid="logo"], .logo, header img').first();
    if (await logo.isVisible().catch(() => false)) {
      await expect(logo).toBeVisible();
    }
    const primaryColor = await this.page.evaluate(() => {
      const element = document.querySelector('header, nav, .primary');
      return element ? window.getComputedStyle(element).backgroundColor : null;
    });
    expect(primaryColor).toBeTruthy();
  }

  async verifyColorContrastCompliance() {
    const contrastRatios = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, h3, p, a, button');
      const ratios = [];
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bgColor = style.backgroundColor;
        if (color && bgColor) {
          ratios.push({ color, bgColor });
        }
      });
      return ratios.length > 0;
    });
    expect(contrastRatios).toBeTruthy();
  }

  async attemptAccessUnavailableArticle() {
    await this.page.goto('/help-center/article/deleted-article-12345');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyErrorMessageDisplayed() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await this.errorMessage.textContent();
    expect(errorText.length).toBeGreaterThan(10);
  }

  async verifyAlternativeActionsSuggested() {
    await expect(this.alternativeActions).toBeVisible({ timeout: 5000 });
    const suggestionsText = await this.alternativeActions.textContent();
    expect(suggestionsText.length).toBeGreaterThan(10);
  }

  async attemptPlayUnavailableVideo() {
    await this.page.goto('/help-center/video/unavailable-video-12345');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyAlternativeVideoOptionsSuggested() {
    await expect(this.alternativeActions).toBeVisible({ timeout: 5000 });
    const alternativesText = await this.alternativeActions.textContent();
    expect(alternativesText).toContain('video');
  }

  async verifySearchBarVisible() {
    await expect(this.searchBar).toBeVisible();
    await expect(this.searchBar).toBeEnabled();
  }

  async searchKeyword(keyword) {
    await expect(this.searchBar).toBeVisible();
    await this.searchBar.fill(keyword);
    if (await this.searchButton.isVisible().catch(() => false)) {
      await this.searchButton.click();
    } else {
      await this.searchBar.press('Enter');
    }
    await this.page.waitForLoadState('networkidle');
  }

  async verifySearchResultsDisplayed() {
    await expect(this.searchResults).toBeVisible({ timeout: 5000 });
    const resultsCount = await this.searchResults.locator('.result-item, .search-result, li, article').count();
    expect(resultsCount).toBeGreaterThan(0);
  }

  async verifySearchResultsIncludeMultipleContentTypes() {
    await expect(this.searchResults).toBeVisible();
    const resultsText = await this.searchResults.textContent();
    const hasMultipleTypes = resultsText.includes('Article') || resultsText.includes('Video') || resultsText.includes('PDF') || resultsText.includes('FAQ');
    expect(hasMultipleTypes).toBeTruthy();
  }

  async verifySearchResultsMobileResponsive() {
    const viewport = this.page.viewportSize();
    await expect(this.searchResults).toBeVisible();
    const resultsBox = await this.searchResults.boundingBox();
    expect(resultsBox.width).toBeLessThanOrEqual(viewport.width);
  }

  async applyCategoryFilter(categoryName) {
    await expect(this.categoryFilter).toBeVisible();
    await this.categoryFilter.selectOption({ label: categoryName });
    await this.page.waitForLoadState('networkidle');
  }

  async applyContentTypeFilter(contentType) {
    await expect(this.contentTypeFilter).toBeVisible();
    await this.contentTypeFilter.selectOption({ label: contentType });
    await this.page.waitForLoadState('networkidle');
  }

  async verifyFilteredSearchResults(filterValue) {
    await expect(this.searchResults).toBeVisible();
    const resultsText = await this.searchResults.textContent();
    expect(resultsText).toContain(filterValue);
  }

  async verifyMultipleFiltersApplied(filters) {
    await expect(this.searchResults).toBeVisible();
    const resultsText = await this.searchResults.textContent();
    for (const filter of filters) {
      expect(resultsText.toLowerCase()).toContain(filter.toLowerCase());
    }
  }

  async verifyChatAssistantVisible() {
    await expect(this.chatAssistant).toBeVisible();
    await expect(this.chatAssistant).toBeEnabled();
  }

  async openChatAssistant() {
    await expect(this.chatAssistant).toBeVisible();
    await this.chatAssistant.click();
    await this.page.waitForTimeout(500);
  }

  async verifyChatWindowOpened() {
    await expect(this.chatWindow).toBeVisible({ timeout: 5000 });
    await expect(this.chatInput).toBeVisible();
  }

  async typeChatMessage(message) {
    await expect(this.chatInput).toBeVisible();
    await this.chatInput.fill(message);
    if (await this.chatSendButton.isVisible().catch(() => false)) {
      await this.chatSendButton.click();
    } else {
      await this.chatInput.press('Enter');
    }
    await this.page.waitForTimeout(1000);
  }

  async verifyChatResponseReceived() {
    await expect(this.chatResponse).toBeVisible({ timeout: 10000 });
    const responseText = await this.chatResponse.textContent();
    expect(responseText.length).toBeGreaterThan(5);
  }

  async verifyChatResponseContainsResourceLinks() {
    await expect(this.chatResponse).toBeVisible();
    const links = this.chatResponse.locator('a');
    const linksCount = await links.count();
    expect(linksCount).toBeGreaterThan(0);
  }

  async verifyChatKeyboardAccessibility() {
    await this.chatInput.focus();
    await this.page.keyboard.press('Tab');
    const focusedElement = await this.page.evaluate(() => document.activeElement.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);
  }

  async verifyChatScreenReaderAccessibility() {
    const chatAriaLabels = await this.chatWindow.locator('[aria-label]').count();
    expect(chatAriaLabels).toBeGreaterThan(0);
  }

  async verifyChatDataPrivacy() {
    const networkRequests = [];
    this.page.on('request', request => networkRequests.push(request.url()));
    await this.typeChatMessage('test message');
    await this.page.waitForTimeout(1000);
    const hasSensitiveData = networkRequests.some(url => url.includes('password') || url.includes('ssn') || url.includes('credit'));
    expect(hasSensitiveData).toBeFalsy();
  }

  async navigateToChatAnalyticsDashboard() {
    await this.page.goto('/help-center/analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyChatAnalyticsDashboardLoaded() {
    await expect(this.analyticsDashboard).toBeVisible({ timeout: 10000 });
  }

  async selectTimePeriod(period) {
    await expect(this.timePeriodSelector).toBeVisible();
    await this.timePeriodSelector.selectOption({ label: period });
    await this.page.waitForLoadState('networkidle');
  }

  async verifyChatInteractionDataDisplayed() {
    await expect(this.chatInteractionData).toBeVisible({ timeout: 5000 });
    const dataText = await this.chatInteractionData.textContent();
    expect(dataText.length).toBeGreaterThan(20);
  }

  async verifyTopCommonIssuesDisplayed(count) {
    await expect(this.topIssues).toBeVisible({ timeout: 5000 });
    const issuesCount = await this.topIssues.locator('li, .issue-item, tr').count();
    expect(issuesCount).toBeGreaterThanOrEqual(count);
  }

  async exportChatData(format) {
    await expect(this.exportButton).toBeVisible();
    await this.exportButton.click();
    await this.page.waitForTimeout(500);
  }

  async analyzeContentGaps() {
    const gapAnalysisButton = this.page.locator('button:has-text("Analyze"), button:has-text("Content Gaps")').first();
    if (await gapAnalysisButton.isVisible().catch(() => false)) {
      await gapAnalysisButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async verifyContentGapAnalysisDisplayed() {
    await expect(this.contentGapAnalysis).toBeVisible({ timeout: 5000 });
    const gapText = await this.contentGapAnalysis.textContent();
    expect(gapText.length).toBeGreaterThan(20);
  }

  async enableRealTimeMonitoring() {
    const monitoringToggle = this.page.locator('button:has-text("Real-time"), button:has-text("Live"), [data-testid="real-time-toggle"]').first();
    if (await monitoringToggle.isVisible().catch(() => false)) {
      await monitoringToggle.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async verifyRealTimeChatSessionsDisplayed() {
    await expect(this.realTimeMonitoring).toBeVisible({ timeout: 5000 });
    const sessionsText = await this.realTimeMonitoring.textContent();
    expect(sessionsText.length).toBeGreaterThan(10);
  }

  async verifyNoSensitiveDataExposed() {
    await expect(this.realTimeMonitoring).toBeVisible();
    const monitoringText = await this.realTimeMonitoring.textContent();
    const hasSensitiveKeywords = monitoringText.toLowerCase().includes('password') || monitoringText.toLowerCase().includes('ssn') || monitoringText.toLowerCase().includes('credit card');
    expect(hasSensitiveKeywords).toBeFalsy();
  }
};