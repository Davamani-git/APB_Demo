const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const { ChatAssistantPage } = require('./pages/chatAssistant.page');
const logger = require('../utils/logger');

test.describe('Chat Assistant Functionality', () => {

  test('TC-007: Chat Assistant provides relevant real-time response', async ({ page }) => {
    logger.info('Starting test: TC-007 - Chat Assistant real-time response');
    const helpCenter = new HelpCenterPage(page);
    const chatAssistant = new ChatAssistantPage(page);
    
    await helpCenter.navigate();
    await helpCenter.verifyPageLoaded();
    
    await chatAssistant.openChatAssistant();
    await chatAssistant.verifyChatWindowOpen();
    
    await chatAssistant.enterQuestion('How do I reset my password?');
    await chatAssistant.sendQuestion();
    
    await chatAssistant.verifyResponseReceivedWithinTimeout(3000);
    await chatAssistant.verifyResponseRelevance('password reset');
    
    logger.info('Test TC-007 completed successfully');
  });

  test('TC-008: Chat Assistant maintains context across follow-up questions', async ({ page }) => {
    logger.info('Starting test: TC-008 - Contextual follow-up');
    const helpCenter = new HelpCenterPage(page);
    const chatAssistant = new ChatAssistantPage(page);
    
    await helpCenter.navigate();
    await chatAssistant.openChatAssistant();
    await chatAssistant.verifyChatWindowOpen();
    
    await chatAssistant.enterQuestion('What are the system requirements?');
    await chatAssistant.sendQuestion();
    await chatAssistant.verifyResponseReceived();
    
    await chatAssistant.enterQuestion('What about mobile devices?');
    await chatAssistant.sendQuestion();
    await chatAssistant.verifyContextualResponseReceived('mobile');
    
    logger.info('Test TC-008 completed successfully');
  });

  test('TC-009: Chat Assistant handles unrecognized queries with fallback', async ({ page }) => {
    logger.info('Starting test: TC-009 - Unrecognized query fallback');
    const helpCenter = new HelpCenterPage(page);
    const chatAssistant = new ChatAssistantPage(page);
    
    await helpCenter.navigate();
    await chatAssistant.openChatAssistant();
    await chatAssistant.verifyChatWindowOpen();
    
    await chatAssistant.enterQuestion('asdfghjkl qwerty');
    await chatAssistant.sendQuestion();
    
    await chatAssistant.verifyFallbackMessageDisplayed();
    await chatAssistant.verifyAlternativeResourcesSuggested();
    
    logger.info('Test TC-009 completed successfully');
  });

  test('TC-010: Chat Assistant handles gibberish input gracefully', async ({ page }) => {
    logger.info('Starting test: TC-010 - Gibberish input');
    const helpCenter = new HelpCenterPage(page);
    const chatAssistant = new ChatAssistantPage(page);
    
    await helpCenter.navigate();
    await chatAssistant.openChatAssistant();
    await chatAssistant.verifyChatWindowOpen();
    
    await chatAssistant.enterQuestion('!@#$%^&*()_+{}|:<>?');
    await chatAssistant.sendQuestion();
    
    await chatAssistant.verifyFallbackMessageDisplayed();
    
    logger.info('Test TC-010 completed successfully');
  });

  test('TC-011: Chat Assistant enforces character limit on messages', async ({ page }) => {
    logger.info('Starting test: TC-011 - Character limit enforcement');
    const helpCenter = new HelpCenterPage(page);
    const chatAssistant = new ChatAssistantPage(page);
    
    await helpCenter.navigate();
    await chatAssistant.openChatAssistant();
    await chatAssistant.verifyChatWindowOpen();
    
    const longMessage = 'a'.repeat(5001);
    await chatAssistant.enterQuestion(longMessage);
    await chatAssistant.attemptSendQuestion();
    
    await chatAssistant.verifyCharacterLimitErrorDisplayed(1000);
    
    logger.info('Test TC-011 completed successfully');
  });

  test('TC-012: Chat Assistant sanitizes input with special characters', async ({ page }) => {
    logger.info('Starting test: TC-012 - Input sanitization');
    const helpCenter = new HelpCenterPage(page);
    const chatAssistant = new ChatAssistantPage(page);
    
    await helpCenter.navigate();
    await chatAssistant.openChatAssistant();
    await chatAssistant.verifyChatWindowOpen();
    
    await chatAssistant.enterQuestion("<script>alert('test')</script>");
    await chatAssistant.sendQuestion();
    
    await chatAssistant.verifyInputSanitized();
    await chatAssistant.verifyNoScriptExecution();
    
    logger.info('Test TC-012 completed successfully');
  });

});
