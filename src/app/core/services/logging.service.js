(function () {
  'use strict';

  LoggingService.$inject = ['$log', '$window', '$injector'];

  angular.module('app')
    .service('LoggingService', LoggingService);

  function LoggingService($log, $window, $injector) {
    var self = this;

    self.info = function (message, context) {
      $log.info(message, context || {});
    };

    self.warn = function (message, context) {
      $log.warn(message, context || {});
    };

    self.error = function (message, context) {
      $log.error(message, context || {});
      sendTelemetry('error', message, context);
    };

    self.debug = function (message, context) {
      $log.debug(message, context || {});
    };

    function sendTelemetry(level, message, context) {
      var EnvConfigService = $injector.get('EnvConfigService');
      var telemetry = EnvConfigService.getTelemetryConfig();
      if (!telemetry.enabled) {
        return;
      }
      if (Math.random() > telemetry.samplingRate) {
        return;
      }
      try {
        var payload = {
          level: level,
          message: message,
          context: context || {},
          timestampUtc: new Date().toISOString()
        };
        // Lazy $http resolution via $injector to avoid hard dependency
        var $http = $injector.get('$http');
        $http.post(telemetry.endpoint, payload);
      } catch (e) {
        $log.warn('Telemetry dispatch failed', e);
      }
    }
  }
})();
