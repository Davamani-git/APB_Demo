const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const { HomePage } = require('./pages/home.page');

test.describe('Help Center - Search Functionality', () => {
  test('TC-2016: Search with valid keyword returns relevant results', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword('password reset');
    await helpCenterPage.clickSearchButton();
    await helpCenterPage.verifySearchResultsDisplayed();
  });

  test('TC-2017: Search with non-existent keyword shows no results message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword('xyzabc123nonexistent');
    await helpCenterPage.clickSearchButton();
    await helpCenterPage.verifyNoResultsMessage();
  });

  test('TC-2018: Search with special characters handles input safely', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword('@#$%^&*()');
    await helpCenterPage.clickSearchButton();
    await helpCenterPage.verifySearchHandledSafely();
  });

  test('TC-2019: Search with SQL injection pattern handles input safely', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword("' OR '1'='1");
    await helpCenterPage.clickSearchButton();
    await helpCenterPage.verifySearchHandledSafely();
  });
});

test.describe('Help Center - Chat Assistant', () => {
  test('TC-2020: Chat assistant opens and responds to user message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyChatAssistantIconVisible();
    await helpCenterPage.clickChatAssistantIcon();
    await helpCenterPage.verifyChatWindowOpened();
    await helpCenterPage.typeChatMessage('How do I reset my password?');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyAutomatedResponseReceived();
  });

  test('TC-2021: Chat assistant unavailable shows error message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyChatAssistantIconVisible();
    await helpCenterPage.clickChatAssistantIcon();
    await helpCenterPage.verifyChatErrorMessage();
  });

  test('TC-2022: Chat assistant maintains conversation context', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyChatAssistantIconVisible();
    await helpCenterPage.clickChatAssistantIcon();
    await helpCenterPage.verifyChatWindowOpened();
    await helpCenterPage.typeChatMessage('How do I create an account?');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyContextualResponseReceived();
    await helpCenterPage.typeChatMessage('What information do I need?');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyContextualResponseReceived();
    await helpCenterPage.typeChatMessage('Can I use my email?');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyContextualResponseReceived();
  });
});

test.describe('Help Center - Video Tutorials', () => {
  test('TC-2023: Video tutorial plays with functional controls', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.selectVideoTutorial('Getting Started Tutorial');
    await helpCenterPage.verifyVideoPlayerVisible();
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoStartsPlayback();
    await helpCenterPage.testVideoControls();
  });

  test('TC-2024: Corrupted video displays error message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.selectVideoTutorial('Corrupted video file');
    await helpCenterPage.verifyVideoPlayerVisible();
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoErrorMessage();
  });

  test('TC-2025: Video playback state is preserved on navigation', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.selectVideoTutorial('Getting Started Tutorial');
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.pauseVideoAtTimestamp('2:30');
    await helpCenterPage.navigateToHelpArticle('FAQ page');
    await helpCenterPage.verifyHelpArticleLoaded();
    await helpCenterPage.returnToVideoTutorial();
    await helpCenterPage.verifyVideoResumeFromPausedPosition();
  });
});

test.describe('Help Center - Downloadable Materials', () => {
  test('TC-2026: Help material downloads successfully', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.locateDownloadableMaterial('PDF User Guide');
    await helpCenterPage.verifyDownloadLinkVisible();
    const downloadPromise = page.waitForEvent('download');
    await helpCenterPage.clickDownloadLink();
    const download = await downloadPromise;
    await helpCenterPage.verifyFileDownloaded(download);
  });

  test('TC-2027: Unavailable material shows error message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.locateDownloadableMaterial('Unavailable document');
    await helpCenterPage.verifyDownloadLinkVisible();
    await helpCenterPage.clickDownloadLink();
    await helpCenterPage.verifyDownloadErrorMessage();
  });

  test('TC-2028: Insufficient storage handled gracefully', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.locateDownloadableMaterial('Large PDF User Guide (5MB)');
    await helpCenterPage.verifyDownloadLinkVisible();
    await helpCenterPage.clickDownloadLink();
    await helpCenterPage.verifyDownloadFailureFeedback();
  });
});

test.describe('Help Center - Navigation and Access', () => {
  test('TC-2029: Help Center accessible from Home Page with all content visible', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    await homePage.verifyHelpCenterEntryPointVisible();
    await homePage.clickHelpCenterEntryPoint();
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.verifyRedirectedToHelpCenter();
    await helpCenterPage.verifyAllCategorizedContentVisible();
  });

  test('TC-2030: Backend unavailable shows error message', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    await homePage.verifyHelpCenterEntryPointVisible();
    await homePage.clickHelpCenterEntryPoint();
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.verifyBackendErrorMessage();
  });

  test('TC-2031: Multiple Help Center accesses maintain consistency', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    await homePage.verifyHelpCenterEntryPointVisible();
    await homePage.clickHelpCenterEntryPoint();
    await helpCenterPage.verifyHelpCenterLoaded();
    await helpCenterPage.verifyAllContentVisible();
    await page.goBack();
    await homePage.verifyPageLoaded();
    await homePage.clickHelpCenterEntryPoint();
    await helpCenterPage.verifyHelpCenterLoaded();
    await helpCenterPage.verifyAllContentVisible();
    await page.goBack();
    await homePage.verifyPageLoaded();
    await homePage.clickHelpCenterEntryPoint();
    await helpCenterPage.verifyHelpCenterLoaded();
    await helpCenterPage.verifyAllContentVisible();
  });
});

test.describe('Help Center - Category Browsing', () => {
  test('TC-2032: Valid category displays relevant articles', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyCategoriesVisible();
    await helpCenterPage.selectCategory('Getting Started');
    await helpCenterPage.verifyCategorySelected();
    await helpCenterPage.verifyRelevantArticlesDisplayed();
  });

  test('TC-2033: Multiple categories display unique content', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyCategoriesVisible();
    await helpCenterPage.selectCategory('Getting Started');
    await helpCenterPage.verifyUniqueArticlesForCategory('Getting Started');
    await helpCenterPage.selectCategory('Troubleshooting');
    await helpCenterPage.verifyUniqueArticlesForCategory('Troubleshooting');
    await helpCenterPage.selectCategory('FAQs');
    await helpCenterPage.verifyUniqueArticlesForCategory('FAQs');
  });

  test('TC-2034: Empty category shows appropriate message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyCategoriesVisible();
    await helpCenterPage.selectCategory('Empty category');
    await helpCenterPage.verifyCategorySelected();
    await helpCenterPage.verifyNoCategoryContentMessage();
  });
});