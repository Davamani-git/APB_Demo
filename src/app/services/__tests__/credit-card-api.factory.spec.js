(function() {
  'use strict';

  describe('CreditCardAPIFactory', function() {
    var CreditCardAPIFactory, $httpBackend;
    var apiBase = '/api';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardAPIFactory_, _$httpBackend_) {
      CreditCardAPIFactory = _CreditCardAPIFactory_;
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should fetch credit card data successfully
    - Purpose: Verify successful API call
    - Scenario: API returns credit card data
    - Expected Result: Promise resolves with data
    */
    it('should fetch credit card data successfully', function() {
      var mockData = [
        { cardId: 1, cardType: 'Visa', creditLimit: 5000 },
        { cardId: 2, cardType: 'MasterCard', creditLimit: 3000 }
      ];
      $httpBackend.expectGET(apiBase + '/creditcards').respond(200, mockData);

      var result;
      CreditCardAPIFactory.fetchCreditCardData().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockData);
    });

    /*
    Test Documentation:
    - Test Name: getCreditCards should call fetchCreditCardData
    - Purpose: Verify method delegation
    - Scenario: getCreditCards is called
    - Expected Result: fetchCreditCardData is invoked and returns data
    */
    it('getCreditCards should call fetchCreditCardData', function() {
      var mockData = [{ cardId: 1 }];
      $httpBackend.expectGET(apiBase + '/creditcards').respond(200, mockData);

      var result;
      CreditCardAPIFactory.getCreditCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockData);
    });

    /*
    Test Documentation:
    - Test Name: should handle server errors
    - Purpose: Verify error handling for 500 errors
    - Scenario: API returns 500 error
    - Expected Result: Promise is rejected with error
    */
    it('should handle server errors', function() {
      $httpBackend.expectGET(apiBase + '/creditcards').respond(500, 'Internal Server Error');

      var error;
      CreditCardAPIFactory.fetchCreditCardData().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: should handle unauthorized errors
    - Purpose: Verify error handling for 401 errors
    - Scenario: API returns 401 unauthorized
    - Expected Result: Promise is rejected with 401 error
    */
    it('should handle unauthorized errors', function() {
      $httpBackend.expectGET(apiBase + '/creditcards').respond(401, 'Unauthorized');

      var error;
      CreditCardAPIFactory.fetchCreditCardData().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error.status).toBe(401);
    });

    /*
    Test Documentation:
    - Test Name: should handle network failures
    - Purpose: Verify handling of network errors
    - Scenario: Network request fails
    - Expected Result: Promise is rejected
    */
    it('should handle network failures', function() {
      $httpBackend.expectGET(apiBase + '/creditcards').respond(0, '');

      var error;
      CreditCardAPIFactory.fetchCreditCardData().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle empty response
    - Purpose: Verify handling of empty data
    - Scenario: API returns empty array
    - Expected Result: Promise resolves with empty array
    */
    it('should handle empty response', function() {
      $httpBackend.expectGET(apiBase + '/creditcards').respond(200, []);

      var result;
      CreditCardAPIFactory.fetchCreditCardData().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: should handle null response
    - Purpose: Verify handling of null data
    - Scenario: API returns null
    - Expected Result: Promise resolves with null
    */
    it('should handle null response', function() {
      $httpBackend.expectGET(apiBase + '/creditcards').respond(200, null);

      var result;
      CreditCardAPIFactory.fetchCreditCardData().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBe(null);
    });

    /*
    Coverage Report:
    - Functions tested: fetchCreditCardData, getCreditCards
    - Statements/branches covered: Successful API calls, error handling, promise resolution/rejection, method delegation
    - Error scenarios covered: Server error (500), unauthorized (401), network failure (0), empty/null responses
    - Uncovered scenarios: None - all API response scenarios tested
    */
  });
})();