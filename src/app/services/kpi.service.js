(function () {
  'use strict';

  angular
    .module('apbDemo')
    .service('KpiService', KpiService);

  KpiService.$inject = ['$q', '$injector', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];
  function KpiService($q, $injector, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    this.getKpis = getKpis;

    function getKpis(month) {
      var deferred = $q.defer();
      var monthPattern = /^\d{4}-\d{2}$/;
      if (!month || !monthPattern.test(month)) {
        deferred.reject(ErrorHandlingService.createClientValidationError('Please select a valid month.'));
        return deferred.promise;
      }

      if (EnvConfigService.getUseMockData()) {
        getMockKpis(month, deferred);
      } else {
        getApiKpis(month, deferred);
      }

      return deferred.promise;
    }

    function getApiKpis(month, deferred) {
      var $http = $injector.get('$http');
      var url = EnvConfigService.getApiBaseUrl() + API_ENDPOINTS.SPEND_KPIS + '?month=' + encodeURIComponent(month);

      $http.get(url).then(function (response) {
        var list = ModelFactory.createKpiList(response.data);
        deferred.resolve(list);
      }).catch(function (error) {
        LoggingService.error('Error fetching KPIs', { error: error });
        deferred.reject(ErrorHandlingService.handleError(error, 'KPI'));
      });
    }

    function getMockKpis(month, deferred) {
      var $timeout = $injector.get('$timeout');
      $timeout(function () {
        var dataset = null;
        if (window.KpiMockData && window.KpiMockData[month]) {
          dataset = window.KpiMockData[month];
        } else if (window.KpiMockData && window.KpiMockData['default']) {
          dataset = window.KpiMockData['default'];
        }
        var list = ModelFactory.createKpiList(dataset || []);
        deferred.resolve(list);
      }, 400);
    }
  }
})();
