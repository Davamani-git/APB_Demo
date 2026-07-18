(function() {
  'use strict';

  LoggingService.$inject = ['$log', '$http', 'ConfigService'];

  function LoggingService($log, $http, ConfigService) {
    var service = this;

    service.info = function(message, context) {
      $log.info('[INFO]', message, context || {});
      sendToTelemetry('info', message, context);
    };

    service.warn = function(message, context) {
      $log.warn('[WARN]', message, context || {});
      sendToTelemetry('warn', message, context);
    };

    service.error = function(message, context) {
      $log.error('[ERROR]', message, context || {});
      sendToTelemetry('error', message, context);
    };

    function sendToTelemetry(level, message, context) {
      if (ConfigService.useMockData()) {
        return;
      }

      var endpoint = ConfigService.getTelemetryEndpoint();
      if (!endpoint) {
        return;
      }

      var payload = {
        level: level,
        message: message,
        context: context,
        timestamp: new Date().toISOString(),
        source: 'davms-client'
      };

      $http.post(endpoint + '/logs', payload).catch(function(err) {
        $log.warn('Failed to send telemetry', err);
      });
    }

    return service;
  }

  angular.module('davms.spendDashboard')
    .service('LoggingService', LoggingService);
})();