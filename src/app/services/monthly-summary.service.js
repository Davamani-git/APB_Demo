(function () {
  'use strict';

  angular.module('apbDemo')
    .service('MonthlySummaryService', MonthlySummaryService);

  MonthlySummaryService.$inject = ['$q', '$injector', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

  function MonthlySummaryService($q, $injector, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    var service = this;

    service.getSummary = getSummary;

    function getSummary(month) {
      var deferred = $q.defer();

      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        var errorModel = ErrorHandlingService.createClientValidationError('Invalid month format.');
        deferred.reject(errorModel);
        return deferred.promise;
      }

      if (EnvConfigService.getUseMockData()) {
        LoggingService.info('Using mock data for MonthlySummaryService', { month: month });
        var mockData = window.MonthlySummaryMockData || {};
        var dataset = mockData[month];
        if (!dataset) {
          dataset = mockData['default'];
        }
        var summaryModel = ModelFactory.createMonthlySummary(dataset);
        deferred.resolve(summaryModel);
        return deferred.promise;
      }

      var $http = $injector.get('$http');
      var url = buildRequestUrl(month);
      LoggingService.info('Requesting monthly summary', { url: url });
      $http.get(url).then(function (response) {
        try {
          validateResponse(response.data);
          var summaryModel = ModelFactory.createMonthlySummary(response.data);
          deferred.resolve(summaryModel);
        } catch (validationError) {
          var errorModel = ErrorHandlingService.createClientValidationError(validationError.message);
          deferred.reject(errorModel);
        }
      }, function (httpError) {
        var errorModel = ErrorHandlingService.handleError(httpError, 'MonthlySummaryService.getSummary');
        deferred.reject(errorModel);
      });

      return deferred.promise;
    }

    function buildRequestUrl(month) {
      var baseUrl = EnvConfigService.getApiBaseUrl();
      return baseUrl + API_ENDPOINTS.SPEND_SUMMARY + '?month=' + encodeURIComponent(month);
    }

    function validateResponse(data) {
      if (!data) {
        throw new Error('Summary response is empty');
      }
      if (!data.month || !/^\d{4}-\d{2}$/.test(data.month)) {
        throw new Error('Summary month is invalid');
      }
      if (typeof data.totalSpend !== 'number' || data.totalSpend < 0) {
        throw new Error('Summary totalSpend is invalid');
      }
      if (typeof data.transactionCount !== 'number' || data.transactionCount < 0) {
        throw new Error('Summary transactionCount is invalid');
      }
    }
  }
})();
