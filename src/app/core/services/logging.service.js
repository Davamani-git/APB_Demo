(function () {
  'use strict';

  angular
    .module('rbApp.core')
    .service('LoggingService', LoggingService);

  LoggingService.$inject = ['$log', 'TelemetryService'];

  function LoggingService($log, TelemetryService) {
    this.debug = function (message, meta) {
      $log.debug(message, meta || {});
    };

    this.info = function (message, meta) {
      $log.info(message, meta || {});
      TelemetryService.emit('INFO', message, meta || {});
    };

    this.warn = function (message, meta) {
      $log.warn(message, meta || {});
      TelemetryService.emit('WARN', message, meta || {});
    };

    this.error = function (message, meta) {
      $log.error(message, meta || {});
      TelemetryService.emit('ERROR', message, meta || {});
    };
  }
})();
