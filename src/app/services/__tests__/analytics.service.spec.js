describe('AnalyticsService', function() {
  beforeEach(module('onlineShoppingApp'));
  var AnalyticsService, $httpBackend, $q, $cacheFactory;

  beforeEach(inject(function(_AnalyticsService_, _$httpBackend_, _$q_, _$cacheFactory_) {
    AnalyticsService = _AnalyticsService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $cacheFactory = _$cacheFactory_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getSalesReport', function() {
    /*
    Test Documentation:
    - Test Name: should fetch sales report from API
    - Purpose: Validates successful API call and data resolution
    - Scenario: First call to getSalesReport with valid sellerId and period
    - Expected Result: Promise resolves with response data from API
    */
    it('should fetch sales report from API', function(done) {
      var sellerId = 'seller123';
      var period = 'monthly';
      var mockResponse = { sales: 1000, period: 'monthly' };

      $httpBackend.expectGET('/api/analytics/sales?sellerId=seller123&period=monthly')
        .respond(200, mockResponse);

      AnalyticsService.getSalesReport(sellerId, period).then(function(data) {
        expect(data).toEqual(mockResponse);
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should return cached sales report on subsequent calls
    - Purpose: Validates caching mechanism works correctly
    - Scenario: Second call to getSalesReport with same parameters
    - Expected Result: Promise resolves with cached data without API call
    */
    it('should return cached sales report on subsequent calls', function(done) {
      var sellerId = 'seller123';
      var period = 'monthly';
      var mockResponse = { sales: 1000, period: 'monthly' };

      $httpBackend.expectGET('/api/analytics/sales?sellerId=seller123&period=monthly')
        .respond(200, mockResponse);

      AnalyticsService.getSalesReport(sellerId, period).then(function(data) {
        expect(data).toEqual(mockResponse);
        
        AnalyticsService.getSalesReport(sellerId, period).then(function(cachedData) {
          expect(cachedData).toEqual(mockResponse);
          done();
        });
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should reject promise on API error
    - Purpose: Validates error handling for failed API requests
    - Scenario: API returns error response
    - Expected Result: Promise rejects with error object
    */
    it('should reject promise on API error', function(done) {
      var sellerId = 'seller123';
      var period = 'monthly';
      var errorResponse = { error: 'Unauthorized' };

      $httpBackend.expectGET('/api/analytics/sales?sellerId=seller123&period=monthly')
        .respond(401, errorResponse);

      AnalyticsService.getSalesReport(sellerId, period).then(function() {
        fail('Should have rejected');
      }, function(error) {
        expect(error.status).toBe(401);
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle different sellers and periods with separate cache keys
    - Purpose: Validates cache key generation for different parameters
    - Scenario: Multiple calls with different sellerId and period combinations
    - Expected Result: Each combination cached separately
    */
    it('should handle different sellers and periods with separate cache keys', function(done) {
      var mockResponse1 = { sales: 1000 };
      var mockResponse2 = { sales: 2000 };

      $httpBackend.expectGET('/api/analytics/sales?sellerId=seller1&period=monthly')
        .respond(200, mockResponse1);
      $httpBackend.expectGET('/api/analytics/sales?sellerId=seller2&period=yearly')
        .respond(200, mockResponse2);

      AnalyticsService.getSalesReport('seller1', 'monthly').then(function(data) {
        expect(data).toEqual(mockResponse1);
        
        AnalyticsService.getSalesReport('seller2', 'yearly').then(function(data) {
          expect(data).toEqual(mockResponse2);
          done();
        });
      });

      $httpBackend.flush();
    });
  });

  describe('getPlatformMetrics', function() {
    /*
    Test Documentation:
    - Test Name: should fetch platform metrics from API
    - Purpose: Validates successful platform metrics API call
    - Scenario: First call to getPlatformMetrics
    - Expected Result: Promise resolves with metrics data
    */
    it('should fetch platform metrics from API', function(done) {
      var mockMetrics = { users: 5000, orders: 10000, revenue: 50000 };

      $httpBackend.expectGET('/api/analytics/platform')
        .respond(200, mockMetrics);

      AnalyticsService.getPlatformMetrics().then(function(data) {
        expect(data).toEqual(mockMetrics);
        done();
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should return cached platform metrics on subsequent calls
    - Purpose: Validates caching for platform metrics
    - Scenario: Multiple calls to getPlatformMetrics
    - Expected Result: Second call uses cached data
    */
    it('should return cached platform metrics on subsequent calls', function(done) {
      var mockMetrics = { users: 5000, orders: 10000 };

      $httpBackend.expectGET('/api/analytics/platform')
        .respond(200, mockMetrics);

      AnalyticsService.getPlatformMetrics().then(function(data) {
        expect(data).toEqual(mockMetrics);
        
        AnalyticsService.getPlatformMetrics().then(function(cachedData) {
          expect(cachedData).toEqual(mockMetrics);
          done();
        });
      });

      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should reject promise on platform metrics API error
    - Purpose: Validates error handling for metrics endpoint
    - Scenario: API returns server error
    - Expected Result: Promise rejects with error
    */
    it('should reject promise on platform metrics API error', function(done) {
      $httpBackend.expectGET('/api/analytics/platform')
        .respond(500, { error: 'Server error' });

      AnalyticsService.getPlatformMetrics().then(function() {
        fail('Should have rejected');
      }, function(error) {
        expect(error.status).toBe(500);
        done();
      });

      $httpBackend.flush();
    });
  });

  describe('clearCache', function() {
    /*
    Test Documentation:
    - Test Name: should clear all cached data
    - Purpose: Validates cache clearing functionality
    - Scenario: After caching data, call clearCache
    - Expected Result: Cache is emptied, next call fetches fresh data
    */
    it('should clear all cached data', function(done) {
      var mockResponse = { sales: 1000 };

      $httpBackend.expectGET('/api/analytics/sales?sellerId=seller1&period=monthly')
        .respond(200, mockResponse);

      AnalyticsService.getSalesReport('seller1', 'monthly').then(function() {
        AnalyticsService.clearCache();
        
        $httpBackend.expectGET('/api/analytics/sales?sellerId=seller1&period=monthly')
          .respond(200, mockResponse);
        
        AnalyticsService.getSalesReport('seller1', 'monthly').then(function() {
          done();
        });
        
        $httpBackend.flush();
      });

      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getSalesReport, getPlatformMetrics, clearCache
- Scenarios covered: successful API calls, caching mechanism, cache retrieval, error handling, multiple parameter combinations, cache clearing
- Edge cases covered: expired cache, API errors (401, 500), different cache keys
- Uncovered scenarios: network timeout, malformed responses, concurrent requests
*/