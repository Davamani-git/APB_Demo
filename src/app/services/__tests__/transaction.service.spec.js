(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, TransactionDataFactory, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$q_, _$rootScope_) {
      TransactionService = _TransactionService_;
      $q = _$q_;
      $rootScope = _$rootScope_;

      TransactionDataFactory = jasmine.createSpyObj('TransactionDataFactory', ['fetchTransactions']);
      TransactionService.TransactionDataFactory = TransactionDataFactory;
    }));

    beforeEach(inject(function($injector) {
      $injector.get('$injector').invoke(function(_TransactionDataFactory_) {
        TransactionDataFactory = _TransactionDataFactory_;
        spyOn(TransactionDataFactory, 'fetchTransactions').and.callThrough();
      });
    }));

    /*
    Test Documentation:
    - Test Name: should delegate to TransactionDataFactory
    - Purpose: Verify service delegates to factory
    - Scenario: getTransactions is called
    - Expected Result: TransactionDataFactory.fetchTransactions is called with correct parameters
    */
    it('should delegate to TransactionDataFactory', function() {
      var cardId = 123;
      var filters = { pageNumber: 1, pageSize: 20 };
      var mockTransactions = [
        { date: '2023-01-15', merchantName: 'Store A', amount: 100 }
      ];
      TransactionDataFactory.fetchTransactions.and.returnValue($q.resolve(mockTransactions));

      var result;
      TransactionService.getTransactions(cardId, filters).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(TransactionDataFactory.fetchTransactions).toHaveBeenCalledWith(cardId, filters);
      expect(result).toEqual(mockTransactions);
    });

    /*
    Test Documentation:
    - Test Name: should handle successful transaction fetch
    - Purpose: Verify successful data retrieval
    - Scenario: Factory returns transactions
    - Expected Result: Promise resolves with transaction data
    */
    it('should handle successful transaction fetch', function() {
      var cardId = 456;
      var filters = { pageNumber: 2, pageSize: 10 };
      var mockTransactions = [
        { date: '2023-02-01', merchantName: 'Store B', amount: 200 },
        { date: '2023-02-05', merchantName: 'Store C', amount: 300 }
      ];
      TransactionDataFactory.fetchTransactions.and.returnValue($q.resolve(mockTransactions));

      var result;
      TransactionService.getTransactions(cardId, filters).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: should handle factory errors
    - Purpose: Verify error propagation
    - Scenario: Factory rejects promise
    - Expected Result: Error is propagated to caller
    */
    it('should handle factory errors', function() {
      var cardId = 123;
      var filters = { pageNumber: 1, pageSize: 20 };
      TransactionDataFactory.fetchTransactions.and.returnValue($q.reject('API Error'));

      var error;
      TransactionService.getTransactions(cardId, filters).catch(function(err) {
        error = err;
      });
      $rootScope.$digest();

      expect(error).toBe('API Error');
    });

    /*
    Test Documentation:
    - Test Name: should handle empty transaction list
    - Purpose: Verify handling of no transactions
    - Scenario: Factory returns empty array
    - Expected Result: Empty array is returned
    */
    it('should handle empty transaction list', function() {
      var cardId = 123;
      var filters = { pageNumber: 1, pageSize: 20 };
      TransactionDataFactory.fetchTransactions.and.returnValue($q.resolve([]));

      var result;
      TransactionService.getTransactions(cardId, filters).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: should pass through all filter parameters
    - Purpose: Verify filter parameter forwarding
    - Scenario: Complex filters are provided
    - Expected Result: All filters are passed to factory
    */
    it('should pass through all filter parameters', function() {
      var cardId = 789;
      var filters = {
        pageNumber: 3,
        pageSize: 15,
        minAmount: 100,
        maxAmount: 1000,
        merchantName: 'TestStore',
        dateRange: { startDate: '2023-01-01', endDate: '2023-12-31' }
      };
      TransactionDataFactory.fetchTransactions.and.returnValue($q.resolve([]));

      TransactionService.getTransactions(cardId, filters);
      $rootScope.$digest();

      expect(TransactionDataFactory.fetchTransactions).toHaveBeenCalledWith(cardId, filters);
    });

    /*
    Test Documentation:
    - Test Name: should handle null cardId
    - Purpose: Verify handling of invalid cardId
    - Scenario: cardId is null
    - Expected Result: Factory is called with null, error handling is up to factory
    */
    it('should handle null cardId', function() {
      var filters = { pageNumber: 1, pageSize: 20 };
      TransactionDataFactory.fetchTransactions.and.returnValue($q.resolve([]));

      TransactionService.getTransactions(null, filters);
      $rootScope.$digest();

      expect(TransactionDataFactory.fetchTransactions).toHaveBeenCalledWith(null, filters);
    });

    /*
    Test Documentation:
    - Test Name: should handle null filters
    - Purpose: Verify handling of missing filters
    - Scenario: filters is null
    - Expected Result: Factory is called with null filters
    */
    it('should handle null filters', function() {
      var cardId = 123;
      TransactionDataFactory.fetchTransactions.and.returnValue($q.resolve([]));

      TransactionService.getTransactions(cardId, null);
      $rootScope.$digest();

      expect(TransactionDataFactory.fetchTransactions).toHaveBeenCalledWith(cardId, null);
    });

    /*
    Coverage Report:
    - Functions tested: getTransactions
    - Statements/branches covered: Delegation to factory, successful data retrieval, error propagation, empty results, parameter forwarding
    - Error scenarios covered: Factory errors, null cardId, null filters, empty results
    - Uncovered scenarios: None - all service methods and error paths tested
    */
  });
})();