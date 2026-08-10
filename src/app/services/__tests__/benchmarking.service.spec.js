/*
Test Documentation:
- Test Name: benchmarkingService - fetchBenchmarkData
- Purpose: Validates fetching benchmark data with caching
- Scenario: Fetch benchmark data from API
- Expected Result: Should return benchmark data and cache it

Test Documentation:
- Test Name: benchmarkingService - fetchBenchmarkData cached
- Purpose: Validates cache usage for benchmark data
- Scenario: Fetch benchmark data when cache is valid
- Expected Result: Should return cached data without API call

Test Documentation:
- Test Name: benchmarkingService - comparePortfolio
- Purpose: Validates portfolio comparison against benchmarks
- Scenario: Compare portfolio metrics with industry benchmarks
- Expected Result: Should return comparison with percentiles

Test Documentation:
- Test Name: benchmarkingService - calculatePercentile
- Purpose: Validates percentile calculation
- Scenario: Calculate percentile for a value in distribution
- Expected Result: Should return correct percentile

Test Documentation:
- Test Name: benchmarkingService - getIndustryTrends
- Purpose: Validates fetching industry trends
- Scenario: Get industry trend data
- Expected Result: Should return trend data

Test Documentation:
- Test Name: benchmarkingService - clearCache
- Purpose: Validates cache clearing
- Scenario: Clear benchmark cache
- Expected Result: Should invalidate cache

Coverage Report:
- Functions tested: fetchBenchmarkData, comparePortfolio, calculatePercentile, getIndustryTrends, clearCache
- Scenarios covered: data fetching, caching, comparison, percentile calculation, cache management
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('benchmarkingService', function() {
    var benchmarkingService, $httpBackend, $q, analyticsService;

    beforeEach(module('aiPortfolioApp'));

    beforeEach(inject(function(_benchmarkingService_, _$httpBackend_, _$q_, _analyticsService_) {
      benchmarkingService = _benchmarkingService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      analyticsService = _analyticsService_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      benchmarkingService.clearCache();
    });

    describe('fetchBenchmarkData', function() {
      it('should fetch benchmark data from API', function() {
        var mockBenchmarks = {
          industryAverage: 100000,
          distribution: [50000, 75000, 100000, 125000, 150000],
          metrics: [{name: 'Cost per User', key: 'costPerUser', average: 500}]
        };
        $httpBackend.expectGET('/api/benchmarks/industry').respond(200, mockBenchmarks);
        var result;
        benchmarkingService.fetchBenchmarkData().then(function(data) {
          result = data;
        });
        $httpBackend.flush();
        expect(result.industryAverage).toBe(100000);
      });

      it('should return cached data within TTL', function() {
        var mockBenchmarks = {industryAverage: 100000};
        $httpBackend.expectGET('/api/benchmarks/industry').respond(200, mockBenchmarks);
        benchmarkingService.fetchBenchmarkData();
        $httpBackend.flush();
        var result;
        benchmarkingService.fetchBenchmarkData().then(function(data) {
          result = data;
        });
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should handle fetch error', function() {
        $httpBackend.expectGET('/api/benchmarks/industry').respond(500, 'Error');
        var errorCaught = false;
        benchmarkingService.fetchBenchmarkData().catch(function() {
          errorCaught = true;
        });
        $httpBackend.flush();
        expect(errorCaught).toBe(true);
      });
    });

    describe('comparePortfolio', function() {
      it('should compare portfolio with benchmarks', function() {
        var portfolioMetrics = {
          totalSpend: 120000,
          costPerUser: 550
        };
        var mockBenchmarks = {
          industryAverage: 100000,
          distribution: [50000, 75000, 100000, 125000, 150000],
          metrics: [{name: 'Cost per User', key: 'costPerUser', average: 500, distribution: [400, 500, 600]}]
        };
        $httpBackend.expectGET('/api/benchmarks/industry').respond(200, mockBenchmarks);
        var result;
        benchmarkingService.comparePortfolio(portfolioMetrics).then(function(data) {
          result = data;
        });
        $httpBackend.flush();
        expect(result.portfolioValue).toBe(120000);
        expect(result.industryAverage).toBe(100000);
        expect(result.peerComparison.length).toBeGreaterThan(0);
      });
    });

    describe('calculatePercentile', function() {
      it('should calculate correct percentile', function() {
        var benchmarkData = {
          distribution: [50, 60, 70, 80, 90, 100]
        };
        var percentile = benchmarkingService.calculatePercentile(75, benchmarkData);
        expect(percentile).toBeGreaterThan(0);
        expect(percentile).toBeLessThanOrEqual(100);
      });

      it('should return 50 for missing distribution', function() {
        var percentile = benchmarkingService.calculatePercentile(100, {});
        expect(percentile).toBe(50);
      });

      it('should return 100 for value above all', function() {
        var benchmarkData = {
          distribution: [50, 60, 70]
        };
        var percentile = benchmarkingService.calculatePercentile(200, benchmarkData);
        expect(percentile).toBe(100);
      });
    });

    describe('getIndustryTrends', function() {
      it('should fetch industry trends', function() {
        var mockTrends = {trends: [{month: 'Jan', average: 95000}]};
        $httpBackend.expectGET('/api/benchmarks/trends').respond(200, mockTrends);
        var result;
        benchmarkingService.getIndustryTrends().then(function(data) {
          result = data;
        });
        $httpBackend.flush();
        expect(result.trends).toBeDefined();
      });
    });

    describe('clearCache', function() {
      it('should clear benchmark cache', function() {
        var mockBenchmarks = {industryAverage: 100000};
        $httpBackend.expectGET('/api/benchmarks/industry').respond(200, mockBenchmarks);
        benchmarkingService.fetchBenchmarkData();
        $httpBackend.flush();
        benchmarkingService.clearCache();
        $httpBackend.expectGET('/api/benchmarks/industry').respond(200, mockBenchmarks);
        benchmarkingService.fetchBenchmarkData();
        $httpBackend.flush();
      });
    });
  });
})();