const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const { HomePage } = require('./pages/home.page');

test.describe('Help Center Integration Tests', () => {

  test('TC-1911: Chat Assistant Load and Message Send', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    await helpCenterPage.verifyCategoriesVisible();
    await helpCenterPage.clickChatAssistantButton();
    const chatLoadTime = await helpCenterPage.measureChatWindowLoadTime();
    expect(chatLoadTime).toBeLessThanOrEqual(2000);
    await helpCenterPage.typeChatMessage('Hello, I need help');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyMessageSent('Hello, I need help');
    await helpCenterPage.verifyChatResponseReceived();
  });

  test('TC-1912: Multiple Chat Messages in Chronological Order', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyChatWindowOpen();
    await helpCenterPage.typeChatMessage('What are your business hours?');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyMessageDisplayedWithTimestamp('What are your business hours?');
    await helpCenterPage.typeChatMessage('Do you offer phone support?');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyMessageDisplayedWithTimestamp('Do you offer phone support?');
    await helpCenterPage.typeChatMessage('How do I reset my password?');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyMessageDisplayedWithTimestamp('How do I reset my password?');
    await helpCenterPage.verifyMessagesInChronologicalOrder(['What are your business hours?', 'Do you offer phone support?', 'How do I reset my password?']);
    await helpCenterPage.verifyResponsesInChronologicalOrder();
  });

  test('TC-1913: Chat Service Unavailable Error Handling', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    await helpCenterPage.simulateChatServiceUnavailable();
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyErrorMessageDisplayed('service unavailable');
    await helpCenterPage.verifyAlternativeSupportOptionsProvided();
  });

  test('TC-1914: Chat Service High Load Handling', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    await helpCenterPage.simulateChatServiceHighLoad();
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyHighLoadMessageDisplayed();
    await helpCenterPage.verifyAlternativeContactMethodsDisplayed();
  });

  test('TC-1915: Secure HTTPS Connection and Data Encryption', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifySecureConnection();
    await helpCenterPage.verifySSLCertificateValid();
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyChatWindowOpen();
    await helpCenterPage.typeChatMessage('My email is john.doe@example.com and my phone is +1-555-1234');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyHTTPSTransmission();
    await helpCenterPage.verifyTLSVersion();
    await helpCenterPage.verifyGDPRCompliance();
  });

  test('TC-1916: GDPR Data Deletion Request', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyChatWindowOpen();
    await helpCenterPage.typeChatMessage('John Doe');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.typeChatMessage('john.doe@example.com');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.typeChatMessage('+1-555-1234');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.navigateToPrivacySettings();
    await helpCenterPage.verifyPrivacySettingsPageLoaded();
    await helpCenterPage.clickDataDeletionRequest();
    await helpCenterPage.verifyDeletionConfirmationDialog();
    await helpCenterPage.confirmDeletionRequest();
    await helpCenterPage.verifyDeletionRequestAcknowledged();
    await helpCenterPage.verifyDataDeletionWithinGDPRTimeframe();
    await helpCenterPage.verifyDataDeletedFromBackend();
  });

  test('TC-1917: Compromised Secure Connection Handling', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyChatWindowOpen();
    await helpCenterPage.simulateCompromisedConnection();
    await helpCenterPage.typeChatMessage('My credit card number is 1234-5678-9012-3456');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyTransmissionBlocked();
    await helpCenterPage.verifySecurityWarningDisplayed();
  });

  test('TC-1918: Search Functionality with Valid Keyword', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword('password reset');
    const searchTime = await helpCenterPage.measureSearchResponseTime();
    expect(searchTime).toBeLessThanOrEqual(2000);
    await helpCenterPage.verifySearchResultsDisplayed();
    await helpCenterPage.verifySearchResultsIncludeContentTypes(['articles', 'videos', 'PDFs', 'DOCX']);
    await helpCenterPage.verifySearchResultsRelevance('password reset');
  });

  test('TC-1919: Search with Multiple Keywords', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword('password reset account security');
    await helpCenterPage.executeSearch();
    await helpCenterPage.verifySearchResultsDisplayed();
    await helpCenterPage.verifySearchResultsIncludeContentTypes(['articles', 'videos', 'PDFs', 'DOCX']);
    await helpCenterPage.verifySearchResultsRanking(['password', 'reset', 'account', 'security']);
  });

  test('TC-1920: Search with No Results', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword('xyzabc123nonexistent');
    await helpCenterPage.executeSearch();
    await helpCenterPage.verifyNoResultsMessageDisplayed();
    await helpCenterPage.verifyAlternativeSearchSuggestionsProvided();
    await helpCenterPage.verifyPopularTopicLinksDisplayed(['Getting Started', 'FAQs', 'Troubleshooting']);
  });

  test('TC-1921: Video Tutorial Playback Controls', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    await helpCenterPage.navigateToVideoTutorialsCategory();
    await helpCenterPage.verifyVideoTutorialsDisplayed();
    await helpCenterPage.selectVideoTutorial('Product Setup Tutorial');
    await helpCenterPage.verifyVideoPlayerLoaded();
    const playbackTime = await helpCenterPage.measureVideoPlaybackStartTime();
    expect(playbackTime).toBeLessThanOrEqual(2000);
    await helpCenterPage.clickVideoPauseButton();
    await helpCenterPage.verifyVideoPaused();
    await helpCenterPage.adjustVideoVolume(50);
    await helpCenterPage.verifyVolumeAdjusted();
    await helpCenterPage.clickVideoFullscreenButton();
    await helpCenterPage.verifyVideoFullscreen();
  });

  test('TC-1922: Broken Video File Error Handling', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    await helpCenterPage.navigateToVideoTutorialsCategory();
    await helpCenterPage.verifyVideoTutorialsDisplayed();
    await helpCenterPage.selectVideoTutorial('broken_video_tutorial.mp4');
    await helpCenterPage.verifyVideoPlayerLoaded();
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoUnavailableErrorDisplayed();
    await helpCenterPage.verifyAlternativeHelpOptionsProvided(['related articles', 'PDF guides', 'chat support']);
  });

  test('TC-1923: Incompatible Video Format Handling', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    await helpCenterPage.navigateToVideoTutorialsCategory();
    await helpCenterPage.verifyVideoTutorialsDisplayed();
    await helpCenterPage.selectVideoTutorial('video_incompatible_format.webm');
    await helpCenterPage.verifyVideoPlayerLoaded();
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyFormatIncompatibilityHandled();
    await helpCenterPage.verifyTroubleshootingGuidanceProvided();
  });

  test('TC-1924: Help Center Access from Home Page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await expect(page).toHaveURL(/.*app.example.com/);
    await homePage.verifyHelpCenterEntryPointVisible();
    await homePage.clickHelpCenterEntryPoint();
    const loadTime = await homePage.measureHelpCenterLoadTime();
    expect(loadTime).toBeLessThanOrEqual(2000);
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.verifyAllCategoriesDisplayed(['Getting Started', 'FAQs', 'How-to Guides', 'Video Tutorials', 'Help Materials', 'Troubleshooting', 'Chat Support', 'Search Help']);
  });

  test('TC-1925: Home Page Functionality After Help Center Integration', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await expect(page).toHaveURL(/.*app.example.com/);
    await homePage.verifyHelpCenterEntryPointVisible();
    await homePage.testAllNavigationLinks(['Home', 'Products', 'Services', 'About', 'Contact']);
    await homePage.testAllInteractiveElements();
    await homePage.verifyLayoutConsistency();
    await homePage.clickHelpCenterEntryPoint();
    await page.goBack();
    await homePage.verifyHomePageLoadsCorrectly();
  });

  test('TC-1926: Help Center Service Unavailable Error', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await expect(page).toHaveURL(/.*app.example.com/);
    await homePage.simulateHelpCenterServiceUnavailable();
    await homePage.clickHelpCenterEntryPoint();
    await homePage.verifyHelpCenterUnavailableErrorDisplayed();
    await homePage.verifyAlternativeContactInformationProvided(['support@example.com', '+1-800-SUPPORT']);
    await homePage.verifyActionableNextStepsProvided();
  });

  test('TC-1927: Getting Started Category Article Retrieval', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyAllCategoriesDisplayed(['Getting Started', 'FAQs', 'How-to Guides', 'Video Tutorials', 'Help Materials', 'Troubleshooting', 'Chat Support', 'Search Help']);
    await helpCenterPage.clickCategory('Getting Started');
    const retrievalTime = await helpCenterPage.measureArticleRetrievalTime();
    expect(retrievalTime).toBeLessThanOrEqual(2000);
    await helpCenterPage.verifyArticlesRelevantToCategory('Getting Started');
    await helpCenterPage.clickArticle('How to Create Your First Account');
    await helpCenterPage.verifyArticleAccessible();
  });

  test('TC-1928: Troubleshooting Category Filtering', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyAllCategoriesDisplayed(['Getting Started', 'FAQs', 'How-to Guides', 'Video Tutorials', 'Help Materials', 'Troubleshooting', 'Chat Support', 'Search Help']);
    await helpCenterPage.clickCategory('Troubleshooting');
    await helpCenterPage.verifyArticlesTaggedWithCategory('Troubleshooting');
    await helpCenterPage.verifyNoArticlesFromOtherCategories(['Getting Started', 'FAQs', 'How-to Guides', 'Video Tutorials']);
    await helpCenterPage.openMultipleArticlesAndVerifyContent(3, 'troubleshooting');
  });

  test('TC-1929: Empty Category Handling', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyAllCategoriesDisplayed(['Getting Started', 'FAQs', 'How-to Guides', 'Video Tutorials', 'Help Materials', 'Troubleshooting', 'Chat Support', 'Search Help']);
    await helpCenterPage.clickCategory('Advanced Features');
    await helpCenterPage.verifyNoCategoryContentMessageDisplayed();
    await helpCenterPage.verifyNextStepsGuidanceProvided(['Try browsing other categories', 'use search function', 'contact support']);
    await helpCenterPage.verifyAlternativeCategoryLinksProvided(['Getting Started', 'FAQs', 'Search Help']);
  });

});
