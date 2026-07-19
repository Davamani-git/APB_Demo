(function () {
  'use strict';

  SpendSummaryService.$inject = ['$q', 'EnvConfigService', 'SpendSummaryApiService', 'SpendSummaryMockService', 'SpendSummaryModelFactory', 'LoggingService'];

  angular.module('app')
    .service('SpendSummaryService', SpendSummaryService);

  function SpendSummaryService($q, EnvConfigService, SpendSummaryApiService, SpendSummaryMockService, SpendSummaryModelFactory, LoggingService) {
    var self = this;

    self.getMonthlySummary = function (month) {
      var useMock = EnvConfigService.useMockData();
      var promise = useMock ? SpendSummaryMockService.getMonthlySummary(month) : SpendSummaryApiService.getMonthlySummary(month);

      return promise.then(function (data) {
        var model = SpendSummaryModelFactory.createSpendSummary();
        model.month = data.month;
        model.customerId = data.customerId;
        model.metadata = data.metadata;
        model.consolidatedTotals = data.consolidatedTotals;
        model.breakdown = data.breakdown;
        model.cardSummaries = data.cardSummaries;

        var validationErrors = model.validate();
        if (validationErrors.length > 0) {
          LoggingService.warn('SpendSummaryModel validation errors', validationErrors);
        }
        return model;
      }).catch(function (error) {
        LoggingService.error('Failed to load monthly spend summary', error);
        return $q.reject(error);
      });
    };
  }
})();
