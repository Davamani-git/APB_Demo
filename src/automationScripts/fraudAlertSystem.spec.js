const { test, expect } = require('@playwright/test');
const { FraudAlertConfigurationPage } = require('./pages/fraudAlertConfiguration.page');
const { TransactionIngestionPage } = require('./pages/transactionIngestion.page');
const { RiskEvaluationPage } = require('./pages/riskEvaluation.page');
const { AlertVerificationPage } = require('./pages/alertVerification.page');
const { SystemLogsPage } = require('./pages/systemLogs.page');
const logger = require('../../utils/logger');

test.describe('Fraud Alert System - Alert Creation Tests', () => {

  test('TC-001: Create medium risk alert for transaction with risk score 45', async ({ page }) => {
    logger.info('Starting test: TC-001 - Medium risk alert creation');
    const configPage = new FraudAlertConfigurationPage(page);
    const transactionPage = new TransactionIngestionPage(page);
    const riskPage = new RiskEvaluationPage(page);
    const alertPage = new AlertVerificationPage(page);

    await configPage.navigate();
    await configPage.configureAlertThresholds('0', '30', '31', '60', '61', '90', '91', '100');
    await configPage.verifyThresholdsConfigured();
    logger.info('Alert thresholds configured successfully');

    await transactionPage.navigate();
    await transactionPage.ingestTransaction('TXN12345', '500', 'Unknown Merchant', 'Foreign Country', '45');
    await transactionPage.verifyTransactionReceived('TXN12345');
    logger.info('Transaction TXN12345 ingested successfully');

    await riskPage.navigate();
    await riskPage.verifyRiskScoreCalculated('TXN12345', '45', 'medium');
    logger.info('Risk score 45 calculated and verified');

    await alertPage.navigate();
    await alertPage.verifyAlertCreated('ALT001', 'TXN12345', 'medium', 'Created', 'approve_and_alert');
    logger.info('Alert ALT001 created successfully with medium severity');
  });

  test('TC-002: Create high risk urgent alert for transaction with risk score 75', async ({ page }) => {
    logger.info('Starting test: TC-002 - High risk urgent alert creation');
    const configPage = new FraudAlertConfigurationPage(page);
    const transactionPage = new TransactionIngestionPage(page);
    const riskPage = new RiskEvaluationPage(page);
    const alertPage = new AlertVerificationPage(page);

    await configPage.navigate();
    await configPage.configureAlertThresholds('0', '30', '31', '60', '61', '90', '91', '100');
    await configPage.verifyThresholdsConfigured();
    logger.info('Alert thresholds configured successfully');

    await transactionPage.navigate();
    await transactionPage.ingestTransaction('TXN67890', '2500', 'High-Risk Merchant', 'Blacklisted Region', '75');
    await transactionPage.verifyTransactionReceived('TXN67890');
    logger.info('Transaction TXN67890 ingested successfully');

    await riskPage.navigate();
    await riskPage.verifyRiskScoreCalculated('TXN67890', '75', 'high');
    logger.info('Risk score 75 calculated and verified');

    await alertPage.navigate();
    await alertPage.verifyUrgentAlertCreated('ALT002', 'TXN67890', 'high', 'urgent', 'Created', 'decline_or_stepup');
    logger.info('Urgent alert ALT002 created successfully with high severity');
  });

  test('TC-003: Verify no alert created for low risk transaction with score 15', async ({ page }) => {
    logger.info('Starting test: TC-003 - No alert for low risk transaction');
    const configPage = new FraudAlertConfigurationPage(page);
    const transactionPage = new TransactionIngestionPage(page);
    const riskPage = new RiskEvaluationPage(page);
    const alertPage = new AlertVerificationPage(page);

    await configPage.navigate();
    await configPage.configureAlertThresholds('0', '30', '31', '60', '61', '90', '91', '100');
    await configPage.verifyThresholdsConfigured();
    logger.info('Alert thresholds configured successfully');

    await transactionPage.navigate();
    await transactionPage.ingestTransaction('TXN11111', '50', 'Trusted Merchant', 'Home Country', '15');
    await transactionPage.verifyTransactionReceived('TXN11111');
    logger.info('Transaction TXN11111 ingested successfully');

    await riskPage.navigate();
    await riskPage.verifyRiskScoreCalculated('TXN11111', '15', 'low');
    logger.info('Risk score 15 calculated and verified as low');

    await alertPage.navigate();
    await alertPage.verifyNoAlertCreated('TXN11111');
    logger.info('Verified no alert created for low risk transaction TXN11111');
  });
});

test.describe('Fraud Alert System - Invalid Threshold Configuration Tests', () => {

  test('TC-004: Reject conflicting threshold configuration', async ({ page }) => {
    logger.info('Starting test: TC-004 - Reject conflicting thresholds');
    const configPage = new FraudAlertConfigurationPage(page);
    const logsPage = new SystemLogsPage(page);

    await configPage.navigate();
    await configPage.attemptInvalidThresholdConfiguration('0', '30', '50', '80', '40', '70', '91', '100');
    await configPage.verifyConfigurationRejected('Invalid threshold configuration - high threshold must be greater than medium threshold');
    logger.info('Invalid configuration rejected successfully');

    await logsPage.navigate();
    await logsPage.verifyErrorLogged('ERROR', 'Threshold validation failed - conflicting values detected');
    logger.info('Error logged for conflicting threshold values');

    await configPage.navigate();
    await configPage.verifyPreviousConfigurationActive();
    logger.info('Verified previous valid configuration remains active');
  });

  test('TC-005: Reject negative threshold values', async ({ page }) => {
    logger.info('Starting test: TC-005 - Reject negative threshold values');
    const configPage = new FraudAlertConfigurationPage(page);
    const logsPage = new SystemLogsPage(page);

    await configPage.navigate();
    await configPage.attemptInvalidThresholdConfiguration('-10', '30', '31', '60', '61', '90', '91', '100');
    await configPage.verifyConfigurationRejected('Invalid threshold configuration - negative values not allowed');
    logger.info('Configuration with negative values rejected successfully');

    await logsPage.navigate();
    await logsPage.verifyErrorLogged('ERROR', 'Threshold validation failed - negative values detected');
    logger.info('Error logged for negative threshold values');

    await configPage.navigate();
    await configPage.verifyPreviousConfigurationActive();
    logger.info('Verified previous valid configuration remains active');
  });

  test('TC-006: Reject threshold configuration with gaps', async ({ page }) => {
    logger.info('Starting test: TC-006 - Reject threshold configuration with gaps');
    const configPage = new FraudAlertConfigurationPage(page);
    const logsPage = new SystemLogsPage(page);

    await configPage.navigate();
    await configPage.attemptInvalidThresholdConfiguration('0', '30', '35', '60', '65', '90', '91', '100');
    await configPage.verifyConfigurationRejected('Invalid threshold configuration - gaps detected in risk score ranges');
    logger.info('Configuration with gaps rejected successfully');

    await logsPage.navigate();
    await logsPage.verifyErrorLogged('ERROR', 'Threshold validation failed - range gaps detected');
    logger.info('Error logged for threshold range gaps');

    await configPage.navigate();
    await configPage.verifyPreviousConfigurationActive();
    logger.info('Verified previous valid configuration remains active');
  });
});

test.describe('Fraud Alert System - Dynamic Threshold Update Tests', () => {

  test('TC-007: Update thresholds dynamically and verify alert creation with new values', async ({ page }) => {
    logger.info('Starting test: TC-007 - Dynamic threshold update');
    const configPage = new FraudAlertConfigurationPage(page);
    const transactionPage = new TransactionIngestionPage(page);
    const riskPage = new RiskEvaluationPage(page);
    const alertPage = new AlertVerificationPage(page);

    await configPage.navigate();
    await configPage.configureAlertThresholds('0', '30', '31', '60', '61', '90', '91', '100');
    await configPage.verifyThresholdsConfigured();
    logger.info('Initial alert thresholds configured successfully');

    await configPage.updateAlertThresholds('0', '40', '41', '70', '71', '95', '96', '100');
    await configPage.verifyThresholdsUpdated();
    logger.info('Alert thresholds updated dynamically');

    await transactionPage.navigate();
    await transactionPage.ingestTransaction('TXN22222', '300', 'Moderate Risk Merchant', 'Standard Location', '45');
    await transactionPage.verifyTransactionReceived('TXN22222');
    logger.info('Transaction TXN22222 ingested successfully');

    await riskPage.navigate();
    await riskPage.verifyRiskScoreCalculated('TXN22222', '45', 'medium');
    logger.info('Risk score 45 calculated against updated thresholds');

    await alertPage.navigate();
    await alertPage.verifyAlertWithThresholdVersion('ALT003', 'TXN22222', 'medium', 'approve_and_alert', 'v2');
    logger.info('Alert ALT003 created with updated threshold configuration');
  });

  test('TC-008: Verify different threshold versions applied to sequential transactions', async ({ page }) => {
    logger.info('Starting test: TC-008 - Threshold version tracking');
    const configPage = new FraudAlertConfigurationPage(page);
    const transactionPage = new TransactionIngestionPage(page);
    const riskPage = new RiskEvaluationPage(page);
    const alertPage = new AlertVerificationPage(page);

    await configPage.navigate();
    await configPage.configureAlertThresholds('0', '30', '31', '60', '61', '90', '91', '100');
    await configPage.verifyThresholdsConfigured();
    logger.info('Initial thresholds configured');

    await transactionPage.navigate();
    await transactionPage.ingestTransaction('TXN33333', '200', 'Standard Merchant', 'Standard Location', '35');
    await transactionPage.verifyTransactionReceived('TXN33333');
    logger.info('First transaction TXN33333 processed');

    await alertPage.navigate();
    await alertPage.verifyAlertCreated('ALT_V1', 'TXN33333', 'medium', 'Created', 'approve_and_alert');
    logger.info('Alert created with initial threshold version');

    await configPage.navigate();
    await configPage.updateAlertThresholds('0', '40', '41', '70', '71', '95', '96', '100');
    await configPage.verifyThresholdsUpdated();
    logger.info('Thresholds updated to version 2');

    await transactionPage.navigate();
    await transactionPage.ingestTransaction('TXN44444', '200', 'Standard Merchant', 'Standard Location', '35');
    await transactionPage.verifyTransactionReceived('TXN44444');
    logger.info('Second transaction TXN44444 processed');

    await alertPage.navigate();
    await alertPage.verifyNoAlertCreated('TXN44444');
    logger.info('No alert created for TXN44444 as score 35 falls in low range under updated thresholds');

    await alertPage.verifyThresholdVersions('TXN33333', 'v1', 'TXN44444', 'v2');
    logger.info('Verified different threshold versions applied correctly');
  });

  test('TC-009: Verify threshold update without client app release', async ({ page }) => {
    logger.info('Starting test: TC-009 - Server-side threshold update');
    const configPage = new FraudAlertConfigurationPage(page);
    const transactionPage = new TransactionIngestionPage(page);
    const alertPage = new AlertVerificationPage(page);

    await configPage.navigate();
    await configPage.verifyClientVersion('1.0.0', '2024.01.15');
    logger.info('Client version recorded');

    await configPage.configureAlertThresholds('0', '30', '31', '60', '61', '90', '91', '100');
    await configPage.verifyThresholdsConfigured();
    logger.info('Initial thresholds configured via server-side');

    await configPage.updateAlertThresholds('0', '35', '36', '65', '66', '92', '93', '100');
    await configPage.verifyThresholdsUpdated();
    logger.info('Thresholds updated via server-side configuration');

    await configPage.verifyClientVersionUnchanged('1.0.0', '2024.01.15');
    logger.info('Verified client version remains unchanged');

    await transactionPage.navigate();
    await transactionPage.ingestTransaction('TXN55555', '250', 'Standard Merchant', 'Standard Location', '35');
    await transactionPage.verifyTransactionReceived('TXN55555');
    logger.info('Transaction processed with same client version');

    await alertPage.navigate();
    await alertPage.verifyNoAlertCreatedWithServerConfig('TXN55555', 'low', 'server');
    logger.info('Verified server-side threshold update applied without client release');
  });
});

test.describe('Fraud Alert System - Risk Evaluation Tests', () => {

  test('TC-010: Evaluate high-risk transaction with unusual amount and foreign location', async ({ page }) => {
    logger.info('Starting test: TC-010 - High-risk transaction evaluation');
    const transactionPage = new TransactionIngestionPage(page);
    const riskPage = new RiskEvaluationPage(page);

    await transactionPage.navigate();
    await transactionPage.ingestTransactionWithDetails('TXN98765', 'ACC123', 'CARD456', 'Electronics Store', '5000', 'USD', '2024-01-15T10:30:00Z', 'Russia');
    await transactionPage.verifyTransactionReceived('TXN98765');
    logger.info('High-risk transaction ingested');

    await riskPage.navigate();
    await riskPage.evaluateRiskSignals('TXN98765', '150', '5000', 'USA', 'Russia');
    await riskPage.verifyRiskScoreWithinSLA('TXN98765', '78', 'high', 'decline_or_stepup', '320');
    logger.info('Risk evaluation completed within SLA');

    await riskPage.verifyRiskDecisionRecord('DEC001', 'TXN98765', '78', 'high', 'v2.3', 'decline_or_stepup');
    logger.info('Risk decision record verified');
  });

  test('TC-011: Evaluate transaction with velocity and failed authorization signals', async ({ page }) => {
    logger.info('Starting test: TC-011 - Velocity and failure pattern evaluation');
    const transactionPage = new TransactionIngestionPage(page);
    const riskPage = new RiskEvaluationPage(page);

    await transactionPage.navigate();
    await transactionPage.ingestMultipleTransactions('ACC789', 'CARD999', '200', 5, 3);
    await transactionPage.verifyMultipleTransactionsReceived('TXN11111', 'TXN11115');
    logger.info('Multiple transactions with velocity pattern ingested');

    await riskPage.navigate();
    await riskPage.evaluateVelocitySignals('TXN11115', 5, 3, '2-3 per day');
    await riskPage.verifyRiskScoreWithinSLA('TXN11115', '85', 'high', 'decline_or_stepup', '280');
    logger.info('Velocity-based risk evaluation completed');

    await riskPage.verifyRiskDecisionWithSignals('DEC002', 'TXN11115', '85', 'high', 'velocity,failed_auth', 'decline_or_stepup');
    logger.info('Risk decision with velocity signals verified');
  });

  test('TC-012: Evaluate normal low-risk transaction', async ({ page }) => {
    logger.info('Starting test: TC-012 - Low-risk transaction evaluation');
    const transactionPage = new TransactionIngestionPage(page);
    const riskPage = new RiskEvaluationPage(page);

    await transactionPage.navigate();
    await transactionPage.ingestTransactionWithDetails('TXN77777', 'ACC456', 'CARD123', 'Grocery Store', '75', 'USD', '2024-01-15T14:00:00Z', 'Home City USA');
    await transactionPage.verifyTransactionReceived('TXN77777');
    logger.info('Normal transaction ingested');

    await riskPage.navigate();
    await riskPage.evaluateNormalRiskSignals('TXN77777', '80', '75', 'Trusted', 'Home', 'Normal');
    await riskPage.verifyRiskScoreWithinSLA('TXN77777', '12', 'low', 'approve', '150');
    logger.info('Low-risk evaluation completed');

    await riskPage.verifyRiskDecisionRecord('DEC003', 'TXN77777', '12', 'low', 'approve');
    logger.info('Low-risk decision record verified');
  });
});

test.describe('Fraud Alert System - Incomplete Data Handling Tests', () => {

  test('TC-013: Handle transaction with missing merchant information', async ({ page }) => {
    logger.info('Starting test: TC-013 - Missing merchant data handling');
    const transactionPage = new TransactionIngestionPage(page);
    const riskPage = new RiskEvaluationPage(page);
    const logsPage = new SystemLogsPage(page);

    await transactionPage.navigate();
    await transactionPage.ingestIncompleteTransaction('TXN88888', 'ACC999', 'CARD777', null, '250', 'USD', '2024-01-15T16:00:00Z');
    await transactionPage.verifyTransactionReceived('TXN88888');
    logger.info('Incomplete transaction ingested');

    await riskPage.navigate();
    await riskPage.verifyIncompleteDataDetected('TXN88888', 'merchant');
    await riskPage.verifyFailSafePolicyApplied('TXN88888', 'default_approve');
    logger.info('Fail-safe policy applied for missing merchant');

    await logsPage.navigate();
    await logsPage.verifyErrorLogged('ERROR', 'Missing merchant information');
    await logsPage.verifyFailSafeActionLogged('TXN88888', 'fail-safe applied');
    logger.info('Error and fail-safe action logged');

    await riskPage.navigate();
    await riskPage.verifyNoInvalidRiskScore('TXN88888', 'fail-safe');
    logger.info('Verified no invalid risk score produced');
  });

  test('TC-014: Handle transaction with invalid negative amount', async ({ page }) => {
    logger.info('Starting test: TC-014 - Invalid amount data handling');
    const transactionPage = new TransactionIngestionPage(page);
    const riskPage = new RiskEvaluationPage(page);
    const logsPage = new SystemLogsPage(page);

    await transactionPage.navigate();
    await transactionPage.ingestMalformedTransaction('TXN99999', 'ACC888', 'CARD666', 'Online Store', '-100', 'USD', '2024-01-15T17:00:00Z');
    await transactionPage.verifyTransactionReceived('TXN99999');
    logger.info('Malformed transaction ingested');

    await riskPage.navigate();
    await riskPage.verifyInvalidDataDetected('TXN99999', 'amount=-$100');
    await riskPage.verifyFailSafePolicyApplied('TXN99999', 'reject_transaction');
    logger.info('Fail-safe policy applied for invalid amount');

    await logsPage.navigate();
    await logsPage.verifyErrorLogged('ERROR', 'Invalid amount value');
    await logsPage.verifyFailSafeActionLogged('TXN99999', 'fail-safe applied');
    logger.info('Error and fail-safe action logged');

    await riskPage.navigate();
    await riskPage.verifyNoInvalidRiskScore('TXN99999', 'fail-safe');
    logger.info('Verified no invalid risk score produced');
  });

  test('TC-015: Handle transaction with multiple missing fields', async ({ page }) => {
    logger.info('Starting test: TC-015 - Multiple missing fields handling');
    const transactionPage = new TransactionIngestionPage(page);
    const riskPage = new RiskEvaluationPage(page);
    const logsPage = new SystemLogsPage(page);

    await transactionPage.navigate();
    await transactionPage.ingestIncompleteTransaction('TXN00000', 'ACC777', 'CARD555', null, '300', 'USD', null);
    await transactionPage.verifyTransactionReceived('TXN00000');
    logger.info('Transaction with multiple missing fields ingested');

    await riskPage.navigate();
    await riskPage.verifyMultipleMissingFields('TXN00000', 'merchant,timestamp');
    await riskPage.verifyFailSafePolicyApplied('TXN00000', 'reject_transaction');
    logger.info('Fail-safe policy applied for multiple missing fields');

    await logsPage.navigate();
    await logsPage.verifyErrorLogged('ERROR', 'Missing required fields [merchant, timestamp]');
    await logsPage.verifyFailSafeActionLogged('TXN00000', 'fail-safe applied');
    logger.info('Error logged with all missing fields');

    await riskPage.navigate();
    await riskPage.verifyNoInvalidRiskScore('TXN00000', 'fail-safe');
    logger.info('Verified no invalid risk score produced');
  });
});

test.describe('Fraud Alert System - Engine Unavailability Tests', () => {

  test('TC-016: Handle fraud-risk engine unavailability', async ({ page }) => {
    logger.info('Starting test: TC-016 - Risk engine unavailability');
    const riskPage = new RiskEvaluationPage(page);
    const transactionPage = new TransactionIngestionPage(page);
    const logsPage = new SystemLogsPage(page);

    await riskPage.navigate();
    await riskPage.simulateEngineUnavailability();
    logger.info('Risk engine unavailability simulated');

    await transactionPage.navigate();
    await transactionPage.ingestTransactionWithDetails('TXN12121', 'ACC111', 'CARD222', 'Department Store', '400', 'USD', '2024-01-15T18:00:00Z', 'Standard Location');
    await transactionPage.verifyTransactionReceived('TXN12121');
    logger.info('Transaction ingested during engine unavailability');

    await riskPage.navigate();
    await riskPage.verifyEngineUnavailabilityDetected('TXN12121', '5000');
    await riskPage.verifyTransactionSpecificFailSafe('TXN12121', 'approve', '400');
    logger.info('Transaction-specific fail-safe applied');

    await logsPage.navigate();
    await logsPage.verifyCriticalErrorLogged('CRITICAL', 'Fraud-risk engine unavailable');
    await logsPage.verifyFailSafeActionLogged('TXN12121', 'fail-safe policy applied');
    logger.info('Critical error logged');

    await riskPage.navigate();
    await riskPage.verifyPipelineNotBlocked('TXN12121');
    logger.info('Verified transaction pipeline not blocked');
  });

  test('TC-017: Handle fraud-risk engine timeout', async ({ page }) => {
    logger.info('Starting test: TC-017 - Risk engine timeout');
    const riskPage = new RiskEvaluationPage(page);
    const transactionPage = new TransactionIngestionPage(page);
    const logsPage = new SystemLogsPage(page);

    await riskPage.navigate();
    await riskPage.simulateEngineTimeout('5000', '8000');
    logger.info('Risk engine timeout simulated');

    await transactionPage.navigate();
    await transactionPage.ingestTransactionWithDetails('TXN23232', 'ACC222', 'CARD333', 'Gas Station', '60', 'USD', '2024-01-15T19:00:00Z', 'Standard Location');
    await transactionPage.verifyTransactionReceived('TXN23232');
    logger.info('Transaction ingested during engine timeout');

    await riskPage.navigate();
    await riskPage.verifyEngineTimeout('TXN23232', '5000');
    await riskPage.verifyTransactionSpecificFailSafe('TXN23232', 'approve', '60');
    logger.info('Fail-safe applied for timeout scenario');

    await logsPage.navigate();
    await logsPage.verifyErrorLogged('ERROR', 'Fraud-risk engine timeout after 5000ms');
    await logsPage.verifyFailSafeActionLogged('TXN23232', 'fail-safe policy applied');
    logger.info('Timeout error logged');

    await riskPage.navigate();
    await riskPage.verifyPipelineNotBlocked('TXN23232');
    logger.info('Verified pipeline continues without blocking');
  });

  test('TC-018: Apply transaction-specific fail-safe policies', async ({ page }) => {
    logger.info('Starting test: TC-018 - Transaction-specific fail-safe policies');
    const riskPage = new RiskEvaluationPage(page);
    const transactionPage = new TransactionIngestionPage(page);

    await riskPage.navigate();
    await riskPage.simulateEngineUnavailability();
    logger.info('Risk engine unavailability simulated');

    await transactionPage.navigate();
    await transactionPage.ingestTransactionWithDetails('TXN34343', 'ACC333', 'CARD444', 'Jewelry Store', '8000', 'USD', '2024-01-15T20:00:00Z', 'Standard Location');
    await transactionPage.verifyTransactionReceived('TXN34343');
    logger.info('High-value transaction ingested');

    await riskPage.navigate();
    await riskPage.verifyTransactionSpecificFailSafe('TXN34343', 'hold_for_review', '8000');
    logger.info('Stricter fail-safe applied for high-value transaction');

    await transactionPage.navigate();
    await transactionPage.ingestTransactionWithDetails('TXN45454', 'ACC444', 'CARD555', 'Coffee Shop', '5', 'USD', '2024-01-15T20:05:00Z', 'Standard Location');
    await transactionPage.verifyTransactionReceived('TXN45454');
    logger.info('Low-value transaction ingested');

    await riskPage.navigate();
    await riskPage.verifyTransactionSpecificFailSafe('TXN45454', 'approve', '5');
    logger.info('Lenient fail-safe applied for low-value transaction');

    await riskPage.verifyBothTransactionsProcessed('TXN34343', 'hold_for_review', 'TXN45454', 'approved');
    logger.info('Verified both transactions processed with appropriate fail-safe policies');
  });
});
