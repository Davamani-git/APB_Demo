(function () {
  'use strict';

  angular
    .module('apbDemo')
    .service('LoggingService', LoggingService);

  LoggingService.$inject = ['EnvConfigService', '$window'];
  function LoggingService(EnvConfigService, $window) {
    this.info = info;
    this.warn = warn;
    this.error = error;

    function getLogLevel() {
      try {
        var telemetry = EnvConfigService.getTelemetry();
        return telemetry.logLevel || 'info';
      } catch (e) {
        return 'info';
      }
    }

    function shouldLog(level) {
      var order = ['debug', 'info', 'warn', 'error'];
      var currentLevel = getLogLevel();
      return order.indexOf(level) >= order.indexOf(currentLevel);
    }

    function info(message, context) {
      if (shouldLog('info')) {
        $window.console.info('[INFO] ' + message, context || {});
      }
    }

    function warn(message, context) {
      if (shouldLog('warn')) {
        $window.console.warn('[WARN] ' + message, context || {});
      }
    }

    function error(message, context) {
      if (shouldLog('error')) {
        $window.console.error('[ERROR] ' + message, context || {});
      }
    }
  }
})();
