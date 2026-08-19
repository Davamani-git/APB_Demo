const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.TransactionIngestionPage = class TransactionIngestionPage {
  constructor(page) {
    this.page = page;
    this.transactionIdInput = page.locator('#transaction-id');
    this.amountInput = page.locator('#amount');
    this.merchantInput = page.locator('#merchant');
    this.locationInput = page.locator('#location');
    this.riskScoreInput = page.locator('#risk-score');
    this.accountIdInput = page.locator('#account-id');
    this.cardIdInput = page.locator('#card-id');
    this.currencyInput = page.locator('#currency');
    this.timestampInput = page.locator('#timestamp');
    this.ingestButton = page.locator('button[data-testid="ingest-transaction"]');
    this.transactionReceivedStatus = page.locator('.transaction-status');
    this.transactionConfirmation = page.locator('.transaction-confirmation');
  }

  async navigate() {
    logger.info('Navigating to Transaction Ingestion page');
    await this.page.goto('/fraud-alert/transaction-ingestion');
    await expect(this.page).toHaveURL(/.*transaction-ingestion/);
  }

  async ingestTransaction(transactionId, amount, merchant, location, riskScore) {
    logger.info(`Ingesting transaction: ${transactionId}`);
    await expect(this.transactionIdInput).toBeVisible();
    await this.transactionIdInput.fill(transactionId);
    await this.amountInput.fill(amount);
    await this.merchantInput.fill(merchant);
    await this.locationInput.fill(location);
    await this.riskScoreInput.fill(riskScore);
    await expect(this.ingestButton).toBeEnabled();
    await this.ingestButton.click();
  }

  async ingestTransactionWithDetails(transactionId, accountId, cardId, merchant, amount, currency, timestamp, location) {
    logger.info(`Ingesting transaction with full details: ${transactionId}`);
    await expect(this.transactionIdInput).toBeVisible();
    await this.transactionIdInput.fill(transactionId);
    await this.accountIdInput.fill(accountId);
    await this.cardIdInput.fill(cardId);
    await this.merchantInput.fill(merchant);
    await this.amountInput.fill(amount);
    await this.currencyInput.fill(currency);
    await this.timestampInput.fill(timestamp);
    await this.locationInput.fill(location);
    await expect(this.ingestButton).toBeEnabled();
    await this.ingestButton.click();
  }

  async ingestIncompleteTransaction(transactionId, accountId, cardId, merchant, amount, currency, timestamp) {
    logger.info(`Ingesting incomplete transaction: ${transactionId}`);
    await expect(this.transactionIdInput).toBeVisible();
    await this.transactionIdInput.fill(transactionId);
    await this.accountIdInput.fill(accountId);
    await this.cardIdInput.fill(cardId);
    if (merchant !== null) {
      await this.merchantInput.fill(merchant);
    }
    await this.amountInput.fill(amount);
    await this.currencyInput.fill(currency);
    if (timestamp !== null) {
      await this.timestampInput.fill(timestamp);
    }
    await expect(this.ingestButton).toBeEnabled();
    await this.ingestButton.click();
  }

  async ingestMalformedTransaction(transactionId, accountId, cardId, merchant, amount, currency, timestamp) {
    logger.info(`Ingesting malformed transaction: ${transactionId}`);
    await expect(this.transactionIdInput).toBeVisible();
    await this.transactionIdInput.fill(transactionId);
    await this.accountIdInput.fill(accountId);
    await this.cardIdInput.fill(cardId);
    await this.merchantInput.fill(merchant);
    await this.amountInput.fill(amount);
    await this.currencyInput.fill(currency);
    await this.timestampInput.fill(timestamp);
    await expect(this.ingestButton).toBeEnabled();
    await this.ingestButton.click();
  }

  async ingestMultipleTransactions(accountId, cardId, amount, count, failedAttempts) {
    logger.info(`Ingesting ${count} transactions with ${failedAttempts} failed attempts`);
    for (let i = 1; i <= count; i++) {
      const transactionId = `TXN${11111 + i - 1}`;
      await expect(this.transactionIdInput).toBeVisible();
      await this.transactionIdInput.clear();
      await this.transactionIdInput.fill(transactionId);
      await this.accountIdInput.clear();
      await this.accountIdInput.fill(accountId);
      await this.cardIdInput.clear();
      await this.cardIdInput.fill(cardId);
      await this.amountInput.clear();
      await this.amountInput.fill(amount);
      await expect(this.ingestButton).toBeEnabled();
      await this.ingestButton.click();
      await this.page.waitForTimeout(100);
    }
  }

  async verifyTransactionReceived(transactionId) {
    logger.info(`Verifying transaction received: ${transactionId}`);
    await expect(this.transactionReceivedStatus).toBeVisible();
    await expect(this.transactionConfirmation).toContainText(transactionId);
    await expect(this.transactionReceivedStatus).toContainText('Received');
  }

  async verifyMultipleTransactionsReceived(firstTransactionId, lastTransactionId) {
    logger.info(`Verifying multiple transactions received: ${firstTransactionId} to ${lastTransactionId}`);
    await expect(this.transactionReceivedStatus).toBeVisible();
    await expect(this.transactionReceivedStatus).toContainText('Multiple transactions received');
  }
};
