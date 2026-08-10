/*
Test Documentation:
- Test Name: transactionService - getTransactions and getTransactionById
- Purpose: Validate transaction retrieval with pagination and filtering
- Scenario: Success responses, error handling, parameter handling, pagination
- Expected Result: Returns transaction data with correct parameters, handles errors appropriately
*/

(function() {
  'use strict';

  describe('transactionService', function() {
    var transactionService, $httpBackend, $rootScope;
    var baseUrl = '/api/transactions';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_transactionService_, _$httpBackend_, _$rootScope_) {
      transactionService = _transactionService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactions', function() {
      /*
      Test Documentation:
      - Test Name: should fetch transactions with default parameters
      - Purpose: Validate default pagination behavior
      - Scenario: Call without parameters
      - Expected Result: Uses page=1, size=50 as defaults
      */
      it('should fetch transactions with default parameters', function() {
        var mockTransactions = [
          { id: 'txn1', amount: 100, cardId: 'card1' },
          { id: 'txn2', amount: 200, cardId: 'card2' }
        ];

        $httpBackend.expectGET(baseUrl + '?page=1&size=50').respond(200, mockTransactions);

        var result;
        transactionService.getTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(2);
      });

      /*
      Test Documentation:
      - Test Name: should fetch transactions with custom page and size
      - Purpose: Validate custom pagination parameters
      - Scenario: Call with specific page and size
      - Expected Result: Uses provided page and size values
      */
      it('should fetch transactions with custom page and size', function() {
        var mockTransactions = [
          { id: 'txn3', amount: 150, cardId: 'card1' }
        ];

        $httpBackend.expectGET(baseUrl + '?page=2&size=10').respond(200, mockTransactions);

        var result;
        transactionService.getTransactions(2, 10).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      /*
      Test Documentation:
      - Test Name: should fetch transactions filtered by cardId
      - Purpose: Validate card filtering functionality
      - Scenario: Call with cardId parameter
      - Expected Result: Includes cardId in query parameters
      */
      it('should fetch transactions filtered by cardId', function() {
        var mockTransactions = [
          { id: 'txn1', amount: 100, cardId: 'card1' }
        ];

        $httpBackend.expectGET(baseUrl + '?cardId=card1&page=1&size=50').respond(200, mockTransactions);

        var result;
        transactionService.getTransactions(1, 50, 'card1').then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
        expect(result[0].cardId).toBe('card1');
      });

      /*
      Test Documentation:
      - Test Name: should fetch transactions with all parameters
      - Purpose: Validate full parameter usage
      - Scenario: Call with page, size, and cardId
      - Expected Result: All parameters included in request
      */
      it('should fetch transactions with all parameters', function() {
        var mockTransactions = [
          { id: 'txn5', amount: 250, cardId: 'card2' }
        ];

        $httpBackend.expectGET(baseUrl + '?cardId=card2&page=3&size=25').respond(200, mockTransactions);

        var result;
        transactionService.getTransactions(3, 25, 'card2').then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
      });

      /*
      Test Documentation:
      - Test Name: should return empty array when no transactions exist
      - Purpose: Validate handling of empty response
      - Scenario: API returns empty array
      - Expected Result: Promise resolves with empty array
      */
      it('should return empty array when no transactions exist', function() {
        $httpBackend.expectGET(baseUrl + '?page=1&size=50').respond(200, []);

        var result;
        transactionService.getTransactions().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      /*
      Test Documentation:
      - Test Name: should handle 500 server error
      - Purpose: Validate error handling for server errors
      - Scenario: API returns 500 status
      - Expected Result: Promise rejects with user-friendly error message
      */
      it('should handle 500 server error', function() {
        $httpBackend.expectGET(baseUrl + '?page=1&size=50').respond(500, 'Internal Server Error');

        var error;
        transactionService.getTransactions().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBe('Failed to fetch transactions. Please try again later.');
      });

      /*
      Test Documentation:
      - Test Name: should handle 404 error
      - Purpose: Validate error handling for not found response
      - Scenario: API returns 404 status
      - Expected Result: Promise rejects with error message
      */
      it('should handle 404 error', function() {
        $httpBackend.expectGET(baseUrl + '?page=1&size=50').respond(404, 'Not Found');

        var error;
        transactionService.getTransactions().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBe('Failed to fetch transactions. Please try again later.');
      });

      /*
      Test Documentation:
      - Test Name: should handle network error
      - Purpose: Validate error handling for network failures
      - Scenario: Network request fails
      - Expected Result: Promise rejects with error message
      */
      it('should handle network error', function() {
        $httpBackend.expectGET(baseUrl + '?page=1&size=50').respond(0, '');

        var error;
        transactionService.getTransactions().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBe('Failed to fetch transactions. Please try again later.');
      });
    });

    describe('getTransactionById', function() {
      /*
      Test Documentation:
      - Test Name: should fetch transaction by id successfully
      - Purpose: Validate single transaction retrieval
      - Scenario: API returns transaction details
      - Expected Result: Promise resolves with transaction object
      */
      it('should fetch transaction by id successfully', function() {
        var mockTransaction = {
          id: 'txn123',
          amount: 150,
          cardId: 'card1',
          merchant: 'Store ABC',
          date: '2023-01-15'
        };

        $httpBackend.expectGET(baseUrl + '/txn123').respond(200, mockTransaction);

        var result;
        transactionService.getTransactionById('txn123').then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransaction);
        expect(result.id).toBe('txn123');
        expect(result.amount).toBe(150);
      });

      /*
      Test Documentation:
      - Test Name: should handle numeric transaction id
      - Purpose: Validate handling of numeric IDs
      - Scenario: Call with numeric id
      - Expected Result: Correctly constructs URL with numeric id
      */
      it('should handle numeric transaction id', function() {
        var mockTransaction = {
          id: 456,
          amount: 200,
          cardId: 'card2'
        };

        $httpBackend.expectGET(baseUrl + '/456').respond(200, mockTransaction);

        var result;
        transactionService.getTransactionById(456).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockTransaction);
      });

      /*
      Test Documentation:
      - Test Name: should handle 404 when transaction not found
      - Purpose: Validate error handling for non-existent transaction
      - Scenario: API returns 404 status
      - Expected Result: Promise rejects with error message
      */
      it('should handle 404 when transaction not found', function() {
        $httpBackend.expectGET(baseUrl + '/nonexistent').respond(404, 'Not Found');

        var error;
        transactionService.getTransactionById('nonexistent').catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBe('Failed to fetch transaction details.');
      });

      /*
      Test Documentation:
      - Test Name: should handle 500 server error
      - Purpose: Validate error handling for server errors
      - Scenario: API returns 500 status
      - Expected Result: Promise rejects with error message
      */
      it('should handle 500 server error', function() {
        $httpBackend.expectGET(baseUrl + '/txn123').respond(500, 'Internal Server Error');

        var error;
        transactionService.getTransactionById('txn123').catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBe('Failed to fetch transaction details.');
      });

      /*
      Test Documentation:
      - Test Name: should handle 401 unauthorized error
      - Purpose: Validate error handling for authentication failures
      - Scenario: API returns 401 status
      - Expected Result: Promise rejects with error message
      */
      it('should handle 401 unauthorized error', function() {
        $httpBackend.expectGET(baseUrl + '/txn123').respond(401, 'Unauthorized');

        var error;
        transactionService.getTransactionById('txn123').catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBe('Failed to fetch transaction details.');
      });

      /*
      Test Documentation:
      - Test Name: should handle network error
      - Purpose: Validate error handling for network failures
      - Scenario: Network request fails
      - Expected Result: Promise rejects with error message
      */
      it('should handle network error', function() {
        $httpBackend.expectGET(baseUrl + '/txn123').respond(0, '');

        var error;
        transactionService.getTransactionById('txn123').catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBe('Failed to fetch transaction details.');
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: getTransactions, getTransactionById
- Scenarios covered:
  getTransactions:
    * Default parameters (page=1, size=50)
    * Custom pagination (page, size)
    * Filtering by cardId
    * All parameters combined
    * Empty result set
    * Server errors (500, 404)
    * Network errors
  getTransactionById:
    * Successful retrieval with string id
    * Numeric id handling
    * 404 Not Found error
    * 500 Server error
    * 401 Unauthorized error
    * Network error
- HTTP methods tested: GET
- Edge cases covered: empty responses, various error codes, network failures, parameter variations
- Uncovered scenarios: none - all primary and error paths tested
*/