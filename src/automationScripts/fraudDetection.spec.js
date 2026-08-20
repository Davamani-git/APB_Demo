const { test, expect } = require('@playwright/test');
const { FraudDetectionPage } = require('./pages/fraudDetection.page');
const logger = require('../../utils/logger');

test.describe('Fraud Detection System - Risk Evaluation and Alert Generation', () => {

  test('TC-001: QE-4501 TS-001 TC-001 - Multi-signal high-risk transaction evaluation', async ({ page }) => {
    logger.info('Starting test: Multi-signal high-risk transaction evaluation');
    const fraudDetectionPage = new FraudDetectionPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-001',
      account_id: 'ACC-123',
      card_id: 'CARD-456',
      merchant: 'UnknownMerchant',
      amount: 5000,
      currency: 'USD',
      timestamp: '2026-08-19T10:00:00Z',
      channel: 'online',
      location: 'Russia',
      previous_location: 'USA',
      velocity: '3 txns in 5 min'
    };
    
    logger.info('Step 1: Preparing transaction event with multiple risk signals');
    await fraudDetectionPage.prepareTransactionEvent(transactionData);
    await fraudDetectionPage.verifyTransactionEventPrepared(transactionData.transaction_id);
    
    logger.info('Step 2: Publishing transaction event to fraud-risk engine');
    await fraudDetectionPage.publishTransactionEvent(transactionData.transaction_id);
    await fraudDetectionPage.verifyEventReceivedByEngine(transactionData.transaction_id);
    
    logger.info('Step 3: Triggering risk evaluation process');
    await fraudDetectionPage.triggerRiskEvaluation(transactionData.transaction_id);
    await fraudDetectionPage.verifyRiskEvaluationTriggered(transactionData.transaction_id);
    
    logger.info('Step 4: Recording timestamp and verifying risk score and band');
    const evaluationResult = await fraudDetectionPage.getEvaluationResult(transactionData.transaction_id);
    await fraudDetectionPage.verifyRiskScore(evaluationResult, 75, 'gte');
    await fraudDetectionPage.verifyRiskBand(evaluationResult, 'High');
    await fraudDetectionPage.verifyEvaluationLatency(evaluationResult, 500);
    
    logger.info('Step 5: Verifying risk decision object contains all required fields');
    await fraudDetectionPage.verifyRiskDecisionFields(evaluationResult, [
      'decision_id',
      'transaction_id',
      'risk_score',
      'risk_band',
      'model_version',
      'decision',
      'timestamp'
    ]);
    
    logger.info('Test completed: Multi-signal high-risk transaction evaluation');
  });

  test('TC-002: QE-4501 TS-002 TC-001 - Fraud engine unavailability fail-safe handling', async ({ page }) => {
    logger.info('Starting test: Fraud engine unavailability fail-safe handling');
    const fraudDetectionPage = new FraudDetectionPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-002',
      account_id: 'ACC-456',
      card_id: 'CARD-789',
      merchant: 'TestMerchant',
      amount: 100,
      currency: 'USD',
      timestamp: '2026-08-19T11:00:00Z',
      channel: 'pos'
    };
    
    logger.info('Step 1: Preparing valid transaction event');
    await fraudDetectionPage.prepareTransactionEvent(transactionData);
    await fraudDetectionPage.verifyTransactionEventPrepared(transactionData.transaction_id);
    
    logger.info('Step 2: Simulating fraud-risk engine unavailability');
    await fraudDetectionPage.simulateEngineUnavailability();
    await fraudDetectionPage.verifyEngineUnavailable();
    
    logger.info('Step 3: Publishing transaction event to fraud detection system');
    await fraudDetectionPage.publishTransactionEvent(transactionData.transaction_id);
    await fraudDetectionPage.verifyEventReceivedBySystem(transactionData.transaction_id);
    
    logger.info('Step 4: Verifying fail-safe policy application');
    await fraudDetectionPage.verifyFailSafePolicyApplied(transactionData.transaction_id, 'pos', 'approve');
    
    logger.info('Step 5: Checking system logs for engine unavailability');
    await fraudDetectionPage.verifySystemLog('fraud_engine_unavailable', transactionData.transaction_id);
    
    logger.info('Test completed: Fraud engine unavailability fail-safe handling');
  });

  test('TC-003: QE-4501 TS-002 TC-002 - Fraud engine timeout fail-safe handling', async ({ page }) => {
    logger.info('Starting test: Fraud engine timeout fail-safe handling');
    const fraudDetectionPage = new FraudDetectionPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-003',
      account_id: 'ACC-789',
      card_id: 'CARD-012',
      merchant: 'OnlineMerchant',
      amount: 500,
      currency: 'USD',
      timestamp: '2026-08-19T12:00:00Z',
      channel: 'online'
    };
    
    logger.info('Step 1: Preparing valid transaction event');
    await fraudDetectionPage.prepareTransactionEvent(transactionData);
    await fraudDetectionPage.verifyTransactionEventPrepared(transactionData.transaction_id);
    
    logger.info('Step 2: Configuring fraud-risk engine timeout');
    await fraudDetectionPage.configureEngineTimeout(2000, 3000);
    await fraudDetectionPage.verifyEngineTimeoutConfigured(3000);
    
    logger.info('Step 3: Publishing transaction event');
    await fraudDetectionPage.publishTransactionEvent(transactionData.transaction_id);
    await fraudDetectionPage.verifyEventSentToEngine(transactionData.transaction_id);
    
    logger.info('Step 4: Verifying timeout detection and fail-safe policy');
    await fraudDetectionPage.verifyTimeoutDetected(transactionData.transaction_id);
    await fraudDetectionPage.verifyFailSafePolicyApplied(transactionData.transaction_id, 'online', 'decline');
    
    logger.info('Step 5: Checking system logs for timeout condition');
    await fraudDetectionPage.verifySystemLogWithAction('fraud_engine_timeout', transactionData.transaction_id, 'decline');
    
    logger.info('Test completed: Fraud engine timeout fail-safe handling');
  });

  test('TC-004: QE-4501 TS-003 TC-001 - Low-risk transaction approval without alert', async ({ page }) => {
    logger.info('Starting test: Low-risk transaction approval without alert');
    const fraudDetectionPage = new FraudDetectionPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-004',
      account_id: 'ACC-111',
      card_id: 'CARD-222',
      merchant: 'LocalGroceryStore',
      merchant_category: 'grocery',
      amount: 75,
      currency: 'USD',
      timestamp: '2026-08-19T13:00:00Z',
      channel: 'pos',
      location: 'customer_home_city',
      customer_avg_transaction: 80
    };
    
    logger.info('Step 1: Preparing low-risk transaction event');
    await fraudDetectionPage.prepareTransactionEvent(transactionData);
    await fraudDetectionPage.verifyTransactionEventPrepared(transactionData.transaction_id);
    
    logger.info('Step 2: Publishing transaction event to fraud-risk engine');
    await fraudDetectionPage.publishTransactionEvent(transactionData.transaction_id);
    await fraudDetectionPage.verifyEventReceivedByEngine(transactionData.transaction_id);
    
    logger.info('Step 3: Triggering risk evaluation process');
    await fraudDetectionPage.triggerRiskEvaluation(transactionData.transaction_id);
    await fraudDetectionPage.verifyRiskEvaluationAgainstHistory(transactionData.transaction_id);
    
    logger.info('Step 4: Verifying low risk score');
    const evaluationResult = await fraudDetectionPage.getEvaluationResult(transactionData.transaction_id);
    await fraudDetectionPage.verifyRiskScore(evaluationResult, 30, 'lte');
    await fraudDetectionPage.verifyRiskBand(evaluationResult, 'Low');
    
    logger.info('Step 5: Verifying transaction approved without fraud alert');
    await fraudDetectionPage.verifyTransactionDecision(transactionData.transaction_id, 'approve');
    await fraudDetectionPage.verifyNoAlertCreated(transactionData.transaction_id);
    
    logger.info('Test completed: Low-risk transaction approval without alert');
  });

});

test.describe('Fraud Detection System - Transaction Ingestion', () => {

  test('TC-005: QE-4500 TS-001 TC-001 - Valid transaction event ingestion and queuing', async ({ page }) => {
    logger.info('Starting test: Valid transaction event ingestion and queuing');
    const fraudDetectionPage = new FraudDetectionPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-005',
      account_id: 'ACC-222',
      card_id: 'CARD-333',
      merchant: 'OnlineRetailer',
      amount: 250,
      currency: 'USD',
      timestamp: '2026-08-19T14:00:00Z',
      channel: 'online'
    };
    
    logger.info('Step 1: Preparing valid transaction event with all required attributes');
    await fraudDetectionPage.prepareTransactionEvent(transactionData);
    await fraudDetectionPage.verifyTransactionEventComplete(transactionData);
    
    logger.info('Step 2: Publishing transaction event from authorization platform');
    await fraudDetectionPage.publishTransactionFromAuthPlatform(transactionData.transaction_id);
    await fraudDetectionPage.verifyEventPublished(transactionData.transaction_id);
    
    logger.info('Step 3: Verifying fraud detection system receives the event');
    await fraudDetectionPage.verifySystemReceivesEvent(transactionData.transaction_id);
    await fraudDetectionPage.verifySystemAcknowledgesReceipt(transactionData.transaction_id);
    
    logger.info('Step 4: Verifying transaction queued for risk evaluation');
    await fraudDetectionPage.verifyTransactionQueued(transactionData.transaction_id);
    await fraudDetectionPage.verifyQueueStatus(transactionData.transaction_id, 'queued');
    
    logger.info('Step 5: Verifying all transaction attributes intact in queued record');
    await fraudDetectionPage.verifyQueuedTransactionAttributes(transactionData);
    
    logger.info('Test completed: Valid transaction event ingestion and queuing');
  });

  test('TC-006: QE-4500 TS-002 TC-001 - Idempotency handling for duplicate transaction events', async ({ page }) => {
    logger.info('Starting test: Idempotency handling for duplicate transaction events');
    const fraudDetectionPage = new FraudDetectionPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-006',
      account_id: 'ACC-333',
      card_id: 'CARD-444',
      merchant: 'TravelAgency',
      amount: 1500,
      currency: 'USD',
      timestamp: '2026-08-19T15:00:00Z',
      channel: 'online'
    };
    
    logger.info('Step 1: Preparing valid transaction event with unique transaction_id');
    await fraudDetectionPage.prepareTransactionEvent(transactionData);
    await fraudDetectionPage.verifyTransactionEventComplete(transactionData);
    
    logger.info('Step 2: Publishing transaction event from authorization platform');
    await fraudDetectionPage.publishTransactionFromAuthPlatform(transactionData.transaction_id);
    await fraudDetectionPage.verifyEventPublishedAndReceived(transactionData.transaction_id);
    
    logger.info('Step 3: Verifying canonical transaction record created');
    await fraudDetectionPage.verifyTransactionQueued(transactionData.transaction_id);
    await fraudDetectionPage.verifyCanonicalRecordCreated(transactionData.transaction_id);
    
    logger.info('Step 4: Publishing duplicate transaction events');
    await fraudDetectionPage.publishDuplicateEvents(transactionData.transaction_id, 3);
    await fraudDetectionPage.verifyDuplicateEventsReceived(transactionData.transaction_id);
    
    logger.info('Step 5: Verifying idempotency prevents duplicate fraud cases');
    await fraudDetectionPage.verifyTransactionRecordCount(transactionData.transaction_id, 1);
    await fraudDetectionPage.verifyNoDuplicateCasesCreated(transactionData.transaction_id);
    
    logger.info('Step 6: Checking system logs for idempotency handling');
    await fraudDetectionPage.verifyIdempotencyLog('duplicate_transaction_ignored', transactionData.transaction_id);
    
    logger.info('Test completed: Idempotency handling for duplicate transaction events');
  });

});

test.describe('Fraud Detection System - Malformed Event Validation', () => {

  test('TC-007: QE-4500 TS-003 TC-001 - Reject malformed event missing transaction_id', async ({ page }) => {
    logger.info('Starting test: Reject malformed event missing transaction_id');
    const fraudDetectionPage = new FraudDetectionPage(page);
    
    const malformedData = {
      account_id: 'ACC-444',
      card_id: 'CARD-555',
      merchant: 'Restaurant',
      amount: 85,
      currency: 'USD',
      timestamp: '2026-08-19T16:00:00Z',
      channel: 'pos'
    };
    
    logger.info('Step 1: Preparing malformed transaction event without transaction_id');
    await fraudDetectionPage.prepareMalformedEvent(malformedData);
    await fraudDetectionPage.verifyEventMissingField('transaction_id');
    
    logger.info('Step 2: Publishing malformed transaction event');
    await fraudDetectionPage.publishMalformedEvent(malformedData);
    await fraudDetectionPage.verifyMalformedEventSent();
    
    logger.info('Step 3: Verifying fraud detection system attempts to ingest event');
    await fraudDetectionPage.verifySystemAttemptsIngestion();
    await fraudDetectionPage.verifySystemValidatesEvent();
    
    logger.info('Step 4: Verifying event rejected due to missing transaction_id');
    await fraudDetectionPage.verifyEventRejected('missing_mandatory_field: transaction_id');
    
    logger.info('Step 5: Verifying no transaction queued for risk evaluation');
    await fraudDetectionPage.verifyNoTransactionQueued(malformedData.account_id);
    
    logger.info('Step 6: Checking system logs for error');
    await fraudDetectionPage.verifyErrorLog('event_rejected', 'missing_transaction_id', malformedData.account_id);
    
    logger.info('Test completed: Reject malformed event missing transaction_id');
  });

  test('TC-008: QE-4500 TS-003 TC-002 - Reject malformed event missing account_id', async ({ page }) => {
    logger.info('Starting test: Reject malformed event missing account_id');
    const fraudDetectionPage = new FraudDetectionPage(page);
    
    const malformedData = {
      transaction_id: 'TXN-007',
      card_id: 'CARD-666',
      merchant: 'GasStation',
      amount: 45,
      currency: 'USD',
      timestamp: '2026-08-19T17:00:00Z',
      channel: 'pos'
    };
    
    logger.info('Step 1: Preparing malformed transaction event without account_id');
    await fraudDetectionPage.prepareMalformedEvent(malformedData);
    await fraudDetectionPage.verifyEventMissingField('account_id');
    
    logger.info('Step 2: Publishing malformed transaction event');
    await fraudDetectionPage.publishMalformedEvent(malformedData);
    await fraudDetectionPage.verifyMalformedEventSent();
    
    logger.info('Step 3: Verifying fraud detection system attempts to ingest event');
    await fraudDetectionPage.verifySystemAttemptsIngestion();
    await fraudDetectionPage.verifySystemValidatesEvent();
    
    logger.info('Step 4: Verifying event rejected due to missing account_id');
    await fraudDetectionPage.verifyEventRejected('missing_mandatory_field: account_id');
    
    logger.info('Step 5: Verifying no transaction queued for risk evaluation');
    await fraudDetectionPage.verifyNoTransactionQueuedByTransactionId(malformedData.transaction_id);
    
    logger.info('Step 6: Checking system logs for error');
    await fraudDetectionPage.verifyErrorLog('event_rejected', 'missing_account_id', malformedData.transaction_id);
    
    logger.info('Test completed: Reject malformed event missing account_id');
  });

  test('TC-009: QE-4500 TS-003 TC-003 - Reject malformed event with multiple missing mandatory fields', async ({ page }) => {
    logger.info('Starting test: Reject malformed event with multiple missing mandatory fields');
    const fraudDetectionPage = new FraudDetectionPage(page);
    
    const malformedData = {
      card_id: 'CARD-777',
      merchant: 'Pharmacy',
      currency: 'USD',
      timestamp: '2026-08-19T18:00:00Z',
      channel: 'pos'
    };
    
    const missingFields = ['transaction_id', 'account_id', 'amount'];
    
    logger.info('Step 1: Preparing malformed event with multiple missing fields');
    await fraudDetectionPage.prepareMalformedEvent(malformedData);
    await fraudDetectionPage.verifyEventMissingMultipleFields(missingFields);
    
    logger.info('Step 2: Publishing malformed transaction event');
    await fraudDetectionPage.publishMalformedEvent(malformedData);
    await fraudDetectionPage.verifyMalformedEventSent();
    
    logger.info('Step 3: Verifying fraud detection system attempts to ingest event');
    await fraudDetectionPage.verifySystemAttemptsIngestion();
    await fraudDetectionPage.verifySystemValidatesEvent();
    
    logger.info('Step 4: Verifying event rejected due to multiple missing fields');
    await fraudDetectionPage.verifyEventRejectedMultipleFields(missingFields);
    
    logger.info('Step 5: Verifying no transaction queued for risk evaluation');
    await fraudDetectionPage.verifyNoTransactionQueuedForMalformedEvent();
    
    logger.info('Step 6: Checking system logs for error with all missing fields');
    await fraudDetectionPage.verifyErrorLogMultipleFields('event_rejected', missingFields);
    
    logger.info('Test completed: Reject malformed event with multiple missing mandatory fields');
  });

});