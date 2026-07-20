(function () {
  'use strict';

  angular
    .module('apbDemo')
    .service('MonthlySummaryService', MonthlySummaryService);

  MonthlySummaryService.$inject = ['$q', '$injector', 'EnvConfigService', 'ModelFactory', 'LoggingService', 'ErrorHandlingService', 'API_ENDPOINTS'];
  function MonthlySummaryService($q, $injector, EnvConfigService, ModelFactory, LoggingService, ErrorHandlingService, API_ENDPOINTS) {
    this.getSummary = getSummary;

    function getSummary(month) {
      var deferred = $q.defer();
      var monthPattern = /^\d{4}-\d{2}$/;
      if (!month || !monthPattern.test(month)) {
        deferred.reject(ErrorHandlingService.createClientValidationError('Please select a valid month.'));
        return deferred.promise;
      }

      if (EnvConfigService.getUseMockData()) {
        getMockSummary(month, deferred);
      } else {
        getApiSummary(month, deferred);
      }

      return deferred.promise;
    }

    function getApiSummary(month, deferred) {
      var $http = $injector.get('$http');
      var url = EnvConfigService.getApiBaseUrl() + API_ENDPOINTS.SPEND_SUMMARY + '?month=' + encodeURIComponent(month);

      $http.get(url).then(function (response) {
        var model = ModelFactory.createMonthlySummary(response.data);
        if (!model.isValid()) {
          deferred.reject(ErrorHandlingService.createClientValidationError('Invalid data received from summary service.'));
          return;
        }
        deferred.resolve(model);
      }).catch(function (error) {
        LoggingService.error('Error fetching monthly summary', { error: error });
        deferred.reject(ErrorHandlingService.handleError(error, 'MONTHLY_SUMMARY'));
      });
    }

    function getMockSummary(month, deferred) {
      var $timeout = $injector.get('$timeout');
      $timeout(function () {
        if (!window.MonthlySummaryMockData || !window.MonthlySummaryMockData[month]) {
          var emptyModel = ModelFactory.createMonthlySummary({
            month: month,
            currency: 'USD',
            totalSpend: 0,
            transactionCount: 0,
            isFinal: true,
            isCurrent: false,
            breakdownAvailable: false
          });
          deferred.resolve(emptyModel);
          return;
        }
        var raw = window.MonthlySummaryMockData[month];
        var model = ModelFactory.createMonthlySummary(raw);
        deferred.resolve(model);
      }, 500);
    }
  }
})();
