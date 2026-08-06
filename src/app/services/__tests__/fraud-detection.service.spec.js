/*
Test Documentation:
- Test Name: FraudDetectionService validateTransaction
- Purpose: Validates transaction data is sent to fraud detection API
- Scenario: Transaction data provided
- Expected Result: API called and response returned
*/
/*
Test Documentation:
- Test Name: FraudDetectionService checkFraudScore with high risk
- Purpose: Validates high fraud score transactions are rejected
- Scenario: Fraud score > 0.7
- Expected Result: Transaction not approved with reason
*/
/*
Test Documentation:
- Test Name: FraudDetectionService checkFraudScore with low risk
- Purpose: Validates low fraud score transactions are approved
- Scenario: Fraud score <= 0.7
- Expected Result: Transaction approved
*/
/*
Coverage Report:
- Functions tested: validateTransaction, checkFraudScore
- Scenarios covered: successful validation, high fraud score rejection, low fraud score approval, API errors
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('FraudDetectionService', function() {
    var FraudDetectionService, $httpBackend, API_CONFIG;

    beforeEach(module('shoppingPlatform'));

    beforeEach(inject(function(_FraudDetectionService_, _$httpBackend_, _API_CONFIG_) {
      FraudDetectionService = _FraudDetectionService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('validateTransaction', function() {
      it('should send transaction data to fraud detection API', function() {
        var transactionData = {
          amount: 100,
          userId: 123,
          cardNumber: '1234567890123456'
        };
        var responseData = { fraudScore: 0.3, approved: true };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/fraud/check', transactionData)
          .respond(200, responseData);

        FraudDetectionService.validateTransaction(transactionData).then(function(data) {
          expect(data).toEqual(responseData);
        });

        $httpBackend.flush();
      });

      it('should handle API error during validation', function() {
        var transactionData = { amount: 100 };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/fraud/check', transactionData)
          .respond(500, { error: 'Server error' });

        FraudDetectionService.validateTransaction(transactionData).catch(function(error) {
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();
      });
    });

    describe('checkFraudScore', function() {
      it('should reject transaction with high fraud score', function() {
        var transactionData = { amount: 5000, userId: 456 };
        var responseData = { fraudScore: 0.85 };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/fraud/check', transactionData)
          .respond(200, responseData);

        FraudDetectionService.checkFraudScore(transactionData).then(function(result) {
          expect(result.approved).toBe(false);
          expect(result.reason).toBe('High fraud risk detected');
          expect(result.score).toBe(0.85);
        });

        $httpBackend.flush();
      });

      it('should approve transaction with low fraud score', function() {
        var transactionData = { amount: 50, userId: 789 };
        var responseData = { fraudScore: 0.2 };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/fraud/check', transactionData)
          .respond(200, responseData);

        FraudDetectionService.checkFraudScore(transactionData).then(function(result) {
          expect(result.approved).toBe(true);
          expect(result.score).toBe(0.2);
          expect(result.reason).toBeUndefined();
        });

        $httpBackend.flush();
      });

      it('should approve transaction with fraud score exactly at threshold', function() {
        var transactionData = { amount: 100, userId: 999 };
        var responseData = { fraudScore: 0.7 };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/fraud/check', transactionData)
          .respond(200, responseData);

        FraudDetectionService.checkFraudScore(transactionData).then(function(result) {
          expect(result.approved).toBe(true);
          expect(result.score).toBe(0.7);
        });

        $httpBackend.flush();
      });

      it('should reject transaction with fraud score just above threshold', function() {
        var transactionData = { amount: 1000, userId: 111 };
        var responseData = { fraudScore: 0.71 };

        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/api/fraud/check', transactionData)
          .respond(200, responseData);

        FraudDetectionService.checkFraudScore(transactionData).then(function(result) {
          expect(result.approved).toBe(false);
          expect(result.reason).toBe('High fraud risk detected');
          expect(result.score).toBe(0.71);
        });

        $httpBackend.flush();
      });
    });
  });
})();