(function() {
  'use strict';
  angular.module('energyDashboard')
    .service('PricingService', ['$http', '$cacheFactory', '$q', 'API_CONFIG', function($http, $cacheFactory, $q, API_CONFIG) {
      const cache = $cacheFactory('pricingCache');
      const CACHE_TTL = 24 * 60 * 60 * 1000;
      this.getCurrentPricing = function() {
        const cachedData = cache.get('currentPricing');
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
          return $q.resolve(cachedData.data);
        }
        const deferred = $q.defer();
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.pricing, {
          timeout: API_CONFIG.timeout
        }).then(function(response) {
          const pricingData = response.data;
          cache.put('currentPricing', {
            data: pricingData,
            timestamp: Date.now()
          });
          deferred.resolve(pricingData);
        }).catch(function(error) {
          const mockData = {
            currency: 'USD',
            ratePerKwh: 0.20,
            peakRate: 0.30,
            offPeakRate: 0.15,
            lastUpdated: new Date()
          };
          cache.put('currentPricing', {
            data: mockData,
            timestamp: Date.now()
          });
          deferred.resolve(mockData);
        });
        return deferred.promise;
      };
      this.clearCache = function() {
        cache.removeAll();
      };
    }]);
})();