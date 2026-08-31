const { test, expect } = require('@playwright/test');
const { HelpCenterPage } = require('./pages/helpCenter.page');
const logger = require('../utils/logger');

test.describe('Help Center Search Functionality', () => {

  test('TC-001: Search with valid keyword returns relevant results', async ({ page }) => {
    logger.info('Starting test: TC-001 - Search with valid keyword');
    const helpCenter = new HelpCenterPage(page);
    
    await helpCenter.navigate();
    await helpCenter.verifyPageLoaded();
    
    await helpCenter.verifySearchBoxVisible();
    await helpCenter.enterSearchKeyword('password reset');
    await helpCenter.submitSearch();
    
    await helpCenter.verifySearchResultsDisplayed();
    await helpCenter.verifyResultsLoadedWithinTimeout(2000);
    await helpCenter.verifyResultsRankedByRelevance();
    
    logger.info('Test TC-001 completed successfully');
  });

  test('TC-002: Search with special characters returns relevant results', async ({ page }) => {
    logger.info('Starting test: TC-002 - Search with special characters');
    const helpCenter = new HelpCenterPage(page);
    
    await helpCenter.navigate();
    await helpCenter.verifyPageLoaded();
    
    await helpCenter.enterSearchKeyword('C++ programming');
    await helpCenter.submitSearch();
    
    await helpCenter.verifySearchResultsDisplayed();
    await helpCenter.verifyResultsLoadedWithinTimeout(2000);
    await helpCenter.verifyResultsRankedByRelevance();
    
    logger.info('Test TC-002 completed successfully');
  });

  test('TC-003: Search returns multiple content types ranked by relevance', async ({ page }) => {
    logger.info('Starting test: TC-003 - Multiple content types search');
    const helpCenter = new HelpCenterPage(page);
    
    await helpCenter.navigate();
    await helpCenter.verifyPageLoaded();
    
    await helpCenter.enterSearchKeyword('getting started');
    await helpCenter.submitSearch();
    
    await helpCenter.verifySearchResultsDisplayed();
    await helpCenter.verifyArticlesDisplayed();
    await helpCenter.verifyVideosDisplayed();
    await helpCenter.verifyMaterialsDisplayed();
    await helpCenter.verifyAllContentTypesRankedByRelevance();
    
    logger.info('Test TC-003 completed successfully');
  });

  test('TC-004: Filter search results by content type maintains relevance ranking', async ({ page }) => {
    logger.info('Starting test: TC-004 - Filter by content type');
    const helpCenter = new HelpCenterPage(page);
    
    await helpCenter.navigate();
    await helpCenter.enterSearchKeyword('tutorial');
    await helpCenter.submitSearch();
    
    await helpCenter.verifySearchResultsDisplayed();
    await helpCenter.verifyContentTypeLabelsVisible();
    
    await helpCenter.applyContentTypeFilter('Videos');
    await helpCenter.verifyOnlyVideosDisplayed();
    await helpCenter.verifyResultsRankedByRelevance();
    
    logger.info('Test TC-004 completed successfully');
  });

  test('TC-005: Search with no matching content displays helpful message', async ({ page }) => {
    logger.info('Starting test: TC-005 - No results found');
    const helpCenter = new HelpCenterPage(page);
    
    await helpCenter.navigate();
    await helpCenter.verifyPageLoaded();
    
    await helpCenter.enterSearchKeyword('xyzabc123nonexistent');
    await helpCenter.submitSearch();
    
    await helpCenter.verifyNoResultsMessageDisplayed();
    await helpCenter.verifyAlternativeSearchSuggestionsDisplayed();
    await helpCenter.verifyPopularTopicsDisplayed();
    
    logger.info('Test TC-005 completed successfully');
  });

  test('TC-006: Search with misspelled keyword provides suggestions', async ({ page }) => {
    logger.info('Starting test: TC-006 - Misspelled keyword');
    const helpCenter = new HelpCenterPage(page);
    
    await helpCenter.navigate();
    await helpCenter.verifyPageLoaded();
    
    await helpCenter.enterSearchKeyword('pasword resset');
    await helpCenter.submitSearch();
    
    await helpCenter.verifySpellingSuggestionOrNoResults();
    
    logger.info('Test TC-006 completed successfully');
  });

});
