describe('transactionIngestionService', function() {
  'use strict';
  beforeEach(module('fraudDetectionApp'));
  var transactionIngestionService, $httpBackend, $q, $rootScope, API_CONFIG, fraudRiskScoringFactory, transactionModel;
  var mockTransactions, mockRiskResult;

  beforeEach(inject(function(_transactionIngestionService_, _$httpBackend_, _$q_, _$rootScope_, _API_CONFIG_, _fraudRiskScoringFactory_, _transactionModel_) {
    transactionIngestionService = _transactionIngestionService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    API_CONFIG = _API_CONFIG_;
    fraudRiskScoringFactory = _fraudRiskScoringFactory_;
    transactionModel = _transactionModel_;

    mockTransactions = [
      {
        transactionId: 'TXN-001',
        cardIdentifier: '****1234',
        amount: 100,
        currency: 'USD',
        merchantId: 'MER-001',
        merchantName: 'Amazon.com',
        merchantCategory: 'online_retail',
        location: { latitude: 40.7128, longitude: -74.0060, country: 'US' },
        timestamp: new Date(),
        authorizationStatus: 'approved'
      },
      {
        transactionId: 'TXN-002',
        cardIdentifier: '****5678',
        amount: 250,
        currency: 'USD',
        merchantId: 'MER-002',
        merchantName: 'Shell Gas Station',
        merchantCategory: 'fuel',
        location: { latitude: 40.7128, longitude: -74.0060, country: 'US' },
        timestamp: new Date(),
        authorizationStatus: 'approved'
      }
    ];

    mockRiskResult = {
      riskScore: 45,
      fraudSignals: ['velocity_check'],
      modelVersion: '1.0.0'
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('fetchTransactionEvents', function() {
    /*
    Test Documentation:
    - Test Name: should fetch and validate transactions from API
    - Purpose: Validates that transactions are retrieved and validated from API endpoint
    - Scenario: API returns valid transactions
    - Expected Result: Returns array of validated transaction objects
    */
    it('should fetch and validate transactions from API', function(done) {
      var transactionUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(transactionUrl).respond({ transactions: mockTransactions });

      spyOn(transactionModel, 'create').and.callThrough();
      spyOn(transactionModel, 'validate').and.returnValue(true);

      transactionIngestionService.fetchTransactionEvents().then(function(transactions) {
        expect(transactions.length).toBe(2);
        expect(transactionModel.create).toHaveBeenCalledTimes(2);
        expect(transactionModel.validate).toHaveBeenCalledTimes(2);
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should filter out invalid transactions
    - Purpose: Validates that only valid transactions are returned
    - Scenario: API returns mix of valid and invalid transactions
    - Expected Result: Returns only validated transactions
    */
    it('should filter out invalid transactions', function(done) {
      var transactionUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(transactionUrl).respond({ transactions: mockTransactions });

      spyOn(transactionModel, 'create').and.callThrough();
      spyOn(transactionModel, 'validate').and.returnValues(true, false);

      transactionIngestionService.fetchTransactionEvents().then(function(transactions) {
        expect(transactions.length).toBe(1);
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transaction list from API
    - Purpose: Validates handling of empty API response
    - Scenario: API returns empty transactions array
    - Expected Result: Returns empty array
    */
    it('should handle empty transaction list from API', function(done) {
      var transactionUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(transactionUrl).respond({ transactions: [] });

      transactionIngestionService.fetchTransactionEvents().then(function(transactions) {
        expect(transactions.length).toBe(0);
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle API failure and use mock data
    - Purpose: Validates graceful degradation when transaction API is unavailable
    - Scenario: API returns error response
    - Expected Result: Returns mock transactions
    */
    it('should handle API failure and use mock data', function(done) {
      var transactionUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(transactionUrl).respond(500, 'Server Error');

      spyOn(transactionModel, 'create').and.callThrough();
      spyOn(transactionModel, 'validate').and.returnValue(true);

      transactionIngestionService.fetchTransactionEvents().then(function(transactions) {
        expect(transactions.length).toBe(10);
        expect(transactions[0].transactionId).toMatch(/^TXN-/);
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle malformed API response
    - Purpose: Validates handling of API response without transactions field
    - Scenario: API returns response without transactions array
    - Expected Result: Returns empty array
    */
    it('should handle malformed API response', function(done) {
      var transactionUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions;
      $httpBackend.expectGET(transactionUrl).respond({ data: 'invalid' });

      transactionIngestionService.fetchTransactionEvents().then(function(transactions) {
        expect(transactions.length).toBe(0);
        done();
      });

      $httpBackend.flush();
    });
  });

  describe('processTransactionBatch', function() {
    /*
    Test Documentation:
    - Test Name: should process batch of transactions and calculate risk scores
    - Purpose: Validates that batch processing invokes risk scoring for each transaction
    - Scenario: Valid transaction batch provided
    - Expected Result: Returns array of transactions with risk scores and fraud signals
    */
    it('should process batch of transactions and calculate risk scores', function(done) {
      spyOn(fraudRiskScoringFactory, 'calculateRiskScore').and.returnValue(mockRiskResult);

      transactionIngestionService.processTransactionBatch(mockTransactions).then(function(results) {
        expect(results.length).toBe(2);
        expect(fraudRiskScoringFactory.calculateRiskScore).toHaveBeenCalledTimes(2);
        expect(results[0].riskScore).toBe(45);
        expect(results[0].fraudSignals).toEqual(['velocity_check']);
        done();
      });

      $rootScope.$apply();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transaction batch
    - Purpose: Validates handling of empty batch
    - Scenario: Empty array provided
    - Expected Result: Returns empty array
    */
    it('should handle empty transaction batch', function(done) {
      transactionIngestionService.processTransactionBatch([]).then(function(results) {
        expect(results.length).toBe(0);
        done();
      });

      $rootScope.$apply();
    });

    /*
    Test Documentation:
    - Test Name: should handle risk scoring errors gracefully
    - Purpose: Validates that errors in risk scoring don't break batch processing
    - Scenario: Risk scoring throws error for one transaction
    - Expected Result: Continues processing remaining transactions
    */
    it('should handle risk scoring errors gracefully', function(done) {
      spyOn(fraudRiskScoringFactory, 'calculateRiskScore').and.returnValues(
        mockRiskResult,
        { error: 'scoring_failed' }
      );

      transactionIngestionService.processTransactionBatch(mockTransactions).then(function(results) {
        expect(results.length).toBe(2);
        expect(results[0].riskScore).toBe(45);
        expect(results[1].error).toBe('scoring_failed');
        done();
      });

      $rootScope.$apply();
    });
  });

  describe('getTransactionById', function() {
    /*
    Test Documentation:
    - Test Name: should retrieve transaction by ID from API
    - Purpose: Validates that specific transaction can be fetched by ID
    - Scenario: Valid transaction ID provided
    - Expected Result: Returns transaction object matching the ID
    */
    it('should retrieve transaction by ID from API', function(done) {
      var transactionId = 'TXN-001';
      var transactionUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId;
      $httpBackend.expectGET(transactionUrl).respond({ transaction: mockTransactions[0] });

      transactionIngestionService.getTransactionById(transactionId).then(function(transaction) {
        expect(transaction.transactionId).toBe('TXN-001');
        expect(transaction.merchantName).toBe('Amazon.com');
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle transaction not found
    - Purpose: Validates handling of non-existent transaction ID
    - Scenario: API returns 404 for transaction ID
    - Expected Result: Promise rejects with error
    */
    it('should handle transaction not found', function(done) {
      var transactionId = 'TXN-999';
      var transactionUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '/' + transactionId;
      $httpBackend.expectGET(transactionUrl).respond(404, 'Not Found');

      transactionIngestionService.getTransactionById(transactionId).catch(function(error) {
        expect(error.status).toBe(404);
        done();
      });

      $httpBackend.flush();
    });
  });

  /*
  Coverage Report:
  - Functions tested: fetchTransactionEvents, processTransactionBatch, getTransactionById
  - Scenarios covered: successful API fetch, transaction validation, invalid transaction filtering, empty responses, API failures with mock data fallback, malformed responses, batch processing with risk scoring, empty batches, risk scoring errors, transaction retrieval by ID, not found handling
  - Uncovered scenarios: network timeout scenarios, concurrent batch processing, transaction caching
  */
});
