(function () {
  'use strict';

  angular.module('apbDemo')
    .service('MonthlySummaryService', MonthlySummaryService);

  MonthlySummaryService.$inject = ['$injector', '$q', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

  function MonthlySummaryService($injector, $q, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    this.getSummary = function (month) {
      var deferred = $q.defer();

      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        var validationError = ErrorHandlingService.createClientValidationError('Invalid month format.');
        deferred.reject(validationError);
        return deferred.promise;
      }

      LoggingService.info('Requesting monthly summary', { month: month });

      if (EnvConfigService.getUseMockData()) {
        var mockData = window.MonthlySummaryMockData || {};
        var datasetKey = month;
        var payload = mockData[datasetKey] || mockData['default'];

        if (!payload) {
          var noDataError = ErrorHandlingService.createClientValidationError('No summary mock data available for selected month.');
          deferred.reject(noDataError);
          return deferred.promise;
        }

        var summaryModel = ModelFactory.createMonthlySummary(payload);
        deferred.resolve(summaryModel);
        return deferred.promise;
      }

      var $http = $injector.get('$http');
      var url = buildRequestUrl(month);
      var timeoutMs = EnvConfigService.getApiTimeoutMs();

      $http.get(url, { timeout: timeoutMs })
        .then(function (response) {
          try {
            validateResponse(response.data);
            var model = ModelFactory.createMonthlySummary(response.data);
            deferred.resolve(model);
          } catch (e) {
            var errorModel = ErrorHandlingService.handleError(e, 'MonthlySummaryService response validation failed');
            deferred.reject(errorModel);
          }
        })
        .catch(function (httpError) {
          var errorModel = ErrorHandlingService.handleError(httpError, 'MonthlySummaryService HTTP error');
          deferred.reject(errorModel);
        });

      return deferred.promise;
    };

    function buildRequestUrl(month) {
      var baseUrl = EnvConfigService.getApiBaseUrl() || '';
      return baseUrl + API_ENDPOINTS.SPEND_SUMMARY + '?month=' + encodeURIComponent(month);
    }

    function validateResponse(data) {
      if (!data) {
        throw new Error('Monthly summary response is empty.');
      }
      if (!data.month || !/^\d{4}-\d{2}$/.test(data.month)) {
        throw new Error('Monthly summary response has invalid month.');
      }
      if (typeof data.currency !== 'string') {
        throw new Error('Monthly summary response missing currency.');
      }
      if (typeof data.totalSpend !== 'number' || data.totalSpend < 0) {
        throw new Error('Monthly summary response has invalid totalSpend.');
      }
      if (typeof data.transactionCount !== 'number' || data.transactionCount < 0) {
        throw new Error('Monthly summary response has invalid transactionCount.');
      }
    }
  }
})();
