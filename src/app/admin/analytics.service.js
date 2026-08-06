(function() {
  'use strict';
  angular.module('shoppingPlatform').service('AnalyticsService', ['$http', '$filter', 'API_CONFIG', function($http, $filter, API_CONFIG) {
    this.getPlatformMetrics = function() {
      return $http.get(API_CONFIG.baseUrl + '/api/analytics/platform', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.getSellerMetrics = function() {
      return $http.get(API_CONFIG.baseUrl + '/api/analytics/seller', { timeout: API_CONFIG.timeout }).then(function(response) {
        return response.data;
      });
    };
    this.getMetricsByPeriod = function(metric, period) {
      return $http.get(API_CONFIG.baseUrl + '/api/analytics/metrics', {
        params: { metric: metric, period: period },
        timeout: API_CONFIG.timeout
      }).then(function(response) {
        return response.data;
      });
    };
  }]);
})();