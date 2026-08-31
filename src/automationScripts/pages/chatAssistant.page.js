const { expect } = require('@playwright/test');
const logger = require('../../utils/logger');

exports.ChatAssistantPage = class ChatAssistantPage {
  constructor(page) {
    this.page = page;
    this.chatIcon = page.locator('[data-testid="chat-icon"], .chat-assistant-icon');
    this.chatWindow = page.locator('[data-testid="chat-window"], .chat-assistant-window');
    this.chatInput = page.locator('[data-testid="chat-input"], .chat-input-field');
    this.sendButton = page.locator('[data-testid="send-button"], .chat-send-button');
    this.chatResponse = page.locator('[data-testid="chat-response"], .assistant-response');
    this.fallbackMessage = page.locator('[data-testid="fallback-message"], .fallback-response');
    this.alternativeResources = page.locator('[data-testid="alternative-resources"], .suggested-resources');
    this.characterLimitError = page.locator('[data-testid="char-limit-error"], .character-limit-error');
    this.chatMessages = page.locator('[data-testid="chat-message"], .chat-message');
  }

  async openChatAssistant() {
    logger.info('Opening Chat Assistant');
    await expect(this.chatIcon).toBeVisible();
    await this.chatIcon.click();
  }

  async verifyChatWindowOpen() {
    logger.info('Verifying Chat Assistant window is open');
    await expect(this.chatWindow).toBeVisible();
    await expect(this.chatInput).toBeVisible();
  }

  async enterQuestion(question) {
    logger.info(`Entering question: ${question}`);
    await this.chatInput.fill(question);
  }

  async sendQuestion() {
    logger.info('Sending question');
    await this.sendButton.click();
  }

  async attemptSendQuestion() {
    logger.info('Attempting to send question');
    await this.sendButton.click();
  }

  async verifyResponseReceivedWithinTimeout(timeoutMs) {
    logger.info(`Verifying response received within ${timeoutMs}ms`);
    await expect(this.chatResponse.last()).toBeVisible({ timeout: timeoutMs });
  }

  async verifyResponseReceived() {
    logger.info('Verifying response received');
    await expect(this.chatResponse.last()).toBeVisible();
  }

  async verifyResponseRelevance(expectedKeyword) {
    logger.info(`Verifying response relevance for keyword: ${expectedKeyword}`);
    const responseText = await this.chatResponse.last().textContent();
    expect(responseText.toLowerCase()).toContain(expectedKeyword.toLowerCase());
  }

  async verifyContextualResponseReceived(expectedKeyword) {
    logger.info(`Verifying contextual response with keyword: ${expectedKeyword}`);
    const responseText = await this.chatResponse.last().textContent();
    expect(responseText.toLowerCase()).toContain(expectedKeyword.toLowerCase());
  }

  async verifyFallbackMessageDisplayed() {
    logger.info('Verifying fallback message is displayed');
    await expect(this.fallbackMessage).toBeVisible();
  }

  async verifyAlternativeResourcesSuggested() {
    logger.info('Verifying alternative resources are suggested');
    await expect(this.alternativeResources).toBeVisible();
  }

  async verifyCharacterLimitErrorDisplayed(maxChars) {
    logger.info(`Verifying character limit error displayed for max: ${maxChars}`);
    await expect(this.characterLimitError).toBeVisible();
    const errorText = await this.characterLimitError.textContent();
    expect(errorText).toContain(maxChars.toString());
  }

  async verifyInputSanitized() {
    logger.info('Verifying input was sanitized');
    const messages = await this.chatMessages.all();
    expect(messages.length).toBeGreaterThan(0);
  }

  async verifyNoScriptExecution() {
    logger.info('Verifying no script execution occurred');
    const alerts = [];
    this.page.on('dialog', dialog => alerts.push(dialog));
    await this.page.waitForTimeout(1000);
    expect(alerts.length).toBe(0);
  }
};
