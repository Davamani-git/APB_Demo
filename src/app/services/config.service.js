(function() {
  'use strict';
  angular.module('fraudAlertModule')
    .service('configService', ['$http', 'API_ENDPOINTS', '$q', function($http, API_ENDPOINTS, $q) {
      const self = this;
      let configCache = null;
      
      self.getConfig = function() {
        if (configCache) {
          return $q.resolve(configCache);
        }
        return $http.get(API_ENDPOINTS.config)
          .then(function(response) {
            configCache = response.data;
            return configCache;
          });
      };
      
      self.getThresholds = function() {
        return self.getConfig().then(function(config) {
          return config.riskThresholds || {
            low: 30,
            medium: 60,
            high: 85
          };
        });
      };
      
      self.clearCache = function() {
        configCache = null;
      };
    }]);
})();