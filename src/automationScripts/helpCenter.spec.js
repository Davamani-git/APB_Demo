const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const { HomePage } = require('./pages/home.page');

test.describe('Help Center - Chat Assistant Tests', () => {

  test('TC-2035: Chat Assistant - Successful Interaction', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.verifyChatAssistantButtonVisible();
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyChatWindowOpened();
    await helpCenterPage.typeMessageInChat('Hello, I need help');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyChatResponseReceived();
  });

  test('TC-2036: Chat Assistant - Service Unavailable', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyServiceUnavailableErrorDisplayed();
    await helpCenterPage.verifyAlternativeSupportOptionsDisplayed();
  });

  test('TC-2037: Chat Assistant - Character Limit Validation', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    const longMessage = 'a'.repeat(5001);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyChatWindowOpened();
    await helpCenterPage.typeMessageInChat(longMessage);
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyCharacterLimitErrorDisplayed();
  });

});

test.describe('Help Center - Article Linking Tests', () => {

  test('TC-2038: Chat Assistant - Relevant Article Links', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyChatWindowOpened();
    await helpCenterPage.typeMessageInChat('How do I reset my password?');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyArticleLinksDisplayed();
    await helpCenterPage.verifyArticleLinksRelevantToQuery('password reset');
  });

  test('TC-2039: Chat Assistant - No Matching Articles', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyChatWindowOpened();
    await helpCenterPage.typeMessageInChat('How do I configure quantum encryption?');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyNoMatchingArticlesMessage();
    await helpCenterPage.verifyEscalationOptionsDisplayed();
  });

  test('TC-2040: Chat Assistant - Article Link Navigation', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyChatWindowOpened();
    await helpCenterPage.typeMessageInChat('How do I update my profile?');
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyArticleLinksDisplayed();
    await helpCenterPage.clickFirstArticleLink();
    await helpCenterPage.verifyArticleOpened();
    await helpCenterPage.verifyChatSessionActive();
  });

});

test.describe('Help Center - Video Tutorial Tests', () => {

  test('TC-2041: Video Tutorial - Playback Controls', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.selectVideoTutorial('Getting Started Tutorial');
    await helpCenterPage.verifyVideoPlayerLoaded();
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoPlaying();
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoPaused();
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoPlaying();
    await helpCenterPage.adjustVideoVolume();
    await helpCenterPage.verifyVolumeAdjusted();
    await helpCenterPage.toggleFullscreen();
    await helpCenterPage.verifyFullscreenMode();
    await helpCenterPage.toggleFullscreen();
    await helpCenterPage.verifyExitedFullscreen();
  });

  test('TC-2042: Video Tutorial - Network Failure', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.selectVideoTutorial('Getting Started Tutorial');
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoLoadErrorDisplayed();
    await helpCenterPage.verifyRetryOptionAvailable();
  });

  test('TC-2043: Video Tutorial - Unsupported Browser', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.selectVideoTutorial('Getting Started Tutorial');
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyUnsupportedBrowserMessage();
    await helpCenterPage.verifyAlternativeSuggestionsDisplayed();
  });

});

test.describe('Help Center - Download Materials Tests', () => {

  test('TC-2044: Download Help Material - Successful Download', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.navigateToHelpMaterialsSection();
    await helpCenterPage.verifyHelpMaterialsDisplayed();
    await helpCenterPage.selectHelpMaterial('User Guide PDF');
    await helpCenterPage.verifyDownloadLinkVisible();
    const downloadPromise = page.waitForEvent('download');
    await helpCenterPage.clickDownloadLink();
    const download = await downloadPromise;
    await expect(download).toBeTruthy();
  });

  test('TC-2045: Download Help Material - Temporarily Unavailable', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.navigateToHelpMaterialsSection();
    await helpCenterPage.verifyHelpMaterialsDisplayed();
    await helpCenterPage.selectHelpMaterial('Quick Reference Guide');
    await helpCenterPage.verifyDownloadLinkVisible();
    await helpCenterPage.clickDownloadLink();
    await helpCenterPage.verifyMaterialUnavailableError();
    await helpCenterPage.verifyAlternativeResourcesSuggested();
  });

  test('TC-2046: Download Help Material - Insufficient Permissions', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.login('restricted_user', 'Pass@123');
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.navigateToHelpMaterialsSection();
    await helpCenterPage.verifyHelpMaterialsDisplayed();
    await helpCenterPage.selectHelpMaterial('Advanced Admin Guide');
    await helpCenterPage.clickDownloadLink();
    await helpCenterPage.verifyAccessDeniedMessage();
  });

});

test.describe('Help Center - Home Page Integration Tests', () => {

  test('TC-2047: Home Page - Help Center Entry Point', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    await homePage.navigate();
    await expect(page).toHaveURL(/home/i);
    await homePage.verifyHelpCenterEntryPointVisible();
    const startTime = Date.now();
    await homePage.clickHelpCenterEntryPoint();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.verifyCategorizedContentDisplayed();
  });

  test('TC-2048: Home Page - Help Center Service Unavailable', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await expect(page).toHaveURL(/home/i);
    await homePage.clickHelpCenterEntryPoint();
    await homePage.verifyHelpCenterUnavailableError();
    await homePage.verifyAlternativeSupportOptionsDisplayed();
  });

  test('TC-2049: Home Page - Navigation Integrity After Help Center Integration', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await expect(page).toHaveURL(/home/i);
    await homePage.verifyHelpCenterEntryPointVisible();
    await homePage.clickHelpCenterEntryPoint();
    await expect(page).toHaveURL(/help-center/i);
    await page.goBack();
    await expect(page).toHaveURL(/home/i);
    await homePage.verifyNavigationLinksWorking();
    await homePage.verifyInteractiveFeaturesWorking();
    await homePage.verifyLayoutIntegrity();
  });

});

test.describe('Help Center - Search Functionality Tests', () => {

  test('TC-2050: Search - Valid Keyword', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword('password reset');
    const startTime = Date.now();
    await helpCenterPage.submitSearch();
    const searchTime = Date.now() - startTime;
    expect(searchTime).toBeLessThan(2000);
    await helpCenterPage.verifySearchResultsDisplayed();
    await helpCenterPage.verifySearchResultsRelevant('password reset');
  });

  test('TC-2051: Search - No Matching Results', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.enterSearchKeyword('xyzabc123nonexistent');
    await helpCenterPage.submitSearch();
    await helpCenterPage.verifyNoResultsMessage();
    await helpCenterPage.verifySearchSuggestionsDisplayed();
  });

  test('TC-2052: Search - Empty Query Validation', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/help-center/i);
    await helpCenterPage.verifySearchBarVisible();
    await helpCenterPage.submitSearch();
    await helpCenterPage.verifySearchValidationError();
  });

});
