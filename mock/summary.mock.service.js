(function() {
  'use strict';

  SummaryMockService.$inject = ['$q', '$timeout', 'ENV_CONFIG', 'MonthlySummaryModel', 'ErrorModel', 'LoggingService'];

  function SummaryMockService($q, $timeout, ENV_CONFIG, MonthlySummaryModel, ErrorModel, LoggingService) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.ENV_CONFIG = ENV_CONFIG;
    this.MonthlySummaryModel = MonthlySummaryModel;
    this.ErrorModel = ErrorModel;
    this.LoggingService = LoggingService;
  }

  SummaryMockService.prototype.getMonthlySummary = function(month) {
    var self = this;
    var deferred = self.$q.defer();

    var datasets = window.DA_SUMMARY_MOCK_DATA || {};
    var datasetKey = month;
    var scenario = datasets[datasetKey] || datasets.default || {};

    self.$timeout(function() {
      if (scenario.timeout) {
        self.LoggingService.warn('Mock summary timeout simulated', { month: month });
        var timeoutError = new self.ErrorModel().fromResponse({
          code: '503',
          message: 'Spending summary request timed out.'
        });
        deferred.reject(timeoutError);
        return;
      }

      if (scenario.error) {
        var errModel = new self.ErrorModel().fromResponse({
          code: scenario.error.code,
          message: scenario.error.message,
          correlationId: scenario.error.correlationId
        });
        self.LoggingService.error('Mock summary error scenario triggered', { code: errModel.code });
        deferred.reject(errModel);
        return;
      }

      var model = new self.MonthlySummaryModel().fromResponse(scenario.success);
      deferred.resolve(model);
    }, scenario.delayMs || 500);

    return deferred.promise;
  };

  angular.module('app')
    .service('SummaryMockService', SummaryMockService);
})();
