(function() {
  'use strict';

  TrendsMockService.$inject = ['$q', '$timeout', 'ENV_CONFIG', 'SixMonthTrendModel', 'ErrorModel', 'LoggingService'];

  function TrendsMockService($q, $timeout, ENV_CONFIG, SixMonthTrendModel, ErrorModel, LoggingService) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.ENV_CONFIG = ENV_CONFIG;
    this.SixMonthTrendModel = SixMonthTrendModel;
    this.ErrorModel = ErrorModel;
    this.LoggingService = LoggingService;
  }

  TrendsMockService.prototype.getSixMonthTrends = function() {
    var self = this;
    var deferred = self.$q.defer();

    var scenario = window.DA_TRENDS_MOCK_DATA || {};

    self.$timeout(function() {
      if (scenario.timeout) {
        self.LoggingService.warn('Mock trends timeout simulated', {});
        var timeoutError = new self.ErrorModel().fromResponse({
          code: '503',
          message: 'Spending trends request timed out.'
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
        self.LoggingService.error('Mock trends error scenario triggered', { code: errModel.code });
        deferred.reject(errModel);
        return;
      }

      var model = new self.SixMonthTrendModel().fromResponse(scenario.success);
      deferred.resolve(model);
    }, scenario.delayMs || 500);

    return deferred.promise;
  };

  angular.module('app')
    .service('TrendsMockService', TrendsMockService);
})();
