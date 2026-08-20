(function() {
  'use strict';
  angular.module('fraudDetection.policy')
    .factory('ThresholdConfigService', ['$http', '$cacheFactory', function($http, $cacheFactory) {
      var cache = $cacheFactory('thresholdCache');
      return {
        getThresholds: function() {
          var cached = cache.get('thresholds');
          if (cached) {
            return Promise.resolve(cached);
          }
          return $http.get('/api/policy/thresholds')
            .then(function(response) {
              cache.put('thresholds', response.data);
              return response.data;
            });
        },
        invalidateCache: function() {
          cache.remove('thresholds');
        }
      };
    }]);
})();