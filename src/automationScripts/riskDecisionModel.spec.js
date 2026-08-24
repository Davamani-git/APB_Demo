const { test, expect } = require('@playwright/test');
const { RiskDecisionModelPage } = require('./pages/riskDecisionModel.page');
const logger = require('../../utils/logger');

test.describe('Risk Decision Model - Threshold-Based Categorization', () => {
  test('TC-1704: Categorize high-risk transaction and trigger appropriate treatment', async ({ page }) => {
    logger.info('Starting test case TC-1704: High-risk transaction categorization');
    const riskPage = new RiskDecisionModelPage(page);
    
    // Step 1: Configure risk thresholds
    const thresholds = {
      low: { min: 0, max: 30 },
      medium: { min: 31, max: 60 },
      high: { min: 61, max: 90 },
      confirmed_fraud: { min: 91, max: 100 }
    };
    await riskPage.configureRiskThresholds(thresholds);
    await riskPage.verifyThresholdsConfigured();
    logger.info('Risk thresholds configured successfully');
    
    // Step 2: Submit transaction with risk score 75
    const transactionData = {
      transaction_id: 'TXN555',
      risk_score: 75
    };
    await riskPage.submitTransactionWithRiskScore(transactionData);
    logger.info('Transaction with risk score 75 submitted');
    
    // Step 3: Verify risk categorization
    await riskPage.verifyRiskCategorization('TXN555', 'high', 75);
    logger.info('Transaction correctly categorized as high risk');
    
    // Step 4: Verify high-risk treatment path
    await riskPage.verifyTreatmentPathInitiated('TXN555', ['decline', 'hold', 'step_up_verification']);
    logger.info('High-risk treatment path triggered successfully');
  });
});

test.describe('Risk Decision Model - Configuration Error Handling', () => {
  test('TC-1705: Handle missing or invalid threshold configuration with fail-safe', async ({ page }) => {
    logger.info('Starting test case TC-1705: Missing threshold configuration handling');
    const riskPage = new RiskDecisionModelPage(page);
    
    // Step 1: Configure invalid thresholds
    await riskPage.configureMissingOrInvalidThresholds();
    await riskPage.verifyInvalidThresholdConfiguration();
    logger.info('Risk thresholds missing or invalid');
    
    // Step 2: Submit transaction with risk score 45
    const transactionData = {
      transaction_id: 'TXN666',
      risk_score: 45
    };
    await riskPage.submitTransactionWithRiskScore(transactionData);
    logger.info('Transaction with risk score 45 submitted');
    
    // Step 3: Verify configuration error detection
    await riskPage.verifyConfigurationErrorDetected(['MISSING_THRESHOLDS', 'INVALID_THRESHOLDS']);
    logger.info('System detected missing or invalid threshold configuration');
    
    // Step 4: Verify fail-safe policy applied
    await riskPage.verifyFailSafePolicyApplied('TXN666', 'default_fail_safe_action');
    logger.info('Fail-safe policy applied without arbitrary categorization');
    
    // Step 5: Verify configuration error logged
    await riskPage.verifyConfigurationErrorLogged('TXN666', 'CONFIGURATION_ERROR', 'MISSING_THRESHOLDS');
    logger.info('Configuration error logged with appropriate details');
  });
});

test.describe('Risk Decision Model - Multiple Transaction Processing', () => {
  test('TC-1706: Process multiple transactions with varying risk scores', async ({ page }) => {
    logger.info('Starting test case TC-1706: Multiple transaction processing');
    const riskPage = new RiskDecisionModelPage(page);
    
    // Step 1: Configure risk thresholds
    const thresholds = {
      low: { min: 0, max: 30 },
      medium: { min: 31, max: 60 },
      high: { min: 61, max: 90 },
      confirmed_fraud: { min: 91, max: 100 }
    };
    await riskPage.configureRiskThresholds(thresholds);
    await riskPage.verifyThresholdsConfigured();
    logger.info('Risk thresholds configured successfully');
    
    // Step 2: Submit multiple transactions
    const transactions = [
      { transaction_id: 'TXN001', risk_score: 15 },
      { transaction_id: 'TXN002', risk_score: 50 },
      { transaction_id: 'TXN003', risk_score: 85 },
      { transaction_id: 'TXN004', risk_score: 95 }
    ];
    await riskPage.submitMultipleTransactions(transactions);
    logger.info('All transactions submitted to risk decision model');
    
    // Step 3: Verify each transaction categorization
    await riskPage.verifyRiskCategorization('TXN001', 'low', 15);
    await riskPage.verifyRiskCategorization('TXN002', 'medium', 50);
    await riskPage.verifyRiskCategorization('TXN003', 'high', 85);
    await riskPage.verifyRiskCategorization('TXN004', 'confirmed_fraud', 95);
    logger.info('All transactions categorized into appropriate risk levels');
    
    // Step 4: Verify treatment paths for all transactions
    await riskPage.verifyTreatmentPathInitiated('TXN001', ['approve']);
    await riskPage.verifyTreatmentPathInitiated('TXN002', ['approve', 'alert']);
    await riskPage.verifyTreatmentPathInitiated('TXN003', ['decline', 'hold', 'step-up']);
    await riskPage.verifyTreatmentPathInitiated('TXN004', ['block', 'secure']);
    logger.info('Correct treatment paths triggered for all transactions');
    
    // Step 5: Verify all transactions processed without interference
    await riskPage.verifyAllTransactionsProcessed(['TXN001', 'TXN002', 'TXN003', 'TXN004']);
    logger.info('All transactions completed their respective treatment paths successfully');
  });
});
