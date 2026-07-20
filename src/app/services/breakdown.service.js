(function () {
  'use strict';

  angular.module('apbDemo')
    .service('BreakdownService', BreakdownService);

  BreakdownService.$inject = ['$q', '$injector', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

  function BreakdownService($q, $injector, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    var service = this;

    service.getBreakdown = getBreakdown;

    function getBreakdown(month) {
      var deferred = $q.defer();

      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        var errorModel = ErrorHandlingService.createClientValidationError('Invalid month format.');
        deferred.reject(errorModel);
        return deferred.promise;
      }

      if (EnvConfigService.getUseMockData()) {
        LoggingService.info('Using mock data for BreakdownService', { month: month });
        var mockData = window.BreakdownMockData || {};
        var dataset = mockData[month];
        if (!dataset) {
          dataset = mockData['default'];
        }
        var breakdownModel = ModelFactory.createBreakdown(dataset);
        deferred.resolve(breakdownModel);
        return deferred.promise;
      }

      var $http = $injector.get('$http');
      var url = buildRequestUrl(month);
      LoggingService.info('Requesting breakdown', { url: url });
      $http.get(url).then(function (response) {
        try {
          var breakdownModel = ModelFactory.createBreakdown(response.data || {});
          deferred.resolve(breakdownModel);
        } catch (validationError) {
          var errorModel = ErrorHandlingService.createClientValidationError(validationError.message);
          deferred.reject(errorModel);
        }
      }, function (httpError) {
        var errorModel = ErrorHandlingService.handleError(httpError, 'BreakdownService.getBreakdown');
        deferred.reject(errorModel);
      });

      return deferred.promise;
    }

    function buildRequestUrl(month) {
      var baseUrl = EnvConfigService.getApiBaseUrl();
      return baseUrl + API_ENDPOINTS.SPEND_BREAKDOWN + '?month=' + encodeURIComponent(month);
    }
  }
})();
