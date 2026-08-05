(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .service('TransactionApiService', TransactionApiService);

  TransactionApiService.$inject = ['$http', 'ConfigService', 'LoggingService', '$q'];
  function TransactionApiService($http, ConfigService, LoggingService, $q) {
    this.getTransactions = function (filter) {
      var url = ConfigService.apiBaseUrl + '/api/transactions';
      var correlationId = LoggingService.newCorrelationId();

      return $http.get(url, {
        params: filter || {},
        headers: { 'X-Correlation-Id': correlationId }
      }).then(function (res) {
        return res.data.transactions;
      }).catch(function (err) {
        LoggingService.error('TransactionApiService.getTransactions', { error: err, correlationId: correlationId });
        return $q.reject(err);
      });
    };
  }
})();
