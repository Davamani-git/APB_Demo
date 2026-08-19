const { test, expect } = require('@playwright/test');
const { FraudRiskEnginePage } = require('./pages/fraudRiskEngine.page');
const logger = require('../../utils/logger');

test.describe('Fraud Risk Engine - Real-Time Risk Scoring', () => {

  test('TC-001: QE-4482 TS-001 TC-001 - Verify real-time risk score calculation with complete transaction data', async ({ page }) => {
    logger.info('Starting test: Real-time risk score calculation with complete transaction data');
    const fraudRiskEngine = new FraudRiskEnginePage(page);
    
    // Step 1: Prepare transaction event with complete data
    const transactionData = {
      transaction_id: 'TXN-001',
      card_id: 'CARD-5678',
      amount: 150.00,
      merchant: 'Amazon.com',
      geography: 'New York, USA',
      device: 'iPhone 14',
      velocity: '2 transactions in last hour',
      timestamp: '2026-08-15T10:30:00Z'
    };
    
    await fraudRiskEngine.prepareTransactionEvent(transactionData);
    await expect(fraudRiskEngine.transactionEventStatus).toHaveText('ready');
    logger.info('Step 1: Transaction event prepared with all required risk signal data');
    
    // Step 2: Send transaction event to fraud-risk engine
    const startTime = Date.now();
    await fraudRiskEngine.sendTransactionToFraudEngine(transactionData);
    await expect(fraudRiskEngine.engineReceiptStatus).toHaveText('received');
    logger.info('Step 2: Transaction event successfully received by fraud-risk engine');
    
    // Step 3: Verify risk signals are analyzed
    await fraudRiskEngine.waitForRiskAnalysis();
    await expect(fraudRiskEngine.riskAnalysisStatus).toHaveText('completed');
    logger.info('Step 3: All risk signals processed and analyzed successfully');
    
    // Step 4: Verify valid risk score is returned
    const riskScore = await fraudRiskEngine.getRiskScore();
    const riskBand = await fraudRiskEngine.getRiskBand();
    expect(riskScore).toBeGreaterThanOrEqual(0);
    expect(riskScore).toBeLessThanOrEqual(100);
    expect(riskBand).toBeTruthy();
    logger.info(`Step 4: Valid risk score returned - risk_score: ${riskScore}, risk_band: ${riskBand}`);
    
    // Step 5: Verify SLA compliance
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    expect(processingTime).toBeLessThan(500);
    logger.info(`Step 5: Risk score returned within SLA - Processing time: ${processingTime}ms`);
  });

  test('TC-002: QE-4482 TS-002 TC-001 - Verify graceful handling of incomplete data (missing device)', async ({ page }) => {
    logger.info('Starting test: Graceful handling of incomplete data - missing device');
    const fraudRiskEngine = new FraudRiskEnginePage(page);
    
    // Step 1: Prepare transaction event with missing device data
    const transactionData = {
      transaction_id: 'TXN-002',
      card_id: 'CARD-1234',
      amount: 200.00,
      merchant: 'Best Buy',
      geography: 'California, USA',
      device: null,
      velocity: '1 transaction in last hour'
    };
    
    await fraudRiskEngine.prepareTransactionEvent(transactionData);
    await expect(fraudRiskEngine.transactionEventStatus).toHaveText('ready');
    logger.info('Step 1: Transaction event prepared with partial data (no device information)');
    
    // Step 2: Send incomplete transaction event
    await fraudRiskEngine.sendTransactionToFraudEngine(transactionData);
    await expect(fraudRiskEngine.engineReceiptStatus).toHaveText('received');
    logger.info('Step 2: Incomplete transaction event received by fraud-risk engine');
    
    // Step 3: Verify graceful handling
    await fraudRiskEngine.waitForRiskAnalysis();
    await expect(fraudRiskEngine.systemErrorStatus).not.toHaveText('failure');
    logger.info('Step 3: System handles missing device data gracefully without system failure');
    
    // Step 4: Verify risk score calculation or fail-safe policy
    const riskScore = await fraudRiskEngine.getRiskScore();
    const failSafeApplied = await fraudRiskEngine.isFailSafePolicyApplied();
    
    if (riskScore !== null) {
      expect(riskScore).toBeGreaterThanOrEqual(0);
      logger.info(`Step 4: Risk score calculated using available signals - risk_score: ${riskScore}`);
    } else if (failSafeApplied) {
      await expect(fraudRiskEngine.failSafeLog).toBeVisible();
      logger.info('Step 4: Fail-safe policy applied with appropriate logging');
    }
    
    // Step 5: Verify no critical errors
    const systemLogs = await fraudRiskEngine.getSystemLogs();
    expect(systemLogs).not.toContain('CRITICAL ERROR');
    expect(systemLogs).not.toContain('EXCEPTION');
    logger.info('Step 5: System logs show graceful handling with no critical errors');
  });

  test('TC-003: QE-4482 TS-002 TC-002 - Verify graceful handling of incomplete data (missing geography)', async ({ page }) => {
    logger.info('Starting test: Graceful handling of incomplete data - missing geography');
    const fraudRiskEngine = new FraudRiskEnginePage(page);
    
    // Step 1: Prepare transaction event with missing geographic data
    const transactionData = {
      transaction_id: 'TXN-003',
      card_id: 'CARD-9876',
      amount: 75.50,
      merchant: 'Starbucks',
      geography: null,
      device: 'Android Samsung S21',
      velocity: '3 transactions in last hour'
    };
    
    await fraudRiskEngine.prepareTransactionEvent(transactionData);
    await expect(fraudRiskEngine.transactionEventStatus).toHaveText('ready');
    logger.info('Step 1: Transaction event prepared with partial data (no geography information)');
    
    // Step 2: Send incomplete transaction event
    await fraudRiskEngine.sendTransactionToFraudEngine(transactionData);
    await expect(fraudRiskEngine.engineReceiptStatus).toHaveText('received');
    logger.info('Step 2: Incomplete transaction event received by fraud-risk engine');
    
    // Step 3: Verify graceful handling
    await fraudRiskEngine.waitForRiskAnalysis();
    await expect(fraudRiskEngine.systemErrorStatus).not.toHaveText('failure');
    logger.info('Step 3: System handles missing geographic data gracefully without system failure');
    
    // Step 4: Verify risk score calculation or fail-safe policy
    const riskScore = await fraudRiskEngine.getRiskScore();
    const failSafeApplied = await fraudRiskEngine.isFailSafePolicyApplied();
    
    if (riskScore !== null) {
      expect(riskScore).toBeGreaterThanOrEqual(0);
      logger.info(`Step 4: Risk score calculated using available signals - risk_score: ${riskScore}`);
    } else if (failSafeApplied) {
      await expect(fraudRiskEngine.failSafeLog).toBeVisible();
      logger.info('Step 4: Fail-safe policy applied with appropriate logging');
    }
    
    // Step 5: Verify no critical errors
    const systemLogs = await fraudRiskEngine.getSystemLogs();
    expect(systemLogs).not.toContain('CRITICAL ERROR');
    expect(systemLogs).not.toContain('EXCEPTION');
    logger.info('Step 5: System logs show graceful handling with no critical errors');
  });

  test('TC-004: QE-4482 TS-003 TC-001 - Verify fail-safe policy when fraud-risk engine is unavailable', async ({ page }) => {
    logger.info('Starting test: Fail-safe policy when fraud-risk engine is unavailable');
    const fraudRiskEngine = new FraudRiskEnginePage(page);
    
    // Step 1: Simulate fraud-risk engine unavailability
    await fraudRiskEngine.simulateEngineUnavailability();
    const engineStatus = await fraudRiskEngine.getEngineStatus();
    expect(engineStatus).toBe('DOWN');
    logger.info('Step 1: Fraud-risk engine confirmed as unavailable');
    
    // Step 2: Prepare and send transaction event
    const transactionData = {
      transaction_id: 'TXN-004',
      card_id: 'CARD-4321',
      amount: 500.00,
      merchant: 'Apple Store'
    };
    
    await fraudRiskEngine.prepareTransactionEvent(transactionData);
    await fraudRiskEngine.sendTransactionToFraudEngine(transactionData);
    logger.info('Step 2: Transaction event sent to the system');
    
    // Step 3: Verify system detects unavailability
    await fraudRiskEngine.waitForEngineDetection();
    await expect(fraudRiskEngine.engineUnavailabilityDetected).toBeVisible();
    logger.info('Step 3: System recognizes engine unavailability and triggers fail-safe logic');
    
    // Step 4: Verify fail-safe policy application
    const failSafePolicy = await fraudRiskEngine.getAppliedFailSafePolicy();
    expect(['approve-with-alert', 'default-medium-risk']).toContain(failSafePolicy);
    logger.info(`Step 4: Fail-safe policy applied - Policy: ${failSafePolicy}`);
    
    // Step 5: Verify unavailability is logged
    const auditLog = await fraudRiskEngine.getAuditLog();
    expect(auditLog).toContain('fraud_engine_unavailable');
    await expect(fraudRiskEngine.auditLogTimestamp).toBeVisible();
    logger.info('Step 5: Audit log contains fraud_engine_unavailable event with timestamp');
    
    // Step 6: Verify transaction is not blocked indefinitely
    const processingComplete = await fraudRiskEngine.waitForTransactionCompletion(2000);
    expect(processingComplete).toBe(true);
    logger.info('Step 6: Transaction completed processing within acceptable timeout');
  });
});
