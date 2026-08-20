const { test, expect } = require('@playwright/test');
const { FraudRiskEvaluationPage } = require('./pages/fraudRiskEvaluation.page');
const { PolicyEvaluationPage } = require('./pages/policyEvaluation.page');
const { ThresholdConfigurationPage } = require('./pages/thresholdConfiguration.page');

test.describe('Fraud Risk Evaluation - Valid Transaction Tests', () => {
  test('TC-001: Evaluate valid transaction and verify risk score assignment', async ({ page }) => {
    const fraudRiskPage = new FraudRiskEvaluationPage(page);
    
    const transactionData = {
      transaction_id: 'TXN-001',
      account_id: 'ACC-12345',
      card_id: 'CARD-6789',
      merchant: 'Amazon',
      amount: 150.00,
      currency: 'USD',
      timestamp: '2026-08-15T10:30:00Z',
      channel: 'online'
    };
    
    await fraudRiskPage.prepareTransactionEvent(transactionData);
    const response = await fraudRiskPage.sendTransactionToFraudEngine('/api/v1/fraud/evaluate', transactionData);
    await fraudRiskPage.verifyTransactionReceived(response);
    
    const riskEvaluation = await fraudRiskPage.triggerRiskEvaluation(transactionData.transaction_id);
    await fraudRiskPage.verifyRiskScoreCalculated(riskEvaluation);
    await fraudRiskPage.verifyRiskScoreInRange(riskEvaluation.risk_score, 0, 100);
    await fraudRiskPage.verifyRiskBandAssigned(riskEvaluation.risk_band, ['low', 'medium', 'high', 'confirmed fraud']);
    
    const auditTrail = await fraudRiskPage.queryAuditTrail(transactionData.transaction_id);
    await fraudRiskPage.verifyAuditTrailContainsRequiredFields(auditTrail, [
      'decision_id',
      'transaction_id',
      'risk_score',
      'risk_band',
      'model_version',
      'decision',
      'timestamp'
    ]);
  });

  test('TC-002: Evaluate high-risk transaction and verify elevated risk score', async ({ page }) => {
    const fraudRiskPage = new FraudRiskEvaluationPage(page);
    
    const highRiskTransactionData = {
      transaction_id: 'TXN-002',
      account_id: 'ACC-12345',
      card_id: 'CARD-6789',
      merchant: 'UnknownMerchant',
      amount: 5000.00,
      currency: 'USD',
      timestamp: '2026-08-15T11:00:00Z',
      channel: 'online',
      location: 'foreign_country'
    };
    
    await fraudRiskPage.prepareTransactionEvent(highRiskTransactionData);
    const response = await fraudRiskPage.sendTransactionToFraudEngine('/api/v1/fraud/evaluate', highRiskTransactionData);
    await fraudRiskPage.verifyTransactionReceived(response);
    
    const riskEvaluation = await fraudRiskPage.triggerRiskEvaluation(highRiskTransactionData.transaction_id);
    await fraudRiskPage.verifyRiskScoreCalculated(riskEvaluation);
    await fraudRiskPage.verifyRiskScoreGreaterThanOrEqual(riskEvaluation.risk_score, 75);
    await fraudRiskPage.verifyRiskBandAssigned(riskEvaluation.risk_band, ['high', 'confirmed fraud']);
    
    const auditTrail = await fraudRiskPage.queryAuditTrail(highRiskTransactionData.transaction_id);
    await fraudRiskPage.verifyAuditTrailContainsRequiredFields(auditTrail, [
      'decision_id',
      'transaction_id',
      'risk_score',
      'risk_band',
      'model_version',
      'decision',
      'timestamp'
    ]);
  });
});

test.describe('Fraud Risk Evaluation - Malformed Data Tests', () => {
  test('TC-003: Verify malformed transaction with missing required fields fails evaluation', async ({ page }) => {
    const fraudRiskPage = new FraudRiskEvaluationPage(page);
    
    const malformedTransactionData = {
      account_id: 'ACC-12345',
      card_id: 'CARD-6789',
      merchant: 'TestMerchant',
      currency: 'USD',
      timestamp: '2026-08-15T12:00:00Z'
    };
    
    await fraudRiskPage.prepareTransactionEvent(malformedTransactionData);
    const response = await fraudRiskPage.sendTransactionToFraudEngine('/api/v1/fraud/evaluate', malformedTransactionData);
    await fraudRiskPage.verifyTransactionReceived(response);
    
    const evaluationResult = await fraudRiskPage.attemptRiskEvaluation(malformedTransactionData);
    await fraudRiskPage.verifyEvaluationFailed(evaluationResult);
    await fraudRiskPage.verifyErrorCode(evaluationResult, ['400', 'ERROR_INVALID_TRANSACTION_DATA']);
    await fraudRiskPage.verifyNoRiskScoreAssigned(evaluationResult);
    
    const auditTrail = await fraudRiskPage.queryAuditTrailForFailure(malformedTransactionData);
    await fraudRiskPage.verifyFailureLoggedInAuditTrail(auditTrail);
  });

  test('TC-004: Verify transaction with invalid data types fails evaluation', async ({ page }) => {
    const fraudRiskPage = new FraudRiskEvaluationPage(page);
    
    const invalidDataTypeTransaction = {
      transaction_id: 'TXN-003',
      account_id: 'ACC-12345',
      card_id: 'CARD-6789',
      merchant: 'TestMerchant',
      amount: 'invalid_amount',
      currency: 'USD',
      timestamp: 'invalid_timestamp',
      channel: 'online'
    };
    
    await fraudRiskPage.prepareTransactionEvent(invalidDataTypeTransaction);
    const response = await fraudRiskPage.sendTransactionToFraudEngine('/api/v1/fraud/evaluate', invalidDataTypeTransaction);
    await fraudRiskPage.verifyTransactionReceived(response);
    
    const evaluationResult = await fraudRiskPage.attemptRiskEvaluation(invalidDataTypeTransaction);
    await fraudRiskPage.verifyEvaluationFailed(evaluationResult);
    await fraudRiskPage.verifyErrorCode(evaluationResult, ['400', 'ERROR_INVALID_DATA_TYPE']);
    await fraudRiskPage.verifyNoRiskScoreAssigned(evaluationResult);
    
    const auditTrail = await fraudRiskPage.queryAuditTrail(invalidDataTypeTransaction.transaction_id);
    await fraudRiskPage.verifyFailureLoggedInAuditTrail(auditTrail);
  });
});

test.describe('Fraud Risk Evaluation - Concurrent Transaction Tests', () => {
  test('TC-005: Verify concurrent transactions are processed independently', async ({ page }) => {
    const fraudRiskPage = new FraudRiskEvaluationPage(page);
    
    const transactions = [
      {
        transaction_id: 'TXN-101',
        account_id: 'ACC-12345',
        card_id: 'CARD-6789',
        merchant: 'Merchant1',
        amount: 100.00,
        currency: 'USD',
        timestamp: '2026-08-15T13:00:00Z',
        channel: 'online'
      },
      {
        transaction_id: 'TXN-102',
        account_id: 'ACC-12345',
        card_id: 'CARD-6789',
        merchant: 'Merchant2',
        amount: 200.00,
        currency: 'USD',
        timestamp: '2026-08-15T13:00:01Z',
        channel: 'online'
      },
      {
        transaction_id: 'TXN-103',
        account_id: 'ACC-12345',
        card_id: 'CARD-6789',
        merchant: 'Merchant3',
        amount: 300.00,
        currency: 'USD',
        timestamp: '2026-08-15T13:00:02Z',
        channel: 'online'
      },
      {
        transaction_id: 'TXN-104',
        account_id: 'ACC-12345',
        card_id: 'CARD-6789',
        merchant: 'Merchant4',
        amount: 400.00,
        currency: 'USD',
        timestamp: '2026-08-15T13:00:03Z',
        channel: 'online'
      },
      {
        transaction_id: 'TXN-105',
        account_id: 'ACC-12345',
        card_id: 'CARD-6789',
        merchant: 'Merchant5',
        amount: 500.00,
        currency: 'USD',
        timestamp: '2026-08-15T13:00:04Z',
        channel: 'online'
      }
    ];
    
    await fraudRiskPage.prepareMultipleTransactionEvents(transactions);
    const responses = await fraudRiskPage.sendConcurrentTransactions('/api/v1/fraud/evaluate', transactions);
    await fraudRiskPage.verifyAllTransactionsReceived(responses);
    
    const evaluations = await fraudRiskPage.triggerConcurrentRiskEvaluations(transactions);
    await fraudRiskPage.verifyEachTransactionHasUniqueRiskScore(evaluations);
    await fraudRiskPage.verifyEachTransactionHasRiskBand(evaluations);
    
    const auditTrailRecords = await fraudRiskPage.queryAuditTrailForMultipleTransactions(
      transactions.map(t => t.transaction_id)
    );
    await fraudRiskPage.verifyAuditTrailContainsExactCount(auditTrailRecords, 5);
    await fraudRiskPage.verifyNoDuplicateOrCorruptedEntries(auditTrailRecords);
  });
});

test.describe('Alert Policy Evaluation - Threshold Trigger Tests', () => {
  test('TC-006: Verify alert triggered when risk score exceeds threshold', async ({ page }) => {
    const policyPage = new PolicyEvaluationPage(page);
    const thresholdPage = new ThresholdConfigurationPage(page);
    
    await thresholdPage.configureAlertThreshold(75);
    await thresholdPage.verifyThresholdSet(75);
    
    const transactionData = {
      transaction_id: 'TXN-201',
      risk_score: 85
    };
    
    await policyPage.prepareTransactionWithRiskScore(transactionData);
    const evaluationResponse = await policyPage.submitTransactionForPolicyEvaluation('/api/v1/policy/evaluate', transactionData);
    await policyPage.verifyTransactionEvaluated(evaluationResponse);
    
    await policyPage.verifyAlertWorkflowTriggered(transactionData.transaction_id, true);
    
    const decisionRecord = await policyPage.queryDecisionRecord(transactionData.transaction_id);
    await policyPage.verifyDecisionRecordContainsFields(decisionRecord, [
      'transaction_id',
      'risk_score',
      'threshold_used',
      'decision',
      'timestamp'
    ]);
    
    const auditTrail = await policyPage.queryAuditTrail(transactionData.transaction_id);
    await policyPage.verifyThresholdLoggedInAuditTrail(auditTrail, 75);
  });

  test('TC-007: Verify alert triggered when risk score equals threshold (boundary condition)', async ({ page }) => {
    const policyPage = new PolicyEvaluationPage(page);
    const thresholdPage = new ThresholdConfigurationPage(page);
    
    await thresholdPage.configureAlertThreshold(75);
    await thresholdPage.verifyThresholdSet(75);
    
    const transactionData = {
      transaction_id: 'TXN-202',
      risk_score: 75
    };
    
    await policyPage.prepareTransactionWithRiskScore(transactionData);
    const evaluationResponse = await policyPage.submitTransactionForPolicyEvaluation('/api/v1/policy/evaluate', transactionData);
    await policyPage.verifyTransactionEvaluated(evaluationResponse);
    
    await policyPage.verifyAlertWorkflowTriggered(transactionData.transaction_id, true);
    
    const decisionRecord = await policyPage.queryDecisionRecord(transactionData.transaction_id);
    await policyPage.verifyDecisionRecordContainsFields(decisionRecord, [
      'transaction_id',
      'risk_score',
      'threshold_used',
      'decision',
      'timestamp'
    ]);
    
    const auditTrail = await policyPage.queryAuditTrail(transactionData.transaction_id);
    await policyPage.verifyThresholdAndRiskScoreInAuditTrail(auditTrail, 75, 75);
  });
});

test.describe('Alert Policy Evaluation - No Alert Tests', () => {
  test('TC-008: Verify no alert triggered when risk score below threshold', async ({ page }) => {
    const policyPage = new PolicyEvaluationPage(page);
    const thresholdPage = new ThresholdConfigurationPage(page);
    
    await thresholdPage.configureAlertThreshold(75);
    await thresholdPage.verifyThresholdSet(75);
    
    const transactionData = {
      transaction_id: 'TXN-203',
      risk_score: 60
    };
    
    await policyPage.prepareTransactionWithRiskScore(transactionData);
    const evaluationResponse = await policyPage.submitTransactionForPolicyEvaluation('/api/v1/policy/evaluate', transactionData);
    await policyPage.verifyTransactionEvaluated(evaluationResponse);
    
    await policyPage.verifyAlertWorkflowTriggered(transactionData.transaction_id, false);
    
    const transactionStatus = await policyPage.queryTransactionStatus(transactionData.transaction_id);
    await policyPage.verifyTransactionApproved(transactionStatus);
    
    const auditTrail = await policyPage.queryAuditTrail(transactionData.transaction_id);
    await policyPage.verifyNoAlertDecisionInAuditTrail(auditTrail, 60, 75);
  });
});

test.describe('Threshold Configuration - Invalid Configuration Tests', () => {
  test('TC-009: Verify invalid non-numeric threshold is rejected', async ({ page }) => {
    const thresholdPage = new ThresholdConfigurationPage(page);
    
    const invalidThreshold = 'invalid_threshold';
    const configResponse = await thresholdPage.attemptConfigureThreshold('/api/v1/config/threshold', invalidThreshold);
    await thresholdPage.verifyConfigurationSubmitted(configResponse);
    
    await thresholdPage.verifyConfigurationRejected(configResponse);
    await thresholdPage.verifyValidationError(configResponse, ['400', 'ERROR_INVALID_THRESHOLD']);
    await thresholdPage.verifyErrorMessage(configResponse, 'Threshold must be numeric');
    
    const testTransaction = {
      transaction_id: 'TXN-204',
      risk_score: 80
    };
    
    await thresholdPage.prepareTestTransaction(testTransaction);
    const evaluationResult = await thresholdPage.attemptEvaluateWithInvalidThreshold(testTransaction);
    await thresholdPage.verifyEvaluationFailedDueToInvalidConfiguration(evaluationResult);
  });

  test('TC-010: Verify null or empty threshold is rejected', async ({ page }) => {
    const thresholdPage = new ThresholdConfigurationPage(page);
    
    const nullThreshold = null;
    const configResponse = await thresholdPage.attemptConfigureThreshold('/api/v1/config/threshold', nullThreshold);
    await thresholdPage.verifyConfigurationSubmitted(configResponse);
    
    await thresholdPage.verifyConfigurationRejected(configResponse);
    await thresholdPage.verifyValidationError(configResponse, ['400', 'ERROR_MISSING_THRESHOLD']);
    await thresholdPage.verifyErrorMessage(configResponse, 'Threshold value is required');
    
    const testTransaction = {
      transaction_id: 'TXN-205',
      risk_score: 90
    };
    
    await thresholdPage.prepareTestTransaction(testTransaction);
    const evaluationResult = await thresholdPage.attemptEvaluateWithInvalidThreshold(testTransaction);
    await thresholdPage.verifyEvaluationFailedDueToMissingConfiguration(evaluationResult);
  });
});