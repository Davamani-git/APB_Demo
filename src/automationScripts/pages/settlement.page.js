const { expect } = require('@playwright/test');
const logger = require('../../../utils/logger');

exports.SettlementPage = class SettlementPage {
  constructor(page) {
    this.page = page;
    
    // Settlement batch locators
    this.merchantStatusIndicator = page.locator('[data-testid="merchant-status"]');
    this.settlementWindowStatus = page.locator('[data-testid="settlement-window-status"]');
    this.batchIdField = page.locator('[data-testid="batch-id"]');
    this.batchTransactionCount = page.locator('[data-testid="batch-transaction-count"]');
    this.fundingGrossAmount = page.locator('[data-testid="funding-gross"]');
    this.fundingFeesAmount = page.locator('[data-testid="funding-fees"]');
    this.fundingReservesAmount = page.locator('[data-testid="funding-reserves"]');
    this.fundingNetAmount = page.locator('[data-testid="funding-net"]');
    this.ledgerReconciliationStatus = page.locator('[data-testid="ledger-reconciliation-status"]');
    this.batchTimestamp = page.locator('[data-testid="batch-timestamp"]');
    this.systemLogEntry = page.locator('[data-testid="system-log-entry"]');
    
    // Reconciliation locators
    this.reconciliationStatus = page.locator('[data-testid="reconciliation-status"]');
    this.matchedRecordsCount = page.locator('[data-testid="matched-records-count"]');
    this.reconciliationTimestampField = page.locator('[data-testid="reconciliation-timestamp"]');
    this.autoMatchRateField = page.locator('[data-testid="auto-match-rate"]');
    this.toleranceApplicationStatus = page.locator('[data-testid="tolerance-application-status"]');
    this.recordStatusField = page.locator('[data-testid="record-status"]');
    this.auditTrailEntry = page.locator('[data-testid="audit-trail-entry"]');
    this.discrepancyDetectionStatus = page.locator('[data-testid="discrepancy-detection-status"]');
    this.breakQueueEntry = page.locator('[data-testid="break-queue-entry"]');
    this.autoClearFlagField = page.locator('[data-testid="auto-clear-flag"]');
    
    // Payment API locators
    this.apiEndpointStatus = page.locator('[data-testid="api-endpoint-status"]');
    this.requestStatus = page.locator('[data-testid="request-status"]');
    this.paymentRecordId = page.locator('[data-testid="payment-record-id"]');
    this.paymentRecordStatus = page.locator('[data-testid="payment-record-status"]');
    this.idempotencyKeyField = page.locator('[data-testid="idempotency-key"]');
    this.paymentResponseField = page.locator('[data-testid="payment-response"]');
    this.idempotencyCheckStatus = page.locator('[data-testid="idempotency-check-status"]');
    this.validationStatus = page.locator('[data-testid="validation-status"]');
    this.httpStatusCode = page.locator('[data-testid="http-status-code"]');
    this.errorResponseField = page.locator('[data-testid="error-response"]');
    
    // SCA locators
    this.scaRequirementStatus = page.locator('[data-testid="sca-requirement-status"]');
    this.scaChallengeFactors = page.locator('[data-testid="sca-challenge-factors"]');
    this.firstFactorValidation = page.locator('[data-testid="first-factor-validation"]');
    this.secondFactorValidation = page.locator('[data-testid="second-factor-validation"]');
    this.paymentAuthorizationStatus = page.locator('[data-testid="payment-authorization-status"]');
    this.scaFactorCount = page.locator('[data-testid="sca-factor-count"]');
    this.exemptionEligibilityStatus = page.locator('[data-testid="exemption-eligibility-status"]');
    this.exemptionFlagField = page.locator('[data-testid="exemption-flag"]');
    this.authorizationRequestField = page.locator('[data-testid="authorization-request"]');
    this.issuerDecisionField = page.locator('[data-testid="issuer-decision"]');
    this.factorCount = page.locator('[data-testid="factor-count"]');
    this.scaValidationResult = page.locator('[data-testid="sca-validation-result"]');
    this.paymentRejectionStatus = page.locator('[data-testid="payment-rejection-status"]');
    this.financialHoldStatus = page.locator('[data-testid="financial-hold-status"]');
    
    // Onboarding and KYB locators
    this.applicationQueueStatus = page.locator('[data-testid="application-queue-status"]');
    this.bureauResponseStatus = page.locator('[data-testid="bureau-response-status"]');
    this.bureauResponseMapping = page.locator('[data-testid="bureau-response-mapping"]');
    this.applicationStatusField = page.locator('[data-testid="application-status"]');
    this.retryScheduledField = page.locator('[data-testid="retry-scheduled"]');
    this.nextRetryTime = page.locator('[data-testid="next-retry-time"]');
    this.retryCount = page.locator('[data-testid="retry-count"]');
    this.applicationRejectionStatus = page.locator('[data-testid="application-rejection-status"]');
    
    // Screening locators
    this.screeningQueueStatus = page.locator('[data-testid="screening-queue-status"]');
    this.screeningExecutionStatus = page.locator('[data-testid="screening-execution-status"]');
    this.screeningResultField = page.locator('[data-testid="screening-result"]');
    this.screeningHitsCount = page.locator('[data-testid="screening-hits-count"]');
    this.applicationHoldStatus = page.locator('[data-testid="application-hold-status"]');
    this.complianceCaseField = page.locator('[data-testid="compliance-case"]');
    this.processingBlockedField = page.locator('[data-testid="processing-blocked"]');
    this.nearMatchConfidence = page.locator('[data-testid="near-match-confidence"]');
    this.manualReviewQueueField = page.locator('[data-testid="manual-review-queue"]');
    this.autoCleared = page.locator('[data-testid="auto-cleared"]');
    
    // Form inputs
    this.merchantIdInput = page.locator('[data-testid="merchant-id-input"]');
    this.transactionInput = page.locator('[data-testid="transaction-input"]');
    this.settlementWindowInput = page.locator('[data-testid="settlement-window-input"]');
    this.batchIdInput = page.locator('[data-testid="batch-id-input"]');
    this.reconciliationBatchInput = page.locator('[data-testid="reconciliation-batch-input"]');
    this.toleranceInput = page.locator('[data-testid="tolerance-input"]');
    this.paymentApiUrlInput = page.locator('[data-testid="payment-api-url-input"]');
    this.idempotencyKeyInput = page.locator('[data-testid="idempotency-key-input"]');
    this.amountInput = page.locator('[data-testid="amount-input"]');
    this.payerInput = page.locator('[data-testid="payer-input"]');
    this.payeeInput = page.locator('[data-testid="payee-input"]');
    this.currencyInput = page.locator('[data-testid="currency-input"]');
    this.authFactorInput = page.locator('[data-testid="auth-factor-input"]');
    this.businessNameInput = page.locator('[data-testid="business-name-input"]');
    this.registrationNumberInput = page.locator('[data-testid="registration-number-input"]');
    this.countryInput = page.locator('[data-testid="country-input"]');
    this.applicantNameInput = page.locator('[data-testid="applicant-name-input"]');
    
    // Buttons
    this.setupMerchantButton = page.locator('[data-testid="setup-merchant-button"]');
    this.triggerSettlementButton = page.locator('[data-testid="trigger-settlement-button"]');
    this.executeReconciliationButton = page.locator('[data-testid="execute-reconciliation-button"]');
    this.submitPaymentButton = page.locator('[data-testid="submit-payment-button"]');
    this.provideFactorButton = page.locator('[data-testid="provide-factor-button"]');
    this.submitApplicationButton = page.locator('[data-testid="submit-application-button"]');
    this.executeKYBButton = page.locator('[data-testid="execute-kyb-button"]');
    this.executeScreeningButton = page.locator('[data-testid="execute-screening-button"]');
  }

  // Settlement batch methods
  async setupMerchantAccount(merchantId, transactions) {
    logger.info(`Setting up merchant account: ${merchantId}`);
    await this.merchantIdInput.waitFor({ state: 'visible' });
    await this.merchantIdInput.fill(merchantId);
    
    for (const txn of transactions) {
      await this.transactionInput.fill(JSON.stringify(txn));
    }
    
    await this.setupMerchantButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyCapturedTransactionsReady(transactionIds) {
    logger.info(`Verifying captured transactions ready: ${transactionIds.join(', ')}`);
    for (const txnId of transactionIds) {
      const txnLocator = this.page.locator(`[data-testid="transaction-${txnId}"]`);
      await expect(txnLocator).toBeVisible();
    }
  }

  async triggerSettlementWindowClosure(time, timezone) {
    logger.info(`Triggering settlement window closure at ${time} ${timezone}`);
    await this.settlementWindowInput.fill(`${time}|${timezone}`);
    await this.triggerSettlementButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyBatchCreated(batchId) {
    logger.info(`Verifying batch created: ${batchId}`);
    const batchLocator = this.page.locator(`[data-testid="batch-${batchId}"]`);
    await expect(batchLocator).toBeVisible();
  }

  getBatchTransactionCount(batchId) {
    return this.page.locator(`[data-testid="batch-${batchId}-transaction-count"]`);
  }

  async verifyBatchContainsTransactions(batchId, transactionIds) {
    logger.info(`Verifying batch ${batchId} contains transactions: ${transactionIds.join(', ')}`);
    for (const txnId of transactionIds) {
      const txnInBatch = this.page.locator(`[data-testid="batch-${batchId}-txn-${txnId}"]`);
      await expect(txnInBatch).toBeVisible();
    }
  }

  async verifyFundingCalculation(batchId, fundingData) {
    logger.info(`Verifying funding calculation for batch: ${batchId}`);
    const grossLocator = this.page.locator(`[data-testid="batch-${batchId}-gross"]`);
    const feesLocator = this.page.locator(`[data-testid="batch-${batchId}-fees"]`);
    const reservesLocator = this.page.locator(`[data-testid="batch-${batchId}-reserves"]`);
    const netLocator = this.page.locator(`[data-testid="batch-${batchId}-net"]`);
    
    await expect(grossLocator).toHaveText(fundingData.gross.toString());
    await expect(feesLocator).toHaveText(fundingData.fees.toString());
    await expect(reservesLocator).toHaveText(fundingData.reserves.toString());
    await expect(netLocator).toHaveText(fundingData.netFunding.toString());
  }

  async verifyLedgerReconciliation(batchId) {
    logger.info(`Verifying ledger reconciliation for batch: ${batchId}`);
    const reconciliationLocator = this.page.locator(`[data-testid="batch-${batchId}-ledger-reconciliation"]`);
    await expect(reconciliationLocator).toHaveText('reconciled');
  }

  async verifyMultipleMerchantsReady(merchantIds) {
    logger.info(`Verifying multiple merchants ready: ${merchantIds.join(', ')}`);
    for (const merchantId of merchantIds) {
      const merchantLocator = this.page.locator(`[data-testid="merchant-${merchantId}-status"]`);
      await expect(merchantLocator).toHaveText('ready');
    }
  }

  async verifyBatchMerchantMapping(batchId, merchantId) {
    logger.info(`Verifying batch ${batchId} mapped to merchant ${merchantId}`);
    const mappingLocator = this.page.locator(`[data-testid="batch-${batchId}-merchant"]`);
    await expect(mappingLocator).toHaveText(merchantId);
  }

  async verifyNetFunding(batchId, expectedAmount) {
    logger.info(`Verifying net funding for batch ${batchId}: ${expectedAmount}`);
    const netFundingLocator = this.page.locator(`[data-testid="batch-${batchId}-net-funding"]`);
    await expect(netFundingLocator).toHaveText(expectedAmount.toString());
  }

  async verifyBatchTimestamp(batchId, expectedTimestamp) {
    logger.info(`Verifying batch ${batchId} timestamp: ${expectedTimestamp}`);
    const timestampLocator = this.page.locator(`[data-testid="batch-${batchId}-timestamp"]`);
    await expect(timestampLocator).toHaveText(expectedTimestamp);
  }

  async verifyNoEligibleTransactions(merchantId) {
    logger.info(`Verifying no eligible transactions for merchant: ${merchantId}`);
    const eligibleTxnLocator = this.page.locator(`[data-testid="merchant-${merchantId}-eligible-txn-count"]`);
    await expect(eligibleTxnLocator).toHaveText('0');
  }

  async verifyNoBatchForMerchant(merchantId) {
    logger.info(`Verifying no batch exists for merchant: ${merchantId}`);
    const batchLocator = this.page.locator(`[data-testid="merchant-${merchantId}-batch"]`);
    await expect(batchLocator).toHaveCount(0);
  }

  async verifySystemLog(expectedLogMessage) {
    logger.info(`Verifying system log contains: ${expectedLogMessage}`);
    const logLocator = this.page.locator(`[data-testid="system-log"]:has-text("${expectedLogMessage}")`);
    await expect(logLocator).toBeVisible();
  }

  // Reconciliation methods
  async prepareReconciliationRecords(records) {
    logger.info('Preparing reconciliation records');
    for (const record of records) {
      await this.page.locator('[data-testid="add-reconciliation-record"]').click();
      await this.page.locator('[data-testid="record-data"]').fill(JSON.stringify(record));
    }
  }

  async verifyRecordsAvailable(recordTypes) {
    logger.info(`Verifying records available: ${recordTypes.join(', ')}`);
    for (const type of recordTypes) {
      const recordLocator = this.page.locator(`[data-testid="record-type-${type}"]`);
      await expect(recordLocator).toBeVisible();
    }
  }

  async executeReconciliationEngine(batchId, totalRecords) {
    logger.info(`Executing reconciliation engine for batch: ${batchId}`);
    await this.reconciliationBatchInput.fill(batchId);
    await this.page.locator('[data-testid="total-records"]').fill(totalRecords.toString());
    await this.executeReconciliationButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyMatchedRecordsCleared(matchedCount) {
    logger.info(`Verifying ${matchedCount} matched records cleared`);
    const matchedLocator = this.page.locator('[data-testid="matched-records-cleared"]');
    await expect(matchedLocator).toHaveText(matchedCount.toString());
  }

  async verifyReconciliationTimestamp(expectedTimestamp) {
    logger.info(`Verifying reconciliation timestamp: ${expectedTimestamp}`);
    await expect(this.reconciliationTimestampField).toHaveText(expectedTimestamp);
  }

  async getAutoMatchRate() {
    logger.info('Getting auto-match rate');
    const rateText = await this.autoMatchRateField.textContent();
    return parseFloat(rateText);
  }

  async verifyAutoMatchCalculation(matched, total) {
    logger.info(`Verifying auto-match calculation: ${matched}/${total}`);
    const expectedRate = (matched / total) * 100;
    const actualRate = await this.getAutoMatchRate();
    expect(actualRate).toBeCloseTo(expectedRate, 1);
  }

  async configureTolerance(amountTolerance, percentTolerance) {
    logger.info(`Configuring tolerance: ±$${amountTolerance} or ±${percentTolerance}%`);
    await this.page.locator('[data-testid="amount-tolerance"]').fill(amountTolerance.toString());
    await this.page.locator('[data-testid="percent-tolerance"]').fill(percentTolerance.toString());
  }

  async verifyRecordsWithinTolerance() {
    logger.info('Verifying records within tolerance');
    const toleranceStatus = this.page.locator('[data-testid="records-within-tolerance"]');
    await expect(toleranceStatus).toHaveText('true');
  }

  async executeReconciliationEngineWithTolerance() {
    logger.info('Executing reconciliation engine with tolerance settings');
    await this.page.locator('[data-testid="apply-tolerance"]').check();
    await this.executeReconciliationButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyMatchedSet(recordIds) {
    logger.info(`Verifying matched set: ${recordIds.join(', ')}`);
    for (const recordId of recordIds) {
      const matchedLocator = this.page.locator(`[data-testid="matched-${recordId}"]`);
      await expect(matchedLocator).toHaveText('reconciled');
    }
  }

  async verifyRecordStatus(recordId, expectedStatus) {
    logger.info(`Verifying record ${recordId} status: ${expectedStatus}`);
    const statusLocator = this.page.locator(`[data-testid="record-${recordId}-status"]`);
    await expect(statusLocator).toHaveText(expectedStatus);
  }

  async verifyAuditEntry(expectedEntry) {
    logger.info(`Verifying audit entry: ${typeof expectedEntry === 'string' ? expectedEntry : JSON.stringify(expectedEntry)}`);
    const entryText = typeof expectedEntry === 'string' ? expectedEntry : JSON.stringify(expectedEntry);
    const auditLocator = this.page.locator(`[data-testid="audit-entry"]:has-text("${entryText}")`);
    await expect(auditLocator).toBeVisible();
  }

  async verifyDiscrepancyExceedsTolerance(variance) {
    logger.info(`Verifying discrepancy exceeds tolerance: $${variance}`);
    const discrepancyLocator = this.page.locator('[data-testid="discrepancy-variance"]');
    await expect(discrepancyLocator).toHaveText(variance.toString());
  }

  async verifyBreakQueueEntry(recordId, reasonCode, variance) {
    logger.info(`Verifying break queue entry for ${recordId}: ${reasonCode}, variance $${variance}`);
    const breakLocator = this.page.locator(`[data-testid="break-${recordId}"]`);
    await expect(breakLocator).toBeVisible();
    const reasonLocator = this.page.locator(`[data-testid="break-${recordId}-reason"]`);
    await expect(reasonLocator).toHaveText(reasonCode);
    const varianceLocator = this.page.locator(`[data-testid="break-${recordId}-variance"]`);
    await expect(varianceLocator).toHaveText(variance.toString());
  }

  async verifyAutoClearFlag(recordId, expectedFlag) {
    logger.info(`Verifying auto-clear flag for ${recordId}: ${expectedFlag}`);
    const flagLocator = this.page.locator(`[data-testid="record-${recordId}-auto-clear"]`);
    await expect(flagLocator).toHaveText(expectedFlag.toString());
  }

  // Payment API methods
  async navigateToPaymentAPI(url) {
    logger.info(`Navigating to payment API: ${url}`);
    await this.paymentApiUrlInput.fill(url);
    await this.page.locator('[data-testid="connect-api-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async submitPaymentRequest(paymentData) {
    logger.info(`Submitting payment request with idempotency key: ${paymentData.idempotencyKey}`);
    await this.idempotencyKeyInput.waitFor({ state: 'visible' });
    await this.idempotencyKeyInput.fill(paymentData.idempotencyKey);
    
    if (paymentData.amount) {
      await this.amountInput.fill(paymentData.amount.toString());
    }
    if (paymentData.payer) {
      await this.payerInput.fill(paymentData.payer);
    }
    if (paymentData.payee) {
      await this.payeeInput.fill(paymentData.payee);
    }
    if (paymentData.currency) {
      await this.currencyInput.fill(paymentData.currency);
    }
    
    await this.submitPaymentButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyPaymentRecordCreated(paymentId, expectedStatus) {
    logger.info(`Verifying payment record created: ${paymentId} with status ${expectedStatus}`);
    const paymentLocator = this.page.locator(`[data-testid="payment-${paymentId}"]`);
    await expect(paymentLocator).toBeVisible();
    const statusLocator = this.page.locator(`[data-testid="payment-${paymentId}-status"]`);
    await expect(statusLocator).toHaveText(expectedStatus);
  }

  async verifyIdempotencyKeyStored(key, associatedPaymentId) {
    logger.info(`Verifying idempotency key stored: ${key} -> ${associatedPaymentId}`);
    const keyLocator = this.page.locator(`[data-testid="idempotency-key-${key}"]`);
    await expect(keyLocator).toBeVisible();
    const associatedLocator = this.page.locator(`[data-testid="idempotency-key-${key}-payment"]`);
    await expect(associatedLocator).toHaveText(associatedPaymentId);
  }

  async verifyPaymentResponse(expectedResponse) {
    logger.info(`Verifying payment response: ${JSON.stringify(expectedResponse)}`);
    const responseLocator = this.page.locator('[data-testid="payment-response-data"]');
    const responseText = await responseLocator.textContent();
    const responseData = JSON.parse(responseText);
    
    if (expectedResponse.paymentId) {
      expect(responseData.paymentId).toBe(expectedResponse.paymentId);
    }
    if (expectedResponse.status) {
      expect(responseData.status).toBe(expectedResponse.status);
    }
    if (expectedResponse.amount !== undefined) {
      expect(responseData.amount).toBe(expectedResponse.amount);
    }
    if (expectedResponse.idempotent !== undefined) {
      expect(responseData.idempotent).toBe(expectedResponse.idempotent);
    }
  }

  async getPaymentCountForKey(key) {
    logger.info(`Getting payment count for key: ${key}`);
    const countLocator = this.page.locator(`[data-testid="idempotency-key-${key}-count"]`);
    const countText = await countLocator.textContent();
    return parseInt(countText);
  }

  async verifyErrorResponse(expectedError) {
    logger.info(`Verifying error response: ${JSON.stringify(expectedError)}`);
    const errorLocator = this.page.locator('[data-testid="error-response-data"]');
    const errorText = await errorLocator.textContent();
    const errorData = JSON.parse(errorText);
    
    expect(errorData.field).toBe(expectedError.field);
    expect(errorData.message).toBe(expectedError.message);
  }

  async verifyNoPaymentForKey(key) {
    logger.info(`Verifying no payment exists for key: ${key}`);
    const paymentLocator = this.page.locator(`[data-testid="idempotency-key-${key}-payment"]`);
    await expect(paymentLocator).toHaveCount(0);
  }

  // SCA methods
  async initiatePayment(paymentData) {
    logger.info(`Initiating payment: ${JSON.stringify(paymentData)}`);
    await this.page.locator('[data-testid="initiate-payment-button"]').click();
    await this.page.locator('[data-testid="payment-amount"]').fill(paymentData.amount.toString());
    await this.page.locator('[data-testid="payment-currency"]').fill(paymentData.currency);
    await this.page.locator('[data-testid="payment-region"]').fill(paymentData.region);
    await this.page.locator('[data-testid="customer-initiated"]').check();
    
    if (paymentData.exemption) {
      await this.page.locator('[data-testid="exemption-type"]').fill(paymentData.exemption);
    }
    
    await this.page.locator('[data-testid="submit-payment-initiation"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifySCAChallenge(requiredFactors) {
    logger.info(`Verifying SCA challenge with factors: ${requiredFactors.join(', ')}`);
    for (const factor of requiredFactors) {
      const factorLocator = this.page.locator(`[data-testid="sca-factor-${factor}"]`);
      await expect(factorLocator).toBeVisible();
    }
  }

  async provideAuthenticationFactor(factorType, factorValue) {
    logger.info(`Providing authentication factor: ${factorType}`);
    await this.page.locator(`[data-testid="auth-factor-type"]`).selectOption(factorType);
    await this.authFactorInput.fill(factorValue);
    await this.provideFactorButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyPaymentAuthorized(expectedStatus, expectedFactorCount) {
    logger.info(`Verifying payment authorized: ${expectedStatus}, factors: ${expectedFactorCount}`);
    const statusLocator = this.page.locator('[data-testid="payment-auth-status"]');
    await expect(statusLocator).toHaveText(expectedStatus);
    const factorCountLocator = this.page.locator('[data-testid="sca-factors-used"]');
    await expect(factorCountLocator).toHaveText(expectedFactorCount.toString());
  }

  async verifyExemptionFlag(exemptionType, expectedFlag) {
    logger.info(`Verifying exemption flag: ${exemptionType} = ${expectedFlag}`);
    const flagLocator = this.page.locator(`[data-testid="exemption-${exemptionType}"]`);
    await expect(flagLocator).toHaveText(expectedFlag.toString());
  }

  async verifyAuthorizationRequest(expectedRequest) {
    logger.info(`Verifying authorization request: ${JSON.stringify(expectedRequest)}`);
    const requestLocator = this.page.locator('[data-testid="authorization-request-data"]');
    const requestText = await requestLocator.textContent();
    const requestData = JSON.parse(requestText);
    
    expect(requestData.amount).toBe(expectedRequest.amount);
    expect(requestData.exemption).toBe(expectedRequest.exemption);
  }

  async verifyIssuerDecisionEnforced() {
    logger.info('Verifying issuer SCA decision is enforced');
    const decisionLocator = this.page.locator('[data-testid="issuer-decision-enforced"]');
    await expect(decisionLocator).toHaveText('true');
  }

  async verifySCAValidationResult(expectedResult, expectedReason) {
    logger.info(`Verifying SCA validation result: ${expectedResult}, reason: ${expectedReason}`);
    const resultLocator = this.page.locator('[data-testid="sca-validation-result"]');
    await expect(resultLocator).toHaveText(expectedResult);
    const reasonLocator = this.page.locator('[data-testid="sca-validation-reason"]');
    await expect(reasonLocator).toHaveText(expectedReason);
  }

  async verifyPaymentRejected(expectedStatus, expectedErrorCode) {
    logger.info(`Verifying payment rejected: ${expectedStatus}, error: ${expectedErrorCode}`);
    const statusLocator = this.page.locator('[data-testid="payment-rejection-status"]');
    await expect(statusLocator).toHaveText(expectedStatus);
    const errorLocator = this.page.locator('[data-testid="payment-error-code"]');
    await expect(errorLocator).toHaveText(expectedErrorCode);
  }

  async verifyNoFinancialHold() {
    logger.info('Verifying no financial hold placed');
    const holdLocator = this.page.locator('[data-testid="financial-hold-placed"]');
    await expect(holdLocator).toHaveText('false');
  }

  // Onboarding and KYB methods
  async submitMerchantApplication(applicationData) {
    logger.info(`Submitting merchant application: ${JSON.stringify(applicationData)}`);
    
    if (applicationData.applicationId) {
      await this.page.locator('[data-testid="application-id"]').fill(applicationData.applicationId);
    }
    if (applicationData.businessName) {
      await this.businessNameInput.fill(applicationData.businessName);
    }
    if (applicationData.registrationNumber) {
      await this.registrationNumberInput.fill(applicationData.registrationNumber);
    }
    if (applicationData.country) {
      await this.countryInput.fill(applicationData.country);
    }
    
    await this.submitApplicationButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async executeKYBVerification(bureau, requestId) {
    logger.info(`Executing KYB verification with bureau: ${bureau}, request: ${requestId}`);
    await this.page.locator('[data-testid="kyb-bureau"]').fill(bureau);
    await this.page.locator('[data-testid="kyb-request-id"]').fill(requestId);
    await this.executeKYBButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyBureauResponseMapping(bureauResponse, mappedStatus) {
    logger.info(`Verifying bureau response mapping: ${bureauResponse} -> ${mappedStatus}`);
    const mappingLocator = this.page.locator('[data-testid="bureau-response-mapping"]');
    const mappingText = await mappingLocator.textContent();
    expect(mappingText).toContain(bureauResponse);
    expect(mappingText).toContain(mappedStatus);
  }

  async simulateBureauTimeout(endpoint, timeoutSeconds) {
    logger.info(`Simulating bureau timeout: ${endpoint}, ${timeoutSeconds}s`);
    await this.page.locator('[data-testid="simulate-timeout"]').check();
    await this.page.locator('[data-testid="timeout-duration"]').fill(timeoutSeconds.toString());
    await this.executeKYBButton.click();
    await this.page.waitForTimeout(timeoutSeconds * 1000); // Wait for timeout to occur - necessary for simulation
  }

  async verifyApplicationStatus(applicationId, expectedStatus, expectedReason) {
    logger.info(`Verifying application ${applicationId} status: ${expectedStatus}, reason: ${expectedReason}`);
    const statusLocator = this.page.locator(`[data-testid="application-${applicationId}-status"]`);
    await expect(statusLocator).toHaveText(expectedStatus);
    const reasonLocator = this.page.locator(`[data-testid="application-${applicationId}-reason"]`);
    await expect(reasonLocator).toHaveText(expectedReason);
  }

  async verifyRetryScheduled(expectedScheduled, expectedNextRetry, expectedRetryCount) {
    logger.info(`Verifying retry scheduled: ${expectedScheduled}, next: ${expectedNextRetry}, count: ${expectedRetryCount}`);
    const scheduledLocator = this.page.locator('[data-testid="retry-scheduled"]');
    await expect(scheduledLocator).toHaveText(expectedScheduled.toString());
    const nextRetryLocator = this.page.locator('[data-testid="next-retry-time"]');
    await expect(nextRetryLocator).toHaveText(expectedNextRetry);
    const countLocator = this.page.locator('[data-testid="retry-count"]');
    await expect(countLocator).toHaveText(expectedRetryCount.toString());
  }

  async verifyBureauResponse(bureauResponse, reason) {
    logger.info(`Verifying bureau response: ${bureauResponse}, reason: ${reason}`);
    const responseLocator = this.page.locator('[data-testid="bureau-response"]');
    await expect(responseLocator).toHaveText(bureauResponse);
    const reasonLocator = this.page.locator('[data-testid="bureau-response-reason"]');
    await expect(reasonLocator).toHaveText(reason);
  }

  async verifyApplicationRejected(expectedStatus, expectedReasonCode) {
    logger.info(`Verifying application rejected: ${expectedStatus}, reason: ${expectedReasonCode}`);
    const statusLocator = this.page.locator('[data-testid="application-rejection-status"]');
    await expect(statusLocator).toHaveText(expectedStatus);
    const reasonLocator = this.page.locator('[data-testid="application-rejection-reason"]');
    await expect(reasonLocator).toHaveText(expectedReasonCode);
  }

  // Screening methods
  async submitApplicantForScreening(applicantData) {
    logger.info(`Submitting applicant for screening: ${JSON.stringify(applicantData)}`);
    await this.applicantNameInput.fill(applicantData.applicant);
    await this.businessNameInput.fill(applicantData.business);
    await this.countryInput.fill(applicantData.country);
    await this.page.locator('[data-testid="submit-screening-button"]').click();
    await this.page.waitForLoadState('networkidle');
  }

  async executeScreening(screeningLists) {
    logger.info(`Executing screening against lists: ${screeningLists.join(', ')}`);
    for (const list of screeningLists) {
      await this.page.locator(`[data-testid="screening-list-${list}"]`).check();
    }
    await this.executeScreeningButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyScreeningResult(expectedResult, expectedHits) {
    logger.info(`Verifying screening result: ${expectedResult}, hits: ${expectedHits}`);
    const resultLocator = this.page.locator('[data-testid="screening-result"]');
    await expect(resultLocator).toHaveText(expectedResult);
    const hitsLocator = this.page.locator('[data-testid="screening-hits"]');
    await expect(hitsLocator).toHaveText(expectedHits.toString());
  }

  async verifyScreeningHit(listName, matchConfidence) {
    logger.info(`Verifying screening hit: ${listName}, confidence: ${matchConfidence}%`);
    const hitLocator = this.page.locator(`[data-testid="screening-hit-${listName}"]`);
    await expect(hitLocator).toBeVisible();
    const confidenceLocator = this.page.locator(`[data-testid="screening-hit-confidence"]`);
    await expect(confidenceLocator).toHaveText(matchConfidence.toString());
  }

  async verifyApplicationHeld(expectedStatus, expectedHoldReason) {
    logger.info(`Verifying application held: ${expectedStatus}, reason: ${expectedHoldReason}`);
    const statusLocator = this.page.locator('[data-testid="application-hold-status"]');
    await expect(statusLocator).toHaveText(expectedStatus);
    const reasonLocator = this.page.locator('[data-testid="application-hold-reason"]');
    await expect(reasonLocator).toHaveText(expectedHoldReason);
  }

  async verifyComplianceCaseOpened(caseId, assignedTo, priority) {
    logger.info(`Verifying compliance case opened: ${caseId}, assigned: ${assignedTo}, priority: ${priority}`);
    const caseLocator = this.page.locator(`[data-testid="compliance-case-${caseId}"]`);
    await expect(caseLocator).toBeVisible();
    const assignedLocator = this.page.locator(`[data-testid="case-${caseId}-assigned"]`);
    await expect(assignedLocator).toHaveText(assignedTo);
    const priorityLocator = this.page.locator(`[data-testid="case-${caseId}-priority"]`);
    await expect(priorityLocator).toHaveText(priority);
  }

  async verifyProcessingBlocked(expectedBlocked, expectedReason) {
    logger.info(`Verifying processing blocked: ${expectedBlocked}, reason: ${expectedReason}`);
    const blockedLocator = this.page.locator('[data-testid="processing-blocked"]');
    await expect(blockedLocator).toHaveText(expectedBlocked.toString());
    const reasonLocator = this.page.locator('[data-testid="processing-block-reason"]');
    await expect(reasonLocator).toHaveText(expectedReason);
  }

  async verifyNearMatch(matchConfidence, threshold, potentialMatch) {
    logger.info(`Verifying near-match: confidence ${matchConfidence}%, threshold ${threshold}%, match: ${potentialMatch}`);
    const confidenceLocator = this.page.locator('[data-testid="near-match-confidence"]');
    await expect(confidenceLocator).toHaveText(matchConfidence.toString());
    const thresholdLocator = this.page.locator('[data-testid="near-match-threshold"]');
    await expect(thresholdLocator).toHaveText(threshold.toString());
    const matchLocator = this.page.locator('[data-testid="potential-match"]');
    await expect(matchLocator).toHaveText(potentialMatch);
  }

  async verifyManualReviewQueue(queueName, matchConfidence, potentialMatch) {
    logger.info(`Verifying manual review queue: ${queueName}, confidence: ${matchConfidence}%, match: ${potentialMatch}`);
    const queueLocator = this.page.locator(`[data-testid="manual-review-queue-${queueName}"]`);
    await expect(queueLocator).toBeVisible();
    const confidenceLocator = this.page.locator('[data-testid="review-match-confidence"]');
    await expect(confidenceLocator).toHaveText(matchConfidence.toString());
    const matchLocator = this.page.locator('[data-testid="review-potential-match"]');
    await expect(matchLocator).toHaveText(potentialMatch);
  }

  async verifyApplicationNotAutoCleared(expectedStatus, expectedAutoCleared) {
    logger.info(`Verifying application not auto-cleared: ${expectedStatus}, auto-cleared: ${expectedAutoCleared}`);
    const statusLocator = this.page.locator('[data-testid="application-status"]');
    await expect(statusLocator).toHaveText(expectedStatus);
    const autoClearedLocator = this.page.locator('[data-testid="auto-cleared"]');
    await expect(autoClearedLocator).toHaveText(expectedAutoCleared.toString());
  }
};