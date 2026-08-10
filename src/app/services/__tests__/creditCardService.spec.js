/*
Test Documentation:
- Test Name: creditCardService - getUserCards
- Purpose: Validate credit card retrieval from API
- Scenario: Success response, error handling, HTTP interactions
- Expected Result: Returns card data on success, rejects with error message on failure
*/

(function() {
  'use strict';

  describe('creditCardService', function() {
    var creditCardService, $httpBackend, $rootScope;
    var baseUrl = '/api/cards';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_creditCardService_, _$httpBackend_, _$rootScope_) {
      creditCardService = _creditCardService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getUserCards', function() {
      /*
      Test Documentation:
      - Test Name: should fetch user cards successfully
      - Purpose: Validate successful API call and data retrieval
      - Scenario: API returns 200 with card data
      - Expected Result: Promise resolves with card array
      */
      it('should fetch user cards successfully', function() {
        var mockCards = [
          { id: 'card1', cardNumber: '****1234', cardType: 'Visa' },
          { id: 'card2', cardNumber: '****5678', cardType: 'Mastercard' }
        ];

        $httpBackend.expectGET(baseUrl).respond(200, mockCards);

        var result;
        creditCardService.getUserCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCards);
        expect(result.length).toBe(2);
        expect(result[0].id).toBe('card1');
      });

      /*
      Test Documentation:
      - Test Name: should return empty array when no cards exist
      - Purpose: Validate handling of empty response
      - Scenario: API returns empty array
      - Expected Result: Promise resolves with empty array
      */
      it('should return empty array when no cards exist', function() {
        $httpBackend.expectGET(baseUrl).respond(200, []);

        var result;
        creditCardService.getUserCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      /*
      Test Documentation:
      - Test Name: should handle 404 error
      - Purpose: Validate error handling for not found response
      - Scenario: API returns 404 status
      - Expected Result: Promise rejects with error message
      */
      it('should handle 404 error', function() {
        $httpBackend.expectGET(baseUrl).respond(404, 'Not Found');

        var error;
        creditCardService.getUserCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBe('Failed to fetch credit cards.');
      });

      /*
      Test Documentation:
      - Test Name: should handle 500 server error
      - Purpose: Validate error handling for server errors
      - Scenario: API returns 500 status
      - Expected Result: Promise rejects with error message
      */
      it('should handle 500 server error', function() {
        $httpBackend.expectGET(baseUrl).respond(500, 'Internal Server Error');

        var error;
        creditCardService.getUserCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBe('Failed to fetch credit cards.');
      });

      /*
      Test Documentation:
      - Test Name: should handle network error
      - Purpose: Validate error handling for network failures
      - Scenario: Network request fails
      - Expected Result: Promise rejects with error message
      */
      it('should handle network error', function() {
        $httpBackend.expectGET(baseUrl).respond(0, '');

        var error;
        creditCardService.getUserCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBe('Failed to fetch credit cards.');
      });

      /*
      Test Documentation:
      - Test Name: should handle 401 unauthorized error
      - Purpose: Validate error handling for authentication failures
      - Scenario: API returns 401 status
      - Expected Result: Promise rejects with error message
      */
      it('should handle 401 unauthorized error', function() {
        $httpBackend.expectGET(baseUrl).respond(401, 'Unauthorized');

        var error;
        creditCardService.getUserCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBe('Failed to fetch credit cards.');
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: getUserCards
- Scenarios covered:
  * Successful card retrieval
  * Empty card list
  * 404 Not Found error
  * 500 Server error
  * Network error (status 0)
  * 401 Unauthorized error
- HTTP methods tested: GET
- Edge cases covered: empty response, various error codes, network failures
- Uncovered scenarios: none - all primary and error paths tested
*/