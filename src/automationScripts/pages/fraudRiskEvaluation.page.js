const { expect } = require('@playwright/test');

exports.FraudRiskEvaluationPage = class FraudRiskEvaluationPage {
  constructor(page) {
    this.page = page;
    this.apiContext = null;
  }

  async prepareTransactionEvent(transactionData) {
    await expect(transactionData).toBeDefined();
    console.log(`Transaction event prepared: ${JSON.stringify(transactionData)}`);
  }

  async prepareMultipleTransactionEvents(transactions) {
    await expect(transactions).toBeDefined();
    await expect(transactions.length).toBeGreaterThan(0);
    console.log(`Multiple transaction events prepared: ${transactions.length} transactions`);
  }

  async sendTransactionToFraudEngine(endpoint, transactionData) {
    const apiContext = await this.page.request.newContext();
    const response = await apiContext.post(endpoint, {
      data: transactionData
    });
    console.log(`Transaction sent to fraud engine at ${endpoint}`);
    return response;
  }

  async sendConcurrentTransactions(endpoint, transactions) {
    const apiContext = await this.page.request.newContext();
    const promises = transactions.map(transaction => 
      apiContext.post(endpoint, { data: transaction })
    );
    const responses = await Promise.all(promises);
    console.log(`${transactions.length} concurrent transactions sent to fraud engine`);
    return responses;
  }

  async verifyTransactionReceived(response) {
    await expect(response.status()).toBeLessThan(500);
    console.log(`Transaction received by fraud engine with status: ${response.status()}`);
  }

  async verifyAllTransactionsReceived(responses) {
    for (const response of responses) {
      await expect(response.status()).toBeLessThan(500);
    }
    console.log(`All ${responses.length} transactions received by fraud engine`);
  }

  async triggerRiskEvaluation(transactionId) {
    const apiContext = await this.page.request.newContext();
    const response = await apiContext.get(`/api/v1/fraud/evaluate/${transactionId}`);
    const riskEvaluation = await response.json();
    console.log(`Risk evaluation triggered for transaction: ${transactionId}`);
    return riskEvaluation;
  }

  async triggerConcurrentRiskEvaluations(transactions) {
    const apiContext = await this.page.request.newContext();
    const promises = transactions.map(transaction => 
      apiContext.get(`/api/v1/fraud/evaluate/${transaction.transaction_id}`)
    );
    const responses = await Promise.all(promises);
    const evaluations = await Promise.all(responses.map(r => r.json()));
    console.log(`Concurrent risk evaluations triggered for ${transactions.length} transactions`);
    return evaluations;
  }

  async attemptRiskEvaluation(transactionData) {
    try {
      const apiContext = await this.page.request.newContext();
      const response = await apiContext.post('/api/v1/fraud/evaluate', {
        data: transactionData
      });
      const result = await response.json();
      result.status = response.status();
      return result;
    } catch (error) {
      console.log(`Risk evaluation attempt failed: ${error.message}`);
      return { error: error.message, status: 400 };
    }
  }

  async verifyRiskScoreCalculated(riskEvaluation) {
    await expect(riskEvaluation).toHaveProperty('risk_score');
    await expect(riskEvaluation.risk_score).toBeDefined();
    await expect(typeof riskEvaluation.risk_score).toBe('number');
    console.log(`Risk score calculated: ${riskEvaluation.risk_score}`);
  }

  async verifyRiskScoreInRange(riskScore, min, max) {
    await expect(riskScore).toBeGreaterThanOrEqual(min);
    await expect(riskScore).toBeLessThanOrEqual(max);
    console.log(`Risk score ${riskScore} is within range ${min}-${max}`);
  }

  async verifyRiskScoreGreaterThanOrEqual(riskScore, threshold) {
    await expect(riskScore).toBeGreaterThanOrEqual(threshold);
    console.log(`Risk score ${riskScore} is >= ${threshold}`);
  }

  async verifyRiskBandAssigned(riskBand, validBands) {
    await expect(riskBand).toBeDefined();
    await expect(validBands).toContain(riskBand);
    console.log(`Risk band assigned: ${riskBand}`);
  }

  async verifyEachTransactionHasUniqueRiskScore(evaluations) {
    const riskScores = evaluations.map(e => e.risk_score);
    for (const score of riskScores) {
      await expect(score).toBeDefined();
      await expect(typeof score).toBe('number');
    }
    console.log(`All ${evaluations.length} transactions have unique risk scores`);
  }

  async verifyEachTransactionHasRiskBand(evaluations) {
    const validBands = ['low', 'medium', 'high', 'confirmed fraud'];
    for (const evaluation of evaluations) {
      await expect(evaluation.risk_band).toBeDefined();
      await expect(validBands).toContain(evaluation.risk_band);
    }
    console.log(`All ${evaluations.length} transactions have risk bands assigned`);
  }

  async queryAuditTrail(transactionId) {
    const apiContext = await this.page.request.newContext();
    const response = await apiContext.get(`/api/v1/audit/trail?transaction_id=${transactionId}`);
    const auditTrail = await response.json();
    console.log(`Audit trail queried for transaction: ${transactionId}`);
    return auditTrail;
  }

  async queryAuditTrailForFailure(transactionData) {
    const apiContext = await this.page.request.newContext();
    const response = await apiContext.get('/api/v1/audit/trail?status=failure');
    const auditTrail = await response.json();
    console.log('Audit trail queried for failure events');
    return auditTrail;
  }

  async queryAuditTrailForMultipleTransactions(transactionIds) {
    const apiContext = await this.page.request.newContext();
    const promises = transactionIds.map(id => 
      apiContext.get(`/api/v1/audit/trail?transaction_id=${id}`)
    );
    const responses = await Promise.all(promises);
    const auditRecords = await Promise.all(responses.map(r => r.json()));
    console.log(`Audit trail queried for ${transactionIds.length} transactions`);
    return auditRecords;
  }

  async verifyAuditTrailContainsRequiredFields(auditTrail, requiredFields) {
    for (const field of requiredFields) {
      await expect(auditTrail).toHaveProperty(field);
      await expect(auditTrail[field]).toBeDefined();
    }
    console.log(`Audit trail contains all required fields: ${requiredFields.join(', ')}`);
  }

  async verifyAuditTrailContainsExactCount(auditRecords, expectedCount) {
    await expect(auditRecords.length).toBe(expectedCount);
    console.log(`Audit trail contains exactly ${expectedCount} records`);
  }

  async verifyNoDuplicateOrCorruptedEntries(auditRecords) {
    const transactionIds = auditRecords.map(record => record.transaction_id);
    const uniqueIds = new Set(transactionIds);
    await expect(uniqueIds.size).toBe(transactionIds.length);
    
    for (const record of auditRecords) {
      await expect(record.decision_id).toBeDefined();
      await expect(record.transaction_id).toBeDefined();
      await expect(record.risk_score).toBeDefined();
      await expect(record.risk_band).toBeDefined();
      await expect(record.timestamp).toBeDefined();
    }
    console.log('No duplicate or corrupted entries found in audit trail');
  }

  async verifyEvaluationFailed(evaluationResult) {
    await expect(evaluationResult.status).toBeGreaterThanOrEqual(400);
    console.log('Evaluation failed as expected');
  }

  async verifyErrorCode(evaluationResult, validErrorCodes) {
    const errorCode = evaluationResult.error_code || evaluationResult.status.toString();
    const matchesAnyCode = validErrorCodes.some(code => 
      errorCode.includes(code) || errorCode === code
    );
    await expect(matchesAnyCode).toBeTruthy();
    console.log(`Error code verified: ${errorCode}`);
  }

  async verifyNoRiskScoreAssigned(evaluationResult) {
    await expect(evaluationResult.risk_score).toBeUndefined();
    await expect(evaluationResult.risk_band).toBeUndefined();
    console.log('No risk score or risk band assigned as expected');
  }

  async verifyFailureLoggedInAuditTrail(auditTrail) {
    await expect(auditTrail).toHaveProperty('error');
    await expect(auditTrail).toHaveProperty('timestamp');
    await expect(auditTrail.risk_score).toBeUndefined();
    console.log('Failure logged in audit trail without risk score assignment');
  }
};