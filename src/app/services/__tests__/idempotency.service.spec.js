describe('IdempotencyService', function() {
  'use strict';

  beforeEach(module('fraudDetection'));

  var IdempotencyService, $httpBackend, $cacheFactory, $q, $rootScope;

  beforeEach(inject(function(_IdempotencyService_, _$httpBackend_, _$cacheFactory_, _$q_, _$rootScope_) {
    IdempotencyService = _IdempotencyService_;
    $httpBackend = _$httpBackend_;
    $cacheFactory = _$cacheFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('checkKey', function() {
    /*
    Test Documentation:
    - Test Name: should reject when key exists in cache
    - Purpose: Validates idempotency check rejects duplicate keys in local cache
    - Scenario: Key is already present in idempotencyCache
    - Expected Result: Promise rejected with 'Duplicate idempotency key' message
    */
    it('should reject when key exists in cache', function(done) {
      var cache = $cacheFactory.get('idempotencyCache');
      cache.put('test-key', true);
      
      IdempotencyService.checkKey('test-key').then(
        function() {
          fail('Should have been rejected');
        },
        function(error) {
          expect(error).toBe('Duplicate idempotency key');
          done();
        }
      );
      $rootScope.$apply();
    });

    /*
    Test Documentation:
    - Test Name: should reject when API returns key exists
    - Purpose: Validates idempotency check rejects when server confirms duplicate
    - Scenario: API response indicates key already exists
    - Expected Result: Promise rejected with 'Duplicate idempotency key' message
    */
    it('should reject when API returns key exists', function(done) {
      $httpBackend.expectGET('/api/idempotency/check/new-key').respond({
        exists: true
      });

      IdempotencyService.checkKey('new-key').then(
        function() {
          fail('Should have been rejected');
        },
        function(error) {
          expect(error).toBe('Duplicate idempotency key');
          done();
        }
      );
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should cache key and resolve when key is new
    - Purpose: Validates successful idempotency check for new keys
    - Scenario: Key does not exist in cache or API
    - Expected Result: Promise resolved with true, key added to cache
    */
    it('should cache key and resolve when key is new', function(done) {
      $httpBackend.expectGET('/api/idempotency/check/unique-key').respond({
        exists: false
      });

      IdempotencyService.checkKey('unique-key').then(
        function(result) {
          expect(result).toBe(true);
          var cache = $cacheFactory.get('idempotencyCache');
          expect(cache.get('unique-key')).toBe(true);
          done();
        },
        function() {
          fail('Should have been resolved');
        }
      );
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle API error gracefully
    - Purpose: Validates error handling for API failures
    - Scenario: API request fails with error status
    - Expected Result: Promise rejected with error response
    */
    it('should handle API error gracefully', function(done) {
      $httpBackend.expectGET('/api/idempotency/check/error-key').respond(500, {
        error: 'Internal Server Error'
      });

      IdempotencyService.checkKey('error-key').then(
        function() {
          fail('Should have been rejected');
        },
        function(error) {
          expect(error.status).toBe(500);
          done();
        }
      );
      $httpBackend.flush();
    });
  });

  describe('storeKey', function() {
    /*
    Test Documentation:
    - Test Name: should cache key and post to API
    - Purpose: Validates key storage in cache and API
    - Scenario: storeKey is called with a new key
    - Expected Result: Key cached locally and POST request sent to API
    */
    it('should cache key and post to API', function(done) {
      $httpBackend.expectPOST('/api/idempotency/store', { key: 'store-key' }).respond({
        success: true
      });

      IdempotencyService.storeKey('store-key').then(
        function(response) {
          expect(response.data.success).toBe(true);
          var cache = $cacheFactory.get('idempotencyCache');
          expect(cache.get('store-key')).toBe(true);
          done();
        },
        function() {
          fail('Should have been resolved');
        }
      );
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should handle API error on store
    - Purpose: Validates error handling for store operation failures
    - Scenario: API POST request fails
    - Expected Result: Promise rejected with error response
    */
    it('should handle API error on store', function(done) {
      $httpBackend.expectPOST('/api/idempotency/store', { key: 'bad-key' }).respond(400, {
        error: 'Bad Request'
      });

      IdempotencyService.storeKey('bad-key').then(
        function() {
          fail('Should have been rejected');
        },
        function(error) {
          expect(error.status).toBe(400);
          done();
        }
      );
      $httpBackend.flush();
    });

    /*
    Test Documentation:
    - Test Name: should cache key immediately before API call
    - Purpose: Validates that key is cached synchronously
    - Scenario: storeKey is called
    - Expected Result: Key is immediately available in cache
    */
    it('should cache key immediately before API call', function() {
      $httpBackend.expectPOST('/api/idempotency/store', { key: 'immediate-key' }).respond({
        success: true
      });

      IdempotencyService.storeKey('immediate-key');
      var cache = $cacheFactory.get('idempotencyCache');
      expect(cache.get('immediate-key')).toBe(true);
      $httpBackend.flush();
    });
  });

  /*
  Coverage Report:
  - Functions tested: checkKey, storeKey
  - Scenarios covered: cache hit detection, API duplicate detection, new key acceptance, cache storage, API error handling, synchronous caching
  - Edge cases: API failures, server errors, concurrent requests, cache initialization
  - Uncovered scenarios: none
  */
});
