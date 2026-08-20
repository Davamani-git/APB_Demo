const { test, expect } = require('@playwright/test');
const { FraudRiskEnginePage } = require('./pages/fraudRiskEngine.page');
const { PolicyEnginePage } = require('./pages/policyEngine.page');

test.describe('Fraud Risk Engine - Valid Transaction Processing', () => {
  test('TC-001: Verify fraud-risk engine evaluates valid transaction and produces risk score and classification', async ({ page }) => {
    const fraudRiskPage = new FraudRiskEnginePage(page);
    
    // Step 1: Prepare valid transaction event
    const transactionData = {
      transaction_id: 'TXN12345',
      card_id: 'CARD67890',
      amount: 150.00,
      currency: 'USD',
      merchant: 'TestMerchant',
      timestamp: '2026-08-15T10:30:00Z'
    };
    await fraudRiskPage.prepareTransactionEvent(transactionData);
    await expect(fraudRiskPage.transactionEventStatus).toHaveText('ready');
    
    // Step 2: Send transaction event to authorization platform
    await fraudRiskPage.sendTransactionEvent(transactionData);
    await expect(fraudRiskPage.eventReceivedStatus).toHaveText('successfully received');
    
    // Step 3: Trigger fraud-risk engine evaluation
    const riskSignals = {
      transaction_amount: 150.00,
      merchant_category: 'retail',
      location: 'US',
      velocity: 'normal'
    };
    await fraudRiskPage.triggerFraudRiskEvaluation(riskSignals);
    await expect(fraudRiskPage.riskEngineProcessingStatus).toContainText('processed');
    await expect(fraudRiskPage.evaluatedSignals).toContainText('transaction amount');
    await expect(fraudRiskPage.evaluatedSignals).toContainText('merchant category');
    await expect(fraudRiskPage.evaluatedSignals).toContainText('geographic data');
    await expect(fraudRiskPage.evaluatedSignals).toContainText('velocity patterns');
    
    // Step 4: Verify risk score and risk band classification
    const expectedRiskScore = 45;
    const expectedRiskBand = 'Low';
    await fraudRiskPage.verifyRiskScoreAndBand(expectedRiskScore, expectedRiskBand);
    await expect(fraudRiskPage.riskScoreValue).toHaveText(expectedRiskScore.toString());
    await expect(fraudRiskPage.riskBandClassification).toHaveText(expectedRiskBand);
    
    // Step 5: Verify audit trail record
    const auditData = {
      transaction_id: 'TXN12345',
      risk_score: 45,
      risk_band: 'Low',
      model_version: 'v2.1',
      timestamp: '2026-08-15T10:30:05Z'
    };
    await fraudRiskPage.verifyAuditTrail(auditData);
    await expect(fraudRiskPage.auditTrailRecord).toContainText('TXN12345');
    await expect(fraudRiskPage.auditTrailRecord).toContainText('45');
    await expect(fraudRiskPage.auditTrailRecord).toContainText('Low');
    await expect(fraudRiskPage.auditTrailRecord).toContainText('v2.1');
  });
});

test.describe('Fraud Risk Engine - Malformed Transaction Handling', () => {
  test('TC-002: Verify system rejects transaction missing transaction_id and logs error', async ({ page }) => {
    const fraudRiskPage = new FraudRiskEnginePage(page);
    
    // Step 1: Prepare malformed transaction event missing transaction_id
    const malformedData = {
      card_id: 'CARD67890',
      amount: 200.00,
      currency: 'USD',
      merchant: 'TestMerchant',
      timestamp: '2026-08-15T11:00:00Z'
    };
    await fraudRiskPage.prepareMalformedTransactionEvent(malformedData);
    await expect(fraudRiskPage.transactionEventStatus).toHaveText('ready');
    
    // Step 2: Send malformed transaction event
    await fraudRiskPage.sendTransactionEvent(malformedData);
    await expect(fraudRiskPage.eventReceivedStatus).toHaveText('received');
    
    // Step 3: Fraud-risk engine attempts to evaluate malformed transaction
    await fraudRiskPage.attemptEvaluationWithMissingField('transaction_id');
    await expect(fraudRiskPage.rejectionStatus).toContainText('rejected');
    await expect(fraudRiskPage.rejectionReason).toContainText('missing required field');
    
    // Step 4: Verify error log with failure reason
    const expectedError = 'Transaction event rejected: missing required field transaction_id';
    await fraudRiskPage.verifyErrorLog(expectedError);
    await expect(fraudRiskPage.errorLogMessage).toContainText('missing required field transaction_id');
    
    // Step 5: Verify no risk score or audit record created
    await fraudRiskPage.verifyNoRiskScoreGenerated();
    await fraudRiskPage.verifyNoAuditRecord(malformedData);
    await expect(fraudRiskPage.riskScoreValue).toHaveText('N/A');
    await expect(fraudRiskPage.auditRecordCount).toHaveText('0');
  });
  
  test('TC-003: Verify system rejects transaction missing card_id and logs error', async ({ page }) => {
    const fraudRiskPage = new FraudRiskEnginePage(page);
    
    // Step 1: Prepare malformed transaction event missing card_id
    const malformedData = {
      transaction_id: 'TXN54321',
      amount: 300.00,
      currency: 'USD',
      merchant: 'TestMerchant',
      timestamp: '2026-08-15T11:15:00Z'
    };
    await fraudRiskPage.prepareMalformedTransactionEvent(malformedData);
    await expect(fraudRiskPage.transactionEventStatus).toHaveText('ready');
    
    // Step 2: Send malformed transaction event
    await fraudRiskPage.sendTransactionEvent(malformedData);
    await expect(fraudRiskPage.eventReceivedStatus).toHaveText('received');
    
    // Step 3: Fraud-risk engine attempts to evaluate malformed transaction
    await fraudRiskPage.attemptEvaluationWithMissingField('card_id');
    await expect(fraudRiskPage.rejectionStatus).toContainText('rejected');
    await expect(fraudRiskPage.rejectionReason).toContainText('missing required field');
    
    // Step 4: Verify error log with failure reason
    const expectedError = 'Transaction event rejected: missing required field card_id';
    await fraudRiskPage.verifyErrorLog(expectedError);
    await expect(fraudRiskPage.errorLogMessage).toContainText('missing required field card_id');
    
    // Step 5: Verify no risk score or audit record created
    await fraudRiskPage.verifyNoRiskScoreGenerated();
    await fraudRiskPage.verifyNoAuditRecord(malformedData);
    await expect(fraudRiskPage.riskScoreValue).toHaveText('N/A');
    await expect(fraudRiskPage.auditRecordCount).toHaveText('0');
  });
});

test.describe('Fraud Risk Engine - Service Unavailability Handling', () => {
  test('TC-004: Verify fail-safe policy applied when fraud-risk engine is unavailable', async ({ page }) => {
    const fraudRiskPage = new FraudRiskEnginePage(page);
    
    // Step 1: Simulate fraud-risk engine unavailability
    await fraudRiskPage.simulateEngineUnavailability();
    await expect(fraudRiskPage.engineStatus).toHaveText('unavailable');
    
    // Step 2: Prepare and send valid transaction event
    const transactionData = {
      transaction_id: 'TXN99999',
      card_id: 'CARD11111',
      amount: 500.00,
      currency: 'USD',
      merchant: 'TestMerchant',
      timestamp: '2026-08-15T12:00:00Z'
    };
    await fraudRiskPage.prepareTransactionEvent(transactionData);
    await fraudRiskPage.sendTransactionEvent(transactionData);
    await expect(fraudRiskPage.eventReceivedStatus).toHaveText('received');
    
    // Step 3: System attempts evaluation and detects unavailability
    await fraudRiskPage.attemptEvaluationWithUnavailableEngine();
    await expect(fraudRiskPage.engineDetectionStatus).toContainText('unavailable');
    
    // Step 4: Verify fail-safe policy applied
    const expectedFailSafeAction = 'approve transaction with monitoring flag';
    await fraudRiskPage.verifyFailSafePolicyApplied(expectedFailSafeAction);
    await expect(fraudRiskPage.failSafeAction).toContainText('approve');
    await expect(fraudRiskPage.failSafeAction).toContainText('monitoring flag');
    
    // Step 5: Verify engine unavailability recorded in audit trail
    const auditEntry = {
      transaction_id: 'TXN99999',
      condition: 'fraud_engine_unavailable',
      timestamp: '2026-08-15T12:00:05Z'
    };
    await fraudRiskPage.verifyUnavailabilityAuditRecord(auditEntry);
    await expect(fraudRiskPage.auditTrailRecord).toContainText('TXN99999');
    await expect(fraudRiskPage.auditTrailRecord).toContainText('fraud_engine_unavailable');
    
    // Step 6: Verify no fabricated risk score generated
    await fraudRiskPage.verifyNoRiskScoreGenerated();
    await expect(fraudRiskPage.riskScoreValue).toHaveText('null');
  });
});

test.describe('Policy Engine - Alert Creation and Action Mapping', () => {
  test('TC-005: Verify alert created and action determined when risk score exceeds threshold', async ({ page }) => {
    const policyEnginePage = new PolicyEnginePage(page);
    
    // Step 1: Configure alert threshold
    await policyEnginePage.configureAlertThreshold(75);
    await expect(policyEnginePage.alertThresholdValue).toHaveText('75');
    
    // Step 2: Generate transaction with risk score exceeding threshold
    const transactionData = {
      transaction_id: 'TXN22222',
      risk_score: 85
    };
    await policyEnginePage.generateTransactionWithRiskScore(transactionData);
    await expect(policyEnginePage.riskScoreCalculated).toHaveText('85');
    
    // Step 3: Policy engine evaluates risk decision against threshold
    await policyEnginePage.evaluateRiskAgainstThreshold(85, 75);
    await expect(policyEnginePage.thresholdEvaluationResult).toContainText('exceeds threshold');
    
    // Step 4: Verify alert created with risk band classification
    const alertData = {
      alert_id: 'ALT12345',
      risk_band: 'High',
      transaction_id: 'TXN22222'
    };
    await policyEnginePage.verifyAlertCreated(alertData);
    await expect(policyEnginePage.alertRecord).toContainText('ALT12345');
    await expect(policyEnginePage.alertRiskBand).toHaveText('High');
    
    // Step 5: Verify action determined according to risk-to-action mapping
    const expectedAction = 'approve_with_alert';
    const riskBand = 'High';
    await policyEnginePage.verifyActionDetermined(expectedAction, riskBand);
    await expect(policyEnginePage.determinedAction).toHaveText('approve_with_alert');
  });
  
  test('TC-006: Verify no alert created when risk score is below threshold', async ({ page }) => {
    const policyEnginePage = new PolicyEnginePage(page);
    
    // Step 1: Configure alert threshold
    await policyEnginePage.configureAlertThreshold(75);
    await expect(policyEnginePage.alertThresholdValue).toHaveText('75');
    
    // Step 2: Generate transaction with risk score below threshold
    const transactionData = {
      transaction_id: 'TXN33333',
      risk_score: 60
    };
    await policyEnginePage.generateTransactionWithRiskScore(transactionData);
    await expect(policyEnginePage.riskScoreCalculated).toHaveText('60');
    
    // Step 3: Policy engine evaluates risk decision against threshold
    await policyEnginePage.evaluateRiskAgainstThreshold(60, 75);
    await expect(policyEnginePage.thresholdEvaluationResult).toContainText('below threshold');
    
    // Step 4: Verify no alert created
    await policyEnginePage.verifyNoAlertCreated('TXN33333');
    await expect(policyEnginePage.alertQueryResult).toHaveText('no results');
    
    // Step 5: Verify transaction proceeds without fraud intervention
    await policyEnginePage.verifyTransactionProceedsNormally('TXN33333');
    await expect(policyEnginePage.transactionStatus).toHaveText('approved');
    await expect(policyEnginePage.fraudIntervention).toHaveText('none');
  });
});

test.describe('Policy Engine - Dynamic Threshold Configuration', () => {
  test('TC-007: Verify threshold update takes effect immediately without system restart', async ({ page }) => {
    const policyEnginePage = new PolicyEnginePage(page);
    
    // Step 1: Configure initial alert threshold
    await policyEnginePage.configureAlertThreshold(75);
    await expect(policyEnginePage.alertThresholdValue).toHaveText('75');
    
    // Step 2: Update threshold without system restart
    await policyEnginePage.updateAlertThresholdWithoutRestart(80);
    await expect(policyEnginePage.alertThresholdValue).toHaveText('80');
    
    // Step 3: Verify threshold update takes effect immediately
    await policyEnginePage.verifyActiveThreshold(80);
    await expect(policyEnginePage.activeAlertThreshold).toHaveText('80');
    
    // Step 4: Generate transaction with risk score between old and new thresholds
    const transactionData = {
      transaction_id: 'TXN44444',
      risk_score: 78
    };
    await policyEnginePage.generateTransactionWithRiskScore(transactionData);
    await expect(policyEnginePage.riskScoreCalculated).toHaveText('78');
    
    // Step 5: Policy engine evaluates using new threshold
    await policyEnginePage.evaluateRiskAgainstThreshold(78, 80);
    await expect(policyEnginePage.thresholdEvaluationResult).toContainText('below threshold');
    await expect(policyEnginePage.appliedThreshold).toHaveText('80');
    
    // Step 6: Verify no alert triggered
    await policyEnginePage.verifyNoAlertCreated('TXN44444');
    await expect(policyEnginePage.alertQueryResult).toHaveText('no results');
    
    // Step 7: Verify ongoing transaction processing not impacted
    await policyEnginePage.verifyTransactionProcessingNormal('TXN44444');
    await expect(policyEnginePage.transactionStatus).toHaveText('approved');
    await expect(policyEnginePage.processingStatus).toHaveText('normal');
  });
});