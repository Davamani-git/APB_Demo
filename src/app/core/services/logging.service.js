(function() {
  'use strict';

  angular
    .module('davmsMonthlySummary')
    .service('LoggingService', LoggingService);

  LoggingService.$inject = ['$injector', '$log'];

  function LoggingService($injector, $log) {
    var self = this;

    self.info = function(message, data) {
      $log.info(message, data || '');
      sendToBackend('info', message, data);
    };

    self.warn = function(message, data) {
      $log.warn(message, data || '');
      sendToBackend('warn', message, data);
    };

    self.error = function(message, data) {
      $log.error(message, data || '');
      sendToBackend('error', message, data);
    };

    function sendToBackend(level, message, data) {
      try {
        var $http = $injector.get('$http');
        var EnvConfigService = $injector.get('EnvConfigService');
        var env = EnvConfigService.getEnvConfig();
        if (!env.telemetryEnabled) {
          return;
        }
        $http.post('app/core/config/logging-placeholder', {
          level: level,
          message: message,
          data: data || null,
          timestamp: new Date().toISOString()
        }).catch(function() {
          // swallow errors
        });
      } catch (e) {
        // Swallow failures in logging
      }
    }
  }
})();
