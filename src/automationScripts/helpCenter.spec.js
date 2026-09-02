const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const { HomePage } = require('./pages/home.page');

test.describe('Help Center Integration Tests', () => {

  test('TC-2322: Search with valid keyword displays relevant results', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword('password reset');
    await helpCenterPage.clickSearchButton();
    await helpCenterPage.verifySearchResultsDisplayed();
    await helpCenterPage.verifySearchResultsContainAllContentTypes();
  });

  test('TC-2323: Search with non-existent keyword shows no results message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword('xyzabc123nonexistent');
    await helpCenterPage.clickSearchButton();
    await helpCenterPage.verifySearchExecutedWithoutError();
    await helpCenterPage.verifyNoResultsMessageDisplayed();
  });

  test('TC-2324: Search with misspelled keyword applies fuzzy matching', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword('pasword');
    await helpCenterPage.clickSearchButton();
    await helpCenterPage.verifySearchExecutedWithoutError();
    await helpCenterPage.verifyFuzzyMatchingResultsOrSuggestions();
  });

  test('TC-2325: Chat assistant responds to valid question', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.clickChatAssistantIcon();
    await helpCenterPage.verifyChatWindowOpened();
    await helpCenterPage.typeChatQuestion('How do I reset my password?');
    await helpCenterPage.submitChatQuestion();
    await helpCenterPage.verifyAutomatedResponseReceived();
  });

  test('TC-2326: Chat assistant handles unrecognized input gracefully', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.clickChatAssistantIcon();
    await helpCenterPage.verifyChatWindowOpened();
    await helpCenterPage.typeChatQuestion('asdfghjkl qwerty zxcvbn');
    await helpCenterPage.submitChatQuestion();
    await helpCenterPage.verifyGracefulFallbackResponse();
  });

  test('TC-2327: Chat service unavailability displays notification', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.simulateChatServiceDowntime();
    await helpCenterPage.clickChatAssistantIcon();
    await helpCenterPage.verifyChatUnavailableNotification();
  });

  test('TC-2328: Video tutorial plays successfully with functional controls', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.selectCategory('Getting Started');
    await helpCenterPage.verifyCategoryContentLoaded();
    await helpCenterPage.clickVideoTutorial('Introduction to Help Center');
    await helpCenterPage.verifyVideoPlayerLoaded();
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoPlaybackStarted();
    await helpCenterPage.verifyVideoControlsAvailable();
  });

  test('TC-2329: Unavailable video displays error and alternative resources', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.selectUnavailableVideo('Unavailable tutorial link');
    await helpCenterPage.attemptToPlayVideo();
    await helpCenterPage.verifyVideoErrorMessageDisplayed();
    await helpCenterPage.verifyAlternativeResourcesSuggested();
  });

  test('TC-2330: Video resumes from last position after navigation', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.playVideoTutorial('Product overview tutorial');
    await helpCenterPage.verifyVideoPlaying();
    await helpCenterPage.pauseVideoAtTimestamp('1:30');
    await helpCenterPage.verifyVideoPaused();
    await helpCenterPage.navigateToCategory('FAQs');
    await helpCenterPage.verifyNavigationCompleted();
    await helpCenterPage.returnToVideoTutorialPage();
    await helpCenterPage.verifyVideoResumesFromLastPosition('1:30');
  });

  test('TC-2331: PDF download initiates securely and file is valid', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.selectCategory('User Guides');
    await helpCenterPage.verifyCategoryContentLoaded();
    const downloadPromise = page.waitForEvent('download');
    await helpCenterPage.clickDownloadLink('Complete_User_Guide.pdf');
    const download = await downloadPromise;
    await helpCenterPage.verifyDownloadInitiatedSecurely(download);
    await helpCenterPage.verifyDownloadedFileIntegrity(download);
  });

  test('TC-2332: Unavailable download displays error and alternatives', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.clickDownloadLink('Removed_Guide.pdf');
    await helpCenterPage.verifyDownloadErrorMessageDisplayed();
    await helpCenterPage.verifyAlternativeDownloadSuggestions();
  });

  test('TC-2333: HTTP download attempt enforces HTTPS or displays warning', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.attemptInsecureDownload('http://example.com/help/guide.pdf');
    await helpCenterPage.verifyHTTPSEnforcedOrSecurityWarning();
  });

  test('TC-2334: Help Center entry point navigates to landing page', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    await homePage.navigate();
    await homePage.verifyHomePageLoaded();
    await homePage.verifyHelpCenterEntryPointVisible();
    await homePage.clickHelpCenterEntryPoint();
    await helpCenterPage.verifyLandingPageLoadsWithinTimeout(2000);
    await helpCenterPage.verifyCategorizedContentVisible();
  });

  test('TC-2335: Help Center unavailable displays error and alternatives', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyHomePageLoaded();
    await homePage.simulateHelpCenterServiceOutage();
    await homePage.clickHelpCenterEntryPoint();
    await homePage.verifyServiceUnavailableMessage();
    await homePage.verifyAlternativeSupportOptionsDisplayed();
  });

  test('TC-2336: Repeated Help Center access maintains consistent performance', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    await homePage.navigate();
    await homePage.verifyHomePageLoaded();
    
    for (let i = 0; i < 5; i++) {
      await homePage.clickHelpCenterEntryPoint();
      await helpCenterPage.verifyLandingPageLoadsWithinTimeout(2000);
      await helpCenterPage.verifyCategorizedContentVisible();
      await page.goBack();
      await homePage.verifyHomePageLoaded();
    }
    
    await helpCenterPage.verifyConsistentPerformanceAcrossAttempts();
  });

  test('TC-2337: Category selection displays relevant content within timeout', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.verifyCategorizedContentVisible();
    await helpCenterPage.selectCategory('Getting Started');
    await helpCenterPage.verifyCategorySelectionRegistered();
    await helpCenterPage.verifyRelevantContentDisplayedWithinTimeout(2000);
  });

  test('TC-2338: Empty category displays appropriate message and suggestions', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.verifyCategorizedContentVisible();
    await helpCenterPage.selectCategory('Empty category');
    await helpCenterPage.verifyCategorySelectionRegistered();
    await helpCenterPage.verifyNoContentAvailableMessage();
    await helpCenterPage.verifySuggestionsToExploreOtherCategories();
  });

  test('TC-2339: Category switching displays correct content without cross-contamination', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyLandingPageLoaded();
    await helpCenterPage.verifyCategorizedContentVisible();
    await helpCenterPage.selectCategory('Troubleshooting');
    await helpCenterPage.verifyFirstCategoryContentLoaded();
    await helpCenterPage.verifyContentSpecificToCategory('Troubleshooting');
    await helpCenterPage.selectCategory('FAQs');
    await helpCenterPage.verifySecondCategoryContentLoaded();
    await helpCenterPage.verifyContentSpecificToCategory('FAQs');
    await helpCenterPage.verifyNoCrossContamination('Troubleshooting');
  });

});
