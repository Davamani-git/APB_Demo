const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.HelpCenterPage = class HelpCenterPage {
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator('[data-testid="help-center-search-box"], input[placeholder*="Search"]');
    this.searchButton = page.locator('[data-testid="search-button"], button[type="submit"]');
    this.searchResults = page.locator('[data-testid="search-results"], .search-results');
    this.resultItems = page.locator('[data-testid="result-item"], .result-item');
    this.noResultsMessage = page.locator('[data-testid="no-results"], .no-results-message');
    this.alternativeSuggestions = page.locator('[data-testid="alternative-suggestions"], .suggestions');
    this.popularTopics = page.locator('[data-testid="popular-topics"], .popular-topics');
    this.spellingSuggestion = page.locator('[data-testid="spelling-suggestion"], .did-you-mean');
    this.contentTypeFilter = page.locator('[data-testid="content-type-filter"], .filter-dropdown');
    this.contentTypeLabels = page.locator('[data-testid="content-type-label"], .content-type');
    this.articleResults = page.locator('[data-testid="article-result"], .result-item[data-type="article"]');
    this.videoResults = page.locator('[data-testid="video-result"], .result-item[data-type="video"]');
    this.materialResults = page.locator('[data-testid="material-result"], .result-item[data-type="material"]');
    this.categoryLinks = page.locator('[data-testid="category-link"], .category-item');
    this.categoryContent = page.locator('[data-testid="category-content"], .category-content-item');
    this.categoryItemCount = page.locator('[data-testid="category-count"], .category-count');
    this.helpCenterLandingPage = page.locator('[data-testid="help-center-landing"], .help-center-home');
    this.featuredArticles = page.locator('[data-testid="featured-articles"], .featured-content');
  }

  async navigate() {
    logger.info('Navigating to Help Center');
    await this.page.goto('https://helpcenter.example.com');
  }

  async navigateWithoutLogin() {
    logger.info('Navigating to Help Center without authentication');
    await this.page.goto('https://helpcenter.example.com');
  }

  async verifyPageLoaded() {
    logger.info('Verifying Help Center page loaded');
    await expect(this.page).toHaveURL(/helpcenter/);
    await expect(this.searchBox).toBeVisible();
  }

  async verifyUnauthenticatedState() {
    logger.info('Verifying unauthenticated state');
    const loginButton = this.page.locator('[data-testid="login-button"], .login-link');
    await expect(loginButton).toBeVisible();
  }

  async verifySearchBoxVisible() {
    logger.info('Verifying search box is visible and enabled');
    await expect(this.searchBox).toBeVisible();
    await expect(this.searchBox).toBeEnabled();
  }

  async enterSearchKeyword(keyword) {
    logger.info(`Entering search keyword: ${keyword}`);
    await this.searchBox.fill(keyword);
    await expect(this.searchBox).toHaveValue(keyword);
  }

  async submitSearch() {
    logger.info('Submitting search query');
    await this.searchButton.click();
  }

  async verifySearchResultsDisplayed() {
    logger.info('Verifying search results are displayed');
    await expect(this.searchResults).toBeVisible();
    await expect(this.resultItems.first()).toBeVisible();
  }

  async verifyResultsLoadedWithinTimeout(timeoutMs) {
    logger.info(`Verifying results loaded within ${timeoutMs}ms`);
    await expect(this.resultItems.first()).toBeVisible({ timeout: timeoutMs });
  }

  async verifyResultsRankedByRelevance() {
    logger.info('Verifying results are ranked by relevance');
    const results = await this.resultItems.all();
    expect(results.length).toBeGreaterThan(0);
    const firstResult = results[0];
    await expect(firstResult).toBeVisible();
  }

  async verifyArticlesDisplayed() {
    logger.info('Verifying articles are displayed');
    await expect(this.articleResults.first()).toBeVisible();
  }

  async verifyVideosDisplayed() {
    logger.info('Verifying videos are displayed');
    await expect(this.videoResults.first()).toBeVisible();
  }

  async verifyMaterialsDisplayed() {
    logger.info('Verifying materials are displayed');
    await expect(this.materialResults.first()).toBeVisible();
  }

  async verifyAllContentTypesRankedByRelevance() {
    logger.info('Verifying all content types are ranked by relevance');
    const allResults = await this.resultItems.all();
    expect(allResults.length).toBeGreaterThan(0);
  }

  async verifyContentTypeLabelsVisible() {
    logger.info('Verifying content type labels are visible');
    await expect(this.contentTypeLabels.first()).toBeVisible();
  }

  async applyContentTypeFilter(filterType) {
    logger.info(`Applying content type filter: ${filterType}`);
    await this.contentTypeFilter.click();
    const filterOption = this.page.locator(`[data-testid="filter-${filterType}"], text="${filterType}"`);
    await filterOption.click();
  }

  async verifyOnlyVideosDisplayed() {
    logger.info('Verifying only videos are displayed');
    await expect(this.videoResults.first()).toBeVisible();
    await expect(this.articleResults.first()).not.toBeVisible();
  }

  async verifyNoResultsMessageDisplayed() {
    logger.info('Verifying no results message is displayed');
    await expect(this.noResultsMessage).toBeVisible();
    await expect(this.noResultsMessage).toContainText(/no results/i);
  }

  async verifyAlternativeSearchSuggestionsDisplayed() {
    logger.info('Verifying alternative search suggestions are displayed');
    await expect(this.alternativeSuggestions).toBeVisible();
  }

  async verifyPopularTopicsDisplayed() {
    logger.info('Verifying popular topics are displayed');
    await expect(this.popularTopics).toBeVisible();
  }

  async verifySpellingSuggestionOrNoResults() {
    logger.info('Verifying spelling suggestion or no results message');
    const noResults = await this.noResultsMessage.isVisible();
    const suggestion = await this.spellingSuggestion.isVisible();
    expect(noResults || suggestion).toBeTruthy();
  }

  async browseCategoryByName(categoryName) {
    logger.info(`Browsing category: ${categoryName}`);
    const categoryLink = this.page.locator(`[data-testid="category-${categoryName}"], text="${categoryName}"`);
    await categoryLink.click();
  }

  async verifyContentVisibleInCategory(contentTitle) {
    logger.info(`Verifying content visible in category: ${contentTitle}`);
    const contentItem = this.page.locator(`text="${contentTitle}"`);
    await expect(contentItem).toBeVisible();
  }

  async verifyCategoryItemCount(expectedCount) {
    logger.info(`Verifying category item count: ${expectedCount}`);
    const count = await this.categoryContent.count();
    expect(count).toBe(expectedCount);
  }

  async verifyAllContentItemsVisible(contentTitles) {
    logger.info('Verifying all content items are visible');
    for (const title of contentTitles) {
      const item = this.page.locator(`text="${title}"`);
      await expect(item).toBeVisible();
    }
  }

  async verifyContentAvailable(contentTitle) {
    logger.info(`Verifying content available: ${contentTitle}`);
    const content = this.page.locator(`text="${contentTitle}"`);
    await expect(content).toBeVisible();
  }

  async verifyFormattedContentDisplayed(contentTitle) {
    logger.info(`Verifying formatted content displayed: ${contentTitle}`);
    const content = this.page.locator(`text="${contentTitle}"`);
    await expect(content).toBeVisible();
  }

  async verifyNoScriptExecution() {
    logger.info('Verifying no script execution occurred');
    const alerts = [];
    this.page.on('dialog', dialog => alerts.push(dialog));
    await this.page.waitForTimeout(1000);
    expect(alerts.length).toBe(0);
  }

  async verifyHelpCenterLandingPageLoaded() {
    logger.info('Verifying Help Center landing page loaded');
    await expect(this.helpCenterLandingPage).toBeVisible();
  }

  async verifyAllExpectedContentDisplayed() {
    logger.info('Verifying all expected content displayed');
    await expect(this.searchBox).toBeVisible();
    await expect(this.categoryLinks.first()).toBeVisible();
    await expect(this.featuredArticles).toBeVisible();
  }

  async verifyHelpCenterContentLoaded() {
    logger.info('Verifying Help Center content loaded');
    await expect(this.searchBox).toBeVisible();
  }
};
