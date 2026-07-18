(function () {
  "use strict";

  run.$inject = [
    "telemetryService",
    "featureFlagsService"
  ];

  function run(telemetryService, featureFlagsService) {
    // Initialize telemetry context
    telemetryService.initialize({
      appName: "DAVMS Monthly Spending Summary",
      appVersion: "1.0.0",
      environment: featureFlagsService.getEnvironmentName()
    });

    // Preload feature flags (no API calls here, uses env config only)
    featureFlagsService.loadStaticFlags();
  }

  angular
    .module("app")
    .run(run);
})();
