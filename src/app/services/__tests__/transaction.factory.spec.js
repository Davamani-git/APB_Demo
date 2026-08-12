describe('TransactionFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardDashboardModule'));
  
  var TransactionFactory, $httpBackend, $q, $rootScope;
  
  beforeEach(inject(function(_TransactionFactory_, _$httpBackend_, _$q_, _$rootScope_) {
    TransactionFactory = _TransactionFactory_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCurrentMonthTransactions', function() {
    /*
    Test Documentation:
    - Test Name: should fetch current month transactions successfully
    - Purpose: Validates retrieval of current month transaction data
    - Scenario: HTTP GET request with month=current parameter returns valid transactions
    - Expected Result: Returns transaction array and caches it
    */
    it('should fetch current month transactions successfully', function() {
      var mockTransactions = [
        {id: 1, amount: 100, date: '2024-01-15'},
        {id: 2, amount: 250, date: '2024-01-20'}
      ];
      $httpBackend.expectGET('/api/transactions?month=current').respond(200, mockTransactions);
      
      var result;
      TransactionFactory.getCurrentMonthTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
    });
    
    /*
    Test Documentation:
    - Test Name: should cache current month transactions after first retrieval
    - Purpose: Validates caching mechanism for performance
    - Scenario: Second call uses cached data instead of making new request
    - Expected Result: Returns cached transaction data
    */
    it('should cache current month transactions after first retrieval', function() {
      var mockTransactions = [{id: 1, amount: 100}];
      $httpBackend.expectGET('/api/transactions?month=current').respond(200, mockTransactions);
      
      TransactionFactory.getCurrentMonthTransactions().then(function(data) {
        expect(data).toEqual(mockTransactions);
      });
      $httpBackend.flush();
      
      // Second call should use cache
      TransactionFactory.getCurrentMonthTransactions().then(function(data) {
        expect(data).toEqual(mockTransactions);
      });
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should return cached transactions on HTTP error if cache exists
    - Purpose: Validates fallback to cache when network fails
    - Scenario: HTTP request fails but cached data is available
    - Expected Result: Returns cached transaction data instead of rejecting
    */
    it('should return cached transactions on HTTP error if cache exists', function() {
      var mockTransactions = [{id: 1, amount: 100}];
      $httpBackend.expectGET('/api/transactions?month=current').respond(200, mockTransactions);
      
      TransactionFactory.getCurrentMonthTransactions();
      $httpBackend.flush();
      
      $httpBackend.expectGET('/api/transactions?month=current').respond(500, 'Server Error');
      
      var result;
      TransactionFactory.getCurrentMonthTransactions().then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      
      expect(result).toEqual(mockTransactions);
    });
    
    /*
    Test Documentation:
    - Test Name: should reject promise on HTTP error if no cache exists
    - Purpose: Validates error handling when no fallback cache available
    - Scenario: HTTP request fails on first call with no cached data
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise on HTTP error if no cache exists', function() {
      $httpBackend.expectGET('/api/transactions?month=current').respond(500, 'Server Error');
      
      var errorResult;
      TransactionFactory.getCurrentMonthTransactions().catch(function(error) {
        errorResult = error;
      });
      
      $httpBackend.flush();
      expect(errorResult).toBeDefined();
    });
  });
  
  describe('getTransactionsByCardId', function() {
    /*
    Test Documentation:
    - Test Name: should fetch transactions by card ID successfully
    - Purpose: Validates retrieval of transactions for specific card
    - Scenario: HTTP GET request with cardId parameter returns valid transactions
    - Expected Result: Returns transaction array for specified card
    */
    it('should fetch transactions by card ID successfully', function() {
      var mockTransactions = [
        {id: 1, cardId: 1, amount: 100},
        {id: 2, cardId: 1, amount: 50}
      ];
      $httpBackend.expectGET('/api/transactions?cardId=1').respond(200, mockTransactions);
      
      var result;
      TransactionFactory.getTransactionsByCardId(1).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
    });
    
    /*
    Test Documentation:
    - Test Name: should handle different card IDs
    - Purpose: Validates correct URL construction with various card IDs
    - Scenario: Multiple requests with different card IDs
    - Expected Result: Each request returns correct transactions for respective card
    */
    it('should handle different card IDs', function() {
      var mockTransactions = [{id: 3, cardId: 2, amount: 200}];
      $httpBackend.expectGET('/api/transactions?cardId=2').respond(200, mockTransactions);
      
      var result;
      TransactionFactory.getTransactionsByCardId(2).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
    });
    
    /*
    Test Documentation:
    - Test Name: should return empty array when no transactions exist for card
    - Purpose: Validates handling of cards with no transactions
    - Scenario: HTTP request returns empty transaction array
    - Expected Result: Returns empty array
    */
    it('should return empty array when no transactions exist for card', function() {
      $httpBackend.expectGET('/api/transactions?cardId=999').respond(200, []);
      
      var result;
      TransactionFactory.getTransactionsByCardId(999).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual([]);
    });
    
    /*
    Test Documentation:
    - Test Name: should reject promise on HTTP error for card transactions
    - Purpose: Validates error handling for failed transaction retrieval
    - Scenario: HTTP request for card transactions fails
    - Expected Result: Promise is rejected
    */
    it('should reject promise on HTTP error for card transactions', function() {
      $httpBackend.expectGET('/api/transactions?cardId=1').respond(500, 'Server Error');
      
      var errorResult;
      TransactionFactory.getTransactionsByCardId(1).catch(function(error) {
        errorResult = error;
      });
      
      $httpBackend.flush();
      expect(errorResult).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCurrentMonthTransactions, getTransactionsByCardId
- Scenarios covered:
  * Successful transaction retrieval
  * Caching mechanism for current month transactions
  * Fallback to cache on error
  * Error handling with no cache
  * Card-based transaction retrieval
  * Empty transaction results
  * HTTP error scenarios
- Uncovered scenarios: None identified for core functionality
*/