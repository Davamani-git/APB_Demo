(function () {
  'use strict';

  angular.module('apbDemo')
    .service('MonthContextService', MonthContextService);

  MonthContextService.$inject = ['$injector', '$q', 'EnvConfigService', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

  function MonthContextService($injector, $q, EnvConfigService, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    this.getMonthContext = function () {
      var deferred = $q.defer();

      LoggingService.info('Requesting month context');

      if (EnvConfigService.getUseMockData()) {
        var mockData = window.MonthContextMockData || {};
        var payload = mockData['default'];

        if (!payload || !angular.isArray(payload.months)) {
          var noDataError = ErrorHandlingService.createClientValidationError('No month context mock data available.');
          deferred.reject(noDataError);
          return deferred.promise;
        }

        deferred.resolve(payload);
        return deferred.promise;
      }

      var $http = $injector.get('$http');
      var baseUrl = EnvConfigService.getApiBaseUrl() || '';
      var url = baseUrl + API_ENDPOINTS.MONTH_CONTEXT;
      var timeoutMs = EnvConfigService.getApiTimeoutMs();

      $http.get(url, { timeout: timeoutMs })
        .then(function (response) {
          try {
            var data = response.data || {};
            if (!angular.isArray(data.months)) {
              throw new Error('Month context response must contain months array.');
            }
            deferred.resolve(data);
          } catch (e) {
            var errorModel = ErrorHandlingService.handleError(e, 'MonthContextService response validation failed');
            deferred.reject(errorModel);
          }
        })
        .catch(function (httpError) {
          var errorModel = ErrorHandlingService.handleError(httpError, 'MonthContextService HTTP error');
          deferred.reject(errorModel);
        });

      return deferred.promise;
    };
  }
})();
