const { test, expect } = require('@playwright/test');
const { FraudAlertSystemPage } = require('./pages/fraudAlertSystem.page');
const { FraudAlertAdminPage } = require('./pages/fraudAlertAdmin.page');

test.describe('Fraud Alert System - Transaction Processing and Risk Evaluation', () => {

  test('TC-3106: Verify fraud-risk engine processes eligible transaction and generates risk score with audit trail', async ({ page }) => {
    const fraudAlertPage = new FraudAlertSystemPage(page);
    
    // Step 1: Launch the fraud alert system and ensure the authorization platform is connected
    await fraudAlertPage.navigate('https://fraud-alert.example.com');
    await fraudAlertPage.verifySystemOperational();
    
    // Step 2: Submit an eligible card transaction event with complete transaction details
    const transactionData = {
      transaction_id: 'TXN123456',
      amount: '250.00',
      currency: 'USD',
      merchant: 'Amazon.com',
      timestamp: '2026-08-15T14:30:00Z',
      card_id: 'CARD789'
    };
    await fraudAlertPage.submitTransaction(transactionData);
    await fraudAlertPage.verifyTransactionAccepted();
    
    // Step 3: Trigger the fraud-risk engine to process the transaction
    await fraudAlertPage.triggerFraudRiskEngine();
    await fraudAlertPage.verifyFraudRiskEngineEvaluated();
    
    // Step 4: Verify that a risk score, risk decision, and model version are generated
    await fraudAlertPage.verifyRiskScoreGenerated();
    await fraudAlertPage.verifyRiskDecisionGenerated();
    await fraudAlertPage.verifyModelVersionGenerated();
    
    // Step 5: Check the audit trail for the transaction correlation record
    const expectedAuditFields = {
      transaction_id: 'TXN123456',
      risk_score: '45',
      decision: 'Low',
      model_version: 'v2.3'
    };
    await fraudAlertPage.verifyAuditTrailRecord(expectedAuditFields);
  });

  test('TC-3107: Verify system handles incomplete transaction with missing merchant field and applies fail-safe policy', async ({ page }) => {
    const fraudAlertPage = new FraudAlertSystemPage(page);
    
    // Step 1: Launch the fraud alert system and ensure the authorization platform is connected
    await fraudAlertPage.navigate('https://fraud-alert.example.com');
    await fraudAlertPage.verifySystemOperational();
    
    // Step 2: Submit a transaction event with missing merchant information
    const transactionData = {
      transaction_id: 'TXN789012',
      amount: '150.00',
      currency: 'USD',
      merchant: null,
      timestamp: '2026-08-15T15:00:00Z',
      card_id: 'CARD456'
    };
    await fraudAlertPage.submitTransaction(transactionData);
    await fraudAlertPage.verifyTransactionReceived();
    
    // Step 3: Trigger the fraud-risk engine to evaluate the transaction
    await fraudAlertPage.triggerFraudRiskEngine();
    await fraudAlertPage.verifyFraudRiskEngineAttemptedEvaluation();
    
    // Step 4: Verify that the system logs an error for the missing merchant field
    await fraudAlertPage.verifyErrorLogForMissingField('merchant', 'TXN789012');
    
    // Step 5: Check that the failure is recorded in the audit trail
    const expectedAuditFields = {
      transaction_id: 'TXN789012',
      status: 'failed',
      error: 'missing_merchant'
    };
    await fraudAlertPage.verifyAuditTrailRecord(expectedAuditFields);
    
    // Step 6: Verify that the predefined fail-safe policy for incomplete transactions is applied
    await fraudAlertPage.verifyFailSafePolicyApplied();
  });

  test('TC-3108: Verify fail-safe policy when fraud-risk engine is unavailable', async ({ page }) => {
    const fraudAlertPage = new FraudAlertSystemPage(page);
    
    // Step 1: Launch the fraud alert system
    await fraudAlertPage.navigate('https://fraud-alert.example.com');
    await fraudAlertPage.verifySystemOperational();
    
    // Step 2: Simulate fraud-risk engine service unavailability or timeout
    await fraudAlertPage.simulateEngineUnavailability();
    await fraudAlertPage.verifyEngineUnavailable();
    
    // Step 3: Submit an eligible transaction for risk scoring
    const transactionData = {
      transaction_id: 'TXN345678',
      amount: '500.00',
      currency: 'USD',
      merchant: 'BestBuy.com',
      timestamp: '2026-08-15T16:00:00Z',
      card_id: 'CARD123'
    };
    await fraudAlertPage.submitTransaction(transactionData);
    
    // Step 4: Verify that the system detects the fraud-risk engine unavailability
    await fraudAlertPage.verifyEngineUnavailabilityDetected('TXN345678');
    
    // Step 5: Verify that the configured fail-safe policy is applied based on transaction type
    await fraudAlertPage.verifyFailSafePolicyAppliedByTransactionType('card-present', 'fail-open');
    
    // Step 6: Verify that the engine unavailability event is recorded in the audit trail
    const expectedAuditFields = {
      transaction_id: 'TXN345678',
      event: 'engine_unavailable',
      policy_applied: 'fail-open'
    };
    await fraudAlertPage.verifyAuditTrailRecord(expectedAuditFields);
    
    // Step 7: Verify that legitimate transaction processing is not blocked indefinitely
    await fraudAlertPage.verifyTransactionProcessed('TXN345678');
  });

  test('TC-3109: Verify fail-closed policy for high-risk transaction when fraud-risk engine times out', async ({ page }) => {
    const fraudAlertPage = new FraudAlertSystemPage(page);
    
    // Step 1: Launch the fraud alert system
    await fraudAlertPage.navigate('https://fraud-alert.example.com');
    await fraudAlertPage.verifySystemOperational();
    
    // Step 2: Simulate fraud-risk engine timeout condition
    await fraudAlertPage.simulateEngineTimeout(5);
    await fraudAlertPage.verifyEngineTimeout();
    
    // Step 3: Submit a high-risk transaction type for risk scoring
    const transactionData = {
      transaction_id: 'TXN999888',
      amount: '2500.00',
      currency: 'EUR',
      merchant: 'OnlineStore.eu',
      timestamp: '2026-08-15T17:00:00Z',
      card_id: 'CARD999',
      transaction_type: 'card-not-present-international'
    };
    await fraudAlertPage.submitTransaction(transactionData);
    
    // Step 4: Verify that the system detects the fraud-risk engine timeout
    await fraudAlertPage.verifyEngineTimeoutDetected('TXN999888');
    
    // Step 5: Verify that the fail-closed policy is applied for the high-risk transaction type
    await fraudAlertPage.verifyFailClosedPolicyApplied('card-not-present-international');
    
    // Step 6: Verify that the timeout event and policy action are recorded in the audit trail
    const expectedAuditFields = {
      transaction_id: 'TXN999888',
      event: 'engine_timeout',
      policy_applied: 'fail-closed',
      action: 'declined'
    };
    await fraudAlertPage.verifyAuditTrailRecord(expectedAuditFields);
  });
});

test.describe('Fraud Alert System - Admin Console Threshold Configuration', () => {

  test('TC-3110: Verify dynamic alert threshold update without redeployment', async ({ page }) => {
    const adminPage = new FraudAlertAdminPage(page);
    
    // Step 1: Launch the fraud alert system admin console
    await adminPage.navigate('https://fraud-alert-admin.example.com');
    await adminPage.verifyAdminConsoleLoaded();
    
    // Step 2: Login as fraud operations manager
    await adminPage.login('fraud_ops_manager', 'SecurePass@123');
    await adminPage.verifyManagerAuthenticated();
    
    // Step 3: Navigate to alert threshold configuration settings
    await adminPage.navigateToThresholdConfiguration();
    await adminPage.verifyCurrentThreshold('75');
    
    // Step 4: Update the alert threshold from 75 to 85
    await adminPage.updateThreshold('85');
    await adminPage.verifyThresholdSaved('85');
    
    // Step 5: Submit a transaction with risk score 87 for evaluation
    const transactionData = {
      transaction_id: 'TXN111222',
      risk_score: '87',
      amount: '800.00',
      merchant: 'ElectronicsStore.com'
    };
    await adminPage.submitTransactionForEvaluation(transactionData);
    
    // Step 6: Verify that an alert is created using the new threshold value of 85
    await adminPage.verifyAlertCreatedWithThreshold('TXN111222', '85');
    
    // Step 7: Check the alert record to confirm the threshold value used
    await adminPage.verifyAlertRecordThreshold('TXN111222', '85');
  });

  test('TC-3111: Verify transaction-type-specific threshold for card-not-present transaction', async ({ page }) => {
    const fraudAlertPage = new FraudAlertSystemPage(page);
    
    // Step 1: Launch the fraud alert system and verify multiple alert threshold configurations exist
    await fraudAlertPage.navigate('https://fraud-alert.example.com');
    await fraudAlertPage.verifyMultipleThresholdConfigurations({
      'card-present': '80',
      'card-not-present': '70',
      'international': '60'
    });
    
    // Step 2: Submit a card-not-present transaction with risk score 80 for evaluation
    const transactionData = {
      transaction_id: 'TXN555666',
      transaction_type: 'card-not-present',
      risk_score: '80',
      amount: '350.00',
      merchant: 'OnlineRetailer.com'
    };
    await fraudAlertPage.submitTransaction(transactionData);
    await fraudAlertPage.verifyTransactionTypeIdentified('card-not-present');
    
    // Step 3: Verify that the fraud-risk engine evaluates the transaction against the card-not-present threshold of 70
    await fraudAlertPage.verifyThresholdApplied('70');
    
    // Step 4: Verify that an alert is generated because risk score 80 exceeds the threshold of 70
    await fraudAlertPage.verifyAlertGenerated('TXN555666', '80', '70');
    
    // Step 5: Check the alert record to confirm the correct transaction-type-specific threshold was applied
    await fraudAlertPage.verifyAlertRecordTransactionType('TXN555666', 'card-not-present', '70', '80');
  });

  test('TC-3112: Verify no alert generated when risk score is below transaction-type-specific threshold', async ({ page }) => {
    const fraudAlertPage = new FraudAlertSystemPage(page);
    
    // Step 1: Launch the fraud alert system and verify multiple alert threshold configurations exist
    await fraudAlertPage.navigate('https://fraud-alert.example.com');
    await fraudAlertPage.verifyMultipleThresholdConfigurations({
      'card-present': '80',
      'card-not-present': '70',
      'international': '60'
    });
    
    // Step 2: Submit a card-present transaction with risk score 65 for evaluation
    const transactionData = {
      transaction_id: 'TXN777888',
      transaction_type: 'card-present',
      risk_score: '65',
      amount: '200.00',
      merchant: 'LocalStore.com'
    };
    await fraudAlertPage.submitTransaction(transactionData);
    await fraudAlertPage.verifyTransactionTypeIdentified('card-present');
    
    // Step 3: Verify that the fraud-risk engine evaluates the transaction against the card-present threshold of 80
    await fraudAlertPage.verifyThresholdApplied('80');
    
    // Step 4: Verify that no alert is generated because risk score 65 is below the threshold of 80
    await fraudAlertPage.verifyNoAlertGenerated('TXN777888');
    
    // Step 5: Check the transaction processing log to confirm threshold comparison
    await fraudAlertPage.verifyTransactionLog('TXN777888', 'card-present', '65', '80', false);
  });

  test('TC-3113: Verify system rejects invalid negative threshold value and retains previous valid threshold', async ({ page }) => {
    const adminPage = new FraudAlertAdminPage(page);
    
    // Step 1: Launch the fraud alert system admin console
    await adminPage.navigate('https://fraud-alert-admin.example.com');
    await adminPage.verifyAdminConsoleLoaded();
    
    // Step 2: Login as fraud operations manager
    await adminPage.login('fraud_ops_manager', 'SecurePass@123');
    await adminPage.verifyManagerAuthenticated();
    
    // Step 3: Navigate to alert threshold configuration settings and note the current valid threshold
    await adminPage.navigateToThresholdConfiguration();
    await adminPage.verifyCurrentThreshold('75');
    
    // Step 4: Attempt to update the alert threshold to an invalid negative value
    await adminPage.attemptUpdateThreshold('-10');
    
    // Step 5: Verify that the system rejects the update with a validation error message
    await adminPage.verifyValidationError('Invalid threshold value: must be a positive number between 0 and 100');
    
    // Step 6: Verify that the previous valid threshold of 75 remains active
    await adminPage.verifyCurrentThreshold('75');
    
    // Step 7: Submit a test transaction with risk score 80 to confirm the previous threshold is still in effect
    const transactionData = {
      transaction_id: 'TXN999000',
      risk_score: '80'
    };
    await adminPage.submitTransactionForEvaluation(transactionData);
    await adminPage.verifyAlertCreatedWithThreshold('TXN999000', '75');
  });

  test('TC-3114: Verify system rejects threshold value exceeding maximum and retains previous valid threshold', async ({ page }) => {
    const adminPage = new FraudAlertAdminPage(page);
    
    // Step 1: Launch the fraud alert system admin console
    await adminPage.navigate('https://fraud-alert-admin.example.com');
    await adminPage.verifyAdminConsoleLoaded();
    
    // Step 2: Login as fraud operations manager
    await adminPage.login('fraud_ops_manager', 'SecurePass@123');
    await adminPage.verifyManagerAuthenticated();
    
    // Step 3: Navigate to alert threshold configuration settings and note the current valid threshold
    await adminPage.navigateToThresholdConfiguration();
    await adminPage.verifyCurrentThreshold('85');
    
    // Step 4: Attempt to update the alert threshold to a value exceeding the maximum allowed
    await adminPage.attemptUpdateThreshold('150');
    
    // Step 5: Verify that the system rejects the update with a validation error message
    await adminPage.verifyValidationError('Invalid threshold value: must not exceed maximum value of 100');
    
    // Step 6: Verify that the previous valid threshold of 85 remains active
    await adminPage.verifyCurrentThreshold('85');
    
    // Step 7: Submit a test transaction with risk score 90 to confirm the previous threshold is still in effect
    const transactionData = {
      transaction_id: 'TXN888777',
      risk_score: '90'
    };
    await adminPage.submitTransactionForEvaluation(transactionData);
    await adminPage.verifyAlertCreatedWithThreshold('TXN888777', '85');
  });
});
