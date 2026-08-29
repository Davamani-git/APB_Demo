const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const { HomePage } = require('./pages/home.page');
const logger = require('../../utils/logger');

test.describe('Help Center - Chat Assistant Tests', () => {
  test('TC-1889: Chat assistant functionality with real-time response', async ({ page }) => {
    logger.info('Starting TC-1889: Chat assistant functionality test');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyCategoriesVisible();
    
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyChatWindowOpensWithinTimeout(2000);
    
    await helpCenterPage.enterChatMessage('Hello, I need help with product setup');
    await helpCenterPage.verifyMessageDisplayedInChat('Hello, I need help with product setup');
    
    await helpCenterPage.sendChatMessage();
    await helpCenterPage.verifyMessageSentSuccessfully();
    
    await helpCenterPage.waitForChatResponse();
    await helpCenterPage.verifyChatResponseDisplayed();
    
    logger.info('Completed TC-1889: Chat assistant functionality test');
  });

  test('TC-1890: Chat service offline error handling', async ({ page }) => {
    logger.info('Starting TC-1890: Chat service offline test');
    const helpCenterPage = new HelpCenterPage(page);
    
    // Simulate chat service offline by blocking the endpoint
    await page.route('**/chat/**', route => route.abort());
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.clickChatAssistantButton();
    
    await helpCenterPage.verifyChatServiceUnavailableError();
    await helpCenterPage.verifyAlternativeSupportContactsDisplayed();
    
    logger.info('Completed TC-1890: Chat service offline test');
  });

  test('TC-1891: Chat message character limit validation', async ({ page }) => {
    logger.info('Starting TC-1891: Chat message character limit test');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.clickChatAssistantButton();
    await helpCenterPage.verifyChatWindowOpensWithinTimeout(2000);
    
    const longMessage = 'a'.repeat(5001);
    await helpCenterPage.enterChatMessage(longMessage);
    
    await helpCenterPage.attemptToSendMessage();
    
    await helpCenterPage.verifyCharacterLimitValidationError();
    await helpCenterPage.verifyMessageNotSent();
    await helpCenterPage.verifyMessageRemainsInInputField();
    
    logger.info('Completed TC-1891: Chat message character limit test');
  });
});

test.describe('Help Center - Analytics Integration Tests', () => {
  test('TC-1892: Analytics event tracking for Help Center click', async ({ page }) => {
    logger.info('Starting TC-1892: Analytics event tracking test');
    const homePage = new HomePage(page);
    let analyticsEventCaptured = false;
    
    // Monitor analytics requests
    page.on('request', request => {
      if (request.url().includes('analytics') || request.url().includes('google-analytics') || request.url().includes('adobe')) {
        const postData = request.postData();
        if (postData && postData.includes('help_center_click')) {
          analyticsEventCaptured = true;
        }
      }
    });
    
    await homePage.navigate('https://app.example.com');
    await homePage.verifyPageLoaded();
    await homePage.verifyHelpCenterEntryPointVisible();
    
    await homePage.clickHelpCenterEntryPoint();
    
    // Wait for analytics event to be sent
    await page.waitForTimeout(2000);
    
    expect(analyticsEventCaptured).toBeTruthy();
    
    logger.info('Completed TC-1892: Analytics event tracking test');
  });

  test('TC-1893: Analytics platform unavailable - system continues functioning', async ({ page }) => {
    logger.info('Starting TC-1893: Analytics platform unavailable test');
    const homePage = new HomePage(page);
    
    // Block analytics endpoints
    await page.route('**/analytics/**', route => route.abort());
    await page.route('**/google-analytics/**', route => route.abort());
    await page.route('**/adobe/**', route => route.abort());
    
    await homePage.navigate('https://app.example.com');
    await homePage.verifyPageLoaded();
    
    await homePage.clickHelpCenterEntryPoint();
    
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyNoErrorsDisplayed();
    
    logger.info('Completed TC-1893: Analytics platform unavailable test');
  });

  test('TC-1894: Browser blocks analytics - functionality unaffected', async ({ page, context }) => {
    logger.info('Starting TC-1894: Browser blocks analytics test');
    const homePage = new HomePage(page);
    
    // Simulate ad blocker by blocking analytics
    await context.route('**/analytics/**', route => route.abort());
    await context.route('**/google-analytics/**', route => route.abort());
    await context.route('**/adobe/**', route => route.abort());
    
    await homePage.navigate('https://app.example.com');
    await homePage.verifyPageLoaded();
    
    await homePage.clickHelpCenterEntryPoint();
    
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.browseCategoriesAndContent();
    
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    const analyticsRelatedErrors = consoleErrors.filter(err => 
      err.includes('analytics') && !err.includes('blocked')
    );
    expect(analyticsRelatedErrors.length).toBe(0);
    
    logger.info('Completed TC-1894: Browser blocks analytics test');
  });
});

test.describe('Help Center - Video Tutorial Tests', () => {
  test('TC-1895: Video tutorial playback on desktop', async ({ page }) => {
    logger.info('Starting TC-1895: Video tutorial playback on desktop');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.selectCategory('Video Tutorials');
    await helpCenterPage.verifyVideoTutorialsDisplayed();
    
    await helpCenterPage.clickVideoTutorial('Product Setup Tutorial');
    await helpCenterPage.verifyVideoPlayerLoaded();
    
    const startTime = Date.now();
    await helpCenterPage.clickVideoPlayButton();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    await helpCenterPage.verifyVideoIsPlaying();
    
    await helpCenterPage.clickVideoPauseButton();
    await helpCenterPage.verifyVideoIsPaused();
    
    await helpCenterPage.clickVideoPlayButton();
    await helpCenterPage.verifyVideoIsPlaying();
    
    await helpCenterPage.adjustVideoVolume(50);
    await helpCenterPage.verifyVolumeAdjusted();
    
    await helpCenterPage.muteVideo();
    await helpCenterPage.verifyVideoMuted();
    
    await helpCenterPage.unmuteVideo();
    await helpCenterPage.verifyVideoUnmuted();
    
    await helpCenterPage.enterFullscreen();
    await helpCenterPage.verifyFullscreenMode();
    
    await helpCenterPage.exitFullscreen();
    await helpCenterPage.verifyNormalMode();
    
    logger.info('Completed TC-1895: Video tutorial playback on desktop');
  });

  test('TC-1896: Video tutorial playback on tablet', async ({ page }) => {
    logger.info('Starting TC-1896: Video tutorial playback on tablet');
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyResponsiveLayout('tablet');
    
    await helpCenterPage.selectCategory('Video Tutorials');
    await helpCenterPage.verifyVideoTutorialsDisplayedResponsive('tablet');
    
    await helpCenterPage.tapVideoTutorial('Product Setup Tutorial');
    await helpCenterPage.verifyVideoPlayerLoaded();
    
    const startTime = Date.now();
    await helpCenterPage.tapVideoPlayButton();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    await helpCenterPage.verifyVideoIsPlaying();
    await helpCenterPage.verifyTouchOptimizedControls();
    
    await helpCenterPage.testAllPlaybackControlsTouch();
    
    logger.info('Completed TC-1896: Video tutorial playback on tablet');
  });

  test('TC-1897: Video tutorial playback on mobile', async ({ page }) => {
    logger.info('Starting TC-1897: Video tutorial playback on mobile');
    await page.setViewportSize({ width: 375, height: 667 });
    
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyResponsiveLayout('mobile');
    
    await helpCenterPage.selectCategory('Video Tutorials');
    await helpCenterPage.verifyVideoTutorialsDisplayedResponsive('mobile');
    
    await helpCenterPage.tapVideoTutorial('Product Setup Tutorial');
    await helpCenterPage.verifyVideoPlayerLoaded();
    
    const startTime = Date.now();
    await helpCenterPage.tapVideoPlayButton();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    await helpCenterPage.verifyVideoIsPlaying();
    await helpCenterPage.verifyMobileOptimizedControls();
    
    await helpCenterPage.testAllPlaybackControlsTouch();
    
    logger.info('Completed TC-1897: Video tutorial playback on mobile');
  });

  test('TC-1898: Video unavailable error handling', async ({ page }) => {
    logger.info('Starting TC-1898: Video unavailable error handling');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.selectCategory('Video Tutorials');
    await helpCenterPage.verifyVideoTutorialsDisplayed();
    
    await helpCenterPage.clickVideoTutorial('removed_video_123');
    await helpCenterPage.verifyVideoPlayerLoaded();
    
    await helpCenterPage.clickVideoPlayButton();
    
    await helpCenterPage.verifyVideoUnavailableError();
    await helpCenterPage.verifyAlternativeLearningResourcesProvided();
    
    logger.info('Completed TC-1898: Video unavailable error handling');
  });

  test('TC-1899: Unsupported video codec error handling', async ({ page }) => {
    logger.info('Starting TC-1899: Unsupported video codec test');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.selectCategory('Video Tutorials');
    await helpCenterPage.verifyVideoTutorialsDisplayed();
    
    await helpCenterPage.clickVideoTutorial('unsupported_codec_video');
    await helpCenterPage.verifyVideoPlayerLoaded();
    
    await helpCenterPage.clickVideoPlayButton();
    
    await helpCenterPage.verifyCodecCompatibilityError();
    await helpCenterPage.verifyBrowserRecommendationsProvided();
    
    logger.info('Completed TC-1899: Unsupported video codec test');
  });
});

test.describe('Help Center - Downloadable Materials Tests', () => {
  test('TC-1900: Download PDF help material', async ({ page }) => {
    logger.info('Starting TC-1900: Download PDF test');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.selectCategory('Help Materials');
    await helpCenterPage.verifyDownloadableMaterialsDisplayed();
    
    await helpCenterPage.locatePDFDownloadLink('User_Guide.pdf');
    await helpCenterPage.verifyDownloadLinkVisible('User_Guide.pdf');
    
    const downloadPromise = page.waitForEvent('download');
    await helpCenterPage.clickDownloadLink('User_Guide.pdf');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('.pdf');
    await helpCenterPage.verifyFileDownloadedSuccessfully(download);
    
    logger.info('Completed TC-1900: Download PDF test');
  });

  test('TC-1901: Download DOCX help material', async ({ page }) => {
    logger.info('Starting TC-1901: Download DOCX test');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.selectCategory('Help Materials');
    await helpCenterPage.verifyDownloadableMaterialsDisplayed();
    
    await helpCenterPage.locateDOCXDownloadLink('Quick_Start_Guide.docx');
    await helpCenterPage.verifyDownloadLinkVisible('Quick_Start_Guide.docx');
    
    const downloadPromise = page.waitForEvent('download');
    await helpCenterPage.clickDownloadLink('Quick_Start_Guide.docx');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('.docx');
    await helpCenterPage.verifyFileDownloadedSuccessfully(download);
    
    logger.info('Completed TC-1901: Download DOCX test');
  });

  test('TC-1902: Download link for non-existent file error', async ({ page }) => {
    logger.info('Starting TC-1902: Non-existent file download test');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.selectCategory('Help Materials');
    await helpCenterPage.verifyDownloadableMaterialsDisplayed();
    
    await helpCenterPage.clickDownloadLink('deleted_guide.pdf');
    
    await helpCenterPage.verifyFileNotFoundError();
    
    logger.info('Completed TC-1902: Non-existent file download test');
  });

  test('TC-1903: Corrupted file download prevention', async ({ page }) => {
    logger.info('Starting TC-1903: Corrupted file download test');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.selectCategory('Help Materials');
    await helpCenterPage.verifyDownloadableMaterialsDisplayed();
    
    await helpCenterPage.attemptDownloadCorruptedFile('corrupted_file.pdf');
    
    await helpCenterPage.verifyCorruptedFileError();
    await helpCenterPage.verifyDownloadPrevented();
    
    logger.info('Completed TC-1903: Corrupted file download test');
  });
});

test.describe('Help Center - Navigation and Load Tests', () => {
  test('TC-1904: Help Center navigation from Home Page with performance check', async ({ page }) => {
    logger.info('Starting TC-1904: Help Center navigation test');
    const homePage = new HomePage(page);
    
    await homePage.navigate('https://app.example.com');
    await homePage.verifyPageLoaded();
    await homePage.verifyHelpCenterEntryPointVisible();
    
    const startTime = Date.now();
    await homePage.clickHelpCenterEntryPoint();
    
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.verifyPageLoaded();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
    
    await helpCenterPage.verifyAllCategoriesDisplayed([
      'Getting Started',
      'FAQs',
      'How-to Guides',
      'Video Tutorials',
      'Help Materials',
      'Troubleshooting',
      'Chat Support',
      'Search Help'
    ]);
    
    await helpCenterPage.verifyPageLayoutCorrect();
    await helpCenterPage.verifyNoMissingContent();
    
    logger.info('Completed TC-1904: Help Center navigation test');
  });

  test('TC-1905: Help Center service unavailable error', async ({ page }) => {
    logger.info('Starting TC-1905: Help Center service unavailable test');
    const homePage = new HomePage(page);
    
    // Block Help Center backend
    await page.route('**/help-center/**', route => route.abort());
    
    await homePage.navigate('https://app.example.com');
    await homePage.verifyPageLoaded();
    
    await homePage.clickHelpCenterEntryPoint();
    
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.verifyServiceUnavailableError();
    await helpCenterPage.verifyAlternativeSupportOptionsDisplayed();
    
    logger.info('Completed TC-1905: Help Center service unavailable test');
  });

  test('TC-1906: Help Center load under slow network conditions', async ({ page }) => {
    logger.info('Starting TC-1906: Slow network test');
    const homePage = new HomePage(page);
    
    // Simulate slow network (2G)
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50 * 1024 / 8,
      uploadThroughput: 20 * 1024 / 8,
      latency: 2000
    });
    
    await homePage.navigate('https://app.example.com');
    await homePage.verifyPageLoaded();
    
    await homePage.clickHelpCenterEntryPoint();
    
    const helpCenterPage = new HelpCenterPage(page);
    await helpCenterPage.verifyLoadingIndicatorDisplayed();
    
    // Wait for page to load or timeout
    try {
      await helpCenterPage.verifyPageLoaded();
      logger.info('Page loaded successfully under slow network');
    } catch (error) {
      await helpCenterPage.verifyTimeoutMessageWithRetry();
      logger.info('Timeout message displayed with retry option');
    }
    
    logger.info('Completed TC-1906: Slow network test');
  });
});

test.describe('Help Center - Category and Content Tests', () => {
  test('TC-1907: Browse Getting Started category', async ({ page }) => {
    logger.info('Starting TC-1907: Getting Started category test');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyCategoriesVisible();
    
    await helpCenterPage.clickCategory('Getting Started');
    await helpCenterPage.verifyCategorySelected('Getting Started');
    
    await helpCenterPage.verifyArticlesDisplayed();
    
    await helpCenterPage.clickArticle('How to Set Up Your Account');
    await helpCenterPage.verifyArticleOpened('How to Set Up Your Account');
    await helpCenterPage.verifyArticleAccessible();
    await helpCenterPage.verifyArticleReadable();
    
    logger.info('Completed TC-1907: Getting Started category test');
  });

  test('TC-1908: Browse FAQs category', async ({ page }) => {
    logger.info('Starting TC-1908: FAQs category test');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyCategoriesVisible();
    
    await helpCenterPage.clickCategory('FAQs');
    await helpCenterPage.verifyCategorySelected('FAQs');
    
    await helpCenterPage.verifyFAQArticlesDisplayed();
    
    await helpCenterPage.clickFAQ('What payment methods are accepted?');
    await helpCenterPage.verifyFAQOpened('What payment methods are accepted?');
    await helpCenterPage.verifyFAQAccessible();
    await helpCenterPage.verifyFAQFormattedCorrectly();
    
    logger.info('Completed TC-1908: FAQs category test');
  });

  test('TC-1909: Empty category handling', async ({ page }) => {
    logger.info('Starting TC-1909: Empty category test');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyCategoriesVisible();
    
    await helpCenterPage.clickCategory('Advanced Features');
    await helpCenterPage.verifyCategorySelected('Advanced Features');
    
    await helpCenterPage.verifyEmptyCategoryMessage();
    
    logger.info('Completed TC-1909: Empty category test');
  });

  test('TC-1910: Corrupted category data error handling', async ({ page }) => {
    logger.info('Starting TC-1910: Corrupted category data test');
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate('https://app.example.com/help-center');
    await helpCenterPage.verifyPageLoaded();
    await helpCenterPage.verifyCategoriesVisible();
    
    // Simulate corrupted data by intercepting and corrupting response
    await page.route('**/category/Troubleshooting/**', route => {
      route.fulfill({
        status: 500,
        body: 'Internal Server Error'
      });
    });
    
    await helpCenterPage.clickCategory('Troubleshooting');
    
    await helpCenterPage.verifyDataLoadError();
    await helpCenterPage.verifyErrorGuidanceProvided();
    
    logger.info('Completed TC-1910: Corrupted category data test');
  });
});
