angular.module('fraudAlert.ingestion')
  .factory('RiskThresholdFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
    var cachedThresholds = null;
    return {
      getThresholds: function() {
        if (cachedThresholds) {
          return $q.resolve(cachedThresholds);
        }
        return $http.get(API_CONFIG.configUrl)
          .then(function(response) {
            cachedThresholds = response.data;
            return cachedThresholds;
          })
          .catch(function(error) {
            console.error('Failed to fetch thresholds, using defaults:', error);
            var defaultThresholds = {
              low: 0,
              medium: 50,
              high: 75
            };
            return defaultThresholds;
          });
      },
      clearCache: function() {
        cachedThresholds = null;
      }
    };
  }]);