(function () {
  'use strict';

  angular
    .module('apbDemo')
    .service('BreakdownService', BreakdownService);

  BreakdownService.$inject = ['$q', '$injector', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];
  function BreakdownService($q, $injector, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    this.getBreakdown = getBreakdown;

    function getBreakdown(month) {
      var deferred = $q.defer();
      var monthPattern = /^\d{4}-\d{2}$/;
      if (!month || !monthPattern.test(month)) {
        deferred.reject(ErrorHandlingService.createClientValidationError('Please select a valid month.'));
        return deferred.promise;
      }

      if (EnvConfigService.getUseMockData()) {
        getMockBreakdown(month, deferred);
      } else {
        getApiBreakdown(month, deferred);
      }

      return deferred.promise;
    }

    function getApiBreakdown(month, deferred) {
      var $http = $injector.get('$http');
      var url = EnvConfigService.getApiBaseUrl() + API_ENDPOINTS.SPEND_BREAKDOWN + '?month=' + encodeURIComponent(month);

      $http.get(url).then(function (response) {
        var model = ModelFactory.createBreakdown(response.data);
        deferred.resolve(model);
      }).catch(function (error) {
        LoggingService.error('Error fetching breakdown', { error: error });
        deferred.reject(ErrorHandlingService.handleError(error, 'BREAKDOWN'));
      });
    }

    function getMockBreakdown(month, deferred) {
      var $timeout = $injector.get('$timeout');
      $timeout(function () {
        var dataset = null;
        if (window.BreakdownMockData && window.BreakdownMockData[month]) {
          dataset = window.BreakdownMockData[month];
        } else if (window.BreakdownMockData && window.BreakdownMockData['default']) {
          dataset = window.BreakdownMockData['default'];
        }
        var model = ModelFactory.createBreakdown(dataset || { month: month, categories: [] });
        deferred.resolve(model);
      }, 600);
    }
  }
})();
