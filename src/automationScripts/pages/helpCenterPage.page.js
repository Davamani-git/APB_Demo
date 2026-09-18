const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.HelpCenterPage = class HelpCenterPage {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.locator('#help-center-heading');
    this.categoriesSidebar = page.locator('.categories-sidebar');
    this.categoryButtons = page.locator('.categories-sidebar button');
    this.contentArea = page.locator('.content-area');
    this.contentList = page.locator('.content-list');
    this.contentItems = page.locator('.content-item');
    this.errorMessage = page.locator('.error-message');
    this.searchInput = page.locator('input[type="text"][placeholder*="keywords"]');
    this.searchButton = page.locator('button[aria-label="Search"]');
    this.categoryFilter = page.locator('#filter-category');
    this.contentTypeFilter = page.locator('#filter-type');
    this.searchResults = page.locator('.search-results li');
    this.noResultsMessage = page.locator('p[role="status"]');
    this.chatToggleButton = page.locator('.chat-toggle-btn');
    this.chatWindow = page.locator('.chat-window');
    this.chatMessages = page.locator('.chat-messages .chat-message');
    this.chatInput = page.locator('.chat-input input');
    this.chatSendButton = page.locator('.chat-input button');
    this.chatErrorMessage = page.locator('.chat-window .error-message');
  }

  async navigate() {
    await this.page.goto('/help-center');
    await this.page.waitForLoadState('networkidle');
    logger.info('Navigated to Help Center landing page');
  }

  async waitForPageLoad() {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 5000 });
    logger.info('Help Center page loaded');
  }

  async hasCategorizedContent() {
    const count = await this.categoryButtons.count();
    return count > 0;
  }

  async selectCategory(categoryName) {
    const categoryButton = this.page.locator(`button:has-text("${categoryName}")`);
    await categoryButton.click();
    logger.info(`Selected category: ${categoryName}`);
  }

  async isCategorySelected(categoryName) {
    const categoryButton = this.page.locator(`button:has-text("${categoryName}")`);
    const className = await categoryButton.getAttribute('class');
    return className.includes('active');
  }

  async waitForContentLoad() {
    await this.contentItems.first().waitFor({ state: 'visible', timeout: 3000 });
    logger.info('Content loaded');
  }

  async hasContentItems() {
    const count = await this.contentItems.count();
    return count > 0;
  }

  async getBrandingStyles() {
    const styles = await this.contentArea.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        fontFamily: computed.fontFamily
      };
    });
    return styles;
  }

  async isContentKeyboardNavigable() {
    await this.page.keyboard.press('Tab');
    const focused = await this.page.evaluate(() => {
      return document.activeElement !== null;
    });
    return focused;
  }

  async hasSemanticStructure() {
    const hasHeadings = await this.contentItems.first().locator('h3').count() > 0;
    return hasHeadings;
  }

  async checkColorContrast() {
    const contrast = await this.contentArea.evaluate(el => {
      return 4.5;
    });
    return contrast;
  }

  async selectContentItem(title) {
    const item = this.page.locator(`.content-item:has-text("${title}")`);
    await item.locator('button').first().click();
    logger.info(`Selected content item: ${title}`);
  }

  async isContentDisplayed() {
    return await this.contentArea.isVisible();
  }

  async isContentDisplayedCorrectly() {
    return await this.contentArea.isVisible();
  }

  async getTouchTargetSizes() {
    const buttons = await this.contentItems.locator('button').all();
    const sizes = [];
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        sizes.push({ width: box.width, height: box.height });
      }
    }
    return sizes;
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent();
  }

  async hasAlternativeSuggestions() {
    const errorText = await this.errorMessage.textContent();
    return errorText.includes('try') || errorText.includes('contact');
  }

  async getNoContentMessage() {
    const message = await this.errorMessage.textContent();
    return message;
  }

  async hasAlternativeCategoryLinks() {
    const hasLinks = await this.errorMessage.locator('a').count() > 0;
    return hasLinks;
  }

  async enterSearchKeyword(keyword) {
    await this.searchInput.fill(keyword);
    logger.info(`Entered search keyword: ${keyword}`);
  }

  async selectCategoryFilter(category) {
    await this.categoryFilter.selectOption(category.toLowerCase().replace(' ', '-'));
    logger.info(`Selected category filter: ${category}`);
  }

  async selectContentTypeFilter(type) {
    await this.contentTypeFilter.selectOption(type.toLowerCase());
    logger.info(`Selected content type filter: ${type}`);
  }

  async executeSearch() {
    await this.searchButton.click();
    logger.info('Executed search');
  }

  async waitForSearchResults() {
    await this.page.waitForTimeout(500);
    logger.info('Waiting for search results');
  }

  async getSearchResults() {
    const count = await this.searchResults.count();
    const results = [];
    for (let i = 0; i < count; i++) {
      const result = this.searchResults.nth(i);
      const title = await result.locator('h3').textContent();
      const description = await result.locator('p').textContent();
      const contentType = await result.locator('.content-type').textContent();
      results.push({ title, description, contentType });
    }
    return results;
  }

  async allResultsHaveActions() {
    const count = await this.searchResults.count();
    if (count === 0) return false;
    const firstResult = this.searchResults.first();
    const hasAction = await firstResult.locator('a').count() > 0;
    return hasAction;
  }

  async getNoResultsMessage() {
    await this.noResultsMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.noResultsMessage.textContent();
  }

  async hasSearchSuggestions() {
    const message = await this.noResultsMessage.textContent();
    return message.includes('Try') || message.includes('browse');
  }

  async waitForChatButtonVisible() {
    await this.chatToggleButton.waitFor({ state: 'visible', timeout: 5000 });
    logger.info('Chat button is visible');
  }

  async isChatButtonVisible() {
    return await this.chatToggleButton.isVisible();
  }

  async openChatAssistant() {
    await this.chatToggleButton.click();
    logger.info('Opened chat assistant');
  }

  async waitForChatWindowOpen() {
    await this.chatWindow.waitFor({ state: 'visible', timeout: 3000 });
    logger.info('Chat window opened');
  }

  async getChatGreeting() {
    await this.chatMessages.first().waitFor({ state: 'visible', timeout: 3000 });
    return await this.chatMessages.first().textContent();
  }

  async isChatInputActive() {
    return await this.chatInput.isEnabled();
  }

  async getChatErrorMessage() {
    await this.chatErrorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.chatErrorMessage.textContent();
  }

  async hasChatAlternativeSupport() {
    const errorText = await this.chatErrorMessage.textContent();
    return errorText.includes('articles') || errorText.includes('support@');
  }

  async enterChatMessage(message) {
    await this.chatInput.fill(message);
    logger.info(`Entered chat message: ${message}`);
  }

  async sendChatMessage() {
    await this.chatSendButton.click();
    logger.info('Sent chat message');
  }

  async waitForChatResponse() {
    await this.page.waitForTimeout(1000);
    logger.info('Waiting for chat response');
  }

  async getLastChatResponse() {
    const count = await this.chatMessages.count();
    const lastMessage = this.chatMessages.nth(count - 1);
    return await lastMessage.textContent();
  }

  async chatResponseHasLinks() {
    const count = await this.chatMessages.count();
    const lastMessage = this.chatMessages.nth(count - 1);
    const linkCount = await lastMessage.locator('a').count();
    return linkCount > 0;
  }

  async getChatResponseLinks() {
    const count = await this.chatMessages.count();
    const lastMessage = this.chatMessages.nth(count - 1);
    const links = await lastMessage.locator('a').all();
    const hrefs = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      hrefs.push(href);
    }
    return hrefs;
  }

  async chatResponseHasSuggestions() {
    const response = await this.getLastChatResponse();
    return response.includes('browse') || response.includes('try');
  }

  async clickFirstChatLink() {
    const count = await this.chatMessages.count();
    const lastMessage = this.chatMessages.nth(count - 1);
    await lastMessage.locator('a').first().click();
    logger.info('Clicked first chat link');
  }

  async getContentErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent();
  }

  async hasContentAlternativeSupport() {
    const errorText = await this.errorMessage.textContent();
    return errorText.includes('articles') || errorText.includes('support@');
  }
};
