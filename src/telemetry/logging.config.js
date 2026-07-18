(function() {
  'use strict';

  TelemetryLoggingConfig.$inject = [];

  function TelemetryLoggingConfig() {
    // Logging configuration for davms.app.
    // For this implementation, detailed endpoint wiring is handled by ConfigService and LoggingService.
  }

  angular.module('davms.app').config(TelemetryLoggingConfig);
})();
