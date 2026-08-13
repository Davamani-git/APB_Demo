(function() {
  'use strict';
  angular.module('wearableIntegrationApp')
    .service('HealthDataService', ['$resource', 'API_ENDPOINT', function($resource, API_ENDPOINT) {
      var summaryResource = $resource(API_ENDPOINT + '/health/summary', {}, {
        get: { method: 'GET', params: { date: '@date' } }
      });
      var metricsResource = $resource(API_ENDPOINT + '/health/metrics', {}, {
        save: { method: 'POST', isArray: true }
      });
      this.getDailySummary = function(date) {
        return summaryResource.get({ date: date }).$promise;
      };
      this.saveMetrics = function(metrics) {
        return metricsResource.save(metrics).$promise;
      };
    }]);
})();