/*
Test Documentation:
- Test Name: TransactionIngestionService Unit Tests
- Purpose: Validate transaction data retrieval operations including HTTP interactions, success and error paths.
- Scenario: getTransactions success/failure, getTransactionById success/failure, correct URL construction, HTTP error propagation.
- Expected Result: Each method correctly constructs the URL, sends GET requests, resolves with response.data on success, and re-throws errors on failure.
*/

describe('TransactionIngestionService', function () {
  'use strict';

  var TransactionIngestionService, $httpBackend, API_CONFIG;

  var mockTransactionList = [
    { transactionId: 'TXN-001', amount: 100.00, merchant: 'Store A' },
    { transactionId: 'TXN-002', amount: 250.00, merchant: 'Store B' }
  ];

  var mockTransaction = {
    transactionId: 'TXN-001',
    amount: 100.00,
    merchant: 'Store A',
    currency: 'USD',
    timestamp: '2026-08-01T10:00:00.000Z'
  };

  beforeEach(module('fraudAlertApp'));

  beforeEach(module(function ($provide) {
    $provide.constant('API_CONFIG', {
      baseUrl: 'https://api.example.com',
      transactionsEndpoint: '/transactions'
    });
  }));

  beforeEach(inject(function (_TransactionIngestionService_, _$httpBackend_, _API_CONFIG_) {
    TransactionIngestionService = _TransactionIngestionService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ─── getTransactions ────────────────────────────────────────────────────────

  describe('getTransactions()', function () {

    it('should GET all transactions from the correct endpoint and return response data', function () {
      $httpBackend.expectGET('https://api.example.com/transactions').respond(200, mockTransactionList);

      var result;
      TransactionIngestionService.getTransactions().then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual(mockTransactionList);
      expect(result.length).toBe(2);
    });

    it('should return an empty array when no transactions exist', function () {
      $httpBackend.expectGET('https://api.example.com/transactions').respond(200, []);

      var result;
      TransactionIngestionService.getTransactions().then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should reject and re-throw error when GET transactions fails with 500', function () {
      $httpBackend.expectGET('https://api.example.com/transactions').respond(500, { message: 'Server Error' });

      var caughtError;
      TransactionIngestionService.getTransactions().catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });

    it('should reject and re-throw error when GET transactions fails with 503', function () {
      $httpBackend.expectGET('https://api.example.com/transactions').respond(503, { message: 'Service Unavailable' });

      var caughtError;
      TransactionIngestionService.getTransactions().catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });

    it('should handle 401 Unauthorized error on getTransactions', function () {
      $httpBackend.expectGET('https://api.example.com/transactions').respond(401, { message: 'Unauthorized' });

      var caughtError;
      TransactionIngestionService.getTransactions().catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });
  });

  // ─── getTransactionById ─────────────────────────────────────────────────────

  describe('getTransactionById()', function () {

    it('should GET a single transaction by ID from the correct endpoint', function () {
      $httpBackend.expectGET('https://api.example.com/transactions/TXN-001').respond(200, mockTransaction);

      var result;
      TransactionIngestionService.getTransactionById('TXN-001').then(function (data) { result = data; });

      $httpBackend.flush();
      expect(result).toEqual(mockTransaction);
    });

    it('should construct the correct URL with the provided transactionId', function () {
      $httpBackend.expectGET('https://api.example.com/transactions/TXN-999').respond(200, { transactionId: 'TXN-999' });

      TransactionIngestionService.getTransactionById('TXN-999');
      $httpBackend.flush();
    });

    it('should reject and re-throw error when transaction is not found (404)', function () {
      $httpBackend.expectGET('https://api.example.com/transactions/UNKNOWN').respond(404, { message: 'Not Found' });

      var caughtError;
      TransactionIngestionService.getTransactionById('UNKNOWN').catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });

    it('should reject and re-throw error on 500 server error', function () {
      $httpBackend.expectGET('https://api.example.com/transactions/TXN-001').respond(500, {});

      var caughtError;
      TransactionIngestionService.getTransactionById('TXN-001').catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });

    it('should reject and re-throw error on 403 Forbidden', function () {
      $httpBackend.expectGET('https://api.example.com/transactions/TXN-001').respond(403, { message: 'Forbidden' });

      var caughtError;
      TransactionIngestionService.getTransactionById('TXN-001').catch(function (err) { caughtError = err; });

      $httpBackend.flush();
      expect(caughtError).toBeDefined();
    });

    it('should handle special characters in transactionId', function () {
      var specialId = 'TXN-001%20SPECIAL';
      $httpBackend.expectGET('https://api.example.com/transactions/' + specialId).respond(200, { transactionId: specialId });

      TransactionIngestionService.getTransactionById(specialId);
      $httpBackend.flush();
    });
  });

  /*
  Coverage Report:
  - Functions tested: getTransactions, getTransactionById
  - Scenarios covered:
      getTransactions    -> success with data, empty array, HTTP 500, HTTP 503, HTTP 401
      getTransactionById -> success, correct URL construction, HTTP 404, HTTP 500, HTTP 403, special characters in ID
  - Uncovered scenarios: network timeout (no $httpBackend support), pagination parameters
  */
});
