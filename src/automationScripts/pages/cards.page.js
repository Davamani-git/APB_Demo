const { expect } = require('@playwright/test');
const { logger } = require('../../utils/logger');

exports.CardsPage = class CardsPage {
  constructor(page) {
    this.page = page;
    
    this.pageHeader = page.locator('.page-header h1');
    this.loadingIndicator = page.locator('div:has-text("Loading cards...")');
    this.errorAlert = page.locator('.alert-danger');
    
    this.cardsTable = page.locator('.table-responsive table');
    this.cardRows = page.locator('.table-responsive table tbody tr');
  }

  async navigate() {
    logger.info('Navigating to cards list page');
    await this.page.goto('/#/cards');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCardsLoad() {
    logger.info('Waiting for cards list to load');
    await this.page.waitForSelector('.page-header h1', { state: 'visible', timeout: 10000 });
    const isLoadingVisible = await this.loadingIndicator.isVisible().catch(() => false);
    if (isLoadingVisible) {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
    }
  }

  async getCardRows() {
    return await this.cardRows.all();
  }

  getCardRowByIndex(index) {
    return this.cardRows.nth(index);
  }

  getCardMaskedNumberByIndex(index) {
    return this.getCardRowByIndex(index).locator('td').nth(0);
  }

  getCardIssuerByIndex(index) {
    return this.getCardRowByIndex(index).locator('td').nth(1);
  }

  getCardCreditLimitByIndex(index) {
    return this.getCardRowByIndex(index).locator('td').nth(2);
  }

  getCardAvailableCreditByIndex(index) {
    return this.getCardRowByIndex(index).locator('td').nth(3);
  }

  getCardOutstandingByIndex(index) {
    return this.getCardRowByIndex(index).locator('td').nth(4);
  }

  getCardDueDateByIndex(index) {
    return this.getCardRowByIndex(index).locator('td').nth(5);
  }

  getCardStatusByIndex(index) {
    return this.getCardRowByIndex(index).locator('td').nth(6);
  }

  getCardViewButtonByIndex(index) {
    return this.getCardRowByIndex(index).locator('a.btn-info');
  }

  async clickViewButtonByIndex(index) {
    logger.info(`Clicking view button for card at index ${index}`);
    const viewButton = this.getCardViewButtonByIndex(index);
    await expect(viewButton).toBeVisible();
    await viewButton.click();
    await this.page.waitForLoadState('networkidle');
  }
};