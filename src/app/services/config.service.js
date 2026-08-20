(function() {
  'use strict';
  angular.module('fraudDetectionModule')
    .service('configService', ['$http', '$q', 'apiConfig', 'cacheService', function($http, $q, apiConfig, cacheService) {
      const self = this;
      self.getThresholds = function() {
        const cacheKey = 'threshold_config';
        const cached = cacheService.get(cacheKey);
        if (cached) {
          return $q.resolve(cached);
        }
        return $http.get(apiConfig.baseUrl + apiConfig.endpoints.thresholdConfig, {
          timeout: apiConfig.timeout
        }).then(function(response) {
          const config = response.data;
          cacheService.put(cacheKey, config, 60000);
          return config;
        }).catch(function(error) {
          return $q.reject(error);
        });
      };
      self.updateThresholds = function(thresholdConfig) {
        return $http.put(apiConfig.baseUrl + apiConfig.endpoints.thresholdConfig, thresholdConfig, {
          timeout: apiConfig.timeout
        }).then(function(response) {
          cacheService.remove('threshold_config');
          return response.data;
        }).catch(function(error) {
          return $q.reject(error);
        });
      };
    }]);
})();