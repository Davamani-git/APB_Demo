(function () {
  'use strict';

  angular
    .module('ccd.dashboard')
    .service('CardApiService', CardApiService);

  CardApiService.$inject = ['$http', 'ConfigService', 'LoggingService', '$q'];
  function CardApiService($http, ConfigService, LoggingService, $q) {
    this.getUserCards = function () {
      var url = ConfigService.apiBaseUrl + '/cards';
      var correlationId = LoggingService.newCorrelationId();

      return $http.get(url, {
        headers: { 'X-Correlation-Id': correlationId }
      }).then(function (res) {
        return res.data.cards;
      }).catch(function (err) {
        LoggingService.error('CardApiService.getUserCards', { error: err, correlationId: correlationId });
        return $q.reject(err);
      });
    };
  }
})();
