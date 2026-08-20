describe('configService', function() {
  'use strict';
  beforeEach(module('fraudDetectionModule'));
  
  var configService, $httpBackend, apiConfig, cacheService, $q, $rootScope;
  
  beforeEach(inject(function(_configService_, _$httpBackend_, _apiConfig_, _cacheService_, _$q_, _$rootScope_) {
    configService = _configService_;
    $httpBackend = _$httpBackend_;
    apiConfig = _apiConfig_;
    cacheService = _cacheService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    cacheService.clear();
  });
  
  describe('getThresholds', function() {
    /*
    Test Documentation:
    - Test Name: getThresholds - fetch from server
    - Purpose: Validates that thresholds are fetched from API and cached
    - Scenario: First call, cache is empty
    - Expected Result: HTTP GET request made, data cached and returned
    */
    it('should fetch thresholds from server on first call', function() {
      var expectedThresholds = {
        lowRiskThreshold: 30,
        mediumRiskThreshold: 60,
        highRiskThreshold: 80
      };
      
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.thresholdConfig).respond(expectedThresholds);
      
      configService.getThresholds().then(function(response) {
        expect(response).toEqual(expectedThresholds);
      });
      
      $httpBackend.flush();
    });
    
    /*
    Test Documentation:
    - Test Name: getThresholds - return cached data
    - Purpose: Validates that cached thresholds are returned without API call
    - Scenario: Second call within cache TTL
    - Expected Result: Returns cached data without HTTP request
    */
    it('should return cached thresholds on subsequent calls', function() {
      var expectedThresholds = {
        lowRiskThreshold: 30,
        mediumRiskThreshold: 60,
        highRiskThreshold: 80
      };
      
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.thresholdConfig).respond(expectedThresholds);
      
      configService.getThresholds().then(function(response) {
        expect(response).toEqual(expectedThresholds);
      });
      
      $httpBackend.flush();
      
      // Second call should use cache
      configService.getThresholds().then(function(response) {
        expect(response).toEqual(expectedThresholds);
      });
      
      $rootScope.$apply();
    });
    
    /*
    Test Documentation:
    - Test Name: getThresholds - HTTP error handling
    - Purpose: Validates that HTTP errors are properly rejected
    - Scenario: Server returns 500 error
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise on HTTP error', function() {
      $httpBackend.expectGET(apiConfig.baseUrl + apiConfig.endpoints.thresholdConfig).respond(500, 'Server Error');
      
      configService.getThresholds().catch(function(error) {
        expect(error.status).toBe(500);
      });
      
      $httpBackend.flush();
    });
  });
  
  describe('updateThresholds', function() {
    /*
    Test Documentation:
    - Test Name: updateThresholds - successful update
    - Purpose: Validates that thresholds can be updated and cache is cleared
    - Scenario: Valid threshold configuration provided
    - Expected Result: HTTP PUT request made, cache invalidated, response returned
    */
    it('should update thresholds and clear cache', function() {
      var newThresholds = {
        lowRiskThreshold: 25,
        mediumRiskThreshold: 55,
        highRiskThreshold: 85
      };
      var expectedResponse = { status: 'updated', thresholds: newThresholds };
      
      $httpBackend.expectPUT(apiConfig.baseUrl + apiConfig.endpoints.thresholdConfig, newThresholds).respond(expectedResponse);
      
      configService.updateThresholds(newThresholds).then(function(response) {
        expect(response).toEqual(expectedResponse);
      });
      
      $httpBackend.flush();
      
      // Verify cache was cleared
      expect(cacheService.get('threshold_config')).toBeNull();
    });
    
    /*
    Test Documentation:
    - Test Name: updateThresholds - HTTP error handling
    - Purpose: Validates that HTTP errors during update are properly rejected
    - Scenario: Server returns 400 error
    - Expected Result: Promise is rejected with error
    */
    it('should reject promise on HTTP error during update', function() {
      var newThresholds = {
        lowRiskThreshold: 25,
        mediumRiskThreshold: 55,
        highRiskThreshold: 85
      };
      
      $httpBackend.expectPUT(apiConfig.baseUrl + apiConfig.endpoints.thresholdConfig, newThresholds).respond(400, 'Bad Request');
      
      configService.updateThresholds(newThresholds).catch(function(error) {
        expect(error.status).toBe(400);
      });
      
      $httpBackend.flush();
    });
    
    /*
    Test Documentation:
    - Test Name: updateThresholds - cache invalidation
    - Purpose: Validates that cache is invalidated after successful update
    - Scenario: Cache contains old threshold data
    - Expected Result: Cache key is removed
    */
    it('should invalidate cache after successful update', function() {
      var oldThresholds = {
        lowRiskThreshold: 30,
        mediumRiskThreshold: 60,
        highRiskThreshold: 80
      };
      var newThresholds = {
        lowRiskThreshold: 25,
        mediumRiskThreshold: 55,
        highRiskThreshold: 85
      };
      
      // Pre-populate cache
      cacheService.put('threshold_config', oldThresholds, 60000);
      expect(cacheService.get('threshold_config')).toEqual(oldThresholds);
      
      $httpBackend.expectPUT(apiConfig.baseUrl + apiConfig.endpoints.thresholdConfig, newThresholds).respond({ status: 'updated' });
      
      configService.updateThresholds(newThresholds);
      $httpBackend.flush();
      
      expect(cacheService.get('threshold_config')).toBeNull();
    });
  });
  
  /*
  Coverage Report:
  - Functions tested: getThresholds, updateThresholds
  - Scenarios covered: initial fetch, cache retrieval, HTTP errors, cache invalidation
  - Uncovered scenarios: timeout handling, partial updates, concurrent updates
  */
});
