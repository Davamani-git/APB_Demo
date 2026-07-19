(function () {
  "use strict";

  angular.module("app")
    .constant("ENV_CONFIG", {
      apiBaseUrl: "https://api.example.com/spending-dashboard",
      apiTimeoutMs: 15000,
      maxLookbackMonths: 12,
      useMockData: true,
      featureFlags: {
        showAverageTransactionAmount: true,
        showMaxTransactionAmount: true
      },
      telemetry: {
        enableLogging: true,
        logLevel: "debug"
      }
    });
})();
