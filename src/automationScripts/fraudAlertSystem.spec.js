const { test, expect } = require('@playwright/test');
const { FraudAlertSystemPage } = require('./pages/fraudAlertSystem.page');
const logger = require('../utils/logger');

test.describe('Credit Card Fraud Alert System - High Risk Transaction Detection', () => {

  test('TC-001: High-risk transaction with multiple risk signals triggers fraud alert', async ({ page }) => {
    logger.info('Starting test case TC-001: High-risk transaction alert generation');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-HR-001',
      account_id: 'ACC-12345',
      card_id: 'CARD-6789',
      merchant: 'UnknownMerchant_XYZ',
      amount: 5000,
      currency: 'USD',
      timestamp: '2026-08-15T14:23:45Z',
      channel: 'online',
      location: 'Russia'
    };
    
    await fraudPage.simulateTransaction(transactionData);
    await expect(fraudPage.transactionReceivedStatus).toHaveText('received');
    logger.info('Step 1: Transaction event received successfully');
    
    await fraudPage.triggerRiskEngineEvaluation('v2.3.1');
    await expect(fraudPage.riskEngineStatus).toHaveText('processed');
    logger.info('Step 2: Risk engine evaluation completed');
    
    await fraudPage.verifyRiskScoreCalculation(85, 75);
    await expect(fraudPage.riskScoreValue).toHaveText('85');
    await expect(fraudPage.alertThresholdValue).toHaveText('75');
    logger.info('Step 3: Risk score exceeds threshold');
    
    await fraudPage.verifyRiskBandClassification('High');
    await expect(fraudPage.riskBandLabel).toHaveText('High');
    logger.info('Step 4: Transaction classified as High risk');
    
    await fraudPage.verifyPolicyDecision('decline_and_alert', 'urgent');
    await expect(fraudPage.policyActionLabel).toHaveText('decline_and_alert');
    await expect(fraudPage.alertSeverityLabel).toHaveText('urgent');
    logger.info('Step 5: Policy decision mapped correctly');
    
    await fraudPage.verifyAlertRecordCreation('ALERT-HR-001', 'Created', 'DEC-HR-001');
    await expect(fraudPage.alertIdField).toHaveText('ALERT-HR-001');
    await expect(fraudPage.alertStatusField).toHaveText('Created');
    await expect(fraudPage.decisionIdField).toHaveText('DEC-HR-001');
    logger.info('Step 6: Fraud alert record created successfully');
    
    logger.info('Test case TC-001 completed successfully');
  });

  test('TC-002: High-risk transaction with multiple signals and audit trail verification', async ({ page }) => {
    logger.info('Starting test case TC-002: Multiple risk signals with audit trail');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-HR-002',
      account_id: 'ACC-54321',
      card_id: 'CARD-9876',
      merchant: 'OnlineGamblingSite',
      amount: 2500,
      currency: 'USD',
      merchant_category: 'gambling',
      device_id: 'DEV-NEW-001',
      failed_auth_attempts: 2,
      timestamp: '2026-08-15T15:10:30Z'
    };
    
    await fraudPage.simulateTransaction(transactionData);
    await expect(fraudPage.transactionReceivedStatus).toHaveText('received');
    logger.info('Step 1: Transaction with multiple risk indicators received');
    
    const riskSignals = ['unusual_merchant_category', 'device_inconsistency', 'failed_auth_attempts'];
    await fraudPage.executeRiskEngineWithSignals(riskSignals, 92);
    await expect(fraudPage.calculatedRiskScore).toHaveText('92');
    logger.info('Step 2: Risk engine evaluated all signals');
    
    await fraudPage.verifyHighRiskClassificationAndPolicy('High', 'step_up_verification_and_alert');
    await expect(fraudPage.riskBandLabel).toHaveText('High');
    await expect(fraudPage.policyActionLabel).toHaveText('step_up_verification_and_alert');
    logger.info('Step 3: High risk classification and policy mapped');
    
    const auditRecords = ['risk_evaluation_completed', 'risk_band_assigned', 'policy_decision_made', 'alert_created'];
    await fraudPage.verifyAuditTrail(auditRecords, 'DEC-HR-002');
    await expect(fraudPage.auditTrailRecords).toContainText('risk_evaluation_completed');
    await expect(fraudPage.auditTrailRecords).toContainText('risk_band_assigned');
    await expect(fraudPage.auditTrailRecords).toContainText('policy_decision_made');
    await expect(fraudPage.auditTrailRecords).toContainText('alert_created');
    logger.info('Step 4: Audit trail verified with all decision points');
    
    logger.info('Test case TC-002 completed successfully');
  });
});

test.describe('Credit Card Fraud Alert System - Low Risk Transaction Handling', () => {

  test('TC-003: Low-risk transaction does not trigger fraud alert', async ({ page }) => {
    logger.info('Starting test case TC-003: Low-risk transaction processing');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-LR-001',
      account_id: 'ACC-11111',
      card_id: 'CARD-2222',
      merchant: 'LocalGroceryStore',
      amount: 85.50,
      currency: 'USD',
      timestamp: '2026-08-15T10:30:00Z',
      channel: 'in-store',
      location: 'customer_home_city'
    };
    
    await fraudPage.simulateTransaction(transactionData);
    await expect(fraudPage.transactionReceivedStatus).toHaveText('received');
    logger.info('Step 1: Low-risk transaction received');
    
    const riskSignals = ['normal_amount', 'familiar_merchant', 'geographic_consistency', 'normal_velocity'];
    await fraudPage.triggerRiskEngineWithSignals(riskSignals);
    await expect(fraudPage.riskEngineStatus).toHaveText('processed');
    logger.info('Step 2: Risk engine processed transaction');
    
    await fraudPage.verifyRiskScoreBelowThreshold(15, 75);
    await expect(fraudPage.riskScoreValue).toHaveText('15');
    logger.info('Step 3: Risk score below threshold');
    
    await fraudPage.verifyRiskBandClassification('Low');
    await expect(fraudPage.riskBandLabel).toHaveText('Low');
    logger.info('Step 4: Transaction classified as Low risk');
    
    await fraudPage.verifyNoAlertCreated();
    await expect(fraudPage.alertCreatedFlag).toHaveText('false');
    await expect(fraudPage.transactionStatusField).toHaveText('approved');
    logger.info('Step 5: No fraud alert created');
    
    await fraudPage.verifyLowRiskAuditRecord('Low', false);
    await expect(fraudPage.auditRiskBand).toHaveText('Low');
    await expect(fraudPage.auditAlertRequired).toHaveText('false');
    logger.info('Step 6: Audit trail recorded low-risk decision');
    
    logger.info('Test case TC-003 completed successfully');
  });

  test('TC-004: Recurring transaction matching customer patterns approved without alert', async ({ page }) => {
    logger.info('Starting test case TC-004: Recurring transaction pattern match');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-LR-002',
      account_id: 'ACC-22222',
      card_id: 'CARD-3333',
      merchant: 'Netflix',
      amount: 15.99,
      currency: 'USD',
      timestamp: '2026-08-15T08:00:00Z',
      device_id: 'DEV-KNOWN-001',
      merchant_type: 'recurring_subscription'
    };
    
    await fraudPage.simulateTransaction(transactionData);
    await expect(fraudPage.transactionReceivedStatus).toHaveText('received');
    logger.info('Step 1: Recurring transaction ingested');
    
    await fraudPage.executeRiskEngineWithCustomerHistory(true, 'recurring_subscription', 8);
    await expect(fraudPage.customerHistoryMatch).toHaveText('true');
    await expect(fraudPage.calculatedRiskScore).toHaveText('8');
    logger.info('Step 2: Risk engine matched customer behavior pattern');
    
    await fraudPage.verifyLowRiskAndPolicyDecision('Low', 'approve_no_alert');
    await expect(fraudPage.riskBandLabel).toHaveText('Low');
    await expect(fraudPage.policyDecisionLabel).toHaveText('approve_no_alert');
    logger.info('Step 3: Low risk classification with no alert policy');
    
    await fraudPage.verifyTransactionApprovedWithoutIntervention('approved', false);
    await expect(fraudPage.transactionStatusField).toHaveText('approved');
    await expect(fraudPage.fraudAlertTriggered).toHaveText('false');
    logger.info('Step 4: Transaction approved without fraud intervention');
    
    logger.info('Test case TC-004 completed successfully');
  });
});

test.describe('Credit Card Fraud Alert System - Fail-Safe Policy Handling', () => {

  test('TC-005: Fraud engine unavailable triggers fail-safe policy for standard transaction', async ({ page }) => {
    logger.info('Starting test case TC-005: Fail-safe policy for standard transaction');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-FS-001',
      account_id: 'ACC-33333',
      card_id: 'CARD-4444',
      merchant: 'RetailStore',
      amount: 150.00,
      currency: 'USD',
      timestamp: '2026-08-15T12:00:00Z',
      channel: 'in-store',
      transaction_type: 'standard_purchase'
    };
    
    await fraudPage.simulateTransaction(transactionData);
    await expect(fraudPage.transactionReceivedStatus).toHaveText('received');
    logger.info('Step 1: Standard transaction received');
    
    await fraudPage.simulateRiskEngineUnavailability('unavailable', 500);
    await expect(fraudPage.riskEngineStatusIndicator).toHaveText('unavailable');
    logger.info('Step 2: Risk engine unavailability detected');
    
    await fraudPage.verifyFailSafePolicyApplication('standard_purchase', 'approve_with_monitoring', false);
    await expect(fraudPage.failSafePolicyApplied).toHaveText('approve_with_monitoring');
    logger.info('Step 3: Fail-safe policy applied without arbitrary decision');
    
    await fraudPage.verifyEngineFailureAuditRecord('TXN-FS-001', true, 'approve_with_monitoring');
    await expect(fraudPage.auditEventType).toHaveText('fraud_engine_unavailable');
    await expect(fraudPage.auditFailSafeApplied).toHaveText('true');
    logger.info('Step 4: Engine failure recorded in audit trail');
    
    await fraudPage.verifyNoArbitraryDecisionCreated();
    await expect(fraudPage.riskScoreGenerated).toHaveText('false');
    await expect(fraudPage.riskBandAssigned).toHaveText('false');
    await expect(fraudPage.alertCreatedFlag).toHaveText('false');
    logger.info('Step 5: No arbitrary risk decision created');
    
    logger.info('Test case TC-005 completed successfully');
  });

  test('TC-006: Fraud engine failure for high-value transaction applies stricter fail-safe policy', async ({ page }) => {
    logger.info('Starting test case TC-006: Fail-safe for high-value transaction');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-FS-002',
      account_id: 'ACC-44444',
      card_id: 'CARD-5555',
      merchant: 'ElectronicsOnline',
      amount: 3500.00,
      currency: 'USD',
      timestamp: '2026-08-15T14:30:00Z',
      channel: 'online',
      transaction_type: 'high_value_purchase'
    };
    
    await fraudPage.simulateTransaction(transactionData);
    await expect(fraudPage.transactionReceivedStatus).toHaveText('received');
    logger.info('Step 1: High-value transaction received');
    
    await fraudPage.simulateRiskEngineFailure('failed', 'ENGINE_500', 500);
    await expect(fraudPage.riskEngineStatusIndicator).toHaveText('failed');
    logger.info('Step 2: Risk engine failure detected');
    
    await fraudPage.verifyTransactionSpecificFailSafe('high_value_purchase', 'hold_for_review', 'high_value_protection');
    await expect(fraudPage.failSafePolicyApplied).toHaveText('hold_for_review');
    logger.info('Step 3: Stricter fail-safe policy applied for high-value transaction');
    
    const auditEvents = ['fraud_engine_failed', 'fail_safe_policy_retrieved', 'transaction_held'];
    await fraudPage.verifyComprehensiveAuditLogging(auditEvents, 'TXN-FS-002', 'hold_for_review');
    await expect(fraudPage.auditTrailRecords).toContainText('fraud_engine_failed');
    await expect(fraudPage.auditTrailRecords).toContainText('fail_safe_policy_retrieved');
    await expect(fraudPage.auditTrailRecords).toContainText('transaction_held');
    logger.info('Step 4: Comprehensive audit logging verified');
    
    await fraudPage.verifyMonitoringAlertTriggered('fraud_engine_failure', 'critical');
    await expect(fraudPage.monitoringAlertType).toHaveText('fraud_engine_failure');
    await expect(fraudPage.monitoringAlertSeverity).toHaveText('critical');
    logger.info('Step 5: Operational monitoring alert triggered');
    
    logger.info('Test case TC-006 completed successfully');
  });
});

test.describe('Credit Card Fraud Alert System - Transaction Ingestion', () => {

  test('TC-007: Valid transaction authorization event ingestion and fraud-alert record creation', async ({ page }) => {
    logger.info('Starting test case TC-007: Valid transaction ingestion');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-AUTH-001',
      account_id: 'ACC-10001',
      card_id: 'CARD-20001',
      merchant: 'CoffeShop_ABC',
      amount: 12.50,
      currency: 'USD',
      timestamp: '2026-08-15T09:15:30Z',
      channel: 'contactless'
    };
    
    await fraudPage.publishTransactionEvent(transactionData);
    await expect(fraudPage.eventPublishedStatus).toHaveText('success');
    logger.info('Step 1: Transaction event published successfully');
    
    await fraudPage.verifyEventReceived();
    await expect(fraudPage.eventReceivedFlag).toHaveText('true');
    await expect(fraudPage.acknowledgmentStatus).toHaveText('success');
    logger.info('Step 2: Fraud detection system received and acknowledged event');
    
    const requiredFields = ['transaction_id', 'account_id', 'card_id', 'merchant', 'amount', 'currency', 'timestamp', 'channel'];
    await fraudPage.verifyRequiredFieldsPresent(requiredFields);
    await expect(fraudPage.validationResult).toHaveText('passed');
    logger.info('Step 3: All required fields validated');
    
    await fraudPage.verifyIngestionSuccess();
    await expect(fraudPage.ingestionStatus).toHaveText('success');
    logger.info('Step 4: Transaction ingestion completed successfully');
    
    await fraudPage.verifyCanonicalAlertRecordCreation('DEC-AUTH-001', 'TXN-AUTH-001', 'created');
    await expect(fraudPage.fraudAlertRecordCreated).toHaveText('true');
    await expect(fraudPage.decisionIdField).toHaveText('DEC-AUTH-001');
    await expect(fraudPage.recordStatus).toHaveText('created');
    logger.info('Step 5: Canonical fraud-alert record created with unique decision_id');
    
    logger.info('Test case TC-007 completed successfully');
  });

  test('TC-008: Online transaction with full context ingestion', async ({ page }) => {
    logger.info('Starting test case TC-008: Online transaction with context');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-AUTH-002',
      account_id: 'ACC-10002',
      card_id: 'CARD-20002',
      merchant: 'AmazonOnline',
      amount: 249.99,
      currency: 'USD',
      timestamp: '2026-08-15T11:45:00Z',
      channel: 'online',
      device_id: 'DEV-WEB-001',
      ip_address: '192.168.1.100',
      location: 'New_York_USA'
    };
    
    await fraudPage.publishTransactionEvent(transactionData);
    await expect(fraudPage.eventPublishedStatus).toHaveText('success');
    logger.info('Step 1: Online transaction published with context');
    
    const contextFields = ['device_id', 'ip_address', 'location'];
    await fraudPage.verifyEventReceivedWithContext(contextFields);
    await expect(fraudPage.eventReceivedFlag).toHaveText('true');
    await expect(fraudPage.contextFieldsPreserved).toContainText('device_id');
    await expect(fraudPage.contextFieldsPreserved).toContainText('ip_address');
    await expect(fraudPage.contextFieldsPreserved).toContainText('location');
    logger.info('Step 2: Event received with all context fields preserved');
    
    await fraudPage.verifyCanonicalRecordWithContext('DEC-AUTH-002', 'TXN-AUTH-002', true);
    await expect(fraudPage.decisionIdField).toHaveText('DEC-AUTH-002');
    await expect(fraudPage.contextIncluded).toHaveText('true');
    logger.info('Step 3: Fraud-alert record created with full context');
    
    logger.info('Test case TC-008 completed successfully');
  });
});

test.describe('Credit Card Fraud Alert System - Idempotency', () => {

  test('TC-009: Duplicate transaction event does not create duplicate fraud case', async ({ page }) => {
    logger.info('Starting test case TC-009: Idempotency check for duplicate events');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-IDEM-001',
      account_id: 'ACC-30001',
      card_id: 'CARD-40001',
      merchant: 'GasStation_XYZ',
      amount: 45.00,
      currency: 'USD',
      timestamp: '2026-08-15T13:00:00Z',
      channel: 'in-store'
    };
    
    await fraudPage.publishTransactionEvent(transactionData);
    await expect(fraudPage.eventPublishedStatus).toHaveText('success');
    logger.info('Step 1: First transaction event published');
    
    await fraudPage.verifyInitialAlertRecordCreation('ALERT-IDEM-001', 'DEC-IDEM-001', 'TXN-IDEM-001', 1);
    await expect(fraudPage.alertIdField).toHaveText('ALERT-IDEM-001');
    await expect(fraudPage.recordCount).toHaveText('1');
    logger.info('Step 2: Initial fraud case/alert record created');
    
    await fraudPage.publishDuplicateTransactionEvent(transactionData, 2);
    await expect(fraudPage.eventPublishedStatus).toHaveText('success');
    logger.info('Step 3: Duplicate transaction event published');
    
    await fraudPage.verifyDuplicateDetection();
    await expect(fraudPage.duplicateDetected).toHaveText('true');
    await expect(fraudPage.idempotencyCheck).toHaveText('passed');
    logger.info('Step 4: Duplicate detected and idempotency applied');
    
    await fraudPage.verifyOnlyOneRecordExists('ALERT-IDEM-001', 'DEC-IDEM-001', 'TXN-IDEM-001', 1);
    await expect(fraudPage.totalRecordCount).toHaveText('1');
    await expect(fraudPage.duplicateRecordsCreated).toHaveText('false');
    logger.info('Step 5: Only one canonical record exists');
    
    logger.info('Test case TC-009 completed successfully');
  });

  test('TC-010: Multiple rapid duplicate events maintain single fraud case', async ({ page }) => {
    logger.info('Starting test case TC-010: Multiple rapid duplicates idempotency');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-IDEM-002',
      account_id: 'ACC-30002',
      card_id: 'CARD-40002',
      merchant: 'Restaurant_ABC',
      amount: 75.50,
      currency: 'USD',
      timestamp: '2026-08-15T18:30:00Z',
      channel: 'in-store'
    };
    
    await fraudPage.publishMultipleDuplicateEvents(transactionData, 3);
    await expect(fraudPage.allEventsReceived).toHaveText('true');
    logger.info('Step 1: Three duplicate events published');
    
    await fraudPage.verifyIdempotencyForMultipleDuplicates(true, 2);
    await expect(fraudPage.firstEventProcessed).toHaveText('true');
    await expect(fraudPage.duplicateEventsDetected).toHaveText('2');
    logger.info('Step 2: Idempotency checks applied for all duplicates');
    
    await fraudPage.verifyOnlyOneRecordExists('ALERT-IDEM-002', 'DEC-IDEM-002', 'TXN-IDEM-002', 1);
    await expect(fraudPage.totalRecordCount).toHaveText('1');
    logger.info('Step 3: Single fraud case/alert record maintained');
    
    const auditEntries = ['event_processed', 'duplicate_detected', 'duplicate_detected'];
    await fraudPage.verifyAuditTrailForDuplicates(auditEntries, 'TXN-IDEM-002');
    await expect(fraudPage.auditTrailRecords).toContainText('event_processed');
    logger.info('Step 4: Audit trail logs all duplicate attempts');
    
    logger.info('Test case TC-010 completed successfully');
  });
});

test.describe('Credit Card Fraud Alert System - Invalid Event Handling', () => {

  test('TC-011: Transaction event with missing transaction_id is rejected', async ({ page }) => {
    logger.info('Starting test case TC-011: Missing transaction_id validation');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const invalidTransactionData = {
      transaction_id: null,
      account_id: 'ACC-50001',
      card_id: 'CARD-60001',
      merchant: 'BookStore_XYZ',
      amount: 29.99,
      currency: 'USD',
      timestamp: '2026-08-15T16:00:00Z',
      channel: 'online'
    };
    
    await fraudPage.publishTransactionEvent(invalidTransactionData);
    await expect(fraudPage.eventPublishedStatus).toHaveText('received');
    logger.info('Step 1: Invalid transaction event received');
    
    await fraudPage.verifyValidationFailure('transaction_id', true);
    await expect(fraudPage.validationStatus).toHaveText('failed');
    await expect(fraudPage.missingField).toHaveText('transaction_id');
    logger.info('Step 2: Validation identified missing required field');
    
    await fraudPage.verifyIngestionRejection();
    await expect(fraudPage.ingestionStatus).toHaveText('failed');
    await expect(fraudPage.eventRejected).toHaveText('true');
    logger.info('Step 3: Ingestion failed and event rejected');
    
    await fraudPage.verifyErrorLogged('validation_error', 'Required field transaction_id is missing');
    await expect(fraudPage.errorLogged).toHaveText('true');
    await expect(fraudPage.errorType).toHaveText('validation_error');
    logger.info('Step 4: Error logged with validation failure details');
    
    await fraudPage.verifyNoFraudCaseCreated();
    await expect(fraudPage.fraudCaseCreated).toHaveText('false');
    await expect(fraudPage.alertRecordCreated).toHaveText('false');
    await expect(fraudPage.partialRecordCreated).toHaveText('false');
    logger.info('Step 5: No fraud case or partial record created');
    
    logger.info('Test case TC-011 completed successfully');
  });

  test('TC-012: Transaction event with invalid amount format is rejected', async ({ page }) => {
    logger.info('Starting test case TC-012: Invalid amount format validation');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const invalidTransactionData = {
      transaction_id: 'TXN-INV-001',
      account_id: 'ACC-50002',
      card_id: 'CARD-60002',
      merchant: 'Pharmacy_ABC',
      amount: 'invalid_amount',
      currency: 'USD',
      timestamp: '2026-08-15T17:30:00Z',
      channel: 'in-store'
    };
    
    await fraudPage.publishTransactionEvent(invalidTransactionData);
    await expect(fraudPage.eventPublishedStatus).toHaveText('received');
    logger.info('Step 1: Transaction with invalid field format received');
    
    await fraudPage.verifyFormatValidationFailure('amount', 'numeric', 'string');
    await expect(fraudPage.validationStatus).toHaveText('failed');
    await expect(fraudPage.invalidField).toHaveText('amount');
    logger.info('Step 2: Format validation identified invalid amount');
    
    await fraudPage.verifyIngestionRejection();
    await expect(fraudPage.ingestionStatus).toHaveText('failed');
    await expect(fraudPage.rejectionReason).toHaveText('invalid_field_format');
    logger.info('Step 3: Ingestion failed due to format validation error');
    
    await fraudPage.verifyFormatErrorLogged('format_validation_error', 'Invalid format for field amount: expected numeric, received string', 'TXN-INV-001');
    await expect(fraudPage.errorLogged).toHaveText('true');
    await expect(fraudPage.errorType).toHaveText('format_validation_error');
    logger.info('Step 4: Format error logged with details');
    
    await fraudPage.verifyNoRecordsCreated();
    await expect(fraudPage.fraudCaseCreated).toHaveText('false');
    await expect(fraudPage.alertRecordCreated).toHaveText('false');
    await expect(fraudPage.partialRecordCreated).toHaveText('false');
    await expect(fraudPage.corruptedRecordCreated).toHaveText('false');
    logger.info('Step 5: No fraud case or corrupted records created');
    
    logger.info('Test case TC-012 completed successfully');
  });

  test('TC-013: Transaction event with multiple missing required fields is rejected', async ({ page }) => {
    logger.info('Starting test case TC-013: Multiple missing fields validation');
    const fraudPage = new FraudAlertSystemPage(page);
    
    const invalidTransactionData = {
      transaction_id: null,
      account_id: 'ACC-50003',
      card_id: 'CARD-60003',
      merchant: 'HotelBooking',
      amount: null,
      currency: 'USD',
      timestamp: null,
      channel: 'online'
    };
    
    await fraudPage.publishTransactionEvent(invalidTransactionData);
    await expect(fraudPage.eventPublishedStatus).toHaveText('received');
    logger.info('Step 1: Incomplete transaction event received');
    
    const missingFields = ['transaction_id', 'amount', 'timestamp'];
    await fraudPage.verifyMultipleMissingFields(missingFields, 3);
    await expect(fraudPage.validationStatus).toHaveText('failed');
    await expect(fraudPage.missingFieldsCount).toHaveText('3');
    logger.info('Step 2: Multiple missing required fields detected');
    
    await fraudPage.verifyIngestionFailureWithMultipleErrors(3);
    await expect(fraudPage.ingestionStatus).toHaveText('failed');
    await expect(fraudPage.validationErrorsCount).toHaveText('3');
    logger.info('Step 3: Ingestion failed with comprehensive error reporting');
    
    const errorMessages = ['Missing required field: transaction_id', 'Missing required field: amount', 'Missing required field: timestamp'];
    await fraudPage.verifyComprehensiveErrorLogging(errorMessages);
    await expect(fraudPage.errorLogged).toHaveText('true');
    await expect(fraudPage.errorMessages).toContainText('Missing required field: transaction_id');
    await expect(fraudPage.errorMessages).toContainText('Missing required field: amount');
    await expect(fraudPage.errorMessages).toContainText('Missing required field: timestamp');
    logger.info('Step 4: Comprehensive error logging verified');
    
    await fraudPage.verifyNoProcessingOccurred();
    await expect(fraudPage.processingAttempted).toHaveText('false');
    await expect(fraudPage.fraudCaseCreated).toHaveText('false');
    await expect(fraudPage.alertRecordCreated).toHaveText('false');
    logger.info('Step 5: No processing or record creation occurred');
    
    logger.info('Test case TC-013 completed successfully');
  });
});