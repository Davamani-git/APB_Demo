describe('CreditCardService', function() {
  'use strict';
  
  beforeEach(module('creditCardDashboard'));
  
  var CreditCardService, $httpBackend;
  
  beforeEach(inject(function(_CreditCardService_, _$httpBackend_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getAllCards', function() {
    /*
    Test Documentation:
    - Test Name: getAllCards - Success Scenario
    - Purpose: Validates successful retrieval and processing of credit cards
    - Scenario: HTTP GET request returns array of cards with credit limits and outstanding amounts
    - Expected Result: Returns cards with calculated availableCredit property
    */
    it('should retrieve all cards and calculate available credit', function() {
      var mockCards = [
        {
          cardId: 'CARD001',
          cardName: 'Visa',
          totalCreditLimit: 5000,
          outstandingAmount: 2000
        },
        {
          cardId: 'CARD002',
          cardName: 'MasterCard',
          totalCreditLimit: 10000,
          outstandingAmount: 3000
        }
      ];
      
      $httpBackend.expectGET('/api/creditcards').respond(200, mockCards);
      
      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(2);
      expect(result[0].availableCredit).toBe(3000);
      expect(result[1].availableCredit).toBe(7000);
    });
    
    /*
    Test Documentation:
    - Test Name: getAllCards - Empty Response
    - Purpose: Validates handling of empty card list
    - Scenario: HTTP GET request returns empty array
    - Expected Result: Returns empty array
    */
    it('should handle empty card list', function() {
      $httpBackend.expectGET('/api/creditcards').respond(200, []);
      
      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(0);
    });
    
    /*
    Test Documentation:
    - Test Name: getAllCards - HTTP Error
    - Purpose: Validates error handling for failed HTTP request
    - Scenario: HTTP GET request fails with 500 error
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise on HTTP error', function() {
      $httpBackend.expectGET('/api/creditcards').respond(500, 'Server Error');
      
      var error;
      CreditCardService.getAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
    
    /*
    Test Documentation:
    - Test Name: getAllCards - Zero Outstanding Amount
    - Purpose: Validates calculation when card has no outstanding balance
    - Scenario: Card with outstandingAmount of 0
    - Expected Result: availableCredit equals totalCreditLimit
    */
    it('should calculate available credit when outstanding amount is zero', function() {
      var mockCards = [
        {
          cardId: 'CARD001',
          cardName: 'Visa',
          totalCreditLimit: 5000,
          outstandingAmount: 0
        }
      ];
      
      $httpBackend.expectGET('/api/creditcards').respond(200, mockCards);
      
      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result[0].availableCredit).toBe(5000);
    });
    
    /*
    Test Documentation:
    - Test Name: getAllCards - Full Credit Utilization
    - Purpose: Validates calculation when card is fully utilized
    - Scenario: Card where outstandingAmount equals totalCreditLimit
    - Expected Result: availableCredit equals 0
    */
    it('should calculate zero available credit when fully utilized', function() {
      var mockCards = [
        {
          cardId: 'CARD001',
          cardName: 'Visa',
          totalCreditLimit: 5000,
          outstandingAmount: 5000
        }
      ];
      
      $httpBackend.expectGET('/api/creditcards').respond(200, mockCards);
      
      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result[0].availableCredit).toBe(0);
    });
    
    /*
    Test Documentation:
    - Test Name: getAllCards - Network Timeout
    - Purpose: Validates error handling for network timeout
    - Scenario: HTTP request times out
    - Expected Result: Promise is rejected
    */
    it('should reject promise on network timeout', function() {
      $httpBackend.expectGET('/api/creditcards').respond(0, '');
      
      var error;
      CreditCardService.getAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
    });
  });
  
  /*
  Coverage Report:
  - Functions tested: getAllCards
  - Scenarios covered: success with multiple cards, empty list, HTTP errors, zero outstanding amount, full utilization, network timeout
  - Edge cases: empty response, error responses, zero values, maximum utilization
  - Uncovered scenarios: null/undefined responses, malformed data, partial card objects
  */
});
