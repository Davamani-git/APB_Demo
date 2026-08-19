const { test, expect } = require('@playwright/test');
const { FraudDetectionSystemPage } = require('./pages/fraudDetectionSystem.page');
const logger = require('../../utils/logger');

test.describe('Fraud Detection System - Event Ingestion and Validation', () => {

  test('TC-001: Valid transaction event ingestion and processing', async ({ page }) => {
    logger.info('Starting test: Valid transaction event ingestion and processing');
    const fraudDetectionPage = new FraudDetectionSystemPage(page);
    
    // Step 1: Set up a valid credit card transaction with all required fields
    const transactionData = {
      transaction_id: 'TXN-12345',
      account_id: 'ACC-98765',
      card_id: 'CARD-5432',
      merchant: 'Amazon',
      amount: 150.00,
      currency: 'USD',
      timestamp: '2026-08-15T10:30:00Z',
      channel: 'online'
    };
    logger.info('Step 1: Setting up valid transaction payload');
    await fraudDetectionPage.createTransactionPayload(transactionData);
    await expect(fraudDetectionPage.transactionPayloadStatus).toContainText('properly formatted');
    
    // Step 2: Authorize the transaction on the card authorization/transaction platform
    logger.info('Step 2: Authorizing transaction');
    await fraudDetectionPage.authorizeTransaction('approved');
    await expect(fraudDetectionPage.authorizationStatus).toContainText('approved');
    
    // Step 3: Publish the transaction event to the fraud detection system
    logger.info('Step 3: Publishing transaction event to fraud detection system');
    await fraudDetectionPage.publishTransactionEvent('fraud-detection-queue');
    await expect(fraudDetectionPage.eventPublishStatus).toContainText('successfully published');
    
    // Step 4: Verify the fraud detection system receives the transaction event
    logger.info('Step 4: Verifying event received by fraud detection system');
    await fraudDetectionPage.verifyEventReceived();
    await expect(fraudDetectionPage.eventReceivedTimestamp).toBeVisible();
    
    // Step 5: Verify the system validates the transaction event structure and data
    logger.info('Step 5: Verifying event validation');
    await fraudDetectionPage.verifyEventValidation();
    await expect(fraudDetectionPage.validationStatus).toContainText('passed');
    
    // Step 6: Verify the event is queued for risk evaluation
    logger.info('Step 6: Verifying event queued for risk evaluation');
    await fraudDetectionPage.verifyEventQueued();
    await expect(fraudDetectionPage.queueStatus).toContainText('queued');
    await fraudDetectionPage.verifyQueueTimeSLA();
    
    // Step 7: Check audit trail for event ingestion
    logger.info('Step 7: Checking audit trail');
    await fraudDetectionPage.checkAuditTrail();
    await expect(fraudDetectionPage.auditLogEntry).toBeVisible();
    await expect(fraudDetectionPage.auditLogStatus).toContainText('ingested');
    
    logger.info('Test completed: Valid transaction event ingestion and processing');
  });

  test('TC-002: Malformed event - Missing required field transaction_id', async ({ page }) => {
    logger.info('Starting test: Malformed event - Missing required field transaction_id');
    const fraudDetectionPage = new FraudDetectionSystemPage(page);
    
    // Step 1: Create a malformed transaction event payload missing required field transaction_id
    const malformedData = {
      account_id: 'ACC-98765',
      card_id: 'CARD-5432',
      merchant: 'Amazon',
      amount: 150.00,
      currency: 'USD',
      timestamp: '2026-08-15T10:30:00Z',
      channel: 'online'
    };
    logger.info('Step 1: Creating malformed payload without transaction_id');
    await fraudDetectionPage.createTransactionPayload(malformedData);
    await expect(fraudDetectionPage.transactionPayloadStatus).toContainText('created');
    
    // Step 2: Publish the malformed transaction event to the fraud detection system
    logger.info('Step 2: Publishing malformed event');
    await fraudDetectionPage.publishTransactionEvent('fraud-detection-queue');
    await expect(fraudDetectionPage.eventPublishStatus).toContainText('published');
    
    // Step 3: Verify the system attempts to validate the event
    logger.info('Step 3: Verifying validation process triggered');
    await fraudDetectionPage.verifyValidationStarted();
    await expect(fraudDetectionPage.validationProcessStatus).toContainText('started');
    
    // Step 4: Verify the event is rejected due to missing required field
    logger.info('Step 4: Verifying event rejection');
    await fraudDetectionPage.verifyEventRejection();
    await expect(fraudDetectionPage.errorCode).toContainText('MISSING_REQUIRED_FIELD');
    await expect(fraudDetectionPage.errorField).toContainText('transaction_id');
    
    // Step 5: Verify appropriate error logging is performed
    logger.info('Step 5: Verifying error logging');
    await fraudDetectionPage.verifyErrorLogging();
    await expect(fraudDetectionPage.errorLogEntry).toBeVisible();
    await expect(fraudDetectionPage.errorType).toContainText('validation_failure');
    await expect(fraudDetectionPage.errorReason).toContainText('missing transaction_id');
    
    // Step 6: Verify the event does not proceed to risk evaluation
    logger.info('Step 6: Verifying event not queued for risk evaluation');
    await fraudDetectionPage.verifyEventNotInRiskQueue();
    await expect(fraudDetectionPage.riskQueueStatus).toContainText('event not present');
    
    logger.info('Test completed: Malformed event - Missing required field transaction_id');
  });

  test('TC-003: Malformed event - Invalid data format for amount field', async ({ page }) => {
    logger.info('Starting test: Malformed event - Invalid data format for amount field');
    const fraudDetectionPage = new FraudDetectionSystemPage(page);
    
    // Step 1: Create a malformed transaction event with invalid data format for amount field
    const malformedData = {
      transaction_id: 'TXN-12345',
      account_id: 'ACC-98765',
      card_id: 'CARD-5432',
      merchant: 'Amazon',
      amount: 'invalid_amount',
      currency: 'USD',
      timestamp: '2026-08-15T10:30:00Z',
      channel: 'online'
    };
    logger.info('Step 1: Creating malformed payload with invalid amount');
    await fraudDetectionPage.createTransactionPayload(malformedData);
    await expect(fraudDetectionPage.transactionPayloadStatus).toContainText('created');
    
    // Step 2: Publish the malformed transaction event to the fraud detection system
    logger.info('Step 2: Publishing malformed event');
    await fraudDetectionPage.publishTransactionEvent('fraud-detection-queue');
    await expect(fraudDetectionPage.eventPublishStatus).toContainText('published');
    
    // Step 3: Verify the system attempts to validate the event
    logger.info('Step 3: Verifying validation process triggered');
    await fraudDetectionPage.verifyValidationStarted();
    await expect(fraudDetectionPage.validationProcessStatus).toContainText('started');
    
    // Step 4: Verify the event is rejected due to invalid data format
    logger.info('Step 4: Verifying event rejection for invalid format');
    await fraudDetectionPage.verifyEventRejection();
    await expect(fraudDetectionPage.errorCode).toContainText('INVALID_DATA_FORMAT');
    await expect(fraudDetectionPage.errorField).toContainText('amount');
    
    // Step 5: Verify appropriate error logging is performed
    logger.info('Step 5: Verifying error logging');
    await fraudDetectionPage.verifyErrorLogging();
    await expect(fraudDetectionPage.errorLogEntry).toBeVisible();
    await expect(fraudDetectionPage.errorType).toContainText('validation_failure');
    await expect(fraudDetectionPage.errorReason).toContainText('invalid amount format');
    
    // Step 6: Verify the event does not proceed to risk evaluation
    logger.info('Step 6: Verifying event not queued for risk evaluation');
    await fraudDetectionPage.verifyEventNotInRiskQueue();
    await expect(fraudDetectionPage.riskQueueStatus).toContainText('event not present');
    
    logger.info('Test completed: Malformed event - Invalid data format for amount field');
  });

  test('TC-004: Malformed event - Null value for critical field card_id', async ({ page }) => {
    logger.info('Starting test: Malformed event - Null value for critical field card_id');
    const fraudDetectionPage = new FraudDetectionSystemPage(page);
    
    // Step 1: Create a malformed transaction event with null value for critical field card_id
    const malformedData = {
      transaction_id: 'TXN-12345',
      account_id: 'ACC-98765',
      card_id: null,
      merchant: 'Amazon',
      amount: 150.00,
      currency: 'USD',
      timestamp: '2026-08-15T10:30:00Z',
      channel: 'online'
    };
    logger.info('Step 1: Creating malformed payload with null card_id');
    await fraudDetectionPage.createTransactionPayload(malformedData);
    await expect(fraudDetectionPage.transactionPayloadStatus).toContainText('created');
    
    // Step 2: Publish the malformed transaction event to the fraud detection system
    logger.info('Step 2: Publishing malformed event');
    await fraudDetectionPage.publishTransactionEvent('fraud-detection-queue');
    await expect(fraudDetectionPage.eventPublishStatus).toContainText('published');
    
    // Step 3: Verify the system attempts to validate the event
    logger.info('Step 3: Verifying validation process triggered');
    await fraudDetectionPage.verifyValidationStarted();
    await expect(fraudDetectionPage.validationProcessStatus).toContainText('started');
    
    // Step 4: Verify the event is rejected due to null critical field
    logger.info('Step 4: Verifying event rejection for null field');
    await fraudDetectionPage.verifyEventRejection();
    await expect(fraudDetectionPage.errorCode).toContainText('NULL_REQUIRED_FIELD');
    await expect(fraudDetectionPage.errorField).toContainText('card_id');
    
    // Step 5: Verify appropriate error logging is performed
    logger.info('Step 5: Verifying error logging');
    await fraudDetectionPage.verifyErrorLogging();
    await expect(fraudDetectionPage.errorLogEntry).toBeVisible();
    await expect(fraudDetectionPage.errorType).toContainText('validation_failure');
    await expect(fraudDetectionPage.errorReason).toContainText('null card_id');
    
    // Step 6: Verify the event does not proceed to risk evaluation
    logger.info('Step 6: Verifying event not queued for risk evaluation');
    await fraudDetectionPage.verifyEventNotInRiskQueue();
    await expect(fraudDetectionPage.riskQueueStatus).toContainText('event not present');
    
    logger.info('Test completed: Malformed event - Null value for critical field card_id');
  });

  test('TC-005: Idempotency - Duplicate transaction event handling', async ({ page }) => {
    logger.info('Starting test: Idempotency - Duplicate transaction event handling');
    const fraudDetectionPage = new FraudDetectionSystemPage(page);
    
    // Step 1: Create a valid transaction event with unique transaction_id
    const transactionData = {
      transaction_id: 'TXN-99999',
      account_id: 'ACC-11111',
      card_id: 'CARD-2222',
      merchant: 'Walmart',
      amount: 200.00,
      currency: 'USD',
      timestamp: '2026-08-15T14:00:00Z',
      channel: 'pos'
    };
    logger.info('Step 1: Creating valid transaction event');
    await fraudDetectionPage.createTransactionPayload(transactionData);
    await expect(fraudDetectionPage.transactionPayloadStatus).toContainText('created');
    
    // Step 2: Publish the transaction event to the fraud detection system for the first time
    logger.info('Step 2: Publishing first event');
    await fraudDetectionPage.publishTransactionEvent('fraud-detection-queue');
    await expect(fraudDetectionPage.eventPublishStatus).toContainText('successfully published');
    
    // Step 3: Verify the system processes the event and creates a fraud case/alert record
    logger.info('Step 3: Verifying fraud case creation');
    await fraudDetectionPage.verifyFraudCaseCreated('TXN-99999');
    await expect(fraudDetectionPage.fraudCaseId).toContainText('CASE-001');
    await expect(fraudDetectionPage.fraudCaseStatus).toContainText('created');
    
    // Step 4: Publish the exact same transaction event (duplicate) to the fraud detection system
    logger.info('Step 4: Publishing duplicate event');
    await fraudDetectionPage.publishTransactionEvent('fraud-detection-queue');
    await expect(fraudDetectionPage.eventPublishStatus).toContainText('published');
    
    // Step 5: Verify the system performs idempotency check on the duplicate event
    logger.info('Step 5: Verifying idempotency check');
    await fraudDetectionPage.verifyIdempotencyCheck('TXN-99999');
    await expect(fraudDetectionPage.idempotencyCheckResult).toContainText('duplicate detected');
    
    // Step 6: Verify no new fraud case or alert is created for the duplicate event
    logger.info('Step 6: Verifying no duplicate fraud case created');
    await fraudDetectionPage.verifyFraudCaseCount('TXN-99999', 1);
    await expect(fraudDetectionPage.fraudCaseId).toContainText('CASE-001');
    
    // Step 7: Verify audit trail logs the duplicate event detection
    logger.info('Step 7: Verifying audit trail for duplicate detection');
    await fraudDetectionPage.checkDuplicateAuditLog('TXN-99999');
    await expect(fraudDetectionPage.auditLogEntry).toBeVisible();
    await expect(fraudDetectionPage.auditLogAction).toContainText('ignored');
    
    logger.info('Test completed: Idempotency - Duplicate transaction event handling');
  });

  test('TC-006: Idempotency - Multiple unique transactions processed independently', async ({ page }) => {
    logger.info('Starting test: Idempotency - Multiple unique transactions processed independently');
    const fraudDetectionPage = new FraudDetectionSystemPage(page);
    
    // Step 1: Create a valid transaction event with transaction_id: TXN-AAA01
    const firstTransactionData = {
      transaction_id: 'TXN-AAA01',
      account_id: 'ACC-11111',
      card_id: 'CARD-2222',
      merchant: 'Target',
      amount: 100.00,
      currency: 'USD',
      timestamp: '2026-08-15T15:00:00Z',
      channel: 'online'
    };
    logger.info('Step 1: Creating first valid transaction event');
    await fraudDetectionPage.createTransactionPayload(firstTransactionData);
    await expect(fraudDetectionPage.transactionPayloadStatus).toContainText('created');
    
    // Step 2: Publish the first transaction event to the fraud detection system
    logger.info('Step 2: Publishing first event');
    await fraudDetectionPage.publishTransactionEvent('fraud-detection-queue');
    await expect(fraudDetectionPage.eventPublishStatus).toContainText('successfully published');
    
    // Step 3: Verify the system creates a fraud case for the first transaction
    logger.info('Step 3: Verifying fraud case creation for first transaction');
    await fraudDetectionPage.verifyFraudCaseCreated('TXN-AAA01');
    await expect(fraudDetectionPage.fraudCaseId).toContainText('CASE-AAA01');
    await expect(fraudDetectionPage.fraudCaseStatus).toContainText('created');
    
    // Step 4: Create a second valid transaction event with different transaction_id: TXN-BBB02
    const secondTransactionData = {
      transaction_id: 'TXN-BBB02',
      account_id: 'ACC-11111',
      card_id: 'CARD-2222',
      merchant: 'Target',
      amount: 100.00,
      currency: 'USD',
      timestamp: '2026-08-15T15:05:00Z',
      channel: 'online'
    };
    logger.info('Step 4: Creating second valid transaction event');
    await fraudDetectionPage.createTransactionPayload(secondTransactionData);
    await expect(fraudDetectionPage.transactionPayloadStatus).toContainText('created');
    
    // Step 5: Publish the second transaction event to the fraud detection system
    logger.info('Step 5: Publishing second event');
    await fraudDetectionPage.publishTransactionEvent('fraud-detection-queue');
    await expect(fraudDetectionPage.eventPublishStatus).toContainText('successfully published');
    
    // Step 6: Verify the system performs idempotency check and identifies unique transaction_id
    logger.info('Step 6: Verifying idempotency check for unique transaction');
    await fraudDetectionPage.verifyIdempotencyCheck('TXN-BBB02');
    await expect(fraudDetectionPage.idempotencyCheckResult).toContainText('unique transaction detected');
    
    // Step 7: Verify a new fraud case is created for the second transaction
    logger.info('Step 7: Verifying fraud case creation for second transaction');
    await fraudDetectionPage.verifyFraudCaseCreated('TXN-BBB02');
    await expect(fraudDetectionPage.fraudCaseId).toContainText('CASE-BBB02');
    await expect(fraudDetectionPage.fraudCaseStatus).toContainText('created');
    
    // Step 8: Verify both fraud cases exist independently in the system
    logger.info('Step 8: Verifying both fraud cases exist independently');
    await fraudDetectionPage.verifyMultipleFraudCases(['CASE-AAA01', 'CASE-BBB02']);
    await expect(fraudDetectionPage.totalFraudCases).toContainText('2');
    
    logger.info('Test completed: Idempotency - Multiple unique transactions processed independently');
  });

});
