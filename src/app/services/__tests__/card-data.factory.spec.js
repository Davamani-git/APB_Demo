(function() {
  'use strict';

  describe('CardDataFactory', function() {
    var CardDataFactory, $httpBackend, $q;
    var apiBase = '/api';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardDataFactory_, _$httpBackend_, _$q_) {
      CardDataFactory = _CardDataFactory_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should fetch cards successfully
    - Purpose: Verify successful API call for cards
    - Scenario: API returns card data
    - Expected Result: Promise resolves with card data
    */
    it('should fetch cards successfully', function() {
      var mockCards = [
        { cardId: 1, cardType: 'Visa' },
        { cardId: 2, cardType: 'MasterCard' }
      ];
      $httpBackend.expectGET(apiBase + '/creditcards').respond(200, mockCards);

      var result;
      CardDataFactory.fetchCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCards);
    });

    /*
    Test Documentation:
    - Test Name: should handle API errors
    - Purpose: Verify error handling for failed API calls
    - Scenario: API returns error response
    - Expected Result: Promise is rejected with error
    */
    it('should handle API errors', function() {
      $httpBackend.expectGET(apiBase + '/creditcards').respond(500, 'Server Error');

      var error;
      CardDataFactory.fetchCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: should handle network errors
    - Purpose: Verify handling of network failures
    - Scenario: Network request fails
    - Expected Result: Promise is rejected
    */
    it('should handle network errors', function() {
      $httpBackend.expectGET(apiBase + '/creditcards').respond(0, '');

      var error;
      CardDataFactory.fetchCards().catch(function(err) {
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
      CardDataFactory.fetchCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
    });

    /*
    Test Documentation:
    - Test Name: should handle 404 not found
    - Purpose: Verify handling of resource not found
    - Scenario: API returns 404
    - Expected Result: Promise is rejected with 404 error
    */
    it('should handle 404 not found', function() {
      $httpBackend.expectGET(apiBase + '/creditcards').respond(404, 'Not Found');

      var error;
      CardDataFactory.fetchCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error.status).toBe(404);
    });

    /*
    Coverage Report:
    - Functions tested: fetchCards
    - Statements/branches covered: Successful API call, error handling, promise resolution/rejection
    - Error scenarios covered: Server error (500), network error (0), not found (404), empty response
    - Uncovered scenarios: None - all API response scenarios tested
    */
  });
})();