describe('policyDecisionService', function() {
  'use strict';
  beforeEach(module('fraudDetectionApp'));
  var policyDecisionService, $httpBackend, $q, $rootScope, API_CONFIG, auditTrailService, riskDecisionModel;
  var mockTransactionData, mockThresholds;

  beforeEach(inject(function(_policyDecisionService_, _$httpBackend_, _$q_, _$rootScope_, _API_CONFIG_, _auditTrailService_, _riskDecisionModel_) {
    policyDecisionService = _policyDecisionService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    API_CONFIG = _API_CONFIG_;
    auditTrailService = _auditTrailService_;
    riskDecisionModel = _riskDecisionModel_;

    mockThresholds = { low: 30, medium: 60, high: 85 };

    mockTransactionData = {
      transaction: {
        transactionId: 'TXN-12345',
        merchantName: 'Amazon.com',
        merchantCategory: 'online_retail',
        amount: 150.00,
        currency: 'USD',
        location: { latitude: 40.7128, longitude: -74.0060, country: 'US' }
      },
      riskScore: 75,
      fraudSignals: ['velocity_check', 'location_mismatch'],
      modelVersion: '1.0.0'
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    policyDecisionService.clearCache();
  });

  describe('applyPolicyThresholds', function() {
    /*
    Test Documentation:
    - Test Name: should classify low risk score as low band with allow action
    - Purpose: Validates risk band classification for low risk scores
    - Scenario: Risk score below low threshold
    - Expected Result: riskBand is 'low' and action is 'allow'
    */
    it('should classify low risk score as low band with allow action', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond({ thresholds: mockThresholds });

      mockTransactionData.riskScore = 20;

      policyDecisionService.applyPolicyThresholds(mockTransactionData).then(function(decision) {
        expect(decision.riskBand).toBe('low');
        expect(decision.action).toBe('allow');
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should classify medium risk score as medium band with review action
    - Purpose: Validates risk band classification for medium risk scores
    - Scenario: Risk score between medium and high thresholds
    - Expected Result: riskBand is 'medium' and action is 'review'
    */
    it('should classify medium risk score as medium band with review action', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond({ thresholds: mockThresholds });

      mockTransactionData.riskScore = 70;

      policyDecisionService.applyPolicyThresholds(mockTransactionData).then(function(decision) {
        expect(decision.riskBand).toBe('medium');
        expect(decision.action).toBe('review');
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should classify high risk score as high band with block action
    - Purpose: Validates risk band classification for high risk scores
    - Scenario: Risk score at or above high threshold
    - Expected Result: riskBand is 'high' and action is 'block'
    */
    it('should classify high risk score as high band with block action', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond({ thresholds: mockThresholds });

      mockTransactionData.riskScore = 90;

      policyDecisionService.applyPolicyThresholds(mockTransactionData).then(function(decision) {
        expect(decision.riskBand).toBe('high');
        expect(decision.action).toBe('block');
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should include all transaction details in decision
    - Purpose: Validates that decision includes all required transaction fields
    - Scenario: Valid transaction data provided
    - Expected Result: Decision contains transactionId, merchantName, merchantCategory, amount, currency, location
    */
    it('should include all transaction details in decision', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond({ thresholds: mockThresholds });

      policyDecisionService.applyPolicyThresholds(mockTransactionData).then(function(decision) {
        expect(decision.transactionId).toBe('TXN-12345');
        expect(decision.merchantName).toBe('Amazon.com');
        expect(decision.merchantCategory).toBe('online_retail');
        expect(decision.amount).toBe(150.00);
        expect(decision.currency).toBe('USD');
        expect(decision.location).toBeDefined();
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should log decision to audit trail
    - Purpose: Validates that audit trail is updated with decision
    - Scenario: Decision is made
    - Expected Result: auditTrailService.logRiskDecision is called
    */
    it('should log decision to audit trail', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond({ thresholds: mockThresholds });

      spyOn(auditTrailService, 'logRiskDecision').and.returnValue($q.when({ status: 'logged' }));

      policyDecisionService.applyPolicyThresholds(mockTransactionData).then(function() {
        expect(auditTrailService.logRiskDecision).toHaveBeenCalled();
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle policy threshold API failure
    - Purpose: Validates graceful degradation when policy API is unavailable
    - Scenario: Policy threshold API returns error
    - Expected Result: Uses default thresholds and resolves successfully
    */
    it('should handle policy threshold API failure', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond(500, 'Server Error');

      policyDecisionService.applyPolicyThresholds(mockTransactionData).then(function(decision) {
        expect(decision.policyThresholds).toEqual({ low: 30, medium: 60, high: 85 });
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle edge case where risk score equals threshold
    - Purpose: Validates correct classification when score equals threshold boundary
    - Scenario: Risk score equals medium threshold (60)
    - Expected Result: Classified as medium band
    */
    it('should handle edge case where risk score equals medium threshold', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond({ thresholds: mockThresholds });

      mockTransactionData.riskScore = 60;

      policyDecisionService.applyPolicyThresholds(mockTransactionData).then(function(decision) {
        expect(decision.riskBand).toBe('medium');
        expect(decision.action).toBe('review');
        done();
      });

      $httpBackend.flush();
    });
  });

  describe('getPolicyThresholds', function() {
    /*
    Test Documentation:
    - Test Name: should fetch policy thresholds from API
    - Purpose: Validates that thresholds are retrieved from API endpoint
    - Scenario: First call to getPolicyThresholds
    - Expected Result: Returns thresholds from API response
    */
    it('should fetch policy thresholds from API', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond({ thresholds: mockThresholds });

      policyDecisionService.getPolicyThresholds().then(function(thresholds) {
        expect(thresholds).toEqual(mockThresholds);
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should cache policy thresholds after first fetch
    - Purpose: Validates that subsequent calls use cached values without API call
    - Scenario: getPolicyThresholds called twice
    - Expected Result: Second call returns cached thresholds without new API request
    */
    it('should cache policy thresholds after first fetch', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond({ thresholds: mockThresholds });

      policyDecisionService.getPolicyThresholds().then(function(thresholds1) {
        expect(thresholds1).toEqual(mockThresholds);
        return policyDecisionService.getPolicyThresholds();
      }).then(function(thresholds2) {
        expect(thresholds2).toEqual(mockThresholds);
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should use default thresholds when API returns empty data
    - Purpose: Validates fallback to default thresholds when API response lacks thresholds
    - Scenario: API returns response without thresholds field
    - Expected Result: Returns default thresholds { low: 30, medium: 60, high: 85 }
    */
    it('should use default thresholds when API returns empty data', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond({ data: 'no thresholds' });

      policyDecisionService.getPolicyThresholds().then(function(thresholds) {
        expect(thresholds).toEqual({ low: 30, medium: 60, high: 85 });
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle API error and use default thresholds
    - Purpose: Validates graceful degradation when API is unavailable
    - Scenario: API returns error response
    - Expected Result: Returns default thresholds and resolves promise
    */
    it('should handle API error and use default thresholds', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond(500, 'Server Error');

      policyDecisionService.getPolicyThresholds().then(function(thresholds) {
        expect(thresholds).toEqual({ low: 30, medium: 60, high: 85 });
        done();
      });

      $httpBackend.flush();
    });
  });

  describe('clearCache', function() {
    /*
    Test Documentation:
    - Test Name: should clear cached thresholds
    - Purpose: Validates that clearCache removes cached thresholds
    - Scenario: Cache is populated, then clearCache is called
    - Expected Result: Next getPolicyThresholds call fetches fresh data from API
    */
    it('should clear cached thresholds', function(done) {
      var policyUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.policyThresholds;
      $httpBackend.expectGET(policyUrl).respond({ thresholds: mockThresholds });

      policyDecisionService.getPolicyThresholds().then(function() {
        policyDecisionService.clearCache();
        $httpBackend.expectGET(policyUrl).respond({ thresholds: { low: 25, medium: 55, high: 80 } });
        return policyDecisionService.getPolicyThresholds();
      }).then(function(thresholds) {
        expect(thresholds).toEqual({ low: 25, medium: 55, high: 80 });
        done();
      });

      $httpBackend.flush();
    });
  });

  /*
  Coverage Report:
  - Functions tested: applyPolicyThresholds, getPolicyThresholds, clearCache
  - Scenarios covered: low/medium/high risk classification, transaction detail inclusion, audit logging, API failure handling, threshold caching, cache clearing, edge cases with threshold boundaries
  - Uncovered scenarios: invalid threshold values, concurrent API requests, malformed transaction data
  */
});
