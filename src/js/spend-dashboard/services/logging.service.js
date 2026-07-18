(function() {
  'use strict';

  LoggingService.$inject = ['$log', '$http', 'ConfigService'];

  function LoggingService($log, $http, ConfigService) {
    function sendRemote(level, message, context) {
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
      // Fire-and-forget telemetry call; errors are not propagated to UI.
      $http.post(endpoint + '/logs', payload).catch(function() {});
    }

    this.info = function(message, context) {
      $log.info(message, context || {});
      sendRemote('INFO', message, context);
    };

    this.warn = function(message, context) {
      $log.warn(message, context || {});
      sendRemote('WARN', message, context);
    };

    this.error = function(message, context) {
      $log.error(message, context || {});
      sendRemote('ERROR', message, context);
    };
  }

  angular.module('davms.spendDashboard')
    .service('LoggingService', LoggingService);
})();
