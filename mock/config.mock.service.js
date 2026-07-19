(function() {
  'use strict';

  ConfigMockService.$inject = ['$q', '$timeout', 'ENV_CONFIG', 'ConfigModel', 'ErrorModel', 'LoggingService'];

  function ConfigMockService($q, $timeout, ENV_CONFIG, ConfigModel, ErrorModel, LoggingService) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.ENV_CONFIG = ENV_CONFIG;
    this.ConfigModel = ConfigModel;
    this.ErrorModel = ErrorModel;
    this.LoggingService = LoggingService;
  }

  ConfigMockService.prototype.getConfig = function() {
    var self = this;
    var deferred = self.$q.defer();

    var scenario = window.DA_CONFIG_MOCK_DATA || {};

    self.$timeout(function() {
      if (scenario.timeout) {
        self.LoggingService.warn('Mock config timeout simulated', {});
        var timeoutError = new self.ErrorModel().fromResponse({
          code: '503',
          message: 'Configuration request timed out.'
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
        self.LoggingService.error('Mock config error scenario triggered', { code: errModel.code });
        deferred.reject(errModel);
        return;
      }

      var model = new self.ConfigModel().fromResponse(scenario.success);
      deferred.resolve(model);
    }, scenario.delayMs || 300);

    return deferred.promise;
  };

  angular.module('app')
    .service('ConfigMockService', ConfigMockService);
})();
