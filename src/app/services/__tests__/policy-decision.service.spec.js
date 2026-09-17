/*
Test Documentation:
- Test Name: PolicyDecisionService Unit Tests
- Purpose: Validate fraud policy evaluation logic including risk scoring, rule application, and decision-making based on transaction attributes.
- Scenario: evaluateTransaction with various risk levels, applyRules with different transaction patterns, edge cases (zero amount, missing fields), boundary conditions.
- Expected Result: Correct risk scores, risk levels, and decisions (approve/alert/decline) based on PRD-defined thresholds and rules.
*/

describe('PolicyDecisionService', function () {
  'use strict';

  var PolicyDecisionService;

  beforeEach(module('fraudAlertApp'));

  beforeEach(inject(function (_PolicyDecisionService_) {
    PolicyDecisionService = _PolicyDecisionService_;
  }));

  // ─── evaluateTransaction ────────────────────────────────────────────────────

  describe('evaluateTransaction()', function () {

    it('should return LOW risk level for transactions with score < 30', function () {
      var transaction = { transactionId: 'TXN-001', amount: 10.00, merchant: 'Safe Store' };
      var result = PolicyDecisionService.evaluateTransaction(transaction);
      expect(result.riskLevel).toBe('LOW');
      expect(result.score).toBeLessThan(30);
    });

    it('should return MEDIUM risk level for transactions with score >= 30 and < 70', function () {
      var transaction = { transactionId: 'TXN-002', amount: 150.00, merchant: 'Normal Store' };
      var result = PolicyDecisionService.evaluateTransaction(transaction);
      expect(result.riskLevel).toBe('MEDIUM');
      expect(result.score).toBeGreaterThanOrEqual(30);
      expect(result.score).toBeLessThan(70);
    });

    it('should return HIGH risk level for transactions with score >= 70 and < 90', function () {
      var transaction = { transactionId: 'TXN-003', amount: 800.00, merchant: 'Risky Merchant' };
      var result = PolicyDecisionService.evaluateTransaction(transaction);
      expect(result.riskLevel).toBe('HIGH');
      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.score).toBeLessThan(90);
    });

    it('should return CRITICAL risk level for transactions with score >= 90', function () {
      var transaction = { transactionId: 'TXN-004', amount: 5000.00, merchant: 'Suspicious Vendor' };
      var result = PolicyDecisionService.evaluateTransaction(transaction);
      expect(result.riskLevel).toBe('CRITICAL');
      expect(result.score).toBeGreaterThanOrEqual(90);
    });

    it('should include score and riskLevel in the returned object', function () {
      var transaction = { transactionId: 'TXN-005', amount: 50.00 };
      var result = PolicyDecisionService.evaluateTransaction(transaction);
      expect(result).toEqual(jasmine.objectContaining({
        score: jasmine.any(Number),
        riskLevel: jasmine.any(String)
      }));
    });

    it('should handle transactions with zero amount', function () {
      var transaction = { transactionId: 'TXN-ZERO', amount: 0 };
      var result = PolicyDecisionService.evaluateTransaction(transaction);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.riskLevel).toBeDefined();
    });

    it('should handle transactions with missing optional fields', function () {
      var transaction = { transactionId: 'TXN-MIN' };
      var result = PolicyDecisionService.evaluateTransaction(transaction);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.riskLevel).toBeDefined();
    });

    it('should handle transactions with very large amounts', function () {
      var transaction = { transactionId: 'TXN-LARGE', amount: 999999.99 };
      var result = PolicyDecisionService.evaluateTransaction(transaction);
      expect(result.riskLevel).toBe('CRITICAL');
    });
  });

  // ─── applyRules ─────────────────────────────────────────────────────────────

  describe('applyRules()', function () {

    it('should return approve decision for LOW risk transactions', function () {
      var transaction = { transactionId: 'TXN-001', amount: 10.00 };
      var riskScore = { score: 20, riskLevel: 'LOW' };
      var decision = PolicyDecisionService.applyRules(transaction, riskScore);
      expect(decision.action).toBe('approve');
      expect(decision.reason).toContain('Low risk');
    });

    it('should return alert decision for MEDIUM risk transactions', function () {
      var transaction = { transactionId: 'TXN-002', amount: 150.00 };
      var riskScore = { score: 50, riskLevel: 'MEDIUM' };
      var decision = PolicyDecisionService.applyRules(transaction, riskScore);
      expect(decision.action).toBe('alert');
      expect(decision.reason).toContain('Medium risk');
    });

    it('should return alert decision for HIGH risk transactions', function () {
      var transaction = { transactionId: 'TXN-003', amount: 800.00 };
      var riskScore = { score: 75, riskLevel: 'HIGH' };
      var decision = PolicyDecisionService.applyRules(transaction, riskScore);
      expect(decision.action).toBe('alert');
      expect(decision.reason).toContain('High risk');
    });

    it('should return decline decision for CRITICAL risk transactions', function () {
      var transaction = { transactionId: 'TXN-004', amount: 5000.00 };
      var riskScore = { score: 95, riskLevel: 'CRITICAL' };
      var decision = PolicyDecisionService.applyRules(transaction, riskScore);
      expect(decision.action).toBe('decline');
      expect(decision.reason).toContain('Critical risk');
    });

    it('should return a decision object with action and reason properties', function () {
      var transaction = { transactionId: 'TXN-005', amount: 100.00 };
      var riskScore = { score: 40, riskLevel: 'MEDIUM' };
      var decision = PolicyDecisionService.applyRules(transaction, riskScore);
      expect(decision).toEqual(jasmine.objectContaining({
        action: jasmine.any(String),
        reason: jasmine.any(String)
      }));
    });

    it('should handle edge case where riskLevel is undefined', function () {
      var transaction = { transactionId: 'TXN-EDGE' };
      var riskScore = { score: 50 };
      var decision = PolicyDecisionService.applyRules(transaction, riskScore);
      expect(decision.action).toBeDefined();
      expect(decision.reason).toBeDefined();
    });

    it('should handle transactions at the LOW-MEDIUM boundary (score = 30)', function () {
      var transaction = { transactionId: 'TXN-BOUNDARY-1', amount: 100.00 };
      var riskScore = { score: 30, riskLevel: 'MEDIUM' };
      var decision = PolicyDecisionService.applyRules(transaction, riskScore);
      expect(decision.action).toBe('alert');
    });

    it('should handle transactions at the MEDIUM-HIGH boundary (score = 70)', function () {
      var transaction = { transactionId: 'TXN-BOUNDARY-2', amount: 500.00 };
      var riskScore = { score: 70, riskLevel: 'HIGH' };
      var decision = PolicyDecisionService.applyRules(transaction, riskScore);
      expect(decision.action).toBe('alert');
    });

    it('should handle transactions at the HIGH-CRITICAL boundary (score = 90)', function () {
      var transaction = { transactionId: 'TXN-BOUNDARY-3', amount: 2000.00 };
      var riskScore = { score: 90, riskLevel: 'CRITICAL' };
      var decision = PolicyDecisionService.applyRules(transaction, riskScore);
      expect(decision.action).toBe('decline');
    });
  });

  /*
  Coverage Report:
  - Functions tested: evaluateTransaction, applyRules
  - Scenarios covered:
      evaluateTransaction -> LOW, MEDIUM, HIGH, CRITICAL risk levels, zero amount, missing fields, very large amounts
      applyRules          -> approve (LOW), alert (MEDIUM/HIGH), decline (CRITICAL), edge cases, boundary conditions (30, 70, 90)
  - Uncovered scenarios: none identified for this service
  */
});
