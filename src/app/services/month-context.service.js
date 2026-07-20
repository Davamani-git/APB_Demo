(function () {
  'use strict';

  angular
    .module('apbDemo')
    .service('MonthContextService', MonthContextService);

  MonthContextService.$inject = ['$q', '$injector', 'EnvConfigService', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];
  function MonthContextService($q, $injector, EnvConfigService, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    this.getMonthContext = getMonthContext;

    function getMonthContext() {
      var deferred = $q.defer();

      if (EnvConfigService.getUseMockData()) {
        getMockMonthContext(deferred);
      } else {
        getApiMonthContext(deferred);
      }

      return deferred.promise;
    }

    function getApiMonthContext(deferred) {
      var $http = $injector.get('$http');
      var url = EnvConfigService.getApiBaseUrl() + API_ENDPOINTS.MONTH_CONTEXT;

      $http.get(url).then(function (response) {
        var data = response.data || {};
        deferred.resolve({
          months: data.months || [],
          defaultMonth: data.defaultMonth || ''
        });
      }).catch(function (error) {
        LoggingService.error('Error fetching month context', { error: error });
        deferred.reject(ErrorHandlingService.handleError(error, 'MONTH_CONTEXT'));
      });
    }

    function getMockMonthContext(deferred) {
      var $timeout = $injector.get('$timeout');
      $timeout(function () {
        if (!window.MonthContextMockData) {
          deferred.resolve({
            months: [],
            defaultMonth: ''
          });
          return;
        }
        deferred.resolve({
          months: window.MonthContextMockData.months || [],
          defaultMonth: window.MonthContextMockData.defaultMonth || ''
        });
      }, 300);
    }
  }
})();
