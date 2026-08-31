const { test, expect } = require('@playwright/test');
const { SettlementPage } = require('./pages/settlement.page');
const logger = require('../../utils/logger');

test.describe('Settlement Batch Creation and Funding', () => {

  test('TC-001: Verify settlement batch creation for single merchant with funding calculation', async ({ page }) => {
    logger.info('Starting test: QE-5095 TS001 TC-001 - Settlement batch creation for single merchant');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Set up merchant account with eligible captured transactions
    await settlementPage.setupMerchantAccount('MID-12345', [
      { id: 'TXN-001', amount: 100 },
      { id: 'TXN-002', amount: 250 },
      { id: 'TXN-003', amount: 75 }
    ]);
    await expect(settlementPage.merchantStatusIndicator).toHaveText('active');
    await settlementPage.verifyCapturedTransactionsReady(['TXN-001', 'TXN-002', 'TXN-003']);
    logger.info('Step 1 passed: Merchant account active with captured transactions');
    
    // Step 2: Wait for or trigger settlement window closure
    await settlementPage.triggerSettlementWindowClosure('23:59', 'UTC');
    await expect(settlementPage.settlementWindowStatus).toHaveText('closed');
    logger.info('Step 2 passed: Settlement window closed at configured time');
    
    // Step 3: Verify settlement batch is automatically created
    await settlementPage.verifyBatchCreated('BATCH-001');
    await expect(settlementPage.getBatchTransactionCount('BATCH-001')).toHaveText('3');
    await settlementPage.verifyBatchContainsTransactions('BATCH-001', ['TXN-001', 'TXN-002', 'TXN-003']);
    logger.info('Step 3 passed: Settlement batch created with correct transactions');
    
    // Step 4: Verify funding calculation is performed
    await settlementPage.verifyFundingCalculation('BATCH-001', {
      gross: 425,
      fees: 12.75,
      reserves: 0,
      netFunding: 412.25
    });
    await settlementPage.verifyLedgerReconciliation('BATCH-001');
    logger.info('Step 4 passed: Funding calculation correct and reconciled to ledger');
  });

  test('TC-002: Verify separate settlement batches for multiple merchants', async ({ page }) => {
    logger.info('Starting test: QE-5095 TS002 TC-001 - Multiple merchant settlement batches');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Set up multiple merchant accounts with eligible captured transactions
    await settlementPage.setupMerchantAccount('MID-001', [
      { id: 'TXN-A1', amount: 100 },
      { id: 'TXN-A2', amount: 200 }
    ]);
    await settlementPage.setupMerchantAccount('MID-002', [
      { id: 'TXN-B1', amount: 150 }
    ]);
    await settlementPage.setupMerchantAccount('MID-003', [
      { id: 'TXN-C1', amount: 300 },
      { id: 'TXN-C2', amount: 50 }
    ]);
    await settlementPage.verifyMultipleMerchantsReady(['MID-001', 'MID-002', 'MID-003']);
    logger.info('Step 1 passed: Multiple merchants with captured transactions ready');
    
    // Step 2: Trigger settlement window closure
    await settlementPage.triggerSettlementWindowClosure('23:59', 'UTC');
    await expect(settlementPage.settlementWindowStatus).toHaveText('closed');
    logger.info('Step 2 passed: Settlement window closed');
    
    // Step 3: Verify separate settlement batches are created for each merchant
    await settlementPage.verifyBatchCreated('BATCH-A');
    await settlementPage.verifyBatchCreated('BATCH-B');
    await settlementPage.verifyBatchCreated('BATCH-C');
    await expect(settlementPage.getBatchTransactionCount('BATCH-A')).toHaveText('2');
    await expect(settlementPage.getBatchTransactionCount('BATCH-B')).toHaveText('1');
    await expect(settlementPage.getBatchTransactionCount('BATCH-C')).toHaveText('2');
    await settlementPage.verifyBatchMerchantMapping('BATCH-A', 'MID-001');
    await settlementPage.verifyBatchMerchantMapping('BATCH-B', 'MID-002');
    await settlementPage.verifyBatchMerchantMapping('BATCH-C', 'MID-003');
    logger.info('Step 3 passed: Three separate batches created for each merchant');
    
    // Step 4: Verify merchant-specific funding calculations
    await settlementPage.verifyNetFunding('BATCH-A', 291);
    await settlementPage.verifyNetFunding('BATCH-B', 145.50);
    await settlementPage.verifyNetFunding('BATCH-C', 339.50);
    logger.info('Step 4 passed: Each batch has correct funding calculation');
    
    // Step 5: Verify batch creation timestamps align with window closure
    await settlementPage.verifyBatchTimestamp('BATCH-A', '2026-08-31T23:59:00Z');
    await settlementPage.verifyBatchTimestamp('BATCH-B', '2026-08-31T23:59:00Z');
    await settlementPage.verifyBatchTimestamp('BATCH-C', '2026-08-31T23:59:00Z');
    logger.info('Step 5 passed: All batch timestamps match settlement window closure time');
  });

  test('TC-003: Verify no batch created for merchant with no eligible transactions', async ({ page }) => {
    logger.info('Starting test: QE-5095 TS003 TC-001 - No batch for merchant with no eligible transactions');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Set up merchant account with no eligible captured transactions
    await settlementPage.setupMerchantAccount('MID-99999', [
      { id: 'TXN-P1', state: 'pending' },
      { id: 'TXN-F1', state: 'failed' },
      { id: 'TXN-A1', state: 'authorized' }
    ]);
    await settlementPage.verifyNoEligibleTransactions('MID-99999');
    logger.info('Step 1 passed: Merchant account exists with no captured transactions');
    
    // Step 2: Trigger settlement window closure
    await settlementPage.triggerSettlementWindowClosure('23:59', 'UTC');
    await expect(settlementPage.settlementWindowStatus).toHaveText('closed');
    logger.info('Step 2 passed: Settlement window closed');
    
    // Step 3: Verify no settlement batch is created for the merchant
    await settlementPage.verifyNoBatchForMerchant('MID-99999');
    logger.info('Step 3 passed: No batch record exists for MID-99999');
    
    // Step 4: Verify system logs the zero-transaction window event
    await settlementPage.verifySystemLog('Settlement window closed for MID-99999: 0 eligible transactions, no batch created');
    logger.info('Step 4 passed: System log confirms zero eligible transactions');
  });

});

test.describe('Reconciliation Three-Way Matching', () => {

  test('TC-004: Verify three-way matching with auto-match rate target', async ({ page }) => {
    logger.info('Starting test: QE-5094 TS001 TC-001 - Three-way matching reconciliation');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Prepare transaction, settlement, and bank credit records
    await settlementPage.prepareReconciliationRecords([
      { transaction: 'TXN-001', settlement: 'SETTLE-001', bankCredit: 'BC-001', amount: 100 }
    ]);
    await settlementPage.verifyRecordsAvailable(['transaction', 'settlement', 'bankCredit']);
    logger.info('Step 1 passed: All three record types available for matching');
    
    // Step 2: Execute reconciliation engine three-way matching
    await settlementPage.executeReconciliationEngine('BATCH-001', 100);
    await expect(settlementPage.reconciliationStatus).toHaveText('completed');
    logger.info('Step 2 passed: Reconciliation engine processed all records');
    
    // Step 3: Verify matched sets are automatically cleared with timestamp
    await settlementPage.verifyMatchedRecordsCleared(96);
    await settlementPage.verifyReconciliationTimestamp('2026-09-01T08:00:00Z');
    logger.info('Step 3 passed: Matched records cleared with timestamp');
    
    // Step 4: Verify auto-match rate meets target
    const autoMatchRate = await settlementPage.getAutoMatchRate();
    expect(autoMatchRate).toBeGreaterThanOrEqual(95);
    await settlementPage.verifyAutoMatchCalculation(96, 100);
    logger.info('Step 4 passed: Auto-match rate meets 95% target');
  });

  test('TC-005: Verify tolerance matching for minor amount differences', async ({ page }) => {
    logger.info('Starting test: QE-5094 TS002 TC-001 - Tolerance matching');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Prepare records with minor amount differences within tolerance
    await settlementPage.prepareReconciliationRecords([
      { transaction: 'TXN-002', transactionAmount: 100.00, settlement: 'SETTLE-002', settlementAmount: 99.99, bankCredit: 'BC-002', bankCreditAmount: 100.01 }
    ]);
    await settlementPage.configureTolerance(0.05, 0.5);
    await settlementPage.verifyRecordsWithinTolerance();
    logger.info('Step 1 passed: Records with variance within tolerance prepared');
    
    // Step 2: Execute reconciliation engine with tolerance settings
    await settlementPage.executeReconciliationEngineWithTolerance();
    await expect(settlementPage.toleranceApplicationStatus).toHaveText('applied');
    logger.info('Step 2 passed: Reconciliation engine applied tolerance thresholds');
    
    // Step 3: Verify within-tolerance items are matched and cleared
    await settlementPage.verifyMatchedSet(['TXN-002', 'SETTLE-002', 'BC-002']);
    await settlementPage.verifyRecordStatus('TXN-002', 'reconciled');
    logger.info('Step 3 passed: Records within tolerance matched and cleared');
    
    // Step 4: Verify tolerance application is recorded in audit trail
    await settlementPage.verifyAuditEntry('Tolerance match applied: variance $0.01, within threshold ±$0.05');
    logger.info('Step 4 passed: Audit trail contains tolerance application entry');
  });

  test('TC-006: Verify unmatched records routed to break queue', async ({ page }) => {
    logger.info('Starting test: QE-5094 TS003 TC-001 - Unmatched records to break queue');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Prepare records with amount discrepancies exceeding tolerance
    await settlementPage.prepareReconciliationRecords([
      { transaction: 'TXN-003', transactionAmount: 100.00, settlement: 'SETTLE-003', settlementAmount: 95.00, bankCredit: 'BC-003', bankCreditAmount: 100.00 }
    ]);
    await settlementPage.configureTolerance(0.05, 0.5);
    await settlementPage.verifyDiscrepancyExceedsTolerance(5.00);
    logger.info('Step 1 passed: Records with mismatched amounts beyond tolerance prepared');
    
    // Step 2: Execute reconciliation engine
    await settlementPage.executeReconciliationEngine('BATCH-003', 1);
    await expect(settlementPage.discrepancyDetectionStatus).toHaveText('detected');
    logger.info('Step 2 passed: Reconciliation engine identified unmatched records');
    
    // Step 3: Verify unmatched items are routed to break queue with reason codes
    await settlementPage.verifyBreakQueueEntry('TXN-003', 'AMOUNT_MISMATCH', 5.00);
    logger.info('Step 3 passed: Unmatched records in break queue with reason code');
    
    // Step 4: Verify no automatic clearing occurs for unmatched records
    await settlementPage.verifyRecordStatus('TXN-003', 'PENDING_MANUAL_REVIEW');
    await settlementPage.verifyAutoClearFlag('TXN-003', false);
    logger.info('Step 4 passed: Unmatched records remain in break queue, not auto-cleared');
  });

});

test.describe('Payment API and Idempotency', () => {

  test('TC-007: Verify unified payment API endpoint with idempotency', async ({ page }) => {
    logger.info('Starting test: QE-5093 TS001 TC-001 - Unified payment API with idempotency');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Launch the unified payment API endpoint
    await settlementPage.navigateToPaymentAPI('https://api.mpsp.example.com/v1/payments');
    await expect(settlementPage.apiEndpointStatus).toHaveText('accessible');
    logger.info('Step 1 passed: API endpoint accessible and ready');
    
    // Step 2: Submit valid payment initiation request with unique Idempotency-Key
    await settlementPage.submitPaymentRequest({
      idempotencyKey: 'unique-key-12345',
      amount: 100,
      payer: 'customer@example.com',
      payee: 'MID-001',
      currency: 'USD'
    });
    await expect(settlementPage.requestStatus).toHaveText('accepted');
    logger.info('Step 2 passed: Request accepted and processed');
    
    // Step 3: Verify payment record is created successfully
    await settlementPage.verifyPaymentRecordCreated('PAY-001', 'created');
    logger.info('Step 3 passed: Payment record exists with status created');
    
    // Step 4: Verify idempotency key is stored
    await settlementPage.verifyIdempotencyKeyStored('unique-key-12345', 'PAY-001');
    logger.info('Step 4 passed: Idempotency key persisted in store');
    
    // Step 5: Verify payment response includes payment ID and status
    await settlementPage.verifyPaymentResponse({
      paymentId: 'PAY-001',
      status: 'created',
      amount: 100
    });
    logger.info('Step 5 passed: API response contains payment ID and status');
  });

  test('TC-008: Verify idempotency prevents duplicate payment creation', async ({ page }) => {
    logger.info('Starting test: QE-5093 TS002 TC-001 - Idempotency duplicate prevention');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Submit initial payment initiation request with Idempotency-Key
    await settlementPage.navigateToPaymentAPI('https://api.mpsp.example.com/v1/payments');
    await settlementPage.submitPaymentRequest({
      idempotencyKey: 'duplicate-test-key-001',
      amount: 150,
      payer: 'customer@example.com',
      payee: 'MID-002',
      currency: 'USD'
    });
    await settlementPage.verifyPaymentRecordCreated('PAY-002', 'created');
    logger.info('Step 1 passed: First payment created successfully');
    
    // Step 2: Submit second payment request with same Idempotency-Key
    await settlementPage.submitPaymentRequest({
      idempotencyKey: 'duplicate-test-key-001',
      amount: 150,
      payer: 'customer@example.com',
      payee: 'MID-002',
      currency: 'USD'
    });
    await expect(settlementPage.idempotencyCheckStatus).toHaveText('performed');
    logger.info('Step 2 passed: Request received and idempotency check performed');
    
    // Step 3: Verify system returns the original payment result
    await settlementPage.verifyPaymentResponse({
      paymentId: 'PAY-002',
      status: 'created',
      idempotent: true
    });
    logger.info('Step 3 passed: Original payment details returned without creating new payment');
    
    // Step 4: Verify no second financial transaction is initiated
    const paymentCount = await settlementPage.getPaymentCountForKey('duplicate-test-key-001');
    expect(paymentCount).toBe(1);
    logger.info('Step 4 passed: Only one payment record exists for idempotency key');
  });

  test('TC-009: Verify payment validation rejects missing required fields', async ({ page }) => {
    logger.info('Starting test: QE-5093 TS003 TC-001 - Payment validation for missing fields');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Submit payment request with missing payer field
    await settlementPage.navigateToPaymentAPI('https://api.mpsp.example.com/v1/payments');
    await settlementPage.submitPaymentRequest({
      idempotencyKey: 'missing-field-key-001',
      amount: 200,
      payee: 'MID-003',
      currency: 'USD'
    });
    await expect(settlementPage.validationStatus).toHaveText('performed');
    logger.info('Step 1 passed: Request received and validation performed');
    
    // Step 2: Verify request is rejected at validation
    await expect(settlementPage.httpStatusCode).toHaveText('400');
    logger.info('Step 2 passed: API returns 400 Bad Request');
    
    // Step 3: Verify field-level error details are provided
    await settlementPage.verifyErrorResponse({
      field: 'payer',
      message: 'Payer is required'
    });
    logger.info('Step 3 passed: Error response contains field-level error for missing payer');
    
    // Step 4: Verify no partial payment record is created
    await settlementPage.verifyNoPaymentForKey('missing-field-key-001');
    logger.info('Step 4 passed: No payment record exists for rejected request');
  });

});

test.describe('Strong Customer Authentication (SCA)', () => {

  test('TC-010: Verify SCA enforcement for EEA customer-initiated payment', async ({ page }) => {
    logger.info('Starting test: QE-5092 TS001 TC-001 - SCA enforcement');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Initiate customer-initiated EEA payment with no exemption
    await settlementPage.initiatePayment({
      amount: 100,
      currency: 'EUR',
      region: 'EEA',
      customerInitiated: true,
      exemption: 'none'
    });
    await expect(settlementPage.scaRequirementStatus).toHaveText('identified');
    logger.info('Step 1 passed: Payment initiation received and SCA requirement identified');
    
    // Step 2: System enforces Strong Customer Authentication
    await settlementPage.verifySCAChallenge(['Knowledge', 'Possession']);
    logger.info('Step 2 passed: SCA challenge presented requiring two independent factors');
    
    // Step 3: Customer provides first authentication factor
    await settlementPage.provideAuthenticationFactor('password', 'Pass@123');
    await expect(settlementPage.firstFactorValidation).toHaveText('validated');
    logger.info('Step 3 passed: First factor validated successfully');
    
    // Step 4: Customer provides second authentication factor
    await settlementPage.provideAuthenticationFactor('otp', '123456');
    await expect(settlementPage.secondFactorValidation).toHaveText('validated');
    logger.info('Step 4 passed: Second factor validated successfully');
    
    // Step 5: Verify payment proceeds after successful authentication
    await settlementPage.verifyPaymentAuthorized('authorized', 2);
    await settlementPage.verifyAuditEntry('SCA_COMPLETED');
    logger.info('Step 5 passed: Payment authorized and audit trail records SCA completion');
  });

  test('TC-011: Verify SCA exemption handling for low-value transactions', async ({ page }) => {
    logger.info('Starting test: QE-5092 TS002 TC-001 - SCA low-value exemption');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Initiate customer-initiated EEA payment qualifying for low-value exemption
    await settlementPage.initiatePayment({
      amount: 25,
      currency: 'EUR',
      region: 'EEA',
      customerInitiated: true,
      cumulativeCheck: true
    });
    await expect(settlementPage.exemptionEligibilityStatus).toHaveText('eligible');
    logger.info('Step 1 passed: Payment identified as eligible for low-value exemption');
    
    // Step 2: System applies low-value exemption flag
    await settlementPage.verifyExemptionFlag('LOW_VALUE', true);
    logger.info('Step 2 passed: Exemption flag set and recorded in payment metadata');
    
    // Step 3: Payment is sent to issuer for authorization
    await settlementPage.verifyAuthorizationRequest({
      amount: 25,
      exemption: 'LOW_VALUE'
    });
    logger.info('Step 3 passed: Authorization request includes exemption indicator');
    
    // Step 4: Verify issuer SCA decision is respected and enforced
    await settlementPage.verifyIssuerDecisionEnforced();
    logger.info('Step 4 passed: Issuer SCA decision respected and enforced');
  });

  test('TC-012: Verify SCA failure rejects payment', async ({ page }) => {
    logger.info('Starting test: QE-5092 TS003 TC-001 - SCA failure rejection');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Initiate customer-initiated EEA payment requiring SCA
    await settlementPage.initiatePayment({
      amount: 150,
      currency: 'EUR',
      region: 'EEA',
      customerInitiated: true
    });
    await expect(settlementPage.scaRequirementStatus).toHaveText('required');
    logger.info('Step 1 passed: Payment initiation triggers SCA requirement');
    
    // Step 2: Customer provides only one authentication factor
    await settlementPage.provideAuthenticationFactor('password', 'Pass@123');
    await expect(settlementPage.factorCount).toHaveText('1');
    logger.info('Step 2 passed: System detects insufficient authentication factors');
    
    // Step 3: Verify SCA validation fails
    await settlementPage.verifySCAValidationResult('FAILED', 'INSUFFICIENT_FACTORS');
    logger.info('Step 3 passed: SCA validation returns failure status');
    
    // Step 4: Verify payment is rejected with appropriate error code
    await settlementPage.verifyPaymentRejected('rejected', 'SCA_FAILED');
    await settlementPage.verifyNoFinancialHold();
    logger.info('Step 4 passed: Payment rejected before any financial hold placed');
  });

});

test.describe('Merchant Onboarding and KYB Verification', () => {

  test('TC-013: Verify KYB verification with external bureau', async ({ page }) => {
    logger.info('Starting test: QE-5091 TS001 TC-001 - KYB verification');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Submit merchant application with valid business details
    await settlementPage.submitMerchantApplication({
      businessName: 'Acme Corp',
      registrationNumber: '12345678',
      country: 'UK'
    });
    await expect(settlementPage.applicationQueueStatus).toHaveText('queued');
    logger.info('Step 1 passed: Application received and queued for KYB verification');
    
    // Step 2: KYB verification runs through external bureau
    await settlementPage.executeKYBVerification('Creditsafe', 'KYB-001');
    await expect(settlementPage.bureauResponseStatus).toHaveText('received');
    logger.info('Step 2 passed: KYB request sent to bureau and response received');
    
    // Step 3: Verify bureau response is mapped to pass/refer/fail status
    await settlementPage.verifyBureauResponseMapping('VERIFIED', 'pass');
    logger.info('Step 3 passed: Bureau response parsed and mapped to pass status');
    
    // Step 4: Verify immutable audit event is stored with bureau response metadata
    await settlementPage.verifyAuditEntry({
      event: 'KYB_VERIFIED',
      status: 'pass',
      bureau: 'Creditsafe',
      timestamp: '2026-09-01T10:00:00Z'
    });
    logger.info('Step 4 passed: Audit trail contains KYB verification event with bureau details');
  });

  test('TC-014: Verify KYB retry mechanism on bureau unavailability', async ({ page }) => {
    logger.info('Starting test: QE-5091 TS002 TC-001 - KYB retry on bureau unavailability');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Submit merchant application for KYB verification
    await settlementPage.submitMerchantApplication({
      applicationId: 'APP-002',
      businessName: 'Beta Ltd'
    });
    await expect(settlementPage.applicationQueueStatus).toHaveText('queued');
    logger.info('Step 1 passed: Application queued for KYB verification');
    
    // Step 2: KYB verification request times out
    await settlementPage.simulateBureauTimeout('https://api.bureau.example.com', 30);
    await expect(settlementPage.bureauResponseStatus).toHaveText('timeout');
    logger.info('Step 2 passed: Bureau service unavailable or timed out');
    
    // Step 3: Verify application status is set to pending_kyb
    await settlementPage.verifyApplicationStatus('APP-002', 'pending_kyb', 'BUREAU_UNAVAILABLE');
    logger.info('Step 3 passed: Application status updated to pending_kyb');
    
    // Step 4: Verify automatic retry mechanism is triggered
    await settlementPage.verifyRetryScheduled(true, '2026-09-01T10:15:00Z', 1);
    logger.info('Step 4 passed: System schedules retry, retry attempt logged');
  });

  test('TC-015: Verify KYB failure for invalid business registration', async ({ page }) => {
    logger.info('Starting test: QE-5091 TS003 TC-001 - KYB failure for invalid registration');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Submit merchant application with invalid business registration number
    await settlementPage.submitMerchantApplication({
      businessName: 'Gamma Inc',
      registrationNumber: 'INVALID123',
      country: 'UK'
    });
    await expect(settlementPage.applicationQueueStatus).toHaveText('queued');
    logger.info('Step 1 passed: Application received and queued for KYB verification');
    
    // Step 2: KYB verification runs through external bureau
    await settlementPage.executeKYBVerification('Creditsafe', 'KYB-003');
    await settlementPage.verifyBureauResponse('NOT_FOUND', 'Invalid registration number');
    logger.info('Step 2 passed: Bureau processes request and returns failure status');
    
    // Step 3: Verify application is rejected with appropriate reason code
    await settlementPage.verifyApplicationRejected('rejected', 'KYB_FAILED_INVALID_REGISTRATION');
    logger.info('Step 3 passed: Application status set to rejected with KYB failure reason');
    
    // Step 4: Verify failure is recorded in audit trail
    await settlementPage.verifyAuditEntry({
      event: 'KYB_FAILED',
      status: 'fail',
      reason: 'INVALID_REGISTRATION',
      timestamp: '2026-09-01T10:30:00Z'
    });
    logger.info('Step 4 passed: Audit trail contains KYB failure event with reason details');
  });

});

test.describe('Sanctions and PEP Screening', () => {

  test('TC-016: Verify sanctions and PEP screening with clear result', async ({ page }) => {
    logger.info('Starting test: QE-5090 TS001 TC-001 - Sanctions/PEP screening clear result');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Submit merchant applicant for screening
    await settlementPage.submitApplicantForScreening({
      applicant: 'John Doe',
      business: 'Delta Corp',
      country: 'UK'
    });
    await expect(settlementPage.screeningQueueStatus).toHaveText('queued');
    logger.info('Step 1 passed: Applicant details received and queued for screening');
    
    // Step 2: Execute sanctions and PEP list screening
    await settlementPage.executeScreening(['OFAC', 'EU Sanctions', 'PEP databases']);
    await expect(settlementPage.screeningExecutionStatus).toHaveText('completed');
    logger.info('Step 2 passed: Screening runs against sanctions and PEP databases');
    
    // Step 3: Verify screening returns clear result
    await settlementPage.verifyScreeningResult('clear', 0);
    logger.info('Step 3 passed: Screening result is clear with no hits detected');
    
    // Step 4: Verify screening decision is recorded with immutable audit event
    await settlementPage.verifyAuditEntry({
      event: 'SCREENING_COMPLETED',
      result: 'clear',
      access: 'Risk/Compliance only',
      timestamp: '2026-09-01T11:00:00Z'
    });
    logger.info('Step 4 passed: Audit trail contains screening event accessible only to Risk/Compliance roles');
  });

  test('TC-017: Verify sanctions hit triggers compliance case and blocks processing', async ({ page }) => {
    logger.info('Starting test: QE-5090 TS002 TC-001 - Sanctions hit compliance case');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Submit merchant applicant for screening
    await settlementPage.submitApplicantForScreening({
      applicant: 'Jane Smith',
      business: 'Epsilon Ltd',
      country: 'UK'
    });
    await expect(settlementPage.screeningQueueStatus).toHaveText('queued');
    logger.info('Step 1 passed: Applicant details queued for screening');
    
    // Step 2: Execute screening and detect sanctions hit
    await settlementPage.executeScreening(['OFAC', 'EU Sanctions', 'PEP databases']);
    await settlementPage.verifyScreeningHit('OFAC Sanctions', 100);
    logger.info('Step 2 passed: Screening identifies match on sanctions list');
    
    // Step 3: Verify application is automatically held in pending status
    await settlementPage.verifyApplicationHeld('pending', 'SANCTIONS_HIT');
    logger.info('Step 3 passed: Application status set to pending with hold reason');
    
    // Step 4: Verify compliance case is opened for manual review
    await settlementPage.verifyComplianceCaseOpened('CASE-001', 'Risk/Compliance', 'High');
    logger.info('Step 4 passed: Compliance case created and assigned to Risk/Compliance team');
    
    // Step 5: Verify onward processing is blocked until case resolution
    await settlementPage.verifyProcessingBlocked(true, 'PENDING_COMPLIANCE_REVIEW');
    logger.info('Step 5 passed: Application cannot proceed to activation, blocked until manual review');
  });

  test('TC-018: Verify fuzzy near-match routes to manual review', async ({ page }) => {
    logger.info('Starting test: QE-5090 TS003 TC-001 - Fuzzy near-match manual review');
    const settlementPage = new SettlementPage(page);
    
    // Step 1: Submit merchant applicant for screening
    await settlementPage.submitApplicantForScreening({
      applicant: 'Robert Johnson',
      business: 'Zeta Inc',
      country: 'UK'
    });
    await expect(settlementPage.screeningQueueStatus).toHaveText('queued');
    logger.info('Step 1 passed: Applicant details queued for screening');
    
    // Step 2: Execute screening and detect fuzzy near-match above threshold
    await settlementPage.executeScreening(['OFAC', 'EU Sanctions', 'PEP databases']);
    await settlementPage.verifyNearMatch(85, 80, 'Robert Johnston (PEP)');
    logger.info('Step 2 passed: Screening identifies potential match with confidence score above threshold');
    
    // Step 3: Verify result is routed to manual review queue with match confidence
    await settlementPage.verifyManualReviewQueue('MANUAL_SCREENING_REVIEW', 85, 'Robert Johnston (PEP)');
    logger.info('Step 3 passed: Application sent to manual review queue with screening details');
    
    // Step 4: Verify application is not auto-cleared
    await settlementPage.verifyApplicationNotAutoCleared('pending_manual_review', false);
    logger.info('Step 4 passed: Application remains in pending status awaiting manual review decision');
  });

});