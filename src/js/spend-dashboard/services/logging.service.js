(function() {
  'use strict';

  LoggingService.$inject = ['$log', '$http', 'ConfigService'];

  function LoggingService($log, $http, ConfigService) {
    function sendTelemetry(level, message, context) {
      var endpoint = ConfigService.getApiBaseUrl().replace(/\/davms$/, '') + '/telemetry/logs';
      var payload = {
        level: level,
        message: message,
        context: context || {},
        timestamp: new Date().toISOString()
      };
      // Fire-and-forget; ignore errors
      $http.post(endpoint, payload).catch(function() {});
    }

    this.info = function(message, context) {
      $log.info(message, context || {});
      sendTelemetry('INFO', message, context);
    };

    this.warn = function(message, context) {
      $log.warn(message, context || {});
      sendTelemetry('WARN', message, context);
    };

    this.error = function(message, context) {
      $log.error(message, context || {});
      sendTelemetry('ERROR', message, context);
    };
  }

  angular.module('davms.spendDashboard')
    .service('LoggingService', LoggingService);
})();
