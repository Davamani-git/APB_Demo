(function () {
  'use strict';

  angular.module('apbDemo')
    .service('BreakdownService', BreakdownService);

  BreakdownService.$inject = ['$injector', '$q', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];

  function BreakdownService($injector, $q, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    this.getBreakdown = function (month) {
      var deferred = $q.defer();

      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        var validationError = ErrorHandlingService.createClientValidationError('Invalid month format.');
        deferred.reject(validationError);
        return deferred.promise;
      }

      LoggingService.info('Requesting breakdown', { month: month });

      if (EnvConfigService.getUseMockData()) {
        var mockData = window.BreakdownMockData || {};
        var datasetKey = month;
        var payload = mockData[datasetKey] || mockData['default'];

        if (!payload) {
          var noDataError = ErrorHandlingService.createClientValidationError('No breakdown mock data available for selected month.');
          deferred.reject(noDataError);
          return deferred.promise;
        }

        var breakdownModel = ModelFactory.createBreakdown(payload);
        deferred.resolve(breakdownModel);
        return deferred.promise;
      }

      var $http = $injector.get('$http');
      var baseUrl = EnvConfigService.getApiBaseUrl() || '';
      var url = baseUrl + API_ENDPOINTS.SPEND_BREAKDOWN + '?month=' + encodeURIComponent(month);
      var timeoutMs = EnvConfigService.getApiTimeoutMs();

      $http.get(url, { timeout: timeoutMs })
        .then(function (response) {
          try {
            var data = response.data || {};
            validateResponse(data);
            var model = ModelFactory.createBreakdown(data);
            deferred.resolve(model);
          } catch (e) {
            var errorModel = ErrorHandlingService.handleError(e, 'BreakdownService response validation failed');
            deferred.reject(errorModel);
          }
        })
        .catch(function (httpError) {
          var errorModel = ErrorHandlingService.handleError(httpError, 'BreakdownService HTTP error');
          deferred.reject(errorModel);
        });

      return deferred.promise;
    };

    function validateResponse(data) {
      if (!data) {
        throw new Error('Breakdown response is empty.');
      }
      if (!data.month || !/^\d{4}-\d{2}$/.test(data.month)) {
        throw new Error('Breakdown response has invalid month.');
      }
      if (!angular.isArray(data.categories)) {
        throw new Error('Breakdown response categories must be an array.');
      }
      var maxCategories = EnvConfigService.getFeatureFlags().maxCategories || 10;
      if (data.categories.length > maxCategories) {
        data.categories = data.categories.slice(0, maxCategories);
      }
      angular.forEach(data.categories, function (category) {
        if (typeof category.id !== 'string') {
          throw new Error('Category id is required.');
        }
        if (typeof category.label !== 'string') {
          throw new Error('Category label is required.');
        }
        if (typeof category.amount !== 'number' || category.amount < 0) {
          throw new Error('Category amount must be a non-negative number.');
        }
        if (typeof category.percentage !== 'number' || category.percentage < 0) {
          throw new Error('Category percentage must be a non-negative number.');
        }
      });
    }
  }
})();
