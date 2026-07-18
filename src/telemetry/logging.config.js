(function() {
  'use strict';

  TelemetryLoggingConfig.$inject = [];

  function TelemetryLoggingConfig() {
    // Logging configuration for telemetry can be extended here when needed.
    // Kept minimal per LLD, root module wiring only.
  }

  angular.module('davms.app')
    .config(TelemetryLoggingConfig);
})();
