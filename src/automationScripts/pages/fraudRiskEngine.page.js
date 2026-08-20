const { expect } = require('@playwright/test');

exports.FraudRiskEnginePage = class FraudRiskEnginePage {
  constructor(page) {
    this.page = page;
    this.transactionIdInput = page.locator('#transaction_id');
    this.accountIdInput = page.locator('#account_id');
    this.cardIdInput = page.locator('#card_id');
    this.merchantInput = page.locator('#merchant');
    this.amountInput = page.locator('#amount');
    this.currencyInput = page.locator('#currency');
    this.timestampInput = page.locator('#timestamp');
    this.channelInput = page.locator('#channel');
    this.amountDeviationInput = page.locator('#amount_deviation');
    this.merchantCategoryInput = page.locator('#merchant_category');
    this.geoMatchInput = page.locator('#geo_match');
    this.velocityInput = page.locator('#velocity');
    this.failedAttemptsInput = page.locator('#failed_attempts');
    this.compromisedFlagInput = page.locator('#compromised_flag');
    this.deviceTrustInput = page.locator('#device_trust');
    this.submitTransactionButton = page.locator('button[data-testid="submit-transaction"]');
    this.evaluateRiskButton = page.locator('button[data-testid="evaluate-risk"]');
    this.transactionStatusMessage = page.locator('[data-testid="transaction-status"]');
    this.riskEvaluationStatus = page.locator('[data-testid="risk-evaluation-status"]');
    this.riskScoreDisplay = page.locator('[data-testid="risk-score"]');
    this.riskBandDisplay = page.locator('[data-testid="risk-band"]');
    this.decisionIdDisplay = page.locator('[data-testid="decision-id"]');
    this.decisionDisplay = page.locator('[data-testid="decision"]');
    this.modelVersionDisplay = page.locator('[data-testid="model-version"]');
    this.customerAvgAmountInput = page.locator('#customer_avg_amount');
    this.transactionLocationInput = page.locator('#transaction_location');
    this.customerHomeLocationInput = page.locator('#customer_home_location');
    this.customerTravelHistoryInput = page.locator('#customer_travel_history');
    this.transactionsLastHourInput = page.locator('#transactions_last_hour');
    this.normalHourlyRateInput = page.locator('#normal_hourly_rate');
    this.velocityScoreInput = page.locator('#velocity_score');
    this.compromisedSourceInput = page.locator('#compromised_source');
    this.failedAttemptsLast10MinInput = page.locator('#failed_attempts_last_10min');
    this.failedReasonInput = page.locator('#failed_reason');
    this.deviceFingerprintInput = page.locator('#device_fingerprint');
    this.merchantBehaviorInput = page.locator('#merchant_behavior');
    this.geoLocationInput = page.locator('#geo_location');
    this.dataQualityFlagDisplay = page.locator('[data-testid="data-quality-flag"]');
    this.failSafeAppliedDisplay = page.locator('[data-testid="fail-safe-applied"]');
    this.excludedSignalsDisplay = page.locator('[data-testid="excluded-signals"]');
    this.errorLogDisplay = page.locator('[data-testid="error-log"]');
  }

  async navigate() {
    await this.page.goto('/fraud-risk-engine');
    await expect(this.page).toHaveTitle(/Fraud Risk Engine/i);
  }

  async prepareTransactionEvent(transactionData) {
    await expect(this.transactionIdInput).toBeVisible();
    await this.transactionIdInput.fill(transactionData.transaction_id);
    await this.accountIdInput.fill(transactionData.account_id);
    await this.cardIdInput.fill(transactionData.card_id);
    
    if (transactionData.merchant !== null && transactionData.merchant !== undefined) {
      await this.merchantInput.fill(transactionData.merchant);
    } else {
      await this.merchantInput.clear();
    }
    
    if (transactionData.amount) {
      await this.amountInput.fill(transactionData.amount.toString());
    }
    
    if (transactionData.currency) {
      await this.currencyInput.fill(transactionData.currency);
    }
    
    if (transactionData.timestamp) {
      await this.timestampInput.fill(transactionData.timestamp);
    }
    
    if (transactionData.channel) {
      await this.channelInput.fill(transactionData.channel);
    }
    
    if (transactionData.customer_avg_amount) {
      await this.customerAvgAmountInput.fill(transactionData.customer_avg_amount.toString());
    }
    
    if (transactionData.amount_deviation) {
      await this.amountDeviationInput.fill(transactionData.amount_deviation);
    }
    
    if (transactionData.compromised_flag !== undefined) {
      await this.compromisedFlagInput.check({ force: transactionData.compromised_flag });
    }
    
    if (transactionData.compromised_source) {
      await this.compromisedSourceInput.fill(transactionData.compromised_source);
    }
    
    if (transactionData.device_fingerprint) {
      await this.deviceFingerprintInput.fill(transactionData.device_fingerprint);
    }
    
    if (transactionData.device_trust) {
      await this.deviceTrustInput.fill(transactionData.device_trust);
    }
  }

  async verifyTransactionFormatting(transactionData) {
    await expect(this.transactionIdInput).toHaveValue(transactionData.transaction_id);
    await expect(this.accountIdInput).toHaveValue(transactionData.account_id);
    await expect(this.cardIdInput).toHaveValue(transactionData.card_id);
    
    if (transactionData.merchant) {
      await expect(this.merchantInput).toHaveValue(transactionData.merchant);
    }
  }

  async includeRiskSignalData(riskSignals) {
    await expect(this.amountDeviationInput).toBeVisible();
    await this.amountDeviationInput.fill(riskSignals.amount_deviation);
    await this.merchantCategoryInput.fill(riskSignals.merchant_category);
    await this.velocityInput.fill(riskSignals.velocity);
    await this.failedAttemptsInput.fill(riskSignals.failed_attempts.toString());
    await this.deviceTrustInput.fill(riskSignals.device_trust);
    
    if (typeof riskSignals.geo_match === 'boolean') {
      await this.geoMatchInput.check({ force: riskSignals.geo_match });
    } else {
      await this.geoMatchInput.fill(riskSignals.geo_match);
    }
    
    if (typeof riskSignals.compromised_flag === 'boolean') {
      await this.compromisedFlagInput.check({ force: riskSignals.compromised_flag });
    }
  }

  async verifyRiskSignalsPresent(riskSignals) {
    await expect(this.amountDeviationInput).toHaveValue(riskSignals.amount_deviation);
    await expect(this.merchantCategoryInput).toHaveValue(riskSignals.merchant_category);
    await expect(this.velocityInput).toHaveValue(riskSignals.velocity);
    await expect(this.deviceTrustInput).toHaveValue(riskSignals.device_trust);
  }

  async verifyMediumRiskCharacteristics(riskSignals) {
    await expect(this.amountDeviationInput).toHaveValue(riskSignals.amount_deviation);
    await expect(this.merchantCategoryInput).toContainText('new');
    await expect(this.deviceTrustInput).toHaveValue('medium');
  }

  async sendTransactionToFraudEngine(endpoint, timestamp) {
    if (timestamp) {
      await this.timestampInput.fill(timestamp);
    }
    await expect(this.evaluateRiskButton).toBeEnabled();
    await this.evaluateRiskButton.click();
  }

  async verifyEngineProcessedSuccessfully() {
    await expect(this.riskEvaluationStatus).toBeVisible({ timeout: 10000 });
    await expect(this.riskEvaluationStatus).toContainText(/processed successfully|completed/i);
  }

  async verifyAllRiskSignalsEvaluated() {
    await expect(this.riskEvaluationStatus).toContainText(/all signals evaluated|evaluation complete/i);
  }

  async verifyMediumRiskPatternsIdentified() {
    await expect(this.riskEvaluationStatus).toContainText(/medium-risk patterns|medium risk identified/i);
  }

  async retrieveRiskDecision() {
    await expect(this.riskScoreDisplay).toBeVisible();
    await expect(this.riskBandDisplay).toBeVisible();
    
    const riskScore = await this.riskScoreDisplay.textContent();
    const riskBand = await this.riskBandDisplay.textContent();
    
    return {
      risk_score: parseInt(riskScore),
      risk_band: riskBand.toLowerCase().trim()
    };
  }

  async verifyRiskDecision(actualDecision, expectedDecision) {
    expect(actualDecision.risk_band).toBe(expectedDecision.risk_band);
    expect(actualDecision.risk_score).toBe(expectedDecision.risk_score);
    await expect(this.riskBandDisplay).toContainText(expectedDecision.risk_band);
    await expect(this.riskScoreDisplay).toContainText(expectedDecision.risk_score.toString());
  }

  async verifyDecisionRecorded(decisionRecord) {
    await expect(this.decisionIdDisplay).toBeVisible();
    await expect(this.decisionIdDisplay).toContainText(decisionRecord.decision_id);
    await expect(this.modelVersionDisplay).toContainText(decisionRecord.model_version);
    await expect(this.decisionDisplay).toContainText(decisionRecord.decision);
  }

  async verifyDecisionRecordedForAlertProcessing(decisionRecord) {
    await expect(this.decisionIdDisplay).toContainText(decisionRecord.decision_id);
    await expect(this.decisionDisplay).toContainText(decisionRecord.decision);
  }

  async verifyAnomalousAmountPattern(transactionData) {
    await expect(this.amountInput).toHaveValue(transactionData.amount.toString());
    await expect(this.customerAvgAmountInput).toHaveValue(transactionData.customer_avg_amount.toString());
    await expect(this.amountDeviationInput).toHaveValue(transactionData.amount_deviation);
  }

  async includeGeographicInconsistency(geoRiskSignals) {
    await this.transactionLocationInput.fill(geoRiskSignals.transaction_location);
    await this.customerHomeLocationInput.fill(geoRiskSignals.customer_home_location);
    await this.customerTravelHistoryInput.fill(geoRiskSignals.customer_travel_history);
    await this.geoMatchInput.check({ force: geoRiskSignals.geo_match });
  }

  async verifyGeographicAnomaly(geoRiskSignals) {
    await expect(this.transactionLocationInput).toHaveValue(geoRiskSignals.transaction_location);
    await expect(this.customerHomeLocationInput).toHaveValue(geoRiskSignals.customer_home_location);
  }

  async includeHighVelocityPattern(velocitySignals) {
    await this.transactionsLastHourInput.fill(velocitySignals.transactions_last_hour.toString());
    await this.normalHourlyRateInput.fill(velocitySignals.normal_hourly_rate.toString());
    await this.velocityScoreInput.fill(velocitySignals.velocity_score);
    await this.merchantInput.fill(velocitySignals.merchant);
  }

  async verifyVelocityAnomaly(velocitySignals) {
    await expect(this.transactionsLastHourInput).toHaveValue(velocitySignals.transactions_last_hour.toString());
    await expect(this.velocityScoreInput).toHaveValue(velocitySignals.velocity_score);
  }

  async verifyAnomalousPatternsDetected() {
    await expect(this.riskEvaluationStatus).toContainText(/anomalous patterns|high-risk indicators|multiple anomalies/i);
  }

  async verifyHighRiskDecision(actualDecision, expectedDecision) {
    expect(actualDecision.risk_band).toBe(expectedDecision.risk_band);
    expect(actualDecision.risk_score).toBe(expectedDecision.risk_score);
    await expect(this.riskBandDisplay).toContainText(expectedDecision.risk_band);
    await expect(this.riskScoreDisplay).toContainText(expectedDecision.risk_score.toString());
    await expect(this.decisionDisplay).toContainText(/decline|hold/i);
  }

  async verifyHighRiskDecisionRecordedWithAnomalies(decisionRecord) {
    await expect(this.decisionIdDisplay).toContainText(decisionRecord.decision_id);
    await expect(this.modelVersionDisplay).toContainText(decisionRecord.model_version);
    await expect(this.riskBandDisplay).toContainText(/high/i);
  }

  async verifyCompromisedCardFlag(transactionData) {
    await expect(this.compromisedFlagInput).toBeChecked();
    await expect(this.compromisedSourceInput).toHaveValue(transactionData.compromised_source);
  }

  async includeFailedAuthorizationAttempts(failedAttemptsSignal) {
    await this.failedAttemptsLast10MinInput.fill(failedAttemptsSignal.failed_attempts_last_10min.toString());
    await this.failedReasonInput.fill(failedAttemptsSignal.failed_reason);
    await this.amountInput.fill(failedAttemptsSignal.amount.toString());
    await this.currencyInput.fill(failedAttemptsSignal.currency);
  }

  async verifyFailedAuthorizationPattern(failedAttemptsSignal) {
    await expect(this.failedAttemptsLast10MinInput).toHaveValue(failedAttemptsSignal.failed_attempts_last_10min.toString());
    await expect(this.failedReasonInput).toHaveValue(failedAttemptsSignal.failed_reason);
  }

  async includeAdditionalAnomalousSignals(additionalSignals) {
    await this.merchantCategoryInput.fill(additionalSignals.merchant_category);
    await this.deviceTrustInput.fill(additionalSignals.device_trust);
    await this.deviceFingerprintInput.fill(additionalSignals.device_fingerprint);
    await this.merchantInput.fill(additionalSignals.merchant);
  }

  async verifyMultipleHighRiskDimensions(additionalSignals) {
    await expect(this.merchantCategoryInput).toContainText(/high_risk/i);
    await expect(this.deviceTrustInput).toHaveValue('untrusted');
  }

  async verifyEngineReceivedCriticalFraudIndicators() {
    await expect(this.riskEvaluationStatus).toContainText(/critical fraud indicators|compromised card detected/i);
  }

  async verifyCompromisedCardDetectedAsCritical() {
    await expect(this.riskEvaluationStatus).toContainText(/compromised card|critical severity|highest priority/i);
  }

  async verifyConfirmedFraudDecision(actualDecision, expectedDecision) {
    expect(actualDecision.risk_band).toBe(expectedDecision.risk_band);
    expect(actualDecision.risk_score).toBe(expectedDecision.risk_score);
    await expect(this.riskBandDisplay).toContainText(/confirmed fraud/i);
    await expect(this.riskScoreDisplay).toContainText(expectedDecision.risk_score.toString());
    await expect(this.decisionDisplay).toContainText(/block/i);
  }

  async verifyConfirmedFraudRecordedWithProtection(decisionRecord) {
    await expect(this.decisionIdDisplay).toContainText(decisionRecord.decision_id);
    await expect(this.page.locator('[data-testid="protection-required"]')).toContainText('true');
  }

  async verifyIncompleteMerchantData(transactionData) {
    await expect(this.merchantInput).toBeEmpty();
    await expect(this.merchantCategoryInput).toBeEmpty();
    await expect(this.merchantBehaviorInput).toBeEmpty();
  }

  async includeOtherValidRiskSignals(validSignals) {
    if (validSignals.geo_location) {
      await this.geoLocationInput.fill(validSignals.geo_location);
    }
    if (validSignals.device_trust) {
      await this.deviceTrustInput.fill(validSignals.device_trust);
    }
    if (validSignals.velocity) {
      await this.velocityInput.fill(validSignals.velocity);
    }
    if (validSignals.failed_attempts !== undefined) {
      await this.failedAttemptsInput.fill(validSignals.failed_attempts.toString());
    }
    if (validSignals.timestamp) {
      await this.timestampInput.fill(validSignals.timestamp);
    }
    if (validSignals.merchant) {
      await this.merchantInput.fill(validSignals.merchant);
    }
    if (validSignals.merchant_category) {
      await this.merchantCategoryInput.fill(validSignals.merchant_category);
    }
  }

  async verifyNonMerchantSignalsPopulated(validSignals) {
    if (validSignals.geo_location) {
      await expect(this.geoLocationInput).toHaveValue(validSignals.geo_location);
    }
    if (validSignals.device_trust) {
      await expect(this.deviceTrustInput).toHaveValue(validSignals.device_trust);
    }
  }

  async verifyNonDeviceSignalsValid(validSignals) {
    await expect(this.merchantInput).toHaveValue(validSignals.merchant);
    await expect(this.merchantCategoryInput).toHaveValue(validSignals.merchant_category);
    await expect(this.geoLocationInput).toHaveValue(validSignals.geo_location);
  }

  async verifyEngineReceivedIncompleteData() {
    await expect(this.riskEvaluationStatus).toBeVisible();
  }

  async verifyMissingMerchantInfoDetected(transactionId) {
    await expect(this.errorLogDisplay).toContainText(`Missing merchant information for transaction ${transactionId}`);
  }

  async verifyMalformedDeviceDetected(transactionId) {
    await expect(this.errorLogDisplay).toContainText(`Malformed device indicators for transaction ${transactionId}`);
  }

  async verifyFailSafePolicyApplied(failSafePolicy) {
    await expect(this.failSafeAppliedDisplay).toContainText('true');
    await expect(this.page.locator('[data-testid="fail-safe-policy"]')).toContainText(failSafePolicy.fail_safe_policy);
  }

  async verifyValidDecisionFromAvailableSignals(actualDecision, expectedDecision) {
    expect(actualDecision.risk_score).toBe(expectedDecision.risk_score);
    expect(actualDecision.risk_band).toBe(expectedDecision.risk_band);
    await expect(this.riskScoreDisplay).toContainText(expectedDecision.risk_score.toString());
    await expect(this.riskBandDisplay).toContainText(expectedDecision.risk_band);
  }

  async verifyIncompleteDataRecordedInAudit(decisionRecord) {
    await expect(this.decisionIdDisplay).toContainText(decisionRecord.decision_id);
    await expect(this.dataQualityFlagDisplay).toContainText(decisionRecord.data_quality_flag);
    await expect(this.failSafeAppliedDisplay).toContainText('true');
  }

  async verifyMalformedDeviceData(transactionData) {
    await expect(this.deviceFingerprintInput).toHaveValue(transactionData.device_fingerprint);
    await expect(this.deviceTrustInput).toHaveValue(transactionData.device_trust);
  }

  async verifyMalformedDataHandledGracefully(failSafePolicy) {
    await expect(this.failSafeAppliedDisplay).toContainText('true');
    await expect(this.page.locator('[data-testid="fail-safe-policy"]')).toContainText(failSafePolicy.fail_safe_policy);
    await expect(this.riskEvaluationStatus).toContainText(/continued|gracefully handled/i);
  }

  async verifyValidDecisionWithoutDeviceSignals(actualDecision, expectedDecision) {
    expect(actualDecision.risk_score).toBe(expectedDecision.risk_score);
    expect(actualDecision.risk_band).toBe(expectedDecision.risk_band);
    await expect(this.decisionDisplay).toContainText(expectedDecision.decision);
  }

  async verifyMalformedDataRecordedInAudit(decisionRecord) {
    await expect(this.decisionIdDisplay).toContainText(decisionRecord.decision_id);
    await expect(this.dataQualityFlagDisplay).toContainText(decisionRecord.data_quality_flag);
    await expect(this.failSafeAppliedDisplay).toContainText('true');
    await expect(this.excludedSignalsDisplay).toContainText(decisionRecord.excluded_signals);
  }
};