(function() {
  'use strict';

  function LoggingService($log, $http, ConfigService) {
    var service = {
      info: info,
      warn: warn,
      error: error
    };

    return service;

    function info(message, context) {
      $log.info(message, context || {});
      sendRemote('info', message, context);
    }

    function warn(message, context) {
      $log.warn(message, context || {});
      sendRemote('warn', message, context);
    }

    function error(message, context) {
      $log.error(message, context || {});
      sendRemote('error', message, context);
    }

    function sendRemote(level, message, context) {
      var useMockData = ConfigService.useMockData();
      if (useMockData) {
        return;
      }

      var telemetryEndpoint = ConfigService.getTelemetryEndpoint();
      if (!telemetryEndpoint) {
        return;
      }

      try {
        $http.post(telemetryEndpoint + '/logs', {
          level: level,
          message: message,
          context: context || {},
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        $log.warn('Failed to send remote log', e);
      }
    }
  }

  LoggingService.$inject = ['$log', '$http', 'ConfigService'];

  angular.module('davms.spendDashboard')
    .service('LoggingService', LoggingService);
})();
