const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const { HomePage } = require('./pages/home.page');

test.describe('Help Center Integration Tests', () => {

  test('TC-2304: Help Center chat assistant basic interaction', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate('https://app.example.com');
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Click Help Center entry point
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible({ timeout: 2000 });
    
    // Step 3: Click chat assistant button
    await helpCenterPage.openChatAssistant();
    await expect(helpCenterPage.chatWindow).toBeVisible({ timeout: 2000 });
    
    // Step 4: Type question in chat
    await helpCenterPage.typeChatMessage('How do I reset my password?');
    await expect(helpCenterPage.chatInput).toHaveValue('How do I reset my password?');
    
    // Step 5: Submit question and verify response
    await helpCenterPage.submitChatMessage();
    await expect(helpCenterPage.chatResponse).toBeVisible({ timeout: 2000 });
  });

  test('TC-2305: Chat service unavailability error handling', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate('https://app.example.com');
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Click Help Center entry point
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 3: Simulate chat service unavailability
    await page.route('**/chat/service/**', route => route.abort());
    
    // Step 4: Click chat assistant button and verify error message
    await helpCenterPage.openChatAssistant();
    await expect(helpCenterPage.errorMessage).toBeVisible();
    await expect(helpCenterPage.alternativeSupportOptions).toBeVisible();
  });

  test('TC-2306: Chat assistant rate limiting with rapid messages', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page and access Help Center
    await homePage.navigate('https://app.example.com');
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 2: Open chat assistant
    await helpCenterPage.openChatAssistant();
    await expect(helpCenterPage.chatWindow).toBeVisible({ timeout: 2000 });
    
    // Step 3: Submit multiple rapid consecutive messages
    const messages = ['Message 1', 'Message 2', 'Message 3', 'Message 4', 'Message 5'];
    for (const message of messages) {
      await helpCenterPage.typeChatMessage(message);
      await helpCenterPage.submitChatMessage();
    }
    
    // Step 4: Observe system behavior
    await expect(helpCenterPage.chatWindow).toBeVisible();
    const rateLimitFeedback = await helpCenterPage.getRateLimitFeedback();
    expect(rateLimitFeedback).toBeTruthy();
  });

  test('TC-2307: Chat assistant returns relevant help article links', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate('https://app.example.com');
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Access Help Center landing page
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 3: Open chat assistant
    await helpCenterPage.openChatAssistant();
    await expect(helpCenterPage.chatWindow).toBeVisible({ timeout: 2000 });
    
    // Step 4: Ask specific question
    await helpCenterPage.typeChatMessage('How do I reset my password?');
    await helpCenterPage.submitChatMessage();
    
    // Step 5: Review chat response for relevant article links
    await expect(helpCenterPage.chatResponse).toBeVisible();
    await expect(helpCenterPage.chatArticleLinks).toHaveCount(await helpCenterPage.chatArticleLinks.count());
    expect(await helpCenterPage.chatArticleLinks.count()).toBeGreaterThan(0);
  });

  test('TC-2308: Chat assistant handles query with no relevant articles', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page and access Help Center
    await homePage.navigate('https://app.example.com');
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 2: Open chat assistant
    await helpCenterPage.openChatAssistant();
    await expect(helpCenterPage.chatWindow).toBeVisible({ timeout: 2000 });
    
    // Step 3: Ask question with no relevant articles
    await helpCenterPage.typeChatMessage('What is the weather forecast for tomorrow?');
    await helpCenterPage.submitChatMessage();
    
    // Step 4: Review chat response for no articles message
    await expect(helpCenterPage.chatResponse).toBeVisible();
    await expect(helpCenterPage.noArticlesMessage).toBeVisible();
    await expect(helpCenterPage.generalSupportOptions).toBeVisible();
  });

  test('TC-2309: Chat assistant handles ambiguous query', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page and access Help Center
    await homePage.navigate('https://app.example.com');
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 2: Open chat assistant
    await helpCenterPage.openChatAssistant();
    await expect(helpCenterPage.chatWindow).toBeVisible({ timeout: 2000 });
    
    // Step 3: Submit ambiguous query
    await helpCenterPage.typeChatMessage('Help with account');
    await helpCenterPage.submitChatMessage();
    
    // Step 4: Review chat response
    await expect(helpCenterPage.chatResponse).toBeVisible();
    const hasClarificationRequest = await helpCenterPage.clarificationRequest.isVisible().catch(() => false);
    const hasMultipleArticles = await helpCenterPage.chatArticleLinks.count() > 1;
    expect(hasClarificationRequest || hasMultipleArticles).toBeTruthy();
  });

  test('TC-2310: Search functionality with valid keyword', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate('https://app.example.com');
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Access Help Center landing page
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 3: Enter valid keyword in search bar
    await helpCenterPage.enterSearchKeyword('password reset');
    await expect(helpCenterPage.searchInput).toHaveValue('password reset');
    
    // Step 4: Submit search query and verify results
    await helpCenterPage.submitSearch();
    await expect(helpCenterPage.searchResults).toBeVisible({ timeout: 2000 });
    await expect(helpCenterPage.searchResultItems).toHaveCount(await helpCenterPage.searchResultItems.count());
    expect(await helpCenterPage.searchResultItems.count()).toBeGreaterThan(0);
  });

  test('TC-2311: Search with no matching results', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page and access Help Center
    await homePage.navigate('https://app.example.com');
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 2: Enter keyword with no matches
    await helpCenterPage.enterSearchKeyword('xyzabc123nonexistent');
    await expect(helpCenterPage.searchInput).toHaveValue('xyzabc123nonexistent');
    
    // Step 3: Submit search and verify no results message
    await helpCenterPage.submitSearch();
    await expect(helpCenterPage.noResultsMessage).toBeVisible();
    await expect(helpCenterPage.alternativeSearchSuggestions).toBeVisible();
  });

  test('TC-2312: Search with special characters', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page and access Help Center
    await homePage.navigate('https://app.example.com');
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 2: Enter search query with special characters
    await helpCenterPage.enterSearchKeyword('@#$%^&*()!<>?');
    await expect(helpCenterPage.searchInput).toHaveValue('@#$%^&*()!<>?');
    
    // Step 3: Submit search and verify graceful handling
    await helpCenterPage.submitSearch();
    const hasValidationMessage = await helpCenterPage.validationMessage.isVisible().catch(() => false);
    const hasResults = await helpCenterPage.searchResults.isVisible().catch(() => false);
    expect(hasValidationMessage || hasResults).toBeTruthy();
  });

  test('TC-2313: Download PDF user guide successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate('https://app.example.com');
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Access Help Center landing page
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 3: Navigate to downloadable materials section
    await helpCenterPage.navigateToDownloadableSection();
    await expect(helpCenterPage.downloadableSection).toBeVisible();
    
    // Step 4: Click download link and verify secure download
    const downloadPromise = page.waitForEvent('download', { timeout: 2000 });
    await helpCenterPage.clickDownloadLink('User_Guide_v1.0.pdf');
    const download = await downloadPromise;
    expect(download).toBeTruthy();
    expect(page.url()).toContain('https://');
  });

  test('TC-2314: Download unavailable file error handling', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page and access Help Center
    await homePage.navigate('https://app.example.com');
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 2: Navigate to downloadable materials section
    await helpCenterPage.navigateToDownloadableSection();
    await expect(helpCenterPage.downloadableSection).toBeVisible();
    
    // Step 3: Click unavailable download link and verify error message
    await helpCenterPage.clickDownloadLink('Removed_Document.pdf');
    await expect(helpCenterPage.fileUnavailableError).toBeVisible();
  });

  test('TC-2315: Download with file server issues', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page and access Help Center
    await homePage.navigate('https://app.example.com');
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 2: Navigate to downloadable materials section
    await helpCenterPage.navigateToDownloadableSection();
    await expect(helpCenterPage.downloadableSection).toBeVisible();
    
    // Step 3: Simulate file server issues
    await page.route('**/files/**', route => route.abort());
    
    // Step 4: Attempt download and verify error message
    await helpCenterPage.clickDownloadLink('Help_Document.pdf');
    await expect(helpCenterPage.serverErrorMessage).toBeVisible();
    await expect(helpCenterPage.retryInstructions).toBeVisible();
  });

  test('TC-2316: Help Center landing page loads successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate('https://app.example.com');
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Click Help Center entry point and verify landing page
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible({ timeout: 2000 });
    await expect(helpCenterPage.categorizedContent).toBeVisible();
  });

  test('TC-2317: Help Center service unavailability error', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate('https://app.example.com');
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Simulate Help Center service down
    await page.route('**/helpcenter/**', route => route.abort());
    
    // Step 3: Click Help Center entry point and verify error message
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.serviceUnavailableError).toBeVisible();
    await expect(helpCenterPage.alternativeSupportOptions).toBeVisible();
  });

  test('TC-2318: Help Center repeated access consistency', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate('https://app.example.com');
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Click Help Center entry point
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible({ timeout: 2000 });
    await expect(helpCenterPage.categorizedContent).toBeVisible();
    
    // Step 3 & 4: Navigate back and repeat 3 times
    for (let i = 0; i < 3; i++) {
      await page.goBack();
      await expect(homePage.homePageContainer).toBeVisible();
      await homePage.clickHelpCenterEntryPoint();
      await expect(helpCenterPage.landingPageContainer).toBeVisible({ timeout: 2000 });
      await expect(helpCenterPage.categorizedContent).toBeVisible();
    }
  });

  test('TC-2319: Browse help content by valid category', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate('https://app.example.com');
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Access Help Center landing page
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 3: Select valid category and verify content
    await helpCenterPage.selectCategory('Getting Started');
    await expect(helpCenterPage.categoryContent).toBeVisible({ timeout: 2000 });
    await expect(helpCenterPage.categoryArticles).toHaveCount(await helpCenterPage.categoryArticles.count());
    expect(await helpCenterPage.categoryArticles.count()).toBeGreaterThan(0);
  });

  test('TC-2320: Browse empty category', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page and access Help Center
    await homePage.navigate('https://app.example.com');
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 2: Select empty category and verify message
    await helpCenterPage.selectCategory('Empty Category');
    await expect(helpCenterPage.noCategoryContentMessage).toBeVisible();
  });

  test('TC-2321: Category selection with backend unavailability', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page and access Help Center
    await homePage.navigate('https://app.example.com');
    await homePage.clickHelpCenterEntryPoint();
    await expect(helpCenterPage.landingPageContainer).toBeVisible();
    
    // Step 2: Simulate backend service unavailability
    await page.route('**/api/categories/**', route => route.abort());
    
    // Step 3: Select category and verify error message
    await helpCenterPage.selectCategory('FAQs');
    await expect(helpCenterPage.backendErrorMessage).toBeVisible();
    await expect(helpCenterPage.alternativeActions).toBeVisible();
  });

});
