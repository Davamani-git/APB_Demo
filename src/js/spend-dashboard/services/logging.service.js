(function () {
  'use strict';

  LoggingService.$inject = ['$log', '$http', 'ConfigService'];

  function LoggingService($log, $http, ConfigService) {
    var self = this;

    function sendTelemetry(level, message, context) {
      ConfigService.ensureLoaded().then(function () {
        var endpoint = ConfigService.getTelemetryEndpoint();
        if (!endpoint) {
          return;
        }
        var payload = {
          level: level,
          message: message,
          context: context || {},
          timestamp: new Date().toISOString()
        };
        $http.post(endpoint + '/logs', payload).catch(function () {
          // Swallow telemetry errors to avoid impacting user experience.
        });
      });
    }

    self.info = function (message, context) {
      $log.info(message, context || {});
      sendTelemetry('INFO', message, context);
    };

    self.warn = function (message, context) {
      $log.warn(message, context || {});
      sendTelemetry('WARN', message, context);
    };

    self.error = function (message, context) {
      $log.error(message, context || {});
      sendTelemetry('ERROR', message, context);
    };
  }

  angular.module('davms.spendDashboard')
    .service('LoggingService', LoggingService);
})();
