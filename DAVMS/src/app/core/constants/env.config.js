(function () {
  "use strict";

  const ENV_CONFIG = {
    apiBaseUrl: "https://api.example.com/davms", // Production base URL
    apiTimeoutMs: 10000,
    maxLookbackMonths: 24,
    useMockData: true, // Switch to false for production mode
    featureFlags: {
      showBreakdownChart: true,
      showKpiCards: true,
      enableLatencySimulationInMock: true
    },
    telemetry: {
      enabled: true,
      endpointUrl: "https://telemetry.example.com/collect",
      sampleRate: 1.0
    }
  };

  angular
    .module("app")
    .constant("ENV_CONFIG", ENV_CONFIG);
})();
