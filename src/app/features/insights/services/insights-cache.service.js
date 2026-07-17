(function () {
  'use strict';

  angular
    .module('rbApp.insights')
    .service('InsightsCacheService', InsightsCacheService);

  InsightsCacheService.$inject = ['$cacheFactory'];

  function InsightsCacheService($cacheFactory) {
    const cache = $cacheFactory('insightsCache');

    this.getCachedInsights = function (queryKey) {
      return cache.get(queryKey) || null;
    };

    this.setCachedInsights = function (queryKey, insights) {
      cache.put(queryKey, insights);
    };

    this.clear = function () {
      cache.removeAll();
    };
  }
})();
