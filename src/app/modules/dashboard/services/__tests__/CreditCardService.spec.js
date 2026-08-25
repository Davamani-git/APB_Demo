/*
Test Documentation:
- Test Name: CreditCardService - getCards returns data on success
- Purpose: Validate that getCards calls the correct API endpoint and returns response data.
- Scenario: HTTP GET /api/creditcards responds with 200 and a list of cards.
- Expected Result: Resolved promise contains the response data array.

- Test Name: CreditCardService - getCards throws error on failure
- Purpose: Validate that getCards propagates the error when the HTTP call fails.
- Scenario: HTTP GET /api/creditcards responds with a 500 error.
- Expected Result: Promise is rejected and error is re-thrown.

Coverage Report:
- Functions tested: getCards
- Scenarios covered: successful fetch, HTTP error propagation
- Uncovered scenarios: network timeout, partial response
*/

describe('CreditCardService', function() {
  'use strict';

  var CreditCardService, $httpBackend, $rootScope;

  var mockCards = [
    { cardHolderName: 'Alice', cardNumber: '1111222233334444', creditLimit: 10000, availableCredit: 5000, outstandingAmount: 5000, currentBalance: 5000 },
    { cardHolderName: 'Bob', cardNumber: '5555666677778888', creditLimit: 8000, availableCredit: 3000, outstandingAmount: 5000, currentBalance: 5000 }
  ];

  beforeEach(module('dashboard'));

  beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$rootScope_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCards()', function() {

    it('should make a GET request to /api/creditcards', function() {
      $httpBackend.expectGET('/api/creditcards').respond(200, mockCards);
      CreditCardService.getCards();
      $httpBackend.flush();
    });

    it('should return the response data on success', function() {
      $httpBackend.whenGET('/api/creditcards').respond(200, mockCards);
      var result = null;
      CreditCardService.getCards().then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result).toEqual(mockCards);
    });

    it('should return an empty array when API returns empty list', function() {
      $httpBackend.whenGET('/api/creditcards').respond(200, []);
      var result = null;
      CreditCardService.getCards().then(function(data) {
        result = data;
      });
      $httpBackend.flush();
      expect(result).toEqual([]);
    });

    it('should reject and throw error on HTTP 500 failure', function() {
      $httpBackend.whenGET('/api/creditcards').respond(500, { message: 'Internal Server Error' });
      spyOn(console, 'error');
      var rejected = false;
      CreditCardService.getCards().then(null, function() {
        rejected = true;
      });
      $httpBackend.flush();
      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    it('should reject and throw error on HTTP 404 failure', function() {
      $httpBackend.whenGET('/api/creditcards').respond(404, { message: 'Not Found' });
      spyOn(console, 'error');
      var rejected = false;
      CreditCardService.getCards().then(null, function() {
        rejected = true;
      });
      $httpBackend.flush();
      expect(rejected).toBe(true);
    });

    it('should log error to console on failure', function() {
      $httpBackend.whenGET('/api/creditcards').respond(503, {});
      spyOn(console, 'error');
      CreditCardService.getCards().then(null, function() {});
      $httpBackend.flush();
      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringMatching('Error fetching credit cards'),
        jasmine.anything()
      );
    });

  });

});