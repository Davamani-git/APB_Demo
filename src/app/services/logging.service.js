(function () {
  'use strict';

  angular.module('apbDemo')
    .service('LoggingService', LoggingService);

  LoggingService.$inject = ['EnvConfigService'];

  function LoggingService(EnvConfigService) {
    var service = this;

    service.info = info;
    service.warn = warn;
    service.error = error;

    function info(message, context) {
      logToConsole('info', message, context);
    }

    function warn(message, context) {
      logToConsole('warn', message, context);
    }

    function error(message, context) {
      logToConsole('error', message, context);
    }

    function logToConsole(level, message, context) {
      var featureFlags;
      try {
        featureFlags = EnvConfigService.getFeatureFlags();
      } catch (e) {
        featureFlags = {};
      }
      var enableConsoleLogging = !featureFlags || featureFlags.enableConsoleLogging !== false;
      if (!enableConsoleLogging) {
        return;
      }
      var payload = {
        level: level,
        message: message,
        context: context || {},
        timestamp: new Date().toISOString()
      };
      if (level === 'error' && console && console.error) {
        console.error(payload);
      } else if (level === 'warn' && console && console.warn) {
        console.warn(payload);
      } else if (console && console.log) {
        console.log(payload);
      }
    }
  }
})();
