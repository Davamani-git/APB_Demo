const { test, expect } = require('@playwright/test');
const { FraudAlertPage } = require('./pages/fraudAlert.page');
const logger = require('../../utils/logger');

test.describe('Fraud Alert Creation and Decision Logic', () => {

  test('TC-005: QE-4481 TS-001 TC-001 - Verify alert creation for high-risk transactions', async ({ page }) => {
    logger.info('Starting test: Alert creation for high-risk transactions');
    const fraudAlert = new FraudAlertPage(page);
    
    // Step 1: Configure alert threshold policy
    const thresholdConfig = {
      alert_threshold: 75,
      risk_band: 'High'
    };
    
    await fraudAlert.configureAlertThreshold(thresholdConfig);
    await expect(fraudAlert.thresholdConfigStatus).toHaveText('configured');
    logger.info('Step 1: Alert threshold set - high risk threshold = 75');
    
    // Step 2: Simulate high-risk transaction
    const transactionData = {
      transaction_id: 'TXN-005',
      risk_score: 85,
      amount: 2500.00,
      merchant: 'Unknown Online Retailer'
    };
    
    await fraudAlert.simulateHighRiskTransaction(transactionData);
    await expect(fraudAlert.transactionEvaluationStatus).toHaveText('evaluated');
    logger.info('Step 2: Transaction evaluated and assigned high risk score');
    
    // Step 3: Verify risk evaluation against threshold
    await fraudAlert.evaluateRiskAgainstThreshold();
    const thresholdExceeded = await fraudAlert.isThresholdExceeded();
    expect(thresholdExceeded).toBe(true);
    logger.info('Step 3: System identified risk score (85) exceeds threshold (75)');
    
    // Step 4: Verify transaction categorization
    const riskBand = await fraudAlert.getTransactionRiskBand();
    expect(riskBand).toBe('High');
    logger.info('Step 4: Transaction categorized with risk_band: High');
    
    // Step 5: Verify alert creation
    await fraudAlert.waitForAlertCreation();
    const alertDetails = await fraudAlert.getAlertDetails();
    expect(alertDetails.transaction_id).toBe('TXN-005');
    expect(alertDetails.severity).toBe('High');
    expect(alertDetails.status).toBe('Created');
    expect(alertDetails.alert_id).toBeTruthy();
    logger.info(`Step 5: Alert record created - alert_id: ${alertDetails.alert_id}, status: Created`);
    
    // Step 6: Verify fraud_alert_created event is logged
    const analyticsLog = await fraudAlert.getAnalyticsLog();
    expect(analyticsLog).toContain('fraud_alert_created');
    await expect(fraudAlert.alertCreatedTimestamp).toBeVisible();
    logger.info('Step 6: Analytics log contains fraud_alert_created event with timestamp and alert_id');
  });

  test('TC-006: QE-4481 TS-002 TC-001 - Verify no alert for low-risk transactions', async ({ page }) => {
    logger.info('Starting test: No alert creation for low-risk transactions');
    const fraudAlert = new FraudAlertPage(page);
    
    // Step 1: Configure alert threshold policy
    const thresholdConfig = {
      alert_threshold: 50,
      risk_band: 'Medium'
    };
    
    await fraudAlert.configureAlertThreshold(thresholdConfig);
    await expect(fraudAlert.thresholdConfigStatus).toHaveText('configured');
    logger.info('Step 1: Alert threshold set - alert threshold = 50');
    
    // Step 2: Simulate low-risk transaction
    const transactionData = {
      transaction_id: 'TXN-006',
      risk_score: 20,
      amount: 45.00,
      merchant: 'Local Grocery Store'
    };
    
    await fraudAlert.simulateLowRiskTransaction(transactionData);
    await expect(fraudAlert.transactionEvaluationStatus).toHaveText('evaluated');
    logger.info('Step 2: Transaction evaluated and assigned low risk score');
    
    // Step 3: Verify risk evaluation against threshold
    await fraudAlert.evaluateRiskAgainstThreshold();
    const thresholdExceeded = await fraudAlert.isThresholdExceeded();
    expect(thresholdExceeded).toBe(false);
    logger.info('Step 3: System identified risk score (20) is below threshold (50)');
    
    // Step 4: Verify no alert is triggered
    const initialAlertCount = await fraudAlert.getAlertCount();
    await fraudAlert.waitForProcessingComplete();
    const finalAlertCount = await fraudAlert.getAlertCount();
    expect(finalAlertCount).toBe(initialAlertCount);
    logger.info('Step 4: No alert record created; alert count remains unchanged');
    
    // Step 5: Verify low-risk treatment policy
    const treatmentPolicy = await fraudAlert.getTransactionTreatment();
    const riskBand = await fraudAlert.getTransactionRiskBand();
    expect(treatmentPolicy).toBe('approve');
    expect(riskBand).toBe('Low');
    logger.info('Step 5: Transaction approved with risk_band: Low and no fraud intervention');
    
    // Step 6: Verify no fraud_alert_created event
    const analyticsLog = await fraudAlert.getAnalyticsLogForTransaction('TXN-006');
    expect(analyticsLog).not.toContain('fraud_alert_created');
    logger.info('Step 6: Analytics log does not contain fraud_alert_created event for transaction_id: TXN-006');
  });

  test('TC-007: QE-4481 TS-003 TC-001 - Verify fail-safe when risk threshold configuration is unavailable', async ({ page }) => {
    logger.info('Starting test: Fail-safe when risk threshold configuration is unavailable');
    const fraudAlert = new FraudAlertPage(page);
    
    // Step 1: Simulate threshold configuration unavailability
    await fraudAlert.simulateThresholdConfigUnavailable();
    const configStatus = await fraudAlert.getThresholdConfigStatus();
    expect(['UNAVAILABLE', 'CORRUPTED']).toContain(configStatus);
    logger.info('Step 1: Risk threshold configuration confirmed as unavailable or invalid');
    
    // Step 2: Simulate transaction with risk score
    const transactionData = {
      transaction_id: 'TXN-007',
      risk_score: 60,
      amount: 300.00,
      merchant: 'Electronics Store'
    };
    
    await fraudAlert.simulateTransaction(transactionData);
    await expect(fraudAlert.transactionEvaluationStatus).toHaveText('evaluated');
    logger.info('Step 2: Transaction evaluated and assigned risk score');
    
    // Step 3: Verify system detects configuration unavailability
    await fraudAlert.attemptRiskEvaluation();
    await expect(fraudAlert.configUnavailabilityDetected).toBeVisible();
    logger.info('Step 3: System detects threshold configuration is unavailable');
    
    // Step 4: Verify fail-safe policy application
    const failSafePolicy = await fraudAlert.getAppliedFailSafePolicy();
    expect(['approve-with-monitoring', 'default-policy']).toContain(failSafePolicy);
    
    const unintendedAlert = await fraudAlert.checkForUnintendedAlert('TXN-007');
    expect(unintendedAlert).toBe(false);
    
    const transactionBlocked = await fraudAlert.isTransactionBlocked('TXN-007');
    expect(transactionBlocked).toBe(false);
    logger.info('Step 4: Fail-safe policy applied without creating unintended alerts or blocking legitimate transactions');
    
    // Step 5: Verify configuration unavailability is logged
    const systemLogs = await fraudAlert.getSystemLogs();
    expect(systemLogs).toContain('threshold_config_unavailable');
    await expect(fraudAlert.configUnavailableTimestamp).toBeVisible();
    logger.info('Step 5: System logs contain threshold_config_unavailable entry with timestamp');
    
    // Step 6: Verify transaction processing continues
    const processingStatus = await fraudAlert.getTransactionProcessingStatus('TXN-007');
    expect(processingStatus).toBe('completed');
    logger.info('Step 6: Transaction not blocked inappropriately; processing completed successfully');
  });
});
