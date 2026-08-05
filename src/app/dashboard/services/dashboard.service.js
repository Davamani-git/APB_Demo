(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .service('DashboardService', DashboardService);

  DashboardService.$inject = ['$http', 'ConfigService', 'LoggingService', '$q'];
  function DashboardService($http, ConfigService, LoggingService, $q) {
    this.getDashboardOverview = function (dateRange) {
      var url = ConfigService.apiBaseUrl + '/dashboard/overview';
      var params = buildRangeParams(dateRange);
      var correlationId = LoggingService.newCorrelationId();

      return $http.get(url, {
        params: params,
        headers: { 'X-Correlation-Id': correlationId }
      }).then(function (res) {
        return res.data;
      }).catch(function (err) {
        LoggingService.error('DashboardService.getDashboardOverview', { error: err, correlationId: correlationId });
        return $q.reject(err);
      });
    };

    function buildRangeParams(range) {
      if (range && range.type === 'CURRENT_MONTH') {
        return { range: 'CURRENT_MONTH' };
      }
      if (range && range.type) {
        return { range: range.type };
      }
      return range || {};
    }
  }
})();
