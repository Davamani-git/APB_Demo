(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .service('ReportingApiService', ReportingApiService);

  ReportingApiService.$inject = ['$http', 'ConfigService', 'LoggingService', '$q'];
  function ReportingApiService($http, ConfigService, LoggingService, $q) {
    this.getMonthlySpend = function (range) {
      var url = ConfigService.apiBaseUrl + '/api/reporting/monthly-spend';
      var correlationId = LoggingService.newCorrelationId();
      var params = {};
      if (range && range.from && range.to) {
        params.from = range.from;
        params.to = range.to;
      }

      return $http.get(url, {
        params: params,
        headers: { 'X-Correlation-Id': correlationId }
      }).then(function (res) {
        return res.data;
      }).catch(function (err) {
        LoggingService.error('ReportingApiService.getMonthlySpend', { error: err, correlationId: correlationId });
        return $q.reject(err);
      });
    };
  }
})();
