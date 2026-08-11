/*
Test Documentation:
- Test Name: PricingService - getCurrentPricing from API
- Purpose: Validates pricing data retrieval from API
- Scenario: HTTP request succeeds and data is cached
- Expected Result: Returns pricing data and stores in cache
*/
/*
Test Documentation:
- Test Name: PricingService - getCurrentPricing from cache
- Purpose: Validates cache retrieval within TTL
- Scenario: Cached data exists and is not expired
- Expected Result: Returns cached data without API call
*/
/*
Test Documentation:
- Test Name: PricingService - getCurrentPricing fallback to mock
- Purpose: Validates fallback to mock data on API failure
- Scenario: HTTP request fails
- Expected Result: Returns mock pricing data and caches it
*/
/*
Test Documentation:
- Test Name: PricingService - getCurrentPricing expired cache
- Purpose: Validates cache expiration after TTL
- Scenario: Cached data exists but is expired
- Expected Result: Makes new API call and updates cache
*/
/*
Test Documentation:
- Test Name: PricingService - clearCache
- Purpose: Validates cache clearing functionality
- Scenario: Service clears all cached data
- Expected Result: Cache is emptied
*/
/*
Coverage Report:
- Functions tested: getCurrentPricing, clearCache
- Scenarios covered: API success/failure, cache hit/miss/expiration, mock fallback
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('PricingService', function() {
    var PricingService, $httpBackend, $cacheFactory, API_CONFIG, cache;

    beforeEach(module('energyDashboard'));

    beforeEach(inject(function(_PricingService_, _$httpBackend_, _$cacheFactory_, _API_CONFIG_) {
      PricingService = _PricingService_;
      $httpBackend = _$httpBackend_;
      $cacheFactory = _$cacheFactory_;
      API_CONFIG = _API_CONFIG_;
      cache = $cacheFactory.get('pricingCache');
      if (cache) {
        cache.removeAll();
      }
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      if (cache) {
        cache.removeAll();
      }
    });

    describe('getCurrentPricing', function() {
      it('should fetch pricing from API and cache it', function() {
        var mockPricing = {
          currency: 'USD',
          ratePerKwh: 0.25,
          peakRate: 0.35,
          offPeakRate: 0.18,
          lastUpdated: new Date()
        };
        
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.pricing)
          .respond(200, mockPricing);
        
        PricingService.getCurrentPricing().then(function(data) {
          expect(data.currency).toBe('USD');
          expect(data.ratePerKwh).toBe(0.25);
          
          var cached = cache.get('currentPricing');
          expect(cached).toBeDefined();
          expect(cached.data).toEqual(mockPricing);
        });
        
        $httpBackend.flush();
      });

      it('should return cached data when cache is valid', function() {
        var cachedPricing = {
          currency: 'USD',
          ratePerKwh: 0.22,
          peakRate: 0.32,
          offPeakRate: 0.16,
          lastUpdated: new Date()
        };
        
        cache.put('currentPricing', {
          data: cachedPricing,
          timestamp: Date.now()
        });
        
        PricingService.getCurrentPricing().then(function(data) {
          expect(data).toEqual(cachedPricing);
          expect(data.ratePerKwh).toBe(0.22);
        });
      });

      it('should return mock data on API failure and cache it', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.pricing)
          .respond(500, 'Server Error');
        
        PricingService.getCurrentPricing().then(function(data) {
          expect(data.currency).toBe('USD');
          expect(data.ratePerKwh).toBe(0.20);
          expect(data.peakRate).toBe(0.30);
          expect(data.offPeakRate).toBe(0.15);
          
          var cached = cache.get('currentPricing');
          expect(cached).toBeDefined();
        });
        
        $httpBackend.flush();
      });

      it('should fetch new data when cache is expired', function() {
        var expiredTimestamp = Date.now() - (25 * 60 * 60 * 1000);
        cache.put('currentPricing', {
          data: { ratePerKwh: 0.10 },
          timestamp: expiredTimestamp
        });
        
        var newPricing = {
          currency: 'USD',
          ratePerKwh: 0.28,
          peakRate: 0.38,
          offPeakRate: 0.20,
          lastUpdated: new Date()
        };
        
        $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.pricing)
          .respond(200, newPricing);
        
        PricingService.getCurrentPricing().then(function(data) {
          expect(data.ratePerKwh).toBe(0.28);
        });
        
        $httpBackend.flush();
      });
    });

    describe('clearCache', function() {
      it('should clear all cached data', function() {
        cache.put('currentPricing', {
          data: { ratePerKwh: 0.20 },
          timestamp: Date.now()
        });
        
        expect(cache.get('currentPricing')).toBeDefined();
        
        PricingService.clearCache();
        
        expect(cache.get('currentPricing')).toBeUndefined();
      });

      it('should not throw error when cache is already empty', function() {
        expect(function() {
          PricingService.clearCache();
        }).not.toThrow();
      });
    });
  });
})();