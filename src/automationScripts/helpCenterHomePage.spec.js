const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/homePage.page');
const { HelpCenterPage } = require('./pages/helpCenter.page');

test.describe('Help Center Home Page Integration Tests', () => {

  test('TC_AC1_001 - Navigate to Home Page and verify Help Center entry point is visible', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyHelpCenterEntryPointVisible();
  });

  test('TC_AC1_002 - Click on Help Center entry point from Home Page', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    await homePage.navigate();
    await homePage.clickHelpCenterEntryPoint();
    await helpCenterPage.verifyHelpCenterLandingPageLoaded();
  });

  test('TC_AC1_003 - Navigate to Home Page on mobile device and verify Help Center entry point', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyHelpCenterEntryPointVisible();
  });

  test('TC_AC1_004 - Click Help Center entry point on mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    await homePage.navigate();
    await homePage.clickHelpCenterEntryPoint();
    await helpCenterPage.verifyHelpCenterLandingPageLoaded();
  });

  test('TC_AC11_001 - Navigate to Home Page and interact with existing navigation menu', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyExistingNavigationMenuFunctional();
  });

  test('TC_AC11_002 - Verify Home Page layout and existing features', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyHomePageLayoutIntact();
  });

  test('TC_AC11_003 - Test all existing Home Page interactive elements (buttons, links, forms)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyInteractiveElementsFunctional();
  });

  test('TC_AC11_004 - Verify Home Page performance metrics after Help Center integration', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    const homePage = new HomePage(page);
    const startTime = Date.now();
    await homePage.navigate();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(4000);
  });

});

test.describe('Help Center Content Experience Tests', () => {

  test('TC_AC2_001 - Navigate to Help Center landing page and verify category display', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyCategoriesDisplayed(['Getting Started', 'FAQs', 'Troubleshooting']);
  });

  test('TC_AC2_002 - Click on Getting Started category', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.clickCategory('Getting Started');
    await helpCenterPage.verifyCategoryContentLoaded('Getting Started');
  });

  test('TC_AC2_003 - Click on FAQs category', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.clickCategory('FAQs');
    await helpCenterPage.verifyCategoryContentLoaded('FAQs');
  });

  test('TC_AC2_004 - Click on Troubleshooting category', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.clickCategory('Troubleshooting');
    await helpCenterPage.verifyCategoryContentLoaded('Troubleshooting');
  });

  test('TC_AC3_001 - Select a help article from the Getting Started category', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.clickCategory('Getting Started');
    await helpCenterPage.selectArticle('Quick Start Guide');
    await helpCenterPage.verifyArticleContentDisplayed();
  });

  test('TC_AC3_002 - Navigate the help article using keyboard only (Tab, Enter, Arrow keys)', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.clickCategory('Getting Started');
    await helpCenterPage.selectArticle('Quick Start Guide');
    await helpCenterPage.verifyKeyboardNavigation();
  });

  test('TC_AC3_003 - Access help article using screen reader (NVDA/JAWS)', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.clickCategory('Getting Started');
    await helpCenterPage.selectArticle('Quick Start Guide');
    await helpCenterPage.verifyScreenReaderAccessibility();
  });

  test('TC_AC3_004 - Select an FAQ from the FAQs category', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.clickCategory('FAQs');
    await helpCenterPage.selectFAQ('How to reset password');
    await helpCenterPage.verifyFAQContentDisplayed();
  });

  test('TC_AC3_005 - Verify FAQ accessibility on mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.clickCategory('FAQs');
    await helpCenterPage.selectFAQ('How to reset password');
    await helpCenterPage.verifyMobileAccessibility();
  });

  test('TC_AC4_001 - Select a video tutorial from Help Center content', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.selectVideoTutorial('Product Overview Tutorial');
    await helpCenterPage.verifyVideoPlayerDisplayed();
  });

  test('TC_AC4_002 - Play the video tutorial', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.selectVideoTutorial('Product Overview Tutorial');
    const startTime = Date.now();
    await helpCenterPage.playVideo();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    await helpCenterPage.verifyVideoPlaying();
  });

  test('TC_AC4_003 - Test video player controls using keyboard', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.selectVideoTutorial('Product Overview Tutorial');
    await helpCenterPage.verifyVideoPlayerKeyboardControls();
  });

  test('TC_AC4_004 - Select and play video tutorial on mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.selectVideoTutorial('Troubleshooting Guide');
    await helpCenterPage.playVideo();
    await helpCenterPage.verifyVideoPlaying();
  });

  test('TC_AC4_005 - Verify video player responsiveness on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.selectVideoTutorial('Troubleshooting Guide');
    await helpCenterPage.verifyVideoPlayerResponsive();
  });

  test('TC_AC6_001 - Navigate to Help Center and locate downloadable materials section', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyDownloadableMaterialsSectionVisible();
  });

  test('TC_AC6_002 - Click download link for User Guide PDF', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    const startTime = Date.now();
    const downloadPromise = page.waitForEvent('download');
    await helpCenterPage.clickDownloadLink('User Guide PDF');
    const download = await downloadPromise;
    const downloadTime = Date.now() - startTime;
    expect(downloadTime).toBeLessThan(2000);
    expect(download).toBeTruthy();
  });

  test('TC_AC6_003 - Verify downloaded PDF opens correctly', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    const downloadPromise = page.waitForEvent('download');
    await helpCenterPage.clickDownloadLink('User Guide PDF');
    const download = await downloadPromise;
    const path = await download.path();
    expect(path).toBeTruthy();
  });

  test('TC_AC6_004 - Download Quick Reference Guide from mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    const downloadPromise = page.waitForEvent('download');
    await helpCenterPage.clickDownloadLink('Quick Reference Guide PDF');
    const download = await downloadPromise;
    expect(download).toBeTruthy();
  });

  test('TC_AC6_005 - Verify downloaded file on mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    const downloadPromise = page.waitForEvent('download');
    await helpCenterPage.clickDownloadLink('Quick Reference Guide PDF');
    const download = await downloadPromise;
    const path = await download.path();
    expect(path).toBeTruthy();
  });

  test('TC_AC8_001 - Access Help Center landing page on desktop browser', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyResponsiveLayout('desktop');
  });

  test('TC_AC8_002 - Access Help Center landing page on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyResponsiveLayout('tablet');
  });

  test('TC_AC8_003 - Access Help Center landing page on mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyResponsiveLayout('mobile');
  });

  test('TC_AC8_004 - Test Help Center features on mobile (search, categories, chat)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifySearchFunctionalOnMobile();
    await helpCenterPage.verifyCategoriesFunctionalOnMobile();
    await helpCenterPage.verifyChatFunctionalOnMobile();
  });

  test('TC_AC9_001 - Verify Help Center visual branding alignment', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyBrandingAlignment();
  });

  test('TC_AC9_002 - Test Help Center keyboard navigation', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyKeyboardNavigation();
  });

  test('TC_AC9_003 - Test Help Center with screen reader (NVDA)', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyScreenReaderAccessibility();
  });

  test('TC_AC9_004 - Verify color contrast ratios for Help Center components', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyColorContrastCompliance();
  });

  test('TC_AC10_001 - Attempt to access an unavailable help article', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.attemptAccessUnavailableArticle();
    await helpCenterPage.verifyErrorMessageDisplayed();
  });

  test('TC_AC10_002 - Verify alternative actions are suggested in error message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.attemptAccessUnavailableArticle();
    await helpCenterPage.verifyAlternativeActionsSuggested();
  });

  test('TC_AC10_003 - Attempt to play an unavailable video tutorial', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.attemptPlayUnavailableVideo();
    await helpCenterPage.verifyErrorMessageDisplayed();
  });

  test('TC_AC10_004 - Verify alternative video options are provided', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.attemptPlayUnavailableVideo();
    await helpCenterPage.verifyAlternativeVideoOptionsSuggested();
  });

});

test.describe('Help Center Search and Filter Tests', () => {

  test('TC_AC7_001 - Navigate to Help Center landing page and locate search bar', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifySearchBarVisible();
  });

  test('TC_AC7_002 - Enter keyword password reset in search bar and submit', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    const startTime = Date.now();
    await helpCenterPage.searchKeyword('password reset');
    const searchTime = Date.now() - startTime;
    expect(searchTime).toBeLessThan(2000);
    await helpCenterPage.verifySearchResultsDisplayed();
  });

  test('TC_AC7_003 - Verify search results include multiple content types', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.searchKeyword('password reset');
    await helpCenterPage.verifySearchResultsIncludeMultipleContentTypes();
  });

  test('TC_AC7_004 - Search for keyword troubleshooting on mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.searchKeyword('troubleshooting');
    await helpCenterPage.verifySearchResultsDisplayed();
  });

  test('TC_AC7_005 - Verify search results are mobile-responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.searchKeyword('troubleshooting');
    await helpCenterPage.verifySearchResultsMobileResponsive();
  });

  test('TC_AC7_006 - Enter keyword getting started and apply category filter FAQs', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.searchKeyword('getting started');
    await helpCenterPage.applyCategoryFilter('FAQs');
    await helpCenterPage.verifyFilteredSearchResults('FAQs');
  });

  test('TC_AC7_007 - Apply content-type filter Video to search results', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.searchKeyword('getting started');
    await helpCenterPage.applyContentTypeFilter('Video');
    await helpCenterPage.verifyFilteredSearchResults('Video');
  });

  test('TC_AC7_008 - Apply multiple filters (category and content type) simultaneously', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.searchKeyword('getting started');
    await helpCenterPage.applyCategoryFilter('Troubleshooting');
    await helpCenterPage.applyContentTypeFilter('PDF');
    await helpCenterPage.verifyMultipleFiltersApplied(['Troubleshooting', 'PDF']);
  });

});

test.describe('Interactive Chat Assistant Tests', () => {

  test('TC_AC5_001 - Navigate to Help Center landing page and locate chat assistant', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.verifyChatAssistantVisible();
  });

  test('TC_AC5_002 - Click to open chat assistant', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    const startTime = Date.now();
    await helpCenterPage.openChatAssistant();
    const openTime = Date.now() - startTime;
    expect(openTime).toBeLessThan(2000);
    await helpCenterPage.verifyChatWindowOpened();
  });

  test('TC_AC5_003 - Type common support question How do I reset my password? in chat', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.openChatAssistant();
    await helpCenterPage.typeChatMessage('How do I reset my password?');
    await helpCenterPage.verifyChatResponseReceived();
  });

  test('TC_AC5_004 - Verify chat provides links to relevant resources', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.openChatAssistant();
    await helpCenterPage.typeChatMessage('How do I reset my password?');
    await helpCenterPage.verifyChatResponseContainsResourceLinks();
  });

  test('TC_AC5_005 - Open chat assistant on mobile device', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.openChatAssistant();
    await helpCenterPage.verifyChatWindowOpened();
  });

  test('TC_AC5_006 - Submit support query via mobile chat', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.openChatAssistant();
    await helpCenterPage.typeChatMessage('How to update account settings?');
    await helpCenterPage.verifyChatResponseReceived();
  });

  test('TC_AC5_007 - Test chat assistant keyboard accessibility', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.openChatAssistant();
    await helpCenterPage.verifyChatKeyboardAccessibility();
  });

  test('TC_AC5_008 - Test chat assistant with screen reader', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.openChatAssistant();
    await helpCenterPage.verifyChatScreenReaderAccessibility();
  });

  test('TC_AC5_009 - Verify chat session is served over HTTPS', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.openChatAssistant();
    const url = page.url();
    expect(url).toContain('https://');
  });

  test('TC_AC5_010 - Verify chat does not expose sensitive user data', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigate();
    await helpCenterPage.openChatAssistant();
    await helpCenterPage.verifyChatDataPrivacy();
  });

});

test.describe('Chat Insights and Analytics Tests', () => {

  test('TC_CHAT_INSIGHTS_001 - Access chat analytics dashboard as support staff', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigateToChatAnalyticsDashboard();
    await helpCenterPage.verifyChatAnalyticsDashboardLoaded();
  });

  test('TC_CHAT_INSIGHTS_002 - Review chat interaction data for defined period (last 7 days)', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigateToChatAnalyticsDashboard();
    await helpCenterPage.selectTimePeriod('last 7 days');
    await helpCenterPage.verifyChatInteractionDataDisplayed();
  });

  test('TC_CHAT_INSIGHTS_003 - Identify top 5 common user issues from chat data', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigateToChatAnalyticsDashboard();
    await helpCenterPage.selectTimePeriod('last 30 days');
    await helpCenterPage.verifyTopCommonIssuesDisplayed(5);
  });

  test('TC_CHAT_INSIGHTS_004 - Export chat interaction data for content improvement analysis', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigateToChatAnalyticsDashboard();
    const downloadPromise = page.waitForEvent('download');
    await helpCenterPage.exportChatData('CSV');
    const download = await downloadPromise;
    expect(download).toBeTruthy();
  });

  test('TC_CHAT_INSIGHTS_005 - Use insights to identify gaps in Help Center content', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigateToChatAnalyticsDashboard();
    await helpCenterPage.analyzeContentGaps();
    await helpCenterPage.verifyContentGapAnalysisDisplayed();
  });

  test('TC_CHAT_INSIGHTS_006 - Monitor real-time chat sessions as support staff', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigateToChatAnalyticsDashboard();
    await helpCenterPage.enableRealTimeMonitoring();
    await helpCenterPage.verifyRealTimeChatSessionsDisplayed();
  });

  test('TC_CHAT_INSIGHTS_007 - Verify monitoring does not expose sensitive user information', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.navigateToChatAnalyticsDashboard();
    await helpCenterPage.enableRealTimeMonitoring();
    await helpCenterPage.verifyNoSensitiveDataExposed();
  });

});