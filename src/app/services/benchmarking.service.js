(function() {
  'use strict';
  angular.module('aiPortfolioApp')
    .service('benchmarkingService', ['$http', '$q', 'analyticsService', function($http, $q, analyticsService) {
      var self = this;
      var benchmarkCache = null;
      var CACHE_TTL = 3600000;
      var cacheTimestamp = null;
      self.fetchBenchmarkData = function() {
        if (benchmarkCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_TTL)) {
          return $q.resolve(benchmarkCache);
        }
        return $http.get('/api/benchmarks/industry')
          .then(function(response) {
            benchmarkCache = response.data;
            cacheTimestamp = Date.now();
            return benchmarkCache;
          });
      };
      self.comparePortfolio = function(portfolioMetrics) {
        return self.fetchBenchmarkData()
          .then(function(benchmarks) {
            var comparison = {
              portfolioValue: portfolioMetrics.totalSpend,
              industryAverage: benchmarks.industryAverage,
              percentile: self.calculatePercentile(portfolioMetrics.totalSpend, benchmarks),
              peerComparison: []
            };
            if (benchmarks.metrics) {
              benchmarks.metrics.forEach(function(metric) {
                comparison.peerComparison.push({
                  metric: metric.name,
                  portfolioValue: portfolioMetrics[metric.key] || 0,
                  industryValue: metric.average,
                  percentile: self.calculatePercentile(portfolioMetrics[metric.key], metric)
                });
              });
            }
            return comparison;
          });
      };
      self.calculatePercentile = function(value, benchmarkData) {
        if (!benchmarkData.distribution) return 50;
        var sorted = benchmarkData.distribution.slice().sort(function(a, b) {
          return a - b;
        });
        var index = sorted.findIndex(function(v) {
          return v >= value;
        });
        return index >= 0 ? (index / sorted.length) * 100 : 100;
      };
      self.getIndustryTrends = function() {
        return $http.get('/api/benchmarks/trends')
          .then(function(response) {
            return response.data;
          });
      };
      self.clearCache = function() {
        benchmarkCache = null;
        cacheTimestamp = null;
      };
    }]);
})();