(function () {
  'use strict';

  angular.module('apbDemo')
    .service('MonthContextService', MonthContextService);

  MonthContextService.$inject = ['$q', '$injector', 'EnvConfigService', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

  function MonthContextService($q, $injector, EnvConfigService, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    var service = this;

    service.getMonthContext = getMonthContext;
    service.isMonthSelectable = isMonthSelectable;

    function getMonthContext() {
      var deferred = $q.defer();

      if (EnvConfigService.getUseMockData()) {
        LoggingService.info('Using mock month context');
        var months = [
          { month: '2026-07', label: 'July 2026', isFinal: true, isCurrent: false, billingCycleId: '2026-07-01' },
          { month: '2026-06', label: 'June 2026', isFinal: true, isCurrent: false, billingCycleId: '2026-06-01' },
          { month: '2026-05', label: 'May 2026', isFinal: true, isCurrent: false, billingCycleId: '2026-05-01' }
        ];
        deferred.resolve({ months: months, defaultMonth: '2026-07' });
        return deferred.promise;
      }

      var $http = $injector.get('$http');
      var baseUrl = EnvConfigService.getApiBaseUrl();
      var url = baseUrl + API_ENDPOINTS.MONTH_CONTEXT;

      $http.get(url).then(function (response) {
        var data = response.data || {};
        if (!data.months || !angular.isArray(data.months) || !data.defaultMonth) {
          var errorModel = ErrorHandlingService.createClientValidationError('Invalid month context response');
          deferred.reject(errorModel);
          return;
        }
        deferred.resolve({ months: data.months, defaultMonth: data.defaultMonth });
      }, function (httpError) {
        var errorModel = ErrorHandlingService.handleError(httpError, 'MonthContextService.getMonthContext');
        deferred.reject(errorModel);
      });

      return deferred.promise;
    }

    function isMonthSelectable(month, monthContext) {
      if (!month || !monthContext || !monthContext.months) {
        return false;
      }
      var selectable = monthContext.months.some(function (item) {
        return item.month === month;
      });
      return selectable;
    }
  }
})();
