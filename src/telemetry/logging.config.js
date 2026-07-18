(function() {
  'use strict';

  TelemetryLoggingConfig.$inject = [];

  function TelemetryLoggingConfig() {
    // In a full implementation, this would configure logging providers for davms.app.
    // For this epic, LoggingService handles telemetry wiring at the feature level.
  }

  angular.module('davms.app')
    .config(TelemetryLoggingConfig);
})();
