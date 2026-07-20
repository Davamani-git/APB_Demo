(function () {
  'use strict';

  angular.module('apbDemo')
    .service('LoggingService', LoggingService);

  LoggingService.$inject = ['EnvConfigService'];

  function LoggingService(EnvConfigService) {
    this.info = function (message, context) {
      logToConsole('INFO', message, context);
    };

    this.warn = function (message, context) {
      logToConsole('WARN', message, context);
    };

    this.error = function (message, context) {
      logToConsole('ERROR', message, context);
    };

    function logToConsole(level, message, context) {
      var telemetry = EnvConfigService.getTelemetry();
      var payload = {
        level: level,
        message: message,
        context: context || {},
        timestamp: new Date().toISOString()
      };

      if (console && console.log) {
        console.log('[' + payload.level + '] ' + payload.timestamp + ' - ' + payload.message, payload.context);
      }

      if (telemetry && telemetry.enableClientLogging) {
        // Extension point: post to telemetry endpoint if needed
      }
    }
  }
})();
