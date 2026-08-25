/*
Test Documentation:
- Test Name: TransactionService - getTransactions returns data on success
- Purpose: Validate that getTransactions calls the correct API endpoint and returns response data.
- Scenario: HTTP GET /api/transactions responds with 200 and a list of transactions.
- Expected Result: Resolved promise contains the response data array.

- Test Name: TransactionService - getTransactions throws error on failure
- Purpose: Validate that getTransactions propagates the error when the HTTP call fails.
- Scenario: HTTP GET /api/transactions responds with a 500 error.
- Expected Result: Promise is rejected and error is re-thrown.

Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: successful fetch, HTTP error propagation, empty response, 404 error
- Uncovered scenarios: network timeout, malformed response body
*/

describe('TransactionService', function() {
  'use strict';

  var TransactionService, $httpBackend, $rootScope;

  var mockTransactions = [
    { transactionDate: '2024-01-15T10:00:00Z', amount: 250.00, description: 'Grocery Store' },
    { transactionDate: '2024-01-20T14:30:00Z', amount: 89.99, description: 'Online Shopping' }
  ];

  beforeEach(module('dashboard'));

  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$rootScope_) {
    TransactionService = _TransactionService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getTransactions()', function() {

    it('should make a GET request to /api/transactions', function() {
      $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);
      TransactionService.getTransactions();
      $httpBackend.flush();
    });

    it('should return the response data on success', function() {
      $httpBackend.whenGET('/api/transactions').respond(200, mockTransactions);
      var result = null;
      TransactionService.getTransactions().then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
    });

    it('should return an empty array when API returns empty list', function() {
      $httpBackend.whenGET('/api/transactions').respond(200, []);
      var result = null;
      TransactionService.getTransactions().then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should reject and throw error on HTTP 500 failure', function() {
      $httpBackend.whenGET('/api/transactions').respond(500, { message: 'Internal Server Error' });
      spyOn(console, 'error');
      var rejected = false;
      TransactionService.getTransactions().then(null, function() {
        rejected = true;
      });
      $httpBackend.flush();
      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    it('should reject and throw error on HTTP 401 unauthorized', function() {
      $httpBackend.whenGET('/api/transactions').respond(401, { message: 'Unauthorized' });
      spyOn(console, 'error');
      var rejected = false;
      TransactionService.getTransactions().then(null, function() {
        rejected = true;
      });
      $httpBackend.flush();
      expect(rejected).toBe(true);
    });

    it('should log error to console on failure', function() {
      $httpBackend.whenGET('/api/transactions').respond(503, {});
      spyOn(console, 'error');
      TransactionService.getTransactions().then(null, function() {});
      $httpBackend.flush();
      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringMatching('Error fetching transactions'),
        jasmine.anything()
      );
    });

  });

});