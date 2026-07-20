(function () {
  'use strict';

  angular.module('apbDemo')
    .service('KpiService', KpiService);

  KpiService.$inject = ['$injector', '$q', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

  function KpiService($injector, $q, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    this.getKpis = function (month) {
      var deferred = $q.defer();

      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        var validationError = ErrorHandlingService.createClientValidationError('Invalid month format.');
        deferred.reject(validationError);
        return deferred.promise;
      }

      LoggingService.info('Requesting KPIs', { month: month });

      if (EnvConfigService.getUseMockData()) {
        var mockData = window.KpiMockData || {};
        var datasetKey = month;
        var payload = mockData[datasetKey] || mockData['default'];

        if (!payload || !angular.isArray(payload)) {
          var noDataError = ErrorHandlingService.createClientValidationError('No KPI mock data available for selected month.');
          deferred.reject(noDataError);
          return deferred.promise;
        }

        var kpiModels = ModelFactory.createKpiList(payload);
        deferred.resolve(kpiModels);
        return deferred.promise;
      }

      var $http = $injector.get('$http');
      var baseUrl = EnvConfigService.getApiBaseUrl() || '';
      var url = baseUrl + API_ENDPOINTS.SPEND_KPIS + '?month=' + encodeURIComponent(month);
      var timeoutMs = EnvConfigService.getApiTimeoutMs();

      $http.get(url, { timeout: timeoutMs })
        .then(function (response) {
          try {
            var data = response.data || [];
            if (!angular.isArray(data)) {
              throw new Error('KPIs response must be an array.');
            }
            var models = ModelFactory.createKpiList(data);
            deferred.resolve(models);
          } catch (e) {
            var errorModel = ErrorHandlingService.handleError(e, 'KpiService response validation failed');
            deferred.reject(errorModel);
          }
        })
        .catch(function (httpError) {
          var errorModel = ErrorHandlingService.handleError(httpError, 'KpiService HTTP error');
          deferred.reject(errorModel);
        });

      return deferred.promise;
    };
  }
})();
