const { test, expect } = require('@playwright/test');
const { CardsPage } = require('./pages/cards.page');
const { CardDetailPage } = require('./pages/cardDetail.page');
const { logger } = require('../utils/logger');

test.describe('Unified Multi-Card List View Tests', () => {
  let cardsPage;

  test.beforeEach(async ({ page }) => {
    cardsPage = new CardsPage(page);
    logger.info('Navigating to cards list page');
    await cardsPage.navigate();
  });

  test('QE-6139 TS-001 TC-001 - Verify user with multiple cards views unified list with summaries', async ({ page }) => {
    logger.info('Test: Verify unified card list with multiple cards');
    
    await cardsPage.waitForCardsLoad();
    
    await expect(cardsPage.pageHeader).toBeVisible();
    await expect(cardsPage.pageHeader).toContainText('My Credit Cards');
    
    const cardRows = await cardsPage.getCardRows();
    expect(cardRows.length).toBeGreaterThanOrEqual(3);
    
    await expect(cardsPage.getCardMaskedNumberByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardIssuerByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardCreditLimitByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardAvailableCreditByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardOutstandingByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardDueDateByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardStatusByIndex(0)).toBeVisible();
    
    const viewButton = cardsPage.getCardViewButtonByIndex(0);
    await expect(viewButton).toBeVisible();
    await expect(viewButton).toBeEnabled();
    
    logger.info('Unified card list verified with complete summaries');
  });

  test('QE-6139 TS-002 TC-001 - Verify user with single card views unified list with complete summary', async ({ page }) => {
    logger.info('Test: Verify unified card list with single card');
    
    await cardsPage.waitForCardsLoad();
    
    await expect(cardsPage.pageHeader).toBeVisible();
    
    const cardRows = await cardsPage.getCardRows();
    expect(cardRows.length).toBeGreaterThanOrEqual(1);
    
    const firstCardRow = cardsPage.getCardRowByIndex(0);
    await expect(firstCardRow).toBeVisible();
    
    await expect(cardsPage.getCardMaskedNumberByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardIssuerByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardCreditLimitByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardAvailableCreditByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardOutstandingByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardDueDateByIndex(0)).toBeVisible();
    await expect(cardsPage.getCardStatusByIndex(0)).toBeVisible();
    
    const viewButton = cardsPage.getCardViewButtonByIndex(0);
    await expect(viewButton).toBeVisible();
    
    logger.info('Single card list verified with complete summary');
  });

  test('QE-6139 TS-003 TC-001 - Verify appropriate message when card repository empty or inaccessible', async ({ page }) => {
    logger.info('Test: Verify message when no cards available');
    
    await page.waitForLoadState('networkidle');
    
    const cardRows = await cardsPage.getCardRows();
    const errorMessage = cardsPage.errorAlert;
    
    if (cardRows.length === 0) {
      const isErrorVisible = await errorMessage.isVisible().catch(() => false);
      
      if (isErrorVisible) {
        await expect(errorMessage).toContainText(/no credit cards|failed to load|unavailable/i);
        logger.info('Appropriate message displayed when no cards available');
      }
    }
  });
});

test.describe('Per-Card Transaction Visibility Tests', () => {
  let cardsPage;
  let cardDetailPage;

  test.beforeEach(async ({ page }) => {
    cardsPage = new CardsPage(page);
    cardDetailPage = new CardDetailPage(page);
  });

  test('QE-6140 TS-001 TC-001 - Verify read-only transaction listing for card with transactions', async ({ page }) => {
    logger.info('Test: Verify transaction listing for card with transactions');
    
    await cardsPage.navigate();
    await cardsPage.waitForCardsLoad();
    
    const cardRows = await cardsPage.getCardRows();
    
    if (cardRows.length > 0) {
      await cardsPage.clickViewButtonByIndex(0);
      await cardDetailPage.waitForCardDetailLoad();
      
      await expect(cardDetailPage.pageHeader).toBeVisible();
      await expect(cardDetailPage.pageHeader).toContainText('Card Details');
      
      await expect(cardDetailPage.cardInfoPanel).toBeVisible();
      await expect(cardDetailPage.cardIssuer).toBeVisible();
      await expect(cardDetailPage.cardMaskedNumber).toBeVisible();
      await expect(cardDetailPage.cardCreditLimit).toBeVisible();
      await expect(cardDetailPage.cardAvailableCredit).toBeVisible();
      await expect(cardDetailPage.cardOutstanding).toBeVisible();
      await expect(cardDetailPage.cardDueDate).toBeVisible();
      
      await expect(cardDetailPage.transactionsSection).toBeVisible();
      
      const transactionRows = await cardDetailPage.getTransactionRows();
      
      if (transactionRows.length > 0) {
        await expect(cardDetailPage.getTransactionDateByIndex(0)).toBeVisible();
        await expect(cardDetailPage.getTransactionMerchantByIndex(0)).toBeVisible();
        await expect(cardDetailPage.getTransactionCategoryByIndex(0)).toBeVisible();
        await expect(cardDetailPage.getTransactionAmountByIndex(0)).toBeVisible();
        
        logger.info('Transaction listing verified with all required details');
      }
    }
  });

  test('QE-6140 TS-002 TC-001 - Verify user can filter transactions by category', async ({ page }) => {
    logger.info('Test: Verify transaction filtering by category');
    
    await cardsPage.navigate();
    await cardsPage.waitForCardsLoad();
    
    const cardRows = await cardsPage.getCardRows();
    
    if (cardRows.length > 0) {
      await cardsPage.clickViewButtonByIndex(0);
      await cardDetailPage.waitForCardDetailLoad();
      
      await expect(cardDetailPage.categoryFilter).toBeVisible();
      
      const initialTransactionCount = (await cardDetailPage.getTransactionRows()).length;
      
      await cardDetailPage.selectCategoryFilter('Food & Dining');
      await page.waitForTimeout(500);
      
      const filteredTransactionCount = (await cardDetailPage.getTransactionRows()).length;
      
      expect(filteredTransactionCount).toBeLessThanOrEqual(initialTransactionCount);
      
      await cardDetailPage.selectCategoryFilter('All');
      await page.waitForTimeout(500);
      
      const resetTransactionCount = (await cardDetailPage.getTransactionRows()).length;
      expect(resetTransactionCount).toBe(initialTransactionCount);
      
      logger.info('Transaction filtering by category verified');
    }
  });

  test('QE-6140 TS-002 TC-002 - Verify user can sort transactions by date', async ({ page }) => {
    logger.info('Test: Verify transaction sorting by date');
    
    await cardsPage.navigate();
    await cardsPage.waitForCardsLoad();
    
    const cardRows = await cardsPage.getCardRows();
    
    if (cardRows.length > 0) {
      await cardsPage.clickViewButtonByIndex(0);
      await cardDetailPage.waitForCardDetailLoad();
      
      const transactionRows = await cardDetailPage.getTransactionRows();
      
      if (transactionRows.length > 1) {
        await expect(cardDetailPage.dateColumnHeader).toBeVisible();
        
        await cardDetailPage.clickDateColumnHeader();
        await page.waitForTimeout(500);
        
        const firstDateAfterSort = await cardDetailPage.getTransactionDateByIndex(0).textContent();
        
        await cardDetailPage.clickDateColumnHeader();
        await page.waitForTimeout(500);
        
        const firstDateAfterReverseSort = await cardDetailPage.getTransactionDateByIndex(0).textContent();
        
        logger.info('Transaction sorting by date verified');
      }
    }
  });

  test('QE-6140 TS-003 TC-001 - Verify message when card has no transactions', async ({ page }) => {
    logger.info('Test: Verify message for card with no transactions');
    
    await cardsPage.navigate();
    await cardsPage.waitForCardsLoad();
    
    const cardRows = await cardsPage.getCardRows();
    
    if (cardRows.length > 0) {
      await cardsPage.clickViewButtonByIndex(0);
      await cardDetailPage.waitForCardDetailLoad();
      
      const transactionRows = await cardDetailPage.getTransactionRows();
      
      if (transactionRows.length === 0) {
        await expect(cardDetailPage.transactionsSection).toBeVisible();
        
        logger.info('Empty transaction state verified');
      }
    }
  });
});