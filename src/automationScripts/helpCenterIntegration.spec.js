const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const { HomePage } = require('./pages/home.page');
const { ChatMonitoringDashboardPage } = require('./pages/chatMonitoringDashboard.page');

test.describe('Help Center Integration - Chat Assistant Tests', () => {

  test('TC-2146: Chat assistant responds to valid question', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    await homePage.navigate();
    await homePage.clickHelpCenterEntryPoint();
    await expect(page).toHaveURL(/.*help-center.*/, { timeout: 2000 });
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.clickChatAssistantIcon();
    await helpCenterPage.verifyChatWindowOpened(2000);
    
    await helpCenterPage.typeChatQuestion('How do I reset my password?');
    await helpCenterPage.verifyQuestionDisplayedInChat('How do I reset my password?');
    
    await helpCenterPage.submitChatQuestion();
    await helpCenterPage.verifyAutomatedResponseReceived(2000);
  });

  test('TC-2147: Chat assistant handles unknown query with fallback', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    await homePage.navigate();
    await homePage.clickHelpCenterEntryPoint();
    await expect(page).toHaveURL(/.*help-center.*/, { timeout: 2000 });
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.openChatAssistant();
    await helpCenterPage.verifyChatWindowOpened(2000);
    
    await helpCenterPage.typeChatQuestion('xyzabc random gibberish query 12345');
    await helpCenterPage.verifyQuestionDisplayedInChat('xyzabc random gibberish query 12345');
    
    await helpCenterPage.submitChatQuestion();
    await helpCenterPage.verifyFallbackResponseDisplayed();
  });

  test('TC-2148: Chat service unavailability displays error message', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    await homePage.navigate();
    await homePage.clickHelpCenterEntryPoint();
    await expect(page).toHaveURL(/.*help-center.*/, { timeout: 2000 });
    await helpCenterPage.verifyPageLoaded();
    
    // Simulate chat service unavailability - implementation depends on test environment configuration
    await helpCenterPage.simulateChatServiceUnavailability();
    
    await helpCenterPage.attemptToOpenChatAssistant();
    await helpCenterPage.verifyChatServiceErrorMessage();
  });
});

test.describe('Help Center Integration - Chat Monitoring Dashboard Tests', () => {

  test('TC-2149: Support staff login and view chat interaction logs', async ({ page }) => {
    const chatDashboardPage = new ChatMonitoringDashboardPage(page);
    
    await chatDashboardPage.navigate();
    await chatDashboardPage.verifyLoginPageLoaded();
    
    await chatDashboardPage.enterUsername('support_staff_user');
    await chatDashboardPage.enterPassword('ValidPass@123');
    await chatDashboardPage.verifyCredentialsAccepted();
    
    await chatDashboardPage.clickLoginButton();
    await chatDashboardPage.verifyAuthenticationSuccess();
    await chatDashboardPage.verifyRedirectedToDashboard();
    
    await chatDashboardPage.viewChatInteractionLogs();
    await chatDashboardPage.verifyChatLogsDisplayed();
  });

  test('TC-2150: Invalid credentials denied access to dashboard', async ({ page }) => {
    const chatDashboardPage = new ChatMonitoringDashboardPage(page);
    
    await chatDashboardPage.navigate();
    await chatDashboardPage.verifyLoginPageLoaded();
    
    await chatDashboardPage.enterUsername('invalid_user');
    await chatDashboardPage.enterPassword('WrongPass@123');
    
    await chatDashboardPage.clickLoginButton();
    await chatDashboardPage.verifyAuthenticationError();
  });

  test('TC-2151: Unauthorized direct access to dashboard redirects to login', async ({ page }) => {
    const chatDashboardPage = new ChatMonitoringDashboardPage(page);
    
    await chatDashboardPage.navigateDirectlyToDashboard();
    await chatDashboardPage.verifyAccessDenied();
    await chatDashboardPage.verifyRedirectedToLogin();
  });

  test('TC-2152: Filter chat logs by date range and query type', async ({ page }) => {
    const chatDashboardPage = new ChatMonitoringDashboardPage(page);
    
    await chatDashboardPage.loginWithValidCredentials('support_staff_user', 'ValidPass@123');
    await chatDashboardPage.verifyDashboardLoadedWithData();
    
    await chatDashboardPage.selectDateRangeFilter('2024-01-01', '2024-01-31');
    await chatDashboardPage.verifyDateRangePickerAccepted();
    
    await chatDashboardPage.selectQueryTypeFilter('Password Reset');
    await chatDashboardPage.verifyQueryTypeDropdownAccepted();
    
    await chatDashboardPage.applyFilters();
    await chatDashboardPage.verifyFilteredResultsDisplayed();
  });
});

test.describe('Help Center Integration - Search Functionality Tests', () => {

  test('TC-2153: Search returns relevant results for valid keyword', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoadedWithSearchBar();
    
    await helpCenterPage.enterSearchKeyword('password reset');
    await helpCenterPage.verifyKeywordAccepted('password reset');
    
    await helpCenterPage.submitSearch();
    await helpCenterPage.verifySearchResultsDisplayed(2000);
  });

  test('TC-2154: Search displays no results message for non-existent keyword', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoadedWithSearchBar();
    
    await helpCenterPage.enterSearchKeyword('xyznonexistentkeyword999');
    await helpCenterPage.verifyKeywordAccepted('xyznonexistentkeyword999');
    
    await helpCenterPage.submitSearch();
    await helpCenterPage.verifyNoResultsMessage();
  });

  test('TC-2155: Search sanitizes special characters input', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoadedWithSearchBar();
    
    await helpCenterPage.enterSearchKeyword('password@#$%^&*()');
    await helpCenterPage.verifyKeywordAccepted('password@#$%^&*()');
    
    await helpCenterPage.submitSearch();
    await helpCenterPage.verifySanitizedSearchResults();
  });

  test('TC-2156: Search sanitizes SQL injection attempt', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoadedWithSearchBar();
    
    await helpCenterPage.enterSearchKeyword("' OR '1'='1");
    await helpCenterPage.verifyKeywordAccepted("' OR '1'='1");
    
    await helpCenterPage.submitSearch();
    await helpCenterPage.verifySanitizedSearchResults();
  });
});

test.describe('Help Center Integration - Downloadable Materials Tests', () => {

  test('TC-2157: Download PDF user guide successfully', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.searchForDownloadableGuide('User Guide PDF');
    await helpCenterPage.verifyPDFGuideDisplayedWithDownloadLink();
    
    const downloadPromise = page.waitForEvent('download');
    await helpCenterPage.clickDownloadLink();
    const download = await downloadPromise;
    
    await helpCenterPage.verifyDownloadStarted(2000);
    await helpCenterPage.verifySecureHTTPSConnection();
    await helpCenterPage.verifyDownloadedFileIsValidPDF(download);
  });

  test('TC-2158: Unavailable material displays error message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.locateUnavailableMaterial('Removed or unavailable guide');
    await helpCenterPage.verifyUnavailableMaterialLinkVisible();
    
    await helpCenterPage.clickUnavailableMaterialLink();
    await helpCenterPage.verifyUnavailableResourceErrorMessage();
  });

  test('TC-2159: Corrupted file prevents download with error message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoaded();
    
    await helpCenterPage.locateCorruptedFile('Corrupted file');
    await helpCenterPage.verifyCorruptedFileLinkVisible();
    
    await helpCenterPage.clickCorruptedFileLink();
    await helpCenterPage.verifyCorruptedFileErrorMessage();
  });
});

test.describe('Help Center Integration - Home Page Navigation Tests', () => {

  test('TC-2160: Navigate to Help Center from Home Page', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    await homePage.navigate();
    await homePage.verifyPageLoadedWithHelpCenterEntryPoint();
    
    await homePage.clickHelpCenterEntryPoint();
    await expect(page).toHaveURL(/.*help-center.*/, { timeout: 2000 });
    await helpCenterPage.verifyCategorizedContentDisplayed();
  });

  test('TC-2161: Help Center service unavailable displays error', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    await homePage.simulateHelpCenterServiceDown();
    
    await homePage.attemptToAccessHelpCenter();
    await homePage.verifyHelpCenterServiceErrorMessage();
  });

  test('TC-2162: Help Center accessible on mobile device', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    await page.setViewportSize({ width: 375, height: 667 });
    
    await homePage.navigateOnMobile();
    await homePage.verifyPageLoadedOnMobile();
    
    await homePage.clickHelpCenterEntryPoint();
    await helpCenterPage.verifyResponsiveDesignOnMobile();
    await helpCenterPage.verifyAllCategoriesVisibleOnMobile();
  });
});

test.describe('Help Center Integration - Category Browsing Tests', () => {

  test('TC-2163: Browse valid category returns relevant content', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoadedWithCategories();
    
    await helpCenterPage.selectCategory('Getting Started');
    await helpCenterPage.verifyCategorySelected('Getting Started');
    
    await helpCenterPage.verifyRelevantContentDisplayed(2000);
  });

  test('TC-2164: Empty category displays no content message', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoadedWithCategories();
    
    await helpCenterPage.selectCategory('Empty category');
    await helpCenterPage.verifyCategorySelected('Empty category');
    
    await helpCenterPage.verifyNoContentAvailableMessage();
  });

  test('TC-2165: Backend service unavailable displays error with retry options', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    await helpCenterPage.navigate();
    await helpCenterPage.verifyPageLoadedWithCategories();
    
    await helpCenterPage.simulateBackendServiceUnavailability();
    
    await helpCenterPage.selectCategory('Any valid category');
    await helpCenterPage.verifyBackendErrorMessageWithRetryOptions();
  });
});
