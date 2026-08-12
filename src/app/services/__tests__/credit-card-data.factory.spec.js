describe('CreditCardDataFactory', function() {
  'use strict';
  
  beforeEach(module('creditCardDashboardModule'));
  
  var CreditCardDataFactory, $httpBackend, $q, $rootScope;
  
  beforeEach(inject(function(_CreditCardDataFactory_, _$httpBackend_, _$q_, _$rootScope_) {
    CreditCardDataFactory = _CreditCardDataFactory_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getAllCards', function() {
    /*
    Test Documentation:
    - Test Name: should fetch all cards successfully
    - Purpose: Validates successful retrieval and caching of credit cards
    - Scenario: HTTP GET request returns valid card data
    - Expected Result: Returns card data and caches it
    */
    it('should fetch all cards successfully', function() {
      var mockCards = [{id: 1, number: '1234'}, {id: 2, number: '5678'}];
      $httpBackend.expectGET('/api/creditcards').respond(200, mockCards);
      
      var result;
      CreditCardDataFactory.getAllCards().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockCards);
    });
    
    /*
    Test Documentation:
    - Test Name: should cache cards after first retrieval
    - Purpose: Validates caching mechanism for performance optimization
    - Scenario: Second call uses cached data instead of making new request
    - Expected Result: Returns cached data on subsequent calls
    */
    it('should cache cards after first retrieval', function() {
      var mockCards = [{id: 1, number: '1234'}];
      $httpBackend.expectGET('/api/creditcards').respond(200, mockCards);
      
      CreditCardDataFactory.getAllCards().then(function(data) {
        expect(data).toEqual(mockCards);
      });
      $httpBackend.flush();
      
      // Second call should not make HTTP request
      CreditCardDataFactory.getAllCards().then(function(data) {
        expect(data).toEqual(mockCards);
      });
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: should return cached data on HTTP error if cache exists
    - Purpose: Validates fallback to cache when network fails
    - Scenario: HTTP request fails but cached data is available
    - Expected Result: Returns cached data instead of rejecting
    */
    it('should return cached data on HTTP error if cache exists', function() {
      var mockCards = [{id: 1, number: '1234'}];
      $httpBackend.expectGET('/api/creditcards').respond(200, mockCards);
      
      CreditCardDataFactory.getAllCards();
      $httpBackend.flush();
      
      $httpBackend.expectGET('/api/creditcards').respond(500, 'Server Error');
      
      var result;
      CreditCardDataFactory.getAllCards().then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      
      expect(result).toEqual(mockCards);
    });
    
    /*
    Test Documentation:
    - Test Name: should reject promise on HTTP error if no cache exists
    - Purpose: Validates error handling when no fallback cache available
    - Scenario: HTTP request fails on first call with no cached data
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise on HTTP error if no cache exists', function() {
      $httpBackend.expectGET('/api/creditcards').respond(500, 'Server Error');
      
      var errorResult;
      CreditCardDataFactory.getAllCards().catch(function(error) {
        errorResult = error;
      });
      
      $httpBackend.flush();
      expect(errorResult).toBeDefined();
    });
  });
  
  describe('getCardById', function() {
    /*
    Test Documentation:
    - Test Name: should fetch card by ID successfully
    - Purpose: Validates retrieval of specific card by ID
    - Scenario: HTTP GET request with card ID returns valid card data
    - Expected Result: Returns card data for specified ID
    */
    it('should fetch card by ID successfully', function() {
      var mockCard = {id: 1, number: '1234', holder: 'John Doe'};
      $httpBackend.expectGET('/api/creditcards/1').respond(200, mockCard);
      
      var result;
      CreditCardDataFactory.getCardById(1).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockCard);
    });
    
    /*
    Test Documentation:
    - Test Name: should handle different card IDs
    - Purpose: Validates correct URL construction with various IDs
    - Scenario: Multiple requests with different card IDs
    - Expected Result: Each request returns correct card data
    */
    it('should handle different card IDs', function() {
      var mockCard2 = {id: 2, number: '5678'};
      $httpBackend.expectGET('/api/creditcards/2').respond(200, mockCard2);
      
      var result;
      CreditCardDataFactory.getCardById(2).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockCard2);
    });
    
    /*
    Test Documentation:
    - Test Name: should reject promise on HTTP error for card ID request
    - Purpose: Validates error handling for failed card retrieval
    - Scenario: HTTP request for specific card fails
    - Expected Result: Promise is rejected
    */
    it('should reject promise on HTTP error for card ID request', function() {
      $httpBackend.expectGET('/api/creditcards/999').respond(404, 'Not Found');
      
      var errorResult;
      CreditCardDataFactory.getCardById(999).catch(function(error) {
        errorResult = error;
      });
      
      $httpBackend.flush();
      expect(errorResult).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: getAllCards, getCardById
- Scenarios covered: 
  * Successful data retrieval
  * Caching mechanism
  * Fallback to cache on error
  * Error handling with no cache
  * ID-based retrieval
  * HTTP error scenarios
- Uncovered scenarios: None identified for core functionality
*/