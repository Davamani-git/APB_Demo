(function () {
  'use strict';

  angular.module('apbDemo')
    .service('KpiService', KpiService);

  KpiService.$inject = ['$q', '$injector', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

  function KpiService($q, $injector, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    var service = this;

    service.getKpis = getKpis;

    function getKpis(month) {
      var deferred = $q.defer();

      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        var errorModel = ErrorHandlingService.createClientValidationError('Invalid month format.');
        deferred.reject(errorModel);
        return deferred.promise;
      }

      if (EnvConfigService.getUseMockData()) {
        LoggingService.info('Using mock data for KpiService', { month: month });
        var mockData = window.KpiMockData || {};
        var dataset = mockData[month];
        if (!dataset) {
          dataset = mockData['default'];
        }
        var kpiModels = ModelFactory.createKpiList(dataset);
        deferred.resolve(kpiModels);
        return deferred.promise;
      }

      var $http = $injector.get('$http');
      var url = buildRequestUrl(month);
      LoggingService.info('Requesting KPIs', { url: url });
      $http.get(url).then(function (response) {
        try {
          var kpiModels = ModelFactory.createKpiList(response.data || []);
          deferred.resolve(kpiModels);
        } catch (validationError) {
          var errorModel = ErrorHandlingService.createClientValidationError(validationError.message);
          deferred.reject(errorModel);
        }
      }, function (httpError) {
        var errorModel = ErrorHandlingService.handleError(httpError, 'KpiService.getKpis');
        deferred.reject(errorModel);
      });

      return deferred.promise;
    }

    function buildRequestUrl(month) {
      var baseUrl = EnvConfigService.getApiBaseUrl();
      return baseUrl + API_ENDPOINTS.SPEND_KPIS + '?month=' + encodeURIComponent(month);
    }
  }
})();
