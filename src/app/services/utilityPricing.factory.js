(function() {
  'use strict';
  angular.module('energyMonitoringApp').factory('UtilityPricingFactory', ['$http', '$cacheFactory', '$q', UtilityPricingFactory]);
  function UtilityPricingFactory($http, $cacheFactory, $q) {
    const API_BASE = 'https://api.utility.example.com';
    const cache = $cacheFactory('utilityPricingCache');
    const factory = {};
    factory.getCurrentRate = function() {
      const cachedRate = cache.get('currentRate');
      if (cachedRate) {
        return $q.resolve(cachedRate);
      }
      return $http.get(API_BASE + '/api/pricing/current').then(function(response) {
        const rate = {
          rateId: response.data.rateId,
          pricePerKwh: response.data.pricePerKwh || 0,
          effectiveTime: new Date(response.data.effectiveTime),
          rateType: response.data.rateType || 'standard'
        };
        cache.put('currentRate', rate);
        return rate;
      }).catch(function(error) {
        console.error('Failed to fetch utility rate:', error);
        return $q.reject(error);
      });
    };
    factory.calculateCost = function(usage, pricePerKwh) {
      return (usage * pricePerKwh).toFixed(2);
    };
    factory.clearCache = function() {
      cache.removeAll();
    };
    return factory;
  }
})();