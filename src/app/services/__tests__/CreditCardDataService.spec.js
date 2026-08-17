describe('CreditCardDataService', function() {
  beforeEach(module('creditCardApp'));
  var CreditCardDataService, $httpBackend, $q, API_ENDPOINT;
  var mockResponse = [
    { id: 1, cardNumber: '1234', balance: 5000 },
    { id: 2, cardNumber: '5678', balance: 3000 }
  ];

  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _$q_, _API_ENDPOINT_) {
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_ENDPOINT = _API_ENDPOINT_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  /*
  Test Documentation:
  - Test Name: fetchAllCards - Success Scenario
  - Purpose: Validates successful retrieval of credit cards from API
  - Scenario: First call to fetchAllCards with no cache
  - Expected Result: Returns array of credit card objects
  */
  it('should fetch all cards successfully on first call', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/creditcards').respond(200, mockResponse);
    var result;
    CreditCardDataService.fetchAllCards().then(function(data) {
      result = data;
    });
    $httpBackend.flush();
    expect(result).toEqual(mockResponse);
  });

  /*
  Test Documentation:
  - Test Name: fetchAllCards - Cache Hit Scenario
  - Purpose: Validates caching mechanism returns cached data within TTL
  - Scenario: Second call to fetchAllCards within cache TTL (60 seconds)
  - Expected Result: Returns cached data without making HTTP request
  */
  it('should return cached data on subsequent calls within TTL', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/creditcards').respond(200, mockResponse);
    var result1, result2;
    CreditCardDataService.fetchAllCards().then(function(data) {
      result1 = data;
    });
    $httpBackend.flush();
    CreditCardDataService.fetchAllCards().then(function(data) {
      result2 = data;
    });
    expect(result1).toEqual(mockResponse);
    expect(result2).toEqual(mockResponse);
    $httpBackend.verifyNoOutstandingRequest();
  });

  /*
  Test Documentation:
  - Test Name: fetchAllCards - Cache Expiry Scenario
  - Purpose: Validates that expired cache triggers new API call
  - Scenario: Call fetchAllCards after cache TTL expires (>60 seconds)
  - Expected Result: Makes new HTTP request and updates cache
  */
  it('should fetch fresh data after cache TTL expires', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/creditcards').respond(200, mockResponse);
    var result1;
    CreditCardDataService.fetchAllCards().then(function(data) {
      result1 = data;
    });
    $httpBackend.flush();
    jasmine.clock().install();
    jasmine.clock().tick(61000);
    $httpBackend.expectGET(API_ENDPOINT + '/creditcards').respond(200, mockResponse);
    var result2;
    CreditCardDataService.fetchAllCards().then(function(data) {
      result2 = data;
    });
    $httpBackend.flush();
    jasmine.clock().uninstall();
    expect(result1).toEqual(mockResponse);
    expect(result2).toEqual(mockResponse);
  });

  /*
  Test Documentation:
  - Test Name: fetchAllCards - HTTP Error Scenario
  - Purpose: Validates error handling when API call fails
  - Scenario: API returns 500 error
  - Expected Result: Promise is rejected with error
  */
  it('should reject promise on HTTP error', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/creditcards').respond(500, 'Server Error');
    var error;
    CreditCardDataService.fetchAllCards().catch(function(err) {
      error = err;
    });
    $httpBackend.flush();
    expect(error).toBeDefined();
    expect(error.status).toBe(500);
  });

  /*
  Test Documentation:
  - Test Name: clearCache - Functionality
  - Purpose: Validates cache clearing mechanism
  - Scenario: Call clearCache after fetching data
  - Expected Result: Cache is cleared, next call makes new HTTP request
  */
  it('should clear cache and fetch fresh data on next call', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/creditcards').respond(200, mockResponse);
    var result1;
    CreditCardDataService.fetchAllCards().then(function(data) {
      result1 = data;
    });
    $httpBackend.flush();
    CreditCardDataService.clearCache();
    $httpBackend.expectGET(API_ENDPOINT + '/creditcards').respond(200, mockResponse);
    var result2;
    CreditCardDataService.fetchAllCards().then(function(data) {
      result2 = data;
    });
    $httpBackend.flush();
    expect(result1).toEqual(mockResponse);
    expect(result2).toEqual(mockResponse);
  });

  /*
  Test Documentation:
  - Test Name: fetchAllCards - Empty Response Scenario
  - Purpose: Validates handling of empty card list
  - Scenario: API returns empty array
  - Expected Result: Returns empty array
  */
  it('should handle empty card list response', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/creditcards').respond(200, []);
    var result;
    CreditCardDataService.fetchAllCards().then(function(data) {
      result = data;
    });
    $httpBackend.flush();
    expect(result).toEqual([]);
  });

  /*
  Test Documentation:
  - Test Name: fetchAllCards - Network Timeout Scenario
  - Purpose: Validates handling of network timeout
  - Scenario: HTTP request times out
  - Expected Result: Promise is rejected with timeout error
  */
  it('should reject promise on network timeout', function() {
    $httpBackend.expectGET(API_ENDPOINT + '/creditcards').respond(function() {
      return [0, null];
    });
    var error;
    CreditCardDataService.fetchAllCards().catch(function(err) {
      error = err;
    });
    $httpBackend.flush();
    expect(error).toBeDefined();
  });

  /*
  Coverage Report:
  - Functions tested: fetchAllCards, clearCache
  - Scenarios covered: 
    * Initial fetch (cache miss)
    * Cached retrieval (cache hit within TTL)
    * Cache expiry and refresh
    * HTTP 500 error handling
    * Cache clearing mechanism
    * Empty response handling
    * Network timeout handling
  - Uncovered scenarios: 404 errors, malformed responses, null API_ENDPOINT
  */
});
