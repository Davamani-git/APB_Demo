const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const { HomePage } = require('./pages/home.page');

test.describe('Help Center Integration Tests', () => {

  test('TC-2208: Chat Assistant Basic Functionality', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/, { timeout: 2000 });
    
    // Step 2: Locate and click chat assistant icon
    await helpCenterPage.openChatAssistant();
    await expect(helpCenterPage.chatWindow).toBeVisible({ timeout: 2000 });
    
    // Step 3: Type test message
    await helpCenterPage.typeChatMessage('Hello, I need help with my account');
    await expect(helpCenterPage.chatInputField).toHaveValue('Hello, I need help with my account');
    
    // Step 4: Submit message
    await helpCenterPage.sendChatMessage();
    await expect(helpCenterPage.chatResponse).toBeVisible({ timeout: 2000 });
  });

  test('TC-2209: Chat Service Unavailability', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Simulate chat service unavailability
    await page.route('**/chat/**', route => route.abort());
    
    // Step 3: Attempt to click chat assistant
    await helpCenterPage.clickChatAssistantIcon();
    await expect(helpCenterPage.chatErrorMessage).toBeVisible();
    
    // Step 4: Verify alternative support contact methods
    await expect(helpCenterPage.alternativeSupportOptions).toBeVisible();
  });

  test('TC-2210: Chat Window Inactivity Stability', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Click chat assistant to open chat window
    await helpCenterPage.openChatAssistant();
    await expect(helpCenterPage.chatWindow).toBeVisible({ timeout: 2000 });
    
    // Step 3: Leave chat window open for extended period (5 minutes)
    // Using waitForTimeout here to simulate real user inactivity as per test requirement
    await page.waitForTimeout(300000);
    await expect(helpCenterPage.chatWindow).toBeVisible();
    
    // Step 4: Observe system behavior after inactivity
    const timeoutMessage = helpCenterPage.chatTimeoutMessage;
    const engagementPrompt = helpCenterPage.chatEngagementPrompt;
    const isTimeoutVisible = await timeoutMessage.isVisible().catch(() => false);
    const isPromptVisible = await engagementPrompt.isVisible().catch(() => false);
    expect(isTimeoutVisible || isPromptVisible).toBeTruthy();
  });

  test('TC-2211: Chat Assistant Article Links', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Open chat assistant
    await helpCenterPage.openChatAssistant();
    await expect(helpCenterPage.chatWindow).toBeVisible({ timeout: 2000 });
    
    // Step 3: Type question about specific topic
    await helpCenterPage.typeChatMessage('How do I reset my password?');
    await expect(helpCenterPage.chatInputField).toHaveValue('How do I reset my password?');
    
    // Step 4: Submit question
    await helpCenterPage.sendChatMessage();
    await expect(helpCenterPage.chatResponseWithLinks).toBeVisible({ timeout: 2000 });
    
    // Step 5: Verify article links are clickable and relevant
    await expect(helpCenterPage.chatArticleLinks.first()).toBeVisible();
    const linkHref = await helpCenterPage.chatArticleLinks.first().getAttribute('href');
    expect(linkHref).toContain('password');
  });

  test('TC-2212: Chat Assistant Unknown Query', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Open chat assistant
    await helpCenterPage.openChatAssistant();
    await expect(helpCenterPage.chatWindow).toBeVisible({ timeout: 2000 });
    
    // Step 3: Type question not covered in knowledge base
    await helpCenterPage.typeChatMessage('Can you help me with quantum computing integration?');
    await expect(helpCenterPage.chatInputField).toHaveValue('Can you help me with quantum computing integration?');
    
    // Step 4: Submit question
    await helpCenterPage.sendChatMessage();
    await expect(helpCenterPage.chatNoMatchResponse).toBeVisible();
    
    // Step 5: Verify alternative support options
    await expect(helpCenterPage.alternativeSupportOptions).toBeVisible();
  });

  test('TC-2213: Chat Assistant Long Query Handling', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Open chat assistant
    await helpCenterPage.openChatAssistant();
    await expect(helpCenterPage.chatWindow).toBeVisible({ timeout: 2000 });
    
    // Step 3: Type extremely long query (over 1000 characters)
    const longQuery = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20);
    await helpCenterPage.typeChatMessage(longQuery);
    const inputValue = await helpCenterPage.chatInputField.inputValue();
    expect(inputValue.length).toBeGreaterThan(0);
    
    // Step 4: Submit query
    await helpCenterPage.sendChatMessage();
    await expect(helpCenterPage.chatResponse).toBeVisible();
    
    // Step 5: Verify no system crash or error
    await expect(helpCenterPage.chatWindow).toBeVisible();
    const hasGracefulMessage = await helpCenterPage.chatTruncationMessage.isVisible().catch(() => false) || 
                               await helpCenterPage.chatRephraseMessage.isVisible().catch(() => false);
    expect(hasGracefulMessage).toBeTruthy();
  });

  test('TC-2214: Search Multiple Content Types', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Locate search bar
    await expect(helpCenterPage.searchBar).toBeVisible();
    
    // Step 3: Enter valid keyword
    await helpCenterPage.searchFor('password');
    await expect(helpCenterPage.searchBar).toHaveValue('password');
    
    // Step 4: Submit search query
    await helpCenterPage.submitSearch();
    await expect(helpCenterPage.searchResults).toBeVisible({ timeout: 2000 });
    
    // Step 5: Verify results include multiple content types
    await expect(helpCenterPage.searchResultArticles).toBeVisible();
    await expect(helpCenterPage.searchResultVideos).toBeVisible();
    await expect(helpCenterPage.searchResultDownloads).toBeVisible();
  });

  test('TC-2215: Search No Results', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Locate search bar
    await expect(helpCenterPage.searchBar).toBeVisible();
    
    // Step 3: Enter keyword with no matching results
    await helpCenterPage.searchFor('xyzabc123nonexistent');
    await expect(helpCenterPage.searchBar).toHaveValue('xyzabc123nonexistent');
    
    // Step 4: Submit search query
    await helpCenterPage.submitSearch();
    await expect(helpCenterPage.noResultsMessage).toBeVisible();
    
    // Step 5: Verify suggestions for refining search
    await expect(helpCenterPage.searchSuggestions).toBeVisible();
  });

  test('TC-2216: Search Security Input Sanitization', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Locate search bar
    await expect(helpCenterPage.searchBar).toBeVisible();
    
    // Step 3: Enter search query with special characters
    await helpCenterPage.searchFor("'; DROP TABLE users; --");
    await expect(helpCenterPage.searchBar).toHaveValue("'; DROP TABLE users; --");
    
    // Step 4: Submit search query
    await helpCenterPage.submitSearch();
    const safeResults = helpCenterPage.searchResults;
    const invalidMessage = helpCenterPage.invalidQueryMessage;
    const isSafeResultsVisible = await safeResults.isVisible().catch(() => false);
    const isInvalidMessageVisible = await invalidMessage.isVisible().catch(() => false);
    expect(isSafeResultsVisible || isInvalidMessageVisible).toBeTruthy();
    
    // Step 5: Verify no database errors exposed
    const pageContent = await page.content();
    expect(pageContent).not.toContain('SQL');
    expect(pageContent).not.toContain('database error');
  });

  test('TC-2217: Video Tutorial Playback', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Browse or search for valid video tutorial
    await helpCenterPage.searchFor('Getting Started Guide');
    await helpCenterPage.submitSearch();
    await expect(helpCenterPage.videoTutorial).toBeVisible();
    
    // Step 3: Click on video tutorial
    await helpCenterPage.openVideoTutorial();
    await expect(helpCenterPage.videoPlayer).toBeVisible({ timeout: 3000 });
    
    // Step 4: Test video controls
    await helpCenterPage.clickPlayButton();
    await expect(helpCenterPage.videoPlayer).toHaveAttribute('playing', /.+/);
    await helpCenterPage.clickPauseButton();
    await helpCenterPage.adjustVolume();
    await helpCenterPage.toggleFullscreen();
  });

  test('TC-2218: Video Tutorial Unavailable', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Attempt to access corrupted video
    await page.route('**/video/corrupted_video_123', route => route.abort());
    await helpCenterPage.accessVideoById('corrupted_video_123');
    
    // Step 3: Observe system response
    await expect(helpCenterPage.videoErrorMessage).toBeVisible();
    
    // Step 4: Verify alternative video resources suggested
    await expect(helpCenterPage.alternativeVideoSuggestions).toBeVisible();
  });

  test('TC-2219: Video Playback Low Bandwidth', async ({ page, context }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Simulate low bandwidth
    const client = await context.newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 100 * 1024 / 8,
      uploadThroughput: 100 * 1024 / 8,
      latency: 100
    });
    
    // Step 2: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 3: Select and attempt to play video tutorial
    await helpCenterPage.searchFor('Advanced Features');
    await helpCenterPage.submitSearch();
    await helpCenterPage.openVideoTutorial();
    await expect(helpCenterPage.videoPlayer).toBeVisible();
    
    // Step 4: Observe video quality and notifications
    const qualityNotification = helpCenterPage.videoQualityNotification;
    const isNotificationVisible = await qualityNotification.isVisible().catch(() => false);
    expect(isNotificationVisible).toBeTruthy();
  });

  test('TC-2220: Home Page to Help Center Navigation', async ({ page }) => {
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate();
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Locate Help Center entry point
    await expect(homePage.helpCenterEntryPoint).toBeVisible();
    
    // Step 3: Click Help Center entry point
    await homePage.clickHelpCenterEntry();
    await expect(page).toHaveURL(/.*help-center/, { timeout: 2000 });
    
    // Step 4: Verify categorized content displayed
    await expect(helpCenterPage.categoryGettingStarted).toBeVisible();
    await expect(helpCenterPage.categoryFAQs).toBeVisible();
    await expect(helpCenterPage.categoryTroubleshooting).toBeVisible();
  });

  test('TC-2221: Help Center Service Down', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate();
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Simulate Help Center service down
    await page.route('**/help-center**', route => route.abort());
    
    // Step 3: Click Help Center entry point
    await homePage.clickHelpCenterEntry();
    await expect(homePage.serviceErrorMessage).toBeVisible();
    
    // Step 4: Verify alternative support contact information
    await expect(homePage.alternativeSupportContact).toBeVisible();
  });

  test('TC-2222: Help Center Repeated Access Performance', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Step 1: Navigate to Home Page
    await homePage.navigate();
    await expect(page).toHaveURL(/.*app.example.com/);
    
    // Step 2: Click Help Center entry point
    const startTime1 = Date.now();
    await homePage.clickHelpCenterEntry();
    await expect(page).toHaveURL(/.*help-center/);
    const loadTime1 = Date.now() - startTime1;
    expect(loadTime1).toBeLessThan(2000);
    
    // Step 3: Return and access again
    await homePage.navigate();
    const startTime2 = Date.now();
    await homePage.clickHelpCenterEntry();
    await expect(page).toHaveURL(/.*help-center/);
    const loadTime2 = Date.now() - startTime2;
    expect(loadTime2).toBeLessThan(2000);
    
    // Step 4: Repeat 3 more times
    for (let i = 0; i < 3; i++) {
      await homePage.navigate();
      const startTime = Date.now();
      await homePage.clickHelpCenterEntry();
      await expect(page).toHaveURL(/.*help-center/);
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(2000);
    }
  });

  test('TC-2223: Browse Content by Category', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Locate and view available categories
    await expect(helpCenterPage.categoryFAQs).toBeVisible();
    await expect(helpCenterPage.categoryTroubleshooting).toBeVisible();
    await expect(helpCenterPage.categoryGettingStarted).toBeVisible();
    
    // Step 3: Click on valid category
    await helpCenterPage.selectCategory('FAQs');
    
    // Step 4: Verify relevant content displayed
    await expect(helpCenterPage.categoryContent).toBeVisible({ timeout: 2000 });
  });

  test('TC-2224: Empty Category Content', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Locate and view available categories
    await expect(helpCenterPage.categories).toBeVisible();
    
    // Step 3: Click on category with no content
    await helpCenterPage.selectCategory('Empty_Category');
    
    // Step 4: Verify appropriate message displayed
    await expect(helpCenterPage.noCategoryContentMessage).toBeVisible();
  });

  test('TC-2225: Category Backend Service Unavailable', async ({ page }) => {
    const helpCenterPage = new HelpCenterPage(page);
    
    // Step 1: Navigate to Help Center landing page
    await helpCenterPage.navigate();
    await expect(page).toHaveURL(/.*help-center/);
    
    // Step 2: Simulate backend service unavailable
    await page.route('**/api/categories/**', route => route.abort());
    
    // Step 3: Attempt to select category
    await helpCenterPage.selectCategory('Troubleshooting');
    
    // Step 4: Verify meaningful error message
    await expect(helpCenterPage.categoryErrorMessage).toBeVisible();
    await expect(helpCenterPage.retryOptions).toBeVisible();
  });

});
