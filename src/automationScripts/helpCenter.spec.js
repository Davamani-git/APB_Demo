const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const { HomePage } = require('./pages/home.page');

test.describe('Help Center - Chat Assistant Tests', () => {
  test('TC-001: QE-5007 TS001 - Verify chat assistant responds to user questions', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.clickChatAssistantIcon();
    await helpCenterPage.verifyChatInterfaceOpened();
    await helpCenterPage.typeChatQuestion('How do I reset my password?');
    await helpCenterPage.verifyChatQuestionEntered('How do I reset my password?');
    await helpCenterPage.submitChatQuestion();
    await helpCenterPage.verifyChatResponseReceived();
  });

  test('TC-002: QE-5007 TS002 - Verify chat service offline notification', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    // Simulate offline condition - in real scenario this would be done via API/network interception
    await helpCenterPage.simulateChatServiceOffline();
    await helpCenterPage.clickChatAssistantIcon();
    await helpCenterPage.verifyChatOfflineNotification();
  });

  test('TC-003: QE-5007 TS003 - Verify chat assistant maintains conversation context', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.clickChatAssistantIcon();
    await helpCenterPage.verifyChatInterfaceOpened();
    await helpCenterPage.typeChatQuestion('What are the system requirements?');
    await helpCenterPage.submitChatQuestion();
    await helpCenterPage.verifyChatResponseReceived();
    await helpCenterPage.typeChatQuestion('Can you provide more details about the memory requirements?');
    await helpCenterPage.submitChatQuestion();
    await helpCenterPage.verifyContextualChatResponse();
    await helpCenterPage.typeChatQuestion('What if I don\'t meet those requirements?');
    await helpCenterPage.submitChatQuestion();
    await helpCenterPage.verifyConversationContextMaintained();
  });
});

test.describe('Help Center - Search Functionality Tests', () => {
  test('TC-004: QE-5006 TS001 - Verify search returns relevant results for valid keyword', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifySearchFieldVisible();
    await helpCenterPage.enterSearchKeyword('password');
    await helpCenterPage.verifySearchKeywordEntered('password');
    await helpCenterPage.submitSearch();
    await helpCenterPage.verifySearchResultsDisplayedWithinTime(2000);
    await helpCenterPage.verifySearchResultsRelevance('password');
  });

  test('TC-005: QE-5006 TS002 - Verify no results message for non-existent keyword', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifySearchFieldVisible();
    await helpCenterPage.enterSearchKeyword('xyzabc123nonexistent');
    await helpCenterPage.verifySearchKeywordEntered('xyzabc123nonexistent');
    await helpCenterPage.submitSearch();
    await helpCenterPage.verifyNoResultsMessage();
  });

  test('TC-006: QE-5006 TS003 - Verify search with multiple keywords returns ranked results', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifySearchFieldVisible();
    await helpCenterPage.enterSearchKeyword('reset user password');
    await helpCenterPage.verifySearchKeywordEntered('reset user password');
    await helpCenterPage.submitSearch();
    await helpCenterPage.verifySearchResultsDisplayed();
    await helpCenterPage.verifySearchResultsMatchAllKeywords('reset user password');
  });
});

test.describe('Help Center - Category Navigation Tests', () => {
  test('TC-007: QE-5005 TS001 - Verify Getting Started category displays relevant articles', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyCategoriesVisible();
    await helpCenterPage.selectCategory('Getting Started');
    await helpCenterPage.verifyCategoryPageLoaded('Getting Started');
    await helpCenterPage.verifyArticlesDisplayed();
  });

  test('TC-008: QE-5005 TS002 - Verify empty category displays appropriate message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyCategoriesVisible();
    await helpCenterPage.selectCategory('Empty test category');
    await helpCenterPage.verifyCategoryPageLoaded('Empty test category');
    await helpCenterPage.verifyEmptyCategoryMessage();
  });

  test('TC-009: QE-5005 TS003 - Verify multiple categories display correct content without contamination', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyCategoriesVisible();
    await helpCenterPage.selectCategory('FAQs');
    await helpCenterPage.verifyCategoryContentType('FAQs');
    await helpCenterPage.navigateBackToLanding();
    await helpCenterPage.selectCategory('Troubleshooting');
    await helpCenterPage.verifyCategoryContentType('Troubleshooting');
    await helpCenterPage.navigateBackToLanding();
    await helpCenterPage.selectCategory('How-to Guides');
    await helpCenterPage.verifyCategoryContentType('How-to Guides');
  });
});

test.describe('Help Center - Video Tutorial Tests', () => {
  test('TC-010: QE-5004 TS001 - Verify video tutorial plays successfully', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.selectHelpTopic('Getting Started Video Tutorial');
    await helpCenterPage.verifyVideoPlayerVisible();
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoPlaying();
  });

  test('TC-011: QE-5004 TS002 - Verify error message for corrupted video', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.selectHelpTopic('Corrupted video tutorial');
    await helpCenterPage.verifyVideoPlayerVisible();
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoErrorMessage();
  });

  test('TC-012: QE-5004 TS003 - Verify video resume functionality', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.selectHelpTopic('Video tutorial with resume feature');
    await helpCenterPage.verifyVideoPlayerVisible();
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoPlaying();
    await helpCenterPage.pauseVideoAtTimestamp('1:30');
    await helpCenterPage.verifyVideoPaused();
    await helpCenterPage.navigateAwayFromPage();
    await helpCenterPage.returnToHelpTopic('Video tutorial with resume feature');
    await helpCenterPage.verifyVideoResumePosition();
  });
});

test.describe('Help Center - Navigation from Home Page Tests', () => {
  test('TC-013: QE-5003 TS001 - Verify Help Center accessible from Home Page', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    await homePage.verifyHelpCenterNavigationVisible();
    await homePage.clickHelpCenterNavigation();
    await helpCenterPage.verifyHelpCenterLandingPageLoaded();
  });

  test('TC-014: QE-5003 TS002 - Verify error message when Help Center service unavailable', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    await homePage.simulateHelpCenterServiceUnavailable();
    await homePage.clickHelpCenterNavigation();
    await homePage.verifyHelpCenterErrorMessage();
  });

  test('TC-015: QE-5003 TS003 - Verify all help resource categories displayed on landing page', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    await homePage.clickHelpCenterNavigation();
    await helpCenterPage.verifyHelpCenterLandingPageLoaded();
    const expectedCategories = ['Getting Started', 'FAQs', 'Troubleshooting', 'How-to Guides', 'Video Tutorials', 'Help Materials', 'Chat Support', 'Search Help'];
    await helpCenterPage.verifyAllCategoriesDisplayed(expectedCategories);
  });
});

test.describe('Help Center - Downloadable Help Materials Tests', () => {
  test('TC-016: QE-5002 TS001 - Verify PDF user guide downloads and is accessible offline', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.navigateToHelpMaterialsSection();
    await helpCenterPage.verifyHelpMaterialsSectionLoaded();
    const downloadPath = await helpCenterPage.downloadHelpMaterial('User_Guide.pdf');
    await helpCenterPage.verifyFileDownloaded(downloadPath);
    await helpCenterPage.verifyFileAccessibleOffline(downloadPath);
  });

  test('TC-017: QE-5002 TS002 - Verify error message for unavailable help material', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.navigateToHelpMaterialsSection();
    await helpCenterPage.verifyHelpMaterialsSectionLoaded();
    await helpCenterPage.attemptDownloadBrokenLink('Unavailable_Guide.pdf');
    await helpCenterPage.verifyDownloadErrorMessage();
  });

  test('TC-018: QE-5002 TS003 - Verify multiple help materials download successfully', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.navigateToHelpMaterialsSection();
    await helpCenterPage.verifyHelpMaterialsSectionLoaded();
    const download1 = await helpCenterPage.downloadHelpMaterial('User_Guide.pdf');
    await helpCenterPage.verifyFileDownloaded(download1);
    const download2 = await helpCenterPage.downloadHelpMaterial('Quick_Reference_Guide.pdf');
    await helpCenterPage.verifyFileDownloaded(download2);
    const download3 = await helpCenterPage.downloadHelpMaterial('FAQ_Document.pdf');
    await helpCenterPage.verifyFileDownloaded(download3);
  });
});