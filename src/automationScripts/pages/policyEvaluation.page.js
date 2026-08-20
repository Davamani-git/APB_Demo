const { expect } = require('@playwright/test');

exports.PolicyEvaluationPage = class PolicyEvaluationPage {
  constructor(page) {
    this.page = page;
  }

  async prepareTransactionWithRiskScore(transactionData) {
    await expect(transactionData).toBeDefined();
    await expect(transactionData.transaction_id).toBeDefined();
    await expect(transactionData.risk_score).toBeDefined();
    console.log(`Transaction prepared with risk score: ${JSON.stringify(transactionData)}`);
  }

  async submitTransactionForPolicyEvaluation(endpoint, transactionData) {
    const apiContext = await this.page.request.newContext();
    const response = await apiContext.post(endpoint, {
      data: transactionData
    });
    console.log(`Transaction submitted for policy evaluation at ${endpoint}`);
    return response;
  }

  async verifyTransactionEvaluated(response) {
    await expect(response.status()).toBeLessThan(500);
    console.log(`Transaction evaluated by policy engine with status: ${response.status()}`);
  }

  async verifyAlertWorkflowTriggered(transactionId, shouldBeTriggered) {
    const apiContext = await this.page.request.newContext();
    const response = await apiContext.get(`/api/v1/alerts?transaction_id=${transactionId}`);
    const alertData = await response.json();
    
    if (shouldBeTriggered) {
      await expect(alertData.alert_triggered).toBe(true);
      await expect(alertData.alert_id).toBeDefined();
      console.log(`Alert workflow triggered for transaction: ${transactionId}`);
    } else {
      await expect(alertData.alert_triggered).toBe(false);
      console.log(`Alert workflow not triggered for transaction: ${transactionId}`);
    }
  }

  async queryDecisionRecord(transactionId) {
    const apiContext = await this.page.request.newContext();
    const response = await apiContext.get(`/api/v1/decisions?transaction_id=${transactionId}`);
    const decisionRecord = await response.json();
    console.log(`Decision record queried for transaction: ${transactionId}`);
    return decisionRecord;
  }

  async queryTransactionStatus(transactionId) {
    const apiContext = await this.page.request.newContext();
    const response = await apiContext.get(`/api/v1/transactions/${transactionId}/status`);
    const transactionStatus = await response.json();
    console.log(`Transaction status queried for transaction: ${transactionId}`);
    return transactionStatus;
  }

  async queryAuditTrail(transactionId) {
    const apiContext = await this.page.request.newContext();
    const response = await apiContext.get(`/api/v1/audit/trail?transaction_id=${transactionId}`);
    const auditTrail = await response.json();
    console.log(`Audit trail queried for transaction: ${transactionId}`);
    return auditTrail;
  }

  async verifyDecisionRecordContainsFields(decisionRecord, requiredFields) {
    for (const field of requiredFields) {
      await expect(decisionRecord).toHaveProperty(field);
      await expect(decisionRecord[field]).toBeDefined();
    }
    console.log(`Decision record contains all required fields: ${requiredFields.join(', ')}`);
  }

  async verifyThresholdLoggedInAuditTrail(auditTrail, expectedThreshold) {
    await expect(auditTrail).toHaveProperty('threshold_used');
    await expect(auditTrail.threshold_used).toBe(expectedThreshold);
    await expect(auditTrail).toHaveProperty('transaction_id');
    await expect(auditTrail).toHaveProperty('timestamp');
    console.log(`Threshold ${expectedThreshold} logged in audit trail`);
  }

  async verifyThresholdAndRiskScoreInAuditTrail(auditTrail, expectedThreshold, expectedRiskScore) {
    await expect(auditTrail).toHaveProperty('threshold_used');
    await expect(auditTrail.threshold_used).toBe(expectedThreshold);
    await expect(auditTrail).toHaveProperty('risk_score');
    await expect(auditTrail.risk_score).toBe(expectedRiskScore);
    await expect(auditTrail).toHaveProperty('timestamp');
    console.log(`Threshold ${expectedThreshold} and risk score ${expectedRiskScore} logged in audit trail`);
  }

  async verifyTransactionApproved(transactionStatus) {
    const approvedStatuses = ['approved', 'processed'];
    await expect(transactionStatus).toHaveProperty('status');
    await expect(approvedStatuses).toContain(transactionStatus.status);
    console.log(`Transaction approved with status: ${transactionStatus.status}`);
  }

  async verifyNoAlertDecisionInAuditTrail(auditTrail, riskScore, threshold) {
    await expect(auditTrail).toHaveProperty('decision');
    await expect(auditTrail.decision).toBe('no_alert');
    await expect(auditTrail).toHaveProperty('risk_score');
    await expect(auditTrail.risk_score).toBe(riskScore);
    await expect(auditTrail).toHaveProperty('threshold_used');
    await expect(auditTrail.threshold_used).toBe(threshold);
    console.log(`No alert decision logged in audit trail (risk score: ${riskScore}, threshold: ${threshold})`);
  }
};