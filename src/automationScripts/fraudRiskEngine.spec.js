const { test, expect } = require('@playwright/test');
const { FraudRiskEnginePage } = require('./pages/fraudRiskEngine.page');
const logger = require('../../utils/logger');

test.describe('Fraud Risk Engine - Valid Transaction Processing', () => {
  test('TC-1700: Process valid credit card transaction and verify risk score calculation', async ({ page }) => {
    logger.info('Starting test case TC-1700: Valid transaction processing');
    const fraudPage = new FraudRiskEnginePage(page);
    
    // Step 1: Prepare valid transaction event
    const transactionData = {
      transaction_id: 'TXN123456',
      account_id: 'ACC789',
      card_id: 'CARD456',
      merchant: 'Amazon',
      amount: 150.00,
      currency: 'USD',
      timestamp: '2024-08-15T10:30:00Z'
    };
    logger.info('Transaction event prepared with all required fields');
    
    // Step 2: Send transaction to fraud-risk engine
    await fraudPage.submitTransactionToFraudEngine(transactionData);
    await expect(fraudPage.apiResponseStatus).toHaveText('200');
    logger.info('Transaction successfully received by fraud-risk engine');
    
    // Step 3: Verify risk signals processing
    const riskSignals = {
      amount: 150.00,
      merchant_category: 'retail',
      geo_consistency: true,
      velocity: 'normal'
    };
    await fraudPage.verifyRiskSignalsProcessed(riskSignals);
    logger.info('Risk signals processed successfully');
    
    // Step 4: Verify risk score and response time
    await fraudPage.verifyRiskScoreInRange(0, 100);
    await fraudPage.verifyResponseTimeSLA(500);
    logger.info('Risk score calculated within valid range and SLA met');
  });
});

test.describe('Fraud Risk Engine - Invalid Transaction Handling', () => {
  test('TC-1701: Handle transaction with missing transaction_id field', async ({ page }) => {
    logger.info('Starting test case TC-1701: Missing transaction_id validation');
    const fraudPage = new FraudRiskEnginePage(page);
    
    // Step 1: Prepare transaction with missing transaction_id
    const invalidTransactionData = {
      transaction_id: null,
      account_id: 'ACC789',
      card_id: 'CARD456',
      merchant: 'Amazon',
      amount: 150.00,
      currency: 'USD',
      timestamp: '2024-08-15T10:30:00Z'
    };
    logger.info('Transaction event created without transaction_id');
    
    // Step 2: Send invalid transaction to fraud-risk engine
    await fraudPage.submitTransactionToFraudEngine(invalidTransactionData);
    logger.info('Invalid transaction sent to fraud-risk engine');
    
    // Step 3: Verify validation error
    await fraudPage.verifyValidationError('MISSING_REQUIRED_FIELD', 'transaction_id');
    logger.info('System rejected invalid transaction with validation error');
    
    // Step 4: Verify error logging and no risk score generation
    await fraudPage.verifyErrorLogged('VALIDATION_ERROR', 'transaction_id');
    await fraudPage.verifyNoRiskScoreGenerated();
    logger.info('Validation error logged and no risk score generated');
  });
  
  test('TC-1702: Handle transaction with invalid amount format', async ({ page }) => {
    logger.info('Starting test case TC-1702: Invalid amount format validation');
    const fraudPage = new FraudRiskEnginePage(page);
    
    // Step 1: Prepare transaction with invalid amount
    const invalidTransactionData = {
      transaction_id: 'TXN123456',
      account_id: 'ACC789',
      card_id: 'CARD456',
      merchant: 'Amazon',
      amount: 'invalid_amount',
      currency: 'USD',
      timestamp: '2024-08-15T10:30:00Z'
    };
    logger.info('Transaction event created with malformed amount field');
    
    // Step 2: Send invalid transaction to fraud-risk engine
    await fraudPage.submitTransactionToFraudEngine(invalidTransactionData);
    logger.info('Invalid transaction sent to fraud-risk engine');
    
    // Step 3: Verify validation error
    await fraudPage.verifyValidationError('INVALID_FIELD_FORMAT', 'amount');
    logger.info('System rejected invalid transaction with validation error');
    
    // Step 4: Verify error logging with provided value
    await fraudPage.verifyErrorLoggedWithValue('VALIDATION_ERROR', 'amount', 'invalid_amount');
    await fraudPage.verifyNoRiskScoreGenerated();
    logger.info('Validation error logged with details and no risk score generated');
  });
});

test.describe('Fraud Risk Engine - Unavailability Handling', () => {
  test('TC-1703: Handle fraud-risk engine unavailability with fail-safe policy', async ({ page }) => {
    logger.info('Starting test case TC-1703: Fraud engine unavailability handling');
    const fraudPage = new FraudRiskEnginePage(page);
    
    // Step 1: Prepare valid transaction
    const transactionData = {
      transaction_id: 'TXN789012',
      account_id: 'ACC456',
      card_id: 'CARD789',
      merchant: 'Walmart',
      amount: 200.00,
      currency: 'USD',
      timestamp: '2024-08-15T11:00:00Z',
      transaction_type: 'retail_purchase'
    };
    logger.info('Valid transaction event prepared');
    
    // Step 2: Simulate fraud engine unavailability
    await fraudPage.simulateFraudEngineUnavailability();
    await fraudPage.submitTransactionToFraudEngine(transactionData);
    logger.info('Fraud-risk engine unavailability simulated');
    
    // Step 3: Verify fail-safe policy applied
    await fraudPage.verifyFailSafePolicyApplied('retail_purchase', 'fail-open');
    logger.info('Fail-safe policy applied based on transaction type');
    
    // Step 4: Verify audit trail logging
    await fraudPage.verifyAuditTrailLogged('TXN789012', 'FRAUD_ENGINE_UNAVAILABLE', 'fail-open');
    logger.info('Unavailability condition logged in audit trail');
    
    // Step 5: Verify transaction not blocked indefinitely
    await fraudPage.verifyTransactionProcessed('TXN789012');
    logger.info('Transaction continued processing without indefinite blocking');
  });
});
