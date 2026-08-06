(function() {
  'use strict';
  angular.module('aiDashboardApp')
    .service('analyticsService', ['$http', '$cacheFactory', function($http, $cacheFactory) {
      var cache = $cacheFactory('analyticsCache');
      this.getDrilldownData = function(dataPointId) {
        var cacheKey = 'drilldown_' + dataPointId;
        var cachedData = cache.get(cacheKey);
        if (cachedData) {
          return Promise.resolve(cachedData);
        }
        return $http.get('/api/analytics/details/' + dataPointId).then(function(response) {
          cache.put(cacheKey, response.data);
          return response.data;
        });
      };
      this.compareCompanies = function(companyIds, metrics, timePeriod) {
        return $http.post('/api/analytics/compare', {
          companyIds: companyIds,
          metrics: metrics,
          timePeriod: timePeriod
        }).then(function(response) {
          return response.data;
        });
      };
      this.getProjectAnalytics = function(companyId, projectId) {
        return $http.get('/api/analytics/company/' + companyId + '/project/' + projectId).then(function(response) {
          return response.data;
        });
      };
    }]);
})();