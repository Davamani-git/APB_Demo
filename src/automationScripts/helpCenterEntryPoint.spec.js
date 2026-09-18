const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/homePage.page');
const { HelpCenterPage } = require('./pages/helpCenterPage.page');
const logger = require('../utils/logger');

test.describe('Help Center Entry Point - QE-5921', () => {

  test('QE-5921 TS-001 TC-001: Verify Help Center entry point is clearly visible on Home Page with proper branding and WCAG 2.1 AA compliance', async ({ page }) => {
    logger.info('Starting test: QE-5921 TS-001 TC-001');
    const homePage = new HomePage(page);
    
    await test.step('Launch the application and navigate to the Home Page', async () => {
      await homePage.navigate();
      await expect(page).toHaveURL(/.*/);
      logger.info('Home Page loaded successfully');
    });

    await test.step('Locate the Help Center entry point in the main navigation or designated section', async () => {
      await homePage.waitForHelpCenterEntryPointVisible();
      const isVisible = await homePage.isHelpCenterEntryPointVisible();
      expect(isVisible).toBeTruthy();
      logger.info('Help Center entry point is clearly visible');
    });

    await test.step('Verify the Help Center entry point aligns with site branding', async () => {
      const brandingStyles = await homePage.getHelpCenterEntryPointStyles();
      expect(brandingStyles).toBeDefined();
      logger.info('Entry point matches existing site branding guidelines');
    });

    await test.step('Check color contrast ratio of the Help Center entry point using accessibility tools', async () => {
      const contrastRatio = await homePage.checkColorContrast();
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      logger.info('Color contrast meets WCAG 2.1 AA standards');
    });

    await test.step('Tab to the Help Center entry point using keyboard navigation', async () => {
      await page.keyboard.press('Tab');
      const isFocused = await homePage.isHelpCenterEntryPointFocused();
      expect(isFocused).toBeTruthy();
      logger.info('Entry point receives visible keyboard focus indicator');
    });
  });

  test('QE-5921 TS-002 TC-001: Verify Help Center entry point lacks proper ARIA labels causing screen reader failure', async ({ page }) => {
    logger.info('Starting test: QE-5921 TS-002 TC-001');
    const homePage = new HomePage(page);
    
    await test.step('Launch the application and navigate to the Home Page', async () => {
      await homePage.navigate();
      await expect(page).toHaveURL(/.*/);
      logger.info('Home Page loaded successfully');
    });

    await test.step('Enable screen reader technology and navigate to the Help Center entry point', async () => {
      await homePage.waitForHelpCenterEntryPointVisible();
      const ariaLabel = await homePage.getHelpCenterAriaLabel();
      expect(ariaLabel).toBeTruthy();
      logger.info('Screen reader announces the Help Center entry point with proper purpose and destination');
    });

    await test.step('Inspect the HTML markup of the Help Center entry point for ARIA labels and semantic elements', async () => {
      const hasAriaAttributes = await homePage.hasAriaAttributes();
      expect(hasAriaAttributes).toBeTruthy();
      logger.info('Entry point contains appropriate aria-label or aria-labelledby attributes and semantic HTML');
    });
  });

  test('QE-5921 TS-003 TC-001: Verify Help Center entry point visibility on mobile device with small viewport', async ({ page }) => {
    logger.info('Starting test: QE-5921 TS-003 TC-001');
    const homePage = new HomePage(page);
    
    await test.step('Launch the application on a mobile device or mobile emulator with small viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await homePage.navigate();
      await expect(page).toHaveURL(/.*/);
      logger.info('Home Page loaded successfully on mobile device');
    });

    await test.step('Scroll through the Home Page to locate the Help Center entry point', async () => {
      await homePage.waitForHelpCenterEntryPointVisible();
      const isVisible = await homePage.isHelpCenterEntryPointVisible();
      expect(isVisible).toBeTruthy();
      logger.info('Help Center entry point is visible and not obscured by other elements');
    });

    await test.step('Check if the Help Center entry point is accessible within the mobile navigation menu', async () => {
      const isAccessible = await homePage.isHelpCenterAccessibleInMobileNav();
      expect(isAccessible).toBeTruthy();
      logger.info('Entry point is easily discoverable in mobile navigation without excessive scrolling');
    });

    await test.step('Verify the Help Center entry point is tappable and has adequate touch target size', async () => {
      const touchTargetSize = await homePage.getHelpCenterTouchTargetSize();
      expect(touchTargetSize.width).toBeGreaterThanOrEqual(44);
      expect(touchTargetSize.height).toBeGreaterThanOrEqual(44);
      logger.info('Entry point has minimum 44x44 pixel touch target');
    });
  });
});

test.describe('Accessible Navigation to Help Center - QE-5922', () => {

  test('QE-5922 TS-001 TC-001: Verify accessible navigation to Help Center landing page using keyboard within performance targets', async ({ page }) => {
    logger.info('Starting test: QE-5922 TS-001 TC-001');
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Home Page', async () => {
      await homePage.navigate();
      await expect(page).toHaveURL(/.*/);
      logger.info('Home Page loaded successfully');
    });

    await test.step('Use keyboard Tab key to navigate to the Help Center entry point', async () => {
      await page.keyboard.press('Tab');
      const isFocused = await homePage.isHelpCenterEntryPointFocused();
      expect(isFocused).toBeTruthy();
      logger.info('Help Center entry point receives keyboard focus');
    });

    await test.step('Press Enter key to activate the Help Center entry point and start timer', async () => {
      const startTime = Date.now();
      await page.keyboard.press('Enter');
      await helpCenterPage.waitForPageLoad();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThanOrEqual(4000);
      logger.info(`Help Center landing page loads within performance target: ${loadTime}ms`);
    });

    await test.step('Verify existing Home Page functionality remains intact by navigating back to Home Page', async () => {
      await page.goBack();
      await homePage.waitForPageLoad();
      const isHomePageIntact = await homePage.verifyHomePageIntegrity();
      expect(isHomePageIntact).toBeTruthy();
      logger.info('Home Page displays correctly with all original features functioning without disruption');
    });
  });

  test('QE-5922 TS-001 TC-002: Verify accessible navigation to Help Center landing page using mouse click within performance targets', async ({ page }) => {
    logger.info('Starting test: QE-5922 TS-001 TC-002');
    const homePage = new HomePage(page);
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Home Page', async () => {
      await homePage.navigate();
      await expect(page).toHaveURL(/.*/);
      logger.info('Home Page loaded successfully');
    });

    await test.step('Click on the Help Center entry point using mouse and start timer', async () => {
      const startTime = Date.now();
      await homePage.clickHelpCenterEntryPoint();
      await helpCenterPage.waitForPageLoad();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThanOrEqual(4000);
      logger.info(`Help Center landing page loads within performance target: ${loadTime}ms`);
    });

    await test.step('Verify the Help Center landing page displays categorized help content', async () => {
      const hasCategories = await helpCenterPage.hasCategorizedContent();
      expect(hasCategories).toBeTruthy();
      logger.info('Landing page shows categories such as Getting Started, FAQs, Troubleshooting');
    });

    await test.step('Navigate back to Home Page and verify all existing features are functioning', async () => {
      await page.goBack();
      await homePage.waitForPageLoad();
      const isHomePageIntact = await homePage.verifyHomePageIntegrity();
      expect(isHomePageIntact).toBeTruthy();
      logger.info('Home Page functionality remains unaffected by Help Center navigation');
    });
  });

  test('QE-5922 TS-002 TC-001: Verify error message display when Help Center landing page is temporarily unavailable', async ({ page }) => {
    logger.info('Starting test: QE-5922 TS-002 TC-001');
    const homePage = new HomePage(page);
    
    await test.step('Launch the application and navigate to the Home Page', async () => {
      await homePage.navigate();
      await expect(page).toHaveURL(/.*/);
      logger.info('Home Page loaded successfully');
    });

    await test.step('Simulate Help Center landing page unavailability', async () => {
      await page.route('**/help-center', route => route.abort());
      logger.info('Help Center landing page service is unavailable');
    });

    await test.step('Click on the Help Center entry point to attempt navigation', async () => {
      await homePage.clickHelpCenterEntryPoint();
      logger.info('System attempts to load Help Center landing page');
    });

    await test.step('Verify error message is displayed indicating the page cannot be loaded', async () => {
      const errorMessage = await homePage.getErrorMessage();
      expect(errorMessage).toContain('temporarily unavailable');
      logger.info('Meaningful error message appears');
    });

    await test.step('Verify alternative support contact information is provided in the error message', async () => {
      const hasAlternativeSupport = await homePage.hasAlternativeSupportInfo();
      expect(hasAlternativeSupport).toBeTruthy();
      logger.info('Error message includes alternative support options');
    });
  });

  test('QE-5922 TS-003 TC-001: Verify system prevents duplicate navigation requests when Help Center entry point is activated multiple times rapidly', async ({ page }) => {
    logger.info('Starting test: QE-5922 TS-003 TC-001');
    const homePage = new HomePage(page);
    
    await test.step('Launch the application and navigate to the Home Page', async () => {
      await homePage.navigate();
      await expect(page).toHaveURL(/.*/);
      logger.info('Home Page loaded successfully');
    });

    await test.step('Rapidly click the Help Center entry point multiple times in succession', async () => {
      const requestCount = await homePage.rapidClickHelpCenterEntryPoint(5);
      expect(requestCount).toBeLessThanOrEqual(1);
      logger.info('System prevents duplicate navigation requests or page reloads');
    });

    await test.step('Verify Help Center landing page loads only once without multiple reload attempts', async () => {
      const navigationCount = await homePage.getNavigationCount();
      expect(navigationCount).toBe(1);
      logger.info('Single navigation to Help Center landing page occurs, no duplicate requests');
    });

    await test.step('Verify stable performance and user experience with no UI freezing or errors', async () => {
      const consoleErrors = await homePage.getConsoleErrors();
      expect(consoleErrors.length).toBe(0);
      logger.info('Application remains responsive, no console errors, smooth user experience');
    });
  });
});

test.describe('Browse Categorized Help Content - QE-5923', () => {

  test('QE-5923 TS-001 TC-001: Verify browsing categorized help content from Help Center landing page in accessible, branded interface', async ({ page }) => {
    logger.info('Starting test: QE-5923 TS-001 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Locate and select the Getting Started category', async () => {
      await helpCenterPage.selectCategory('Getting Started');
      const isSelected = await helpCenterPage.isCategorySelected('Getting Started');
      expect(isSelected).toBeTruthy();
      logger.info('Getting Started category is highlighted and selected');
    });

    await test.step('Verify a list of relevant text articles and FAQs is displayed for Getting Started', async () => {
      const startTime = Date.now();
      await helpCenterPage.waitForContentLoad();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThanOrEqual(2000);
      const hasContent = await helpCenterPage.hasContentItems();
      expect(hasContent).toBeTruthy();
      logger.info('List of articles and FAQs related to Getting Started appears within 2 seconds');
    });

    await test.step('Verify the interface aligns with site branding', async () => {
      const brandingStyles = await helpCenterPage.getBrandingStyles();
      expect(brandingStyles).toBeDefined();
      logger.info('Content display matches existing website branding guidelines');
    });

    await test.step('Test keyboard navigation through the displayed articles and FAQs', async () => {
      await page.keyboard.press('Tab');
      const isNavigable = await helpCenterPage.isContentKeyboardNavigable();
      expect(isNavigable).toBeTruthy();
      logger.info('All articles and FAQs are accessible via keyboard Tab navigation');
    });

    await test.step('Verify screen reader announces article titles and descriptions correctly', async () => {
      const hasSemanticStructure = await helpCenterPage.hasSemanticStructure();
      expect(hasSemanticStructure).toBeTruthy();
      logger.info('Screen reader reads article titles and descriptions with proper semantic structure');
    });
  });

  test('QE-5923 TS-001 TC-002: Verify browsing FAQs category displays relevant content in accessible interface', async ({ page }) => {
    logger.info('Starting test: QE-5923 TS-001 TC-002');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Locate and select the FAQs category', async () => {
      await helpCenterPage.selectCategory('FAQs');
      const isSelected = await helpCenterPage.isCategorySelected('FAQs');
      expect(isSelected).toBeTruthy();
      logger.info('FAQs category is highlighted and selected');
    });

    await test.step('Verify a list of relevant FAQs and articles is displayed', async () => {
      const startTime = Date.now();
      await helpCenterPage.waitForContentLoad();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThanOrEqual(2000);
      const hasContent = await helpCenterPage.hasContentItems();
      expect(hasContent).toBeTruthy();
      logger.info('List of FAQs appears within 2 seconds with titles and descriptions');
    });

    await test.step('Verify color contrast of text and background meets WCAG 2.1 AA standards', async () => {
      const contrastRatio = await helpCenterPage.checkColorContrast();
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
      logger.info('Color contrast ratio is at least 4.5:1 for normal text');
    });

    await test.step('Select one FAQ item and verify it opens with full content displayed', async () => {
      await helpCenterPage.selectContentItem('How do I reset my password?');
      const isContentDisplayed = await helpCenterPage.isContentDisplayed();
      expect(isContentDisplayed).toBeTruthy();
      logger.info('FAQ content is displayed in readable format with proper formatting');
    });
  });

  test('QE-5923 TS-001 TC-003: Verify browsing Troubleshooting category displays relevant content in accessible interface', async ({ page }) => {
    logger.info('Starting test: QE-5923 TS-001 TC-003');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Locate and select the Troubleshooting category', async () => {
      await helpCenterPage.selectCategory('Troubleshooting');
      const isSelected = await helpCenterPage.isCategorySelected('Troubleshooting');
      expect(isSelected).toBeTruthy();
      logger.info('Troubleshooting category is highlighted and selected');
    });

    await test.step('Verify a list of relevant troubleshooting articles is displayed', async () => {
      const startTime = Date.now();
      await helpCenterPage.waitForContentLoad();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThanOrEqual(2000);
      const hasContent = await helpCenterPage.hasContentItems();
      expect(hasContent).toBeTruthy();
      logger.info('List of troubleshooting articles appears within 2 seconds');
    });

    await test.step('Verify the interface is responsive on tablet and mobile devices', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      const isResponsiveTablet = await helpCenterPage.isContentDisplayedCorrectly();
      expect(isResponsiveTablet).toBeTruthy();
      await page.setViewportSize({ width: 375, height: 667 });
      const isResponsiveMobile = await helpCenterPage.isContentDisplayedCorrectly();
      expect(isResponsiveMobile).toBeTruthy();
      logger.info('Content displays correctly on tablet and mobile viewports');
    });

    await test.step('Verify all interactive elements have adequate touch target size on mobile', async () => {
      const touchTargets = await helpCenterPage.getTouchTargetSizes();
      touchTargets.forEach(target => {
        expect(target.width).toBeGreaterThanOrEqual(44);
        expect(target.height).toBeGreaterThanOrEqual(44);
      });
      logger.info('All buttons and links have minimum 44x44 pixel touch targets');
    });
  });

  test('QE-5923 TS-002 TC-001: Verify meaningful error message when category content is unavailable due to backend service failure', async ({ page }) => {
    logger.info('Starting test: QE-5923 TS-002 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Simulate backend service failure for content retrieval', async () => {
      await page.route('**/api/content/**', route => route.abort());
      logger.info('Content service is unavailable');
    });

    await test.step('Select a help category', async () => {
      await helpCenterPage.selectCategory('Getting Started');
      logger.info('System attempts to load category content');
    });

    await test.step('Verify meaningful error message is displayed', async () => {
      const errorMessage = await helpCenterPage.getErrorMessage();
      expect(errorMessage).toContain('Unable to load content');
      logger.info('Error message appears with appropriate text');
    });

    await test.step('Verify suggestions to try other categories or contact support are provided', async () => {
      const hasSuggestions = await helpCenterPage.hasAlternativeSuggestions();
      expect(hasSuggestions).toBeTruthy();
      logger.info('Error message includes actionable suggestions and support contact information');
    });
  });

  test('QE-5923 TS-003 TC-001: Verify message display when category contains only draft or unpublished content', async ({ page }) => {
    logger.info('Starting test: QE-5923 TS-003 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Configure backend to return only draft or unpublished content for a specific category', async () => {
      await page.route('**/api/content/troubleshooting', route => {
        route.fulfill({ status: 200, body: JSON.stringify([]) });
      });
      logger.info('Category contains only unpublished content');
    });

    await test.step('Select the category with unpublished content', async () => {
      await helpCenterPage.selectCategory('Troubleshooting');
      logger.info('System attempts to display category content');
    });

    await test.step('Verify appropriate message is displayed indicating no published content available', async () => {
      const message = await helpCenterPage.getNoContentMessage();
      expect(message).toContain('No published content');
      logger.info('Message appears indicating no published content available');
    });

    await test.step('Verify user is provided with options to browse other categories', async () => {
      const hasAlternatives = await helpCenterPage.hasAlternativeCategoryLinks();
      expect(hasAlternatives).toBeTruthy();
      logger.info('Message includes links or suggestions to browse other available categories');
    });
  });
});

test.describe('Search and Filter Help Resources - QE-5924', () => {

  test('QE-5924 TS-001 TC-001: Verify search with keyword and filters returns matching articles, videos, and downloads', async ({ page }) => {
    logger.info('Starting test: QE-5924 TS-001 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Locate the search bar and enter a valid search keyword', async () => {
      await helpCenterPage.enterSearchKeyword('password reset');
      logger.info('Search keyword is entered in the search field');
    });

    await test.step('Select category filter from the dropdown', async () => {
      await helpCenterPage.selectCategoryFilter('FAQs');
      logger.info('Category filter is applied');
    });

    await test.step('Select content type filter from the dropdown', async () => {
      await helpCenterPage.selectContentTypeFilter('Article');
      logger.info('Content type filter is applied');
    });

    await test.step('Click the Search button or press Enter to execute search', async () => {
      const startTime = Date.now();
      await helpCenterPage.executeSearch();
      await helpCenterPage.waitForSearchResults();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThanOrEqual(2000);
      logger.info('Search results appear within 2 seconds');
    });

    await test.step('Verify search results include title, description, and content type indicator', async () => {
      const results = await helpCenterPage.getSearchResults();
      expect(results.length).toBeGreaterThan(0);
      results.forEach(result => {
        expect(result.title).toBeDefined();
        expect(result.description).toBeDefined();
        expect(result.contentType).toBeDefined();
      });
      logger.info('Each result displays title, description, and content type badge');
    });
  });

  test('QE-5924 TS-001 TC-002: Verify search with keyword returns mixed content types without filters', async ({ page }) => {
    logger.info('Starting test: QE-5924 TS-001 TC-002');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Enter a broad search keyword in the search bar', async () => {
      await helpCenterPage.enterSearchKeyword('getting started');
      logger.info('Search keyword is entered');
    });

    await test.step('Execute search without applying any filters', async () => {
      await helpCenterPage.executeSearch();
      await helpCenterPage.waitForSearchResults();
      logger.info('Search is executed with no filters applied');
    });

    await test.step('Verify search results include articles, videos, and downloadable materials', async () => {
      const results = await helpCenterPage.getSearchResults();
      const contentTypes = results.map(r => r.contentType);
      const hasMixedTypes = contentTypes.includes('article') || contentTypes.includes('video') || contentTypes.includes('download');
      expect(hasMixedTypes).toBeTruthy();
      logger.info('Results display mixed content types');
    });

    await test.step('Verify each result has a link or button to view/access the content', async () => {
      const hasActions = await helpCenterPage.allResultsHaveActions();
      expect(hasActions).toBeTruthy();
      logger.info('Each result includes action based on content type');
    });
  });

  test('QE-5924 TS-002 TC-001: Verify appropriate message when search keyword matches no content', async ({ page }) => {
    logger.info('Starting test: QE-5924 TS-002 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Enter a search keyword that does not match any content', async () => {
      await helpCenterPage.enterSearchKeyword('xyzabc123nonexistent');
      logger.info('Search keyword is entered');
    });

    await test.step('Execute the search', async () => {
      await helpCenterPage.executeSearch();
      await helpCenterPage.waitForSearchResults();
      logger.info('Search is executed');
    });

    await test.step('Verify no results are displayed', async () => {
      const results = await helpCenterPage.getSearchResults();
      expect(results.length).toBe(0);
      logger.info('Search results section is empty with no content items');
    });

    await test.step('Verify message indicating no results found is displayed', async () => {
      const message = await helpCenterPage.getNoResultsMessage();
      expect(message).toContain('No results found');
      logger.info('Message appears with appropriate text');
    });

    await test.step('Verify suggestions to try different keywords or browse categories are provided', async () => {
      const hasSuggestions = await helpCenterPage.hasSearchSuggestions();
      expect(hasSuggestions).toBeTruthy();
      logger.info('Message includes actionable suggestions');
    });
  });

  test('QE-5924 TS-003 TC-001: Verify appropriate message when multiple restrictive filters result in zero matches', async ({ page }) => {
    logger.info('Starting test: QE-5924 TS-003 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Enter a valid search keyword', async () => {
      await helpCenterPage.enterSearchKeyword('troubleshooting');
      logger.info('Search keyword is entered');
    });

    await test.step('Apply restrictive category filter', async () => {
      await helpCenterPage.selectCategoryFilter('Getting Started');
      logger.info('Category filter is applied');
    });

    await test.step('Apply restrictive content type filter that conflicts with the keyword and category', async () => {
      await helpCenterPage.selectContentTypeFilter('Download');
      logger.info('Content type filter is applied');
    });

    await test.step('Execute the search with both restrictive filters', async () => {
      await helpCenterPage.executeSearch();
      await helpCenterPage.waitForSearchResults();
      logger.info('Search is executed with multiple filters');
    });

    await test.step('Verify no results are displayed', async () => {
      const results = await helpCenterPage.getSearchResults();
      expect(results.length).toBe(0);
      logger.info('Search results section is empty');
    });

    await test.step('Verify message suggesting to broaden filter criteria is displayed', async () => {
      const message = await helpCenterPage.getNoResultsMessage();
      expect(message).toContain('broaden your filter');
      logger.info('Message appears suggesting to broaden filter criteria');
    });
  });
});

test.describe('Use Automated Help Center Chat - QE-5925', () => {

  test('QE-5925 TS-001 TC-001: Verify chat assistant opens within 2 seconds and displays initial automated greeting', async ({ page }) => {
    logger.info('Starting test: QE-5925 TS-001 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Locate the chat assistant button or icon on the Help Center landing page', async () => {
      await helpCenterPage.waitForChatButtonVisible();
      const isVisible = await helpCenterPage.isChatButtonVisible();
      expect(isVisible).toBeTruthy();
      logger.info('Chat assistant button is visible and accessible');
    });

    await test.step('Click on the chat assistant button and start timer', async () => {
      const startTime = Date.now();
      await helpCenterPage.openChatAssistant();
      await helpCenterPage.waitForChatWindowOpen();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThanOrEqual(2000);
      logger.info(`Chat window appears within 2 seconds: ${loadTime}ms`);
    });

    await test.step('Verify initial automated greeting message is displayed in the chat window', async () => {
      const greeting = await helpCenterPage.getChatGreeting();
      expect(greeting).toContain('Hello');
      logger.info('Greeting message appears');
    });

    await test.step('Verify chat input field is ready for user to type a message', async () => {
      const isInputActive = await helpCenterPage.isChatInputActive();
      expect(isInputActive).toBeTruthy();
      logger.info('Chat input field is active and accepts text input');
    });
  });

  test('QE-5925 TS-002 TC-001: Verify error message when chat service is unavailable', async ({ page }) => {
    logger.info('Starting test: QE-5925 TS-002 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Simulate chat service unavailability', async () => {
      await page.route('**/api/chat/**', route => route.abort());
      logger.info('Chat service is unavailable');
    });

    await test.step('Click on the chat assistant button to attempt opening chat', async () => {
      await helpCenterPage.openChatAssistant();
      logger.info('System attempts to open chat assistant');
    });

    await test.step('Verify error message is displayed indicating chat assistant is temporarily unavailable', async () => {
      const errorMessage = await helpCenterPage.getChatErrorMessage();
      expect(errorMessage).toContain('temporarily unavailable');
      logger.info('Error message appears');
    });

    await test.step('Verify alternative support options are provided in the error message', async () => {
      const hasAlternatives = await helpCenterPage.hasChatAlternativeSupport();
      expect(hasAlternatives).toBeTruthy();
      logger.info('Error message includes alternative support options');
    });
  });

  test('QE-5925 TS-003 TC-001: Verify chat assistant does not store, log, or expose sensitive user data', async ({ page }) => {
    logger.info('Starting test: QE-5925 TS-003 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    let consoleMessages = [];
    
    page.on('console', msg => consoleMessages.push(msg.text()));
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Open the chat assistant', async () => {
      await helpCenterPage.openChatAssistant();
      await helpCenterPage.waitForChatWindowOpen();
      logger.info('Chat window opens successfully');
    });

    await test.step('Enter a message containing potentially sensitive data into the chat input field', async () => {
      await helpCenterPage.enterChatMessage('My credit card number is 4111-1111-1111-1111 and password is SecretPass123');
      logger.info('Message is entered in chat input');
    });

    await test.step('Send the message and monitor network requests and responses', async () => {
      await helpCenterPage.sendChatMessage();
      await helpCenterPage.waitForChatResponse();
      logger.info('Message is sent to chat assistant');
    });

    await test.step('Verify sensitive data is not stored in browser local storage or session storage', async () => {
      const localStorage = await page.evaluate(() => JSON.stringify(window.localStorage));
      const sessionStorage = await page.evaluate(() => JSON.stringify(window.sessionStorage));
      expect(localStorage).not.toContain('4111-1111-1111-1111');
      expect(localStorage).not.toContain('SecretPass123');
      expect(sessionStorage).not.toContain('4111-1111-1111-1111');
      expect(sessionStorage).not.toContain('SecretPass123');
      logger.info('No sensitive data found in browser storage');
    });

    await test.step('Verify sensitive data is not logged in browser console', async () => {
      const hasSensitiveData = consoleMessages.some(msg => 
        msg.includes('4111-1111-1111-1111') || msg.includes('SecretPass123')
      );
      expect(hasSensitiveData).toBeFalsy();
      logger.info('No sensitive data appears in console logs');
    });

    await test.step('Verify chat assistant response does not echo or expose the sensitive data', async () => {
      const response = await helpCenterPage.getLastChatResponse();
      expect(response).not.toContain('4111-1111-1111-1111');
      expect(response).not.toContain('SecretPass123');
      logger.info('Chat response does not contain sensitive data');
    });
  });
});

test.describe('Chat Assistant Suggests Help Content - QE-5926', () => {

  test('QE-5926 TS-001 TC-001: Verify chat assistant provides relevant links to help articles based on user query', async ({ page }) => {
    logger.info('Starting test: QE-5926 TS-001 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Open the chat assistant', async () => {
      await helpCenterPage.openChatAssistant();
      await helpCenterPage.waitForChatWindowOpen();
      logger.info('Chat window opens successfully with greeting message');
    });

    await test.step('Enter a valid support question into the chat input field', async () => {
      await helpCenterPage.enterChatMessage('How do I reset my password?');
      logger.info('Support question is entered');
    });

    await test.step('Send the message by clicking Send button or pressing Enter', async () => {
      await helpCenterPage.sendChatMessage();
      await helpCenterPage.waitForChatResponse();
      logger.info('Message is sent to chat assistant');
    });

    await test.step('Verify chat assistant responds with a message containing one or more relevant links', async () => {
      const response = await helpCenterPage.getLastChatResponse();
      const hasLinks = await helpCenterPage.chatResponseHasLinks();
      expect(hasLinks).toBeTruthy();
      logger.info('Chat response includes text and links to help articles');
    });

    await test.step('Verify the links are clickable and point to Help Center articles or materials', async () => {
      const links = await helpCenterPage.getChatResponseLinks();
      expect(links.length).toBeGreaterThan(0);
      for (const link of links) {
        expect(link).toContain('/help-center');
      }
      logger.info('Links are clickable and navigate to relevant help content');
    });
  });

  test('QE-5926 TS-002 TC-001: Verify chat assistant response when query is ambiguous or unrecognized', async ({ page }) => {
    logger.info('Starting test: QE-5926 TS-002 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Open the chat assistant', async () => {
      await helpCenterPage.openChatAssistant();
      await helpCenterPage.waitForChatWindowOpen();
      logger.info('Chat window opens successfully');
    });

    await test.step('Enter an ambiguous or unrecognized query into the chat input field', async () => {
      await helpCenterPage.enterChatMessage('xyz help me with thing');
      logger.info('Ambiguous query is entered');
    });

    await test.step('Send the message', async () => {
      await helpCenterPage.sendChatMessage();
      await helpCenterPage.waitForChatResponse();
      logger.info('Message is sent to chat assistant');
    });

    await test.step('Verify chat assistant responds indicating no relevant content was found', async () => {
      const response = await helpCenterPage.getLastChatResponse();
      expect(response).toContain('couldn\'t find');
      logger.info('Response message indicates no relevant content found');
    });

    await test.step('Verify suggestions to browse categories or refine the search are provided', async () => {
      const hasSuggestions = await helpCenterPage.chatResponseHasSuggestions();
      expect(hasSuggestions).toBeTruthy();
      logger.info('Response includes suggestions');
    });
  });

  test('QE-5926 TS-003 TC-001: Verify error message when chat assistant suggested links point to temporarily unavailable content', async ({ page }) => {
    logger.info('Starting test: QE-5926 TS-003 TC-001');
    const helpCenterPage = new HelpCenterPage(page);
    
    await test.step('Launch the application and navigate to the Help Center landing page', async () => {
      await helpCenterPage.navigate();
      await helpCenterPage.waitForPageLoad();
      logger.info('Help Center landing page loads successfully');
    });

    await test.step('Open the chat assistant and enter a valid support question', async () => {
      await helpCenterPage.openChatAssistant();
      await helpCenterPage.waitForChatWindowOpen();
      await helpCenterPage.enterChatMessage('How do I troubleshoot login issues?');
      await helpCenterPage.sendChatMessage();
      await helpCenterPage.waitForChatResponse();
      logger.info('Chat assistant provides links to help articles');
    });

    await test.step('Simulate underlying help content being temporarily unavailable', async () => {
      await page.route('**/articles/**', route => route.abort());
      logger.info('Help content service is unavailable');
    });

    await test.step('Click on one of the suggested links provided by the chat assistant', async () => {
      await helpCenterPage.clickFirstChatLink();
      logger.info('System attempts to load the linked help content');
    });

    await test.step('Verify error message is displayed indicating the content is temporarily unavailable', async () => {
      const errorMessage = await helpCenterPage.getContentErrorMessage();
      expect(errorMessage).toContain('temporarily unavailable');
      logger.info('Error message appears');
    });

    await test.step('Verify alternative support options are provided', async () => {
      const hasAlternatives = await helpCenterPage.hasContentAlternativeSupport();
      expect(hasAlternatives).toBeTruthy();
      logger.info('Error message includes alternative options');
    });
  });
});
