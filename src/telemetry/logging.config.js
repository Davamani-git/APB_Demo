(function () {
  'use strict';

  TelemetryLoggingConfig.$inject = [];

  function TelemetryLoggingConfig() {
    // In this implementation, logging endpoints are handled by ConfigService.
    // This config block can be used to adjust $logProvider if needed.
  }

  angular.module('davms.app').config(TelemetryLoggingConfig);
})();
